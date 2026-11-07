import { execFileSync } from 'node:child_process'
import { lstat, readFile, realpath, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' })
const [article, option, ...extra] = process.argv.slice(2)
const sidebar = 'knowledge/.vitepress/config.ts'
const topics = 'knowledge/topics.md'
const repository = 'https://github.com/EchoForge05/knowledge-hub'
const link = /(!?)\[([^\]\r\n]*)\]\((<?[^()\s]+>?)\)/g
const markdown = new RegExp(/^(\x60{3,}|~{3,}).*\r?\n[\s\S]*?^\1[ \t]*(?=\r?$)/.source + '|' + link.source, 'gm')

function pointsToArticle(destination, from, target) {
  const [url] = destination.replace(/^<|>$/g, '').split(/[?#]/)
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url) || !url) return false
  const decoded = decodeURI(url)
  const route = '/' + target.slice('knowledge/'.length, -3)
  if (decoded.startsWith('/knowledge-hub/')) {
    return decoded.slice('/knowledge-hub'.length).replace(/(?:\.html|\.md)$/, '') === route
  }
  if (from.startsWith('knowledge/') && /^\/(?!\/)/.test(decoded)) {
    return decoded.replace(/(?:\.html|\.md)$/, '') === route
  }
  if (decoded.startsWith('/')) return false
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(from), decoded))
  return resolved === target || resolved === target.slice(0, -3) || resolved === target.slice(0, -3) + '.html'
}

async function readTrackedFile(file, root) {
  const location = path.resolve(file)
  const info = await lstat(location)
  if (!info.isFile() || path.relative(root, await realpath(location)) !== path.normalize(file)) {
    throw new Error('需要仓库内的普通文件：' + file)
  }
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await readFile(location))
}

async function run() {
  if (!/^[a-z][a-z0-9-]*\/[a-z0-9][a-z0-9-]*\.md$/.test(article ?? '') ||
      article.startsWith('examples/') || (option && option !== '--apply') || extra.length) {
    throw new Error('用法：npm run knowledge:remove -- 分类/文章.md [--apply]')
  }
  const root = await realpath(git('rev-parse', '--show-toplevel').trim())
  if (root !== await realpath(process.cwd())) throw new Error('请在仓库根目录运行。')
  if (git('status', '--porcelain').trim()) throw new Error('请从干净的 Git 工作区运行。')

  const target = 'knowledge/' + article
  const tracked = git('ls-files', '-z').split('\0')
  if (!tracked.includes(target)) throw new Error('找不到已跟踪文章：' + target)
  await readTrackedFile(target, root)
  const route = '/' + article.slice(0, -3)
  const sidebarText = await readTrackedFile(sidebar, root)
  const sidebarEntry = new RegExp("^[ \\t]*\\{ text: .*?, link: '" + route + "' \\},?[ \\t]*(?:\\r?\\n|$)", 'gm')
  if ([...sidebarText.matchAll(sidebarEntry)].length !== 1) {
    throw new Error('需要唯一且独占一行的侧栏入口：' + route)
  }

  const changes = new Map()
  const revision = git('rev-parse', 'HEAD').trim()
  let topicMatches = 0
  for (const file of tracked.filter(file => file.endsWith('.md') && file !== target)) {
    const before = await readTrackedFile(file, root)
    let after
    if (file === topics) {
      after = before.replace(/^(\|[^|\r\n]+\|[^|\r\n]+\| )([^|\r\n]+)( \|)(?=\r?$)/gm, (_, start, list, end) => {
        const entries = [...list.matchAll(link)]
        if (entries.map(entry => entry[0]).join('、') !== list) return start + list + end
        const remaining = entries.filter(entry => {
          if (!pointsToArticle(entry[3], file, target)) return true
          topicMatches++
          return false
        })
        return start + (remaining.map(entry => entry[0]).join('、') || '待收录') + end
      })
    } else {
      after = before.replace(markdown, (match, fence, image, label, destination) => {
        if (fence || image || !pointsToArticle(destination, file, target)) return match
        if (file.startsWith('docs/history/')) {
          const anchor = /#.*$/.exec(destination.replace(/>$/, ''))?.[0] ?? ''
          return '[' + label + '](' + repository + '/blob/' + revision + '/' + target + anchor + ')'
        }
        return label
      })
    }
    if (after !== before) changes.set(file, { before, after })
  }
  if (topicMatches !== 1) throw new Error('需要唯一的知识目录入口：' + article)
  changes.set(sidebar, { before: sidebarText, after: sidebarText.replace(sidebarEntry, '') })

  console.log('下架 ' + target + '\n同步 ' + [...changes.keys()].join('\n同步 '))
  if (option !== '--apply') return

  const written = []
  try {
    for (const [file, { after }] of changes) {
      written.push(file)
      await writeFile(file, after)
    }
    await unlink(target)
  } catch (error) {
    await Promise.all(written.map(file => writeFile(file, changes.get(file).before)))
    throw error
  }
}

run().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
