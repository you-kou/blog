# Content-Disposition

在常规的 HTTP 应答中，**`Content-Disposition`** 响应标头指示回复的内容该以何种形式展示，是以*内联*的形式（即网页或者页面的一部分），还是以*附件*的形式下载并保存到本地。

## 语法

### 作为消息主体的标头

在 HTTP 场景中，第一个参数或者是 `inline`（默认值，表示回复中的消息体会以页面的一部分或者整个页面的形式展示），或者是 `attachment`（意味着消息体应该被下载到本地；大多数浏览器会呈现一个“保存为”的对话框，将 `filename` 的值预填为下载后的文件名，假如它存在的话）。

```
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="filename.jpg"
```

## 示例

以下是一则可以触发“保存为”对话框的服务器应答：

```http
200 OK
Content-Type: text/html; charset=utf-8
Content-Disposition: attachment; filename="cool.html"
Content-Length: 22

<HTML>Save me!</HTML>
```

这个简单的 HTML 文件会被下载到本地而不是在浏览器中展示。大多数浏览器默认会建议将 `cool.html` 作为文件名。

