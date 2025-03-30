# 行字段

行字段仅用于呈现，只影响管理面板。使用它可以将字段横向排列在一起。

![Shows a row field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/row.png)

*Admin 面板中行字段的截图*



要添加行字段，请在字段配置中将类型设置为 `row`：

```javascript
import type { Field } from 'payload'

export const MyRowField: Field = {
  // ...
  type: 'row',
  fields: [
    // ...
  ],
}
```

## 配置选项

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| **fields*** | 在此行内嵌套的字段类型数组。                                 |
| **admin**   | 管理面板专属配置，不包括 `description`、`readOnly` 和 `hidden`。[查看更多](#)。 |
| **custom**  | 用于添加自定义数据的扩展点（例如插件）。                     |

\* 星号表示该属性为必填项。

## 示例

 `collections/ExampleCollection.ts`

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      type: 'row', // required
      fields: [
        // required
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
```

