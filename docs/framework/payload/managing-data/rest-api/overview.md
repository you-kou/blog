# REST API

REST API 是一个功能完备的 HTTP 客户端，允许您以 RESTful 方式与文档交互。它支持所有 CRUD 操作，并具备自动分页、深度填充和排序功能。所有 Payload API 路由都会挂载并前缀到您的配置 `routes.api` URL 片段（默认值：`/api`）。

REST 查询参数：

- **depth** - 自动填充关系字段和上传内容
- **locale** - 获取特定语言区域的文档
- **fallback-locale** - 指定在 `locale` 值不存在时使用的备用语言区域
- **select** - 指定结果中包含的字段
- **populate** - 指定从关联文档中填充的字段
- **limit** - 限制返回的文档数量
- **page** - 配合 `limit` 使用，指定获取的分页数据
- **sort** - 指定用于排序的字段
- **where** - 指定用于查询文档的高级筛选条件
- **joins** - 指定每个关联字段的自定义请求（根据字段名称）

## 集合（Collections）

每个集合都会使用其 `slug` 值进行挂载。例如，如果某个集合的 `slug` 为 `users`，则所有相关路由都会挂载到 `/api/users`。

**注意**：集合的 `slug` 必须采用 **kebab-case** 格式。

所有 CRUD 操作的路由如下：

| 操作           | 方法   | 路径                           |
| -------------- | ------ | ------------------------------ |
| **查找**       | GET    | `/api/{collection-slug}`       |
| **按 ID 查找** | GET    | `/api/{collection-slug}/{id}`  |
| **统计**       | GET    | `/api/{collection-slug}/count` |
| **创建**       | POST   | `/api/{collection-slug}`       |
| **更新**       | PATCH  | `/api/{collection-slug}`       |
| **按 ID 更新** | PATCH  | `/api/{collection-slug}/{id}`  |
| **删除**       | DELETE | `/api/{collection-slug}`       |
| **按 ID 删除** | DELETE | `/api/{collection-slug}/{id}`  |

## 认证操作（Auth Operations）

启用了认证（Auth）的集合还会提供以下端点：

| 操作         | 方法 | 路径                                     |
| ------------ | ---- | ---------------------------------------- |
| **登录**     | POST | `/api/{user-collection}/login`           |
| **登出**     | POST | `/api/{user-collection}/logout`          |
| **解锁账户** | POST | `/api/{user-collection}/unlock`          |
| **刷新令牌** | POST | `/api/{user-collection}/refresh-token`   |
| **验证用户** | POST | `/api/{user-collection}/verify/{token}`  |
| **当前用户** | GET  | `/api/{user-collection}/me`              |
| **忘记密码** | POST | `/api/{user-collection}/forgot-password` |
| **重置密码** | POST | `/api/{user-collection}/reset-password`  |

## 全局（Globals）

全局对象不能被创建或删除，因此仅提供以下两个 REST 端点：

| 操作         | 方法 | 路径                         |
| ------------ | ---- | ---------------------------- |
| **获取全局** | GET  | `/api/globals/{global-slug}` |
| **更新全局** | POST | `/api/globals/{global-slug}` |

## 偏好设置（Preferences）

除了上述动态生成的端点外，Payload 还提供 REST 端点来管理与认证用户相关的数据的管理员用户偏好设置。

| 操作     | 方法   | 路径                           |
| -------- | ------ | ------------------------------ |
| 获取偏好 | GET    | /api/payload-preferences/{key} |
| 创建偏好 | POST   | /api/payload-preferences/{key} |
| 删除偏好 | DELETE | /api/payload-preferences/{key} |

## 自定义端点

通过在 Payload 配置中的多个位置提供端点数组，可以向您的应用程序添加额外的 REST API 端点。自定义端点对于在现有路由上添加额外的中间件，或为 Payload 应用程序和插件构建自定义功能非常有用。端点可以在 Payload 配置、集合和全局设置的顶部添加，并根据您配置的 API 和 Slug 进行访问。

> [!NOTE]
>
> 自定义端点默认不进行身份验证。您需要负责保护自己的端点。

每个端点对象需要包含：

