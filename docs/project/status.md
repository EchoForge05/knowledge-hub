# 当前进度

更新：2026-11-09。Agent 恢复用，用户从根 README 进入。

ConcurrentHashMap 面试问答版、使用指南和离线刷新流程已随 [PR #22](https://github.com/EchoForge05/knowledge-hub/pull/22) 合并。

本批报销 Agent 和银行联机与批处理文章已导入，预览、搜索及离线验证通过，待处理目录已清空。见[本批导入记录](../history/2026-11-09/reimbursement-and-banking-import.md)。

第二批知识已通过 PR #14 发布，5 篇新文章和 ConcurrentHashMap 的更新均已在线核验。待处理目录为空，验证及部署证据见[本批记录](../history/2026-11-07/knowledge-import.md)。

D052：本批已通过[PR #12](https://github.com/EchoForge05/knowledge-hub/pull/12)合并，合并点 `d40abea`；CI与Pages构建/部署任务成功，线上新增文章HTTP 200。详见[交付记录](../history/2026-11-03/delivery.md)。本地main已同步，V07仍待用户阅读确认。

D051：导入会话改为完整验证、成功回执落盘并复核哈希后自动删除对应 pending 原文件；失败或部分完成保留。用户追加要求本次也执行，已复核首次导入的22组问答、6篇文章与哈希并删除 `1.txt`，回执保留，pending 扫描为空，见[记录](../history/2026-11-02/import-cleanup.md)。

| 内容 | 当前状态 |
| --- | --- |
| 文件批量导入 D049 | 固定目录 Markdown/TXT 扫描、哈希回执和会话协议已通过PR #12合并发布；离线验证见[记录](../history/2026-11-02/file-import.md)及[首次导入](../history/2026-11-02/first-knowledge-import.md)，首批真实资料已整理新增5篇，来源/构建/搜索验证通过，V07用户阅读验收待确认 |
| 静态知识站 P2–P4 | 导航、全文搜索、富文本、CI 与 Pages 已验收 |
| 文章下架 D053 | 已上线；17 篇文章入口和 GitHub 审核分支生成已核验，见[验收记录](../history/2026-11-07/article-removal.md#远程交付与验收) |
| Codex 文章维护 D054 | 已上线，17 篇文章入口已核验，见[验收记录](../history/2026-11-09/codex-article-actions.md) |
| Codex知识维护 | 新建、增补、去重、矛盾处理流程已验证。D056 已纳入[知识整理流程](../handbook/knowledge-workflow.md#文章组织与表达) |
| 可选手动草稿 | 已合并；7项离线测试与3次公开资料调用验收，额度已用尽 |
| Issue表单、导出与离线接收 | 已交付；14项离线测试及CI通过，真实正向往返 V06 尚未验收 |
| 本地阅读修订 L05 | D042纠正后的完整知识解释及29项浏览器回归已通过；已按D048经PR #10合并并发布 |
| 完整本地离线阅读 L06 | 单 HTML 已通过 Windows Chrome 离线验收；站点使用指南提供 Pages 下载，见[验收记录](../history/2026-11-09/offline-reading.md) |
| 项目分离与复制 | Hub/Agent已置于knowledge-workspace，各自独立Git；旧目录用户自行删除 |
| D046 文档整理 | README用户路由、开发导航及架构文件说明已整理；历史回执归档，功能和待办保留 |

[待办](backlog.md)记录全部未完成明细，[计划](roadmap.md)记录顺序。Agent当前规划不在Hub维护。

历史交付SHA、PR/CI/Pages链接与逐页证据见[归档](../history/2026-11-01/structure-pass/README.md)。本批PR #10合并点7c6c51f，CI及Pages发布成功；配套回执按同批授权交付，最终HEAD以Git实查为准。
