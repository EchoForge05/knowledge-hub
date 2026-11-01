# 当前架构

正文位于 knowledge/，由 VitePress 构建为静态站点，发布到 GitHub Pages。docs/ 存项目与维护说明，docs/history/ 存历史过程；公开仓库的历史同样公开，目录分离不提供保密能力。

| 部分 | 实现 |
| --- | --- |
| 正文/历史 | Markdown + Git，按主题维护 |
| 网站 | VitePress 1.6.4、默认主题、TypeScript 配置 |
| 运行时 | Node 24.22.1 / npm 11.19.1 |
| 搜索 | 内置 MiniSearch；ASCII 标识符整词、其他 Unicode 字母/数字逐字、标点分隔 |
| 检查 | 文档/链接 → 构建 → 页面/资源/锚点 |
| 发布 | main 成功构建后上传并部署；部署环境仅 main，HTTPS |

PR 检查只读，deploy 任务独立获得 Pages/OIDC 写权限；并发取消旧运行，部署前核对 main SHA。配置和真实发布已验证，生产故障/并发动态演练未执行。

Agent 在编辑环境整理 Markdown，通过 PR 交付，不依赖站点后端。当前没有数据库、模型 SDK、RAG 或 Issues AI 服务；模型密钥不得进入浏览器。

D033/D034 可选本地草稿命令使用Node内置fetch，默认预览；显式调用仅发送指定编程资料，输出到私有草稿区供Codex审核，不改库/自动发布。无新增模型SDK或站点后端；gpt-6-sol国内接入已完成3份公开资料验收，直连模式模型API未测，见[辅助入口](../handbook/optional-ai.md)。

中文逐字查询不保证短语连续性，不承诺任意子串、大规模相关性。已知开发依赖 3 项风险未修复，等待兼容补丁或迁移范围确认。选型依据、官方来源和版本核查历史见[原架构记录](../history/2026-11-01/project/architecture.md)。
