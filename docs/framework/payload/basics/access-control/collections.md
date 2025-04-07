# 集合访问控制

集合访问控制是一种用于限制对集合内文档的访问权限的访问控制方式，同时也限制用户在管理面板中查看与该集合相关内容时的可见范围（即哪些能看到，哪些看不到）。

要为一个集合添加访问控制，可以在集合配置中使用 `access` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  access: {
    
    // ...
  },
}
```

## 配置选项

访问控制是针对请求的操作而特定设置的。

要给一个集合添加访问控制，需在你的集合配置中使用 `access` 属性：

```typescript
import type { CollectionConfig } from 'payload';

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  access: {
    create: () => {...},
    read: () => {...},
    update: () => {...},
    delete: () => {...},

    // Auth-enabled Collections only
    admin: () => {...},
    unlock: () => {...},

    // Version-enabled Collections only
    readVersions: () => {...},
  },
}
```

以下是可用的选项：

| 功能   | 允许 / 拒绝访问情况                              |
| ------ | ------------------------------------------------ |
| create | 用于创建操作                                     |
| read   | 用于查找（`find`）和按 ID 查找（`findByID`）操作 |
| update | 用于更新操作                                     |
| delete | 用于删除操作                                     |

如果一个集合支持身份验证，那么有以下额外的可用选项：

| 功能   | 允许 / 拒绝访问情况              |
| ------ | -------------------------------- |
| admin  | 用于限制对管理面板的访问         |
| unlock | 用于限制哪些用户可以访问解锁操作 |

如果一个集合支持版本控制，那么有以下额外的可用选项：

| 功能         | 允许 / 拒绝访问情况                                          |
| ------------ | ------------------------------------------------------------ |
| readVersions | 用于控制谁可以读取版本，谁不可以。会自动限制管理界面的版本查看权限 |

### 创建操作

返回一个布尔值，用于允许或拒绝针对创建请求的访问。

要为集合添加创建操作的访问控制，可以在集合配置中使用 `create` 属性：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithCreateAccess: CollectionConfig = {
  // ...
  access: {
    create: ({ req: { user }, data }) => {
      return Boolean(user)
    },
  },
}
```

以下参数会传递给 `create` 函数：

| 选项   | 描述                                       |
| ------ | ------------------------------------------ |
| `req`  | 包含当前已通过身份验证用户信息的请求对象。 |
| `data` | 用于创建文档时所传入的数据。               |

### 读取操作

返回一个布尔值，用于允许或拒绝读取请求的访问权限。

要为集合添加读取访问控制，可在集合配置中使用 `read` 属性：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithReadAccess: CollectionConfig = {
  // ...
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

> [!TIP]
>
> 返回一个查询条件（Query）可以将文档限制为仅符合该约束条件的文档。这有助于限制用户对特定文档的访问。更多详情见后文。

随着应用程序变得更加复杂，你可能希望将函数定义在单独的文件中，然后导入到集合配置里：

```typescript
import type { Access } from 'payload'

export const canReadPage: Access = ({ req: { user } }) => {
  // 允许已认证的用户
  if (user) {
    return true
  }

  // 通过返回一个查询条件，访客用户可以读取公开文档
  // 注意：这假设你的集合中有一个名为 `isPublic` 的复选框字段
  return {
    isPublic: {
      equals: true,
    },
  }
}
```

以下参数会传递给 `read` 函数：

| 选项  | 描述                                                      |
| ----- | --------------------------------------------------------- |
| `req` | 包含当前已认证用户的请求对象。                            |
| `id`  | 如果是通过 `findByID` 方法请求文档，则为所请求文档的 ID。 |

### 更新操作

返回一个布尔值，用于决定是否允许对更新请求进行访问。

若要为集合添加更新访问控制，可在集合配置里使用 `update` 属性，示例如下：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithUpdateAccess: CollectionConfig = {
  // ...
  access: {
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

> [!TIP]
>
> 返回一个查询条件（Query），可将文档限定为仅符合该约束条件的文档，这有助于限制用户对特定文档的访问权限，更多详情见后文。

随着应用程序复杂度增加，你可以把函数定义在单独的文件中，再导入到集合配置里，示例如下：

```typescript
import type { Access } from 'payload'

export const canUpdateUser: Access = ({ req: { user }, id }) => {
  // 允许角色为 'admin' 的用户进行更新操作
  if (user.roles && user.roles.some((role) => role === 'admin')) {
    return true
  }

  // 允许其他用户仅更新自己的文档
  return user.id === id
}
```

以下参数会传递给 `update` 函数：

| 选项   | 描述                               |
| ------ | ---------------------------------- |
| `req`  | 包含当前已认证用户信息的请求对象。 |
| `id`   | 要更新的文档的 ID。                |
| `data` | 用于更新文档时所传入的数据。       |

### 删除操作

与更新函数类似，此函数返回一个布尔值或查询约束，以此限制哪些用户可以删除哪些文档。

若要为集合添加删除访问控制，可在集合配置中使用 `delete` 属性，示例如下：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithDeleteAccess: CollectionConfig = {
  // ...
  access: {
    delete: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

随着应用程序复杂度的提升，你可以将函数定义在单独的文件中，然后导入到集合配置里，示例如下：

```typescript
import type { Access } from 'payload'

export const canDeleteCustomer: Access = async ({ req, id }) => {
  if (!id) {
    // 由于没有 `id` 无法确定，允许管理界面显示删除控件
    return true
  }

  // 使用 `id` 查询另一个集合
  const result = await req.payload.find({
    collection: 'contracts',
    limit: 0,
    depth: 0,
    where: {
      customer: { equals: id },
    },
  })

  return result.totalDocs === 0
}
```

以下参数会传递给 `delete` 函数：

| 选项  | 描述                                                        |
| ----- | ----------------------------------------------------------- |
| `req` | 带有额外 `user` 属性的请求对象，`user` 为当前已登录的用户。 |
| `id`  | 要删除的文档的 ID。                                         |

### 管理面板访问控制

若该集合用于访问管理面板，那么管理访问控制函数会决定当前已登录的用户是否能够访问管理界面。

要为集合添加管理访问控制，可在集合配置中使用 `admin` 属性，示例如下：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithAdminAccess: CollectionConfig = {
  // ...
  access: {
    admin: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

以下参数会传递给 `admin` 函数：

| 选项  | 描述                               |
| ----- | ---------------------------------- |
| `req` | 包含当前已认证用户信息的请求对象。 |

### 解锁操作

此操作用于确定哪些用户能够解锁其他可能因多次登录尝试失败而被阻止成功进行身份验证的用户。

若要为集合添加解锁访问控制，可在集合配置中使用 `unlock` 属性，示例如下：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithUnlockAccess: CollectionConfig = {
  // ...
  access: {
    unlock: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

以下参数会传递给 `unlock` 函数：

| 选项  | 描述                               |
| ----- | ---------------------------------- |
| `req` | 包含当前已认证用户信息的请求对象。 |

### 读取版本

如果集合启用了版本控制功能，`readVersions` 访问控制函数将决定当前登录用户是否可以访问文档的版本历史记录。

要为集合添加读取版本的访问控制，可在集合配置中使用 `readVersions` 属性，示例如下：

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithVersionsAccess: CollectionConfig = {
  // ...
  access: {
    readVersions: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

以下参数会传递给 `readVersions` 函数：

| 选项  | 描述                               |
| ----- | ---------------------------------- |
| `req` | 包含当前已认证用户信息的请求对象。 |