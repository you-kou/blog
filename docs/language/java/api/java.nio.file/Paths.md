# [Paths](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/file/Paths.html)

```java
public final class Paths extends Object
```

这个类专门由静态方法组成，通过转换路径字符串或 URI 返回一个 Path。

> [!NOTE]
>
> 推荐使用 Path.of 方法来获取路径，而不是使用本类中定义的 get 方法，因为本类可能会在未来的版本中被废弃。

## 方法

### get

```java
public static Path get(String first, String... more)
```

**功能**：
将路径字符串，或一系列字符串（连接后形成路径字符串）转换为 `Path`。

**实现要求**：
此方法仅简单地调用 `Path.of(String, String...)`，并传入相同的参数。

**参数**：

- **`first`** —— 路径字符串，或路径字符串的起始部分。
- **`more`** —— 额外的字符串，会与 `first` 拼接形成完整路径字符串。

**返回值**：
返回生成的 `Path` 对象。

**抛出异常**：

- **`InvalidPathException`** —— 如果路径字符串无法转换为 `Path`，抛出此异常。