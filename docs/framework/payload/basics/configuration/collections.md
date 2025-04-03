# 集合配置 (Collection Configs)

集合（Collection）是一组共享相同模式的记录，称为**文档 (Documents)**。您可以根据应用需求定义任意数量的集合。集合中的每个文档都会根据您定义的字段存储在数据库中，并自动生成用于管理文档的 **Local API**、**REST API** 和 **GraphQL API**。

集合还可以用于实现 **身份验证 (Authentication)**。通过定义启用了 `auth` 选项的集合，该集合将获得额外的操作来支持用户认证。

集合是组织应用中重复数据的主要方式，比如用户、产品、页面、文章以及其他您需要管理的内容类型。每个集合都可以拥有自己独特的 **访问控制 (Access Control)**、**钩子 (Hooks)**、**管理面板选项 (Admin Options)** 等功能。

要定义一个集合配置，请在 `Payload Config` 中使用 `collection` 属性：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  collections: [
    
    // Your Collections go here
  ],
})
```

> [!TIP]
>
> 如果您的集合（Collection）只打算存储单个文档 (Document)，那么建议使用 **Global** 代替集合。

## 配置选项

通常，最佳实践是将您的 **Collections**（集合）写在单独的文件中，然后将它们导入到主 **Payload Config**（配置文件）中。

以下是一个简单的 **Collection Config** 示例：

```javascript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

以下是可用的选项：

| **选项**           | **描述**                                                     |
| ------------------ | ------------------------------------------------------------ |
| `admin`            | Admin Panel（管理面板）的配置选项。更多详情。                |
| `access`           | 提供访问控制函数，精确定义谁能对该集合中的文档执行哪些操作。更多详情。 |
| `auth`             | 如果希望该集合支持认证功能，可以在这里指定选项。更多详情。   |
| `custom`           | 扩展点，用于添加自定义数据（例如插件）。                     |
| `disableDuplicate` | 设置为 `true` 时，在编辑该集合的文档时不显示“复制”按钮，并阻止所有 API 执行复制操作。 |
| `defaultSort`      | 传入一个顶层字段作为默认排序字段。在集合列表视图中显示时，字段名前加 `-` 表示降序排列。可以传入字符串数组指定多个字段排序。 |
| `dbName`           | 自定义数据库表名或集合名（取决于数据库适配器）。如果未定义，将自动从 `slug` 生成。 |
| `endpoints`        | 为 REST API 添加自定义路由。设置为 `false` 可禁用路由。更多详情。 |
| `fields`*          | 字段类型数组，用于定义此集合中文档存储数据的结构和功能。更多详情。 |
| `graphQL`          | 管理与该集合相关的 GraphQL 属性。更多详情。                  |
| `hooks`            | Hooks（钩子）的入口。更多详情。                              |
| `labels`           | 集合的单数和复数标签，用于在 Payload 中识别此集合。如果未定义，将自动从 `slug` 生成。 |
| `lockDocuments`    | 启用或禁用文档锁定。默认启用锁定。可传入对象进行配置，或设置为 `false` 关闭锁定。更多详情。 |
| `slug`*            | 唯一的、URL 友好的字符串，作为该集合的标识符。               |
| `timestamps`       | 设置为 `false` 时禁用文档自动生成的 `createdAt` 和 `updatedAt` 时间戳。 |
| `typescript`       | 包含 `interface` 属性的对象，定义用于生成 TypeScript 模型的文本。如果未定义，将自动从 `slug` 生成。 |
| `upload`           | 如果希望该集合支持文件上传，可在此指定选项。更多详情请查看 [Uploads 文档](/framework/payload/features/upload/overview.html)。 |
| `versions`         | 设置为 `true` 启用默认版本配置，也可以传入对象属性进行详细配置。更多详情。 |
| `defaultPopulate`  | 指定从其他文档中填充该集合时要选择的字段。更多详情。         |
| `indexes`          | 定义该集合的复合索引。可用于加速查询/排序多个字段，或确保多个字段之间的唯一性。 |
| `forceSelect`      | 指定始终选择的字段，无论 `select` 查询如何，这对于访问控制或钩子中的字段检查非常有用。 |

带星号 (\*) 的属性是必填项。

### Fields

字段定义了集合中文档的结构。如果想了解更多，请查看 [Fields 文档](#)。

### Access Control

集合的访问控制决定了用户对该集合中的文档可以执行哪些操作，哪些不能执行。想了解更多，请查看 [Access Control 文档](#)。

### Hooks

集合钩子允许你在文档生命周期的特定事件中执行自定义逻辑。如果想了解更多，请查看 [Hooks 文档](#)。

## Admin Options

集合在管理面板中的行为可以完全自定义，以满足应用程序的需求。这包括对导航链接进行分组或隐藏、添加自定义组件、选择在列表视图中显示哪些字段等等。

要为集合配置管理选项，请在集合配置中使用 `admin` 属性。

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    
    // ...
  },
}
```

以下选项可用：

| **选项**                       | **描述**                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| **group**                      | 用于在管理导航中将集合和全局链接分组的文本或本地化对象。设置为 `false` 可隐藏导航链接，但保留其路由可访问。 |
| **hidden**                     | 设置为 `true` 或一个函数（传入当前用户），返回 `true` 以从导航和管理路由中排除此集合。 |
| **hooks**                      | 该集合的管理特定钩子。详见更多内容。                         |
| **useAsTitle**                 | 指定一个顶层字段作为管理面板中的文档标题。如果未定义字段，则使用文档ID作为标题。具有 `virtual: true` 的字段无法用作标题。 |
| **description**                | 在列表视图中显示在集合标签下方的文本，以提供更多信息给编辑者。或者，你可以使用 `admin.components.Description` 来渲染一个 React 组件。 |
| **defaultColumns**             | 一个字段名数组，对应在该集合的列表视图中默认显示的列。       |
| **disableCopyToLocale**        | 在编辑此集合的文档时禁用“复制到本地”按钮。仅在启用了本地化时适用。 |
| **hideAPIURL**                 | 编辑此集合的文档时隐藏“API URL”元字段。                      |
| **enableRichTextLink**         | 富文本字段提供了一个“链接”元素，允许用户在富文本中自动引用相关文档。默认设置为 `true`。 |
| **enableRichTextRelationship** | 富文本字段提供了一个“关系”元素，允许用户在富文本中自动引用相关文档。默认设置为 `true`。 |
| **meta**                       | 在管理面板中应用到该集合的页面元数据覆盖。详见更多内容。     |
| **preview**                    | 在管理面板中生成预览 URL 的函数，可以指向你的应用程序。详见更多内容。 |
| **livePreview**                | 启用实时编辑，提供前端应用程序的即时视觉反馈。详见更多内容。 |
| **components**                 | 替换此集合内使用的 React 组件。详见更多内容。                |
| **listSearchableFields**       | 指定在列表搜索视图中应该搜索哪些字段。详见更多内容。         |
| **pagination**                 | 为此集合设置分页特定选项。详见更多内容。                     |
| **baseListFilter**             | 可以定义此集合列表视图的默认基础筛选条件，该条件将与用户执行的任何筛选条件合并。 |

### 自定义组件

集合可以设置自己的自定义组件，这些组件仅适用于管理面板中该集合特定的 UI。这包括诸如保存按钮或整个编辑视图等元素。

要覆盖集合组件，请在集合配置中使用 `admin.components` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      
      // ...
    },
  },
}
```

