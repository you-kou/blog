# 日志

Spring 自带了一个 Commons Logging 桥接器，实现在 **spring-jcl** 模块中。该实现检查类路径中是否存在 Log4j 2.x API 或 SLF4J 1.7 API，并使用找到的第一个作为日志实现。如果没有找到 Log4j 2.x 或 SLF4J，它将回退到 Java 平台的核心日志设施（也称为 JUL 或 java.util.logging）。

将 Log4j 2.x、Logback（或其他 SLF4J 提供者）放入类路径中，无需额外的桥接器，框架会自动适配你的选择。

> [!NOTE]
>
> Spring 的 Commons Logging 变体仅用于核心框架和扩展中的基础设施日志记录。
>
> 对于应用代码中的日志需求，建议直接使用 Log4j 2.x、SLF4J 或 JUL。

可以通过 `org.apache.commons.logging.LogFactory` 获取日志实现，如下例所示。

```java
public class MyBean {
	private final Log log = LogFactory.getLog(getClass());
    // ...
}
```

