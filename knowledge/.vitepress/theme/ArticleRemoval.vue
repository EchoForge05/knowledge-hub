<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { page, theme } = useData()
const path = computed(() => page.value.relativePath)
const eligible = computed(() => {
  if (!/^[a-z][a-z0-9-]*\/[a-z0-9][a-z0-9-]*\.md$/.test(path.value) ||
      path.value.startsWith('examples/')) return false
  const route = '/' + path.value.slice(0, -3)
  return theme.value.sidebar.some(group => group.items.some(item => item.link === route))
})
const expanded = ref(false)
const copyStatus = ref('')
const editing = ref(false)
const editInput = ref(null)
const editRequest = ref('')
const codexStatus = ref('')
const manualRequest = ref('')
watch(path, () => {
  expanded.value = false
  copyStatus.value = ''
  editing.value = false
  editRequest.value = ''
  codexStatus.value = ''
  manualRequest.value = ''
})

async function openEditor() {
  editing.value = true
  await nextTick()
  editInput.value?.focus()
}

async function copyRequest(action, instructions = '') {
  const article = path.value
  const details = instructions.trim()
  if (action === '修改' && !details) return
  const request = [
    `请在本地${action}这篇 Knowledge Hub 文章。`,
    `文章：${page.value.title}`,
    `仓库：EchoForge05/knowledge-hub`,
    `文件：knowledge/${article}`,
    `网址：https://echoforge05.github.io/knowledge-hub/${article.slice(0, -3)}.html`,
    '',
    action === '删除'
      ? '请下架这篇文章，检查并同步知识目录、侧栏和相关链接，完成验证后给我看变更。'
      : `请按以下要求修改，检查相关链接并验证后给我看变更。\n\n${details}`
  ].join('\n')

  manualRequest.value = ''
  codexStatus.value = ''
  try {
    await navigator.clipboard.writeText(request)
    if (path.value === article) codexStatus.value = `已复制${action}请求，请粘贴到本项目的 Codex 对话并发送。`
  } catch {
    if (path.value !== article) return
    manualRequest.value = request
    codexStatus.value = '自动复制不可用，请手动复制下方请求。'
  }
}

async function copyPath() {
  const article = path.value
  try {
    await navigator.clipboard.writeText(article)
    if (path.value === article) copyStatus.value = '已复制'
  } catch {
    if (path.value === article) copyStatus.value = '请手动复制路径'
  }
}
</script>

<template>
  <section v-if="eligible" class="article-removal" aria-labelledby="codex-article-heading">
    <h2 id="codex-article-heading">交给 Codex 维护</h2>
    <p>请求会自动带上文章标题、文件路径和链接。复制后，粘贴到本项目的 Codex 对话并发送。</p>
    <div class="article-actions">
      <button type="button" @click="copyRequest('删除')">复制删除请求</button>
      <button type="button" :aria-expanded="editing" @click="openEditor">填写修改要求</button>
    </div>
    <form v-if="editing" @submit.prevent="copyRequest('修改', editRequest)">
      <label for="codex-edit-request">你希望怎么改？</label>
      <textarea id="codex-edit-request" ref="editInput" v-model="editRequest" rows="3"
        placeholder="例如：重写第二节，补一个例子；或移到「分布式系统」分类。" />
      <button type="submit" :disabled="!editRequest.trim()">复制修改请求</button>
    </form>
    <p v-if="codexStatus" role="status">{{ codexStatus }}</p>
    <textarea v-if="manualRequest" :value="manualRequest" rows="7" readonly
      aria-label="可手动复制的 Codex 请求" @focus="$event.target.select()" />
  </section>
  <details v-if="eligible" :open="expanded" class="article-removal"
    @toggle="expanded = $event.target.open">
    <summary>下架此文章</summary>
    <p>仅限仓库维护者。在 GitHub 中运行下架流程，将下列路径填入 article。合并生成的下架变更后，公开站点会在下次发布时移除文章。</p>
    <p>
      <code>{{ path }}</code>
      <button type="button" @click="copyPath">复制路径</button>
      <span role="status">{{ copyStatus }}</span>
    </p>
    <a href="https://github.com/EchoForge05/knowledge-hub/actions/workflows/remove-article.yml"
      target="_blank" rel="noopener" @click="copyPath">复制路径并打开 GitHub 下架流程</a>
  </details>
</template>

<style scoped>
.article-removal { margin-top: 24px; padding: 12px 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px; font-size: 14px; }
summary { cursor: pointer; }
p { margin: 8px 0; }
code { overflow-wrap: anywhere; }
button, a { margin-inline-end: 8px; color: var(--vp-c-brand-1); text-decoration: underline; }
button { margin-inline-start: 8px; }
h2 { font-size: 16px; font-weight: 600; }
.article-actions { display: flex; flex-wrap: wrap; gap: 8px; }
section button {
  margin: 0;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  text-decoration: none;
}
section button:disabled { opacity: 0.55; cursor: not-allowed; }
form { margin-top: 12px; }
textarea {
  display: block;
  width: 100%;
  margin: 6px 0 8px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  resize: vertical;
}
</style>
