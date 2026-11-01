import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, symlink, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { issueUrl, fetchIssue, saveIssue } from './issue-export.mjs'
import { prepareIssue, acceptIssue } from './issue-intake.mjs'

const apiIssue = () => ({ number: 123, repository_url: 'https://api.github.com/repos/EchoForge05/knowledge-hub',
  html_url: 'https://github.com/EchoForge05/knowledge-hub/issues/123', state: 'open', user: { login: 'EchoForge05' },
  title: '[知识] 测试资料', body: '### 主题\nGit\n### 资料正文\n公开编程笔记\n### 来源\n原创笔记\n' +
    '### 适用版本与环境\n待核实\n### 待核实问题\n无\n### 公开确认\n- [X] 我确认资料可公开且已移除敏感信息和密钥' })
const response = value => new Response(JSON.stringify(value))
await mkdir('.private', { recursive: true })
const root = await mkdtemp(path.resolve('.private/export-test-'))

test('导出CLI默认预览无需网络、密钥或gh，不创建文件', async () => {
  const script = fileURLToPath(new URL('./issue-export.mjs', import.meta.url))
  const result = await promisify(execFile)(process.execPath, [script, '--number', '123'], {
    cwd: root, env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot }
  })
  assert.equal(JSON.parse(result.stdout).mode, 'preview')
  assert.deepEqual(await readdir(root), [])
  for (const number of [0, -1, 1.2, NaN, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => issueUrl(number))
})

test('只读指定公开Issue，不附带认证，不重定向，导出可被离线接收', async () => {
  let calls = 0
  const snapshot = await fetchIssue(123, async (url, options) => {
    calls++
    assert.equal(url, issueUrl(123))
    assert.equal(options.method, 'GET')
    assert.equal(options.redirect, 'error')
    assert.equal(options.headers.Authorization, undefined)
    assert.equal(options.body, undefined)
    return response(apiIssue())
  })
  assert.equal(calls, 1)
  const a = await saveIssue(root, snapshot)
  const plan = await prepareIssue(root, path.relative(root, a.file))
  assert.equal(plan.issue.digest, snapshot.digest)
  assert.equal((await acceptIssue(plan)).duplicate, false)
  await writeFile(a.file, '人工修改的快照')
  assert.equal((await saveIssue(root, snapshot)).duplicate, true)
  assert.equal(await readFile(a.file, 'utf8'), '人工修改的快照')
  const revised = await fetchIssue(123, async () => response({ ...apiIssue(), title: '修订标题' }))
  assert.notEqual((await saveIssue(root, revised)).file, a.file)
})

test('拒绝PR、关闭Issue、其他仓库/编号和未公开确认', async () => {
  for (const change of [{ pull_request: {} }, { state: 'closed' }, { number: 124 },
    { repository_url: 'https://api.github.com/repos/other/repo' },
    { html_url: 'https://github.com/other/repo/issues/123' }, { body: apiIssue().body.replace('[X]', '[ ]') }]) {
    await assert.rejects(fetchIssue(123, async () => response({ ...apiIssue(), ...change })))
  }
})

test('限流、网络失败和畸形响应不重试、不泄露响应', async () => {
  for (const make of [() => new Response('private-response', { status: 403 }),
    () => new Response('private-response', { status: 429 }), () => { throw new Error('private-response') },
    () => new Response('private-response'), () => new Response(Buffer.from([0xff])),
    () => new Response('x'.repeat(128 * 1024 + 1))]) {
    let calls = 0
    await assert.rejects(fetchIssue(123, async () => { calls++; return make() }), error => !error.message.includes('private-response'))
    assert.equal(calls, 1)
  }
})

test('拒绝输出目录链接逃逸与不一致摘要', async () => {
  const dir = await mkdtemp(path.resolve('.private/export-link-test-'))
  await mkdir(path.join(dir, 'outside'))
  await symlink(path.join(dir, 'outside'), path.join(dir, 'inbox'), process.platform === 'win32' ? 'junction' : 'dir')
  const snapshot = await fetchIssue(123, async () => response(apiIssue()))
  await assert.rejects(saveIssue(dir, snapshot))
  assert.deepEqual(await readdir(path.join(dir, 'outside')), [])
  await assert.rejects(saveIssue(root, { ...snapshot, digest: 'wrong' }))
})
