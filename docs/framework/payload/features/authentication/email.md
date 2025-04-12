# 认证邮件

Payload 的认证功能与其提供的邮件功能直接关联。这使您能够向用户发送验证邮件、密码重置邮件等。虽然 Payload 提供了这些操作的默认邮件模板，但您可以根据自己的品牌进行自定义。

## 邮箱验证

邮箱验证要求用户证明他们确实可以访问其用于认证的邮箱地址。这有助于减少垃圾账户，并确保用户身份的真实性。

要启用邮箱验证，请在集合配置中使用 `auth.verify` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: true, 
  },
}
```

可用选项如下：

| 选项                   | 描述                                               |
| ---------------------- | -------------------------------------------------- |
| `generateEmailHTML`    | 允许自定义发送给用户的验证账户邮件中的 HTML 内容。 |
| `generateEmailSubject` | 允许自定义发送给用户的验证账户邮件的主题。         |

### `generateEmailHTML`

 一个接受包含 `{ req, token, user }` 的参数的函数，用于自定义发送给用户的验证账户邮件中的 HTML 内容。该函数应返回一个支持 HTML 的字符串，该字符串也可以是完整的 HTML 邮件。

```javascript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: {
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url = `https://yourfrontend.com/verify?token=${token}`

        return `Hey ${user.email}, verify your email by clicking here: ${url}`
      },
    },
  },
}
```

> [!IMPORTANT]
>
> 如果您为用户指定了一个不同的邮箱验证跳转链接，例如应用前端的某个页面或类似地址，那么您需要在前端自行调用 Payload 的 REST 或 GraphQL 验证接口，使用提供给您的 token。上述示例中，token 是通过查询参数传递的。

### `generateEmailSubject`

与上面的 `generateEmailHTML` 类似，您也可以自定义验证邮件的主题。该函数的参数相同，即 `{ req, token, user }`，但只能返回一个字符串，不能返回 HTML。

```javascript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: {
      generateEmailSubject: ({ req, user }) => {
        return `Hey ${user.email}, reset your password!`
      },
    },
  },
}
```

## 忘记密码

您可以通过设置 `auth.forgotPassword` 属性来自定义“忘记密码”流程的行为，可用的选项如下：

```javascript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      
      // ...
    },
  },
}
```

可用选项如下：

| 选项                   | 描述                                                   |
| ---------------------- | ------------------------------------------------------ |
| `expiration`           | 配置密码重置令牌的有效时间，单位为毫秒。               |
| `generateEmailHTML`    | 允许自定义发送给尝试重置密码用户的邮件中的 HTML 内容。 |
| `generateEmailSubject` | 允许自定义发送给尝试重置密码用户的邮件主题。           |

### `generateEmailHTML`

此函数允许自定义发送给尝试重置密码用户的邮件中的 HTML 内容。该函数应返回一个支持 HTML 的字符串，可以是完整的 HTML 邮件。

```javascript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `https://yourfrontend.com/reset-password?token=${token}`

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Here is my custom email template!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `
      },
    },
  },
}
```

> [!IMPORTANT]
>
> 如果您为用户指定了一个用于重置密码的自定义链接地址，例如应用前端的某个页面，那么您需要在前端自行调用 Payload 的 REST 或 GraphQL `reset-password` 接口，并使用提供的 token。上述示例中，token 是通过查询参数传递的。

> [!TIP]
>
> 可以使用 HTML 模板来自定义邮件模板，自动内联 CSS 等。您可以编写一个可复用的函数来标准化 Payload 发送的所有邮件，从而实现更高效的邮件管理（更符合 DRY 原则）。Payload 不内置 HTML 模板引擎，因此您可以自由选择使用的引擎。

以下参数会传递给 `generateEmailHTML` 函数：

| 参数    | 描述                             |
| ------- | -------------------------------- |
| `req`   | 请求对象。                       |
| `token` | 为用户生成的用于重置密码的令牌。 |
| `user`  | 尝试重置密码的用户文档。         |

### `generateEmailSubject`

与上面的 `generateEmailHTML` 类似，您也可以自定义重置密码邮件的主题。该函数的参数相同，即 `{ req, token, user }`，但只能返回一个字符串，不能返回 HTML。

```javascript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      generateEmailSubject: ({ req, user }) => {
        return `Hey ${user.email}, reset your password!`
      },
    },
  },
}
```

以下参数会传递给 `generateEmailSubject` 函数：

| 参数   | 描述                     |
| ------ | ------------------------ |
| `req`  | 请求对象。               |
| `user` | 尝试重置密码的用户文档。 |