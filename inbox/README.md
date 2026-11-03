# 输入暂存区

可直接在 Codex 对话中提供零散记录，也可将 UTF-8 Markdown/TXT 批量放入 `local/pending/`，然后输入“导入知识”。详见[文件导入](../docs/handbook/file-import.md)，格式参考 `import-example.txt`。`local/receipts/` 保存回执；完整导入、验证并复核回执后自动删除对应原文件，失败或部分完成保留。

建议同时说明可公开范围、适用版本、来源链接和不确定之处；不知道的项可留空并说明。Agent 会先检索已有主题，再选择新建、更新或无需改动。处理顺序和来源记录见[知识整理流程](../docs/handbook/knowledge-workflow.md)。

如果需要本地暂存，将原文放入本目录下的 `local/` 子目录；根 `.gitignore` 已忽略该路径，原始记录不随仓库分发。需要入库的可公开来源摘要由 Agent 随知识文档保存，不能依赖本地临时文件实现跨设备追溯。

不要把银行内部文档、客户信息、密钥或未经授权的数据写入仓库。忽略规则不提供加密，也不会清除已跟踪的文件。D037新增[Issue人工接收](../docs/handbook/issue-intake.md)，显式导入到local/issues；不自动运行或发布，公开来源与有效结论需另随知识正文保留。
