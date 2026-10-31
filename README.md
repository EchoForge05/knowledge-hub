# 个人知识库 · Knowledge Hub

通过网页阅读和搜索知识，通过 Agent 整理零散记录，通过 GitHub 长期保存修改历史。

本项目主要负责搭建和维护知识站，优先完成阅读、导航、搜索、内容展示与发布；知识整理流程作为配套。

**当前阶段：需求与方案规划，基础初始化已完成。尚未开发网站、安装框架或启用自动化。**

## 从这里开始

- [需求与范围](docs/project/requirements.md)：用户目标、已确认约束和本次工作边界。
- [项目状态](docs/project/status.md)：实际完成情况、验证记录和下一步入口。
- [决策记录](docs/project/decisions.md)：已确认决策、待讨论问题。
- [架构方案](docs/project/architecture.md)：已确认的 VitePress 技术栈及选型依据，尚未实施。
- [开发计划](docs/project/roadmap.md)：P1–P5 任务、交付里程碑、样本与验收矩阵；详细方案待确认，尚未开工。
- [完成计划归档](docs/project/completed-plans.md)：已完成计划、验收结果与证据。
- [开发规范](docs/handbook/development.md)：规范落盘、计划维护与完成归档流程。
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
├── knowledge/               # 未来网站的知识正文，当前只有占位目录
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

当前可直接用编辑器或 Markdown 阅读器打开文档。网站启动、构建和部署命令将在对应阶段实现后补充，现在没有可运行的网站。

## 新会话续接

在本目录开启 Codex 会话，要求先阅读 `AGENTS.md`，再读取 `docs/project/status.md`、`decisions.md` 和 `roadmap.md`。只有明确确认的内容才算已定案；建议、草案与未验证功能必须保留状态标识。

## Git 与远程仓库

本地仓库采用 `main` 与短期功能分支。已确认目标为公开仓库 `EchoForge05/knowledge-hub`，使用 HTTPS，配置与连接的实际状态见 [Git 配置记录](docs/handbook/git-setup.md)。基础归档提交已完成；用户另行授权本次文档检查后提交一次，授权不延续到后续提交，也不包含推送。提交者为 `EchoForge05`，本仓库使用基于已核实 GitHub 账号 ID 的 noreply 邮箱。后续知识变更由 Agent 整理并检查、用户审核 PR 合并。

优先交付 MVP，范围与验收草案见 [阶段计划](docs/project/roadmap.md)。技术栈已确认：Markdown/Git、VitePress 稳定版与默认主题、TypeScript 配置、Node.js LTS/npm、内置 MiniSearch；后续 GitHub Pages/Actions。具体兼容版本和搜索效果在获准开发后验证。

## 隐私

用户目前的个人知识不涉及隐私，选择免费的公开仓库与公开网站方案。日后如果输入含敏感内容，应重新确认发布边界；不要提交密钥或未经授权的材料。忽略规则只减少误提交，不能撤回历史中的敏感信息。
