import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('knowledge/.vitepress/dist')
const base = '/knowledge-hub/'
const origin = 'https://local.invalid'
const pages = new Map()
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name)
    if (item.isDirectory()) await walk(file)
    else if (file.endsWith('.html')) pages.set(file, await readFile(file, 'utf8'))
  }
}
await walk(root)
const errors = []
let count = 0
for (const [file, html] of pages) {
  const pageUrl = new URL(base + path.relative(root, file).split(path.sep).join('/'), origin)
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&')
    const target = new URL(value, pageUrl)
    if (target.origin !== origin) continue
    if (!target.pathname.startsWith(base)) {
      errors.push(`${pageUrl.pathname}: 路径脱离 base ${value}`)
      continue
    }
    let relative = decodeURIComponent(target.pathname.slice(base.length))
    if (!relative || relative.endsWith('/')) relative += 'index.html'
    const dest = path.resolve(root, relative)
    if (!dest.startsWith(root + path.sep)) {
      errors.push(`${pageUrl.pathname}: 路径超出产物目录 ${value}`)
      continue
    }
    count++
    try {
      await access(dest)
      if (target.hash && pages.has(dest)) {
        const id = decodeURIComponent(target.hash.slice(1))
        if (!pages.get(dest).includes(`id="${id}"`)) errors.push(`${pageUrl.pathname}: 锚点不存在 ${value}`)
      }
    } catch { errors.push(`${pageUrl.pathname}: 产物不存在 ${value}`) }
  }
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else console.log(`通过：${pages.size} 个 HTML，${count} 处本地资源/页面/锚点引用，base ${base}`)
