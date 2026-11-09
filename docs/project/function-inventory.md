# Hub功能与目录归属

日期：2026-11-01，D044项目整理。Hub保持现有目录结构，不嵌套Agent仓库，父目录不初始化Git。

| 功能/目录或命令 | 实际状态 | 归属 |
| --- | --- | --- |
| 固定目录文件批量导入 | D049会话触发，Markdown/TXT扫描和本地回执；不启动独立服务 | Hub维护入口 |
| 文章下架 | D053 已发布，GitHub 维护流程可生成审核分支 | Hub维护入口 |
| Codex 文章维护请求 | D054 已上线；可复制带文章信息的删除或修改请求 | Hub维护入口 |
| knowledge/文章、分类与全文搜索 | 7篇已上线；阅读修订L05已通过PR #10交付 | Hub核心功能 |
| docs/使用、内容规范、项目状态与历史 | 现有维护入口 | Hub独立维护；不保留Agent当前版本计划 |
| dev/build/preview/check/check:site与Pages | 现有静态构建检查发布 | Hub保留，不依赖Agent |
| Codex人工知识整理 | 流程已验证 | Hub维护方式 |
| ai:draft与test:ai | 已有可选手动辅助，调用额度已用尽 | 暂留Hub兼容，不搬配置或密钥 |
| Issue表单、issue:export、issue:intake与test:issue | 已交付，无密钥；真实正向往返V06待验收 | 暂留Hub，未来迁移另作小批验证 |
| L06完整本地离线阅读 | 单 HTML 已实现并通过本地验收 | Hub 阅读功能，与 AI 无依赖 |
| 原P5未实现自动化 | 尚未实现 | 开发计划已迁至平级knowledge-agent；本库仅留ID回执 |

平级knowledge-agent为独立本地Git仓库，负责可选AI能力的规划；其README、AGENTS、docs/project/roadmap.md为新项目入口。它没有应用实现，规划迁移不代表现有代码已迁移。

V06、M01 等未完成项见[待办](backlog.md)，实现和验收见[完成索引](../history/2026-11-01/structure-pass/completed-plans.md)。


D045位置更新：上述Hub现位于knowledge-workspace/knowledge-hub，Agent位于同父目录的knowledge-agent；两者仍平级独立，功能归属不变。
