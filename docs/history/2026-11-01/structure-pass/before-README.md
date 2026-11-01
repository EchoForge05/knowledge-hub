# Knowledge Hub

Knowledge Hub 是一个按主题整理、阅读、搜索和持续维护个人技术知识的公开知识站。它将零散笔记和公开资料整理为可查阅、可追溯的 Markdown 文章，通过 Git 管理版本，使用 VitePress 构建并发布到 GitHub Pages。

项目以知识站为核心，日常由 Codex 协助检索已有内容、核查来源和整理文章，再经过检查与 PR 审核交付。阅读和本地构建无需模型 API；GreatRouter/gpt-6-sol 仅用于可选的手动草稿辅助。

[访问知识站](https://echoforge05.github.io/knowledge-hub/) · [浏览知识目录](../../../../knowledge/topics.md) · [查看完整使用教程](../../../handbook/usage.md)

## 主要功能

| 功能 | 说明 |
| --- | --- |
| 按主题阅读 | 按 Java、Spring、数据库与 SQL、Linux、Git 等分类浏览文章，支持代码高亮、表格、图片和文章内链，并可在手机上阅读。 |
| 全文搜索 | 使用站内本地搜索查找中文主题及代码标识符，可通过 Ctrl / Command + K 打开搜索并跳转文章。中文按字匹配，ASCII 标识符按整词匹配。 |
| 知识整理与维护 | 将笔记或公开资料交给 Codex，先搜索已有主题，再决定新建、增补、去重或处理矛盾；保留原理、示例、适用条件、风险、来源与待核实信息。 |
| Issue 人工接收 | 提供公开资料表单、无密钥的公开 Issue 导出、离线校验及显式接收命令，接收后由维护者审核并交给 Codex 整理。提交或接收不会自动生成文章或发布。 |
| 可选模型草稿 | 本机配置后可先预览、再显式调用 GreatRouter/gpt-6-sol 生成编程资料草稿；草稿需人工核查后入库，调用范围与费用须按当次授权执行。 |
| 版本管理与发布 | Markdown 与 Git 保存内容及修改历史，PR 检查文档、构建和站点产物，合并 main 后通过既有工作流发布到 GitHub Pages。 |

当前知识站 MVP（P2–P4）已上线并验收，收录 7 篇知识文章，包括 ConcurrentHashMap、Spring Boot 应用入口、Spring 单例 Bean 与线程安全、SQL 查询、Linux head 和 Git 差异检查及恢复操作。Issue 表单、导出与离线接收已实现，表单实际展示和真实 Issue 正向往返仍待验收；Issue 自动触发、模型自动整理及自动 PR 尚未实现。具体进度见[当前状态](../../../project/status.md)与[待办登记](../../../project/backlog.md)。

## 使用

[打开知识站](https://echoforge05.github.io/knowledge-hub/)：按分类阅读、全文搜索，支持代码、表格、图片和文章内链。

### 主要功能文档

| 功能 | 文档路径 | 作用 |
| --- | --- | --- |
| 阅读和搜索 | [knowledge/topics.md](../../../../knowledge/topics.md) | 知识分类与文章入口，查看已收录主题 |
| 完整使用教程 | [docs/handbook/usage.md](../../../handbook/usage.md) | 阅读搜索、提交笔记、Issue 操作、本地运行及常见问题 |
| 知识整理 | [docs/handbook/knowledge-workflow.md](../../../handbook/knowledge-workflow.md) | 如何提交资料，以及新建、增补、去重、矛盾处理与来源核查规则 |
| Issue 人工接收 | [docs/handbook/issue-intake.md](../../../handbook/issue-intake.md) | 公开表单、JSON 导出、离线预览、显式接收和人工交付步骤 |
| 可选模型草稿 | [docs/handbook/optional-ai.md](../../../handbook/optional-ai.md) | 本机配置、预览与发送命令、草稿位置和调用限制 |

### 使用教程

1. **阅读与搜索**：打开知识站，从“知识目录”选文章；点击搜索或按 Ctrl / Command + K，输入主题或代码标识符。无结果时尝试缩短关键词。
2. **提交或修订笔记**：在本仓库 Codex 对话中发送可公开资料，附来源、环境/版本和疑点；较长资料可放在 `inbox/local/` 并提供路径。要求先搜索已有主题，再整理更新。示例提示词见[完整使用教程](../../../handbook/usage.md#把笔记交给-codex)。
3. **通过 Issue 提交资料**：在[新建 Issue 页面](https://github.com/EchoForge05/knowledge-hub/issues/new/choose)选择“公开知识资料”并填写表单；维护者按[人工接收教程](../../../handbook/issue-intake.md)导出、离线校验、接收后交给 Codex 整理。提交或接收不会自动生成文章或发布。
4. **辅助生成草稿（可选）**：按[模型草稿教程](../../../handbook/optional-ai.md)准备本机配置，先预览，显式发送才调用 API；草稿需核查后再入库，日常维护可直接使用 Codex。

版本提示：Issue 表单和离线接收已通过 PR #5 合并 main；无密钥公开 Issue 导出及 Spring 新文已通过 [PR #6](https://github.com/EchoForge05/knowledge-hub/pull/6)合并并发布。表单展示及真实 Issue 正向往返仍待验收，详见[当前进度](../../../project/status.md)。

仓库和网站公开，只提交可公开或充分脱敏的内容；密钥与敏感原文不得入库。`inbox/local/` 是被 Git 忽略的本地暂存区，不提供备份或加密。模型请求可能计费，既有 3 次 Agent 验收额度已用尽，追加调用需另行授权。

## 开发

### 主要开发文档

以下路径均相对于仓库根目录；`knowledge/` 保存站点正文，`docs/` 保存使用、开发与项目文档。

| 文档路径 | 作用 |
| --- | --- |
| [AGENTS.md](../../../../AGENTS.md) | Agent 工作入口、授权边界、文档同步与 Git 约定 |
| [docs/handbook/development.md](../../../handbook/development.md) | 实施、验证、提交、文档同步和完成归档的详细规范 |
| [docs/handbook/site-development.md](../../../handbook/site-development.md) | Node/npm 环境、安装构建、文章与导航维护、搜索和检查范围 |
| [docs/handbook/markdown.md](../../../handbook/markdown.md) | Markdown 格式、链接、图片、来源和待核实标记规范 |
| [docs/handbook/git-setup.md](../../../handbook/git-setup.md) | 既定远程、身份、分支与当前 Git 交付状态 |
| [docs/handbook/github-delivery.md](../../../handbook/github-delivery.md) | PR 交付、CI/Pages 发布、故障定位与回退步骤 |
| [docs/project/requirements.md](../../../project/requirements.md) | 产品范围、验收标准及覆盖限制 |
| [docs/project/architecture.md](../../../project/architecture.md) | 技术栈、目录职责、搜索实现与部署架构 |
| [docs/engineering-guide.md](../../../engineering-guide.md) | 工程分析学习草稿：Git、Workflow 逐行讲解、发布链路、风险与待审核建议 |
| [docs/project/status.md](../../../project/status.md) | 当前已实现、已交付及待验收状态，恢复工作时先读 |
| [docs/project/decisions.md](../../../project/decisions.md) | 当前决策、授权范围与历史决策入口 |
| [docs/project/roadmap.md](../../../project/roadmap.md) | 后续推进顺序和阶段进入条件 |
| [docs/project/backlog.md](../../../project/backlog.md) | 未实现、待交付、未验证、待核实及未排期事项的统一明细 |
| [docs/project/completed-plans.md](completed-plans.md) | 已完成计划、验收证据、限制与遗留项去向 |
| [docs/project/discussion-log.md](../../../project/discussion-log.md) | 最近讨论、执行结果与续接信息 |
| [docs/history/README.md](../../README.md) | 历史决策、计划和执行过程索引；历史记录不代表当前授权 |

### 本地运行与检查

准备 Node 24.22.1 或更高的 24.x、npm 11，在仓库根目录执行：

```sh
npm ci
npm run dev
```

访问终端给出的 `/knowledge-hub/` 地址，默认是 `http://127.0.0.1:5173/knowledge-hub/`。本机运行时选择及文章维护步骤见[本地开发说明](../../../handbook/site-development.md)。

按修改范围执行检查；修改正文时还需复验相关导航、搜索和展示：

```sh
npm run check
npm run build
npm run check:site
```

日常修改通过短期分支和 PR 审核，提交、推送、合并及部署遵循当次授权和[开发约定](../../../handbook/development.md)。

Knowledge Hub保持静态，阅读和全文搜索无需模型。独立AI项目已迁至平级knowledge-agent目录，本仓库不维护其开发计划；现有功能归属见[功能清单](../../../project/function-inventory.md)。


项目组织：本项目现位于Knowledge Workspace父工程的knowledge-hub子目录，与knowledge-agent平级；各自独立Git，本站运行命令不变。
