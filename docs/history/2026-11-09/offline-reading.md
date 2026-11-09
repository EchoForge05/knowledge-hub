# L06 完整本地离线阅读验收

2026-11-09，用户要求优先完成 L06。生成器复用网站的 VitePress Markdown 渲染器和分词器，生成可移动的单 HTML。以知识目录为首页，提供按小节的全文搜索、文章和段落跳转、图片、代码高亮与表格。生成物位于 `dist/offline/Knowledge Hub.html`，共 17 篇正式文章，内容版本 `29929dfcd3ba`。构建只替换成功生成的本地文件。原始需求和方案演变见[历史提案](local-reading-design.md)，操作见[离线阅读用法](../../handbook/usage.md#离线阅读)。

## 检查结果

- Windows Chrome 浏览器离线模式以 `file:` 打开含空格和中文路径下的独立副本，无本地服务、HTTP 请求或浏览器报错。以桌面和 390×844 视口核对目录、可显示的内嵌 SVG、代码与宽表格局部滚动。
- 逐页比对 17 篇正式文章、目录、指南和展示测试页的正文与 VitePress 构建产物，核对代码、表格、图片和折叠内容；138 个内部链接都有目标。点击验证了目录到文章、文章到段落、跨页段落链接、浏览器返回和刷新恢复。
- 实测“事务隔离级别”“深分页”、`ConcurrentHashMap`、`restore_note_example.md` 和仅在代码中出现的 `fixture_search_marker`，首条结果均可用回车实际打开。测试了 Ctrl+K 聚焦与无结果提示。
- 以临时文章模拟图片缺失，构建失败且旧产物哈希未变；修复样本后成功替换为 18 篇版本，清理样本后恢复 17 篇。VitePress 生产构建和站点检查通过，共 22 个 HTML、834 处引用。
- 文档检查通过，共 93 份 Markdown、513 处本地文件链接，`git diff --check` 通过。

## 交付边界与续接

成果留在本地 `feat/offline-reading` 分支的工作区，生成文件为 Git 忽略产物。验收范围为 Windows Chrome 和浏览器离线模式；真实手机、其他浏览器以及外部来源的在线可用性未在本次验证。下一次资料入库后，按用法重新生成即可刷新本地快照。V06、V07、M01 等保持原有待办状态。

## 远程交付

用户追加要求检查指引并提交发布。README、用户手册、维护导航、开发与发布手册已同步；站点使用指南新增下载入口，Pages 与网站从同一提交生成离线包。PR #20 锁定提交 `27492f8`，分支与 PR 检查通过后合并为 `cd137ac`，Pages 构建与部署均通过。[PR #20](https://github.com/EchoForge05/knowledge-hub/pull/20) · [分支 CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/42598076427) · [PR CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/42598125797) · [Pages](https://github.com/EchoForge05/knowledge-hub/actions/runs/42598226202)

上线复核发现 Windows 检出 SVG 时的 CRLF 让本地与 Pages 对相同内容显示不同版本。生成器统一内嵌 SVG 的行尾；本地与下载包的文章和内嵌图片已逐字比对一致，内容版本均为 `d8af41d75a7f`。已发布副本见[站点使用指南](https://echoforge05.github.io/knowledge-hub/guide.html#离线阅读)。

在 Chrome 实际点击线上按钮下载 HTML，断网后以 `file:` 打开。17 篇正文在包内，搜索代码标识符可跳到“搜索样本”，内嵌图片正常显示。
