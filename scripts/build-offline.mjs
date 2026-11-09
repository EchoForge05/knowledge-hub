import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createMarkdownRenderer, resolveConfig } from 'vitepress'
import { tokenize } from '../knowledge/.vitepress/search-tokenizer.mjs'

const config = await resolveConfig('knowledge')
const render = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base)
const origin = new URL('https://offline.invalid' + config.site.base)
const entry = 'topics.html'
const pages = new Map()
const links = []
const images = new Map()
const imageTypes = new Map([
  ['.svg', 'image/svg+xml'], ['.png', 'image/png'], ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'], ['.webp', 'image/webp'], ['.gif', 'image/gif'],
  ['.avif', 'image/avif']
])
const sourceRoot = await realpath(config.srcDir)

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

function fragment(id) {
  return '#' + encodeURIComponent(id)
}

function localPath(url) {
  if (!url.pathname.startsWith(origin.pathname)) {
    throw new Error(`离线资源超出知识目录 ${url.pathname}`)
  }
  return decodeURIComponent(url.pathname.slice(origin.pathname.length))
}

async function embedImage(url) {
  const relative = localPath(url)
  if (!images.has(relative)) {
    const file = await realpath(path.resolve(sourceRoot, relative))
    const mime = imageTypes.get(path.extname(file).toLowerCase())
    if (!file.startsWith(sourceRoot + path.sep) || !mime) {
      throw new Error(`无法内嵌图片 ${relative}`)
    }
    let bytes = await readFile(file)
    // Normalize Git's CRLF checkout without changing the SVG's declared character encoding.
    if (mime === 'image/svg+xml') {
      bytes = Buffer.from(bytes.toString('latin1').replaceAll('\r\n', '\n'), 'latin1')
    }
    images.set(relative, `data:${mime};base64,${bytes.toString('base64')}`)
  }
  return images.get(relative) + url.hash
}

async function preparePage(html, page) {
  const ids = new Set([page])
  const replacements = new Map()
  // VitePress emits double-quoted attributes. Refuse resource types the reader cannot embed.
  if (/<(?:script|style|link|iframe|object|embed|audio|video|source)\b|\ssrcset\s*=/i.test(html)) {
    throw new Error('正文含离线阅读器无法打包的资源')
  }
  const pageUrl = new URL(page, origin)
  const tags = /<[a-z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi
  const attributes = /\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  const references = [...html.matchAll(tags)].flatMap(([tag]) => [...tag.matchAll(attributes)])
  for (const [, name, double, single, bare] of references) {
    const value = double ?? single ?? bare
    const type = name.toLowerCase()
    if (value === undefined || !['id', 'href', 'src'].includes(type)) continue
    const key = type + '=' + value
    if (type === 'id') {
      const id = `${page}:${value}`
      if (ids.has(id)) throw new Error(`重复的锚点 ${value}`)
      ids.add(id)
      replacements.set(key, escapeHtml(id))
      continue
    }
    const url = new URL(value.replaceAll('&amp;', '&'), pageUrl)
    if (type === 'src') {
      if (url.origin !== origin.origin) throw new Error(`图片必须先保存到知识目录 ${value}`)
      replacements.set(key, escapeHtml(await embedImage(url)))
      continue
    }
    if (url.origin !== origin.origin) {
      if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) {
        throw new Error(`不支持的链接协议 ${value}`)
      }
      continue
    }
    let target = localPath(url)
    if (!target || target === 'index.html') target = entry
    const id = url.hash ? `${target}:${decodeURIComponent(url.hash.slice(1))}` : target
    links.push({ from: page, target, id })
    replacements.set(key, fragment(id))
  }
  const content = html.replace(tags, tag => tag.replace(attributes, (match, name, double, single, bare) => {
    const replacement = replacements.get(name.toLowerCase() + '=' + (double ?? single ?? bare))
    return replacement === undefined ? match : ` ${name}="${replacement}"`
  })).replaceAll('<button title="Copy Code" class="copy"></button>', '')
  return { content, ids }
}

for (const source of config.pages) {
  if (source === 'index.md') continue // The website's home layout is replaced by the topic directory.
  const file = path.join(config.srcDir, source)
  const env = { path: file, relativePath: source }
  try {
    const html = render.render(await readFile(file, 'utf8'), env)
    const { scripts, styles, customBlocks } = env.sfcBlocks
    if (scripts.length || styles.length || customBlocks.length) {
      throw new Error('正文含需要网站运行的组件代码或样式')
    }
    const page = source.replace(/\.md$/, '.html')
    pages.set(page, await preparePage(html, page))
  } catch (error) {
    throw new Error(`无法打包 ${source}：${error.message}`, { cause: error })
  }
}

if (!pages.has(entry)) throw new Error('缺少离线入口 topics.md')
for (const { from, target, id } of links) {
  if (!pages.get(target)?.ids.has(id)) throw new Error(`${from} 的链接目标不存在：${id}`)
}
const supplemental = new Set([entry, 'guide.html', 'examples/reading-check.html'])
const articleCount = [...pages.keys()].filter(page => !supplemental.has(page)).length
const articles = [...pages].map(([page, { content }]) =>
  `<article id="${escapeHtml(page)}"${page === entry ? '' : ' hidden'}>${content}</article>`
).join('\n')
const version = createHash('sha256').update(articles).digest('hex').slice(0, 12)
const generated = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', dateStyle: 'medium', timeStyle: 'short'
}).format(new Date())

const load = name => readFile(new URL(`./offline-reader/${name}`, import.meta.url), 'utf8')
const [template, css, js] = await Promise.all([load('index.html'), load('reader.css'), load('reader.js')])
const script = `${tokenize.toString()}\n${js}`.replaceAll('\r\n', '\n')
const scriptHash = createHash('sha256').update(script).digest('base64')
const slots = { css, script, scriptHash, articles, version, generated, articleCount }
const output = template.replace(/\{\{(\w+)\}\}/g, (_, name) => slots[name])
const dir = path.resolve('dist/offline')
const file = path.join(dir, 'Knowledge Hub.html')
const temporary = path.join(dir, `.${randomUUID()}.tmp`)
await mkdir(dir, { recursive: true })
try {
  await writeFile(temporary, output, { encoding: 'utf8', flag: 'wx' })
  await rename(temporary, file)
} finally {
  await rm(temporary, { force: true })
}
console.log(`离线知识库：${file}（${articleCount} 篇正式文章，版本 ${version}）`)
