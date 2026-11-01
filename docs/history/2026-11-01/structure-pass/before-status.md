# 当前进度

更新：2026-11-01。主维护使用Codex，GreatRouter/gpt-6-sol仅作可选辅助。

本地阅读新需求：用户明确分散文件不便阅读，需设计与网站同样方便的统一入口；现有本地开发/预览命令不算该能力已交付。[L06方案](../../../project/local-reading-design.md)已提出，运行环境与实施范围待确认，尚未开发。

L06后续澄清：本地需完整、随时可读的副本；当前推荐直接打开的离线知识库，不以运行Node服务作为日常阅读前提。离线HTML封装及搜索等能力仍待实施验证。

| 交付 | 状态 |
| --- | --- |
| 知识站MVP（P2–P4） | 已上线并验收，6篇官方摘要、导航/搜索/富文本、CI与Pages可用 |
| 知识维护 | Codex新建/增补/去重/矛盾处理流程已验证 |
| 日常知识新增 | [Spring 单例 Bean 与线程安全](../../../../knowledge/spring/singleton-bean-thread-safety.md)经PR #6合并发布，共7篇；官方核查、构建及本地/线上页面、搜索、手机布局通过 |
| 手动模型辅助 | 已合并main，7项离线测试和3份公开资料国内接入验收通过；[用法](../../../handbook/optional-ai.md) |
| Issues接收 | D037表单及本地接收已通过PR #5合并，Linux CI通过；模型自动录入仍后置 |
| 公开Issue导出 | 57f88bc经PR #6合并main；无需gh或密钥，显式GET导出；14项Issue测试及Linux CI通过，L04/V07完成 |

[网站](https://echoforge05.github.io/knowledge-hub/) · [完成索引](completed-plans.md) · [历史库](../../README.md)

阅读精简（D040，2026-11-01）：Spring文章及后续[开发规范](../../../handbook/development.md#知识文章的阅读精简)经[PR #8](https://github.com/EchoForge05/knowledge-hub/pull/8)合并为acf569a，[CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/41292949763)与[Pages](https://github.com/EchoForge05/knowledge-hub/actions/runs/41293014285)成功，本地main已同步。正文、搜索及手机检查见[本地回执](../../../project/evidence/knowledge/spring-reading-browser.json)；线上已核对补充资料默认折叠、可展开版本与4个官方链接并再次折叠。收尾记录按同批授权交付，最终SHA以Git实查为准。

上一批按D036完成提交、推送和检查后合并：[PR #2](https://github.com/EchoForge05/knowledge-hub/pull/2)合并点9e87939，[PR #3](https://github.com/EchoForge05/knowledge-hub/pull/3)合并点86c1f50，包含模型功能c207677/aaa417e与文档整理7ddce23。当时已同步本地main，旧分支保留；交付证据见[完成记录](completed-plans.md)。

D038按授权推送并合并[PR #5](https://github.com/EchoForge05/knowledge-hub/pull/5)，head=73292ea、合并点9a0b160；[CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/41283712615)与[Pages](https://github.com/EchoForge05/knowledge-hub/actions/runs/41283825644)成功，本地main已同步。表单文件已核对进入远程main，浏览器需登录，真实表单展示/Issue往返仍未验收。

D039已交付[PR #6](https://github.com/EchoForge05/knowledge-hub/pull/6)，head=83e91b1、合并点92a8ded；[CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/41290113085)与[Pages](https://github.com/EchoForge05/knowledge-hub/actions/runs/41290170419)成功，本地main已快进同步。收尾说明通过docs/d039-delivery短期分支交付，最终SHA以Git实查为准，旧分支保留；接收仍离线，无Issue事件或后台工作流。工程分析文档为快照，建议仍待审核。

未实现、未验证、依赖风险及未排期能力统一维护在[待办登记](../../../project/backlog.md)。D034的3次验收额度已用尽；后续PR不自动合并，不发布模型草稿或启用Issues自动处理。

D041全站阅读精简：已补齐其余6篇正文、首页/目录/指南及测试侧栏折叠；原Spring单例文章保留并回归。当前为docs/site-reading本地修改，尚未发布；文档/构建/产物及29项浏览器检查通过，详见[逐页回执](../../../project/evidence/knowledge/site-reading-browser.json)，待交付L05。

D042纠正（2026-11-01）：D041旧记录中的精简不代表缩短知识回答；现已恢复Spring完整知识解释、首页卡片及目录分类，当前L05待交付以本轮修订为准。此前D041-local归档仅为当时本地快照，后续验证见[讨论记录](../../../project/discussion-log.md)。

D042本地复验完成：文档/构建/产物检查及29项浏览器回归通过，见[D042回执](../../../project/evidence/knowledge/site-reading-d042-browser.json)。本批仍未提交或发布。

D044项目分离：独立Agent规划已迁至平级knowledge-agent，目录和独立本地main仓库已建立，尚无功能实现。Hub继续静态阅读、搜索与发布，已有脚本未迁移，现有未交付/未验证状态不变；见[功能清单](../../../project/function-inventory.md)。本轮仅文档与目录整理，无提交或发布。


D045目录更新（2026-11-01）：Hub现位于D:/Project/Codex Project/knowledge-workspace/knowledge-hub，与Agent同属Knowledge Workspace父工程。Git分支/HEAD及全部既有工作区内容已保留；只做移动和文档同步，L05/L06/V06等状态不变。后续从新父工作区继续。


D045最终确认（2026-11-01）：用户后续明确改为直接复制，旧路径由用户自行删除。复制交付现已完成，不再把旧目录清理列为本轮阻塞或Agent开发前置条件。后续只在knowledge-workspace内的子项目开发；两个旧目录原样保留，不同时编辑。 原有功能/待办状态不变，无提交推送、模型调用或新功能开发。
