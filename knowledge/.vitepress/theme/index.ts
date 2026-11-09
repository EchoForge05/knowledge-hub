import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ArticleRemoval from './ArticleRemoval.vue'
import RecentArticles from './RecentArticles.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-features-after': () => h(RecentArticles),
    'doc-after': () => h(ArticleRemoval)
  })
}
