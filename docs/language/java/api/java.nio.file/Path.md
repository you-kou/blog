# [Path](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/file/Path.html)

```java
public interface Path extends Comparable<Path>, Iterable<Path>, Watchable
```

一个可以用来定位文件的对象，它通常表示系统依赖的文件路径。
 `Path` 表示一个层级结构的路径，由一系列的目录和文件名元素组成，这些元素通过特殊的分隔符或定界符分隔。路径中也可能包含一个根组件，用来标识文件系统的层级结构。路径中离根目录层次最远的元素是文件或目录的名称，其他元素是目录名称。一个 `Path` 可以表示根目录、根目录和一系列名称，或者仅仅是一个或多个名称元素。如果 `Path` 只包含一个空的名称元素，那么它被认为是一个空路径。访问一个空路径等同于访问文件系统的默认目录。`Path` 定义了 `getFileName`、`getParent`、`getRoot` 和 `subpath` 方法，用于访问路径组件或其名称元素的子序列。

除了访问路径组件外，`Path` 还定义了 `resolve` 和 `resolveSibling` 方法，用于合并路径。`relativize` 方法可以用于构造两个路径之间的相对路径。路径可以进行比较，并使用 `startsWith` 和 `endsWith` 方法相互测试。

该接口扩展了 `Watchable` 接口，使得通过路径定位的目录可以注册到 `WatchService` 中，并可以监视该目录中的文件变化。

> [!WARNING]
>
> 此接口仅供开发自定义文件系统实现的人员使用。未来版本中可能会向此接口添加方法。

**访问文件**

`Path` 可与 `Files` 类一起使用，以便对文件、目录和其他类型的文件进行操作。例如，假设我们想要使用 `BufferedReader` 读取一个名为 "access.log" 的文件，该文件位于相对于当前工作目录的 "logs" 目录下，并且是 UTF-8 编码的：

```java
Path path = FileSystems.getDefault().getPath("logs", "access.log");
BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8);
```

**互操作性**

与默认提供程序关联的 `Path` 通常与 `java.io.File` 类是互操作的。其他提供程序创建的 `Path` 不太可能与 `java.io.File` 表示的抽象路径名互操作。可以使用 `toPath` 方法从 `java.io.File` 对象表示的抽象路径名获取 `Path`。得到的 `Path` 可以用来操作与 `java.io.File` 对象相同的文件。此外，`toFile` 方法对于从 `Path` 的字符串表示构建 `File` 对象非常有用。

**并发性**

该接口的实现是不可变的，并且是线程安全的，可以在多个并发线程中使用。

## 方法

### of

```java
static Path of(String first, String... more)
```

返回一个 `Path` 对象，通过转换路径字符串，或由多个字符串组成的路径字符串。如果 `more` 没有指定任何元素，则第一个参数的值将是要转换的路径字符串。如果 `more` 指定了一个或多个元素，那么每个非空的字符串（包括 `first`）都被视为路径元素，并连接成一个路径字符串。如何连接这些字符串是由提供程序具体决定的，但通常它们会使用路径分隔符进行连接。例如，如果路径分隔符是 `/`，调用 `getPath("/foo","bar","gus")` 会将路径字符串 `"/foo/bar/gus"` 转换为 `Path`。如果 `first` 是空字符串且 `more` 不包含任何非空字符串，则返回表示空路径的 `Path`。
`Path` 是通过调用默认 `FileSystem` 的 `getPath` 方法获得的。

> [!NOTE]
>
> 虽然这个方法非常方便，但使用它会假定引用默认的 `FileSystem`，并且限制了调用代码的通用性。因此，在为灵活重用编写库代码时不应使用此方法。一个更灵活的替代方案是使用现有的 `Path` 实例作为锚点，例如：
>
> ```java
> Path dir = ...
> Path path = dir.resolve("file");
> ```

**参数**

- **`first`** —— 路径字符串或路径字符串的初始部分。
- **`more`** —— 额外的字符串，拼接后形成路径字符串。

**返回值**

返回解析后的路径。

**抛出异常**

- **`InvalidPathException`** —— 如果路径字符串无法转换为 `Path`，则抛出此异常。

### getFileSystem

```java
FileSystem getFileSystem()
```

返回创建此对象的文件系统。

**返回值**

创建此对象的文件系统。

### getParent

```java
Path getParent()
```

返回父路径，如果此路径没有父路径，则返回 `null`。

该路径对象的父路径由该路径的根组件（如果有）和路径中除最远的元素之外的每个元素组成。在目录层次结构中，最远的元素表示文件或目录的名称。此方法不会访问文件系统；路径或其父路径可能不存在。此外，此方法不会消除某些实现中可能使用的特殊名称，如 `"."` 和 `".."`。例如，在 UNIX 系统中，路径 `/a/b/c` 的父路径是 `/a/b`，而路径 `x/y/.` 的父路径是 `x/y`。此方法可以与 `normalize` 方法结合使用，以消除冗余名称，适用于需要类似 shell 导航的情况。

如果此路径具有多个元素且没有根组件，则此方法相当于评估以下表达式：

```java
subpath(0, getNameCount()-1);
```

**返回值**

返回表示路径父路径的 `Path` 对象。

### resolve

```java
Path resolve(Path other)
```

解析给定路径与当前路径的关系

如果 `other` 参数是一个绝对路径，那么此方法将直接返回 `other`。如果 `other` 是一个空路径，则直接返回当前路径 `this`。否则，认为当前路径是一个目录，并将给定路径解析到当前路径中。在最简单的情况下，给定路径没有根组件，那么该方法会将给定路径与当前路径连接，并返回一个以给定路径结尾的结果路径。如果给定路径具有根组件，则解析的行为会根据实现的不同而有所不同，因此无法确定。

**参数**

- **`other`** —— 需要与当前路径解析的路径。

**返回值**

返回解析后的路径。

### resolve

```java
default Path resolve(String other)
```

将给定的路径字符串转换为 `Path` 并按照 `resolve` 方法中指定的方式将其解析为当前路径。例如，假设路径分隔符是 `/`，路径表示为 `"foo/bar"`，那么调用此方法并传入路径字符串 `"gus"`，将得到路径 `"foo/bar/gus"`。

**实现要求**：
默认实现等同于：

```java
resolve(getFileSystem().getPath(other));
```

------

**参数**

- **`other`** —— 需要与当前路径解析的路径字符串。

**返回值**

返回解析后的路径。

**抛出异常**

- **`InvalidPathException`** —— 如果路径字符串无法转换为 `Path`，则抛出此异常。

### toAbsolutePath

```java
Path toAbsolutePath()
```

返回一个 `Path` 对象，表示此路径的绝对路径。
如果该路径已经是绝对路径，则此方法直接返回该路径。否则，该方法会以实现依赖的方式解析路径，通常是通过将路径解析为文件系统的默认目录。根据具体实现，如果文件系统无法访问，可能会抛出 I/O 错误。

------

**返回值**

返回表示绝对路径的 `Path` 对象。

**抛出异常**

- **`IOError`** —— 如果发生 I/O 错误。