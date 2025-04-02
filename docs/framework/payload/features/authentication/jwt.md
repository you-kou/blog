# JWT 策略

Payload 提供了通过 JSON Web Tokens (JWT) 进行身份验证的功能。这些令牌可以从登录、登出、刷新和 `me` 认证操作的响应中读取。

> [!TIP]
>
> 您可以通过 `req.user` 参数在访问控制和钩子中访问已登录的用户。更多细节。

## 通过授权头识别用户

除了通过 HTTP-only cookie 进行身份验证外，您还可以通过 HTTP 请求中的 Authorization 头来识别用户。

示例：

```javascript
const user = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'dev@payloadcms.com',
    password: 'password',
  }),
}).then((req) => await req.json())

const request = await fetch('http://localhost:3000', {
  headers: {
    Authorization: `JWT ${user.token}`,
  },
})
```

## 省略令牌

在某些情况下，您可能希望防止令牌从认证操作中返回。您可以通过将 `removeTokenFromResponse` 设置为 `true` 来实现，示例如下：

```javascript
import type { CollectionConfig } from 'payload'

export const UsersWithoutJWTs: CollectionConfig = {
  slug: 'users-without-jwts',
  auth: {
    removeTokenFromResponse: true, 
  },
}
```

