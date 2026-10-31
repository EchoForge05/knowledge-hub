import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Knowledge Hub',
  description: '按主题积累，随时查阅的个人知识站。',
  base: '/knowledge-hub/',
  srcExclude: ['README.md'],
  cleanUrls: false,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '知识目录', link: '/topics' },
      { text: '使用指南', link: '/guide' }
    ],
    sidebar: [
      { text: '开始阅读', items: [
        { text: '知识目录', link: '/topics' },
        { text: '使用指南', link: '/guide' }
      ] },
      { text: 'Java', items: [{ text: 'ConcurrentHashMap', link: '/java/concurrent-hash-map' }] },
      { text: 'Spring', items: [{ text: '应用入口注解', link: '/spring/spring-boot-application' }] },
      { text: '数据库与 SQL', items: [{ text: 'SQL 查询基础', link: '/databases/select-basics' }] },
      { text: 'Git', items: [{ text: '工作区与暂存区差异', link: '/git/diff-basics' }] },
      { text: 'Linux', items: [{ text: 'head 文本查看', link: '/linux/head-basics' }] },
      { text: '站点验证', items: [
        { text: '阅读与搜索测试页', link: '/examples/reading-check' }
      ] }
    ],
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索知识', buttonAriaLabel: '搜索知识' },
          modal: {
            noResultsText: '没有找到相关知识',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '关闭搜索',
            displayDetails: '显示详细结果',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        },
        miniSearch: {
          options: {
            // 同一函数用于构建索引和浏览器查询，无外部分词服务。
            tokenize(text) {
              return Array.from(
                new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(text),
                part => part.isWordLike ? part.segment : ''
              ).filter(Boolean)
            }
          },
          searchOptions: { prefix: true, fuzzy: false, combineWith: 'AND' }
        }
      }
    }
  }
})
