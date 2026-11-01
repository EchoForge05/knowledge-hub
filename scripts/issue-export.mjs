import { mkdir, realpath, writeFile, lstat } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateIssue } from './issue-intake.mjs'

const repo = 'EchoForge05/knowledge-hub'
const inside = (parent, file) => file.startsWith(parent + path.sep)

export function issueUrl(number) {
  if (!Number.isSafeInteger(number) || number < 1) throw new Error('Issue编号必须为正整数。')
  return `https://api.github.com/repos/${repo}/issues/${number}`
}

export async function fetchIssue(number, fetchImpl = fetch) {
  const url = issueUrl(number)
  let response
  try {
    response = await fetchImpl(url, { method: 'GET', redirect: 'error',
      signal: AbortSignal.timeout(30000), headers: { Accept: 'application/vnd.github+json',
        'User-Agent': 'knowledge-hub-manual-intake' } })
  } catch { throw new Error('GitHub请求失败或超时，未重试。') }
  if (!response.ok) throw new Error(`GitHub返回HTTP ${response.status}，未保存或重试。`)
  // 限制实际读取字节数，不能只信Content-Length。
  const reader = response.body?.getReader()
  if (!reader) throw new Error('GitHub响应为空。')
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 128 * 1024) throw new Error('GitHub响应超过128KiB，未保存。')
      chunks.push(Buffer.from(value))
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock() }
  let data
  try { data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))) }
  catch { throw new Error('GitHub响应不是有效UTF-8 JSON。') }
  if (!data || data.pull_request || data.number !== number ||
      data.repository_url !== `https://api.github.com/repos/${repo}` || data.state !== 'open') {
    throw new Error('只接受既定仓库的开放Issue，不接受PR或其他来源。')
  }
  const issue = { number: data.number, url: data.html_url, state: 'OPEN',
    author: { login: data.user?.login }, title: data.title, body: data.body }
  const validated = validateIssue(issue)
  return { issue, digest: validated.digest }
}

export async function saveIssue(root, snapshot) {
  root = await realpath(root)
  // 先逐层核对父目录，再建子目录，避免链接将写入导向仓库外。
  let dir = root
  for (const part of ['inbox', 'local']) {
    const next = path.join(dir, part)
    await mkdir(next, { recursive: true })
    if ((await lstat(next)).isSymbolicLink()) throw new Error('导出目录不能是链接。')
    const resolved = await realpath(next)
    if (!inside(dir, resolved)) throw new Error('导出目录路径异常。')
    dir = resolved
  }
  const validated = validateIssue(snapshot.issue)
  if (validated.digest !== snapshot.digest) throw new Error('快照摘要不一致。')
  const file = path.join(dir, `issue-${snapshot.issue.number}-${snapshot.digest}.json`)
  try { await writeFile(file, JSON.stringify(snapshot.issue, null, 2) + '\n', { flag: 'wx', mode: 0o600 }) }
  catch (error) {
    if (error.code === 'EEXIST') return { file, duplicate: true }
    throw error
  }
  return { file, duplicate: false }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--help') {
    console.log('用法：npm run issue:export -- --number 123 [--fetch]\n默认只预览；--fetch才读取既定仓库的公开Issue并导出到inbox/local/，不读取密钥或接受资料入库。')
    return
  }
  let number, send = false
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--number' && number === undefined && /^[1-9]\d*$/.test(args[i + 1] || '')) number = Number(args[++i])
    else if (args[i] === '--fetch' && !send) send = true
    else throw new Error('参数无效。')
  }
  const url = issueUrl(number)
  if (!send) { console.log(JSON.stringify({ mode: 'preview', url, notice: '未联网或写入；--fetch才只读导出公开资料。' }, null, 2)); return }
  const result = await saveIssue(process.cwd(), await fetchIssue(number))
  console.log(`${result.duplicate ? '已有相同快照，未覆盖' : '已导出，待离线校验接收'}：${path.relative(process.cwd(), result.file)}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(() => { console.error('Issue导出失败：请核对编号、网络/限流、开放状态、知识表单字段及公开勾选；不接受PR。未自动重试，不回显响应或资料。'); process.exitCode = 1 })
}
