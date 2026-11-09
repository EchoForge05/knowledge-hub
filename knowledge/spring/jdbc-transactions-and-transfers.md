# Spring JDBC 与 InnoDB 转账事务

同一个本地数据库事务可以原子地提交扣款、入账和交易流水。以 Spring 声明式事务、MyBatis 和 MySQL InnoDB 为例，Spring 管理事务边界，MyBatis 执行 SQL 和映射结果，JDBC 提供连接与事务操作，InnoDB 执行加锁、修改、提交和回滚。

## 从 Spring 代理到数据库连接

请求通常经 Controller 到 Service，事务拦截器根据 `@Transactional` 和传播配置加入现有事务或建立事务。以新建 JDBC 本地事务为例，事务管理器取得数据源连接，必要时关闭自动提交，并将其绑定到当前线程。与 Spring 事务正确集成且使用同一数据源的 MyBatis 操作共享事务连接。业务方法返回后，由事务管理器在边界上提交或回滚，并清理绑定的连接。

应用事务边界、数据库内部启动和一致性读建立快照的时点需要分别理解。它们取决于事务配置、隔离级别和实际 SQL。比如 InnoDB 在 REPEATABLE READ 下通常由事务中第一次一致性读取建立后续一致性读共享的快照。

## 锁定两笔余额再处理转账

在有效事务中按统一顺序逐条查询。示例假设 `account_id` 是唯一索引，两个账户存在，所有账户更新路径采用同样的顺序。

```sql
SELECT balance FROM account WHERE account_id = '1001' FOR UPDATE;
SELECT balance FROM account WHERE account_id = '1002' FOR UPDATE;
```

就算业务方向是 1002 向 1001 转账，也先锁 1001。锁定读取只读取并加锁，余额修改由后续 UPDATE 完成。锁定范围由索引、隔离级别和执行计划决定。单条 SQL 中 `IN ('1001','1002')` 的列表顺序不保证取锁顺序。统一顺序可消除这两个账户之间的特定等待环，其他索引、外键或表仍可能导致死锁。

如果另一事务已持有冲突锁，默认锁定读取会等待，直到对方释放、等待超时或数据库处理死锁。若事务 A 已通过 UPDATE 锁住 1001、事务 B 已锁住 1002，双方再分别更新对方的记录就可能形成环。READ COMMITTED 和 REPEATABLE READ 下的普通一致性读通常可读到可见的历史版本，不必等待这类行锁。

## UPDATE、COMMIT 与 ROLLBACK

假设 A 有 5000 元，B 有 2000 元，A 向 B 转 1000 元。应用先按统一顺序锁住两行，校验余额、金额和账户状态，再执行以下示意 SQL 并检查受影响行数。

```sql
UPDATE account SET balance = balance - 1000 WHERE account_id = 'A';
UPDATE account SET balance = balance + 1000 WHERE account_id = 'B';
```

第一条成功后，本事务看到 A 为 4000、B 为 2000。第二条成功后看到 A 为 4000、B 为 3000。其他事务的普通一致性读取通常看不到这些未提交的修改。应用在同一事务写入交易流水，然后由 Spring 调用 JDBC `commit()`，InnoDB 完成提交并释放事务锁。

如果入账或写流水失败，且异常触发整个本地事务回滚，已执行的扣款也会撤销，最终仍为 5000 和 2000。InnoDB 用 undo 信息撤销修改并支持 MVCC，redo 用于崩溃恢复，MySQL Server 的 binlog 可用于复制和时间点恢复。参见 [InnoDB 的 redo、undo 与 MVCC](../databases/innodb-logs-and-mvcc.md)。

从 ACID 的角度看，原子性覆盖扣款、入账和流水的提交或回滚，隔离性约束并发事务之间的可见性与冲突，持久性取决于提交后的恢复保证及刷盘配置。金额守恒、余额下限等一致性条件仍需由业务校验和数据库约束共同维护。

普通 COMMIT 确认当前事务的修改，不会重新执行所有 UPDATE 或默认比较原值。若采用乐观并发控制，可在写入时比较预期版本并检查受影响行数：

```sql
UPDATE account
SET balance = balance - 100, version = version + 1
WHERE account_id = '1001' AND version = 5 AND balance >= 100;
```

更新为 0 行表示至少一个条件未满足，应用需要判断是版本冲突、余额不足还是记录不存在。

## 回滚规则与事务边界

- Spring 声明式事务默认对逃出事务方法的 `RuntimeException` 和 `Error` 回滚。要让指定受检异常触发回滚，可配置 `@Transactional(rollbackFor = Exception.class)` 或更具体的异常类。余额不足可作为业务失败按相应规则处理。
- 吞掉异常可能使代理按正常返回尝试提交。需要回滚时可重新抛出符合规则的异常，或在事务拦截上下文中调用 `TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()`。底层事务已有仅回滚标记时，即使上层捕获了异常，也可能回滚。
- InnoDB 检测到死锁时会回滚被选中的事务。默认配置下锁等待超时通常只回滚失败语句，唯一键冲突等 SQL 错误也不保证整个事务结束。应用应根据具体错误处理整个业务单元，需重试时开启新事务。
- 默认代理模式下，Service 内 `execute()` 直接调用同类的 `transfer()`，不会经代理应用被调用方法上的事务设置。若调用者已在事务中，SQL 仍可能在已有事务内执行。
- JDBC 本地事务通常绑定当前线程，创建新线程或调用其他服务时应明确各自的事务边界。

以下示意代码展示自调用。只有通过已配置的事务代理进入 `transfer()` 才会应用该方法的声明式设置。

```java
@Service
public class TransferService {
    public void execute() {
        transfer();
    }

    @Transactional(rollbackFor = Exception.class)
    public void transfer() {
        // 使用事务绑定的连接执行锁定读取、余额更新和流水写入。
    }
}
```

## 提交结果不确定与幂等

业务方法跑完后仍可能在提交阶段报错。例如 MySQL 已提交，但应用在收到结果前断线。此时重做扣款可能产生第二笔交易。可按唯一交易流水号查询权威交易状态，把同一幂等键的唯一约束和记账写入放到同一事务，并按状态决定是否安全重试。跨数据库或服务时应另外设计消息可靠性、分布式事务或补偿。

账户还可能被批处理同时更新。分片、结息入账、断点续跑和对账见[银行联机与批处理的数据一致性](../banking/online-and-batch-consistency.md)。

## 来源与适用范围

适用于由 Spring 管理的单数据源 JDBC 本地事务与 MySQL 8.4 InnoDB。示例为解释流程，未连接数据库执行。核查日期 2026-11-07。

- [Spring 声明式事务注解](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [MySQL 8.4 锁定读取](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html)
- [MySQL 8.4 InnoDB 错误处理](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html)
