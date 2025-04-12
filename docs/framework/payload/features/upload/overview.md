# 上传

![Shows an Upload enabled collection in the Payload Admin Panel](https://payloadcms.com/images/docs/upload-admin.jpg)

*管理面板截图，显示启用了上传功能的媒体集合*



**以下是一些常见的上传用例：**

- 创建一个“媒体库”，包含可在网站或应用中使用的图片
- 构建一个受限内容库，用户需注册才能访问可下载的资源，如电子书 PDF、白皮书等
- 存储公开可用的可下载资源，如软件、ZIP 文件、MP4 等

**只需在集合上启用上传功能，Payload 就会自动将您的集合转换为强大的文件管理/存储解决方案。以下修改将被应用：**

- `filename`、`mimeType` 和 `filesize` 字段将自动添加到您的集合中。如果在集合的上传配置中传递 `imageSizes`，还会添加一个 `sizes` 数组，其中包含自动调整大小的图像尺寸及其文件名。
- 管理面板将在列表视图中修改其内置的列表组件，以显示每个上传文件的缩略图。
- 管理面板将在编辑视图中添加相应的上传 UI，允许文件上传。
- 创建、更新和删除集合的操作将被修改，以支持文件上传、重新上传和删除。

## 启用上传

每个 Payload 集合都可以通过在集合配置中指定 `upload` 属性来支持上传，该属性可以设置为 `true`，或设置为包含上传选项的对象。

> [!TIP]
>
> 一个常见的模式是创建一个“媒体”集合，并在该集合上启用上传功能。

```javascript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
```

### 集合上传选项

带有星号（*）的选项为必填项。

| **选项**                     | **描述**                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| **adminThumbnail**           | 设置管理面板如何显示该集合的缩略图。                         |
| **bulkUpload**               | 允许用户在列表视图中批量上传，默认值为 `true`。              |
| **cacheTags**                | 设置为 `false` 可在 UI 中禁用管理面板缩略图组件的缓存标签。适用于 CDN 不允许特定缓存查询的情况。 |
| **crop**                     | 设置为 `false` 以在管理面板中禁用裁剪工具。默认启用。 [更多](#) |
| **disableLocalStorage**      | 完全禁用将文件上传到本地磁盘。 [更多](#)                     |
| **displayPreview**           | 允许在与该集合相关的上传字段中显示文件预览。可在上传字段的 `displayPreview` 选项中本地覆盖。 [更多](#) |
| **externalFileHeaderFilter** | 接收现有的请求头，并在过滤或修改后返回。                     |
| **filesRequiredOnCreate**    | 在创建文档时要求上传文件数据，默认值为 `true`。              |
| **filenameCompoundIndex**    | 允许指定字段 Slug 以用于复合索引，而不是默认的文件名索引。   |
| **focalPoint**               | 设置为 `false` 以在管理面板中禁用焦点选择工具。仅当 `imageSizes` 或 `resizeOptions` 定义时可用。 [更多](#) |
| **formatOptions**            | 包含 `format` 和 `options` 的对象，配合 Sharp 图像库格式化上传文件。 [更多](#) |
| **handlers**                 | 请求处理程序数组，在获取文件时执行。如果处理程序返回 `Response`，则直接发送给客户端，否则 Payload 将检索并返回文件。 |
| **imageSizes**               | 指定后，上传的图像将根据这些尺寸自动调整大小。 [更多](#)     |
| **mimeTypes**                | 限制文件选择器中的 `mimeType`，接受有效 `mimeType` 或 `mimeType` 通配符数组。 [更多](#) |
| **pasteURL**                 | 控制是否允许通过粘贴远程 URL 上传文件，默认启用。可设置为 `false` 禁用，或传递一个包含 `allowList` 的对象来限定允许的远程 URL。 |
| **resizeOptions**            | 传递给 Sharp 图像库的对象，用于调整上传文件的大小。 [更多](#) |
| **staticDir**                | 用于存储媒体的文件夹目录，可以是绝对路径或相对于包含配置文件的目录，默认使用集合的 `slug`。 |
| **trimOptions**              | 传递给 Sharp 图像库的对象，用于裁剪上传文件。 [更多](#)      |
| **withMetadata**             | 如果指定，将在输出图像文件中追加元数据。接受 `boolean` 值或一个接收 `metadata` 和 `req` 并返回 `boolean` 的函数。 |
| **hideFileInputOnCreate**    | 设置为 `true` 时，在创建文档时管理 UI 不显示文件输入框，适用于程序化文件生成。 |
| **hideRemoveFile**           | 设置为 `true` 时，在编辑文件时管理 UI 不提供删除已有文件的选项。 |

### 全局上传选项

上传选项可以针对每个集合单独配置，也可以在整个应用级别进行控制。在 `Payload` 的基础配置中，可以传递 `upload` 属性，其中包含支持所有 `Busboy` 配置选项的对象。

| **选项**               | **描述**                                                     |
| ---------------------- | ------------------------------------------------------------ |
| **abortOnLimit**       | `boolean` 值，如果为 `true`，当文件超过大小限制时返回 HTTP `413`。如果为 `false`，文件将被截断。默认值为 `false`。 |
| **createParentPath**   | 设置为 `true` 时，在将文件从临时目录或缓冲区移动时自动创建目录路径。默认值为 `false`。 |
| **debug**              | `boolean` 值，设置为 `true` 时开启上传过程的日志记录，适用于调试。默认值为 `false`。 |
| **limitHandler**       | 当文件大小超过配置的限制时调用的函数。                       |
| **parseNested**        | 设置为 `true` 时，将 `req.body` 和 `req.files` 解析为嵌套结构。默认情况下，它们是扁平对象。默认值为 `false`。 |
| **preserveExtension**  | 与 `safeFileNames` 选项配合使用，保留文件扩展名。如果为 `true`，则限制扩展名最多 3 个字符；如果是 `number`，则限制扩展名的自定义长度（从扩展名的开头截取）。 |
| **responseOnLimit**    | 当 `abortOnLimit` 启用且文件大小超限时，向客户端发送的响应字符串。 |
| **safeFileNames**      | 设置为 `true` 时，去除文件名中除 `-` 和 `_` 之外的所有非字母数字字符。也可以传递正则表达式来自定义要去除的字符。默认值为 `false`。 |
| **tempFileDir**        | 用于存储临时文件的目录路径，仅在 `useTempFiles` 选项设置为 `true` 时生效。默认值为 `'./tmp'`。 |
| **uploadTimeout**      | 以毫秒为单位定义等待数据的超时时间，超时后中止上传。设置为 `0` 可禁用超时检查。默认值为 `60000`（60 秒）。 |
| **uriDecodeFileNames** | 设置为 `true` 时，对文件名应用 URI 解码。默认值为 `false`。  |
| **useTempFiles**       | 设置为 `true` 时，将文件存储到临时目录，而不是 RAM，以减少大文件或大量文件的内存使用。 |

点击此处查看有关 `Busboy` 可控内容的更多文档。

一个常见的示例是，在 `Payload` 全局上传选项中，你可能希望自定义上传的最大 `fileSize` 限制。例如：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    {
      slug: 'media',
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
      upload: true,
    },
  ],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
})
```

### 通过 Hooks 自定义文件名

你可以使用 `beforeOperation` 钩子在文件上传到服务器之前自定义其文件名。

```javascript
beforeOperation: [
  ({ req, operation }) => {
    if ((operation === 'create' || operation === 'update') && req.file) {
      req.file.name = 'test.jpg'
    }
  },
],
```

`req.file` 对象包含关于文件的额外信息，例如 `mimeType`（MIME 类型）和 `extension`（文件扩展名），并且你可以完全访问文件数据。如果启用了 `imageSizes`（图片尺寸调整），自定义的文件名也会应用到这些调整后的图片。

## 图片尺寸调整

如果在上传配置中指定了 `imageSizes` 数组，Payload 将自动裁剪和调整上传的图片，使其符合配置中定义的尺寸。

管理面板还会自动显示每个上传文件的所有可用文件信息，包括宽度、高度和文件大小。

在后台，Payload 依赖 `sharp` 进行图片调整。你可以为 `sharp` 指定额外的选项，以便在调整图片时使用。

请注意，要使图片调整功能正常工作，必须在 Payload 配置中指定 `sharp`。如果你使用 `create-payload-app` 创建了 Payload 项目，则默认已配置 `sharp`。详细信息请参见配置选项中的 `sharp`。

### 在 Hooks 中访问调整后的图片

所有自动调整大小的图片都会通过一个对象暴露，以便在 hooks 等地方重新使用，该对象绑定在 `req.payloadUploadSizes` 上。

该对象将为每个生成的尺寸创建一个键，每个键的值将是一个包含文件数据的缓冲区。

### 处理图片放大

 当上传的图片小于定义的图片尺寸时，我们有 3 个选项：

**withoutEnlargement**: `undefined` | `false` | `true`

- `undefined` [默认]: 上传的图片如果宽度和高度都小于图片尺寸，则返回 `null`。
- `false`: 始终将图片放大到指定的图片尺寸。
- `true`: 如果图片小于指定的图片尺寸，则返回原始图片。

> [!NOTE]
>
> 默认情况下，当上传的图片小于定义的图片尺寸时，图片大小将返回 `NULL`。可以使用 `withoutEnlargement` 属性来更改此行为。

### 每个尺寸的自定义文件名

 每个图片尺寸都支持一个 `generateImageName` 函数，用于为调整后的图片生成自定义文件名。此函数接收以下参数：原始文件名、调整后的尺寸名称、文件扩展名、高度、宽度。

```javascript
{
  name: 'thumbnail',
  width: 400,
  height: 300,
  generateImageName: ({ height, sizeName, extension, width }) => {
    return `custom-${sizeName}-${height}-${width}.${extension}`
  },
}
```

## 裁剪和焦点选择器

此功能仅适用于图片文件类型。

在上传配置中设置 `crop: false` 和 `focalPoint: false` 将禁用管理面板中的相应选择器。

图片裁剪发生在任何尺寸调整之前，因此调整后的图片将从裁剪后的图片生成（而不是原始图片）。

如果未指定任何尺寸调整选项（如 `imageSizes` 或 `resizeOptions`），则焦点选择器将不会显示。

## 禁用本地上传存储

如果你使用插件将文件发送到第三方文件存储主机或 CDN（如 Amazon S3 或类似服务），你可能不希望在本地存储文件。你可以通过在集合的上传配置中指定 `disableLocalStorage: true` 来防止 Payload 将文件写入磁盘。

> [!NOTE]
>
> 这是一个相对高级的功能。如果禁用本地文件存储，默认情况下，你的管理面板的缩略图将无法显示，因为没有存储文件。你需要使用插件或自定义 hooks 来以永久方式存储文件，并通过 `upload.adminThumbnail` 提供自己的管理面板缩略图。

## 管理面板缩略图

你可以通过以下方式指定 Payload 如何为启用上传功能的集合获取管理面板缩略图：

1. `adminThumbnail` 作为字符串，等于你提供的某个图片尺寸名称。

```javascript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    adminThumbnail: 'small',
    imageSizes: [
      {
        name: 'small',
        fit: 'cover',
        height: 300,
        width: 900,
      },
      {
        name: 'large',
        fit: 'cover',
        height: 600,
        width: 1800,
      },
    ],
  },
}
```

2. `adminThumbnail` 设置为一个函数，该函数接受文档的数据并返回一个完整的 URL 来加载缩略图。

```javascript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    adminThumbnail: ({ doc }) =>
      `https://google.com/custom-path-to-file/${doc.filename}`,
  },
}
```

## MimeTypes

指定 `mimeTypes` 属性可以限制用户文件选择器允许选择的文件类型。它接受一个字符串数组，可以是任何有效的 mimetype 或 mimetype 通配符。

一些示例值包括：`image/*`、`audio/*`、`video/*`、`image/png`、`application/pdf`。

**示例 mimeTypes 使用：**

```javascript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'application/pdf'], 
  },
}
```

## 上传文件

> [!IMPORTANT]
>
> 由于 GraphQL 的工作方式，文件上传目前只能通过 REST 和本地 API 实现。通过 GraphQL 支持文件上传既困难又没有实际意义。

要上传文件，请使用你集合的创建端点。发送集合所需的所有数据，以及一个包含要上传文件的文件键。

请将请求作为 `multipart/form-data` 请求发送，尽可能使用 `FormData`。

```javascript
const fileInput = document.querySelector('#your-file-input')
const formData = new FormData()

formData.append('file', fileInput.files[0])

fetch('api/:upload-slug', {
  method: 'POST',
  body: formData,
  /**
   * Do not manually add the Content-Type Header
   * the browser will handle this.
   *
   * headers: {
   *  'Content-Type': 'multipart/form-data'
   * }
   */
})
```

## 上传本地存储的文件

如果你想直接上传存储在机器上的文件，举例来说，在种子脚本中使用 `payload.create` 方法，你可以使用 `filePath` 属性来指定文件的本地路径。

```javascript
const localFilePath = path.resolve(__dirname, filename)

await payload.create({
  collection: 'media',
  data: {
    alt,
  },
  filePath: localFilePath,
})
```

 `data` 属性仍然应包含你`media`集合所需的所有字段。

> [!IMPORTANT]
>
> 请记住，所有附加到媒体集合的自定义 hooks 仍然会被触发。确保文件符合集合的 `formatOptions` 或自定义 hooks 中定义的 mimeTypes 或尺寸要求。

## 从远程 URL 上传文件

 `pasteURL` 选项允许用户通过将远程 URL 粘贴到上传字段中来获取文件。此选项默认启用，可以配置为允许客户端无限制地获取文件，或将服务器端的获取限制为特定的可信域。

默认情况下，Payload 使用客户端获取方式，浏览器直接从提供的 URL 下载文件。然而，如果 URL 的服务器有 CORS 限制，客户端获取将会失败，因此这种方式仅适用于没有 CORS 阻止的内部 URL 或公共 URL。

为了从受限制的 URL 获取文件，避免因 CORS 限制而被阻止，可以通过配置 `pasteURL` 选项，并指定可信域的 `allowList`，来启用服务器端获取。这种方式确保 Payload 在服务器上下载文件，并将其流式传输到浏览器。然而，出于安全原因，只有与指定 `allowList` 匹配的 URL 才会被允许。

**配置示例**
以下是如何配置 `pasteURL` 选项来控制远程 URL 获取：

```javascript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    pasteURL: {
      allowList: [
        {
          hostname: 'payloadcms.com', // required
          pathname: '',
          port: '',
          protocol: 'https',
          search: ''
        },
        {
          hostname: 'example.com',
          pathname: '/images/*',
        },
      ],
    },
  },
}
```

**pasteURL 选项的可接受值**

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| `undefined` | 默认行为。启用客户端获取，适用于内部或公共 URL。             |
| `false`     | 禁用在上传字段中粘贴 URL 的功能。                            |
| `allowList` | 启用服务器端获取，仅允许特定的可信 URL。需要一个包含可信域的对象数组。详见下表中的 AllowItem。 |

**AllowItem 属性**

| 选项         | 描述                                                         | 示例        |
| ------------ | ------------------------------------------------------------ | ----------- |
| `hostname *` | 允许 URL 的主机名。此项为必填项，用于确保 URL 来自受信任的来源。 | example.com |
| `pathname`   | URL 的路径部分。支持使用通配符匹配多个路径。                 | /images/*   |
| `port`       | URL 的端口号。如果未指定，将使用协议的默认端口。             | 3000        |
| `protocol`   | 要匹配的协议。必须为 http 或 https，默认为 https。           | https       |
| `search`     | URL 的查询字符串。如果指定，URL 必须匹配此精确查询字符串。   | ?version=1  |

## 访问控制

所有上传到每个集合的文件自动支持该集合本身的读取访问控制功能。您可以使用此功能来控制谁可以查看您的上传文件，谁不能查看。