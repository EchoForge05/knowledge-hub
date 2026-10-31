# 阅读与搜索测试页

> 本页是人工构造的功能测试材料，不是用户笔记，不作为技术结论或真实知识样本。代码仅用于展示，未执行。

## 搜索样本

中文短语：事务隔离级别。英文缩写：JVM。类名：ConcurrentHashMap。

下列 SQL 标识符仅出现在代码块，用于核对代码正文是否进入搜索索引。

```sql
SELECT fixture_search_marker FROM reading_fixture WHERE category = '演示';
```

## 代码与宽表格

```java
String readingFixture = "这是一行用于横向滚动验证的长代码，reading-fixture-long-line-0123456789-abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789-abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
```

| 检查项 | 中文列 | 英文标识符 | 很长的示例字段 | 预期 |
| --- | --- | --- | --- | --- |
| 阅读测试 | 仅展示用途 | reading_fixture_column | fixture_abcdefghijklmnopqrstuvwxyz_0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz_0123456789 | 在手机视口内局部横向滚动 |

## 图片与内部链接

![目录、阅读和搜索之间的示意关系](../assets/images/reading-flow.svg)

返回[知识目录](../topics.md)，或查看[使用指南](../guide.md#浏览与搜索)。

### 检查结果说明

本页只用于技术验证。真实内容下的搜索相关性，需要首批知识笔记到位后重新验收。
