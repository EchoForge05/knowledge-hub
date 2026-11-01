# 本地站点验收记录

> 历史快照：2026-11-01 文档精简前记录。保留当时结论及后续更正，不作为当前状态或新授权；当前入口见[历史库索引](../../README.md).

当前增量说明：本文 P2 历史基线使用 Intl.Segmenter；P4-L01 已改为确定性正则 tokenizer 并通过 14 组浏览器回归，见[本地遗留验证](local-followup-validation.md)。下方历史环境和原始证据保留，不当作当前分词实现说明。

日期：2026-10-31 开始，2026-11-01 完成验收（Asia/Shanghai）。本轮仅本地开发，A06/A08、PR、Actions、Pages 与真实手机验证未执行。代码片段未作为 Java、Spring、SQL 或 Linux 程序执行。

## 环境与内容基线

VitePress 稳定版 1.6.4；Node 24.22.1 LTS；npm 11.19.1；默认主题；MiniSearch 与 Intl.Segmenter 中文分词；生产 base `/knowledge-hub/`。官方核查入口见[本地开发说明](../../../handbook/site-development.md)。

用户授权采用官方公开资料整理 5 篇入门样本；以下为 Agent 自主选择，不是用户原始笔记。各篇正文保存来源及条件。展示测试页独立标注为人工构造样本。

| 内容路径 | 适用依据 | 查询词 | 预期命中文档 |
| --- | --- | --- | --- |
| `knowledge/java/concurrent-hash-map.md` | Java SE 21 API | ConcurrentHashMap / concurrenthashmap / JVM | ConcurrentHashMap 的基本使用边界 |
| `knowledge/spring/spring-boot-application.md` | Spring Boot 4.1.2 参考 | 组件扫描 / SpringBootApplication | Spring Boot 应用入口注解 |
| `knowledge/databases/select-basics.md` | PostgreSQL 18 教程 | SELECT / knowledge_notes / 事务隔离级别 | SQL 查询：选择、过滤与排序 |
| `knowledge/git/diff-basics.md` | Git 2.55.0 手册 | 暂存区 | Git 差异检查：工作区与暂存区 |
| `knowledge/linux/head-basics.md` | GNU Coreutils 当前官方手册源码 | head | Linux 文本查看：head |

查询词 `knowledge_notes` 仅存在于 SQL 代码块，用于代码检索；“事务隔离级别”只是文中范围提醒，不宣称文章讲解此主题。阈值为预期文档在前 5 条结果中，逐项结果将在实际检查后记录。

## 实测结果

### 安装、构建与链接

- 首次从空依赖目录安装成功，126 个包；npm ci 按锁文件离线重装成功，随后生产构建成功（2.49 秒）。第一次 ci 因预览进程占用 esbuild.exe 报 EPERM，停止预览后重试通过。
- npm 11.19.1 提示 esbuild postinstall 尚未列入 allowScripts，未擅自批准额外脚本；本机平台包已足以支持构建。此结果仅覆盖当前 Windows x64，其他平台需复验。
- `npm run check`：26 份 Markdown、本地文件链接检查通过；最终数量见讨论日志。
- `npm run check:site`：10 个 HTML、234 处本地资源/页面/锚点引用通过；确认链接保留 `/knowledge-hub/` 前缀。
- HTTP：7 个代表路径全部 200，包含首页、5 篇知识正文和嵌套测试页，详见[HTTP 记录](../../../project/evidence/http-results.json)。
- 默认沙箱阻止回环套接字，首次 localhost 浏览器请求超时；获准在沙箱外启动仅绑定 127.0.0.1 的预览后，浏览器访问 IPv4 地址成功。未修改系统网络或防火墙。验收后已停止服务，重新查看需运行 preview。

### 搜索实际排序

浏览器在生产预览实际输入查询；每次先清至无结果状态，再填新查询，以避免误读旧结果。下表是预期文章首次出现的位置，保留按段落返回的原始顺序于[搜索结果](../../../project/evidence/search-results.json)。

| 查询 | 预期文章首次排名 | 结果 |
| --- | --- | --- |
| 组件扫描 | 1 | 通过 |
| JVM | 2 | 通过 |
| ConcurrentHashMap | 1 | 通过 |
| concurrenthashmap | 1 | 通过 |
| SpringBootApplication | 1 | 通过 |
| SELECT | 1 | 通过 |
| knowledge_notes（仅代码块中） | 1 | 通过 |
| 暂存区 | 1 | 通过 |
| head | 1 | 通过 |
| 事务隔离级别 | 2 | 通过 |

不存在的查询 `zz_no_such_knowledge_987654321` 显示中文无结果提示。点击类名结果打开正确正文及标题锚点；手机视口打开搜索并输入代码标识符，出现 SQL 正文的两个段落。测试页也参与检索，因此 JVM、事务隔离级别的第一条为明确标注的测试材料；不将此排名描述为正式知识的第一名或完整主题覆盖。

### 阅读、导航与视口

- 1440×900：首页、分类目录、Java 正文、侧栏及右侧标题目录正常；正文根元素 clientWidth/scrollWidth 均为 1425，无整体横向溢出。代码有高亮。
- 390×844：侧栏可展开并跳到 SQL 正文，搜索可用；生产深层页面直接打开及刷新成功。一次自动化在导航尚未稳定时点击搜索过早，刷新观察后重试正常，未据此修改产品代码。
- 390px 测试页：根元素 clientWidth/scrollWidth 均为 375；两个 pre 的可见宽度均为 375、内容宽度 615/1687；表格可见宽 327、内容宽 1238，均 overflow-x:auto。图片 complete 且 naturalWidth>0。
- 默认主题未提供面包屑，使用侧栏、标题目录和上一篇/下一篇导航；未新增自定义主题。浏览器未捕获 warn/error 日志。
- [桌面截图](../../../project/evidence/site-desktop.png)、[手机截图](../../../project/evidence/site-mobile.png)；截图为生产预览，手机为模拟视口，不是真实设备。

### 结论与限制

P2 的 A04/A05/A07 在上述本地样本及环境通过。只验证小规模语料和当前浏览器；不承诺大规模相关性、任意子串、跨浏览器或真实手机兼容。P3 新建/增补/重复/矛盾维护场景未执行，P4 外部发布未执行；不把本地站点称为完整 MVP 公开交付。

## 2026-11-01：已实现功能展示与复验

用户要求展示和验证目前已实现功能。本次未修改站点实现或知识正文，使用现有 Node 24.22.1/npm 11.19.1 重新执行检查：

- `npm run check` 通过：26 份 Markdown、71 处本地文件链接（本次记录更新前）。
- `npm run build` 通过：生产构建 2.64 秒。
- `npm run check:site` 通过：10 个 HTML、234 处本地资源/页面/锚点引用。
- 本地预览 HTTP 复测：首页、知识目录、使用指南、5 篇正式文章、阅读测试页共 9 个路径均返回 200。
- 本次未重新执行浏览器交互、搜索或视口检查；展示复用上方桌面/手机截图及 10 组搜索结果，均为此前 P2 验收证据。

默认沙箱访问回环套接字被拒绝；随后在沙箱外启动仅绑定 127.0.0.1 的预览并完成 HTTP 检查。预览保留运行以供用户查看：[本地首页](http://127.0.0.1:4173/knowledge-hub/)。该地址依赖本机进程，服务停止后需重新启动，不是公开站点。

P3–P5 状态不变；本次只复验和同步记录，不提交、不推送或部署。
