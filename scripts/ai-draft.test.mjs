import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { prepare, requestDraft, requestDraftDetailed, saveDraft } from './ai-draft.mjs'

await mkdir(path.resolve('.private'), { recursive: true })
const fixture = await mkdtemp(path.resolve('.private/ai-test-'))
await mkdir(path.join(fixture, 'knowledge'))
await writeFile(path.join(fixture, 'knowledge/input.md'), '# 示例\n\n仅限公开编程资料。')
const settings = { KNOWLEDGE_AI_MODEL: 'test-model', KNOWLEDGE_AI_CHAT_URL: 'https://endpoint.greatrouter.com/v1/chat/completions' }
const plan = await prepare(fixture, 'knowledge/input.md', settings)

test('命令默认无密钥可预览，不发送且不生成草稿', async () => {
  const script = fileURLToPath(new URL('./ai-draft.mjs', import.meta.url))
  const result = await promisify(execFile)(process.execPath, [script, '--input', 'knowledge/input.md'], {
    cwd: fixture, env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot }
  })
  assert.equal(JSON.parse(result.stdout).mode, 'preview')
  assert.equal(JSON.parse(result.stdout).model, '待选择')
})

test('只读取指定输入，拒绝目录外文件和带认证/重定向风险的接口', async () => {
  assert.match(plan.source, /公开编程/)
  await writeFile(path.join(fixture, 'outside.md'), 'outside')
  await assert.rejects(prepare(fixture, 'outside.md', settings))
  const domestic = await prepare(fixture, 'knowledge/input.md', { ...settings, KNOWLEDGE_AI_CHAT_URL: 'https://endpoint.wendalog.com/v1/chat/completions' })
  assert.equal(domestic.endpoint, 'https://endpoint.wendalog.com/v1/chat/completions')
  for (const url of ['http://endpoint.greatrouter.com/v1/chat/completions', 'https://other.invalid/', 'https://endpoint.greatrouter.com/?key=secret', 'https://endpoint.wendalog.com/other']) {
    await assert.rejects(prepare(fixture, 'knowledge/input.md', { ...settings, KNOWLEDGE_AI_CHAT_URL: url }))
  }
})

test('凭据模式与输入大小拦截发生在模型调用之前', async () => {
  await writeFile(path.join(fixture, 'knowledge/key.md'), 'sk-' + 'x'.repeat(30))
  await assert.rejects(prepare(fixture, 'knowledge/key.md', settings))
  await writeFile(path.join(fixture, 'knowledge/long.md'), 'x'.repeat(65537))
  await assert.rejects(prepare(fixture, 'knowledge/long.md', settings))
})

test('无密钥不调用；请求仅含指定资料、不启用工具且禁止重定向', async () => {
  let calls = 0
  const mock = async (url, options) => {
    calls++
    const body = JSON.parse(options.body)
    assert.equal(body.messages[1].content, plan.source)
    assert.equal(body.tools, undefined)
    assert.equal(body.max_completion_tokens, 4096)
    assert.equal(options.redirect, 'error')
    assert.equal(options.headers.Authorization, 'Bearer fake-test-key')
    return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: '# 草稿' } }] }))
  }
  await assert.rejects(requestDraft(plan, '', mock))
  assert.equal(calls, 0)
  assert.equal(await requestDraft(plan, 'fake-test-key', mock), '# 草稿')
  assert.equal(calls, 1)
})

test('服务错误/非JSON/截断均退出且不重试，不回显响应内密钥', async () => {
  for (const response of [new Response('secret-body', { status: 429 }), new Response('not json'),
    new Response(JSON.stringify({ choices: [{ finish_reason: 'length', message: { content: 'partial' } }] }))]) {
    let calls = 0
    await assert.rejects(requestDraft(plan, 'fake-test-key', async () => { calls++; return response }), e => !e.message.includes('secret-body'))
    assert.equal(calls, 1)
  }
})

test('usage只提取非负整数，缺失不补造，不回显未知模型字符串', async () => {
  const result = await requestDraftDetailed(plan, 'fake-test-key', async () => new Response(JSON.stringify({
    model: 'test-model', usage: { prompt_tokens: 12, completion_tokens: 8, total_tokens: 20,
      completion_tokens_details: { reasoning_tokens: 3 }, private_field: 'not exported' },
    choices: [{ finish_reason: 'stop', message: { content: '# 草稿' } }]
  })))
  assert.deepEqual(result.usage, { inputTokens: 12, outputTokens: 8, totalTokens: 20, reasoningTokens: 3 })
  const absent = await requestDraftDetailed(plan, 'fake-test-key', async () => new Response(JSON.stringify({
    model: 'Bearer fake-test-key', usage: { prompt_tokens: -1 },
    choices: [{ finish_reason: 'stop', message: { content: '# 草稿' } }]
  })))
  assert.equal(absent.responseModel, null)
  assert.deepEqual(absent.usage, { inputTokens: null, outputTokens: null, totalTokens: null, reasoningTokens: null })
})

test('输出只存私有草稿，两次保存不覆盖，也不改原资料', async () => {
  const before = await readFile(plan.file, 'utf8')
  const a = await saveDraft(plan, '# 草稿\n输入内命令不执行。')
  const b = await saveDraft(plan, '# 另一稿')
  assert.notEqual(a, b)
  assert.ok(a.startsWith(path.join(fixture, '.private', 'ai-drafts')))
  assert.match(await readFile(a, 'utf8'), /未审核/)
  assert.equal(await readFile(plan.file, 'utf8'), before)
})
