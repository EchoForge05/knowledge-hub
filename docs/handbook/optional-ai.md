# 可选模型草稿

Codex是主要维护方式；此命令只辅助编程资料改写，草稿需核对、去重后走PR，不自动改库/发布。无需API也能正常维护网站。

## 使用

准备Node24，在本机忽略的.env.local填写KNOWLEDGE_AI_API_KEY（只填KEY，不加Bearer）、KNOWLEDGE_AI_MODEL=gpt-6-sol、KNOWLEDGE_AI_CHAT_URL及输出上限；参考根目录.env.example，不把密钥发到聊天或仓库。

```sh
npm run ai:draft -- --input knowledge/git/restore-basics.md
npm run ai:draft -- --input knowledge/git/restore-basics.md --send
```

第一条仅预览，第二条才发送指定文件。输入限knowledge/或inbox/local/内的UTF-8 Markdown/文本、64KiB以内；只选公开或已脱敏编程资料。草稿存入忽略的.private/ai-drafts/，不覆盖原文。

## 接入与限制

| 模式 | 完整KNOWLEDGE_AI_CHAT_URL |
| --- | --- |
| 国内（已实测） | https://endpoint.wendalog.com/v1/chat/completions |
| 直连（模型API未测） | https://endpoint.greatrouter.com/v1/chat/completions |

仅允许上述HTTPS主机/路径，不重定向或自动切换；Bearer认证由代码添加。默认输出上限4096，可设128–8192 token；30秒超时且不重试。输出被截断/过滤或响应异常时不保存，错误不回显原始响应；常见凭据模式检查不是完整隐私审计。

token上限不等于金额硬限制；命令显示usage，缺失值不补造，实扣以账单为准。D034的3次验收额度已用尽，Agent追加测试需新授权；用户可按需手动调用，不启用Issues或自动发布。

## 验收

7项离线测试、Git/SQL/Spring三份公开资料国内调用通过，代码/来源/版本条件保留；按用户价表估算合计$0.016281，非已核实账单。草稿需复核，短样本成功不保证任意输入质量或上游身份。测试用npm run test:ai，无真实请求。

[真实收据](../project/evidence/p5/live-sol.json) · [详细过程](../history/2026-11-01/p5-model-discussion.md) · [旧版说明](../history/2026-11-01/documentation-pass/optional-ai.md) · [待办](../project/backlog.md)
