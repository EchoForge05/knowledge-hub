# 当前架构

## 运行与维护关系

读者 → GitHub Pages静态页面 → 浏览器本地搜索索引。页面和索引由Markdown构建，不需要数据库或AI后端。

本地阅读由同一份 Markdown 生成单个 HTML，内嵌正文、图片和样式。浏览器打开文件时从正文建立段落搜索索引，通过片段链接切换文章。Pages 构建也生成该文件，由站点使用指南提供下载。

维护者/Codex → 修改知识与导航 → 本地检查 → PR/CI审核 → 合并main → Pages发布。Issue工具只导出和接收资料；可选草稿命令只生成本地待审核内容，均不直接发布。

## 目录与主要文件

项目位于Knowledge Workspace的knowledge-hub子目录；平级knowledge-agent独立维护。以下路径相对于本仓库根目录。

| 路径 | 职责与何时使用 |
| --- | --- |
| scripts/file-intake.mjs、file-intake.test.mjs | 离线扫描、输入及目标文章哈希回执核对与测试；正文整理由当前 Codex 会话完成 |
| docs/handbook/file-import.md、inbox/import-example.txt | 文件导入操作协议与输入示例 |
| README.md | 用户总入口：功能、使用、架构和待办路由 |
| AGENTS.md | Agent恢复流程、规则、授权及安全边界 |
| knowledge/ | 对外知识正文；按java、spring、databases、linux、git等主题分类 |
| knowledge/index.md、topics.md、guide.md | 站点首页、分类目录、站内阅读指南 |
| knowledge/.vitepress/config.ts | 标题、base、导航、侧栏和全文搜索分词配置；新增文章时核对目录与侧栏 |
| knowledge/.vitepress/theme/、scripts/remove-article.mjs | 文章页 Codex 请求与 GitHub 下架入口、已跟踪正文和导航的本地删除工具 |
| .github/workflows/remove-article.yml | 维护者手动触发，验证后推送待审核的下架分支 |
| knowledge/.vitepress/dist/、cache/ | 生成的站点与缓存，不手工编辑、不提交 |
| docs/README.md、docs/handbook/ | 开发维护导航和操作手册；usage是完整使用教程 |
| docs/project/architecture.md、requirements.md | 当前架构/文件说明与产品范围/验收要求 |
| docs/project/roadmap.md、backlog.md | 当前顺序与全部未完成明细；backlog保留状态及进入条件 |
| scripts/build-offline.mjs、scripts/offline-reader/ | 生成单文件离线阅读包的脚本和阅读界面 |
| scripts/watch-offline.mjs | 可选的本地文件监听，保存知识内容后调用同一生成器 |
| docs/project/function-inventory.md | Hub与独立Agent的既有功能归属 |
| docs/project/status.md、decisions.md、discussion-log.md | Agent内部现状、有效决策与最近执行续接 |
| docs/project/evidence/ | 历史验收JSON、截图和样本，仅按需核查 |
| docs/history/ | 已完成计划、旧规则/讨论和验收记录；不属于日常阅读步骤 |
| docs/engineering-guide.md | 工程学习分析材料，其中建议尚待审核 |
| scripts/check-docs.mjs、check-site.mjs | Markdown结构/文件链接检查；构建后页面/资源/锚点检查 |
| scripts/issue-export.mjs、issue-intake.mjs | 显式公开Issue导出、离线预览/接收；对应test文件提供离线测试 |
| scripts/ai-draft.mjs、ai-draft.test.mjs | 可选本地草稿及离线测试，不属于站点运行依赖 |
| .github/ISSUE_TEMPLATE/knowledge.yml | 公开资料提交表单 |
| .github/workflows/check.yml、pages.yml | PR/分支检查与main站点发布 |
| package.json、package-lock.json | 命令、运行时要求与精确依赖锁定 |
| .nvmrc、.npmrc | Node版本提示与npm项目配置 |
| .gitignore、.gitattributes | 私有/产物忽略规则与文件属性 |
| .env.example | 可公开的模型配置示例，不含真实密钥 |
| .env.local、.private/、inbox/local/ | 本机忽略的配置、草稿/工具和输入；不加密、不随Git备份 |
| inbox/README.md | 资料暂存使用边界 |

目录按功能职责保持稳定；历史资料集中归档，不为减少目录数而合并运行代码、知识正文和私有输入。图片引用以文章实际路径为准。

## 技术与限制

正文位于 knowledge/，由 VitePress 构建为静态站点，发布到 GitHub Pages。docs/ 存项目与维护说明，docs/history/ 存历史过程；公开仓库的历史同样公开，目录分离不提供保密能力。

| 部分 | 实现 |
| --- | --- |
| 正文/历史 | Markdown + Git，按主题维护 |
| 网站 | VitePress 1.6.4、默认主题、TypeScript 配置 |
| 运行时 | Node 24.22.1 / npm 11.19.1 |
| 搜索 | 内置 MiniSearch；ASCII 标识符整词、其他 Unicode 字母/数字逐字、标点分隔 |
| 离线阅读 | 与网站复用搜索分词；独立段落排序、单文件打包及相对片段跳转 |
| 检查 | 文档/链接 → 构建 → 页面/资源/锚点 |
| 发布 | main 成功构建后上传并部署；部署环境仅 main，HTTPS |

PR 检查只读，deploy 任务独立获得 Pages/OIDC 写权限；并发取消旧运行，部署前核对 main SHA。配置和真实发布已验证，生产故障/并发动态演练未执行。

Agent 在编辑环境整理 Markdown，通过 PR 交付，不依赖站点后端。当前没有数据库、模型 SDK、RAG 或 Issues AI 服务；模型密钥不得进入浏览器。

D033/D034 可选本地草稿命令使用Node内置fetch，默认预览；显式调用仅发送指定编程资料，输出到私有草稿区供Codex审核，不改库/自动发布。无新增模型SDK或站点后端；gpt-6-sol国内接入已完成3份公开资料验收，直连模式模型API未测，见[辅助入口](../handbook/optional-ai.md)。

中文逐字查询不保证短语连续性，不承诺任意子串、大规模相关性。已知开发依赖 3 项风险未修复，等待兼容补丁或迁移范围确认。选型依据、官方来源和版本核查历史见[原架构记录](../history/2026-11-01/project/architecture.md)。

D043/D044边界：独立Agent规划已迁出本仓库。本站仍为静态架构，普通阅读/全文搜索无需模型，没有新增后端、向量索引或跨项目构建依赖。既有可选草稿和Issue工具暂留原入口，未迁移代码或配置。
