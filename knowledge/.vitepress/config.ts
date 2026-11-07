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
      { text: 'Java', items: [
        { text: 'ConcurrentHashMap', link: '/java/concurrent-hash-map' },
        { text: 'HashMap 的扩容与树化', link: '/java/hash-map-internals' },
        { text: 'Java 并发计数、可重入锁与死锁', link: '/java/concurrency-and-locks' },
        { text: 'Java 类初始化、对象构造与方法重载', link: '/java/initialization-and-overloading' },
        { text: '进程、线程与 Java 并发', link: '/java/processes-and-threads' }
      ] },
      { text: 'Spring', items: [
        { text: '应用入口注解', link: '/spring/spring-boot-application' },
        { text: '单例 Bean 与线程安全', link: '/spring/singleton-bean-thread-safety' },
        { text: 'Spring JDBC 与 InnoDB 转账事务', link: '/spring/jdbc-transactions-and-transfers' }
      ] },
      { text: '数据库与 SQL', items: [
        { text: 'SQL 查询基础', link: '/databases/select-basics' },
        { text: 'InnoDB 的 redo、undo 与 MVCC', link: '/databases/innodb-logs-and-mvcc' },
        { text: 'MySQL 深分页与联合索引优化', link: '/databases/mysql-pagination-and-indexes' },
        { text: 'MySQL InnoDB 与 Oracle：索引、事务和分页', link: '/databases/mysql-oracle-comparison' },
        { text: 'Redis 分布式锁', link: '/databases/redis-distributed-lock' }
      ] },
      { text: 'AI Agent', items: [
        { text: 'Agent 的 Prompt 与 Context', link: '/agent/prompt-and-context' }
      ] },
      { text: 'Git', items: [
        { text: '工作区与暂存区差异', link: '/git/diff-basics' },
        { text: '恢复工作区与暂存区', link: '/git/restore-basics' }
      ] },
      { text: 'Linux', items: [
        { text: 'head 文本查看', link: '/linux/head-basics' }
      ] },
      { text: '站点验证', collapsed: true, items: [
        { text: '阅读与搜索测试页', link: '/examples/reading-check' }
      ] }
    ].filter(group => group.items.length),
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
            // ASCII 标识符整词保留，其他 Unicode 字母/数字逐字；标点作为边界。
            // 避免 Node 与浏览器 Intl.Segmenter 词典差异导致同一查询无法命中。
            tokenize(text) {
              return text.match(/[A-Za-z0-9_]+|[\p{L}\p{N}]/gu) ?? []
            }
          },
          searchOptions: { prefix: true, fuzzy: false, combineWith: 'AND' }
        }
      }
    }
  }
})
