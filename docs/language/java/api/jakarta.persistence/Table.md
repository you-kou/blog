# Table

```java
@Target(TYPE)
@Retention(RUNTIME)
public @interface Table
```

指定带注解实体的主表。可以使用 `@SecondaryTable` 或 `@SecondaryTables` 注解指定附加表。
如果实体类未指定 `@Table` 注解，则使用默认值。

示例：

```java
@Entity
@Table(name="CUST", schema="RECORDS")
public class Customer { ... }
```

## 元素详细信息

### name

```java
String name
```

（可选）表的名称。
 默认值为实体名称。

**默认值**：""

### catalog

```java
String catalog
```

（可选）表所属的目录。
 默认值为默认目录。

**默认值**：""

### schema

```java
String schema
```

（可选）表所属的模式（schema）。
 默认值为用户的默认模式。

**默认值**：""

### uniqueConstraints

```java
UniqueConstraint[] uniqueConstraints
```

（可选）要在表上设置的唯一约束。仅在启用表生成时使用。
 这些约束是对 `@Column` 和 `@JoinColumn` 注解所指定的约束以及主键映射所隐含的约束的补充。
 默认值为不添加任何额外约束。

**默认值**：{}

### indexes

```java
Index[] indexes
```

（可选）表的索引。仅在启用表生成时使用。 注意，无需为主键指定索引，因为主键索引会自动创建。

**默认值**：{}