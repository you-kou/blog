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

### createDirectories

```java
public static Path createDirectories(Path dir, FileAttribute<?>... attrs) throws IOException
```

通过首先创建所有不存在的父目录来创建一个目录。与 createDirectory 方法不同，如果目录无法创建因为它已经存在，则不会抛出异常。
attrs 参数是可选的文件属性，在创建不存在的目录时原子性地设置。每个文件属性通过其名称进行标识。如果数组中包含多个相同名称的属性，则忽略除最后一个出现的属性之外的所有属性。

如果此方法失败，可能会在创建了一些父目录，但没有创建所有父目录后失败。

**参数**

- **`dir`**：要创建的目录。

- **`attrs`**：可选的文件属性列表，在创建目录时原子性地设置。

**返回值**：

创建的目录。

**抛出异常**：

- **`UnsupportedOperationException`**：如果属性数组包含无法在创建目录时原子性设置的属性。
- **`FileAlreadyExistsException`**：如果目录 dir 已存在但不是一个目录（可选的具体异常）。
- **`IOException`**：如果发生 I/O 错误。
- **`SecurityException`**：在默认提供程序情况下，如果安装了安全管理器，会在尝试创建目录前调用 `checkWrite` 方法，并在检查每个父目录时调用 `checkRead` 方法。如果 `dir` 不是绝对路径，则可能需要调用其 `toAbsolutePath` 方法获取绝对路径，这可能触发安全管理器的 `checkPropertyAccess` 方法来检查对系统属性 `user.dir` 的访问权限。

### walk

```java
public static Stream<Path> walk(Path start, int maxDepth, FileVisitOption... options) throws IOException
```

返回一个 `Stream`，按需遍历以给定起始文件为根的文件树。文件树以深度优先方式遍历，流中的元素是 `Path` 对象，就像通过起始路径解析相对路径一样获得。

流在消费元素时遍历文件树。返回的流保证至少包含一个元素，即起始文件本身。对于访问的每个文件，流会尝试读取其 `BasicFileAttributes`。如果文件是目录且可以成功打开，目录中的条目及其后代将在流中紧随其后。当所有条目都被访问后，目录将关闭，文件树遍历继续到目录的下一个同级目录。

该流是弱一致性的。在迭代过程中不会冻结文件树，因此它可能（也可能不会）反映调用此方法后对文件树的更新。

默认情况下，此方法不会自动跟随符号链接。如果 `options` 参数包含 `FOLLOW_LINKS` 选项，则跟随符号链接。在跟随链接时，如果无法读取目标的属性，则此方法尝试获取符号链接本身的 `BasicFileAttributes`。

如果 `options` 参数包含 `FOLLOW_LINKS` 选项，则流会跟踪访问过的目录，以便检测循环。当目录中有一个条目是该目录的祖先时，就会出现循环。循环检测通过记录目录的文件键（file-key）完成，或者在没有文件键的情况下，调用 `isSameFile` 方法来测试目录是否与某个祖先相同。如果检测到循环，则将其作为 `FileSystemLoopException` 的实例处理为 I/O 错误。

`maxDepth` 参数是要访问的最大目录层级。值为 `0` 表示仅访问起始文件（除非安全管理器拒绝）。值为 `MAX_VALUE` 可用于表示访问所有层级。

当安装了安全管理器并且它拒绝访问某个文件（或目录）时，该文件将被忽略，不包含在流中。

返回的流包含对一个或多个打开目录的引用。通过关闭流来关闭目录。

如果在此方法返回后访问目录时抛出 `IOException`，它将被封装在 `UncheckedIOException` 中，并在导致访问的方法中抛出。

**API 注释：**
 此方法必须在 `try-with-resources` 语句或类似控制结构中使用，以确保在流操作完成后及时关闭流的打开目录。

**参数：**

- `start` - 起始文件
- `maxDepth` - 要访问的最大目录层级
- `options` - 配置遍历的选项

**返回：**

`Stream<Path>`

**抛出：**

- `IllegalArgumentException` - 如果 `maxDepth` 参数为负数
- `SecurityException` - 如果安全管理器拒绝访问起始文件。对于默认提供者，会调用 `checkRead` 方法检查目录的读取权限
- `IOException` - 如果在访问起始文件时抛出 I/O 错误