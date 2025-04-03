| Method | Path                   |
| :----- | :--------------------- |
| `GET`  | /api/{collection-slug} |

**请求**

```javascript
try {
  const req = await fetch('{cms-url}/api/{collection-slug}')
  const data = await req.json()
} catch (err) {
  console.log(err)
}
```

**响应**

```javascript
{
  "docs": [
    {
      "id": "644a5c24cc1383022535fc7c",
      "title": "Home",
      "content": "REST API examples",
      "slug": "home",
      "createdAt": "2023-04-27T11:27:32.419Z",
      "updatedAt": "2023-04-27T11:27:32.419Z"
    }
  ],
  "hasNextPage": false,
  "hasPrevPage": false,
  "limit": 10,
  "nextPage": null,
  "page": 1,
  "pagingCounter": 1,
  "prevPage": null,
  "totalDocs": 1,
  "totalPages": 1
}
```

**额外的查找查询参数**
`find` 端点支持以下额外的查询参数：

- **sort**：按字段排序
- **where**：传递一个 `where` 查询以限制返回的文档
- **limit**：限制返回的文档数量
- **page**：获取特定页面的文档