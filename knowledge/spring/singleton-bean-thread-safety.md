# Spring 单例 Bean 与线程安全

## 单例 Bean 是线程安全的吗？

**不自动保证。** `singleton` 是默认作用域：在一个 Spring 容器中，每个 Bean 定义对应一个共享实例，多个线程可能同时调用它。

关键在于是否有**共享可变状态**。例如，成员变量的 `count++` 包含读取、加一、写回，并非原子操作，并发执行可能丢失更新。

## 如何设计和处理

- **优先无状态设计**：请求数据放在方法参数或局部变量中，避免存入共享成员字段；仍要检查局部引用和依赖对象是否共享可变数据。
- **需要共享状态时加锁**：相关访问使用同一套 `synchronized` 或 `Lock` 保护规则，显式锁在 `finally` 中释放。
- **单变量更新可用原子类**：如 `AtomicInteger`；多个变量的约束或多个调用组成的业务步骤仍需整体同步。

延伸阅读：[ConcurrentHashMap 的基本使用边界](../java/concurrent-hash-map.md)。

<details>
<summary>补充边界与官方来源</summary>

Spring 单例的范围是每容器、每 Bean 定义，并非整个 JVM 中一个类只能有一个实例。容器安全发布单例，使初始化状态对其他线程可见，并不等于自动同步业务方法；运行期共享可变状态仍需并发控制。

核查版本：Spring Framework 7.0.10、Java SE 25；日期：2026-11-01。本文为概念整理，未运行 Spring 应用或并发测试。

- [Spring Framework：Bean Scopes](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton)：默认作用域及每容器、每 Bean 定义的共享实例边界。
- [Spring Framework：Thread Safety and Visibility](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-thread-safety)：容器安全发布与运行期可变状态的区别。
- [Oracle Java SE 25：Lock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/Lock.html)、[原子类包说明](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/package-summary.html)：锁的访问规则及单变量原子操作。

上述 Spring 链接会随官方当前版本更新，本文记录的是核查时版本。

</details>
