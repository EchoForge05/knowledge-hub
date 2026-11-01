# 发布验收摘要

2026-11-01，发布提交 ec1d977。[公开站点](https://echoforge05.github.io/knowledge-hub/)与 [Pages 运行](https://github.com/EchoForge05/knowledge-hub/actions/runs/41265555312)已验证。

| 验收 | 结果 |
| --- | --- |
| 发布配置 | workflow 来源、仅 main/branch 部署、HTTPS 开启 |
| HTTP/锚点 | 11 HTML、16 直接引用资源或 URL 成功，50 页面锚点存在 |
| 线上搜索 | “组件扫描”、ConcurrentHashMap、restore_note_example.md 均第 1 条命中 |
| 交互 | 无结果提示、结果跳到正确小节、手机目录展开与导航通过 |
| 布局 | 桌面根宽/内容宽 1265；390×844 手机视口均 375，代码/表格局部滚动、图片加载通过 |
| 浏览器日志 | 验收标签页 warn/error 为空 |
| 回退 | 隔离真实 revert 后文档/构建/产物通过，未线上回退 |

证据：[部署](evidence/p4/pages-deployment.json)、[HTTP](evidence/p4/public-http.json)、[交互](evidence/p4/public-browser/results.json)、[手机指标](evidence/p4/public-browser/mobile.json)、[回退演练](evidence/p4/revert-validation.json)。手机与桌面截图在 public-browser 证据目录。

限制：线上只验 3 组代表查询，本地 14 组结果另存；真实手机、其他浏览器、大规模语料、生产故障/并发发布及线上回退未动态验证。工具曾间歇超时，重新读取实际状态后续验；整页截图失败，视口截图成功。

首次 Pages 未启用的失败与恢复、完整旧过程见[历史发布验收](../history/2026-11-01/project/pages-validation.md)。当前 P4 归档见[完成记录](../history/2026-11-01/p4-completion.md)。
