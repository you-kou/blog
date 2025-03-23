# UrlResource

```java
public class UrlResource
extends AbstractFileResolvingResource
```

java.net.URL 定位器的资源实现。支持解析为 URL，如果使用“file:”协议，还支持解析为文件。

## 构造函数

### UrlResource(URI uri)

```java
public UrlResource(URI uri)
            throws MalformedURLException
```

根据给定的 URI 对象创建一个新的 `UrlResource`。 

**参数**：

- **`uri`** —— `URI `。

**抛出异常**：

- **`MalformedURLException `** —— 如果给定的 `URI `路径无效。