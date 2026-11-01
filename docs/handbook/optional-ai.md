# 可选模型草稿

主维护流程仍是 Codex 直接整理；本命令只辅助生成编程资料草稿，不负责去重、改库、提交或发布。无需配置 API 也能阅读、维护、检查和发布知识站。

## 使用

Node 24 环境下，先指定一份 knowledge/ 或 inbox/local/ 内的 Markdown/文本文件：

```sh
npm run ai:draft -- --input knowledge/git/restore-basics.md
```

默认只预览文件名、大小和配置，不发送原文。需要时将 .env.example 复制为被忽略的 .env.local，在本机填写模型、完整 Chat Completions URL 和密钥；不要在聊天、仓库或 PR 中发送密钥。

实际调用需显式添加 --send：

```sh
npm run ai:draft -- --input knowledge/git/restore-basics.md --send
```

只发这一份输入，草稿存入被忽略的 .private/ai-drafts/，不覆盖原文。交给 Codex 核对代码/版本/来源、检索去重，再走原检查与 PR。输入限公开或已脱敏编程技术资料，64 KiB 以内；常见凭据模式命中时停止，模式扫描不是完整隐私审计。

## 配置与限制

- GreatRouter 公开示例给出 base_url=https://endpoint.greatrouter.com；完整请求路径仍须按账号接口文档确认，不猜测 /v1。配置完整 URL，脚本只允许该主机的 HTTPS，不跟随重定向。
- 不硬编码 gpt-5-nano。低频使用优先合适、质量可靠的模型；模型名称及实际输入/输出价格仍待确认。
- 默认输出上限4096 token，可设128–8192；这不是美元/人民币费用上限。实际发送前核对价格和费用，不能把“价格不过分”当作无限预算。
- 单次请求超时30秒，不自动重试；失败可能仍被平台计费，再次发送前检查账单。
- 请求使用 Chat Completions 的 max_completion_tokens，平台/模型若不支持会报错，不静默换参数、换模型或降级。响应被截断/过滤、空白或格式异常时不保存草稿，不输出原始错误响应。
- 不启用工具、Issues 或 Actions，不在网页中放密钥。提示词能降低错误，不能保证输出事实正确或完全抵御恶意输入。

本轮仅离线模拟验证；尚未发起真实模型调用，接口兼容性、实付费用和生成质量仍待端到端验收。测试：npm run test:ai。提供商核查见[模型讨论](../history/2026-11-01/p5-model-discussion.md)。
