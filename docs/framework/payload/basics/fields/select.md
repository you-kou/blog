# 下拉列表字段

下拉列表字段提供了一个下拉式界面，用于从预定义的选项列表中选择选项，类似于枚举。

![Shows a Select field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/select.png)

*选择字段的管理员面板截图*



要添加选择字段，请在字段配置中将类型设置为 "select"：

```javascript
import type { Field } from 'payload'

export const MySelectField: Field = {
  // ...
  type: 'select',
  options: [
    // ...
  ],
}
```

## 配置选项

| 选项                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| **name** *           | 用作存储和检索数据时的属性名称。更多                         |
| **options** *        | 允许字段存储的选项数组。可以是字符串数组，也可以是包含标签字符串和值字符串的对象数组。 |
| **hasMany**          | 布尔值，如果设置为 true，则允许此字段有多个选择，而不是只能选择一个。 |
| **label**            | 在管理员面板中用作字段标签的文本，或包含每种语言的键值对象。 |
| **unique**           | 强制集合中的每个条目在该字段上具有唯一值。                   |
| **validate**         | 提供一个自定义验证函数，该函数将在管理员面板和后端上执行。更多 |
| **index**            | 为此字段构建索引，以加速查询。如果您的用户经常在此字段的数据上执行查询，请将此字段设置为 true。 |
| **saveToJWT**        | 如果此字段是顶级字段并嵌套在支持身份验证的配置中，则将其数据包含在用户 JWT 中。 |
| **hooks**            | 提供字段钩子以控制此字段的逻辑。更多细节。                   |
| **access**           | 提供字段访问控制，表示哪些用户可以查看和操作此字段的数据。更多细节。 |
| **hidden**           | 完全限制此字段在所有 API 中的可见性。它仍会保存到数据库，但不会出现在任何 API 或管理员面板中。 |
| **defaultValue**     | 提供用于此字段默认值的数据。更多                             |
| **localized**        | 启用此字段的本地化。需要在基础配置中启用本地化。             |
| **required**         | 强制此字段必须有值。                                         |
| **admin**            | 管理员特定的配置。请参阅默认字段管理员配置以获取更多详情。   |
| **custom**           | 用于添加自定义数据的扩展点（例如，插件）。                   |
| **enumName**         | 使用 SQL 数据库适配器（Postgres）时此字段的自定义枚举名称。如果未定义，则从名称自动生成。 |
| **dbName**           | 使用 SQL 数据库适配器（Postgres）时此字段的自定义表名（如果 hasMany 设置为 true）。如果未定义，则从名称自动生成。 |
| **interfaceName**    | 创建一个顶级、可重用的 TypeScript 接口和 GraphQL 类型。      |
| **typescriptSchema** | 提供 JSON 模式以覆盖字段类型生成。                           |
| **virtual**          | 提供 true 以禁用数据库中的字段。参见虚拟字段。               |

*带星号的选项表示此属性为必填项。*

> [!IMPORTANT]
>
> 选项值应为不包含连字符或特殊字符的字符串，因为 GraphQL 枚举命名有约束。下划线是允许的。如果您确定需要将选项值设为非字符串类型或包含特殊字符，它们将在作为 GraphQL 枚举使用之前进行相应的格式化处理。

## 管理员选项

要自定义选择字段在管理员面板中的外观和行为，您可以使用管理员选项：

```javascript
import type { Field } from 'payload'

export const MySelectField: Field = {
  // ...
  admin: {
    
    // ...
  },
}
```

选择字段继承了所有来自基础字段管理员配置的默认选项，并且还具有以下附加选项：

| **属性**        | **描述**                                                     |
| --------------- | ------------------------------------------------------------ |
| **isClearable** | 如果希望此字段在管理员 UI 中可清除，请设置为 true。          |
| **isSortable**  | 如果希望此字段在管理员 UI 中可以通过拖放进行排序，请设置为 true。（仅在 hasMany 设置为 true 时有效） |

## 示例

`collections/ExampleCollection.ts`

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'selectedFeatures', // required
      type: 'select', // required
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      options: [
        {
          label: 'Metallic Paint',
          value: 'metallic_paint',
        },
        {
          label: 'Alloy Wheels',
          value: 'alloy_wheels',
        },
        {
          label: 'Carbon Fiber Dashboard',
          value: 'carbon_fiber_dashboard',
        },
      ],
    },
  ],
}
```

