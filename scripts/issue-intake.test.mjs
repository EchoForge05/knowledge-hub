import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, readdir, symlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { validateIssue, prepareIssue, acceptIssue } from './issue-intake.mjs'

const sample = () => ({ number: 12, url: 'https://github.com/EchoForge05/knowledge-hub/issues/12',
  state: 'OPEN', author: { login: 'EchoForge05' }, title: '[知识] Git差异',
  body: '### 主题\n\nGit差异\n\n### 资料正文\n\n```md\n### 代码中的标题\n```\n\n' +
    '### 来源\n\n原创笔记\n\n### 适用版本与环境\n\n待核实\n\n### 待核实问题\n\n参数范围\n\n' +
    '### 公开确认\n\n- [x] 我确认资料可公开且已移除敏感信息和密钥' })
await mkdir('.private', { recursive: true })
const root = await mkdtemp(path.resolve('.private/issue-test-'))
await mkdir(path.join(root, 'inbox/local'), { recursive: true })
const input = 'inbox/local/issue.json'
await writeFile(path.join(root, input), JSON.stringify(sample()))

test('表单保留代码内标题、待核实和来源，同一输入摘要稳定', () => {
  const issue = validateIssue(sample())
  assert.match(issue.body, /### 代码中的标题/)
  assert.equal(issue.digest, validateIssue(sample()).digest)
  assert.notEqual(issue.digest, validateIssue({ ...sample(), title: '更新标题' }).digest)
  assert.doesNotThrow(() => validateIssue({ ...sample(), body: sample().body.replace('[x]', '[X]') }))
})

test('拒绝其他仓库、URL伪装、编号不符、关闭状态和无作者输入', () => {
  for (const change of [{ url: 'https://github.com/other/repo/issues/12' },
    { url: sample().url + '?key=ignored' }, { number: 13 }, { state: 'CLOSED' },
    { author: null }, { title: '' }, { number: -1 }]) {
    assert.throws(() => validateIssue({ ...sample(), ...change }))
  }
})

test('拒绝缺字段、重复字段、未确认公开与未闭合代码围栏', () => {
  for (const body of [sample().body.replace('### 来源', '### 无效来源'),
    sample().body + '\n### 主题\n重复', sample().body.replace('[x]', '[ ]'),
    sample().body.replace('参数范围', '_No response_'), sample().body + '\n```js\n']) {
    assert.throws(() => validateIssue({ ...sample(), body }))
  }
})

test('标题和正文凭据模式及超限资料均拦截，错误不包含输入', () => {
  const secret = 'sk-' + 'a'.repeat(30)
  for (const change of [{ title: secret }, { body: sample().body + secret }, { body: 'x'.repeat(65537) }]) {
    assert.throws(() => validateIssue({ ...sample(), ...change }), error => !error.message.includes(secret))
  }
})

test('CLI默认仅预览，不创建接收文件；无密钥也可运行', async () => {
  const before = await readdir(path.join(root, 'inbox/local'))
  const script = fileURLToPath(new URL('./issue-intake.mjs', import.meta.url))
  const result = await promisify(execFile)(process.execPath, [script, '--input', input], {
    cwd: root, env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot }
  })
  assert.equal(JSON.parse(result.stdout).mode, 'preview')
  assert.deepEqual(await readdir(path.join(root, 'inbox/local')), before)
  await assert.rejects(promisify(execFile)(process.execPath, [script, '--input', input, '--send'], { cwd: root }))
})

test('显式接收保留来源，重复/并发不覆写，修改后的资料产生另一稿', async () => {
  const plan = await prepareIssue(root, input)
  const before = await readFile(path.join(root, input), 'utf8')
  const results = await Promise.all([acceptIssue(plan), acceptIssue(plan)])
  assert.equal(results.filter(r => !r.duplicate).length, 1)
  const file = results[0].file
  assert.match(await readFile(file, 'utf8'), /https:\/\/github.com\/EchoForge05\/knowledge-hub\/issues\/12/)
  await writeFile(file, '人工已处理的记录')
  assert.equal((await acceptIssue(plan)).duplicate, true)
  assert.equal(await readFile(file, 'utf8'), '人工已处理的记录')
  const revised = await acceptIssue({ ...plan, issue: validateIssue({ ...sample(), title: '修订主题' }) })
  assert.notEqual(revised.file, file)
  assert.equal(await readFile(path.join(root, input), 'utf8'), before)
})

test('拒绝目录外、非UTF8、过大或畸形JSON；接受UTF8 BOM导出', async () => {
  await writeFile(path.join(root, 'outside.json'), JSON.stringify(sample()))
  await assert.rejects(prepareIssue(root, 'outside.json'))
  for (const bytes of [Buffer.from([0xff]), Buffer.from('{'), Buffer.alloc(128 * 1024 + 1, 32)]) {
    await writeFile(path.join(root, 'inbox/local/bad.json'), bytes)
    await assert.rejects(prepareIssue(root, 'inbox/local/bad.json'))
  }
  await writeFile(path.join(root, 'inbox/local/bom.json'), '\uFEFF' + JSON.stringify(sample()))
  assert.equal((await prepareIssue(root, 'inbox/local/bom.json')).issue.number, 12)
})

test('接收目录链接逃逸被拒绝', async () => {
  const other = await mkdtemp(path.resolve('.private/issue-link-test-'))
  await mkdir(path.join(other, 'inbox/local'), { recursive: true })
  await mkdir(path.join(other, 'outside'))
  await writeFile(path.join(other, input), JSON.stringify(sample()))
  await symlink(path.join(other, 'outside'), path.join(other, 'inbox/local/issues'), process.platform === 'win32' ? 'junction' : 'dir')
  await assert.rejects(acceptIssue(await prepareIssue(other, input)))
  assert.deepEqual(await readdir(path.join(other, 'outside')), [])
})

test('CLI显式接收可重复运行，输出不泄露标题和正文，失败返回非零', async () => {
  const script = fileURLToPath(new URL('./issue-intake.mjs', import.meta.url))
  const args = [script, '--input', input, '--accept']
  const result = await promisify(execFile)(process.execPath, args, { cwd: root })
  assert.match(result.stdout, /已接收过/)
  assert.ok(!result.stdout.includes(sample().title))
  assert.ok(!result.stdout.includes(sample().body))
  await writeFile(path.join(root, 'inbox/local/invalid.json'), JSON.stringify({ ...sample(), title: 'sk-' + 'z'.repeat(30) }))
  await assert.rejects(promisify(execFile)(process.execPath, [script, '--input', 'inbox/local/invalid.json', '--accept'], { cwd: root }),
    error => error.code !== 0 && !error.stderr.includes('z'.repeat(30)))
})
