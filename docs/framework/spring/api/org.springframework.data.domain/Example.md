# Example

```java
public interface Example<T>
```

支持通过示例查询（QBE）。示例（Example）通过提供一个探针（probe）来定义查询的示例。可以使用 `ExampleMatcher` 来调整匹配选项和类型安全性。

## 方法

### of

```java
static <T> Example<T> of(T probe, ExampleMatcher matcher)
```

参数：

- `probe` - 不能为空。
- `matcher` - 不能为空。
