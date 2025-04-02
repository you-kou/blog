# 单选框组字段

单选框字段允许从预定义的一组可能值中选择一个值，并在管理面板中呈现一个单选框组样式的输入。

![Shows a Radio field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/radio.png)

*单选框字段的管理面板截图*



要添加单选框字段，在字段配置中将类型设置为 radio：

```javascript
import type { Field } from 'payload'

export const MyRadioField: Field = {
  // ...
  type: 'radio',
  options: [
    // ...
  ],
}
```

## 配置选项

| 选项             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| name *           | 用作存储和从数据库中检索时的属性名。更多                     |
| options *        | 允许该字段存储的选项数组。可以是字符串数组，也可以是包含标签字符串和值字符串的对象数组。 |
| label            | 在管理面板中用作字段标签的文本，或包含每种语言键的对象。     |
| validate         | 提供一个自定义验证函数，该函数将在管理面板和后端执行。更多   |
| index            | 为该字段建立索引以提高查询速度。如果用户经常对该字段的数据执行查询，请将此字段设置为 true。 |
| saveToJWT        | 如果该字段是顶层字段，并且嵌套在支持身份验证的配置中，则将其数据包含在用户 JWT 中。 |
| hooks            | 提供字段钩子以控制该字段的逻辑。更多细节。                   |
| access           | 提供字段访问控制，指定哪些用户可以查看和操作该字段的数据。更多细节。 |
| hidden           | 完全限制该字段在所有 API 中的可见性。仍然会保存到数据库，但不会出现在任何 API 或管理面板中。 |
| defaultValue     | 提供用于此字段默认值的数据。默认值必须存在于提供的选项值中。更多 |
| localized        | 启用该字段的本地化。需要在基础配置中启用本地化。             |
| required         | 要求此字段有值。                                             |
| admin            | 管理员特定配置。更多细节。                                   |
| custom           | 添加自定义数据的扩展点（例如，插件）。                       |
| enumName         | 使用 SQL 数据库适配器（Postgres）时，该字段的自定义枚举名称。如果未定义，则会从名称自动生成。 |
| interfaceName    | 创建一个顶级的、可重用的 Typescript 接口和 GraphQL 类型。    |
| typescriptSchema | 提供 JSON 模式以覆盖字段类型生成。                           |
| virtual          | 提供 true 以禁用数据库中的字段。请参阅虚拟字段。             |

*星号表示该属性是必需的。*

> [!IMPORTANT]
>
> 选项值应为不包含连字符或特殊字符的字符串，这是由于 GraphQL 枚举命名的限制。下划线是允许的。如果您确定需要选项值为非字符串类型或包含特殊字符，它们将在作为 GraphQL 枚举使用之前进行相应格式化。

## 管理员选项

要自定义单选框字段在管理面板中的外观和行为，可以使用管理员选项：

```javascript
import type { Field } from 'payload'

export const MyRadioField: Field = {
  // ...
  admin: {
    
    // ...
  },
}
```

单选框字段继承了基础字段管理员配置中的所有默认选项，并具有以下附加选项：

| 属性   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| layout | 允许将单选框组样式设置为水平或垂直分布的列表。默认值为水平。 |

## 示例

`collections/ExampleCollection.ts`

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'color', // required
      type: 'radio', // required
      options: [
        // required
        {
          label: 'Mint',
          value: 'mint',
        },
        {
          label: 'Dark Gray',
          value: 'dark_gray',
        },
      ],
      defaultValue: 'mint', // The first value in options.
      admin: {
        layout: 'horizontal',
      },
    },
  ],
}
```

