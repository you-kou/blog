# [Resource](https://docs.spring.io/spring-framework/docs/6.2.5/javadoc-api/org/springframework/core/io/Resource.html)

```java
public interface Resource
extends InputStreamSource
```

用于资源描述符的接口，抽象了底层资源的实际类型，例如文件或类路径资源。

如果资源以物理形式存在，则可以为每个资源打开 InputStream，但对于某些资源，只能返回 URL 或 File 句柄。实际行为取决于具体实现。