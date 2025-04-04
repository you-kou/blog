# 本地 API

Payload 本地 API 允许您在 Node 服务器上直接执行与 REST 和 GraphQL 相同的操作。在这里，您无需处理服务器延迟或网络速度问题，可以直接与数据库交互。

> [!TIP]
>
> 本地 API 在 React Server Components 和其他类似的服务器端环境中非常强大。对于其他无头 CMS，您需要通过 HTTP 层向第三方服务器请求数据，这可能会显著增加服务器渲染页面的加载时间。而在 Payload 中，您无需离开服务器即可获取所需数据，速度极快，绝对是一个革命性的改变。

以下是一些使用本地 API 的常见示例：

- 在 React Server Components 中获取 Payload 数据
- 通过 Node 种子脚本（seed scripts）批量导入数据
- 开启自定义 Next.js 路由处理程序，添加额外功能的同时仍依赖 Payload
- 在访问控制（Access Control）和钩子（Hooks）中使用

## 访问 Payload

您可以通过两种方式访问当前运行的 Payload 对象：

### 从参数（args）或请求（req）中访问

在 Payload 内部的大多数地方，例如 Hooks（钩子）、访问控制（Access Control）、验证函数等，您可以直接从函数参数中访问 `payload`。这通常是最简单的方法。大多数配置函数都会接收 `req`（请求对象），而 `req` 绑定了 `payload`，因此可以通过 `req.payload` 访问它。

示例：

```javascript
const afterChangeHook: CollectionAfterChangeHook = async ({
  req: { payload },
}) => {
  const posts = await payload.find({
    collection: 'posts',
  })
}
```

### 导入 Payload

如果您需要在无法通过函数参数或 `req` 访问 `payload` 的地方使用它，可以直接导入并初始化 Payload。

```javascript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
```

如果您在 Next.js 的开发模式下工作，Payload 将支持热模块替换（HMR）。当您对 Payload 配置进行更改时，Payload 的使用方式将始终与您的更改保持同步。在生产环境中，`getPayload` 会自动禁用所有 HMR 功能，因此您无需更改代码，我们会在生产模式下为您优化处理。

如果您通过函数参数或 `req.payload` 访问 Payload，并在 Next.js 中使用它，则 HMR 将自动受到支持。

有关在 Next.js 之外使用 Payload 的更多信息，请点击这里。

## 本地 API 可用选项

相比于 REST 或 GraphQL，您可以在本地 API 中指定更多选项，因为它们仅在服务器端执行。

| 选项                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **collection**         | **必填**，适用于集合操作。指定要操作的集合标识（slug）。     |
| **data**               | 用于操作的数据。`create` 和 `update` 操作必填。              |
| **depth**              | 控制自动填充嵌套关系和上传字段的深度。                       |
| **locale**             | 指定返回文档的语言区域。                                     |
| **select**             | 指定返回结果中包含哪些字段。                                 |
| **populate**           | 指定从关联文档中填充哪些字段。                               |
| **fallbackLocale**     | 指定返回文档时使用的备用语言区域。                           |
| **overrideAccess**     | 跳过访问控制。默认情况下，此属性在所有本地 API 操作中设为 `true`。 |
| **overrideLock**       | 默认情况下，文档锁被忽略（`true`）。设置为 `false` 时，会强制遵守锁定状态，防止其他用户操作已锁定的文档。 |
| **user**               | 如果 `overrideAccess` 设为 `false`，则可以传递用户对象以用于访问控制检查。 |
| **showHiddenFields**   | 允许返回隐藏字段。默认情况下，返回的文档会根据配置隐藏这些字段。 |
| **pagination**         | 设为 `false` 以返回所有文档，并避免查询文档总数。            |
| **context**            | 传递 `context`，它将被传递到 `context` 和 `req.context`，可供钩子读取。例如，您可以传递 `triggerBeforeChange` 选项，让 `BeforeChange` 钩子决定是否运行。 |
| **disableErrors**      | 设为 `true` 时，错误不会抛出。`findByID` 操作返回 `null`，`find` 操作返回空的 `documents` 数组。 |
| **disableTransaction** | 设为 `true` 时，不会初始化数据库事务。                       |

此外，每个具体操作可能还有其他可用选项，详情请参考相关文档。

## 事务

当您的数据库使用事务时，您需要将 `req` 传递给所有本地操作。**PostgreSQL** 默认使用事务，**MongoDB** 在使用**副本集（replica set）**时支持事务。

即使不使用事务，传递 `req` 仍然是推荐的做法。

```javascript
const post = await payload.find({
  collection: 'posts',
  req, // passing req is recommended
})
```

> [!NOTE]
>
> 默认情况下，本地 API（Local API）会**禁用所有访问控制检查**，但如果需要，您可以**重新启用访问控制**，并指定特定的用户来执行操作。

## 集合

以下集合操作可通过本地 API 进行：

### 创建

```javascript
// The created Post document is returned
const post = await payload.create({
  collection: 'posts', // required
  data: {
    // required
    title: 'sure',
    description: 'maybe',
  },
  locale: 'en',
  fallbackLocale: false,
  user: dummyUserDoc,
  overrideAccess: true,
  showHiddenFields: false,

  // If creating verification-enabled auth doc,
  // you can optionally disable the email that is auto-sent
  disableVerificationEmail: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, './path-to-image.jpg'),

  // Alternatively, you can directly pass a File,
  // if file is provided, filePath will be omitted
  file: uploadedFile,

  // If you want to create a document that is a duplicate of another document
  duplicateFromID: 'document-id-to-duplicate',
})
```

