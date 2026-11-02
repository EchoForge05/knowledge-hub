# InnoDB 的 redo、undo 与 MVCC

## MySQL 中的 redo log 和 undo log 有什么区别？

redo log 是重做日志，主要用于数据库崩溃后的恢复，保证已提交事务的修改能够在恢复过程中得到正确处理；undo log 是回滚日志，保存数据修改前的信息，用于事务回滚，同时为 MVCC 提供历史版本。例如，账户余额从 1000 元修改为 800 元，redo log 用于恢复这次修改，undo log 则可以提供修改前的 1000 元数据。

## 什么是 MVCC？它有什么作用？

MVCC 是多版本并发控制，主要通过保存数据的多个版本，让事务根据可见性规则读取合适的版本，从而减少普通读操作与写操作之间的锁竞争。在 MySQL InnoDB 中，MVCC 主要依赖 Undo Log 保存历史版本，依靠 Read View 判断事务能够看到哪些版本，并通过记录的版本链找到符合条件的数据。需要注意，MVCC 并不意味着所有读写操作都不需要加锁，例如 SELECT ... FOR UPDATE 属于当前读，需要使用相应的锁机制。

## MVCC 和 redo log 有什么关系？

MVCC 和 redo log 都与数据库事务有关，但解决的问题不同。MVCC 主要解决并发事务应该读取哪个数据版本的问题，redo log 主要用于数据库崩溃后的恢复，而 Undo Log 既支持事务回滚，也为 MVCC 提供历史版本。简单来说，Undo Log 保存历史版本，MVCC 判断版本是否可见，redo log 负责崩溃恢复。

## 恢复与可见性的边界

余额例子是用途类比：redo 记录恢复所需的底层修改，不应理解为一条“把余额改成800”的业务 SQL；undo 保存重建旧版本及回滚所需信息，也不是每次复制整行。崩溃恢复可能重放未提交事务的修改，再通过 undo 回滚未完成事务；不能理解为 redo 中只有已提交事务。提交持久性还受日志刷盘配置和存储可靠性影响。

普通一致性读按快照可见性选择版本：REPEATABLE READ 通常复用首次一致性读建立的快照，READ COMMITTED 每次一致性读建立新快照。锁定读及更新使用相应锁机制，不应套用普通快照读的规则；MVCC 不保证任意读写都不阻塞，也不是靠 redo 判断版本可见。

## 来源与适用范围

MySQL 8.4 InnoDB；核查日期：2026-11-02。输入未注明出处或版本；本文按以下官方资料校订。示例用于解释，未编译或连接数据库执行，性能结论须用实际环境验证。

- [InnoDB Redo Log](https://dev.mysql.com/doc/refman/8.4/en/innodb-redo-log.html)
- [InnoDB 多版本](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html)
- [事务隔离级别](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html)
