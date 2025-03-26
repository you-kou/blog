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
| `admin`                | 管理面板的配置选项，包括自定义组件、实时预览等。             |
| `bin`                  | 注册 Payload 执行的自定义脚本。                              |
| `editor`               | 用于 richText 字段的富文本编辑器。                           |
| `db` *                 | Payload 使用的数据库适配器。                                 |
| `serverURL`            | 用于定义应用的绝对 URL 的字符串，包括协议，例如 https://example.com。仅允许协议、域名和（可选）端口，不允许路径。 |
| `collections`          | Payload 管理的集合数组。                                     |
| `compatibility`        | 早期版本 Payload 的兼容性标志。                              |
| `globals`              | Payload 管理的全局变量数组。                                 |
| `cors`                 | 跨域资源共享（CORS）是一种接受来自指定域的请求的机制。你还可以自定义 Access-Control-Allow-Headers 头。 |
| `localization`         | 选择将内容翻译为多种语言。                                   |
| `logger`               | 日志记录选项，带有目标流的日志记录选项，或实例化的日志记录器。 |
| `loggingLevels`        | 用于覆盖 Payload 错误的日志记录器的级别对象。                |
| `graphQL`              | 管理与 GraphQL 相关的功能，包括自定义查询和变更、查询复杂度限制等。 |
| `cookiePrefix`         | 将会添加到 Payload 设置的所有 Cookie 前缀的字符串。          |
| `csrf`                 | 允许 Payload 接受来自的 URL 的 Cookie 的白名单数组。         |
| `defaultDepth`         | 如果用户在请求资源时未指定深度，将使用此深度。               |
| `defaultMaxTextLength` | 允许的最大字符串长度，帮助防止恶意创建公共文档。             |
| `maxDepth`             | 应用程序允许的最大深度。此设置有助于防止恶意查询。默认为 10。 |
| `indexSortableFields`  | 自动索引数据库中所有可排序的顶级字段，以提高排序性能，并为 Azure Cosmos 等提供数据库兼容性。 |
| `upload`               | 基本的 Payload 上传配置。                                    |
| `routes`               | 控制 Payload 绑定的路由结构。                                |
| `email`                | 配置 Payload 使用的电子邮件适配器。                          |
| `onInit`               | 在启动后立即调用的函数，将 Payload 实例作为唯一参数。        |
| `debug`                | 启用时会暴露更详细的错误信息。                               |
| `telemetry`            | 通过传递 false 禁用 Payload 的遥测。                         |
| `hooks`                | 一组根钩子。                                                 |
| `plugins`              | 插件数组。                                                   |
| `endpoints`            | 添加到 Payload 路由器的自定义端点数组。                      |
| `custom`               | 用于添加自定义数据的扩展点（例如插件）。                     |
| `i18n`                 | 国际化配置。传递所有你希望管理 UI 支持的语言。默认为仅支持英语。 |
| `secret` *             | Payload 用于任何加密工作流的安全、不可猜测的字符串，例如密码盐/哈希。 |
| `sharp`                | 如果希望 Payload 提供裁剪、焦点选择和自动媒体缩放功能，请安装并将 Sharp 模块传递到此配置中。 |
| `typescript`           | 配置 TypeScript 设置。                                       |

`*`表示该属性是必需的。

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

| 选项           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| `autoGenerate` | 默认情况下，Payload 会自动生成您配置中定义的所有 collections 和 globals 的 TypeScript 接口。通过设置 `typescript.autoGenerate: false` 可以选择不自动生成。 |
| `declare`      | 默认情况下，Payload 会将一个 declare 块添加到您的生成类型中，确保 Payload 在所有 Local API 方法中使用您生成的类型。通过设置 `typescript.declare: false` 可以选择不使用。 |
| `outputFile`   | 通过定义 `typescript.outputFile` 属性为完整的绝对路径，可以控制 Payload 自动生成类型的输出路径和文件名。 |

## 配置文件位置

对于Payload命令行脚本，我们需要能够定位您的Payload配置文件。默认情况下，我们会检查多个位置以查找`payload.config.ts`文件，包括：

- 当前工作目录的根目录
- `tsconfig`中的`compilerOptions`*
- `dist`目录*

`*`配置文件的位置检测在开发环境和生产环境中有所不同。更多详情请参见下文。

> [!IMPORTANT]
>
> 确保您的`tsconfig.json`文件已正确配置，以便Payload可以自动检测您的配置文件位置。如果该文件不存在，或没有指定正确的`compilerOptions`，Payload将默认使用当前工作目录。

**开发模式**

在开发模式下，如果在根目录未找到配置文件，Payload将尝试读取您的`tsconfig.json`文件，并尝试查找`rootDir`中指定的配置文件。

```json
{
  // ...
  "compilerOptions": {
    "rootDir": "src"
  }
}
```

**生产模式**

在生产模式下，Payload将首先尝试在`tsconfig.json`的`outDir`中查找配置文件，如果未找到，则会回退到`rootDir`目录。

