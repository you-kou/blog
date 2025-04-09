# 集合钩子

集合钩子是在特定集合中的文档上运行的钩子。它们允许你在文档生命周期的特定事件中执行自定义逻辑。

要向集合添加钩子，请在集合配置中使用 hooks 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const CollectionWithHooks: CollectionConfig = {
  // ...
  hooks: {
    
    // ...
  },
}
```

> [!TIP]
>
> 你也可以在字段级别设置钩子，以将钩子逻辑限定在特定字段上。

## 配置选项

所有集合钩子都接受由同步或异步函数组成的数组。每个集合钩子根据其类型接收特定的参数，并具有修改特定输出的能力。

```javascript
import type { CollectionConfig } from 'payload';

export const CollectionWithHooks: CollectionConfig = {
  // ...
  hooks: {
    beforeOperation: [(args) => {...}],
    beforeValidate: [(args) => {...}],
    beforeDelete: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeRead: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
    afterDelete: [(args) => {...}],
    afterOperation: [(args) => {...}],
    afterError: [(args) => {....}],

    // Auth-enabled Hooks
    beforeLogin: [(args) => {...}],
    afterLogin: [(args) => {...}],
    afterLogout: [(args) => {...}],
    afterRefresh: [(args) => {...}],
    afterMe: [(args) => {...}],
    afterForgotPassword: [(args) => {...}],
    refresh: [(args) => {...}],
    me: [(args) => {...}],
  },
}
```

### `beforeOperation`

`beforeOperation` 钩子可用于修改操作接受的参数或执行在操作开始之前运行的副作用。

可用的集合操作包括创建、读取、更新、删除、登录、刷新和忘记密码。

```javascript
import type { CollectionBeforeOperationHook } from 'payload'

const beforeOperationHook: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  return args // return modified operation arguments as necessary
}
```

以下参数会传递给 beforeOperation 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| operation  | 当前钩子运行所在的操作名称。                          |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `beforeValidate`

在创建和更新操作期间运行。此钩子允许你在服务器端验证传入数据之前添加或格式化数据。

请注意，这不会在客户端验证之前运行。如果你在前端渲染了自定义字段组件并提供了验证函数，那么验证的执行顺序是：

1. 客户端执行 validate
2. 如果成功，服务器端执行 beforeValidate
3. 服务器端执行 validate

```javascript
import type { CollectionBeforeValidateHook } from 'payload'

const beforeValidateHook: CollectionBeforeValidateHook = async ({ data }) => {
  return data
}
```

以下参数会传递给 beforeValidate 钩子：

| 选项        | 描述                                                  |
| ----------- | ----------------------------------------------------- |
| collection  | 当前钩子所在的集合。                                  |
| context     | 在钩子之间传递的自定义上下文。更多详情。              |
| data        | 通过操作传入的 incoming 数据。                        |
| operation   | 当前钩子运行所在的操作名称。                          |
| originalDoc | 应用更改之前的文档。                                  |
| req         | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `beforeChange`

在验证后立即，beforeChange 钩子将在创建和更新操作中运行。在此阶段，你可以确信将要保存到文档中的数据已根据字段验证有效。你可以选择性地修改要保存的数据结构。

```javascript
import type { CollectionBeforeChangeHook } from 'payload'

const beforeChangeHook: CollectionBeforeChangeHook = async ({ data }) => {
  return data
}
```

以下参数会传递给 beforeChange 钩子：

| 选项        | 描述                                                  |
| ----------- | ----------------------------------------------------- |
| collection  | 当前钩子所在的集合。                                  |
| context     | 在钩子之间传递的自定义上下文。更多详情。              |
| data        | 通过操作传入的 incoming 数据。                        |
| operation   | 当前钩子运行所在的操作名称。                          |
| originalDoc | 应用更改之前的文档。                                  |
| req         | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `afterChange`

在文档被创建或更新后，afterChange 钩子会运行。这个钩子对于重新计算统计数据（例如全局总销售额）、将用户个人资料更改同步到 CRM 等非常有用。

```javascript
import type { CollectionAfterChangeHook } from 'payload'

