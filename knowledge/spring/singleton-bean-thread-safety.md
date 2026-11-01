# Spring 单例 Bean 与线程安全

适用环境：Spring Framework 7.0.10 参考文档、Java SE 25 并发 API；核查日期：2026-11-01。本文为概念整理，未运行 Spring 应用或并发测试。

## 单例 Bean 是线程安全的吗？

**Spring 默认的单例 Bean 不自动保证业务代码的线程安全。** `singleton` 是默认作用域，表示在一个 Spring IoC 容器中，每个 Bean 定义对应一个共享实例；并非整个 JVM 中同一个类只能有一个实例。多个线程可能同时调用这个实例。

Spring 容器会安全发布创建好的单例，使初始化状态对其他线程可见；这不等于自动同步 Bean 的业务方法。运行期间若多个线程访问共享可变状态，且缺少适当的并发控制，就可能出现竞态、可见性或一致性问题。例如，共享成员变量的 `count++` 包含读取、加一和写回，并非原子操作，并发调用可能丢失更新。

## 如何设计和处理

- 优先采用无状态设计：用方法参数、局部变量保存每次请求的数据，避免把当前用户、请求结果等放入共享成员字段。局部引用指向的对象如果仍被其他线程共享，也需要检查并发访问；依赖对象同样需要满足线程安全要求。
- 确实需要共享可变状态时，根据业务的一致性要求选择 `synchronized` 或 `Lock`，让相关访问遵循同一套锁保护规则。使用显式锁时，应在 `finally` 中释放锁。
- 单变量原子更新可使用 `AtomicInteger` 等原子类；多个变量之间的约束或多个独立调用组成的业务步骤，不会因此自动成为一个原子操作。

不能仅凭“单例”判断安全或不安全；应检查实际共享的数据、修改方式以及并发控制。

## 相关知识

[ConcurrentHashMap 的基本使用边界](../java/concurrent-hash-map.md)：线程安全容器与复合操作的区别。

## 来源

- 输入编号：KH-20261101-01；类型：用户问答笔记；公开范围：可公开的通用编程知识。原始要点：默认单例不保证线程安全，共享可变成员可能引发问题，优先无状态与局部变量，必要时使用锁或原子类。未提供原始外链，已按下列官方资料核查。
- [Spring Framework：Bean Scopes](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton)：默认作用域及每容器、每 Bean 定义的共享实例边界。
- [Spring Framework：Thread Safety and Visibility](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-thread-safety)：容器安全发布与运行期可变状态的区别。
- [Oracle Java SE 25：Lock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/Lock.html)、[原子类包说明](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/package-summary.html)：锁的访问规则及单变量原子操作。

上述 Spring 链接会随官方当前版本更新，本文记录的是核查时版本。
