# 已完成功能与完整复验

日期：2026-11-01（Asia/Shanghai）。D029 授权本轮汇总、实际复验、同步文档、一次中文提交和 push；用户补充要求缺失时先创建仓库，现已创建。环境为 Windows、Node 24.22.1/npm 11.19.1、VitePress 1.6.4，本机生产预览子路径 `/knowledge-hub/`。

## 功能与验证方案

| 功能 | 已实现行为 | 实际验证 |
| --- | --- | --- |
| 阅读导航 | 首页、目录、侧栏、指南、本页目录、上一篇/下一篇。 | 首页搜索到 Git 小节、点击上一篇到差异文章，再进入测试页；手机目录跳转通过。 |
| 知识内容 | Java、Spring、SQL、Git、Linux 共 6 篇官方资料摘要，保留版本、日期与来源。 | 构建和内部链接通过；本轮未重查全部外链或执行文章示例命令。 |
| 全文搜索 | 中文、英文大小写、缩写、代码标识符与完整带点文件名。 | 14 组浏览器查询均前 5 条命中，文件名第 1；无结果显示“没有找到相关知识”，结果跳到“显式指定来源”。 |
| Markdown 展示 | 标题、代码高亮、长代码、宽表格、图片及内部链接。 | 桌面根宽/内容宽均 1265；390×844 视口中均 375。代码和表格局部横向溢出，页面无横向溢出；图片加载成功，手机图片宽 327。截图人工检查通过。 |
| 维护闭环 | 新建、增补、完全/近义重复去重、矛盾核查、待核实内容保留。 | P3 s2–s6 哈希重新比较一致；当前指南匹配 P3 正式提交，配置为搜索修复。原语义操作复用既有证据，未冒称本轮重放。 |
| 本地检查 | 文档、构建、资源/页面/锚点/base 检查。 | 初始 30 Markdown/132 链接；构建 2.70 秒；11 HTML/275 引用通过。新增汇总后的最终文档结果记讨论日志。 |
| 工作流 | PR/分支检查、main 构建后部署、分离权限、并发取消和旧 SHA 拦截。 | 两份 YAML 解析及事件/权限/命令/分支/依赖断言通过；真实文档脚本在隔离坏链接夹具 exit 1，修复后 exit 0。真实 CI 以 PR 运行记录为准。 |
| 历史构建 | P2/P3 历史快照可隔离重建。 | 复用原证据：dbf620f 为 10 HTML/234 引用，14cc80b 为 11 HTML/275 引用；本轮未重复构建或执行 revert/线上回退。 |
| GitHub 保存 | 公开仓库、HTTPS 正常推送与待审核 PR。 | 核对账号 EchoForge05/ID44670012，GCM 登录成功；新建 public 空仓库后推送 main=1a6cb54 与功能分支既有历史=14cc80b，refs 一致，草稿 PR #1 已创建。 |

## 证据与限制

本轮证据：[搜索](evidence/full-validation/search.json)、[跳转与无结果](evidence/full-validation/navigation.json)、[阅读指标](evidence/full-validation/reading.json)、[本地检查](evidence/full-validation/local-checks.json)、[桌面截图](evidence/full-validation/desktop.png)、[手机截图](evidence/full-validation/mobile.png)。原操作见[维护验收](knowledge-pilot-validation.md)与[本地遗留验证](local-followup-validation.md)，旧证据保留。

候选文件及可达历史 174 个 blob 的常见私钥/GitHub/API/AWS 密钥模式无命中；私有工具、依赖和产物被忽略，非完整安全审计。当前开发工具链 3 项 audit 风险（2 moderate/1 high）未修复，稳定兼容路径评估完成；未强制升级或改锁文件。

验证定位曾误用无结果文案及不支持的 heading level 参数，已按实际 DOM 修正；快照差异断言最初漏计 P3 提交前收尾更新的指南，经正式提交核对后修正。最终检查通过，不把验证脚本定位错误当作产品缺陷。

真实手机、多浏览器、大语料、任意符号子串、中文短语连续性、全部技术示例执行未覆盖。YAML 检查不等于 actionlint、完整 schema 或 Linux runner 通过。

## 交付边界

[公开仓库](https://github.com/EchoForge05/knowledge-hub)与[草稿 PR #1](https://github.com/EchoForge05/knowledge-hub/pull/1)已存在。本轮将搜索修复、工作流、原队列证据和关联文档合为一次中文提交后正常推送 feat/pages-ci；最终 SHA、push 回执和 CI 状态从 Git/PR 实际记录读取，不在提交前预写成功。

P4-01 已验收归档；P4-02 真实成功/失败 CI、P4-03 用户审核合并后的 Pages 发布、P4-04 实际公开回退仍未完成，P4 整体未归档。公开仓库可读不代表知识站已部署。P5 等用户确认 AI 服务后开工。

## 提交后与续开发更正（2026-11-01）

上述交付前状态保留。实际 42bdcd6 已正常 push，远程 SHA 一致；真实 PR CI 成功，后续隔离分支坏链接失败/修复成功均已验证，P4-02 已归档。事件与逐步骤证据见 [remote-ci.json](evidence/p4/remote-ci.json) 和 [P4-02 归档](completed-plans.md#p4-02真实-ci-成功失败与修复)。未修改生产知识、搜索配置或依赖，本次不重跑浏览器；Pages、用户合并及实际公开回退仍未完成。
