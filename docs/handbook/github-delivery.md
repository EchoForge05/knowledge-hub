# 发布与回退

[公开知识站](https://echoforge05.github.io/knowledge-hub/) · [仓库](https://github.com/EchoForge05/knowledge-hub) · [验收摘要](../history/2026-11-01/structure-pass/pages-validation.md)

## 日常交付

1. 在短期分支修改，按影响检查文档、构建与页面引用；内容变化复验相关搜索。
2. 按授权提交并推送，查看 PR 的 Knowledge checks；用户审核合并。
3. main 自动运行 Publish knowledge site。安装、文档、构建、产物检查成功后上传；deploy 依赖 build，单独持有 Pages/OIDC 写权限。
4. 部署前核对当前 main SHA，完成后访问首页及变动页面。旧提交重跑会被 SHA 检查拒绝；需要重发时手动运行仅选 main。

Pages 来源为 GitHub Actions，github-pages 环境仅 main/branch 可部署，HTTPS 已启用。不使用 pull_request_target，不把部署写权限交给 PR。部署并发取消旧运行；真实并发效果未动态演练。

## 故障定位

- 文档/安装/构建失败：查看首个失败步骤，修复后复验，不绕过检查。
- configure-pages Not Found：核对 Pages 是否启用且来源为 workflow；首次发布已遇到并修复。
- 环境拒绝：核对 main 分支规则与 deploy 权限，不扩大凭据权限绕过。
- 搜索/资源问题：区分 HTTP、JS 加载、索引和浏览器布局；静态成功不代替交互验收。
- 历史失败通知：核对分支、提交和后续运行。隔离坏链接测试曾按预期失败，恢复成功；保留失败历史。

## 回退步骤

1. 记录错误提交/运行，选择已验证的恢复点，在隔离副本核对锁文件和构建。
2. 创建短期分支，执行目标提交的 revert，审阅差异；合并提交先确认 main 父线。
3. 运行文档、构建、产物及受影响功能检查，交付 revert PR，由用户审核。
4. 合并产生新的 main 后正常部署并复验；不强推、不清除历史。

本地真实 revert 演练已通过：撤销 14cc80b，恢复树等于 70c8365，文档/构建/产物检查成功；[证据](../project/evidence/p4/revert-validation.json)。未对公开站点执行回退，未动态测试生产 main 构建失败或并发发布；配置检查和历史构建不冒充这些演练。

运行细节、权限断言、依赖风险和官方依据见[历史交付记录](../history/2026-11-01/handbook/github-delivery.md)。
