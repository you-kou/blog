# [StandardCopyOption](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/file/StandardCopyOption.html)

```java
public enum StandardCopyOption extends Enum<StandardCopyOption> implements CopyOption
```

定义标准复制选项。

## Enum 常量

| Enum 常量        | 描述                                   |
| ---------------- | -------------------------------------- |
| ATOMIC_MOVE      | 以原子文件系统操作的方式移动文件。     |
| COPY_ATTRIBUTES  | 将文件属性复制到新文件。               |
| REPLACE_EXISTING | 如果目标文件已经存在，则替换现有文件。 |

