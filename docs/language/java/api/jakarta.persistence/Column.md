# [Column](https://jakarta.ee/specifications/platform/10/apidocs/jakarta/persistence/column)

```java
@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface Column
```

指定持久属性或字段所映射的列。如果未指定 `@Column` 注解，则应用默认值。

示例 1：

```java
@Column(name="DESC", nullable=false, length=512)
public String getDescription() { return description; }
```

示例 2：

```java
@Column(name="DESC",
        columnDefinition="CLOB NOT NULL",
        table="EMP_DETAIL")
@Lob
public String getDescription() { return description; }
```

示例 3：

```java
@Column(name="ORDER_COST", updatable=false, precision=12, scale=2)
public BigDecimal getCost() { return cost; }
```

## 元素详细信息

### name

```java
String name
```

（可选）列的名称。默认为属性或字段的名称。

**默认值**：""

### unique

```java
boolean unique
```

（可选）指定该列是否为唯一键。这是在表级别使用 `UniqueConstraint` 注解的快捷方式，当唯一键约束仅涉及单个列时非常有用。此约束是对主键映射和表级别指定的约束的补充。 

**默认值**：`false`

### nullable

```java
boolean nullable
```

（可选）指定数据库列是否允许为 `NULL`。默认值为 `true`，表示列可以包含 `NULL` 值。

**默认值**：`true`

### insertable

```java
boolean insertable
```

（可选）指定该列是否包含在持久化提供商生成的 SQL INSERT 语句中。默认值为 `true`，表示该列将包含在 INSERT 语句中。

**默认值**：`true`

### updatable

```java
boolean updatable
```

（可选）指定该列是否包含在持久化提供商生成的 SQL UPDATE 语句中。默认值为 `true`，表示该列将包含在 UPDATE 语句中。

**默认值**：`true`

### columnDefinition

```java
String columnDefinition
```

（可选）用于生成列的 DDL 时的 SQL 片段。默认为生成用于创建推断类型的列的 SQL。

**默认值**：""

### table

```java
String table
```

（可选）包含该列的表的名称。如果未指定，则假定该列位于主表中。

**默认值**：""

### length

```java
int length
```

（可选）指定列的长度。仅适用于字符串类型的列。

**默认值**：255

### precision

```java
int precision
```

（可选）用于十进制（精确数值）列的精度。仅在使用十进制列时适用。开发者在生成列的 DDL 时必须设置此值。

**默认值**：0

### scale

```java
int scale
```

（可选）用于十进制（精确数值）列的小数位数。仅在使用十进制列时适用。开发者在生成列的 DDL 时必须设置此值。

**默认值**：0