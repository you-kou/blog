# 认证概述

<iframe width="668" height="375" src="https://www.youtube.com/embed/CT4KafeJjTI" title="Simplified Authentication for Headless CMS: Unlocking Reusability in One Line" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

认证是任何应用程序中的关键部分。Payload 提供了一种安全、便捷的方式来管理用户账户，开箱即用。Payload 认证旨在同时用于管理面板和您自己的外部应用程序，完全消除了对付费第三方平台和服务的需求。

以下是一些在您自己的应用程序中使用认证的常见场景：

- 电子商务应用的客户账户
- SaaS 产品的用户账户
- 用户需要登录并管理其个人资料的 P2P 应用或社交网站
- 玩家需要跟踪游戏进度的在线游戏

当在某个集合上启用认证时，Payload 会注入所有必要的功能以支持完整的用户流程。这包括所有与认证相关的操作，如账户创建、登录和登出、重置密码，所有与认证相关的电子邮件，如电子邮件验证和密码重置，以及管理面板中管理用户所需的任何 UI。

要在集合上启用认证，请在集合配置中使用 auth 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  // ...
  auth: true, 
}
```

![Authentication Admin Panel functionality](https://payloadcms.com/images/docs/auth-admin.jpg)

*管理面板截图，展示启用认证的管理员集合。*

## 配置选项

任何集合都可以选择支持认证。一旦启用，集合中创建的每个文档都可以被视为一个“用户”。这将为您的集合启用完整的认证工作流，如登录、登出、重置密码等。

> [!NOTE]
>
> 默认情况下，Payload 提供了一个启用认证的用户集合，用于访问管理面板。更多细节。

要在集合中启用认证，请在集合配置中使用 `auth` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  // ...
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    // More options are available
  },
}
```

> [!TIP]
>
> 要使用默认的认证行为，请设置 `auth: true`。这对于大多数应用程序来说是一个良好的起点。

> [!NOTE]
>
> 启用认证的集合将自动注入 `hash`、`salt` 和 `email` 字段。更多细节。

以下是可用的配置选项：

| 选项                         | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| **cookies**                  | 设置 cookie 选项，包括 secure、sameSite 和 domain。适用于高级用户。 |
| **depth**                    | 设置在创建 JWT 并将用户绑定到请求时，用户文档应填充的深度级别。默认为 0，除非绝对必要，否则不建议修改，因为这会影响性能。 |
| **disableLocalStrategy**     | 高级选项 - 禁用 Payload 内置的本地认证策略。仅在您用自己的认证机制替换 Payload 的认证机制时使用此属性。 |
| **forgotPassword**           | 自定义 `forgotPassword` 操作的功能。更多细节。               |
| **lockTime**                 | 设置用户因认证失败次数超过 `maxLoginAttempts` 所允许的次数后锁定的时间（以毫秒为单位）。 |
| **loginWithUsername**        | 允许用户通过用户名/密码登录的功能。更多细节。                |
| **maxLoginAttempts**         | 允许用户登录的最大尝试次数。如果超过此限制，系统会自动锁定用户，禁止其继续认证。设置为 0 可禁用此功能。 |
| **removeTokenFromResponses** | 如果您希望从返回的认证 API 响应中删除 token（如登录或刷新响应），请将其设置为 true。 |
| **strategies**               | 高级选项 - 用于扩展此集合认证的自定义认证策略的数组。更多细节。 |
| **tokenExpiration**          | 设置用户保持登录状态的时间（以秒为单位）。JWT 和 HTTP-only cookie 会同时过期。 |
| **useAPIKey**                | Payload 认证提供为每个用户设置 API 密钥的功能，适用于启用认证的集合。更多细节。 |
| **verify**                   | 设置为 true 或传递一个包含验证选项的对象，要求用户在允许登录之前通过电子邮件进行验证。更多细节。 |

### 使用用户名登录

您可以通过将 `loginWithUsername` 属性设置为 `true`，允许用户使用用户名而不是电子邮件地址进行登录。

示例：

```javascript
{
  slug: 'customers',
  auth: {
    loginWithUsername: true,
  },
}
```

或者，您可以传递一个包含附加选项的对象：

```javascript
{
  slug: 'customers',
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
  },
}
```

**`allowEmailLogin`**

如果设置为 `true`，用户可以使用用户名或电子邮件地址登录；如果设置为 `false`，用户只能使用用户名登录。

**`requireEmail`**

如果设置为 `true`，创建新用户时必须提供电子邮件地址；如果设置为 `false`，创建用户时不要求电子邮件。

## 自动登录

在测试和演示环境中，您可能希望跳过强制用户登录的步骤，以便更快地访问您的应用程序。通常，所有用户都应被要求登录，但在本地开发过程中，可以通过启用自动登录来加快调试速度。

要启用自动登录，请在 **Payload 配置** 中设置 `autoLogin` 属性：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  autoLogin:
    process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
      ? {
          email: 'test@example.com',
          password: 'test',
          prefillOnly: true,
        }
      : false,
})
```

> [!WARNING]
>
> 推荐的使用此功能的方法是通过环境变量控制。这将确保在生产环境中该功能被禁用。

以下是可用的选项：

| 选项            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| **username**    | 要登录的用户的用户名                                         |
| **email**       | 要登录的用户的电子邮件地址                                   |
| **password**    | 要登录的用户的密码。仅在 `prefillOnly` 设置为 `true` 时需要。 |
| **prefillOnly** | 如果设置为 `true`，登录凭据将被自动填充，但用户仍需点击登录按钮。 |

## 操作

所有与认证相关的操作都可以通过 Payload 的 REST、Local 和 GraphQL API 进行访问。启用认证后，这些操作会自动添加到您的集合中。更多细节。

## 策略

 Payload 默认提供三种强大的认证策略：

- **仅限 HTTP Cookie**
- **JSON Web Tokens (JWT)**
- **API 密钥**

这些策略可以一起使用，也可以单独使用。您还可以创建自己的自定义策略，以满足特定需求。更多细节。

### 仅限 HTTP Cookie

仅限 HTTP Cookie 是一种高度安全的方法，用于将可识别的数据存储在用户的设备上，以便 Payload 可以自动识别回访用户，直到他们的 cookie 过期。与 JWT 不同，HTTP-only cookies 完全受到常见的 XSS 攻击保护，且不能被浏览器中的 JavaScript 读取。更多细节。

### JSON Web Tokens

JWT（JSON Web Tokens）也可用于执行身份验证。在用户登录、刷新令牌和 `me` 操作时生成令牌，并可在后续请求中附加该令牌以进行用户身份验证。更多细节。

### API 密钥

可以在认证集合上启用 API 密钥。当您希望从第三方服务对 Payload 进行身份验证时，API 密钥非常有用。更多细节。

### 自定义策略

在某些情况下，这些默认策略可能不足以满足您的应用需求。Payload 具有可扩展性，因此当需要时，您可以接入自己的策略。更多细节。