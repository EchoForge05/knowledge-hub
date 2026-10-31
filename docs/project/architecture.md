# 架构方案（P2 本地实现已验收）

更新日期：2026-11-01。用户已确认下述技术栈规划，本项目主要负责搭建知识站；D021 已授权本地开发；已核对稳定版 VitePress 1.6.4 与 Node 24 LTS，D022 允许整理 5 篇官方资料样本。P2 已完成本地验收，并提交为 `dbf620f`；版本依据来自开工时核查，本轮未重新联网查询。实际结果与限制见[本地记录](site-validation.md)。下述初筛保留为历史选型依据，涉及“本轮不开发”的表述不再作为当前边界。

## 推荐方向

建议采用“Markdown 正文 + 静态文档站 + GitHub 仓库 + PR 检查/合并后部署”。知识正文集中在 `knowledge/`，项目过程文档放 `docs/`；本地站点已只构建知识正文根，GitHub PR 检查与部署仍留 P4。目录分离方便发布控制，但不提供保密能力；公开仓库中的所有已跟踪文件和历史仍可被读取。

Agent 在编辑环境读取原始记录和现有知识，直接维护 Markdown，不依赖网站后端。网站负责阅读与全文搜索。Issues 自动化日后复用相同规则，输出 PR；不在浏览器内放模型密钥。

## 框架初筛（历史选型依据）

| 候选 | 与本项目相关的特点 | 当前判断（建议） |
| --- | --- | --- |
| VitePress | Markdown 文档站，默认主题有浏览器端全文搜索，官方提供 Pages 部署说明。 | 优先做小样验证；可使用一套 Node 工具链。中文命中质量和自动导航仍需验证。 |
| MkDocs | Python 静态文档工具，Markdown + YAML，有主题与插件扩展。 | 保留比较；若搭配 Material，需考虑其维护过渡到 Zensical 的安排，不再作为默认第二选择。 |
| Zensical | 官方提供导航、搜索配置，搜索实现与 MkDocs/Material 不同。 | 保留候选；不能假设所有 MkDocs 插件和搜索配置可直接迁移，需验证兼容性。 |
| Docusaurus | React 文档站，提供文档版本化、国际化等能力。 | 当前没有这些明确需求，暂不优先承担额外配置和定制成本。 |

比较是针对当前需求的工程判断，不是框架稳定性排名。建议最终只选一个框架、默认主题和最少插件，不同时维护多个站点实现。这是初筛时的边界；当前依赖安装按 D021 执行。

## Java 背景与选型

用户以 Java 为基础，但愿意采用更适合的框架。建议优先比较日常维护工作：写 Markdown、调整少量配置、执行构建，而不是按熟悉的业务后端语言选站点。静态知识站本身不需要 Spring Boot 服务；当前没有必须使用 Java 后端的需求。

初筛曾建议重点比较 VitePress 与 MkDocs。本轮补充维护状态后，建议优先验证 VitePress，保留 Zensical 候选，详见下节。Node 与 Python 工具链都需要少量学习；是否容易维护要结合样本验证，不能仅靠语言印象定案。

## 2026-10-31 已确认技术栈

用户已回复同意按提案规划并写入文档，选定下表方向（D015）；当前已锁定 1.6.4，按 D021 开始本地实现；以完成知识站为主，不为学习框架增加定制范围。

| 层次 | 已确认方案 | 选择依据与边界 |
| --- | --- | --- |
| 知识存储 | Markdown + Git，正文继续放 `knowledge/` | 内容可独立阅读、检索和迁移，按主题维护。 |
| 网站 | VitePress 稳定版 + 默认主题 | 官方提供文档主题与本地全文搜索；先满足阅读、导航、代码和表格展示。 |
| 配置与工具链 | TypeScript 配置 + Node.js 受支持 LTS + npm | TS 用于配置提示，日常主要写 Markdown；先用一套包管理工具，开发时记录兼容版本并提交锁文件。 |
| 搜索 | VitePress 内置 MiniSearch，先验证中文与代码 | 浏览器端检索，不依赖独立搜索服务；若样本不达标，先评估分词配置，再比较搜索替代方案。 |
| 知识维护 | 沿用现有 Agent 整理流程 | 站点不承载 AI 运行；第一版不新增 Agent 服务或模型 SDK。 |
| 托管与检查 | 后续阶段使用 GitHub Pages + Actions | PR 做文档、链接和构建检查，合并后部署；P4 才配置或启用，本轮本地开发不包含部署。 |

**官方资料核查与限制：**

