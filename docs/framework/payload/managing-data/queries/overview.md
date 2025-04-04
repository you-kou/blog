# 查询文档

在 Payload 中，“查询”是指对集合中的文档进行过滤或搜索。Payload 中的查询语言设计简单且强大，允许你通过直观和标准化的结构对文档进行精准过滤。

Payload 提供了三种常见的查询 API：

- 本地 API - 极其快速，直接访问数据库
- REST API - 用于查询和修改数据的标准 HTTP 端点
- GraphQL - 完整的 GraphQL API，并提供 GraphQL Playground

这三种 API 共享相同的底层查询语言，并完全支持相同的功能。这意味着你只需要学习一次 Payload 的查询语言，就可以在你可能使用的任何 API 上使用它。

要查询文档，你可以通过请求发送任意数量的运算符：

```javascript
import type { Where } from 'payload'

const query: Where = {
  color: {
    equals: 'blue',
  },
}
```

确切的查询语法将取决于你使用的 API，但这些概念在所有 API 中都是相同的。更多详情。

> [!TIP]
>
> 你也可以在访问控制函数中使用查询。

## 操作符

以下是查询中可用的操作符：

| 操作符             | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| equals             | 值必须完全相等。                                             |
| not_equals         | 查询将返回所有值不相等的文档。                               |
| greater_than       | 针对数字或基于日期的字段。                                   |
| greater_than_equal | 针对数字或基于日期的字段。                                   |
| less_than          | 针对数字或基于日期的字段。                                   |
| less_than_equal    | 针对数字或基于日期的字段。                                   |
| like               | 不区分大小写的字符串必须存在。如果是多个单词的字符串，所有单词必须存在，顺序不限。 |
| contains           | 必须包含输入的值，不区分大小写。                             |
| in                 | 值必须存在于提供的以逗号分隔的值列表中。                     |
| not_in             | 值必须不在提供的以逗号分隔的值列表中。                       |
| all                | 值必须包含提供的逗号分隔的所有值。注意：当前此操作符仅在 MongoDB 适配器中支持。 |
| exists             | 仅返回值存在（true）或不存在（false）的文档。                |
| near               | 针对与点字段相关的距离，格式为 <经度>, <纬度>, <最大距离（米，可空）>, <最小距离（米，可空）>。 |
| within             | 针对点字段，根据点是否位于给定的 GeoJSON 定义的区域内过滤文档。 |
| intersects         | 针对点字段，根据点是否与给定的 GeoJSON 定义的区域相交过滤文档。 |

> [!TIP]
>
> 如果你知道用户会频繁查询某些字段，可以在字段配置中添加 `index: true`，这将大大加快使用该字段的搜索速度。

### 与 / 或 逻辑

除了定义简单的查询之外，您还可以使用与（AND）/ 或（OR）逻辑将多个查询连接在一起。您可以根据需要嵌套这些逻辑，以创建复杂的查询。

要连接查询，请在查询对象中使用 `and` 或 `or` 键：

```javascript
import type { Where } from 'payload'

const query: Where = {
  or: [
    
    {
      color: {
        equals: 'mint',
      },
    },
    {
      and: [
        
        {
          color: {
            equals: 'white',
          },
        },
        {
          featured: {
            equals: false,
          },
        },
      ],
    },
  ],
}
```

用简单的英文来说，如果上述查询传递给一个查找操作，它的意思是：查找那些颜色为薄荷绿或白色，并且 `featured` 设置为 `false` 的帖子。

### 嵌套属性

当处理嵌套属性时，尤其是使用关系字段时，可以使用点符号来访问嵌套的属性。例如，当使用一个包含 `artists` 字段的 `Song` 集合时，该字段与一个名为 `artists` 的 `Artists` 集合相关联。你可以通过如下方式访问 `Artists` 集合中的属性：

```javascript
import type { Where } from 'payload'

const query: Where = {
  'artists.featured': {
    // nested property name to filter on
    exists: true, // operator to use and boolean value that needs to be true
  },
}
```

## 编写查询

在 Payload 中编写查询非常简单，并且在所有 API 中保持一致，只有在语法上有些许差异。

### Local API

Local API 支持 `find` 操作，接受一个原始查询对象：

```javascript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    where: {
      color: {
        equals: 'mint',
      },
    },
  })

  return posts
}
```

### GraphQL API

在GraphQL API中，所有的find查询都支持`where`参数，该参数接受原始查询对象：

```javascript
query {
  Posts(where: { color: { equals: mint } }) {
    docs {
      color
    }
    totalDocs
  }
}
```

### REST API

在REST API中，您可以使用Payload查询的全部功能，但它们是作为查询字符串来编写的：

`https://localhost:3000/api/posts?where[color][equals]=mint`

要理解语法，您需要明白复杂的URL搜索字符串会被解析成JSON对象。这个例子不算太复杂，但更复杂的查询不可避免地会变得更难编写。

因此，我们推荐使用非常有用且广泛使用的`qs-esm`包，将您的JSON / 对象格式的查询解析为查询字符串：

```javascript
import { stringify } from 'qs-esm'
import type { Where } from 'payload'

const query: Where = {
  color: {
    equals: 'mint',
  },
  // This query could be much more complex
  // and qs-esm would handle it beautifully
}

const getPosts = async () => {
  const stringifiedQuery = stringify(
    {
      where: query, // ensure that `qs-esm` adds the `where` property, too!
    },
    { addQueryPrefix: true },
  )

  const response = await fetch(
    `http://localhost:3000/api/posts${stringifiedQuery}`,
  )
  // Continue to handle the response below...
}
```

