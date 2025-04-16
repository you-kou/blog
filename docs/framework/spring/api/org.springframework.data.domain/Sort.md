# Sort

```java
public class Sort
extends Object
implements Streamable<Sort.Order>, Serializable
```

查询的排序选项。您必须至少提供一个属性列表用于排序，且列表中不能包含 null 或空字符串。方向默认为 DEFAULT_DIRECTION。

## 方法

### ascending

```java
public Sort ascending()
```

返回一个新的 Sort，保持当前设置，但排序方向为升序。
**返回：**

一个新的 Sort，排序方向为升序，其他设置保持不变。

### by

```java
public static Sort by(String... properties)
```

为给定的属性创建一个新的 Sort。
 **参数：**

- `properties` - 不能为空。

**返回：**

为给定属性创建的 Sort。

### descending

```java
public Sort descending()
```

返回一个新的 Sort，保持当前设置，但排序方向为降序。
**返回：**

一个新的 Sort，排序方向为降序，其他设置保持不变。