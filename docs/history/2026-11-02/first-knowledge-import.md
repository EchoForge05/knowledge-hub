# 首次真实文件导入记录

## 输入与覆盖

2026-11-02用户输入“导入知识”。输入编号 FI-001，类型为用户问答笔记，未注明原始来源和版本；检查未发现凭据、个人身份信息或内部业务数据，按公开通用技术资料整理。完整读取 UTF-8 原文，共22组问答，无执行输入代码。原文留在本地忽略目录，不复制到项目日志。起始分支 feat/file-intake，工作区干净。

| 输入问答（从1计数） | 处理 |
| --- | --- |
| 1 Spring 单例 | 既有 singleton-bean-thread-safety 全文已覆盖，不改正文 |
| 2、3 | 新建 [Java 类初始化、对象构造与方法重载](../../../knowledge/java/initialization-and-overloading.md) |
| 4 | 新建 [进程、线程与 Java 并发](../../../knowledge/java/processes-and-threads.md) |
| 5、6、7 | 新建 [InnoDB 的 redo、undo 与 MVCC](../../../knowledge/databases/innodb-logs-and-mvcc.md) |
| 8、9、10、11、12、13、21、22 | 新建 [MySQL 深分页与联合索引优化](../../../knowledge/databases/mysql-pagination-and-indexes.md) |
| 14、15、16、17、18、19、20 | 新建 [MySQL InnoDB 与 Oracle：索引、事务和分页](../../../knowledge/databases/mysql-oracle-comparison.md) |

全库关键词检索后，阅读已有 Spring 单例和 SQL 查询文章；新主题没有重复正文。新增5篇，文章总数从7增至12，同步知识目录、侧栏及README。原问答的解释、例子、条件和风险均保留；补充 Java 25 构造器前置语句条件、redo恢复未提交事务的边界、组合NULL唯一性差异及分页唯一排序要求。Java/Oracle/MySQL官方资料核查链接保存在各正文，日期2026-11-02。未编译Java或连接数据库，不声称实测性能。

## 验证与限制

- 文档检查80份Markdown/455处本地链接通过；VitePress构建通过，17 HTML/545处本地引用通过（同步本记录前）。
- [浏览器证据](../../project/evidence/file-import-first-browser.json)：隔离无头Chrome，5篇目录点击与正文、11组中文/英文/代码词搜索前5结果及锚点跳转、5篇390×844无页面横向溢出，共21项通过，无页面脚本错误。包含旧Spring/SQL回归。
- 浏览器脚本初次断言受标题锚点字符和SPA渲染时序影响而失败，改为等待标题/锚点出现后通过；未修改产品以迎合检查。系统npm入口报EEXIST，改用已记录的本地Node24/npm11路径通过。
- 原文保留；全部检查通过并重算输入哈希后原子写本地回执，再扫描确认complete。回执不入Git。
- V07技术验证已完成，用户阅读验收仍待确认；不把用户验收记为完成。未提交、推送、合并或部署；本次为日常知识维护，没有新增功能开发，不套用D023自动提交。

下一步：用户阅读新增文章并反馈；远程交付按后续明确授权。
