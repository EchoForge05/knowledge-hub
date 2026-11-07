import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ArticleRemoval from './ArticleRemoval.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-after': () => h(ArticleRemoval)
  })
}
