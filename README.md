# 个人知识库 · Knowledge Hub

通过网页阅读和搜索知识，通过 Agent 整理零散记录，通过 GitHub 长期保存修改历史。

本项目主要负责搭建和维护知识站，优先完成阅读、导航、搜索、内容展示与发布；知识整理流程作为配套。

**当前阶段：P2 本地知识站已完成验收。已有 VitePress 工程与 5 篇官方资料样本，构建、搜索、桌面和手机视口检查通过；下一阶段为 P3，未启用自动化或部署。**

## 从这里开始

- [需求与范围](docs/project/requirements.md)：用户目标、已确认约束和本次工作边界。
- [项目状态](docs/project/status.md)：实际完成情况、验证记录和下一步入口。
- [决策记录](docs/project/decisions.md)：已确认决策、待讨论问题。
- [架构方案](docs/project/architecture.md)：已确认的 VitePress 技术栈及当前实施记录。
- [开发计划](docs/project/roadmap.md)：P1–P5 任务、交付里程碑、样本与验收矩阵；本地开发已获授权，外部交付按阶段推进。
- [完成计划归档](docs/project/completed-plans.md)：已完成计划、验收结果与证据。
- [开发规范](docs/handbook/development.md)：每次修改时自动更正与同步文档、规范落盘、计划维护和完成归档流程。
- [讨论记录](docs/project/discussion-log.md)：后续讨论和变更的持久记录。
- [Agent 规则](AGENTS.md)：新会话必须先读的工作约定。
- [知识整理流程](docs/handbook/knowledge-workflow.md)与 [Markdown 规范](docs/handbook/markdown.md)。

## 基础目录

```text
knowledge-hub/
├── AGENTS.md                # Agent 入口与执行规则
├── README.md                # 项目入口
├── docs/
│   ├── project/             # 需求、架构建议、决策、计划、状态、讨论
│   └── handbook/            # 知识维护与写作规则
├── knowledge/               # 网站内容根，包含官方资料入门摘要
│   ├── java/
│   ├── spring/
│   ├── databases/           # 数据库与 SQL
│   ├── linux/
│   ├── git/
│   ├── ai-agent/
│   ├── software-engineering/
│   ├── banking/
│   └── assets/images/
└── inbox/                   # 输入说明；本地临时原文放入被忽略的 local/ 子目录
```

本地运行需 Node 24 LTS / npm 11：`npm ci`、`npm run dev`；构建用 `npm run build`，预览用 `npm run preview`，文档检查用 `npm run check`。访问服务输出地址下的 `/knowledge-hub/`。本机默认 Node 14 不兼容，运行前参见[本地开发说明](docs/handbook/site-development.md)选择运行时。验收结果见[本地站点验收](docs/project/site-validation.md)。

## 新会话续接

在本目录开启 Codex 会话，要求先阅读 `AGENTS.md`，再读取 `docs/project/status.md`、`decisions.md` 和 `roadmap.md`。只有明确确认的内容才算已定案；建议、草案与未验证功能必须保留状态标识。

## Git 与远程仓库

本地仓库采用 `main` 与短期功能分支。已确认目标为公开仓库 `EchoForge05/knowledge-hub`，使用 HTTPS，配置与连接的实际状态见 [Git 配置记录](docs/handbook/git-setup.md)。基础提交 `1a6cb54` 与文档提交 `a102ca7` 已完成；P2 成果及中文提交规范已提交为 `dbf620f feat: 搭建本地知识站并落实验证后中文提交规范`。后续自动更正与同步文档；按 D023，新增开发验证成功后可做一次本地提交，每次用中文说明更新内容，不自动推送。提交者为 `EchoForge05`，本仓库使用基于已核实 GitHub 账号 ID 的 noreply 邮箱。后续知识变更由 Agent 整理并检查、用户审核 PR 合并。

优先交付 MVP，范围与验收草案见 [阶段计划](docs/project/roadmap.md)。技术栈已确认：Markdown/Git、VitePress 稳定版与默认主题、TypeScript 配置、Node.js LTS/npm、内置 MiniSearch；后续 GitHub Pages/Actions。当前锁定 VitePress 1.6.4，实际环境与搜索验证见本地验收记录。

## 隐私

用户目前的个人知识不涉及隐私，选择免费的公开仓库与公开网站方案。日后如果输入含敏感内容，应重新确认发布边界；不要提交密钥或未经授权的材料。忽略规则只减少误提交，不能撤回历史中的敏感信息。
