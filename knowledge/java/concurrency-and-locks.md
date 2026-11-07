# Java 并发计数、可重入锁与死锁

多个线程更新同一个计数器时，可用 `AtomicInteger.incrementAndGet()`，也可把读、改、写全部放在同一把锁保护的临界区。计数之外还涉及其他共享字段时，先确定哪些更新必须作为一个整体完成。

## volatile 和 synchronized

`volatile` 写入 happens-before 对同一变量的后续读取，并把相关操作纳入 Java 内存模型的可见性和顺序约束。它适合用作简单状态标志。即使 `count` 声明为 `volatile int`，`count++` 仍会读取旧值、计算新值并写回，两个线程可能同时读到 0，分别写回 1。

`synchronized` 允许同一时刻只有一个线程进入受同一监视器保护的临界区。释放监视器 happens-before 随后获取同一监视器。因此共享状态的读写应遵循同一同步策略。它可以修饰方法或用于代码块。实例同步方法使用当前实例，静态同步方法使用类对象。

## 多线程计数

计数初始为 0，100 个线程各成功递增一次，等待全部线程结束（例如逐个 `join()`）后读取，预期结果为 100。以下为两种独立写法：

```java
private int count;
private final Object lock = new Object();

public void increment() {
    synchronized (lock) {
        count++;
    }
}
```

也可以用 `public synchronized void increment()` 并用同一实例监视器保护相关读取。

```java
private final AtomicInteger count = new AtomicInteger();

public void increment() {
    count.incrementAndGet();
}
```

高竞争的统计计数可考虑 `LongAdder` 分散更新压力。并发写入时 `sum()` 只提供汇总观察，不能当作原子快照。

## CAS 与 ABA

Compare and Swap（CAS）原子比较当前位置 V 和预期值 A，相等时用 B 替换。例如预期 100、准备写入 200，当前仍为 100 时才写入。失败后可以根据最新值重新计算，是否重试由调用方决定。CAS 本身不获取互斥锁，竞争激烈时反复失败和重试会消耗 CPU。

若值从 A 变为 B 再回到 A，只比较当前值看不出中间变化，这就是 ABA。需要识别变化时，可以使用 `AtomicStampedReference` 同时比较引用与版本标记，并在更新中正确维护标记。单次 CAS 通常只更新一个位置。多个字段可用同一把锁，或在合适时放入一个不可变对象并原子替换引用。

## synchronized 与 ReentrantLock

| 能力 | synchronized | ReentrantLock |
| --- | --- | --- |
| 实现 | JVM 监视器 | OpenJDK 基于 AQS |
| 释放 | 退出方法或块时自动释放 | 获取成功后在 finally 中 unlock |
| 可重入 | 支持 | 支持 |
| 公平策略 | 无配置接口 | 构造时可选公平策略 |
| 获取方式 | 等待进入监视器 | 支持 tryLock、超时和 lockInterruptibly |

同一线程已持有同一把锁时，可以再次获取它。例如实例同步方法 A 调用同一实例的同步方法 B，线程仍可进入 B。实现需要识别持有线程和重入次数，最后一次匹配释放后其他线程才可获取。公平锁的无参 `tryLock()` 仍可在锁空闲时直接获取。

```java
lock.lock();
try {
    doBusiness();
} finally {
    lock.unlock();
}
```

普通临界区可直接使用 `synchronized`。需要可中断等待、限时获取或公平配置时可选择 `ReentrantLock`。性能取决于 JVM、竞争和临界区，需用实际负载测量。

## 死锁与统一顺序

死锁涉及互斥、持有资源时请求其他资源、资源无法被强制剥夺，以及循环等待四个必要条件。假设 A 已锁账户 1001 并等待 1002，同时 B 已锁 1002 并等待 1001，就出现了循环。两条路径都按账号升序获取锁，可以打破这两个资源上的循环。业务的转出与转入方向独立于锁顺序。

数据库也可能产生同类等待环。涉及数据库记录时，还要考虑索引、执行计划和其他表的锁。参见 [Spring JDBC 与 InnoDB 转账事务](../spring/jdbc-transactions-and-transfers.md)。跨 JVM 的应用锁参见 [Redis 分布式锁](../databases/redis-distributed-lock.md)。

## 来源与适用范围

以 Java SE 8 内存模型、API 和 OpenJDK 8 实现为基准，核查日期 2026-11-07。示例未编译或压测。

- [Java 语言规范第 17 章](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html)
- [Java SE 8 ReentrantLock](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html)
- [Java SE 8 原子变量 API](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
