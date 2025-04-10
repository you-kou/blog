# 自定义认证策略

> [!NOTE]
>
> 这是一个高级功能，因此只有在您是经验丰富的开发者时才建议尝试此功能。否则，建议让 Payload 的内置认证系统处理用户认证。

## 创建策略

本质上，策略是一种验证请求用户身份的方式。从 3.0 版本开始，我们放弃了 Passport，转而完全交由您掌控认证过程。

一个策略由以下部分组成：

| 参数             | 描述                                                |
| ---------------- | --------------------------------------------------- |
| `name` *         | 策略的名称                                          |
| `authenticate` * | 一个函数，接受以下参数并返回一个用户对象或 `null`。 |

`authenticate` 函数接受以下参数：

| 参数        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| `headers` * | 传入请求的头部信息。用于从请求中提取可识别的用户信息。       |
| `payload` * | Payload 类。用于将请求中的可识别信息与 Payload 进行身份验证。 |
| `isGraphQL` | 请求是否来自 GraphQL 接口。默认为 `false`。                  |

## 示例策略

从本质上讲，策略仅仅是从传入请求中提取信息，并返回一个用户。这与 Payload 内置的策略功能完全相同。

您的 `authenticate` 方法应该返回一个包含 Payload 用户文档的对象，以及您希望 Payload 在返回响应时为您设置的任何可选头部信息。

```javascript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'custom-strategy',
        authenticate: ({ payload, headers }) => {
          const usersQuery = await payload.find({
            collection: 'users',
            where: {
              code: {
                equals: headers.get('code'),
              },
              secret: {
                equals: headers.get('secret'),
              },
            },
          })

          return {
            // Send the user with the collection slug back to authenticate,
            // or send null if no user should be authenticated
            user: usersQuery.docs[0] ? {
              collection: 'users'
              ...usersQuery.docs[0],
            } : null,

            // Optionally, you can return headers
            // that you'd like Payload to set here when
            // it returns the response
            responseHeaders: new Headers({
              'some-header': 'my header value'
            })
          }
        }
      }
    ]
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      index: true,
      unique: true,
    },
    {
      name: 'secret',
      type: 'text',
    },
  ]
}
```

