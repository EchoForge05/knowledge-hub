# 架构建议（待讨论，尚未实施）

日期：2026-10-31。免费公开方向已确认，框架、版本、MVP 精确范围尚未确认；当前仅规划和 Git 配置。开工前复核官方资料并锁定稳定版本。

## 推荐方向

建议采用“Markdown 正文 + 静态文档站 + GitHub 仓库 + PR 检查/合并后部署”。知识正文集中在 `knowledge/`，项目过程文档放 `docs/`；未来站点只构建明确允许发布的内容根目录。目录分离方便发布控制，但不提供保密能力；公开仓库中的所有已跟踪文件和历史仍可被读取。

Agent 在编辑环境读取原始记录和现有知识，直接维护 Markdown，不依赖网站后端。网站负责阅读与全文搜索。Issues 自动化日后复用相同规则，输出 PR；不在浏览器内放模型密钥。

## 框架初筛

| 候选 | 与本项目相关的特点 | 当前判断（建议） |
| --- | --- | --- |
| VitePress | Markdown 文档站，默认主题有浏览器端全文搜索，官方提供 Pages 部署说明。 | 优先做小样验证；可使用一套 Node 工具链。中文命中质量和自动导航仍需验证。 |
| MkDocs | Python 静态文档工具，Markdown + YAML，有主题与插件扩展。 | 简单文档方案的备选；选定主题、搜索及插件后评估整体依赖。 |
| Zensical | 官方提供导航、搜索配置，搜索实现与 MkDocs/Material 不同。 | 保留候选；不能假设所有 MkDocs 插件和搜索配置可直接迁移，需验证兼容性。 |
| Docusaurus | React 文档站，提供文档版本化、国际化等能力。 | 当前没有这些明确需求，暂不优先承担额外配置和定制成本。 |

比较是针对当前需求的工程判断，不是框架稳定性排名。建议最终只选一个框架、默认主题和最少插件，不同时维护多个站点实现。当前不安装依赖。

## Java 背景与选型

用户以 Java 为基础，但愿意采用更适合的框架。建议优先比较日常维护工作：写 Markdown、调整少量配置、执行构建，而不是按熟悉的业务后端语言选站点。静态知识站本身不需要 Spring Boot 服务；当前没有必须使用 Java 后端的需求。

下一轮建议重点比较 VitePress 与 MkDocs 的配置负担、中文搜索、导航和默认阅读体验，再决定是否保留 Zensical 候选。VitePress 的 Node 配置和 MkDocs 的 Python 工具链都属于需要学习的少量工具；是否容易维护要结合样本验证，不能仅靠语言印象定案。该比较顺序仍是建议。

## 需要先验证的设计点

- 中文搜索：不能把“支持全文搜索”视为中文分词、混合词和代码符号已达标。
- 自动导航：正文是主要事实来源；先验证目录派生导航或框架原生方式，确有缺口再写小工具，避免多份目录清单长期同步。
- 来源：为文档保留适用版本、来源和待核实状态；复用已有文档路径，后续 RAG 可按路径/标题切分，不提前引入向量库。
- 知识更新：检索相近主题与别名，比较内容后修改；相同输入重跑应无实质变更。允许因核查新增更正，但说明依据。
- 边界：知识内容不能要求 Agent 修改自身权限或执行代码；Issues 流程不得根据输入任意修改 Actions。

## 部署与成本

用户已选择免费的公开方案，目前无隐私内容。建议采用 GitHub Free 的公开仓库与 GitHub Pages，使用默认域名，不购买服务器或域名，不设计登录系统。GitHub 官方明确 Free 支持公开仓库使用 Pages。仓库目标为 `EchoForge05/knowledge-hub`，实际部署仍在后续阶段。

若将来加入私密内容，需另行设计访问控制或分离存储；当前无需引入企业私有 Pages 方案。

静态站不需要常驻服务器，但不能承诺全部免费：Actions 配额、账号计划、模型 API、存储均可能产生费用。先完成本地 Codex 工作流，再对 Issues 单次输入大小、次数、时长、重试和费用设置上限。CI 只验证不调用 AI，AI 整理与部署权限分开；这些均为后续设计要求。

## 官方参考

于 2026-10-31 查阅；版本与权限条件可能变化。

- [VitePress 本地搜索](https://vitepress.dev/reference/default-theme-search.html)；[部署说明](https://vitepress.dev/guide/deploy)。官网当前主线出现预发布版本，落地时必须主动选择稳定版文档和依赖。
- [MkDocs 官方介绍](https://www.mkdocs.org/)。
- [Zensical 导航](https://zensical.org/docs/setup/navigation/)；[搜索及配置差异](https://zensical.org/docs/setup/search/)。
- [Docusaurus 官方介绍](https://docusaurus.io/docs)。
- [GitHub Pages 概述及账号条件](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)；[Pages 站点可见性](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)。
