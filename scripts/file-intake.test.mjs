import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { scan, digest } from './file-intake.mjs'

test('批量清单、有效回执、源修改和目标漂移', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'hub-intake-'))
  try {
    assert.deepEqual((await scan(root)).files, [])
    const pending = path.join(root, 'inbox/local/pending')
    const receipts = path.join(root, 'inbox/local/receipts')
    await mkdir(path.join(pending, '子目录'), { recursive: true })
    await mkdir(receipts)
    await mkdir(path.join(root, 'knowledge'))
    await writeFile(path.join(pending, '笔记.md'), '# 公开笔记\n')
    await writeFile(path.join(pending, '子目录/a.TXT'), '另一主题')
    await writeFile(path.join(pending, 'empty.txt'), '')
    await writeFile(path.join(pending, 'bad.txt'), Buffer.from([0xff]))
    await writeFile(path.join(pending, 'a.pdf'), 'unsupported')
    let files = (await scan(root)).files
    assert.equal(files.filter(f => f.status === 'pending').length, 2)
    for (const status of ['empty', 'invalid-utf8', 'unsupported']) assert.ok(files.some(f => f.status === status))
    const input = files.find(f => f.file === '笔记.md')
    const target = path.join(root, 'knowledge/article.md')
    await writeFile(target, '# 已整理\n')
    const receipt = { sha256: input.sha256, status: 'complete', outcome: 'imported', targets: [{ path: 'knowledge/article.md', sha256: digest(Buffer.from('# 已整理\n')) }] }
    const receiptFile = path.join(receipts, `${input.sha256}.json`)
    await writeFile(receiptFile, JSON.stringify(receipt))
    assert.equal((await scan(root)).files.find(f => f.file === input.file).status, 'complete')
    await writeFile(target, '# 后续变更\n')
    assert.equal((await scan(root)).files.find(f => f.file === input.file).status, 'pending')
    await writeFile(receiptFile, '{broken')
    assert.equal((await scan(root)).files.find(f => f.file === input.file).status, 'pending')
    await writeFile(receiptFile, JSON.stringify({ ...receipt, targets: [{ path: '../outside.md' }] }))
    assert.equal((await scan(root)).files.find(f => f.file === input.file).status, 'pending')
    await writeFile(path.join(pending, input.file), '# 新内容\n')
    assert.notEqual((await scan(root)).files.find(f => f.file === input.file).sha256, input.sha256)
  } finally { await rm(root, { recursive: true, force: true }) }
})