const afterChangeHook: CollectionAfterChangeHook = async ({ doc }) => {
  return doc
}
```

以下参数会传递给 afterChange 钩子：

| 选项        | 描述                                                  |
| ----------- | ----------------------------------------------------- |
| collection  | 当前钩子所在的集合。                                  |
| context     | 在钩子之间传递的自定义上下文。更多详情。              |
| doc         | 应用更改后生成的文档。                                |
| operation   | 当前钩子运行所在的操作名称。                          |
| previousDoc | 应用更改之前的文档。                                  |
| req         | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `beforeRead`

在 `find` 和 `findByID` 操作被 `afterRead` 转换为输出之前，`beforeRead` 钩子会运行。这个钩子在隐藏字段被移除之前以及在本地化字段被展平到请求的语言环境之前触发。使用这个钩子时，你可以通过 `doc` 参数访问所有语言环境和所有隐藏字段。

```javascript
import type { CollectionBeforeReadHook } from 'payload'

const beforeReadHook: CollectionBeforeReadHook = async ({ doc }) => {
  return doc
}
```

以下参数会传递给 beforeRead 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| doc        | 应用更改后生成的文档。                                |
| query      | 请求的查询条件。                                      |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `afterRead`

在文档返回之前，`afterRead` 钩子作为最后一步运行。它会展平本地化字段、隐藏受保护的字段，并移除用户无权访问的字段。

```
import type { CollectionAfterReadHook } from 'payload'

const afterReadHook: CollectionAfterReadHook = async ({ doc }) => {
  return doc
}
```

以下参数会传递给 afterRead 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| doc        | 应用更改后生成的文档。                                |
| query      | 请求的查询条件。                                      |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `beforeDelete`

在删除操作之前运行。返回的值会被丢弃。

```javascript
import type { CollectionBeforeDeleteHook } from 'payload';

const beforeDeleteHook: CollectionBeforeDeleteHook = async ({
  req,
  id,
}) => {...}
```

以下参数会传递给 beforeDelete 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| id         | 正在删除的文档的 ID。                                 |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `afterDelete`

在删除操作从数据库中移除记录后立即运行。返回的值会被丢弃。

```javascript
import type { CollectionAfterDeleteHook } from 'payload';

const afterDeleteHook: CollectionAfterDeleteHook = async ({
  req,
  id,
  doc,
}) => {...}
```

以下参数会传递给 afterDelete 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| doc        | 应用更改后生成的文档。                                |
| id         | 被删除的文档的 ID。                                   |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `afterOperation`

`afterOperation` 钩子可用于修改操作的结果或执行在操作完成后运行的副作用。

可用的集合操作包括创建、查找、通过 ID 查找、更新、通过 ID 更新、删除、通过 ID 删除、登录、刷新和忘记密码。

```javascript
import type { CollectionAfterOperationHook } from 'payload'

const afterOperationHook: CollectionAfterOperationHook = async ({ result }) => {
  return result
}
```

以下参数会传递给 afterOperation 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| args       | 传入操作的参数。                                      |
| collection | 当前钩子所在的集合。                                  |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |
| operation  | 当前钩子运行所在的操作名称。                          |
| result     | 操作的结果，修改前的值。                              |

### `afterError`

`afterError` 钩子在 Payload 应用程序中发生错误时触发。它可以用于将错误日志发送到第三方服务、向开发团队发送电子邮件、将错误日志记录到 Sentry 或 DataDog 等。输出可以用于转换结果对象或状态码。

```javascript
import type { CollectionAfterErrorHook } from 'payload';

const afterErrorHook: CollectionAfterErrorHook = async ({
  req,
  id,
  doc,
}) => {...}
```

以下参数会传递给 afterError 钩子：

| 选项          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| error         | 发生的错误。                                                 |
| context       | 在钩子之间传递的自定义上下文。更多详情。                     |
| graphqlResult | 如果钩子在 GraphQL 上下文中执行，则为 GraphQL 结果对象。     |
| req           | 扩展自 Web 请求的 PayloadRequest 对象。包含当前已验证的用户和本地 API 实例的有效负载。 |
| collection    | 当前钩子所在的集合。                                         |
| result        | 格式化后的错误结果对象，如果钩子在 REST 上下文中执行，则可用。 |

### `beforeLogin`

对于启用身份验证的集合，此钩子在登录操作期间运行，当提供的凭据存在对应的用户时，生成令牌并将其添加到响应之前。你可以选择性地修改返回的用户，或抛出错误以拒绝登录操作。

```javascript
import type { CollectionBeforeLoginHook } from 'payload'

