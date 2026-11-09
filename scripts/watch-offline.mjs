import { spawnSync } from 'node:child_process'
import { watch } from 'node:fs'
import { sep } from 'node:path'

let timer
const watcher = watch('knowledge', { recursive: true }, (_event, filename) => {
  if (filename?.split(sep)[0] === '.vitepress') return
  clearTimeout(timer)
  timer = setTimeout(build, 300)
})

watcher.on('error', error => {
  clearTimeout(timer)
  watcher.close()
  console.error('离线更新监听已停止：', error.message)
  process.exitCode = 1
})

function build() {
  const result = spawnSync(process.execPath, ['scripts/build-offline.mjs'], { stdio: 'inherit' })
  if (result.status !== 0) {
    if (result.error) console.error(result.error.message)
    console.error('离线副本未更新，已有文件可继续阅读。下次保存时会重试。')
  }
}

console.log('正在监听 knowledge/，保存后自动刷新离线 HTML。按 Ctrl+C 停止。')
build()
