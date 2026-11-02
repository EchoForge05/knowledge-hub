import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const files = []
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const file = path.join(dir, entry.name)
    if (file === path.join(root, 'inbox', 'local')) continue
    if (entry.isDirectory()) await walk(file)
    else if (file.endsWith('.md')) files.push(file)
  }
}
await walk(root)
const errors = []
let links = 0
for (const file of files) {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(await readFile(file))
  const content = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/^(`{3,}|~{3,}).*\r?\n[\s\S]*?^\1\s*$/gm, '')
  if (!text.startsWith('---') && (content.match(/^# /gm) || []).length !== 1) {
    errors.push(`${file}: 应有一个一级标题`)
  }
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, '').split('#')[0]
    if (!target || /^(?:[a-z]+:|\/)/i.test(target)) continue
    links++
    try { await access(path.resolve(path.dirname(file), decodeURIComponent(target))) }
    catch { errors.push(`${file}: 链接不存在 ${target}`) }
  }
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else console.log(`通过：${files.length} 份 Markdown，${links} 处本地文件链接（不含锚点与外链）；产物链接与锚点另用 check:site 检查。`)
