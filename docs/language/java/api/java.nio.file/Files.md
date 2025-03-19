# [Files](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/file/Files.html)

```java
public final class Files extends Object
```

这个类专门由静态方法组成，这些方法用于操作文件、目录或其他类型的文件。
在大多数情况下，这里定义的方法会委托给相关的文件系统提供者来执行文件操作。

## 方法

### copy

```java
public static long copy(InputStream in, Path target, CopyOption... options) throws IOException
```

将所有字节从输入流复制到文件。
返回时，输入流将处于流的末尾。
默认情况下，如果目标文件已经存在或是符号链接，则复制操作会失败。如果指定了 `REPLACE_EXISTING` 选项且目标文件已经存在，则会替换该文件（如果它不是非空目录）。如果目标文件存在并且是符号链接，则会替换该符号链接。在此版本中，`REPLACE_EXISTING` 选项是此方法要求支持的唯一选项。未来版本可能会支持更多选项。

如果在从输入流读取或向文件写入时发生 I/O 错误，可能会在目标文件已经创建且部分字节已被读取或写入后发生此错误。因此，输入流可能没有到达流的末尾，且可能处于不一致的状态。强烈建议在发生 I/O 错误时尽快关闭输入流。

此方法可能会在读取输入流（或写入文件）时无限期阻塞。如果在复制过程中输入流被异步关闭或线程被中断，行为高度依赖于输入流和文件系统提供者的具体实现，因此未指定。

**使用示例**：假设我们想捕获一个网页并将其保存到文件中：

```java
Path path = ...
URI u = URI.create("http://www.example.com/");
try (InputStream in = u.toURL().openStream()) {
    Files.copy(in, path);
}
```

**参数**

- **`in`** —— 要读取的输入流。
- **`target`** —— 文件的路径。
- **`options`** —— 指定复制操作的选项。

**返回值**

返回读取或写入的字节数。

**抛出异常**

- **`IOException`** —— 如果在读取或写入时发生 I/O 错误。
- **`FileAlreadyExistsException`** —— 如果目标文件已存在且未指定 `REPLACE_EXISTING` 选项，导致文件无法替换。
- **`DirectoryNotEmptyException`** —— 如果指定了 `REPLACE_EXISTING` 选项，但目标文件是非空目录，导致文件无法替换。
- **`UnsupportedOperationException`** —— 如果 `options` 包含不受支持的复制选项。
- **`SecurityException`** —— 如果安装了安全管理器，在默认提供者的情况下，会调用 `checkWrite` 方法检查是否具有写入文件的权限。如果指定了 `REPLACE_EXISTING` 选项，还会调用安全管理器的 `checkDelete` 方法检查是否可以删除已存在的文件。