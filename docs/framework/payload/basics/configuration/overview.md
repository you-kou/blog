# Payload 配置

Payload 是一个基于配置、代码优先的 CMS 和应用框架。Payload 配置是 Payload 中一切操作的核心，允许通过一个简单直观的 API 深度配置你的应用。Payload 配置是一个完全类型化的 JavaScript 对象，可以无限扩展。

从数据库选择到管理员面板的外观，所有内容都可以通过 Payload 配置来完全控制。在这里，你可以定义字段、添加本地化、启用身份验证、配置访问控制，等等。

Payload 配置通常是一个位于项目根目录的 `payload.config.ts` 文件。

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // Your config goes here
})
```

Payload 配置是强类型的，并且与 Payload 的 TypeScript 代码库直接关联。这意味着你的 IDE（如 VSCode）在你编写配置时会提供有用的信息，如自动补全建议。

> [!TIP]
>
> Payload 配置的位置可以自定义。

## 配置选项

要编写 Payload 配置，首先确定你希望使用的数据库，然后使用 Collections 或 Globals 通过字段定义数据的架构。

以下是一个最简单的 Payload 配置示例：

```java
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
})
```

以下是可用的配置选项：

| 选项                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `admin`                | 管理面板的配置选项，包括自定义组件、实时预览等。更多详情。   |
| `bin`                  | 注册 Payload 执行的自定义脚本。更多详情。                    |
| `editor`               | 用于 richText 字段的富文本编辑器。更多详情。                 |
| `db` *                 | Payload 使用的数据库适配器。更多详情。                       |
| `serverURL`            | 用于定义应用的绝对 URL 的字符串，包括协议，例如 https://example.com。仅允许协议、域名和（可选）端口，不允许路径。 |
| `collections`          | Payload 管理的集合数组。更多详情。                           |
| `compatibility`        | 早期版本 Payload 的兼容性标志。更多详情。                    |
| `globals`              | Payload 管理的全局变量数组。更多详情。                       |
| `cors`                 | 跨域资源共享（CORS）是一种接受来自指定域的请求的机制。你还可以自定义 Access-Control-Allow-Headers 头。更多详情。 |
| `localization`         | 选择将内容翻译为多种语言。更多详情。                         |
| `logger`               | 日志记录选项，带有目标流的日志记录选项，或实例化的日志记录器。更多详情。 |
| `loggingLevels`        | 用于覆盖 Payload 错误的日志记录器的级别对象。                |
| `graphQL`              | 管理与 GraphQL 相关的功能，包括自定义查询和变更、查询复杂度限制等。更多详情。 |
| `cookiePrefix`         | 将会添加到 Payload 设置的所有 Cookie 前缀的字符串。          |
| `csrf`                 | 允许 Payload 接受来自的 URL 的 Cookie 的白名单数组。更多详情。 |
| `defaultDepth`         | 如果用户在请求资源时未指定深度，将使用此深度。更多详情。     |
| `defaultMaxTextLength` | 允许的最大字符串长度，帮助防止恶意创建公共文档。             |
| `maxDepth`             | 应用程序允许的最大深度。此设置有助于防止恶意查询。默认为 10。更多详情。 |
| `indexSortableFields`  | 自动索引数据库中所有可排序的顶级字段，以提高排序性能，并为 Azure Cosmos 等提供数据库兼容性。 |
| `upload`               | 基本的 Payload 上传配置。更多详情。                          |
| `routes`               | 控制 Payload 绑定的路由结构。更多详情。                      |
| `email`                | 配置 Payload 使用的电子邮件适配器。更多详情。                |
| `onInit`               | 在启动后立即调用的函数，将 Payload 实例作为唯一参数。        |
| `debug`                | 启用时会暴露更详细的错误信息。                               |
| `telemetry`            | 通过传递 false 禁用 Payload 的遥测。更多详情。               |
| `hooks`                | 一组根钩子。更多详情。                                       |
| `plugins`              | 插件数组。更多详情。                                         |
| `endpoints`            | 添加到 Payload 路由器的自定义端点数组。更多详情。            |
| `custom`               | 用于添加自定义数据的扩展点（例如插件）。                     |
| `i18n`                 | 国际化配置。传递所有你希望管理 UI 支持的语言。默认为仅支持英语。更多详情。 |
| `secret` *             | Payload 用于任何加密工作流的安全、不可猜测的字符串，例如密码盐/哈希。 |
| `sharp`                | 如果希望 Payload 提供裁剪、焦点选择和自动媒体缩放功能，请安装并将 Sharp 模块传递到此配置中。 |
| `typescript`           | 配置 TypeScript 设置。更多详情。                             |

星号表示该属性是必需的。

### TypeScript 配置

Payload 提供了多种 TypeScript 设置供您使用。这些设置用于自动生成 Collections 和 Globals 的 TypeScript 接口，并确保 Payload 在所有 Local API 方法中使用您生成的类型。

要自定义 TypeScript 设置，请在您的 Payload 配置中使用 `typescript` 属性：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  typescript: {
    
    // ...
  },
})
```

以下选项可用：

| 选项         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| autoGenerate | 默认情况下，Payload 会自动生成您配置中定义的所有 collections 和 globals 的 TypeScript 接口。通过设置 `typescript.autoGenerate: false` 可以选择不自动生成。更多详情。 |
| declare      | 默认情况下，Payload 会将一个 declare 块添加到您的生成类型中，确保 Payload 在所有 Local API 方法中使用您生成的类型。通过设置 `typescript.declare: false` 可以选择不使用。 |
| outputFile   | 通过定义 `typescript.outputFile` 属性为完整的绝对路径，可以控制 Payload 自动生成类型的输出路径和文件名。 |