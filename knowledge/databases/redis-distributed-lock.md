# Redis 分布式锁与 Redisson 看门狗

`synchronized` 和 `ReentrantLock` 协调同一 JVM 内的线程。多实例服务可以使用共享 Redis 锁协调对同一资源的访问。锁的互斥依赖租约和部署故障模型，关键写入仍应受[数据库事务与约束](../spring/jdbc-transactions-and-transfers.md)保护。

## 原子加锁与安全释放

```text
SET lock:account:1001 UUID_A NX EX 30
```

键标识资源，值标识本次获取。实际调用为每次新的获取生成唯一标识。Redis 在同一条命令中判断键不存在并设置值与 30 秒 TTL，返回成功时才进入临界区。分开执行 GET、SET 和过期设置会引入竞态或遗留无 TTL 的锁。可重入锁还需要跟踪持有者和重入次数。

若 A 在第 30 秒失去锁，B 随后拿到同一个键，A 在第 40 秒执行普通 DEL 就会误删 B 的锁，C 可能随即进入。应原子比较标识并删除。分别执行 GET 与 DEL 也有同样的时序窗口。

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
end
return 0
```

`KEYS[1]` 为锁键，`ARGV[1]` 为本次获取使用的唯一值。该脚本保护解锁阶段，过期后仍在执行的业务需要单独控制。

## Redisson 的续期与释放

Redisson 的 `RLock` 封装所有者校验、重入计数、等待和续期。对于使用看门狗的加锁方式，例如 `lock()`，默认 `lockWatchdogTimeout` 为 30 秒。以 Redisson 3.52.0 的实现为例，续期调度间隔约为超时的三分之一，默认约 10 秒。成功续期会把 TTL 重置为 30 秒。理想情况下第 10、20、30 秒分别重置，业务第 40 秒结束后主动释放。实际调度和网络延迟会影响结果。

显式调用 `lock(30, TimeUnit.SECONDS)` 指定固定租约，业务可能在租约结束后仍继续。看门狗要求客户端、调度和 Redis 访问正常，且锁仍属于该持有者。释放后停止对应续期，进程崩溃或长时间续期失败时，TTL 允许其他客户端最终接手。若只有业务线程死循环，Redisson 和续期任务仍正常，锁可能长期续期。可为业务设计超时、合作式取消及锁持有时间监控。Java 中断需要业务代码配合。

```java
RLock lock = redissonClient.getLock("lock:account:1001");
if (!lock.tryLock(10, TimeUnit.SECONDS)) {
    throw new IllegalStateException("获取锁超时");
}

try {
    doBusiness();
} finally {
    if (lock.isHeldByCurrentThread()) {
        lock.unlock();
    }
}
```

此重载等待获取最多 10 秒，未显式指定租约，调用者应按业务处理 `InterruptedException`。持有检查与解锁之间仍可能失去租约，`unlock()` 会校验所有权并可能抛出 `IllegalMonitorStateException`，调用方应将失锁与业务结果一起处理。JVM 崩溃时依靠 TTL。

## 租约失效与下游写入

JVM 长时间 Stop-The-World（例如某些 GC 暂停）或网络中断可能使 A 错过续期。B 获取锁后，恢复的 A 仍可能执行写入。单主节点锁还受异步复制故障转移影响，主节点在锁复制前故障可能允许另一客户端获取同一把锁。

针对业务数据可以使用数据库条件更新、版本号校验或 fencing token。后者要求每次获取分配单调递增令牌，并由下游资源原子校验和记录已接受的最大令牌，拒绝更旧的写入。UUID 用于区分所有者，没有这个顺序属性。账户余额等关键状态仍以数据库事务、约束和幂等机制为基础。

## 来源与适用范围

核查日期 2026-11-07。代码用于解释，未连接 Redis 或运行示例。

- [Redis 分布式锁](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Redisson 锁、故障转移和 fencing](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/)
- [Redisson 3.52.0 续期调度源码](https://github.com/redisson/redisson/blob/redisson-3.52.0/redisson/src/main/java/org/redisson/renewal/RenewalTask.java)
