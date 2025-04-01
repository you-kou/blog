# 上传字段

上传字段允许从支持上传的集合中选择文档，并将选择格式化为管理面板中的缩略图。

上传字段在多种使用场景中非常有用，例如：

- 为页面提供特色图片
- 允许产品提供可下载的资源，如 PDF 或 MP3
- 为布局构建模块提供背景图片的功能

![Shows an upload field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/upload.png)

*上传字段的管理面板截图*



要创建一个上传字段，请在字段配置中将类型设置为 `upload`：

> [!IMPORTANT]
>
> 要使用上传字段，您必须配置一个允许[上传](/framework/payload/features/upload/overview.html)的集合。

## 配置选项

| 选项                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| **name \***          | 用于存储和从数据库中检索时的属性名称。更多                   |
| **relationTo \***    | 提供单个集合的 slug，允许该字段接受与之关联的内容。注意：相关集合必须配置为支持上传。 |
| **filterOptions**    | 用于过滤在 UI 中显示的选项并进行验证的查询。更多             |
| **hasMany**          | 布尔值，如果设置为 `true`，允许该字段有多个关联，而不仅仅是一个。 |
| **minRows**          | 验证时允许的最少项数，当有值时生效。与 `hasMany` 一起使用。  |
| **maxRows**          | 验证时允许的最多项数，当有值时生效。与 `hasMany` 一起使用。  |
| **maxDepth**         | 设置查询时填充相关文档的迭代深度的数量限制。                 |
| **label**            | 在管理面板中作为字段标签的文本，或包含每种语言键的对象。     |
| **unique**           | 强制集合中的每个条目在此字段上具有唯一值。                   |
| **validate**         | 提供一个自定义验证函数，该函数将在管理面板和后端执行。更多   |
| **index**            | 为此字段构建索引，以提高查询速度。如果您的用户经常在此字段的数据上执行查询，请设置为 `true`。 |
| **saveToJWT**        | 如果该字段是顶层且嵌套在支持身份验证的配置中，则将其数据包含在用户JWT中。 |
| **hooks**            | 提供字段钩子来控制该字段的逻辑。更多详情                     |
| **access**           | 提供字段访问控制，标明哪些用户可以查看和操作该字段的数据。更多详情 |
| **hidden**           | 完全限制此字段在所有API中的可见性。仍会保存到数据库，但不会出现在任何API或管理面板中。 |
| **defaultValue**     | 提供该字段的默认值数据。更多                                 |
| **displayPreview**   | 启用显示上传文件的预览。会覆盖相关集合的 `displayPreview` 设置。更多 |
| **localized**        | 启用此字段的本地化。需要在基础配置中启用本地化。             |
| **required**         | 要求该字段必须有值。                                         |
| **admin**            | 管理员特定的配置。管理员选项。                               |
| **custom**           | 用于添加自定义数据的扩展点（例如用于插件）。                 |
| **typescriptSchema** | 通过提供 JSON 模式来覆盖字段类型生成。                       |
| **virtual**          | 提供 `true` 以禁用数据库中的字段。参见虚拟字段               |
| **graphQL**          | 自定义字段的 GraphQL 配置。更多详情                          |

*星号表示该属性是必填的。*

## 示例

`collections/ExampleCollection.ts`

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'backgroundImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
      required: true,
    },
  ],
}
```

## 过滤上传选项

可以通过提供查询约束来动态限制选项，这将用于验证输入并过滤 UI 中可用的上传项。

`filterOptions` 属性可以是一个 `Where` 查询，或者一个返回 `true`（不进行过滤）、`false`（阻止所有上传）或 `Where` 查询的函数。当使用函数时，它会以一个包含以下属性的对象作为参数调用：

| 属性            | 描述                                                      |
| --------------- | --------------------------------------------------------- |
| **relationTo**  | 用于过滤的集合 slug，限制为此字段的 `relationTo` 属性     |
| **data**        | 包含当前正在编辑的完整集合或全局文档的对象                |
| **siblingData** | 包含仅限于当前字段相同父级的文档数据的对象                |
| **id**          | 当前正在编辑的文档的 id。创建操作期间，id 为 `undefined`  |
| **user**        | 包含当前已认证用户的对象                                  |
| **req**         | 包含对 Payload、用户、语言环境等的引用的 Payload 请求对象 |

### 示例

```javascript
const uploadField = {
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  filterOptions: {
    mimeType: { contains: 'image' },
  },
}
```

> [!NOTE]
>
> 当上传字段同时具有 `filterOptions` 和自定义验证函数时，API 不会验证 `filterOptions`，除非您在自定义的 `validate` 函数中调用从 `payload/shared` 导入的默认上传字段验证函数。

## 双向关系

上传字段本身用于引用上传集合中的文档。这可以视为一种“单向”关系。如果您希望允许编辑者访问上传文档并查看它的使用位置，可以在启用上传的集合中使用 `join` 字段。有关使用 `join` 字段的双向关系的更多信息，请参阅相关文档。