# [json-server](https://github.com/typicode/json-server)

## 安装

```bash
npm install json-server
```

## 使用方法

创建一个 `db.json` 或 `db.json5` 文件：

```json
{
  "posts": [
    { "id": "1", "title": "a title", "views": 100 },
    { "id": "2", "title": "another title", "views": 200 }
  ],
  "comments": [
    { "id": "1", "text": "a comment about post 1", "postId": "1" },
    { "id": "2", "text": "another comment about post 1", "postId": "1" }
  ],
  "profile": {
    "name": "typicode"
  }
}
```

db.json5 示例

```json5
{
  posts: [
    { id: '1', title: 'a title', views: 100 },
    { id: '2', title: 'another title', views: 200 },
  ],
  comments: [
    { id: '1', text: 'a comment about post 1', postId: '1' },
    { id: '2', text: 'another comment about post 1', postId: '1' },
  ],
  profile: {
    name: 'typicode',
  },
}
```

将其传递给 JSON Server CLI

```bash
$ npx json-server db.json
```

获取一个 REST API

```bash
$ curl http://localhost:3000/posts/1
```

响应内容：

```json
{
  "id": "1",
  "title": "a title",
  "views": 100
}
```

运行以下命令查看更多选项：

```bash
$ json-server --help
```