# CopyOption

```java
public interface CopyOption
```

一个配置如何复制或移动文件的对象。
此类型的对象可以与`Files.copy(Path, Path, CopyOption...)`、`Files.copy(InputStream, Path, CopyOption...)`和`Files.move(Path, Path, CopyOption...)`方法一起使用，用于配置文件的复制或移动方式。

`StandardCopyOption`枚举类型定义了标准选项。