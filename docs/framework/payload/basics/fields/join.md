# 关联字段

关联字段用于使`Relationship`和`Upload`字段在相反方向上可用。通过关联字段，您可以编辑和查看引用特定集合文档的集合。该字段本身作为虚拟字段存在，即不会在包含关联字段的集合中存储新数据。相反，管理员 UI 会显示相关文档，以提供更好的编辑体验，并通过 Payload 的 API 进行显示。

关联字段在以下场景中非常有用：

- 显示某个产品的订单
- 查看和编辑属于某个类别的帖子
- 处理任何双向关系数据
- 显示文档或上传文件在其他文档中的使用情况

![Shows Join field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/join.png)

*关联字段的管理员面板截图*



为了使关联字段正常工作，您必须在您要关联的集合中已有一个关系或上传字段。这将引用相关文档字段的集合和路径。要添加关系字段，请在字段配置中将类型设置为 "join"：

```javascript
import type { Field } from 'payload'

export const MyJoinField: Field = {
  name: 'relatedPosts',
  type: 'join',
  collection: 'posts',
  on: 'category',
}

// relationship field in another collection:
export const MyRelationshipField: Field = {
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
}
```

在这个示例中，字段被定义为在添加到类别集合时显示相关的帖子。`on` 属性用于指定与集合文档相关的字段的关系字段名称。

通过这个示例，如果您在管理员 UI 或 API 响应中导航到某个类别，您将看到与该类别相关的帖子已经为您填充。这非常强大，可以轻松地定义各种关系类型。

> [!NOTE]
>
> 关联字段具有极高的性能，在您的 API 响应中不会增加额外的查询开销，直到您增加深度为 1 或更高为止。它适用于所有数据库适配器。在 MongoDB 中，我们使用聚合自动连接相关文档，而在关系型数据库中，我们使用连接操作。

> [!CAUTION]
>
> 关联字段在 DocumentDB 和 Azure Cosmos DB 中不受支持，因为我们在这些数据库中内部使用 MongoDB 聚合查询数据，而这些数据库对聚合的支持有限。未来可能会做出调整。

### 架构建议

在建模数据库时，您可能会遇到很多需要建立双向关系的情况。但这里有一个重要的考虑——通常您只希望在一个地方存储关于某个关系的信息。

以帖子和类别为例。在编辑帖子时，定义帖子属于哪个类别是合理的。

但通常没有必要在类别上直接存储帖子的 ID 列表，原因如下：

- 您希望拥有一个“单一的事实来源”来管理关系，而不是担心保持两个来源的同步。
- 如果您有成百上千甚至数百万篇帖子，您不希望将所有这些帖子 ID 存储在一个类别中。
- 等等。

这就是关联字段特别强大的地方。通过它，您只需在帖子中存储 `category_id`，Payload 会在查询类别时自动为您连接相关的帖子。相关的类别仅存储在帖子本身上，而不会在两端重复存储。然而，正是关联字段让您能够实现双向的 API 和 UI。

### 使用关联字段来完全控制您的数据库架构

对于典型的多态关系或多对多关系，如果您使用的是 Postgres 或 SQLite，Payload 会自动创建一个 `posts_rels` 表，作为连接表来存储给定文档的所有关系。

然而，如果您希望对数据库架构有更多控制，可能这不适合您的用例。您可能不希望有那个 `_rels` 表，而是更倾向于维护和控制自己的连接表设计。

> [!NOTE]
>
> 使用关联字段，您可以控制自己的连接表设计，避免 Payload 自动创建 `_rels` 表。

关联字段可以与任何集合一起使用——如果您希望定义自己的“连接”集合，例如名为 `categories_posts`，并具有 `post_id` 和 `category_id` 列，您可以完全控制该连接表的形状。

您还可以进一步利用 `categories_posts` 集合的 `admin.hidden` 属性，将该集合隐藏，避免在管理员 UI 导航中显示。

#### 在关系中指定附加字段

关联字段的另一个非常强大的用例是能够在关系上定义“上下文”字段。假设您有帖子（Posts）和类别（Categories），并且在帖子和类别集合上都使用了关联字段，以便从一个新的伪连接集合 `categories_posts` 中连接相关文档。现在，关系存储在这个第三个连接集合中，并可以在帖子和类别中展示。但重要的是，您可以向这个共享连接集合中添加额外的“上下文”字段。

例如，在 `categories_posts` 集合中，除了有类别和帖子字段外，我们还可以添加自定义的“上下文”字段，比如 `featured` 或 `spotlight`，这将允许您直接在关系上存储附加信息。关联字段为您提供了完全的控制能力，可以实现 Payload 中的任何类型的关系架构，所有这些都通过强大的管理员 UI 来实现。

## 配置选项

| 选项                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| **name** *           | 用作从数据库检索时的属性名称。更多                           |
| **collection** *     | 拥有关系字段的集合 slug，或者集合 slug 的数组。              |
| **on** *             | 关系或上传字段的名称，用于关联到集合文档。对于嵌套路径使用点表示法，如 'myGroup.relationName'。如果 collection 是数组，则此字段必须在所有指定集合中存在。 |
| **where**            | 用于隐藏相关文档的查询。将与请求中指定的任何 `where` 合并。  |
| **maxDepth**         | 默认为 1，设置此字段的最大填充深度，无论到达此字段时剩余深度是多少。最大深度。 |
| **label**            | 在管理员面板中用作字段标签的文本，或者是包含每种语言的键值对象。 |
| **hooks**            | 提供字段钩子以控制此字段的逻辑。更多细节。                   |
| **access**           | 提供字段访问控制，表示哪些用户可以查看和操作此字段的数据。更多细节。 |
| **defaultLimit**     | 要返回的文档数量。设置为 0 以返回所有相关文档。              |
| **defaultSort**      | 用于指定连接文档返回顺序的字段名称。                         |
| **admin**            | 管理员特定的配置。更多细节。                                 |
| **custom**           | 用于添加自定义数据的扩展点（例如，插件）。                   |
| **typescriptSchema** | 提供 JSON 模式以覆盖字段类型生成。                           |
| **graphQL**          | 字段的自定义 GraphQL 配置。更多细节。                        |

