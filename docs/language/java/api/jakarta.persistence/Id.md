# [Id](https://jakarta.ee/specifications/platform/10/apidocs/jakarta/persistence/id)

```java
@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface Id
```

此注解用于指定实体的主键。应用了 `Id` 注解的字段或属性应属于以下类型之一：任意 Java 基本数据类型；任意基本数据类型的包装类；`String` 类型；`java.util.Date` 类型；`java.sql.Date` 类型；`java.math.BigDecimal` 类型；`java.math.BigInteger` 类型。

该实体主键所映射的列被视为主表的主键。若未指定 `Column` 注解，那么主键列的名称将被假定为主键属性或字段的名称。

示例：

```java
@Id
public Long getId() { return id; }
```

