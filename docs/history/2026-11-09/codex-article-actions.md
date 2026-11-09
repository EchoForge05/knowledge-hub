# D054 Codex 文章维护入口

用户要求保留 GitHub 下架，同时在正式文章提供 Codex 删除和修改请求，并在验证通过后发布。删除直接复制，修改输入要求后复制，请求自动携带文章标题、仓库、文件路径和网址。两种请求均由用户粘贴到本项目对话并发送。

## 本地验收

- 起始 main 为 `62b27c4`，工作区干净。开发分支为 `feat/codex-article-actions`。
- 文档检查、构建和站点检查通过，产物共 22 个 HTML 和 834 处引用。
- Chrome 桌面 1440×900 和手机 390×844 视口均核对删除和多行修改请求、空输入、焦点、站内切换后的状态清理、拒绝剪贴板权限后的手动复制、原 GitHub 下架入口和四种非文章页面。
- 使用浏览器实际复制的两份请求在隔离仓库演练。修改只在指定文章加入指定句子，构建后可见。删除复用现有命令，检查目录、侧栏、页面和搜索索引，相关旧文章仍在索引中。

## 远程交付

- PR #18 的 head `9d40707` 通过 CI 后合并为 `8d4f2dd`，Pages 发布成功。本地 main 已快进同步该功能提交。[发布 PR](https://github.com/EchoForge05/knowledge-hub/pull/18) · [CI](https://github.com/EchoForge05/knowledge-hub/actions/runs/42595780145) · [Pages](https://github.com/EchoForge05/knowledge-hub/actions/runs/42595879123)
- 逐页核验 17 篇正式文章及 4 个非文章页面均返回 HTTP 200。正式文章均含新 Codex 操作、正确文章路径及原 GitHub 入口，非文章页面无操作入口。
- 正式文章未用于演练变更。日常使用时由用户发送复制的请求，Codex 验证并展示本地变更；公开发布按用户当次要求执行。
