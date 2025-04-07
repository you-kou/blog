# GeneratedValue

```java
@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface GeneratedValue
```

该注解用于指定主键值的生成策略。

`GeneratedValue` 注解可与 `Id` 注解一起应用于实体或映射超类的主键属性或字段上。`GeneratedValue` 注解仅要求在简单主键上得到支持，派生主键不支持使用 `GeneratedValue` 注解。

**示例 1：**

```java
@Id
@GeneratedValue(strategy=SEQUENCE, generator="CUST_SEQ")
@Column(name="CUST_ID")
public Long getId() { return id; }
```

**示例 2：**

```java
@Id
@GeneratedValue(strategy=TABLE, generator="CUST_GEN")
@Column(name="CUST_ID")
Long id;
```

## 元素详情

### `strategy`

```java
GenerationType strategy
```

（可选）这是持久化提供程序在生成带注解实体的主键时必须采用的主键生成策略。

**默认值**：`jakarta.persistence.GenerationType.AUTO`

### `generator`

```java
String generator
```

（可选）此为在 `SequenceGenerator` 或 `TableGenerator` 注解中指定的主键生成器的名称。

默认使用持久化提供程序提供的 ID 生成器。

**默认值**：""