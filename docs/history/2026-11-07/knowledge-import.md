# 第二批知识文件导入与发布

2026-11-07 用户明确要求导入知识并发布。输入为三份获准公开的技术笔记，账户和交易数据均为示例。起始 main 为 `86469b7`，工作区干净。本批分支为 `docs/november-knowledge-import`。

| 输入 | 覆盖范围 | 对应文章 |
| --- | --- | --- |
| 1.txt | 指令、上下文、消息模板、工具结果、Memory、RAG 和窗口预算 | [Agent 的 Prompt 与 Context](../../../knowledge/agent/prompt-and-context.md) |
| 2.txt | Redis 原子加锁、安全释放、Redisson 看门狗、固定租约、续期故障及 fencing | [Redis 分布式锁与 Redisson 看门狗](../../../knowledge/databases/redis-distributed-lock.md) |
| 3.txt | HashMap、ConcurrentHashMap、CAS、内存模型、计数、可重入锁、死锁和转账事务 | [HashMap](../../../knowledge/java/hash-map-internals.md)、[ConcurrentHashMap](../../../knowledge/java/concurrent-hash-map.md)、[Java 并发与锁](../../../knowledge/java/concurrency-and-locks.md)、[Spring JDBC 与 InnoDB 转账事务](../../../knowledge/spring/jdbc-transactions-and-transfers.md) |

按独立主题新建 5 篇，增补 ConcurrentHashMap 版本差异，并从进程与线程文章补入相关链接。同步知识目录、侧栏和 README 文章数。官方来源与适用条件保存在正文。业务代码、SQL 和 Lua 为说明性示例，未连接服务执行。

## 验证和发布

本地 VitePress 构建及产物检查通过，覆盖 22 个 HTML 与 832 处本地引用。生产预览中，11 组搜索均在第 1 位返回预期页面，点击后页面与锚点匹配。iPhone 13 模拟视口下，从目录进入 5 篇新文章和 ConcurrentHashMap，页面均无整体横向溢出。

发布经既有 PR 检查和 Pages 流程，用户阅读验收仍见 [V07](../../project/backlog.md#v07文件导入首批真实使用验证)。
