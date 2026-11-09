import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { createContentLoader } from 'vitepress'

const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' })

export default createContentLoader('*/*.md', {
  transform(pages) {
    return pages.filter(({ url }) => !url.startsWith('/examples/')).map(({ url, src }) => {
      const file = resolve('knowledge', url.slice(1).replace(/\.html$/, '.md'))
      const git = (args: string[]) =>
        execFileSync('git', [...args, '--', file], { encoding: 'utf8' }).trim()
      const committed = git(['log', '-1', '--format=%ct'])
      const changed = git(['status', '--porcelain'])
      const updated = committed && !changed ? Number(committed) * 1000 : statSync(file).mtimeMs
      const title = src?.match(/^# (.+)$/m)?.[1]?.trim() ?? url
      return { url, title, updated, day: date.format(updated) }
    }).sort((a, b) => b.updated - a.updated || a.url.localeCompare(b.url))
  },
  includeSrc: true
})
