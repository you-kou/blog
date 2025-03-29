# 访问控制

访问控制决定了用户对任何特定文档的可执行操作，以及在管理面板中可见的内容。通过实施访问控制，您可以根据用户、其角色（RBAC）、文档数据或应用程序所需的任何其他条件来定义精细的访问限制。

访问控制函数作用于特定操作，这意味着您可以为创建、读取、更新、删除等不同操作设置不同的规则。这些函数在任何更改发生之前以及任何操作完成之前执行，从而确保用户在请求被处理前具有必要的权限。

访问控制的常见用例如下：

- 允许所有人读取所有帖子
- 仅允许公开访问状态字段为“已发布”的帖子
- 仅允许角色字段为“管理员”的用户删除帖子
- 允许所有人提交联系表单，但只有已登录用户才能读取、更新或删除
- 限制用户仅能查看自己的订单，无法访问他人的订单
- 允许属于某个组织的用户仅访问该组织的资源

Payload 中主要有三种访问控制类型：

1. **集合访问控制（Collection Access Control）**
2. **全局访问控制（Global Access Control）**
3. **字段访问控制（Field Access Control）**

## 默认访问控制

Payload 提供默认的访问控制，使您的数据在身份验证后受到保护，无需额外配置。为此，Payload 设定了一个默认函数，仅检查请求中是否存在用户。您可以根据需要定义自己的访问控制函数来覆盖此默认行为。

以下是 Payload 提供的默认访问控制：

```javascript
const defaultPayloadAccess = ({ req: { user } }) => {
  // Return `true` if a user is found
  // and `false` if it is undefined or null
  return Boolean(user) 
}
```

> [!IMPORTANT]
>
> 在本地 API（Local API）中，所有访问控制默认都会被跳过。这使得您的服务器可以完全控制应用程序。	如果希望重新启用访问控制，可以在请求中将 `overrideAccess` 选项设置为 `false`。

## 访问操作（Access Operation）

管理面板会根据访问控制（Access Control）的更改动态响应。例如，如果您将 `ExampleCollection` 的编辑权限限制为仅具有 "admin" 角色的用户，Payload 将完全隐藏该集合，使其无法在管理面板中显示。这一机制非常强大，允许您使用相同的访问控制函数来保护 API，并控制用户在管理面板中的操作权限。

为实现这一点，Payload 提供了 **访问操作（Access Operation）**。在用户登录后，Payload 会在所有集合（Collections）、全局配置（Globals）和字段（Fields）中执行访问控制函数，并返回一个包含当前认证用户可执行操作的权限映射。

> [!IMPORTANT]
>
> 当访问控制函数通过 **访问操作（Access Operation）** 执行时，`id` 和 `data` 参数将 **不会被定义**。这是因为 Payload 在不引用特定文档的情况下执行这些函数。

因此，如果您的访问控制函数依赖 `id` 或 `data`，请先检查它们是否已定义。如果未定义，则表明访问控制函数是由 **访问操作（Access Operation）** 触发的，仅用于确定用户在管理面板中的权限。

## 基于语言区域（Locale-Specific）的访问控制

要实现基于语言区域的访问控制，可以在访问控制函数中使用 `req.locale` 参数。该参数允许您根据当前请求的语言区域来评估访问权限。

示例：

```javascript
const access = ({ req }) => {
  // Grant access if the locale is 'en'
  if (req.locale === 'en') {
    return true
  }

  // Deny access for all other locales
  return false
}
```