const beforeLoginHook: CollectionBeforeLoginHook = async ({ user }) => {
  return user
}
```

以下参数会传递给 beforeLogin 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |
| user       | 正在登录的用户。                                      |

### `afterLogin`

对于启用身份验证的集合，此钩子在登录操作成功后运行。你可以选择性地修改返回的用户。

```javascript
import type { CollectionAfterLoginHook } from 'payload';

const afterLoginHook: CollectionAfterLoginHook = async ({
  user,
  token,
}) => {...}
```

以下参数会传递给 afterLogin 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |
| token      | 为用户生成的令牌。                                    |
| user       | 正在登录的用户。                                      |

### `afterLogout`

对于启用身份验证的集合，此钩子在登出操作后运行。

```javascript
import type { CollectionAfterLogoutHook } from 'payload';

const afterLogoutHook: CollectionAfterLogoutHook = async ({
  req,
}) => {...}
```

以下参数会传递给 afterLogout 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |

### `afterMe`

对于启用身份验证的集合，此钩子在“me”操作后运行。

```javascript
import type { CollectionAfterMeHook } from 'payload';

const afterMeHook: CollectionAfterMeHook = async ({
  req,
  response,
}) => {...}
```

以下参数会传递给 afterMe 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |
| response   | 要返回的响应。                                        |

### `afterRefresh`

对于启用身份验证的集合，此钩子在刷新操作后运行。

```javascript
import type { CollectionAfterRefreshHook } from 'payload';

const afterRefreshHook: CollectionAfterRefreshHook = async ({
  token,
}) => {...}
```

以下参数会传递给 afterRefresh 钩子：

| 选项       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| collection | 当前钩子所在的集合。                                  |
| context    | 在钩子之间传递的自定义上下文。更多详情。              |
| exp        | 令牌的过期时间。                                      |
| req        | Web 请求对象。对于本地 API 操作，这个对象是被模拟的。 |
| token      | 新刷新生成的用户令牌。                                |

### `afterForgotPassword`

对于启用身份验证的集合，此钩子在成功的忘记密码操作后运行。返回的值会被丢弃。

```javascript
import type { CollectionAfterForgotPasswordHook } from 'payload'

const afterForgotPasswordHook: CollectionAfterForgotPasswordHook = async ({
  args,
  context,
  collection,
}) => {...}
```

以下参数会传递给 afterForgotPassword 钩子：

| 选项       | 描述                                     |
| ---------- | ---------------------------------------- |
| args       | 传入操作的参数。                         |
| collection | 当前钩子所在的集合。                     |
| context    | 在钩子之间传递的自定义上下文。更多详情。 |

### `refresh`

对于启用身份验证的集合，此钩子允许你选择性地替换刷新操作的默认行为。如果你在钩子中返回一个值，则该操作将不会执行其默认逻辑，而是继续执行你提供的逻辑。

```javascript
import type { CollectionRefreshHook } from 'payload'

const myRefreshHook: CollectionRefreshHook = async ({
  args,
  user,
}) => {...}
```

以下参数会传递给 afterRefresh 钩子：

| 选项 | 描述             |
| ---- | ---------------- |
| args | 传入操作的参数。 |
| user | 正在登录的用户。 |

### `me`

对于启用身份验证的集合，此钩子允许你选择性地替换“me”操作的默认行为。如果你在钩子中返回一个值，则该操作将不会执行其默认逻辑，而是继续执行你提供的逻辑。

```javascript
import type { CollectionMeHook } from 'payload'

const meHook: CollectionMeHook = async ({
  args,
  user,
}) => {...}
```