```json
{
  // ...
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

如果在上述任一位置都未找到配置文件，Payload最终会检查`dist`目录。

### 自定义配置文件位置

除了上述的自动检测，您还可以指定Payload配置文件的自定义位置。这在配置文件不在标准位置，或您希望在多个配置之间切换时非常有用。为此，Payload提供了一个环境变量，可以绕过所有自动配置检测。

要使用自定义配置文件位置，请设置`PAYLOAD_CONFIG_PATH`环境变量：

```json
{
  "scripts": {
    "payload": "PAYLOAD_CONFIG_PATH=/path/to/custom-config.ts payload"
  }
}
```

> [!TIP]
>
> `PAYLOAD_CONFIG_PATH`可以是一个绝对路径，或者相对于当前工作目录的路径。

## 遥测

Payload收集完全匿名的遥测数据，关于一般使用情况。这些数据对我们非常重要，帮助我们准确了解如何发展，以及我们可以做些什么，将软件打造得尽可能完美。我们收集的遥测数据还帮助我们以准确的方式展示我们的成长，这在我们寻求投资以建立和扩展团队时非常有帮助。如果我们能够准确展示我们的成长，我们将能够更有效地继续支持Payload作为免费且开源的软件。如果您希望退出遥测，可以在Payload配置文件中设置`telemetry: false`。

## 跨源资源共享 (CORS)

跨源资源共享 (CORS) 可以通过以下方式进行配置：一个包含允许CORS请求的URL的白名单数组，一个通配符字符串 (`*`)，以接受来自任何域的传入请求或者一个包含以下属性的对象：

| **选项**  | **描述**                                                     |
| --------- | ------------------------------------------------------------ |
| `origins` | 一个包含允许CORS请求的URL的白名单数组，或一个通配符字符串（`*`），以接受来自任何域的传入请求。 |
| `headers` | 一个允许的头部列表，这些头部将被添加到`Access-Control-Allow-Headers`中。 |

这是一个示例，展示如何允许来自任何域的传入请求：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  cors: '*', 
})
```

这是一个示例，展示如何在 `Access-Control-Allow-Headers` 中添加一个新头部 (`x-custom-header`)：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  cors: {
    origins: ['http://localhost:3000']
    headers: ['x-custom-header']
  }
})
```

## TypeScript

您可以从Payload中导入类型，帮助您更轻松地编写配置文件，并确保类型安全。有两种主要的类型代表Payload配置：`Config` 和 `SanitizedConfig`。

**`Config`**表示完整的原始Payload配置，只有最基本的属性是必需的。**`SanitizedConfig`**表示Payload经过完全“清洗”后的配置，通常仅供Payload内部使用。

```javascript
import type { Config, SanitizedConfig } from 'payload'
```

## 服务器 vs. 客户端

Payload配置文件**仅存在于服务器端**，不允许包含任何客户端代码。这样，您可以在任何服务器环境或独立脚本中加载Payload配置，而无需使用打包工具或Node.js加载器来处理仅限客户端的模块（例如`scss`文件或`React`组件），也不会报错。

在幕后，基于Next.js的管理面板会生成一个`ClientConfig`，它会**去除服务器端代码**，并补充配置中的`React`组件。

## 兼容性标志

Payload配置可以接受**兼容性标志**，用于在运行新版本时保持与旧数据库的兼容性。不过，**仅在确有必要时**才应启用这些标志，并在启用前确认是否真的需要它们。

**`allowLocalizedWithinLocalized`**

Payload 的本地化功能是按字段逐个处理的。由于字段可以嵌套在其他字段中，您可能会在一个本地化字段内再嵌套另一个本地化字段 —— 但这将是多余且不必要的。如果父字段已本地化，则没有理由在其内部定义本地化字段，因为从父字段开始的整个数据结构都将被本地化。

默认情况下，如果父字段已本地化，Payload 将移除子字段中的 localized: true 属性。只有在您拥有来自 3.0 之前版本的 Payload MongoDB 数据库，并且希望保留嵌套的本地化字段而不进行迁移时，才需将此兼容性标志设置为 true。

## 自定义 bin 脚本

使用`bin`配置属性，您可以向`npx payload`注入自定义脚本。例如，创建`pnpm payload seed`命令的步骤：

步骤 1：创建 `seed.ts` 文件，放在与 `payload.config.ts` 相同的目录下，内容示例：

```javascript
import type { SanitizedConfig } from 'payload'

import payload from 'payload'

// Script must define a "script" function export that accepts the sanitized config
export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })
  await payload.create({
    collection: 'pages',
    data: { title: 'my title' },
  })
  payload.logger.info('Succesffully seeded!')
  process.exit(0)
}
```

步骤 2：在 `bin` 中添加 `seed` 脚本：

```javascript
export default buildConfig({
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seed.ts'),
      key: 'seed',
    },
  ],
})
```

现在，您可以使用以下命令运行它：

```sh
pnpm payload seed
```

