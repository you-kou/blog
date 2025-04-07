### API 密钥策略

为了与第三方 API 或服务集成，你可能需要具备生成 API 密钥的能力，这些 API 密钥可用于在 Payload 中标识为特定用户。API 密钥是基于每个用户生成的，类似于电子邮件和密码，并且代表单个用户。

例如，如果你有一个第三方服务或外部应用程序需要对 Payload 执行受保护的操作，首先你需要在 Payload 中创建一个用户，比如 dev@thirdparty.com。从你的外部应用程序中，你需要使用该用户进行身份验证，你有两种选择：

1. 每次都使用该用户登录，并获取一个会过期的令牌来进行请求。
2. 为该用户生成一个永不过期的 API 密钥来进行请求。

> [!TIP]
>
> 这一点特别有用，因为你可以创建一个 “用户”，它反映了与特定外部服务的集成，并为该服务 / 集成仅分配其所需的 “角色” 或特定访问权限。

从技术上讲，这两种选择对于第三方集成都可行，但第二种使用 API 密钥的选择更简单，因为它减少了你的集成在正确进行身份验证时所需的工作量。

要在集合上启用 API 密钥，将 `auth` 选项中的 `useAPIKey` 设置为 `true`。从那时起，在管理面板中，该集合内的每个文档都会出现一个新界面，允许你为集合中的每个用户生成一个 API 密钥。

```typescript
import type { CollectionConfig } from 'payload'

export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  auth: {
    useAPIKey: true, 
  },
  fields: [],
}
```

用户的 API 密钥在数据库中是加密的，这意味着即使你的数据库被攻破，你的 API 密钥也不会泄露。

> [!IMPORTANT]
>
> 如果你更改了 `PAYLOAD_SECRET`，则需要重新生成你的 API 密钥。
>
> 密钥用于加密 API 密钥，所以如果你更改了密钥，现有的 API 密钥将不再有效。

### HTTP 身份验证

若要使用 API 密钥对 REST 或 GraphQL API 请求进行身份验证，需设置 `Authorization` 请求头。该请求头区分大小写，其格式为：先写上启用了 `auth.useAPIKey` 的集合的 `slug`，接着是 `" API-Key "`，最后跟上分配的 API 密钥。之后，Payload 内置的中间件会将用户文档赋值给 `req.user`，并依据恰当的访问控制规则来处理请求。通过这种方式，Payload 会将该请求识别为由与该 API 密钥关联的用户发起的请求。

例如，使用 `fetch` 方法时：

```javascript
import Users from '../collections/Users'

const response = await fetch('http://localhost:3000/api/pages', {
  headers: {
    Authorization: `${Users.slug} API-Key ${YOUR_API_KEY}`,
  },
})
```

Payload 确保在所有身份验证策略中使用相同且统一的访问控制规则。这使得你既可以在使用 API 密钥时，也能在使用标准的电子邮件 / 密码身份验证时，复用现有的访问控制配置。这种一致性有助于你对 API 密钥进行细致的访问控制管理。

### 仅使用 API 密钥进行身份验证

若你希望将 API 密钥作为某个集合的唯一身份验证方式，可在集合的 `auth` 属性中把 `disableLocalStrategy` 设置为 `true`，以此禁用默认的本地身份验证策略。这样一来，用户将无法使用电子邮件和密码进行身份验证，只能通过 API 密钥进行身份验证。

```typescript
import type { CollectionConfig } from 'payload'

export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true, 
  },
}
```