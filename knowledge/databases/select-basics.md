# SQL 查询：选择、过滤与排序

适用环境：PostgreSQL 18 教程；核查日期：2026-10-31。以下查询基于假设已有的示例表，未连接数据库执行。

## 选择列和过滤行

使用 `SELECT` 指定返回列，`FROM` 指定表，`WHERE` 过滤行。以下表名和字段是本文自拟的教学示例。

```sql
SELECT article_title, topic FROM knowledge_notes WHERE topic = '数据库';
```

## 排序与去重

`ORDER BY` 指定结果顺序；仅使用 `DISTINCT` 去重不保证排序。需要稳定顺序时，应显式写出排序条件。

```sql
SELECT DISTINCT topic FROM knowledge_notes ORDER BY topic;
```

显式列名比 `*` 更容易看清查询依赖哪些字段；表增加列时也不会因此增加返回列。

本文只介绍查询结构，不涵盖事务隔离级别；不要从查询语法推断事务行为。

## 相关知识与来源

对照[Git 差异检查](../git/diff-basics.md)，可在维护 SQL 笔记时查看修改。

[PostgreSQL 18：Querying a Table](https://www.postgresql.org/docs/18/tutorial-select.html)。
