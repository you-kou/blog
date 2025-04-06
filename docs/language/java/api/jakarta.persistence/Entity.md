# Entity

```java
@Documented
@Target(TYPE)
@Retention(RUNTIME)
public @interface Entity
```

指定该类是一个实体。此注解应用于实体类。

## 元素详细信息

### name

```java
String name
```

（可选）实体名称。默认值为实体类的不带包名的类名。该名称用于在查询中引用该实体。名称不得是 Jakarta Persistence 查询语言中的保留字。

**默认值**：""