# D053 文章下架本地验证

用户选择从知识库和公开站点下架，仅维护者可操作。文章页底部提供 GitHub 入口和路径复制。GitHub 手动流程在 main 的隔离检出中准备变更、检查站点并推送独立审核分支。维护者从任务摘要创建 PR，经既有审核及 Pages 发布后生效。手动运行需要仓库写权限。[GitHub 手动运行文档](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)

## 本地验证

- 起始 main 为 `493ae83`，工作区干净，开发在 `feat/article-removal`。
- 在隔离仓库预览 17 篇正式文章均成功且无写入；拒绝路径穿越、不存在的文章和站点验证示例。
- 隔离应用 Java 并发文章和 Linux 单篇分类下架。检查目录、空分类占位、侧栏、正文入链标签、历史永久链接、页面产物和搜索索引。隔离构建检查通过，共 20 个 HTML 和 712 处产物引用。
- 完整站点构建及产物检查通过，共 22 个 HTML 和 833 处引用。桌面和 390×844 Chrome 视口验证了入口展开、复制路径、打开正确的 GitHub 工作流 URL，以及目录和样例无入口。GitHub 页面由测试拦截，未触发远程任务。
- 最终文档检查覆盖 90 份 Markdown 和 497 处本地文件链接。

## 远程交付与验收

- 2026-11-07 用户要求验证后发布。核对发布 PR 的 head `e33e7db`、基线和 CI 后合并为 `05fd0cf`。Pages 的 build 与 deploy 均成功，本地 main 已快进到该发布提交。[发布 PR](https://github.com/EchoForge05/knowledge-hub/pull/16) · [CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/42380144687) · [Pages](https://github.com/EchoForge05/knowledge-hub/actions/runs/42380233634)
- 逐页验证 17 篇公开文章均返回 HTTP 200、显示下架入口且路径正确。首页、目录、指南和示例四页均返回 HTTP 200，均无下架入口。
- 维护者运行工作流，以 `linux/head-basics.md` 演练。准备变更、文档检查、构建、站点检查、推送审核分支及输出 PR 入口均成功。比较分支确认只有文章删除和目录、侧栏更新，测试提交为 `ee4da4d`。未创建测试 PR，已清理该临时分支。[下架演练](https://github.com/EchoForge05/knowledge-hub/actions/runs/42380336880)
- 正式站点保留全部文章。实际下架时由维护者选择文章并审核 PR，发布后检查对应页面和搜索结果。
