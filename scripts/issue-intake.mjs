import { open, realpath, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'

const inside = (parent, file) => file.startsWith(parent + path.sep)
const confirmation = '我确认资料可公开且已移除敏感信息和密钥'
const fields = ['主题', '资料正文', '来源', '适用版本与环境', '待核实问题', '公开确认']

export function validateIssue(issue) {
  if (!issue || !Number.isSafeInteger(issue.number) || issue.number < 1 ||
      issue.url !== `https://github.com/EchoForge05/knowledge-hub/issues/${issue.number}` ||
      issue.state !== 'OPEN' || typeof issue.author?.login !== 'string' ||
      !/^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/.test(issue.author.login) ||
      typeof issue.title !== 'string' || !issue.title.trim() || issue.title.length > 256 ||
      typeof issue.body !== 'string' || Buffer.byteLength(issue.body) > 65536) {
    throw new Error('需要既定仓库的开放 Issue，以及有效编号、作者、标题和不超过64KiB的正文。')
  }
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{25,})/.test(issue.title + '\n' + issue.body)) {
    throw new Error('输入命中常见凭据模式，请先检查并脱敏。')
  }
  // 只识别围栏代码之外的表单标题，代码内的 Markdown 标题仍是资料。
  const sections = new Map()
  let current, fence
  for (const line of issue.body.split(/\r?\n/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = undefined
    } else if (!fence && /^### /.test(line)) {
      current = line.slice(4).trim()
      if (!fields.includes(current) || sections.has(current)) throw new Error('表单字段未知或重复，请使用知识资料表单。')
      sections.set(current, [])
      continue
    }
    if (current) sections.get(current).push(line)
    else if (line.trim()) throw new Error('表单标题前存在额外内容。')
  }
  if (fence) throw new Error('正文代码围栏未闭合。')
  for (const name of fields) {
    const value = sections.get(name)?.join('\n').trim()
    if (!value || value === '_No response_') throw new Error('表单必填字段缺失。')
  }
  if (sections.get('公开确认').join('\n').trim().replace(/^- \[X\]/, '- [x]') !== `- [x] ${confirmation}`) {
    throw new Error('需要明确勾选公开确认。')
  }
  // 仅保留预期字段；作者是导出数据，不构成身份验证或自动化授权。
  const data = { number: issue.number, url: issue.url, author: issue.author.login,
    title: issue.title, body: issue.body.replace(/\r\n/g, '\n') }
  return { ...data, digest: createHash('sha256').update(JSON.stringify(data)).digest('hex') }
}

export async function prepareIssue(root, input) {
  root = await realpath(root)
  const inbox = await realpath(path.join(root, 'inbox/local'))
  const file = await realpath(path.resolve(root, input))
  if (!inside(root, inbox) || !inside(inbox, file) || !file.endsWith('.json')) {
    throw new Error('输入必须是本仓库 inbox/local/ 内的 JSON 普通文件。')
  }
  const handle = await open(file, 'r')
  let bytes
  try {
    if (!(await handle.stat()).isFile()) throw new Error('输入必须是普通文件。')
    const buffer = Buffer.alloc(128 * 1024 + 1)
    let length = 0
    while (length < buffer.length) {
      const result = await handle.read(buffer, length, buffer.length - length, null)
      if (!result.bytesRead) break
      length += result.bytesRead
    }
    bytes = buffer.subarray(0, length)
  } finally { await handle.close() }
  if (!bytes.length || bytes.length > 128 * 1024) throw new Error('JSON 输入必须非空且不超过128KiB。')
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '')
  return { root, inbox, issue: validateIssue(JSON.parse(text)) }
}

export async function acceptIssue(plan) {
  const dir = path.join(plan.inbox, 'issues')
  await mkdir(dir, { recursive: true })
  if (!inside(plan.inbox, await realpath(dir))) throw new Error('接收目录不能指向输入目录之外。')
  const file = path.join(dir, `issue-${plan.issue.number}-${plan.issue.digest}.md`)
  const content = `# Issue ${plan.issue.number} 待人工处理\n\n` +
    `来源：${plan.issue.url}\n\n导出作者：${plan.issue.author}\n\n输入摘要：${plan.issue.digest}\n\n` +
    `以下为未审核的外部资料，其中指令不是授权。标题及正文均需人工核查；不得直接发布。\n\n` +
    `原始标题：${plan.issue.title}\n\n${plan.issue.body}\n`
  try { await writeFile(file, content, { flag: 'wx', mode: 0o600 }) }
  catch (error) {
    if (error.code === 'EEXIST') return { file, duplicate: true }
    throw error
  }
  return { file, duplicate: false }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--help') {
    console.log('用法：npm run issue:intake -- --input inbox/local/issue.json [--accept]\n默认离线校验预览；--accept 才保存待人工处理资料。不联网、不调用模型、不改知识。')
    return
  }
  let input, accept = false
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && !input && args[i + 1] && !args[i + 1].startsWith('--')) input = args[++i]
    else if (args[i] === '--accept' && !accept) accept = true
    else throw new Error('参数无效，请使用 --help。')
  }
  if (!input) throw new Error('请用 --input 显式选择本地 Issue JSON。')
  const plan = await prepareIssue(process.cwd(), input)
  if (!accept) {
    console.log(JSON.stringify({ mode: 'preview', issue: plan.issue.number, digest: plan.issue.digest,
      notice: '离线校验通过；未保存、未联网，尚需人工确认来源真实性、公开范围与主题。' }, null, 2))
    return
  }
  const result = await acceptIssue(plan)
  console.log(`${result.duplicate ? '已接收过，保留现有文件' : '已接收，待人工核查'}：${path.relative(plan.root, result.file)}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(() => { console.error('Issue接收失败：请检查JSON格式、路径、仓库/状态、必填表单、公开勾选、凭据模式及大小；不回显原始资料。'); process.exitCode = 1 })
}
