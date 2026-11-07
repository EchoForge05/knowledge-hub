# Knowledge Hub

按主题整理、阅读和搜索技术知识的静态知识站。Markdown 保存正文，Git 管理版本，VitePress 构建网页，GitHub Pages 发布；普通阅读、搜索和本地构建无需模型。

[打开知识站](https://echoforge05.github.io/knowledge-hub/) · [知识目录](knowledge/topics.md)

## 从这里开始

| 你想了解 | 阅读入口 |
| --- | --- |
| 如何阅读、搜索、提交笔记、本地运行与排查问题 | [使用说明](docs/handbook/usage.md) |
| 技术架构、数据流、目录职责、主要文件作用 | [架构与文件说明](docs/project/architecture.md) |
| 接下来做什么、按什么顺序推进 | [开发计划](docs/project/roadmap.md) |
| 哪些功能未完成、未验收或待交付 | [待办清单](docs/project/backlog.md) |
| 产品范围与验收要求 | [需求说明](docs/project/requirements.md) |
| 修改文章、运行检查或维护发布 | [开发与维护导航](docs/README.md) |

日常从本页进入即可。执行记录、历史授权和验收回执已集中归档，由 Agent 按需追溯，不放在日常阅读路径中。

## 现有功能

| 功能 | 当前行为与边界 |
| --- | --- |
| 文件批量导入 | 将 Markdown/TXT 放入 `inbox/local/pending/`，在 Codex 输入“导入知识”；按主题去重整理，验证并复核成功回执后自动删除原文件，失败或部分完成保留，见[文件导入](docs/handbook/file-import.md) |
| 分类阅读 | 覆盖 Java、Spring、数据库、Linux、Git 和 AI Agent，支持代码高亮、表格、图片、内链与手机布局 |
| 文章下架 | 本地已实现，待发布。文章页可发起 GitHub 维护流程，自动准备下架变更，审核合并后从公开站点移除，见[操作说明](docs/handbook/usage.md#下架文章) |
| 全文搜索 | 站内本地搜索，Ctrl / Command + K 打开；中文逐字匹配，ASCII 标识符整词匹配，不保证任意子串或短语连续性 |
| 知识维护 | 将资料交给 Codex，搜索已有主题后新建、增补、去重或处理矛盾，保留原理、示例、版本、风险与来源 |
| Issue 人工接收 | 公开资料表单、无密钥导出、离线校验与显式接收；不会自动生成文章或发布。真实 Issue 正向往返仍待验收 |
| 可选模型草稿 | 本机显式预览与调用，人工核查后入库；独立于日常阅读和维护，新增调用须另行授权 |
| 检查与发布 | 文档检查、离线测试、站点构建、产物检查；经审核合并 main 后由既有流程发布 |

本站及本批文章阅读修订已上线。完整离线阅读包尚未实现，具体限制与未完成项以[待办清单](docs/project/backlog.md)为准。独立 Agent 的开发计划由同父目录的 knowledge-agent 项目维护。

## 快速使用

阅读直接打开知识站。整理资料时，在本项目 Codex 对话中提供可公开内容、来源、版本和疑点，要求先检索已有文章；长资料可放入本地忽略目录 inbox/local/。仓库和网站公开，敏感信息与密钥不得入库，本地忽略目录不提供加密或备份。

本地开发准备 Node 24.22.1 或更高的24.x、npm 11，在 knowledge-hub 根目录执行：

```sh
npm ci
npm run dev
```

打开终端显示的 /knowledge-hub/ 地址，默认 http://127.0.0.1:5173/knowledge-hub/ 。本机缓存运行时的选择见[本地开发说明](docs/handbook/site-development.md)。这需要本地服务，尚不等于双击即可离线阅读的 L06。

修改后的基本检查：

```sh
npm run check
npm run build
npm run check:site
```

Issue 接收、可选草稿及更多操作见[使用说明](docs/handbook/usage.md)。
