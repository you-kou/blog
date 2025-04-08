# 全局配置

全局项在许多方面与集合类似，不同之处在于它们仅对应一个文档。你可以根据应用需求定义任意数量的全局项。每个全局文档都会根据你定义的字段存储在数据库中，并自动生成用于管理文档的本地 API、REST API 和 GraphQL API。

全局项是 Payload 中构建单例的主要方式，例如头部导航、全站横幅提示或应用级的本地化字符串。每个全局项都可以拥有自己独立的访问控制、钩子、管理端选项等。

要定义一个全局配置，请在你的 Payload 配置中使用 globals 属性：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  globals: [
    
    // Your Globals go here
  ],
})
```

> [!TIP]
>
> 如果你有多个具有相同结构的全局项，建议使用集合（Collection）代替。

## 配置选项

通常的最佳实践是将全局项（Globals）写在单独的文件中，然后导入到主 Payload 配置中。

以下是一个简单的全局配置示例：

```
import { GlobalConfig } from 'payload'

export const Nav: GlobalConfig = {
  slug: 'nav',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 8,
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages', // "pages" is the slug of an existing collection
          required: true,
        },
      ],
    },
  ],
}
```

> [!NOTE]
>
> 有关更复杂的示例，请查看 Payload 仓库中的 [Templates](https://github.com/payloadcms/payload/tree/main/templates) 和 [Examples](https://github.com/payloadcms/payload/tree/main/examples) 目录。

以下选项可用：

| 选项              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| **access**        | 提供访问控制函数，用于精确定义谁可以对该全局项执行哪些操作。详见相关说明。 |
| **admin**         | 管理后台的配置选项。详见相关说明。                           |
| **custom**        | 用于扩展自定义数据（例如插件使用）。                         |
| **dbName**        | 针对该全局项自定义数据库表或集合名称，具体取决于所用的数据库适配器。如果未定义，则从 slug 自动生成。 |
| **description**   | 显示在全局项标题下方的文本或 React 组件，为编辑者提供更多信息。 |
| **endpoints**     | 向 REST API 添加自定义路由。详见相关说明。                   |
| **fields** *      | 字段类型数组，决定该全局项中存储数据的结构与功能。详见相关说明。 |
| **graphQL**       | 配置与该全局项相关的 GraphQL 属性。详见相关说明。            |
| **hooks**         | 钩子的入口配置。详见相关说明。                               |
| **label**         | 后台显示名称的文本，或一个包含各语言键值的对象。如果未定义，将从 slug 自动生成。 |
| **lockDocuments** | 启用或禁用文档锁定。默认启用。可设置为对象以进行配置，或设置为 false 以禁用锁定。详见相关说明。 |
| **slug** *        | 唯一的、URL 友好的字符串，作为该全局项的标识符。             |
| **typescript**    | 一个对象，包含用于模式生成的 interface 属性。如果未定义，则从 slug 自动生成。 |
| **versions**      | 设置为 true 启用默认版本管理，或通过对象进行详细配置。详见相关说明。 |
| **forceSelect**   | 指定在查询中始终应被选中的字段，即使未显式选择，通常用于访问控制或钩子处理。 |

*带星号（\*）的属性为必填项。*

### 字段

字段用于定义全局项（Global）的数据结构。要了解更多信息，请参阅[字段](/framework/payload/basics/fields/overview.html)文档。

### 访问控制

全局访问控制用于决定用户对特定全局文档可以或不可以执行哪些操作。要了解更多信息，请参阅[访问控制](/framework/payload/basics/access-control/overview.html)文档。

### 钩子

全局钩子允许你在文档生命周期的特定事件中插入自定义逻辑。要了解更多信息，请参阅钩子文档。

## 管理端选项

全局项在管理面板中的行为可以完全自定义，以满足你的应用需求。这包括对导航链接进行分组或隐藏、添加自定义组件、设置页面元数据等。

要为全局项配置管理端选项，请在全局配置中使用 `admin` 属性：

```javascript
import { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    
    // ...
  },
}
```

以下选项可用：

| 选项            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| **group**       | 用于在管理后台导航中对集合（Collection）和全局项（Global）链接进行分组的文本或本地化对象。设置为 `false` 可隐藏导航中的链接，但仍可访问其路由。 |
| **hidden**      | 设置为 `true` 或一个函数（接收当前用户作为参数，返回 `true`），可将该全局项从导航和后台路由中排除。 |
| **components**  | 使用你自定义的 React 组件替换该全局项中的组件。详见相关说明。 |
| **preview**     | 用于生成该全局项在管理后台的预览 URL 的函数，可以指向你的应用。详见相关说明。 |
| **livePreview** | 启用实时编辑功能，实现前端应用的即时视觉反馈。详见相关说明。 |
| **hideAPIURL**  | 在编辑该集合文档时隐藏 “API URL” 元字段。                    |
| **meta**        | 覆盖管理后台中该全局项的页面元数据。详见相关说明。           |