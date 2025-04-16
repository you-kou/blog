# [ExampleMatcher](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/ExampleMatcher.html)

```java
public interface ExampleMatcher
```

用于属性路径匹配的规范，可在示例查询（QBE）中使用。`ExampleMatcher` 可以为某个对象类型创建。`ExampleMatcher` 实例可以是 `matchingAll()` 或 `matchingAny()`，并且可以通过一系列 `with...` 方法以流式风格调整设置。 `with...` 方法会返回一个带有指定设置的 `ExampleMatcher` 副本。 空值处理默认使用 `ExampleMatcher.NullHandler.IGNORE`，字符串匹配默认使用大小写敏感的 `ExampleMatcher.StringMatcher.DEFAULT`。

此类是不可变的。

## 方法

### matching

```java
static ExampleMatcher matching()
```

创建一个新的 ExampleMatcher，默认包含所有非空属性，并匹配由示例派生出的所有谓词。
**返回值：**

一个新的 ExampleMatcher 实例。

### withMatcher

```java
ExampleMatcher withMatcher(String propertyPath, ExampleMatcher.GenericPropertyMatcher genericPropertyMatcher)
```

返回一个为指定 `propertyPath` 设置了 `GenericPropertyMatcher` 的 `ExampleMatcher` 副本。此实例是不可变的，调用该方法不会影响当前实例。

参数：

- `propertyPath` - 不能为空。
- `genericPropertyMatcher` - 用于配置 `ExampleMatcher.GenericPropertyMatcher` 的回调函数，不能为空。

**返回：**

新的 `ExampleMatcher` 实例。

### withIgnoreNullValues

```java
default ExampleMatcher withIgnoreNullValues()
```

返回一个设置了对空值处理方式为 `ExampleMatcher.NullHandler.IGNORE` 的 `ExampleMatcher` 副本。此实例是不可变的，调用该方法不会影响当前实例。
**返回：**

新的 `ExampleMatcher` 实例。