# Java 8 HashMap 的桶、扩容与树化

OpenJDK 8 的 `HashMap` 通过数组定位桶，用链表或红黑树处理碰撞。哈希经过扰动后参与索引计算，落在同一桶的键再按哈希和键相等性区分。散列分布良好时，基本查找和写入平均为 O(1)。长度为 n 的链表桶最坏需扫描 O(n) 个节点。红黑树通过旋转和变色保持平衡，在哈希可区分或键可按实现要求排序时可支持 O(log n) 桶内查找。相同哈希且无法按比较规则区分的键可能需要搜索多个分支。

## 容量和负载因子

无参构造的默认容量为 16，底层数组按需分配。默认负载因子为 0.75，容量 16 时阈值为 12。普通 `put` 添加第 13 个映射会越过该阈值，通常扩容到 32。负载按映射总数衡量，同一个桶里的多个映射也都计数。容量通常翻倍，扩容时旧桶里的节点按哈希的新增索引位分到原索引或原索引加旧容量的位置。碰撞触发的扩容可以早于总大小阈值。

## 树化与退化

| OpenJDK 8 实现常量 | 值 | 作用 |
| --- | --- | --- |
| `TREEIFY_THRESHOLD` | 8 | 链表桶达到特定长度时尝试树化 |
| `MIN_TREEIFY_CAPACITY` | 64 | 容量小于 64 时，树化请求先扩容 |
| `UNTREEIFY_THRESHOLD` | 6 | 扩容拆分树桶时，节点数不超过 6 的分组退化为链表 |

普通 `put` 路径中，一个链表桶已有 8 个节点时，追加第 9 个节点会请求树化。这个计数取决于具体插入路径。普通删除也可能触发退化，OpenJDK 8 还会依据树形判断，不能把拆分阈值当作统一的删除规则。

## 并发修改的边界

未同步的共享修改可能覆盖数据、丢失更新，或让读取看到不一致的状态。早期 JDK 7 的并发扩容在特定交错下还可能形成链表环。JDK 8 调整了扩容结构，但共享可变 `HashMap` 仍需外部同步或改用 [ConcurrentHashMap](concurrent-hash-map.md)，复合业务操作需另行保证原子性。

## 来源与适用范围

核查日期 2026-11-07。上述阈值是实现细节。未运行压测或复现旧版竞争。

- [OpenJDK 8u HashMap 源码](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/classes/java/util/HashMap.java)
- [OpenJDK 7u HashMap 源码](https://github.com/openjdk/jdk7u/blob/master/jdk/src/share/classes/java/util/HashMap.java)
