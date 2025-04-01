# 关系字段

关系字段是 Payload 中最强大的字段之一。它提供了轻松将文档彼此关联的能力。

![Shows a relationship field in the Payload Admin Panel](https://payloadcms.com/images/docs/fields/relationship.png)

关系字段在多种方式中使用，包括：

- 将产品文档添加到订单文档中
- 允许订单与“placedBy”字段关联到组织或用户集合
- 将类别文档分配给帖子文档

要添加关系字段，请在您的字段配置中将类型设置为 `relationship`。

```javascript
import type { Field } from 'payload'

export const MyRelationshipField: Field = {
  // ...
  type: 'relationship',
  relationTo: 'products',
}
```

## 配置选项

| **属性**             | **描述**                                                     |
| -------------------- | ------------------------------------------------------------ |
| **name***            | 用作存储和从数据库中检索时的属性名称。                       |
| **relationTo***      | 提供一个或多个集合 slug，以便可以将关系分配给这些集合。      |
| **filterOptions**    | 用于过滤 UI 中显示的选项并进行验证的查询。                   |
| **hasMany**          | 如果设置为 `true`，允许此字段有多个关联，而不仅仅是一个。    |
| **minRows**          | 一个数字，表示当值存在时，验证时允许的最少项目数。与 `hasMany` 一起使用。 |
| **maxRows**          | 一个数字，表示当值存在时，验证时允许的最多项目数。与 `hasMany` 一起使用。 |
| **maxDepth**         | 设置此字段的最大填充深度，无论其他字段的深度如何。           |
| **label**            | 在管理面板中使用的字段标签文本，或具有每种语言键的对象。     |
| **unique**           | 强制集合中的每个条目对该字段具有唯一值。                     |
| **validate**         | 提供一个自定义验证函数，将在管理面板和后端执行。             |
| **index**            | 为此字段构建索引以提高查询速度。如果您的用户经常对该字段的数据执行查询，请将此字段设置为 `true`。 |
| **saveToJWT**        | 如果此字段是顶级字段并嵌套在支持身份验证的配置中，则将其数据包含在用户的 JWT 中。 |
| **hooks**            | 提供字段钩子以控制此字段的逻辑。                             |
| **access**           | 提供字段访问控制，以指示哪些用户可以查看和操作此字段的数据。 |
| **hidden**           | 完全限制此字段在所有 API 中的可见性。仍会保存到数据库中，但不会出现在任何 API 或管理面板中。 |
| **defaultValue**     | 提供用于此字段的默认值的数据。                               |
| **localized**        | 启用此字段的本地化。需要在基础配置中启用本地化。             |
| **required**         | 要求此字段具有值。                                           |
| **admin**            | 特定于管理面板的配置。                                       |
| **custom**           | 为插件添加自定义数据的扩展点。                               |
| **typescriptSchema** | 通过提供 JSON 模式来覆盖字段类型生成。                       |
| **virtual**          | 设置为 `true`，以在数据库中禁用此字段。参见虚拟字段。        |
| **graphQL**          | 为字段提供自定义 GraphQL 配置。                              |

*带星号的属性为必填项。*

> [!TIP]
>
> 深度 (Depth) 参数可以用于自动填充通过 API 返回的相关文档。

## 管理面板选项

要自定义关系字段在管理面板中的外观和行为，可以使用以下管理选项：

```javascript
import type { Field } from 'payload'

export const MyRelationshipField: Field = {
  // ...
  admin: {
    
    // ...
  },
}
```

关系字段继承了来自基本字段管理配置的所有默认选项，并且具有以下附加选项：

| 属性        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| isSortable  | 如果您希望此字段在管理 UI 中可通过拖放进行排序，请设置为 true（仅在 `hasMany` 设置为 true 时有效）。 |
| allowCreate | 如果您希望禁用在关系字段中创建新文档的功能，请设置为 false。 |
| allowEdit   | 如果您希望禁用在关系字段中编辑文档的功能，请设置为 false。   |
| sortOptions | 定义关系字段下拉框中选项的默认排序顺序。更多信息。           |

### 排序选项

您可以通过两种方式指定 `sortOptions`：

#### 作为字符串：

提供一个字符串来定义所有关系字段下拉框的全局默认排序字段。您可以在字段名前加上减号 ("-") 来按降序排序。

示例：

```
sortOptions: 'fieldName',
```

#### 作为对象配置：

您可以指定一个对象，其中键是集合的 slug，值是表示按哪个字段排序的字符串。这允许为每个集合的关系下拉框设置不同的排序字段。

示例：

```
sortOptions: {
  "pages": "fieldName1",
  "posts": "-fieldName2",
  "categories": "fieldName3"
}
```

在此配置中：

- 与页面相关的下拉框将按 "fieldName1" 升序排序。
- 与帖子相关的下拉框将使用 "fieldName2" 按降序排序（通过 "-" 前缀标记）。
- 与类别相关的下拉框将根据 "fieldName3" 按升序排序。

注意：如果未定义 `sortOptions`，则将使用关系字段下拉框的默认排序行为。

## 筛选关系选项

可以通过提供查询约束动态限制选项，这些约束将用于验证输入并在 UI 中筛选可用的关系。

`filterOptions` 属性可以是一个 `Where` 查询，或者一个返回布尔值的函数（返回 `true` 表示不筛选，返回 `false` 表示禁止所有，或者返回一个 `Where` 查询）。当使用函数时，它会接收一个包含以下属性的对象作为参数：

| 属性名称      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `blockData`   | 最近父块的数据。如果字段不在块内，或者在列表视图中的筛选器组件中调用，则为 `undefined`。 |
| `data`        | 当前正在编辑的完整集合或全局文档的对象。如果在列表视图中的筛选器组件中调用，则为一个空对象。 |
| `id`          | 当前正在编辑的文档 ID。如果在创建操作期间或在列表视图中的筛选器组件中调用，则为 `undefined`。 |
| `relationTo`  | 要筛选的集合标识符，限制为该字段的 `relationTo` 属性。       |
| `req`         | Payload 请求对象，包含对 payload、用户、语言环境等的引用。   |
| `siblingData` | 仅包含与此字段同一父项下字段的数据的对象。在列表视图中的筛选器组件中调用时，返回空对象。 |
| `user`        | 当前经过身份验证的用户对象。                                 |

## 示例

```javascript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'purchase',
      type: 'relationship',
      relationTo: ['products', 'services'],
      filterOptions: ({ relationTo, siblingData }) => {
        // returns a Where query dynamically by the type of relationship
        if (relationTo === 'products') {
          return {
            stock: { greater_than: siblingData.quantity },
          }
        }

        if (relationTo === 'services') {
          return {
            isAvailable: { equals: true },
          }
        }
      },
    },
  ],
}
```

您可以在此了解更多关于编写查询的信息。

> [!NOTE]
>
> 当一个关系字段同时具有 `filterOptions` 和自定义的 `validate` 函数时，API 默认不会验证 `filterOptions`，除非您在 `validate` 函数中调用从 `payload/shared` 导入的默认关系字段验证函数。

## 双向关系

关系字段本身用于定义包含该关系字段的文档之间的关系，这可以视为“单向”关系。例如，如果您有一个帖子（Post），它有一个类别（Category）关系字段，那么相关的类别本身不会显示任何关于设置了该类别的帖子的信息。

然而，关系字段可以与 Join 字段结合使用，产生强大的双向关系定义能力。如果您对双向关系感兴趣，可以查看 Join 字段的文档。

### 如何保存数据

由于关系字段类型的多样化选项，用于创建和更新这些字段的数据形态可能会有所不同。以下部分将描述在这种字段下可能出现的各种数据形态。

#### Has One

最简单的关系模式是使用 `hasMany: false` 和一个允许只有一种类型集合的 `relationTo`。

```javascript
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owner', // required
      type: 'relationship', // required
      relationTo: 'users', // required
      hasMany: false,
    }
  ]
}
```

这种方式配置的字段保存数据的形态如下：

```
{
  // 关联用户的 ObjectID
  "owner": "6031ac9e1289176380734024"
}
```

当通过 REST API 查询该集合中的文档时，可以按如下方式进行查询：

`?where[owner][equals]=6031ac9e1289176380734024`

#### Has One - 多态

也称为动态引用，在此配置中，relationTo 字段是一个集合 slug 数组，用于告诉 Payload 哪些集合可以被引用。

```json
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owner', // required
      type: 'relationship', // required
      relationTo: ['users', 'organizations'], // required
      hasMany: false,
    }
  ]
}
```

保存具有多种关系类型的文档的数据结构将是：

```json
{
  "owner": {
    "relationTo": "organizations",
    "value": "6031ac9e1289176380734024"
  }
}
```

这是查询此数据的示例（请注意引用 `owner.value` 的差异）：

`?where[owner.value][equals]=6031ac9e1289176380734024`。

您还可以查询与特定集合有关系的字段：

`?where[owners.relationTo][equals]=organizations`。

此查询仅返回与“organizations”集合有所有者关系的文档。

#### Has Many

`hasMany` 告诉 Payload 该字段可能保存多个集合。

```json
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owners', // required
      type: 'relationship', // required
      relationTo: 'users', // required
      hasMany: true,
    }
  ]
}
```

要保存到 `hasMany` 关系字段，我们需要发送一个包含 ID 的数组：

```json
{
  "owners": ["6031ac9e1289176380734024", "602c3c327b811235943ee12b"]
}
```

查询文档时，数组的格式不会改变：

`?where[owners][equals]=6031ac9e1289176380734024`

#### Has Many - 多态

```json
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owners', // 必需
      type: 'relationship', // 必需
      relationTo: ['users', 'organizations'], // 必需
      hasMany: true,
      required: true,
    }
  ]
}
```

具有 `hasMany` 设置为多个集合类型的关系字段，其数据以对象数组的形式保存——每个对象包含 `relationTo` 值（集合的 slug）和相关文档的 ID（`value`）：

```json
{
  "owners": [
    {
      "relationTo": "users",
      "value": "6031ac9e1289176380734024"
    },
    {
      "relationTo": "organizations",
      "value": "602c3c327b811235943ee12b"
    }
  ]
}
```

查询方式与前面的多态示例相同：

`?where[owners.value][equals]=6031ac9e1289176380734024`。

#### 查询和筛选多态关系

多态和非多态关系的查询方式不同，因为相关数据的存储方式以及它们在不同集合中的一致性问题。因此，在集合列表管理界面中过滤多态关系字段时，仅限于使用 ID 值。

对于多态关系，响应将始终是一个包含对象的数组。每个对象将包含 `relationTo` 和 `value` 属性。

可以通过相关文档的 ID 查询数据：

`?where[field.value][equals]=6031ac9e1289176380734024`。

或者通过相关文档的集合 slug 查询：

`?where[field.relationTo][equals]=your-collection-slug`。

然而，您不能对相关文档中的任何字段值进行查询。由于我们引用了多个集合，您查询的字段可能不存在，这样会导致查询失败。

> [!NOTE]
>
> 您不能像查询非多态关系那样查询多态关系中的字段。

