# 本地站点开发与内容维护

## 运行环境

使用 Node.js 24 LTS（本次 24.22.1）和 npm 11（本次 11.19.1）。系统默认 Node 14 不兼容，不要用它安装或启动本项目。先在当前终端选择兼容版本；不需要修改全局 Git 或系统 Node 配置。

本机本轮复用 Codex 缓存的 Node，可在 PowerShell 设置当前终端 PATH：

```powershell
$env:Path = 'C:\Users\YUN\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:Path
node --version
```

本轮项目本地 npm 位于被忽略的 `.private/tools/package/bin/npm-cli.js`。它是临时工具，不随仓库分发；其他机器请准备标准 Node 24/npm 11 环境。下列 `npm` 命令在本机本轮需用 `node .private/tools/package/bin/npm-cli.js` 代替。

## 安装、开发、构建与预览

```sh
npm ci
npm run check
npm run dev
npm run build
npm run check:site
npm run preview
```

开发服务默认端口 5173，生产预览默认端口 4173；以实际启动输出为准。访问路径是 `/knowledge-hub/`。构建产物位于 `knowledge/.vitepress/dist/`，不提交产物和缓存。`npm ci` 使用锁文件重装依赖；`npm install` 仅用于有意更新依赖与锁文件的场景。

## 新增或更新文章

1. 按[知识维护流程](knowledge-workflow.md)先搜索现有主题，确认来源、版本和公开边界。
2. 在 `knowledge/` 对应分类维护 Markdown，使用相对内链。图片放 `assets/images/`；不要把过程文档链接进站点正文。
3. 更新 `knowledge/topics.md` 以及 `knowledge/.vitepress/config.ts` 中的小规模手工侧栏。目录使用顿号分隔链接，侧栏文章项各占一行，便于下架时定位；空分类只显示说明。
4. 执行文档检查与构建。修改搜索内容时按[本地验收记录](../history/2026-11-01/structure-pass/site-validation.md)复测相关查询和结果跳转。
5. 同步项目状态和相关说明；已验收任务归档。新增开发通过必要验证后，可按 D023 将成果及配套文档提交一次，提交说明用中文；推送与部署仍遵守原授权边界。

## 搜索与检查范围

VitePress 1.6.4 内置 MiniSearch；当前 tokenizer 以确定性正则保留 ASCII 字母/数字/下划线标识符整词，其他 Unicode 字母/数字逐字，标点作为边界。构建端和浏览器端使用同一函数，避免旧 Intl.Segmenter 在不同运行时对完整文件名切词不同。中文逐字查询不保证短语连续性，不承诺任意子串或大规模相关性。

`npm run check` 检查仓库 Markdown 的 UTF-8、一级标题与本地文件链接，不访问外网，不核查技术事实；不验证标题锚点和链接内容。构建后执行 `npm run check:site` 检查 HTML 中的本地页面、资源、锚点与 base 路径；浏览器检查负责验证实际跳转、展示和搜索。各类检查不能相互代替。

P3 的输入编号、来源保存和去重判断见[知识维护流程](knowledge-workflow.md)，历史维护证据见[维护验收](../history/2026-11-01/structure-pass/knowledge-pilot-validation.md)。完整文件名 restore_note_example.md 的失败样例现已修复，14 组浏览器回归和实际结果跳转通过，见[本地遗留验证](../history/2026-11-01/structure-pass/local-followup-validation.md)；不将一个样例的修复外推为任意符号字符串精确检索。

Windows 下重装依赖前应停止本项目的 dev/preview，避免占用 esbuild.exe。npm 如提示安装脚本未授权，应先核对具体需要；本次未运行 esbuild postinstall，离线重装及构建仍通过，其他平台尚未验证。

## 官方依据

核查日期：2026-10-31。npm 官方注册表的 VitePress `latest` 为 1.6.4，本项目精确锁定该稳定版本；Node 官方发布索引将本机 24.22.1 标为 LTS。实际传递依赖以 `package-lock.json` 为准。

- [VitePress 稳定版搜索与配置](https://vuejs.github.io/vitepress/v1/reference/default-theme-search)
- [VitePress 稳定版部署与子路径](https://vuejs.github.io/vitepress/v1/guide/deploy)
- [npm 官方 VitePress 元数据](https://registry.npmjs.org/vitepress/latest)
- [Node 官方发布索引](https://nodejs.org/dist/index.json)
