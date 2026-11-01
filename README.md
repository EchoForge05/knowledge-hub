# Knowledge Hub

按主题阅读、搜索和维护个人知识。

**知识站已上线，P2–P4 的 MVP 验收完成；P5 等待 AI 服务确认。**

- [打开知识站](https://echoforge05.github.io/knowledge-hub/)
- [当前进度](docs/project/status.md) · [后续计划](docs/project/roadmap.md)
- [阅读与内容维护](docs/handbook/site-development.md) · [发布与回退](docs/handbook/github-delivery.md)
- [历史与验收证据](docs/history/README.md)

网站支持分类导航、全文搜索、代码/表格/图片展示，现有 6 篇官方资料摘要。知识维护已验证新建、增补、去重和矛盾处理。

本地需 Node 24/npm 11：`npm ci`、`npm run dev`；检查用 `npm run check`，构建后运行 `npm run check:site`。访问 `/knowledge-hub/`，本机运行时设置见[开发说明](docs/handbook/site-development.md)。

仓库和网站公开，只提交可公开内容；密钥与敏感原文不得入库。日常修改通过短期分支和 PR 审核，当前 [PR #2](https://github.com/EchoForge05/knowledge-hub/pull/2) 交付文档与验收更新，未自动合并。
