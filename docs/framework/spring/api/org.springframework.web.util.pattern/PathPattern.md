# PathPattern

```java
public class PathPattern
extends Object
implements Comparable<PathPattern>
```

表示解析路径模式。包括一系列路径元素，用于快速匹配，并累积计算状态以便快速比较模式。

`PathPattern` 使用以下规则匹配 URL 路径：

- `?` 匹配一个字符
- `*` 匹配路径片段中的零个或多个字符
- `**` 匹配零个或多个路径片段，直到路径结束
- `{spring}` 匹配一个路径片段，并将其捕获为名为 "spring" 的变量
- `{spring:[a-z]+}` 使用正则表达式 `[a-z]+` 匹配路径片段，并将其捕获为名为 "spring" 的路径变量
- `{*spring}` 匹配零个或多个路径片段，直到路径结束，并将其捕获为名为 "spring" 的变量

**注意**：与 `AntPathMatcher` 不同，`**` 仅支持在模式的末尾。例如 `/pages/{**}` 是合法的，但 `/pages/{**}/details` 不是。同样，捕获形式 `{*spring}` 也遵循此规则。其目的是消除在比较模式时的歧义。

------

**示例**

- `/pages/t?st.html` — 匹配 `/pages/test.html` 以及 `/pages/tXst.html`，但不匹配 `/pages/toast.html`
- `/resources/*.png` — 匹配 `resources` 目录下的所有 `.png` 文件
- `/resources/**` — 匹配 `/resources/` 路径下的所有文件，包括 `/resources/image.png` 和 `/resources/css/spring.css`
- `/resources/{*path}` — 匹配 `/resources/` 下的所有文件，以及 `/resources` 本身，并将它们的相对路径捕获到名为 "path" 的变量中
  - `/resources/image.png` 匹配 `"path"` → `"/image.png"`
  - `/resources/css/spring.css` 匹配 `"path"` → `"/css/spring.css"`
- `/resources/{filename:\w+}.dat` — 匹配 `/resources/spring.dat`，并将值 `"spring"` 赋给 `filename` 变量