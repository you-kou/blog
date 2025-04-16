# PageRequest

```java
public class PageRequest
extends AbstractPageRequest
```

Pageable 的基本 Java Bean 实现。

## 方法

### of

```java
public static PageRequest of(int pageNumber, int pageSize)
```

创建一个新的无排序的 PageRequest。
**参数：**

- `pageNumber` - 从零开始的页码，不能为负数。
- `pageSize` - 要返回的页的大小，必须大于 0。