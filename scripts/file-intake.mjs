import { readdir, readFile, lstat } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'

export const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const supported = new Set(['.md', '.txt'])

// Only metadata leaves this scanner. Source text remains local for Agent review.
export async function scan(root = process.cwd()) {
  const pending = path.join(root, 'inbox/local/pending')
  const receipts = path.join(root, 'inbox/local/receipts')
  const files = []
  async function walk(dir) {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(dir, entry.name)
      const file = path.relative(pending, absolute).split(path.sep).join('/')
      if (entry.isSymbolicLink()) { files.push({ file, status: 'blocked-link' }); continue }
      if (entry.isDirectory()) { await walk(absolute); continue }
      if (!entry.isFile() || !supported.has(path.extname(entry.name).toLowerCase())) {
        files.push({ file, status: 'unsupported' }); continue
      }
      const bytes = await readFile(absolute)
      const sha256 = digest(bytes)
      const item = { file, sha256, bytes: bytes.length, status: 'pending' }
      try { new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
      catch { item.status = 'invalid-utf8' }
      if (!bytes.length) item.status = 'empty'
      if (item.status === 'pending') {
        try {
          const receiptPath = path.join(receipts, `${sha256}.json`)
          if ((await lstat(receiptPath)).isSymbolicLink()) throw new Error('receipt link')
          const receipt = JSON.parse(await readFile(receiptPath, 'utf8'))
          if (receipt.sha256 !== sha256 || receipt.status !== 'complete' ||
              !['imported', 'unchanged'].includes(receipt.outcome) ||
              !Array.isArray(receipt.targets) || !receipt.targets.length) throw new Error('invalid receipt')
          for (const target of receipt.targets) {
            if (typeof target.path !== 'string' || !/^knowledge\/.+\.md$/.test(target.path) || target.path.includes('..')) throw new Error('invalid target')
            const parts = target.path.split('/')
            let current = root
            for (const part of parts) {
              current = path.join(current, part)
              if ((await lstat(current)).isSymbolicLink()) throw new Error('target link')
            }
            if (digest(await readFile(current)) !== target.sha256) throw new Error('target changed')
          }
          item.status = 'complete'
        } catch (error) {
          if (error.code !== 'ENOENT') item.receipt = 'stale-or-invalid'
        }
      }
      files.push(item)
    }
  }
  // Do not follow redirected local input or receipt directories.
  for (const dir of ['inbox', 'inbox/local', 'inbox/local/pending', 'inbox/local/receipts']) {
    try { if ((await lstat(path.join(root, dir))).isSymbolicLink()) throw new Error('输入或回执目录不能是符号链接') }
    catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  try { await lstat(pending) }
  catch (error) { if (error.code === 'ENOENT') return { directory: 'inbox/local/pending', files }; throw error }
  await walk(pending)
  return { directory: 'inbox/local/pending', files }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(await scan(), null, 2)) }
  catch { console.error('文件扫描失败，请检查目录权限及符号链接；未记录成功。'); process.exitCode = 1 }
}
