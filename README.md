# Knowledge Hub

按主题整理、阅读和搜索技术知识的静态知识站。Markdown 保存正文，Git 管理版本，VitePress 构建网页，GitHub Pages 发布；普通阅读、搜索和本地构建无需模型。

[打开知识站](https://echoforge05.github.io/knowledge-hub/) · [知识目录](knowledge/topics.md)

## 从这里开始

| 你想了解 | 阅读入口 |
| --- | --- |
| 如何在线和离线阅读、提交笔记、查看本地未提交修改 | [使用说明](docs/handbook/usage.md) |
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
| 文章下架 | 维护者可从文章页发起 GitHub 流程，自动准备下架变更，审核合并并发布后从公开站点移除，见[操作说明](docs/handbook/usage.md#下架文章) |
| 交给 Codex 删除或修改 | 每篇文章自动填写标题、路径和网址；删除可直接复制请求，修改只需填写要求，再发到本项目对话。见[操作说明](docs/handbook/usage.md#交给-codex-删除或修改文章) |
| 全文搜索 | 站内本地搜索，Ctrl / Command + K 打开；中文逐字匹配，ASCII 标识符整词匹配，不保证任意子串或短语连续性 |
| 完整离线阅读 | 从站点使用指南下载 HTML，或在本地生成。双击打开知识目录，断网时仍可查找全文、看图和跳转。见[离线阅读用法](docs/handbook/usage.md#离线阅读) |
| 知识维护 | 将资料交给 Codex，搜索已有主题后新建、增补、去重或处理矛盾，保留原理、示例、版本、风险与来源 |
| Issue 人工接收 | 公开资料表单、无密钥导出、离线校验与显式接收；不会自动生成文章或发布。真实 Issue 正向往返仍待验收 |
| 可选模型草稿 | 本机显式预览与调用，人工核查后入库；独立于日常阅读和维护，新增调用须另行授权 |
| 检查与发布 | 文档检查、离线测试、站点构建、产物检查；经审核合并 main 后由既有流程发布 |

网站阅读入口已上线，离线阅读包可在本地生成。其余未完成项见[待办清单](docs/project/backlog.md)。独立 Agent 的开发计划由同父目录的 knowledge-agent 项目维护。

## 快速使用

- **在线阅读**：打开[知识站](https://echoforge05.github.io/knowledge-hub/)，从知识目录选文章，或用顶部搜索。
- **断网阅读**：联网时到[网站使用指南](https://echoforge05.github.io/knowledge-hub/guide.html#离线阅读)下载 HTML，保存后双击打开。Codex 改完内容会更新本地的 `dist/offline/Knowledge Hub.html`。自己编辑时，可[开启保存后自动更新](docs/handbook/usage.md#自己编辑时保存后自动更新)。
- **查看还没提交的修改**：在仓库根目录运行 `git status --short` 看文件列表，运行 `git diff HEAD` 看 Git 已跟踪文件的改动。想看网页效果，运行 `npm run dev` 后打开终端给出的本地地址。首次安装、新文件及具体操作见[查看本地未提交的修改](docs/handbook/usage.md#查看本地未提交的修改)。

整理资料时，在本项目 Codex 对话中提供可公开内容、来源、版本和疑点，要求先检索已有文章。长资料可放入本地忽略目录 `inbox/local/`。仓库和网站公开，敏感信息与密钥不得入库，本地忽略目录不提供加密或备份。

Issue 接收、可选草稿及更多操作见[使用说明](docs/handbook/usage.md)。
