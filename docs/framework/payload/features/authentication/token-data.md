# 令牌数据

在请求生命周期期间，您可以通过访问 `req.user` 来访问您配置存储在 JWT 中的数据。用户对象会自动附加到请求中。

## 定义令牌数据

您可以通过在认证集合中的字段上设置 `saveToJWT` 属性来指定哪些数据将被编码到 Cookie / JWT 令牌中。

```javascript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      // will be stored in the JWT
      saveToJWT: true,
      type: 'select',
      name: 'role',
      options: ['super-admin', 'user'],
    },
    {
      // the entire object will be stored in the JWT
      // tab fields can do the same thing!
      saveToJWT: true,
      type: 'group',
      name: 'group1',
      fields: [
        {
          type: 'text',
          name: 'includeField',
        },
        {
          // will be omitted from the JWT
          saveToJWT: false,
          type: 'text',
          name: 'omitField',
        },
      ],
    },
    {
      type: 'group',
      name: 'group2',
      fields: [
        {
          // will be stored in the JWT
          // but stored at the top level
          saveToJWT: true,
          type: 'text',
          name: 'includeField',
        },
        {
          type: 'text',
          name: 'omitField',
        },
      ],
    },
  ],
}
```

> [!TIP]
>
> 如果您希望使用与字段名不同的键，可以将 `saveToJWT` 定义为一个字符串。

## 使用令牌数据

当编写依赖于用户定义字段的钩子和访问控制时，这尤其有用。

```javascript
import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  access: {
    read: ({ req, data }) => {
      if (!req?.user) return false
      if ({ req.user?.role === 'super-admin'}) {
        return true
      }
      return data.owner === req.user.id
    }
  }
  fields: [
    {
      name: 'owner',
      relationTo: 'users'
    },
    // ... other fields
  ],
}
```