*带星号的选项表示此属性为必填项。*

## 管理员配置选项

您可以使用管理员配置属性来控制关联字段的用户体验。以下选项是支持的：

| **选项**             | **描述**                                                     |
| -------------------- | ------------------------------------------------------------ |
| **defaultColumns**   | 字段名称的数组，用于指定在关系表中显示哪些列。默认是集合配置。 |
| **allowCreate**      | 设置为 `false` 以移除此字段创建新相关文档的控制。            |
| **components.Label** | 覆盖字段组件的默认标签。更多细节。                           |

## 关联字段数据

当返回的文档中，关联字段被填充了相关文档时，返回的结构是一个对象，包含以下内容：

- **docs**：一个包含相关文档的数组，或者如果达到深度限制，则仅包含 ID。
- **hasNextPage**：一个布尔值，表示是否还有更多文档。
- **totalDocs**：文档的总数，仅当在关联查询中传递 `count: true` 时存在。

```json
{
  "id": "66e3431a3f23e684075aae9c",
  "relatedPosts": {
    "docs": [
      {
        "id": "66e3431a3f23e684075aaeb9",
        // other fields...
        "category": "66e3431a3f23e684075aae9c"
      }
      // { ... }
    ],
    "hasNextPage": false,
    "totalDocs": 10 // if count: true is passed
  }
  // other fields...
}
```

## 关联字段数据（多态）

当返回的文档中，多态关联字段（集合为数组）被填充了相关文档时，返回的结构是一个对象，包含以下内容：

- **docs**：一个包含 `relationTo`（文档的集合 slug）和 `value`（文档本身或在达到深度限制时为 ID）的数组。
- **hasNextPage**：一个布尔值，表示是否还有更多文档。
- **totalDocs**：文档的总数，仅当在关联查询中传递 `count: true` 时存在。

```json
{
  "id": "66e3431a3f23e684075aae9c",
  "relatedPosts": {
    "docs": [
      {
        "relationTo": "posts",
        "value": {
          "id": "66e3431a3f23e684075aaeb9",
          // other fields...
          "category": "66e3431a3f23e684075aae9c"
        }
      }
      // { ... }
    ],
    "hasNextPage": false,
    "totalDocs": 10 // if count: true is passed
  }
  // other fields...
}
```

## 查询选项

关联字段支持自定义查询，以过滤、排序和限制返回的相关文档。除了每个关联字段的特定查询选项外，您还可以传递 `joins: false` 来禁用所有关联字段的返回。这对于在不需要相关文档时，出于性能考虑非常有用。

以下查询选项是支持的：

| **属性**  | **描述**                                                     |
| --------- | ------------------------------------------------------------ |
| **limit** | 返回的最大相关文档数量，默认为 10。                          |
| **where** | 一个可选的 `Where` 查询，用于过滤连接的文档。将与字段的 `where` 对象合并。 |
| **sort**  | 一个用于排序相关结果的字符串。                               |
| **count** | 是否包括相关文档的计数。默认不包括。                         |

这些选项可以应用于本地 API、GraphQL 和 REST API。

### 本地 API

通过向本地 API 添加关联字段，您可以按字段名称自定义每个关联字段的请求。

```javascript
const result = await payload.find({
  collection: 'categories',
  where: {
    title: {
      equals: 'My Category',
    },
  },
  joins: {
    relatedPosts: {
      limit: 5,
      where: {
        title: {
          equals: 'My Post',
        },
      },
      sort: 'title',
    },
  },
})
```

> [!WARNING]
>
> 目前，关联字段的 `Where` 查询对包含多个集合的关联文档的支持是有限的，并且不支持数组和块内部的字段。

> [!WARNING]
>
> 目前，无法通过关联字段本身进行查询，这意味着：
>
> ```javascript
> payload.find({
>   collection: 'categories',
>   where: {
>     'relatedPosts.title': { // relatedPosts 是一个关联字段
>       equals: "post"
>     }
>   }
> })
> ```
>
> 此查询尚不支持。

### REST API

REST API 支持与本地 API 相同的查询选项。您可以使用 `joins` 查询参数，通过字段名称自定义每个关联字段的请求。例如，以下 API 调用将获取一个文档，并限制相关帖子数量为 5，并按标题排序：

`/api/categories/${id}?joins[relatedPosts][limit]=5&joins[relatedPosts][sort]=title`

对于单个请求，您可以根据需要为相同或不同的关联字段指定多个 `joins` 参数。

### GraphQL

GraphQL API 支持与本地和 REST API 相同的查询选项。您可以在查询中为每个关联字段指定查询选项。

例如：

```javascript
query {
  Categories {
    docs {
      relatedPosts(
        sort: "createdAt"
        limit: 5
        where: { author: { equals: "66e3431a3f23e684075aaeb9" } }
      ) {
        docs {
          title
        }
        hasNextPage
      }
    }
  }
}
```

