# Location

**`Location`** 首部指定的是需要将页面重新定向至的地址。一般在响应码为 3xx 的响应中才会有意义。

发送新请求，获取 Location 指向的新页面所采用的方法与初始请求使用的方法以及重定向的类型相关：

- `303` (See Also) 始终引致请求使用 `GET` 方法，而，而 `307` (Temporary Redirect) 和 `308` (Permanent Redirect) 则不转变初始请求中的所使用的方法；
- `301` (Permanent Redirect) 和 `302` (Found) 在大多数情况下不会转变初始请求中的方法，不过一些比较早的用户代理可能会引发方法的变更（所以你基本上不知道这一点）。

状态码为上述之一的所有响应都会带有一个 Location 首部。

除了重定向响应之外，状态码为 `201` (Created) 的消息也会带有 Location 首部。它指向的是新创建的资源的地址。

## 语法

```http
Location: <url>
```

## 示例

```http
Location: /index.html
```

