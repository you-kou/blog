# MultipartFile

```java
Interface MultipartFile
```

上传文件的表示形式，通常在 multipart 请求中接收。
文件内容可以存储在内存中，也可以暂时存储在磁盘上。无论是哪种情况，用户都需要负责将文件内容复制到会话级别或持久化存储中（如果需要）。临时存储将在请求处理结束时清除。

## 方法

### getOriginalFilename

```java
@Nullable
String getOriginalFilename()
```

返回客户端文件系统中的原始文件名。
根据使用的浏览器，文件名可能包含路径信息，但除了 Opera 外，通常不会包含路径信息。

**注意**：请记住，这个文件名是由客户端提供的，不应盲目使用。除了不使用目录部分外，文件名还可能包含诸如 `..` 等字符，这些字符可能被恶意利用。建议不要直接使用该文件名。最好生成一个唯一的文件名，并在必要时将原始文件名存储在某个地方以供参考。

**返回值**：

- 返回原始文件名；
- 如果在 multipart 表单中没有选择文件，则返回空字符串；
- 如果未定义或不可用，则返回 `null`。

### transferTo

```java
void transferTo(File dest) throws IOException, IllegalStateException
```

将接收到的文件传输到指定的目标文件。
这可以是将文件在文件系统中移动、复制，或将内存中的内容保存到目标文件。如果目标文件已存在，它将首先被删除。

如果目标文件已经在文件系统中移动，则此操作之后无法再次调用。因此，应只调用一次此方法来处理任何存储机制。

**注意**：根据底层提供者，临时存储可能依赖于容器，包括此处指定的相对目标路径的基础目录（例如，使用 Servlet 进行 multipart 处理）。对于绝对目标，目标文件可能会从临时位置被重命名/移动或重新复制，即使临时副本已经存在。

**参数**：

- `dest` - 目标文件（通常是绝对路径）

**抛出异常**：

- `IOException` - 读取或写入错误时抛出
- `IllegalStateException` - 如果文件已在文件系统中移动，且无法进行另一次传输时抛出

### transferTo

```java
default void transferTo(Path dest) throws IOException, IllegalStateException
```

将接收到的文件传输到指定的目标文件。
默认实现是简单地复制文件输入流。

**抛出异常**：

- `IOException`
- `IllegalStateException`