| 属性    | 描述                                                         |
| ------- | ------------------------------------------------------------ |
| path    | 在集合或全局 Slug 后的端点路由的字符串                       |
| method  | 要使用的小写 HTTP 动词：'get'、'head'、'post'、'put'、'delete'、'connect' 或 'options' |
| handler | 一个函数，接受 req - PayloadRequest 对象，该对象包含 Web 请求属性、当前认证的用户和 Local API 实例 payload。 |
| root    | 当为 true 时，定义根 Next.js 应用上的端点，绕过 Payload 处理程序和 routes.api 子路径。注意：这仅适用于 Payload 配置的顶级端点，在集合或全局上定义的端点不能是根端点。 |
| custom  | 用于添加自定义数据的扩展点（例如用于插件）                   |

示例：

```javascript
import type { CollectionConfig } from 'payload'

// a collection of 'orders' with an additional route for tracking details, reachable at /api/orders/:id/tracking
export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    /* ... */
  ],
  endpoints: [
    {
      path: '/:id/tracking',
      method: 'get',
      handler: async (req) => {
        const tracking = await getTrackingInfo(req.routeParams.id)

        if (!tracking) {
          return Response.json({ error: 'not found' }, { status: 404 })
        }

        return Response.json({
          message: `Hello ${req.routeParams.name as string} @ ${req.routeParams.group as string}`,
        })
      },
    },
    {
      path: '/:id/tracking',
      method: 'post',
      handler: async (req) => {
        // `data` is not automatically appended to the request
        // if you would like to read the body of the request
        // you can use `data = await req.json()`
        const data = await req.json()
        await req.payload.update({
          collection: 'tracking',
          data: {
            // data to update the document with
          },
        })
        return Response.json({
          message: 'successfully updated tracking info',
        })
      },
    },
    {
      path: '/:id/forbidden',
      method: 'post',
      handler: async (req) => {
        // this is an example of an authenticated endpoint
        if (!req.user) {
          return Response.json({ error: 'forbidden' }, { status: 403 })
        }

        // do something

        return Response.json({
          message: 'successfully updated tracking info',
        })
      },
    },
  ],
}
```

> [!NOTE]
>
> `req` 将包含 `payload` 对象，可以在端点处理程序中使用，例如调用 `req.payload.find()`，该调用将利用访问控制和钩子。

### 有用的提示

`req.data`
数据不会自动附加到请求中。您可以通过调用 `await req.json()` 来读取请求体数据。

或者，您可以使用我们的辅助函数，它会修改请求并在找到数据和文件时将其附加。

```javascript
import { addDataAndFileToRequest } from 'payload'

// custom endpoint example
{
  path: '/:id/tracking',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)
    await req.payload.update({
      collection: 'tracking',
      data: {
        // data to update the document with
      }
    })
    return Response.json({
      message: 'successfully updated tracking info'
    })
  }
}
```

`req.locale` 和 `req.fallbackLocale`
语言环境和回退语言环境不会自动附加到自定义端点请求中。如果您希望添加它们，可以使用此辅助函数。

```javascript
import { addLocalesToRequestFromData } from 'payload'

// custom endpoint example
{
  path: '/:id/tracking',
  method: 'post',
  handler: async (req) => {
    await addLocalesToRequestFromData(req)
    // you now can access req.locale & req.fallbackLocale
    return Response.json({ message: 'success' })
  }
}
```

`headersWithCors`
默认情况下，自定义端点不会处理响应中的 CORS 头信息。`headersWithCors` 函数检查 Payload 配置，并相应地在响应中设置适当的 CORS 头信息。

```javascript
import { headersWithCors } from 'payload'

// custom endpoint example
{
  path: '/:id/tracking',
  method: 'post',
  handler: async (req) => {
    return Response.json(
      { message: 'success' },
      {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        })
      },
    )
  }
}
```

## GET 请求的 Method Override

Payload 支持一个方法覆盖功能，允许您使用 HTTP POST 方法发送 GET 请求。在常规 GET 请求中的查询字符串过长时，这尤其有用。

### 如何使用

要使用此功能，请在您的 POST 请求中包含 `X-HTTP-Method-Override` 头，并将其设置为 GET。参数应通过请求体发送，并将 `Content-Type` 设置为 `application/x-www-form-urlencoded`。

### 示例

下面是使用方法覆盖执行 GET 请求的示例：

#### 使用方法覆盖（POST）

```javascript
const res = await fetch(`${api}/${collectionSlug}`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Accept-Language': i18n.language,
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-HTTP-Method-Override': 'GET',
  },
  body: qs.stringify({
    depth: 1,
    locale: 'en',
  }),
})
```

#### 等效的常规 GET 请求

```javascript
const res = await fetch(`${api}/${collectionSlug}?depth=1&locale=en`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Accept-Language': i18n.language,
  },
})
```

