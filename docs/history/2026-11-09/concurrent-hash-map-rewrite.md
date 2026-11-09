# ConcurrentHashMap 文章重写与本地验证

2026-11-09，用户通过 Codex 文章维护入口要求本地重写 [ConcurrentHashMap 的基本使用边界](../../../knowledge/java/concurrent-hash-map.md)。正文改为基础概念和 8 道面试问答，标题、文章路径与导航入口沿用。API 契约对照 Java SE 21 官方文档，分段锁、桶内更新、树化和扩容对照 OpenJDK 7u、8u 源码。选题按常见面试考点组织。

## 检查结果

- Node 24.22.1 下文档检查、VitePress 生产构建和站点产物检查通过。仓库检索未发现指向旧正文小节的链接。
- 本地生产预览通过 Chrome 验证知识目录、侧栏、3 条正文入链和 2 条正文出链。搜索「弱一致」「ConcurrentHashMap」「computeIfAbsent」及回归词「单例 bean」均命中预期文章第 1 条，点击后抵达对应锚点。390 像素视口无页面横向溢出。
- 从文章提取计数示例，在 Temurin JDK 8 编译运行。4 个线程各对同一键更新 10,000 次，再加 1 后得到 40,001，新键首次计数为 1。Java SE 21 的 API 行为依据文档核查。
- 官方来源可读取。当前环境访问 GitHub Pages 原地址失败，线上页面未复核。

本轮起始分支为 `main`，收尾时共享工作区位于 `fix/offline-content-version`。本文及配套记录保留为本地未提交变更。下一步由用户查看文章差异。
