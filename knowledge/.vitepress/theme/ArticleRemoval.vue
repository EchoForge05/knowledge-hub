<script setup>
import { computed, ref, watch } from 'vue'
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
watch(path, () => {
  expanded.value = false
  copyStatus.value = ''
})

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
</style>
