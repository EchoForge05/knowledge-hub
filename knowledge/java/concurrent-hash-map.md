# ConcurrentHashMap 的基本使用边界

## 先懂基础概念

`ConcurrentHashMap<K, V>` 是 Java 的并发哈希表，实现了 `ConcurrentMap`。多个线程可以共享同一个实例，用 `get` 查值、用 `put` 写入、用 `remove` 删除。比如统计接口调用次数，可以把接口名当作键，把次数当作值。

- **哈希桶（bin）**是哈希表中的一个位置。Map 根据键的哈希值定位桶，再用 `equals` 区分候选键。不同的键可能落到同一个桶，这叫哈希冲突。
- **原子性**说的是一个操作的边界。假设某个键还不存在，两个线程同时对它执行 `putIfAbsent`，如果期间没有其他更新，就只有一个能插入。但如果自己拆成“先检查、再写入”，别的线程可以在两步之间插进来。
- **可见性**说的是一个线程的更新什么时候能被另一个线程看到。对某个键的更新，与随后读到该更新值的非空读取之间存在 *happens-before* 关系。举例来说，线程先把对象初始化好再放进 Map，另一个线程通过 Map 读到这个对象时，能看到放入前的初始化结果。

下文的用法以 Java SE 21 API 为准。源码题单独标注 OpenJDK 版本。

## 高频面试问答

### 1. 它跟 HashMap、synchronizedMap 有什么区别？

`HashMap` 支持 `null` 键和值，多线程共享且有写入时需要调用方做同步。用 `Collections.synchronizedMap` 包起来之后，单次操作通常通过同一把互斥锁串行执行，遍历时还要按文档要求在包装后的 Map 上同步。

`ConcurrentHashMap` 的读取一般不阻塞，可以和更新同时进行。不同桶的写入通常可以并行，写入集中在同一个键或同一个桶时，竞争仍然存在。它也没有一个能阻止所有线程访问的整表锁。面试里可以接着说明，实际吞吐取决于读写比例、键的分布和竞争程度。

### 2. 为什么键和值都不能是 null？

这让 `get(key)` 返回 `null` 的含义很明确：这次读取没有拿到映射。如果允许存入 `null` 值，调用方就很难靠接着调用一次 `containsKey` 消除歧义，因为两次调用之间可能已经发生插入或删除。键也按 API 约定禁止传入 `null`。

### 3. 先 get 再 put 做计数，为什么会丢更新？

假设计数当前是 5，两个线程都读到 5，然后各自把 6 写回去。最终得到 6，少算了一次。可以用 `merge` 把读取旧值、计算和写回放在同一次原子操作里。键不存在时直接写入 1，存在时用旧值加 1。

```java
import java.util.concurrent.ConcurrentHashMap;

class RequestCounts {
    private final ConcurrentHashMap<String, Long> counts = new ConcurrentHashMap<>();

    long record(String endpoint) {
        return counts.merge(endpoint, 1L, Long::sum);
    }
}
```

按需选方法。手头已经有值，缺失才放入，用 `putIfAbsent`。缺失时才需要创建值，用 `computeIfAbsent`。需要根据键和旧值决定下一步，用 `compute`。想在旧值符合预期时才替换，可以用 `replace(key, oldValue, newValue)`。这些方法各自处理一个键。像账户转账这样要同时更新两个键并维护总额的场景，需要业务层提供覆盖两个操作的同步或事务。

### 4. computeIfAbsent 能保证初始化逻辑永远只执行一次吗？

它把同一个键的缺失检查、计算和插入放进一次原子调用。只要已有映射，后续调用就直接返回已有值。但回调返回 `null` 或抛出异常时，映射没有建立。映射后来被删除，下一次调用也可能重新计算。

回调运行期间可能挡住其他更新，所以适合做短小的本地计算，例如创建计数器。不要在回调里修改同一个 Map，也尽量别在里面做慢速网络请求。

### 5. 把 ArrayList 放进 Map，多个线程就能安全地 add 吗？

不能。Map 能安全地保存和取出 `ArrayList` 的引用，多个线程同时调用同一个列表的 `add`，仍然需要列表自己的并发保护。比如 `map.computeIfAbsent(key, k -> new ArrayList<>()).add(item)`，原子调用在返回列表时就结束了，后面的 `add` 在调用之外。

要按值的操作方式选择做法，例如使用并发容器，或在 `compute` 中生成新的不可变列表来替换旧值。

### 6. 遍历时别人修改 Map，会抛异常吗？size 能当准数吗？

迭代器是**弱一致的**。其他线程修改 Map 时，遍历可以继续，不会因此抛出 `ConcurrentModificationException`。一次遍历可能看到部分更新，不能当作某一时刻的全量快照。迭代器本身应由一个线程使用。

`size()`、`isEmpty()` 等在并发更新时反映的是瞬时状态，可以拿来做监控。比如“低于 100 个元素才插入”这类业务约束，不能靠 `size()` 后接 `put()` 实现，因为多个线程可能同时通过检查。并发读取也可能只看到 `putAll()` 或 `clear()` 的部分效果。

### 7. OpenJDK 7 和 8 是怎么实现线程安全的？

- **OpenJDK 7u** 使用 `Segment` 分段。每段维护自己的哈希表，写入时使用该段的 `ReentrantLock`，不同段的写入可以并行。普通读取不需要获取段锁。
- **OpenJDK 8u** 的主要结构是数组加链表或红黑树。以 `put` 为例，空桶用 CAS（比较并交换）尝试放入首节点。更新普通非空桶时，用 `synchronized` 锁住当前桶头，拿到锁后还要确认桶头没有变。同一个桶里的不同键也可能互相等待。树桶和扩容有各自的协调机制。

`concurrencyLevel` 在 7u 用于指导分段数量，在 8u 是构造时的容量估算提示。上面讲的是特定版本的源码实现。

### 8. 冲突多了怎么处理？扩容时 get 怎么找数据？

在 OpenJDK 8u，链表桶的节点较多时会尝试树化。源码中的 `TREEIFY_THRESHOLD` 是 8，还要看触发该检查的操作和当前表容量。容量小于 64 时，这条路径优先尝试扩容。扩容有机会把原本挤在一个桶里的键分散开。

扩容时，多个更新线程可以协助迁移不同区间的桶。旧桶迁移完后会放一个转发节点（`ForwardingNode`）。`get` 如果遇到它，就去新表继续查找。这也是“扩容中仍能读”的关键细节。

## 相关知识

- [HashMap 的扩容与树化](hash-map-internals.md)
- [Java 并发计数、可重入锁与死锁](concurrency-and-locks.md)

## 官方来源

API 与源码核查于 2026-11-09。

- [Oracle Java SE 21 ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [Oracle Java SE 21 Collections.synchronizedMap API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#synchronizedMap(java.util.Map))
- [OpenJDK 7u ConcurrentHashMap 源码](https://raw.githubusercontent.com/openjdk/jdk7u/master/jdk/src/share/classes/java/util/concurrent/ConcurrentHashMap.java)
- [OpenJDK 8u ConcurrentHashMap 源码](https://raw.githubusercontent.com/openjdk/jdk8u/master/jdk/src/share/classes/java/util/concurrent/ConcurrentHashMap.java)
