# [GenerationType](https://jakarta.ee/specifications/platform/10/apidocs/jakarta/persistence/generationtype)

```java
public enum GenerationType
extends Enum<GenerationType>
```

定义了主键生成策略的类型。

## 枚举常量摘要

| 枚举常量   | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| `AUTO`     | 表示持久化提供程序应为特定的数据库选择合适的（主键生成）策略。 |
| `IDENTITY` | 表示持久化提供程序必须使用数据库的自增列（标识列）为实体分配主键。 |
| `SEQUENCE` | 表示持久化提供程序必须使用数据库序列为实体分配主键。         |
| `TABLE`    | 表示持久化提供程序必须使用底层数据库表为实体分配主键，以确保主键的唯一性。 |
| `UUID`     | 表示持久化提供程序必须通过生成符合 RFC 4122 标准的通用唯一标识符（UUID）来为实体分配主键。 |