# 日期字段

日期字段将日期保存到数据库，并为管理面板提供一个可自定义的时间选择器界面。

![Shows a Date field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/date.png)

*此字段使用 `react-datepicker` 组件作为 UI。*



要添加日期字段，在字段配置中将类型设置为 date：

```javascript
import type { Field } from 'payload'

export const MyDateField: Field = {
  // ...
  type: 'date', 
}
```

## 配置选项

| 选项             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| name *           | 用作存储和从数据库中检索时的属性名。更多                     |
| label            | 在管理面板中用作字段标签的文本，或包含每种语言键的对象。     |
| index            | 为该字段建立索引以提高查询速度。如果用户经常对该字段的数据执行查询，请将此字段设置为 true。 |
| validate         | 提供一个自定义验证函数，该函数将在管理面板和后端执行。更多   |
| saveToJWT        | 如果该字段是顶层字段，并且嵌套在支持身份验证的配置中，则将其数据包含在用户 JWT 中。 |
| hooks            | 提供字段钩子以控制该字段的逻辑。更多细节。                   |
| access           | 提供字段访问控制，指定哪些用户可以查看和操作该字段的数据。更多细节。 |
| hidden           | 完全限制该字段在所有 API 中的可见性。仍然会保存到数据库，但不会出现在任何 API 或管理面板中。 |
| defaultValue     | 提供用于此字段默认值的数据。更多                             |
| localized        | 启用该字段的本地化。需要在基础配置中启用本地化。             |
| required         | 要求此字段有值。                                             |
| admin            | 管理员特定配置。更多细节。                                   |
| custom           | 添加自定义数据的扩展点（例如，插件）。                       |
| timezone *       | 设置为 true 以启用此字段的时区选择。更多细节。               |
| typescriptSchema | 提供 JSON 模式以覆盖字段类型生成。                           |
| virtual          | 提供 true 以禁用数据库中的字段。请参阅虚拟字段。             |

*星号表示该属性是必需的。*

## 管理员选项

要自定义日期字段在管理面板中的外观和行为，可以使用管理员选项：

```javascript
import type { Field } from 'payload'

export const MyDateField: Field = {
  // ...
  admin: {
    
    // ...
  },
}
```

日期字段继承了基础字段管理员配置中的所有默认选项，并具有以下附加选项：

| 属性                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| placeholder             | 字段的占位符文本。                                           |
| date                    | 传递选项以自定义日期字段的外观。                             |
| date.displayFormat      | 设置日期在字段单元格中的显示格式。                           |
| date.pickerAppearance * | 确定日期选择器的外观：dayAndTime、timeOnly、dayOnly、monthOnly。 |
| date.monthsToShow *     | 显示的月份数量，最大为 2。默认值为 1。                       |
| date.minDate *          | 允许的最小日期值。                                           |
| date.maxDate *          | 允许的最大日期值。                                           |
| date.minTime *          | 允许的最早时间值。                                           |
| date.maxTime *          | 允许的最晚时间值。                                           |
| date.overrides *        | 将任何有效的属性直接传递给 react-datepicker。                |
| date.timeIntervals *    | 显示的时间间隔。默认值为 30 分钟。                           |
| date.timeFormat *       | 确定时间格式。默认值为 'h:mm aa'。                           |

*此属性直接传递给 react-datepicker。*

### 显示格式和选择器外观

这些属性仅影响日期在 UI 中的显示方式。完整的日期始终以 YYYY-MM-DDTHH:mm:ss.SSSZ 格式存储（例如：1999-01-01T8:00:00.000+05:00）。

- **displayFormat** 决定日期在字段单元格中的显示方式，可以传递任何有效的 Unicode 日期格式。
- **pickerAppearance** 设置 react-datepicker 的外观，提供的选项有：dayAndTime、dayOnly、timeOnly 和 monthOnly。默认情况下，日期选择器将显示 dayOnly。

当只设置 **pickerAppearance** 时，相应的格式将呈现在日期字段单元格中。如果要覆盖此格式，请设置 **displayFormat**。

## 示例

`collections/ExampleCollection.ts`

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'dateOnly',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
      },
    },
    {
      name: 'timeOnly',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
          displayFormat: 'h:mm:ss a',
        },
      },
    },
    {
      name: 'monthOnly',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMMM yyyy',
        },
      },
    },
  ],
}
```