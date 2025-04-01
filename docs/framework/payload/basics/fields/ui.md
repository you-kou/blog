# UI 字段

UI（用户界面）字段为您提供强大的功能，可以将自己的 React 组件直接嵌入到管理面板中，嵌套在其他字段内。它对文档的数据没有任何影响，仅用于展示。可以把它看作是将您自己的 React 组件“插入”到其他字段中，从而可以为编辑者提供您想要的位置的新控制项。

使用 UI 字段，您可以：

- 在编辑视图的主体内添加自定义消息或文本块，用于描述周围字段的用途
- 在订单的编辑视图侧边栏中添加一个“退款”按钮，该按钮可能会调用自定义的退款接口
- 在页面列表视图中添加一个“查看页面”按钮，给编辑者提供一个快速方式来查看网站前端的页面
- 构建一个“清除缓存”按钮或类似机制，手动清除特定文档的缓存

要添加 UI 字段，需在字段配置中将类型设置为 `ui`：

```javascript
import type { Field } from 'payload'

export const MyUIField: Field = {
  // ...
  type: 'ui', 
}
```

## 配置选项

| 选项                          | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| **name \***                   | 该字段的唯一标识符。                                         |
| **label**                     | 该 UI 字段的可读标签。                                       |
| **admin.components.Field \*** | 在编辑视图中渲染此字段的 React 组件。更多详情                |
| **admin.components.Cell**     | 在集合列表视图中作为单元格渲染的 React 组件。更多详情        |
| **admin.disableListColumn**   | 将 `disableListColumn` 设置为 `true`，以防止 UI 字段出现在列表视图的列选择器中。 |
| **custom**                    | 用于添加自定义数据的扩展点（例如用于插件）。                 |

*星号表示该属性是必填的。*

## 示例

`collections/ExampleCollection.ts`

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'myCustomUIField', // required
      type: 'ui', // required
      admin: {
        components: {
          Field: '/path/to/MyCustomUIField',
          Cell: '/path/to/MyCustomUICell',
        },
      },
    },
  ],
}
```

