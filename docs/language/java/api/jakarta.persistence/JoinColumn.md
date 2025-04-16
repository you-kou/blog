# [JoinColumn](https://jakarta.ee/specifications/platform/10/apidocs/jakarta/persistence/joincolumn)

```java
@Repeatable(JoinColumns.class)
@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface JoinColumn
```

指定用于连接实体关联或元素集合的列。如果 `JoinColumn` 注解本身使用默认值，则假定为单个连接列，并应用默认值。

示例：

```java
@ManyToOne
@JoinColumn(name="ADDR_ID")
public Address getAddress() { return address; }


Example: unidirectional one-to-many association using a foreign key mapping

// In Customer class
@OneToMany
@JoinColumn(name="CUST_ID") // join column is in table for Order
public Set<Order> getOrders() {return orders;}
```

## 元素详细信息

### name

```java
String name
```

（可选）外键列的名称。该列所在的表取决于上下文。

- 如果连接用于 `OneToOne` 或 `ManyToOne` 映射，且使用外键映射策略，则外键列位于源实体或可嵌入类的表中。
- 如果连接用于单向的 `OneToMany` 映射，且使用外键映射策略，则外键位于目标实体的表中。
- 如果连接用于 `ManyToMany` 映射，或用于 `OneToOne` 或双向的 `ManyToOne/OneToMany` 映射，且使用连接表，则外键位于连接表中。
- 如果连接用于元素集合（element collection），则外键位于集合表中。

默认值（仅在使用单个连接列时适用）：连接列名由以下部分拼接而成：引用方实体或可嵌入类中所引用关系的属性或字段名；下划线 `_`；被引用主键列的名称。如果实体中没有对应的引用关系属性或字段，或者连接用于元素集合，则连接列名由以下部分拼接而成：实体名；下划线 `_`；被引用主键列的名称。

**默认值**：""

