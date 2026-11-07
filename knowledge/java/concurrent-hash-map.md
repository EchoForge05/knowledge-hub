# ConcurrentHashMap 的基本使用边界

适用于 Java SE 21。示例未运行。

## 并发访问

`ConcurrentHashMap` 提供线程安全的映射操作。读取通常不阻塞，可与更新并发进行；它不提供阻止所有访问的整表锁。

不允许空键或空值。并发更新期间，`size()` 等汇总结果可能只反映瞬时状态，不宜据此控制需要一致快照的业务流程。

## 复合操作

多次独立调用不会因为容器线程安全就自动成为一个原子步骤。按需选择 `putIfAbsent` 等组合 API，并检查对应方法的契约。

```java
var cache = new java.util.concurrent.ConcurrentHashMap<String, String>();
cache.putIfAbsent("language", "Java");
```

JVM 内运行的并发程序仍需明确业务层的一致性要求。

## OpenJDK 7 与 8 的实现差异

OpenJDK 7 使用 `Segment` 分段，每段包含自己的哈希表并独立协调写入。OpenJDK 8 的主要运行结构是数组、链表和树桶。写入空桶通常用 CAS，修改非空桶通常同步于当前桶头并重新确认桶未变，树桶与扩容还有专门的协调机制。不同桶的更新通常可并行，热点桶仍会竞争。相较给整个 Map 加一把锁，这种粒度可减少不相关更新互相等待。具体性能取决于数据分布和负载。

参见 [HashMap 的扩容与树化](hash-map-internals.md) 和 [CAS 与 Java 锁](concurrency-and-locks.md)。实现部分于 2026-11-07 对照 [OpenJDK 7u 源码](https://github.com/openjdk/jdk7u/blob/master/jdk/src/share/classes/java/util/concurrent/ConcurrentHashMap.java) 和 [OpenJDK 8u 源码](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/classes/java/util/concurrent/ConcurrentHashMap.java) 核查。上述细节不属于 Java API 契约。

<details>
<summary>适用范围与官方来源</summary>

适用环境：Java SE 21 API。本文依据官方文档整理，未运行代码；核查日期：2026-10-31。

[Oracle：Java SE 21 ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)。本页是入门摘要，具体方法以前述 API 为准。

</details>
