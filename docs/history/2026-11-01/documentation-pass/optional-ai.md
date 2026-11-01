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

- 模型已确认gpt-6-sol，配置模板默认使用国内接入地址；实际使用时可在本机修改。
- KNOWLEDGE_AI_CHAT_URL填写完整请求地址，不能只填写接入基础地址：

| 接入模式 | 完整 Chat Completions 地址 |
| --- | --- |
| 国内中转（本轮已实测） | https://endpoint.wendalog.com/v1/chat/completions |
| 直连接口（根地址连通、模型请求未测） | https://endpoint.greatrouter.com/v1/chat/completions |

两种模式均由用户提供，使用Bearer API Key；脚本仅允许这两个主机的HTTPS指定路径，不跟随重定向、不自动切换模式。密钥字段只填KEY本身，不加Bearer前缀；代码负责添加认证头。
- 默认输出上限4096 token，可设128–8192；这不是美元/人民币费用上限。实际发送前核对价格和费用，不能把“价格不过分”当作无限预算。
- 单次请求超时30秒，不自动重试；失败可能仍被平台计费，再次发送前检查账单。
- 请求使用 Chat Completions 的 max_completion_tokens，平台/模型若不支持会报错，不静默换参数、换模型或降级。响应被截断/过滤、空白或格式异常时不保存草稿，不输出原始错误响应。
- 不启用工具、Issues 或 Actions，不在网页中放密钥。提示词能降低错误，不能保证输出事实正确或完全抵御恶意输入。

本轮7项离线测试、3份公开Git/SQL/Spring资料的真实国内调用通过；代码、来源、版本/限制保留，未观察到关键新增事实错误。返回标识均为gpt-6-sol，合计1450输入/1519输出token，按用户价表估算$0.016281，非已核实账单。命令会显示安全的模型/usage摘要，缺失usage不补造。

3次验收额度已用尽；后续由用户手动调用，Agent追加测试需另行明确范围。结果仅代表这三份短资料的忠实改写，不保证任意输入质量或上游身份；草稿仍需审核，不执行其中代码。[验收证据](../../../project/evidence/p5/live-sol.json) · 测试：npm run test:ai · [详细记录](../p5-model-discussion.md)。
