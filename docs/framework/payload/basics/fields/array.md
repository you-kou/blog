# 数组字段

数组字段用于存储一组“可重复”的字段，它存储的是一个包含用户定义字段的对象数组。这些字段可以是任何类型，包括其他数组，从而实现无限嵌套的数据结构。

数组字段适用于多种内容类型，从简单到复杂，例如：

- **图片轮播**：包含图片（上传字段）和说明（文本字段）。
- **导航结构**：允许编辑者指定导航项，包括页面（关系字段）和“在新标签页打开”复选框字段。
- **活动议程时间段**：需要指定**开始时间**和**结束时间**（日期字段）、**标签**（文本字段）以及**"了解更多"页面**（关系字段）。

![Array field with two Rows in Payload Admin Panel](https://payloadcms.com/images/docs/fields/array.png)

*具有两行的数组字段的管理面板截图*



要创建一个数组字段（Array Field），请在字段配置（Field Config）中将 `type` 设置为 `array`：

```javascript
import type { Field } from 'payload'

export const MyArrayField: Field = {
  // ...
  type: 'array',
  fields: [
    // ...
  ],
}
```

## 配置选项

| 选项                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| **name \***          | 用于存储和从数据库中检索时的属性名称。更多                   |
| **label**            | 在管理面板中作为标题的文本，或者一个包含每种语言的键的对象。如果未定义，则从name自动生成。 |
| **fields \***        | 与数组中每一行对应的字段类型数组。                           |
| **validate**         | 提供一个自定义验证函数，该函数将在管理面板和后端执行。更多   |
| **minRows**          | 验证时允许的最少项数，当有值时生效。                         |
| **maxRows**          | 验证时允许的最多项数，当有值时生效。                         |
| **saveToJWT**        | 如果该字段是顶层且嵌套在支持身份验证的配置中，则将其数据包含在用户JWT中。 |
| **hooks**            | 提供字段钩子来控制该字段的逻辑。更多详情。                   |
| **access**           | 提供字段访问控制，标明哪些用户可以查看和操作该字段的数据。更多详情。 |
| **hidden**           | 完全限制此字段在所有API中的可见性。仍会保存到数据库，但不会出现在任何API或管理面板中。 |
| **defaultValue**     | 提供一组行数据，作为该字段的默认值。更多                     |
| **localized**        | 启用此字段的本地化。需要在基础配置中启用本地化。如果启用，将为数组中的所有数据保持一组单独的本地化数据，因此无需为每个嵌套字段指定本地化。 |
| **required**         | 要求该字段必须有值。                                         |
| **labels**           | 自定义在管理仪表板中显示的行标签。                           |
| **admin**            | 管理员特定的配置。更多详情。                                 |
| **custom**           | 用于添加自定义数据的扩展点（例如用于插件）。                 |
| **interfaceName**    | 创建一个顶级、可重用的Typescript接口和GraphQL类型。          |
| **dbName**           | 使用SQL数据库适配器（Postgres）时，字段的自定义表名。如果未定义，则从name自动生成。 |
| **typescriptSchema** | 通过提供JSON模式来覆盖字段类型生成。                         |
| **virtual**          | 提供true以禁用数据库中的字段。参见虚拟字段                   |

- 星号表示该属性是必填的。

## 管理员选项

要自定义数组字段在管理面板中的外观和行为，您可以使用 `admin` 选项：

```javascript
import type { Field } from 'payload'

export const MyArrayField: Field = {
  // ...
  admin: {
    
    // ...
  },
}
```

数组字段继承了基础字段管理配置的所有默认选项，此外还有以下附加选项：

| 选项                    | 描述                                      |
| ----------------------- | ----------------------------------------- |
| **initCollapsed**       | 设置初始的折叠状态                        |
| **components.RowLabel** | 用于在数组行上渲染标签的 React 组件。示例 |
| **isSortable**          | 通过将此值设置为 `false` 来禁用排序功能   |

## 示例

在这个示例中，我们有一个名为 `slider` 的数组字段，其中包含一组用于简单图像滑动器的字段。数组中的每一行都有一个标题、图片和说明。我们还自定义了行标签，如果存在标题，则显示标题，如果没有，则显示默认标签。

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'slider', // required
      type: 'array', // required
      label: 'Image Slider',
      minRows: 2,
      maxRows: 10,
      interfaceName: 'CardSlider', // optional
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      fields: [
        // required
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
```