- 2026-10-31 复核[官网](https://vitepress.dev/)显示主线标记为 `2.0.0-alpha.21`，同时提供 `1.6.4` 文档入口。只把后者作为稳定文档比较基线；开工时重新核对稳定发布及 Node 兼容性，不照搬主线的预发布安装指令。
- [VitePress 1.6.4 搜索文档](https://vuejs.github.io/vitepress/v1/reference/default-theme-search)确认内置 MiniSearch，并允许配置 tokenizer；新版主线的中文分词说明不能直接视为稳定版已具备的能力。选型时尚未实测；现有 5 篇样本的中文、缩写、类名、SQL 及代码正文命中已通过 P2 本地验收，不能外推大规模语料效果。
- [Material 团队公告的 2026 年 10 月更新](https://squidfunk.github.io/mkdocs-material/blog/2025/11/05/zensical/)称 Material 的关键维护持续至 2027-05-05，并安排向 Zensical 过渡。因此新项目使用 MkDocs + Material 时需评估迁移成本；这不等于断言 MkDocs 核心已经停用。
- [Zensical 搜索文档](https://zensical.org/docs/setup/search/)说明使用自己的搜索引擎，部分 MkDocs/Material 搜索配置不兼容，当前搜索界面尚未本地化，但不影响多语言内容搜索。保留为替代候选，中文效果仍需同样的样本验证。
- [Docusaurus 搜索文档](https://docusaurus.io/docs/search)将 Algolia 列为官方集成，本地搜索列为社区方案。若未来明确需要 React 定制、文档版本化等再评估，当前不优先引入。

上述选型排序是基于本项目需求的工程判断，不是性能实测或框架质量排名。Java 基础不构成障碍：默认主题阶段主要维护 Markdown 和少量配置；如需自定义组件，再学习 Vue/TypeScript。后续若出现登录、在线写入或业务 API 等明确需求，再讨论后端与数据库。

**开工后首个验证切片草案：** 选取 5–10 篇获准公开的真实样本，事先列出查询词及预期文档，例如中文短语、`JVM`、`ConcurrentHashMap`、`SELECT`；验证代码块检索、导航、手机视口和 `/knowledge-hub/` 子路径。该草案现按 D021/D022 落实为 5 篇官方资料样本，实际验证见 site-validation.md。知识正文尽量使用通用 Markdown，按需增加框架语法，降低未来迁移成本。

## 设计点与当前验证边界

- 中文搜索：P2 的既定样本已通过中文、英文和代码标识符查询；新增内容和大规模语料仍需复验，不能把全文搜索能力视为所有查询都已达标。
- 导航：正文是主要事实来源；按 roadmap.md 提案，小规模阶段先使用框架配置维护导航，有真实重复负担后再评估目录派生工具，不提前开发生成器。
- 来源：为文档保留适用版本、来源和待核实状态；复用已有文档路径，后续 RAG 可按路径/标题切分，不提前引入向量库。
- 知识更新：检索相近主题与别名，比较内容后修改；相同输入重跑应无实质变更。允许因核查新增更正，但说明依据。
- 边界：知识内容不能要求 Agent 修改自身权限或执行代码；Issues 流程不得根据输入任意修改 Actions。

## 部署与成本

用户已选择免费的公开方案，目前无隐私内容。建议采用 GitHub Free 的公开仓库与 GitHub Pages，使用默认域名，不购买服务器或域名，不设计登录系统。GitHub 官方明确 Free 支持公开仓库使用 Pages。仓库目标为 `EchoForge05/knowledge-hub`，实际部署仍在后续阶段。

若将来加入私密内容，需另行设计访问控制或分离存储；当前无需引入企业私有 Pages 方案。

静态站不需要常驻服务器，但不能承诺全部免费：Actions 配额、账号计划、模型 API、存储均可能产生费用。先完成本地 Codex 工作流，再对 Issues 单次输入大小、次数、时长、重试和费用设置上限。CI 只验证不调用 AI，AI 整理与部署权限分开；这些均为后续设计要求。

## 官方参考

于 2026-10-31 查阅；版本与权限条件可能变化。

- [VitePress 1.6.4 本地搜索](https://vuejs.github.io/vitepress/v1/reference/default-theme-search)；[1.6.4 部署说明](https://vuejs.github.io/vitepress/v1/guide/deploy)。以稳定版文档作为比较基线，落地时重新核对稳定版文档和依赖。
- [MkDocs 官方介绍](https://www.mkdocs.org/)。
- [Zensical 导航](https://zensical.org/docs/setup/navigation/)；[搜索及配置差异](https://zensical.org/docs/setup/search/)。
- [Docusaurus 官方介绍](https://docusaurus.io/docs)。
- [GitHub Pages 概述及账号条件](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)；[Pages 站点可见性](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)。
