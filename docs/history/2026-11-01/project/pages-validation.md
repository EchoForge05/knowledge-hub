# Pages 发布与公开访问验收

> 历史快照：2026-11-01 文档精简前记录。保留当时结论及后续更正，不作为当前状态或新授权；当前入口见[历史库索引](../../README.md).

日期：2026-11-01（Asia/Shanghai）。按 D031 合并并继续 P4；当前完成实际发布和 HTTP 验证，P4-03 的线上浏览器交互仍待验收，P4 整体未完成。

**D032 续验更正：** 本轮已补齐公开交互：中文“组件扫描”、英文 ConcurrentHashMap、代码完整文件名 restore_note_example.md 均第 1 条命中；无结果提示、实际结果跳到“显式指定来源”、390×844 分类目录展开及导航到阅读测试页通过。手机根宽/内容宽均 375，代码和表格 overflow=auto 且内部横向滚动；图片加载成功、宽约 327。桌面根宽/内容宽均 1265，图片正常，浏览器 warn/error 日志为空。证据见[线上交互摘要](../../../project/evidence/p4/public-browser/results.json)、[手机指标](../../../project/evidence/p4/public-browser/mobile.json)及同目录截图。下方“未验收/阻塞”为此前发布批次的历史状态，本次只测 3 组代表查询，不冒称重跑全部 14 组；真实设备与生产故障/并发未动态验证。

## 实际交付

- [PR #1](https://github.com/EchoForge05/knowledge-hub/pull/1) 已按用户本次授权正常合并；head 为 3bb3e2e，合并提交为 ec1d977afda87250cd33f0fdcad9dda793b04d5e，未压缩或改写既有历史。
- [发布运行 41265555312](https://github.com/EchoForge05/knowledge-hub/actions/runs/41265555312) 最终成功，main SHA 核对、configure-pages 和 deploy-pages 步骤通过，安装/文档/构建/产物/上传均成功。
- [公开知识站](https://echoforge05.github.io/knowledge-hub/) 已可访问。Pages 使用 workflow 来源，HTTPS enforced=true；github-pages 环境 custom_branch_policies=true，仅一条 main/branch 规则，无 tag 通配规则。
- GitHub 连接器没有 Pages 设置能力，使用官方 REST API 与现有正常 GCM 登录完成；凭据仅驻内存，未落盘、输出或扩大认证权限。没有修改系统代理、全局 Git 或依赖。

## 验收矩阵

| 范围 | 实际结果 | 证据/边界 |
| --- | --- | --- |
| 成功发布 | 合并后 main 自动触发，最终 build/deploy 成功。 | [部署摘要](../../../project/evidence/p4/pages-deployment.json)，含首次失败与恢复。 |
| 首页与深链 | 11 个 HTML（含 404.html）均 HTTP 200，6 篇摘要、指南、目录和测试页可直接请求。 | [HTTP 原始摘要](../../../project/evidence/p4/public-http.json)。直接请求 404.html 返回 200 不代表不存在路径返回 200。 |
| 资源 | 页面直接引用的 16 个唯一资源/其他 URL 均成功；含 CSS、JS、图片。 | 逐项保存响应类型、字节数及 SHA-256；未执行 JS，也未递归执行或核验全部动态模块。 |
| 标题跳转 | 解析页面内链，50 个指向已检查页面的锚点均存在。 | HTML 静态核对；线上实际点击仍待浏览器验收。 |
| 搜索 | 线上中文/英文/代码/完整文件名查询、无结果及点击跳转未验收。 | 既有本地 14 组成功证据保留，但不冒充线上验证。 |
| 手机视口 | 线上 390×844 布局、目录和图片交互未验收。 | 既有本地视口证据保留，真实手机也未测。 |
| 失败不发布 | 首次 configure-pages 失败后 Deploy site 被跳过。 | 不等同于真实 main 构建失败不上传/发布；该路径及并发部署尚未动态验收。 |
| 回退 | P2/P3 历史隔离构建已通过，操作指南已交付。 | 未对公开站点执行 revert 或回退，P4-04 保留未完全验收。 |

## 首次失败与恢复

首次合并触发时 Pages 尚未启用；build 全部通过，但 configure-pages@v5 报 Get Pages site failed / Not Found，Deploy site skipped。核对 API /pages 为 404 后，启用 build_type=workflow，设置环境仅 main 可部署并读回；请求重跑失败任务后同一运行最终成功。最新 attempt 的 API 同时列出成功 build/deploy，不将首次失败隐藏或声称它是构建失败测试。

公开 HTTP 检查初版未排除 srcExclude 的 knowledge/README.md，产生预期不发布路径的 404；按实际配置修正并补 404.html。随后网络出现 TLS EOF，以保留证书验证、有限重试与降低并发恢复，最终全部目标通过。这些是检查脚本/网络过程，不是生产页面修复。

资源中 vp-icons.css 返回 200/0 字节，与既有本地产物的同名空 CSS 一致；其余响应非空。证据检查最初将所有资源都要求非空，核对后针对该实际空文件更正断言，未更改站点或响应记录。

## 浏览器阻塞及续接

内置浏览器创建及绑定标签页两次超时。改用现有 Chrome 时，Computer Use 明确报告无法可靠确认 Windows 当前浏览器 URL，并中止本轮；已停止 UI 操作，没有通过其他 UI 自动化绕过检查。这不是自动审批拒绝，也不是额度耗尽。

下一次在浏览器工具可用时，直接打开上述公开地址，依次检查：中文“组件扫描”、英文 ConcurrentHashMap、代码 restore_note_example.md 的前 5 条命中；无结果提示及结果锚点点击；首页/深链/图片与 390×844 手机目录、局部滚动。全部通过再完成 P4-03；配合 P4-04 交付检查后再决定 P4 整阶段归档。P5 仍等用户确认 AI 服务、费用与数据外发。

## 设置与故障定位依据

官方核查日期：2026-11-01。[Pages REST API](https://docs.github.com/en/rest/pages/pages)、[环境 API](https://docs.github.com/en/rest/deployments/environments)、[部署分支规则 API](https://docs.github.com/en/rest/deployments/branch-policies)。日常发布、故障与回退步骤见[交付指南](../handbook/github-delivery.md)。
