# P4 本地遗留项验证

历史执行记录：2026-11-01（Asia/Shanghai）03:39 heartbeat 确认短窗口额度已用 0%、周窗口 48%，按当时 D028 续接。该次执行位于 feat/pages-ci、HEAD=14cc80b，未暂存、提交、推送或创建 PR，原有工作区保留。后续 D029 已恢复本轮提交/push，当前状态与新复验见[完整汇总](full-validation.md)；以下保留原执行事实。

## P4-L01：完整文件名搜索修复

原目标：定位 P3 的 `restore_note_example.md` 未命中，并按最小改动回归搜索。

本地实际复现：索引内存在完整 `restore_note_example.md` 词条，Node 24.22.1 的 Intl.Segmenter 将它分成一个词；当前内置浏览器分成 `restore_note_example`、`.`、`md`，过滤非词部分后成为两个查询词。AND 查询无法用单一完整词条同时匹配第二个 md，因此无结果。浏览器的分词通过临时本地诊断页实际呈现，不是从查询失败猜测；[浏览器旧分词](evidence/p4/search-browser-before.json)与[Node 分词/实际索引检查](evidence/p4/search-node-index-after.json)可复查。此诊断覆盖当前两个运行时，不据此归因所有浏览器。

修复仅修改 `.vitepress/config.ts` 的 tokenizer：ASCII 字母/数字/下划线标识符保持整词，其他 Unicode 字母/数字逐字，标点作为边界；构建端与浏览器执行相同确定性正则，移除 Intl.Segmenter 词典依赖。没有增依赖、改知识正文或通过改写文件名掩盖失败；仍使用 MiniSearch、prefix=true、fuzzy=false、combineWith=AND。

### 实际验收

- 构建 2.69 秒，11 个 HTML、275 处产物引用检查通过；临时诊断页被重建清除，不进入最终产物。
- [14 组浏览器结果](evidence/p4/search-browser-after.json)全部在前 5 条命中：新增完整文件名第 1，原 10 组查询与 P3 的 3 组查询通过。其中 JVM、事务隔离级别、暂存区和取消暂存首次预期文章为第 2，其余第 1；没有把测试页第一名冒充正式知识第一名。
- [无结果提示和结果跳转](evidence/p4/search-jump-after.json)：不存在的词无结果；完整文件名结果实际跳到恢复文章“显式指定来源”锚点。
- Node 使用实际 VitePress 配置与生产 MiniSearch 索引，检查文件名、中文、英文和代码独有标识符，前 5 条命中；不能以此替代上方实际浏览器验收。
- [修复后搜索截图](evidence/p4/search-filename-fixed.png)。未改布局或知识富文本，通用视口证据沿用 P2/P3；本轮没有重新验证真实手机或其他浏览器。

限制：中文逐字查询不保证短语连续性，搜索相关性仍只覆盖小规模样本；完整带点文件名这一失败样例已修复，不承诺任意符号字符串、子串或大规模搜索质量。旧 P3 证据保留原失败结果，当前更正由本记录说明。

官方依据核查：[VitePress 1.6.4 的 MiniSearch options](https://vuejs.github.io/vitepress/v1/reference/default-theme-search#minisearch-options)允许定制 tokenize；本次并读取本地 1.6.4 的索引构建、函数序列化及 VPLocalSearchBox.vue 实现，确认构建与查询均接收同一配置函数。

## P4-L02：依赖兼容修复评估

原目标：查明现有 audit 报告是否有符合已确认稳定框架范围的修复路径，不 force 升级。

- 实际安装链为 VitePress 1.6.4 → Vite 5.4.21 → esbuild 0.21.5。框架要求 Vite ^5.4.14，Vite 要求 esbuild ^0.21.3。
- npm 官方注册表查询结果：[兼容版本元数据](evidence/p4/compatible-version-metadata.json)。核查时 VitePress latest 仍 1.6.4，next 为 2.0.0-alpha.21；允许的 Vite 最新为 5.4.21，esbuild 为 0.21.5，均与当前安装一致。
- [Vite 维护者的 .map 路径公告](https://github.com/vitejs/vite/security/advisories/GHSA-4w7w-66w2-5vf9)列出的修复从 6.4.2 等版本开始；[esbuild 维护者公告](https://github.com/evanw/esbuild/security/advisories/GHSA-67mh-4wv8-2f99)修复从 0.25.0 开始，均超出当前声明依赖范围。不是一次同范围 patch 更新即可消除现有报告的情况。
- 因无符合当前范围的已发布候选，本轮不做越范围 overrides、不安装预发布框架、不运行 audit fix --force，也没有候选升级构建结果。评估完成，漏洞修复本身未完成，原 [audit 报告](evidence/p4/dependency-audit.json)保留 2 moderate/1 high。
- 本项目工作流只上传静态 dist，不上传 node_modules 或启动开发服务；dev/preview 继续只绑定 127.0.0.1。这不能概括成所有开发服务器风险均已解除，尤其 esbuild 公告包含访问本机服务的情形。其他 audit 条目的精细适用性本轮未逐一验证，不提供完整安全审计结论。

元数据先尝试通过浏览工具读取注册表失败，改用现有 npm CLI 的只读 view 查询成功。package.json 与 package-lock.json 未修改。后续如考虑框架迁移或越范围版本，须另行评估兼容性和范围，不擅自强制升级。

## P4-04-local-build：历史快照重建

原目标：在不影响未提交工作区的条件下，为回退流程验证候选历史版本能够构建。

使用只读 git archive 分别提取 P2 的 dbf620f 和 P3 的 14cc80b 到忽略的 `.private/history-build-check-copy/`；没有切换分支或覆盖正式文件。确认两份历史锁文件 SHA-256 与当前相同后，将已安装 node_modules 复制到各自隔离目录，再执行历史自带的文档检查、构建和产物检查。

| 历史版本 | Markdown/文件链接 | 构建 | 产物引用 | 结果 |
| --- | --- | --- | --- | --- |
| dbf620f / P2 | 26 / 70 | 2.70 秒 | 10 HTML / 234 | 通过 |
| 14cc80b / P3 | 28 / 106 | 2.82 秒 | 11 HTML / 275 | 通过 |

[原始运行记录](evidence/p4/history-builds.json)包含完整提交 SHA、锁文件哈希、命令、输出和退出码。验证前后正式 knowledge/ 的 22 个源文件清单及哈希一致，HEAD 保持 14cc80b，分支保持 feat/pages-ci；当前搜索配置修复没有被历史版本覆盖。

首次尝试通过 junction 复用依赖受 EPERM 阻止，未开始历史构建；改为隔离复制后两版均通过。这里复用了已安装依赖的副本，不是两次历史 npm ci 或 Linux 验证。只证明历史候选可重建，没有执行 git revert、创建回退提交、恢复当前工作区或线上回退；P4-04 的远程部分继续未完成。

## 工作流复核与后续边界

已有两份 YAML 解析、触发条件、分支门槛、最小权限和构建依赖检查，以及坏链接失败/修复成功的本地证据继续有效，工作流本轮未修改。人工复核部署任务未检出或执行知识源文件、只读取 main SHA 再调用官方 Pages action。未运行 actionlint 或真实 GitHub runner，不把本地通过描述为真实 PR/CI/Pages 验收。

当前三项本地目标中的搜索修复、兼容路径评估、历史快照构建验证均有独立证据；漏洞修复、真实回退、远程与 P5 没有因此完成。全程没有暂存、提交、推送或新建 PR；未执行知识文章中的恢复命令。
