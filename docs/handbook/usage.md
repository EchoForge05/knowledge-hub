# Knowledge Hub 使用说明

## 选择使用方式

[返回项目入口](../../README.md)。以下说明现有功能的使用方法；开发计划与未完成项从README进入。

| 需求 | 入口 | 当前可用范围 |
| --- | --- | --- |
| 阅读和搜索 | [公开知识站](https://echoforge05.github.io/knowledge-hub/) | 已上线 |
| 新增或修订笔记 | 向本仓库Codex对话发送资料 | 已验证，日常维护推荐入口 |
| 提交公开资料、人工接收 | GitHub知识表单、`issue:intake` | 已合并main；表单实际展示和真实Issue正向往返仍待验收 |
| 无密钥导出公开Issue | `issue:export` | 已交付；真实Issue往返仍待验 |
| 模型辅助生成草稿 | `ai:draft` | 已合并main，可选；发送需本机配置与调用授权 |

网站用于阅读，新增资料需要维护者整理审核；Issue提交、导出、接收都不会自动生成知识文章或发布。完整未完成清单见[待办登记](../project/backlog.md)。

## 阅读与查找

打开[知识站](https://echoforge05.github.io/knowledge-hub/)，通过“知识目录”选分类。点击顶部搜索或按 Ctrl / Command + K，输入“暂存区”“ConcurrentHashMap”等关键词；点击结果跳到文章或段落。无结果时缩短词语，代码标识符尽量输入完整名称。手机通过“目录”展开导航，宽表格和代码块可横向滑动。

网站用于阅读；维护内容通过 Codex 或下述人工 Issue 流程进行。6篇官方资料摘要不覆盖所有主题；不确定信息按正文标记继续核实。

## 把笔记交给 Codex

可以直接在本仓库的 Codex 对话中发送：

```text
请整理下面这份可公开的 Git 笔记。先搜索现有主题，重复则不新增。
环境/版本：Git，具体版本待核实
来源：填写原始公开链接，或注明原创笔记
资料：粘贴笔记、代码和前提
疑点：列出不确定的说法
请保留来源与疑点，完成检查并报告修改文件。
```

较长资料保存为 `inbox/local/笔记.md`，然后告诉 Codex 路径。这是被 Git 忽略的本地暂存区，不会自动备份或发布，也不提供加密。只输入可公开或充分脱敏的材料。维护时按[知识整理流程](knowledge-workflow.md)检索、核查、更新原主题；通过检查后按授权提交，PR由用户审核。

## 从文件批量导入

将 UTF-8 Markdown/TXT 放入 `inbox/local/pending/`，可一次放多个文件或多主题长文，然后在本项目 Codex 输入“导入知识”。Agent 按主题检索、去重、整理和验证，成功回执落盘并复核后自动删除对应原文件；失败或部分完成的文件保留待处理。需要原始资料时请事先备份。详见[文件导入说明](file-import.md)。Word/PDF 暂需先转文本，不自动监听或发布。

## 下架文章

打开文章页底部的「下架此文章」，点击「复制路径并打开 GitHub 下架流程」。用有仓库写权限的账号选择 **Run workflow**，分支选 `main`，将路径粘贴到 `article` 后运行。

任务成功后，从运行摘要打开 PR 表单，检查文章正文、目录、侧栏和相关链接的差异。PR 审核合并后，既有 Pages 流程会移除公开页面及其搜索条目。正文仍可从 Git 历史查看，误删可通过恢复下架提交另开 PR。

本地维护可在干净的短期分支运行 `npm run knowledge:remove -- 分类/文章.md` 预览，末尾加 `--apply` 应用，随后运行文档、构建和站点检查。

## 通过 Issue 提交公开资料

在[仓库新建Issue页面](https://github.com/EchoForge05/knowledge-hub/issues/new/choose)登录后选择“公开知识资料”，填写主题、正文、公开来源、环境/版本和疑点，并确认已移除敏感信息。Issue会公开；维护者决定是否处理。

维护者核对原始Issue后导出JSON，再离线校验与接收，最后交给Codex检索和整理。完整步骤与可选GitHub CLI导出方式见[Issue人工接收说明](issue-intake.md)。更新至main后可用以下无密钥导出：

```sh
npm run issue:export -- --number 123
npm run issue:export -- --number 123 --fetch
```

123只是语法示例，需换成真实、开放且符合知识表单的Issue编号；不能用PR编号。第一条只预览，第二条才联网并保存JSON。复制终端输出的实际JSON路径用于：

```sh
npm run issue:intake -- --input "inbox/local/实际导出文件名.json"
npm run issue:intake -- --input "inbox/local/实际导出文件名.json" --accept
```

`实际导出文件名.json`需替换为上一步输出的完整文件名（内置导出包含编号和摘要）。`--accept`才保存待处理Markdown到 `inbox/local/issues/`；把该Markdown路径交给Codex，说明按维护流程处理、保留来源与待核实项。只导出或接收还没有更新知识库。JSON和待处理稿均被Git忽略，不能当作跨机器备份。

## 本地运行

先准备 Node 24.22.1 或更高的24.x、npm 11，在仓库根目录运行：

```sh
npm ci
npm run dev
```

按终端输出访问 `http://127.0.0.1:5173/knowledge-hub/`（端口以实际输出为准）。本机默认Node旧版本的处理见[运行环境](site-development.md#运行环境)。停止服务使用 Ctrl+C。

编辑文章后运行：

```sh
npm run check
npm run build
npm run check:site
npm run preview
```

生产预览默认访问 `http://127.0.0.1:4173/knowledge-hub/`，检查变动文章、导航、搜索结果与跳转。新增文章放在 `knowledge/` 对应分类，同时更新 `knowledge/topics.md` 和 `knowledge/.vitepress/config.ts` 的侧栏。检查命令不会核查技术事实或替代人工阅读。

## 可选模型与发布

通常直接用Codex维护。若要使用已实现的手动模型辅助，按[可选模型草稿](optional-ai.md)本机配置密钥；默认预览不发送，`--send` 才会外发指定资料并可能计费。草稿需复核，不能直接发布。既有3次Agent验收额度已用尽，追加Agent请求需新授权。

开发通过后在短期分支提交，按当次授权推送并创建PR；用户审核合并后，既有Pages工作流检查和发布。远程地址、发布检查和回退见[发布与回退](github-delivery.md)。导出功能57f88bc已随PR #6交付，使用时先更新当前版本。

## 常见问题

| 情况 | 处理 |
| --- | --- |
| Node版本/语法报错 | 用 `node --version`、`npm --version` 核对版本，再按本机指南选择运行时 |
| 本地地址显示 `ERR_CONNECTION_REFUSED` | 检查对应端口的 dev/preview 服务是否运行；5173为开发、4173为生产预览，端口以启动输出为准。服务停止或电脑重启后需重新启动；日常阅读可直接打开[公开知识站](https://echoforge05.github.io/knowledge-hub/) |
| 页面空白或资源404 | 使用带 `/knowledge-hub/` 的完整路径，检查终端实际端口 |
| 搜索不到笔记 | 本地暂存和Issue尚未进入知识正文；已入库内容尝试短词或完整标识符 |
| Issue校验失败 | 按表单补全字段、公开勾选并重新导出；检查JSON是否UTF-8、仓库/编号/状态是否正确 |
| `Missing script: issue:export` | 本地可能仍为PR #6前版本；更新至最新main，或继续用Codex直接整理/gh导出后离线接收 |
| JSON文件不存在 | 内置导出文件名含摘要，复制终端实际路径；不要直接照抄文档中的示例文件名 |
| 导出失败或限流 | 核对Issue是否开放、是否误用PR编号、表单是否完整；检查网络/代理或等待限流解除，不自动重试 |
| 同一Issue重复接收 | 同一内容保留原文件；修订内容产生另一稿，人工对照来源与摘要避免重复处理 |
| 模型请求失败 | 不自动重试；先检查配置、平台状态及消费记录 |
