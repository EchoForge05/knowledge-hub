# ConcurrentHashMap 的基本使用边界

适用环境：Java SE 21 API。本文依据官方文档整理，未运行代码；核查日期：2026-10-31。

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

## 来源

[Oracle：Java SE 21 ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)。本页是入门摘要，具体方法以前述 API 为准。
