# 数字字段

数字字段用于存储和验证数字输入，并支持额外的数字验证和格式化功能。

![Shows a Number field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/number.png)

*管理员面板截图显示数字字段*



要添加数字字段，请在字段配置中将类型设置为数字：

```javascript
import type { Field } from 'payload'

export const MyNumberField: Field = {
  // ...
  type: 'number', 
}
```

## 配置选项

| 选项                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| **name** *           | 用于存储和从数据库中检索时的属性名称。更多详情               |
| **label**            | 在管理员面板中用作字段标签的文本，或具有每种语言键的对象。   |
| **min**              | 接受的最小值。用于默认验证函数。                             |
| **max**              | 接受的最大值。用于默认验证函数。                             |
| **hasMany**          | 使此字段成为一个有序的数字数组，而不是单一数字。             |
| **minRows**          | 如果 `hasMany` 设置为 `true`，数字数组中的最小数字数。       |
| **maxRows**          | 如果 `hasMany` 设置为 `true`，数字数组中的最大数字数。       |
| **unique**           | 强制每个集合中的条目对于此字段具有唯一值。                   |
| **index**            | 为此字段构建索引以提高查询速度。如果用户频繁对此字段的数据进行查询，请设置为 `true`。 |
| **validate**         | 提供一个自定义验证函数，该函数将在管理员面板和后端执行。更多详情 |
| **saveToJWT**        | 如果此字段是顶级字段并嵌套在支持认证的配置中，请将其数据包含在用户的 JWT 中。 |
| **hooks**            | 提供字段钩子以控制此字段的逻辑。更多细节。                   |
| **access**           | 提供字段访问控制，指定哪些用户可以查看和操作此字段的数据。更多细节。 |
| **hidden**           | 完全限制此字段在所有 API 中的可见性。仍将保存到数据库中，但不会出现在任何 API 或管理员面板中。 |
| **defaultValue**     | 提供用于此字段默认值的数据。更多详情                         |
| **localized**        | 为此字段启用本地化。要求在基础配置中启用本地化。             |
| **required**         | 强制此字段必须有值。                                         |
| **admin**            | 管理员专用配置。更多细节。                                   |
| **custom**           | 为插件等添加自定义数据的扩展点。                             |
| **typescriptSchema** | 提供 JSON schema 来覆盖字段类型生成。                        |
| **virtual**          | 设置为 `true` 以禁用此字段在数据库中的使用。见虚拟字段。     |

*带星号表示该属性是必需的。*

## 管理员选项

要自定义数字字段在管理员面板中的外观和行为，可以使用以下管理员选项：

```javascript
import type { Field } from 'payload'

export const MyNumberField: Field = {
  // ...
  admin: {
    
    // ...
  },
}
```

数字字段继承了所有来自基础字段管理员配置的默认选项，此外还包含以下附加选项：

| 属性             | 描述                                                    |
| ---------------- | ------------------------------------------------------- |
| **step**         | 设置数字字段的增量/减量值，允许使用浏览器控件进行操作。 |
| **placeholder**  | 设置此属性以定义字段的占位符字符串。                    |
| **autoComplete** | 设置此属性为一个字符串，用于浏览器自动完成功能。        |

## 示例

`collections/ExampleCollection.ts`

```java
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'age', // required
      type: 'number', // required
      required: true,
      admin: {
        step: 1,
      },
    },
  ],
}
```