### 查找

```javascript
// Result will be a paginated set of Posts.
// See /docs/queries/pagination for more.
const result = await payload.find({
  collection: 'posts', // required
  depth: 2,
  page: 1,
  limit: 10,
  pagination: false, // If you want to disable pagination count, etc.
  where: {}, // pass a `where` query here
  sort: '-title',
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 通过 ID 查找

```javascript
// Result will be a Post document.
const result = await payload.findByID({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 计数

```javascript
// Result will be an object with:
// {
//   totalDocs: 10, // count of the documents satisfies query
// }
const result = await payload.count({
  collection: 'posts', // required
  locale: 'en',
  where: {}, // pass a `where` query here
  user: dummyUser,
  overrideAccess: false,
})
```

### 通过 ID 更新

```javascript
// Result will be the updated Post document.
const result = await payload.update({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  data: {
    // required
    title: 'sure',
    description: 'maybe',
  },
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, './path-to-image.jpg'),

  // If you are uploading a file and would like to replace
  // the existing file instead of generating a new filename,
  // you can set the following property to `true`
  overwriteExistingFiles: true,
})
```

### 更新多个

```javascript
// Result will be an object with:
// {
//   docs: [], // each document that was updated
//   errors: [], // each error also includes the id of the document
// }
const result = await payload.update({
  collection: 'posts', // required
  where: {
    // required
    fieldName: { equals: 'value' },
  },
  data: {
    // required
    title: 'sure',
    description: 'maybe',
  },
  depth: 0,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, './path-to-image.jpg'),

  // If you are uploading a file and would like to replace
  // the existing file instead of generating a new filename,
  // you can set the following property to `true`
  overwriteExistingFiles: true,
})
```

### 删除

```javascript
// Result will be the now-deleted Post document.
const result = await payload.delete({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

### 删除多个

```javascript
// Result will be an object with:
// {
//   docs: [], // each document that is now deleted
//   errors: [], // any errors that occurred, including the id of the errored on document
// }
const result = await payload.delete({
  collection: 'posts', // required
  where: {
    // required
    fieldName: { equals: 'value' },
  },
  depth: 0,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

## 认证操作

如果一个集合启用了认证，将会提供额外的本地 API 操作：

### 认证

```javascript
// If you're using Next.js, you'll have to import headers from next/headers, like so:
// import { headers as nextHeaders } from 'next/headers'

// you'll also have to await headers inside your function, or component, like so:
// const headers = await nextHeaders()

// If you're using Payload outside of Next.js, you'll have to provide headers accordingly.

// result will be formatted as follows:
// {
//    permissions: { ... }, // object containing current user's permissions
//    user: { ... }, // currently logged in user's document
//    responseHeaders: { ... } // returned headers from the response
// }

const result = await payload.auth({ headers })
```

### 登录

```javascript
// result will be formatted as follows:
// {
//   token: 'o38jf0q34jfij43f3f...', // JWT used for auth
//   user: { ... } // the user document that just logged in
//   exp: 1609619861 // the UNIX timestamp when the JWT will expire
// }

const result = await payload.login({
  collection: 'users', // required
  data: {
    // required
    email: 'dev@payloadcms.com',
    password: 'rip',
  },
  req: req, // optional, pass a Request object to be provided to all hooks
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 忘记密码

```javascript
// Returned token will allow for a password reset
const token = await payload.forgotPassword({
  collection: 'users', // required
  data: {
    // required
    email: 'dev@payloadcms.com',
  },
  req: req, // pass a Request object to be provided to all hooks
})
```

### 重置密码

```javascript
// Result will be formatted as follows:
// {
//   token: 'o38jf0q34jfij43f3f...', // JWT used for auth
//   user: { ... } // the user document that just logged in
// }
const result = await payload.resetPassword({
  collection: 'users', // required
  data: {
    // required
    password: req.body.password, // the new password to set
    token: 'afh3o2jf2p3f...', // the token generated from the forgotPassword operation
  },
  req: req, // optional, pass a Request object to be provided to all hooks
})
```

### 解锁

```javascript
// Returned result will be a boolean representing success or failure
const result = await payload.unlock({
  collection: 'users', // required
  data: {
    // required
    email: 'dev@payloadcms.com',
  },
  req: req, // optional, pass a Request object to be provided to all hooks
  overrideAccess: true,
})
```

### 验证

```javascript
// Returned result will be a boolean representing success or failure
const result = await payload.verifyEmail({
  collection: 'users', // required
  token: 'afh3o2jf2p3f...', // the token saved on the user as `_verificationToken`
})
```

## 全局

以下是通过本地 API 提供的全局操作：

### 查找

```javascript
// Result will be the Header Global.
const result = await payload.findGlobal({
  slug: 'header', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 更新

```javascript
// Result will be the updated Header Global.
const result = await payload.updateGlobal({
  slug: 'header', // required
  data: {
    // required
    nav: [
      {
        url: 'https://google.com',
      },
      {
        url: 'https://payloadcms.com',
      },
    ],
  },
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

## TypeScript

本地 API 调用将自动推断生成的类型。

以下是使用示例：

```javascript
// Properly inferred as `Post` type
const post = await payload.create({
  collection: 'posts',

  // Data will now be typed as Post and give you type hints
  data: {
    title: 'my title',
    description: 'my description',
  },
})
```

