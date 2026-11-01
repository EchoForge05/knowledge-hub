// Capture actual source manifests. Run from repository root with a unique stage.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'

const stage = process.argv[2]
if (!/^s[0-6]$/.test(stage ?? '')) throw new Error('Unknown stage')
const output = 'docs/project/evidence/p3'
const dest = path.join(output, stage + '.json')
if (fs.existsSync(dest)) throw new Error('Refusing to overwrite evidence')
const names = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', 'knowledge/'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const files = Object.fromEntries([...new Set(names)].sort().map(name => [name,
  crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex')]))
const topic = 'knowledge/git/restore-basics.md'
const articleExists = fs.existsSync(topic)
if (articleExists) fs.copyFileSync(topic, path.join(output, stage + '-article.txt'))
const record = { stage, scope: 'knowledge/ source files including .vitepress/config.ts; Git ignore rules exclude generated output', articleExists, files }
if (stage !== 's0') {
  const previous = 's' + (Number(stage[1]) - 1)
  const old = JSON.parse(fs.readFileSync(path.join(output, previous + '.json'), 'utf8')).files
  record.changedFromPrevious = [...new Set([...Object.keys(old), ...Object.keys(files)])].sort().filter(name => old[name] !== files[name])
}
fs.writeFileSync(dest, JSON.stringify(record, null, 2) + '\n')
console.log(stage, 'files:', names.length, 'changed:', record.changedFromPrevious ?? 'baseline')
