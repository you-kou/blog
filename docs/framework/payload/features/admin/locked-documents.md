# 文档锁定

Payload 中的文档锁定确保每次只有一个用户可以编辑文档，防止数据冲突和意外覆盖。当文档被锁定时，其他用户无法进行修改，直到锁定被释放，从而确保在协作环境中的数据完整性。

当用户在管理面板中开始编辑文档时，锁定会自动触发，直到用户退出编辑视图或锁定因不活跃而过期。

## 工作原理

当用户开始编辑文档时，Payload 会为该用户锁定文档。如果另一个用户尝试访问同一文档，他们将收到通知，表示文档正在被编辑。然后，他们可以选择以下选项之一：

只读查看：查看文档，但无法进行任何更改。
 接管：接管当前用户的编辑，锁定文档给新的编辑者，并通知原编辑者。
 返回仪表盘：离开锁定的文档，继续进行其他任务。

锁定会在设定的非活跃时间后自动过期，过期后其他用户可以继续编辑。过期时间可以通过 lockDocuments 配置中的 duration 属性进行设置。

注意：如果您的应用不需要文档锁定，可以通过将 lockDocuments 属性设置为 false 来禁用此功能，无论是针对某个集合还是全局。

### 配置选项

`lockDocuments` 属性存在于集合配置和全局配置中。默认情况下，文档锁定是启用的，但您可以自定义锁定持续时间或禁用任何集合或全局的此功能。

以下是文档锁定的示例配置：

```javascript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    // other fields...
  ],
  lockDocuments: {
    duration: 600, // Duration in seconds
  },
}
```

**锁定选项**

| 选项            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `lockDocuments` | 启用或禁用集合或全局的文档锁定。默认情况下，文档锁定是启用的。可以设置为一个对象进行配置，或者设置为 `false` 来禁用锁定。 |
| `duration`      | 指定文档在没有用户交互的情况下保持锁定的持续时间（单位为秒）。默认值为 300 秒（即 5 分钟）。 |

### 对 API 的影响

文档锁定会影响本地 API 和 REST API，确保如果文档被锁定，其他用户无法对该文档（包括全局文档）进行更新或删除操作。如果用户尝试更新或删除已锁定的文档，将会收到错误提示。

一旦文档被解锁或锁定时间到期，其他用户可以继续正常进行更新或删除操作。

#### 覆盖锁定

对于更新和删除等操作，Payload 提供了一个 `overrideLock` 选项。此布尔值标志，当设置为 `false` 时，会强制文档锁定，确保如果当前有其他用户持有锁定，操作不会继续。

默认情况下，`overrideLock` 设置为 `true`，意味着会忽略文档锁定，操作即使在文档被锁定时也会继续进行。如果希望强制锁定，并防止对已锁定文档进行更新或删除，请将 `overrideLock` 设置为 `false`。

```javascript
const result = await payload.update({
  collection: 'posts',
  id: '123',
  data: {
    title: 'New title',
  },
  overrideLock: false, // Enforces the document lock, preventing updates if the document is locked
})
```

这个选项在需要管理员权限或特定工作流的场景中特别有用，在这些场景下，您可能需要覆盖锁定，以确保操作得以完成。