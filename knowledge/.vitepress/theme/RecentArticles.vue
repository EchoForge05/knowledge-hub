<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as articles } from './recent-articles.data'
</script>

<template>
  <section class="recent-articles" aria-labelledby="recent-articles-title">
    <h2 id="recent-articles-title">最近更新</h2>
    <ul>
      <li v-for="article in articles" :key="article.url">
        <a :href="withBase(article.url)">{{ article.title }}</a>
        <time :datetime="article.day">{{ article.day }}</time>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.recent-articles {
  max-width: 1152px;
  margin: 48px auto 0;
  padding: 0 24px;
}
.recent-articles h2 {
  font-size: 24px;
  font-weight: 600;
}
.recent-articles ul {
  margin-top: 16px;
}
.recent-articles li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.recent-articles a {
  color: var(--vp-c-brand-1);
}
.recent-articles a:hover {
  text-decoration: underline;
}
.recent-articles time {
  flex: none;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style>
