# [FileSystemUtils](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/util/FileSystemUtils.html)

```java
public abstract class FileSystemUtils extends Object
```

用于处理文件系统的实用方法。

## 方法

### deleteRecursively

```java
public static boolean deleteRecursively(@Nullable File root)
```

删除提供的文件 — 对于目录，递归删除其中的所有嵌套目录或文件。

**注意**：与 `File.delete()` 类似，此方法不会抛出异常，而是在遇到 I/O 错误时静默返回 `false`。建议使用 `deleteRecursively(Path)` 来采用 NIO 风格处理 I/O 错误，更清楚地区分“文件不存在”和“删除现有文件失败”这两种情况。

**参数**：

- **root**：要删除的根文件或目录。

**返回值**：

如果文件成功删除，返回 `true`；否则返回 `false`。