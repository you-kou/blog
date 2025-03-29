# 字段概述

字段是 Payload 的构建块。它们定义将存储在数据库中的文档的模式，并自动在管理面板中生成相应的 UI。

有许多字段类型可供选择，从简单的文本字符串到嵌套的数组和区块应有尽有。大多数字段将数据保存到数据库，而其他字段则仅用于展示。字段可以具有自定义验证、条件逻辑、访问控制、钩子等功能。

字段的外观和行为可以根据需要进行无限制的自定义，而不会影响其底层数据结构。字段设计为能够通过使用自定义字段组件进行大量修改甚至完全替换。

要配置字段，可以在您的集合或全局配置中使用 `fields` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const Page: CollectionConfig = {
  // ...
  fields: [
    
    // ...
  ],
}
```

## 字段类型

Payload 提供了多种内置字段类型，每种类型都有其独特的属性和行为，这些属性和行为决定了它可以接受哪些值、在 API 中的呈现方式以及在管理面板中的渲染方式。

要配置字段，可以在您的集合或全局配置中使用 `fields` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const Page: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'field',
      type: 'text',
    },
  ],
}
```

> [!NOTE]
>
> 每个字段都是一个对象，至少包含 `type` 属性。该属性将字段与其对应的字段类型匹配。

Payload 中的字段主要分为三个类别：

1. **数据字段**
2. **展示字段**
3. **虚拟字段**

在开始编写字段之前，首先确定哪个字段类型最适合您的应用程序。然后根据您选择的字段类型，使用相应的字段选项进行配置。

### 数据字段

数据字段用于在数据库中存储数据。所有数据字段都有一个 `name` 属性，这是用来存储字段值的键。

以下是可用的数据字段类型：

- **Array** - 用于重复内容，支持嵌套字段
- **Blocks** - 用于基于块的内容，支持嵌套字段
- **Checkbox** - 保存布尔值 true / false
- **Code** - 渲染代码编辑器界面，保存字符串
- **Date** - 渲染日期选择器，保存时间戳
- **Email** - 确保值是正确格式的电子邮件地址
- **Group** - 在一个键值对象中嵌套字段
- **JSON** - 渲染 JSON 编辑器界面，保存 JSON 对象
- **Number** - 保存数值型数据
- **Point** - 用于位置数据，保存几何坐标
- **Radio** - 渲染单选按钮组，只允许选择一个值
- **Relationship** - 分配关系到其他集合
- **Rich Text** - 渲染一个完全可扩展的富文本编辑器
- **Select** - 渲染一个下拉列表 / 选择器
- **Tabs (Named)** - 类似于 Group，但在标签布局中渲染嵌套字段
- **Text** - 简单的文本输入，保存字符串
- **Textarea** - 类似于文本字段，但允许多行输入
- **Upload** - 允许本地文件和图片上传

### 展示字段

展示字段不在数据库中存储数据。相反，它们用于在管理面板中组织和展示其他字段，或添加自定义 UI 组件。

以下是可用的展示字段类型：

1. **Collapsible** - 在可折叠组件内嵌套字段
2. **Row** - 将字段水平对齐
3. **Tabs (Unnamed)** - 在无名标签布局中嵌套字段
4. **UI** - 空白字段，用于自定义 UI 组件

### 虚拟字段

虚拟字段用于显示不存储在数据库中的数据。它们非常适合显示通过钩子等计算得到的值，这些值将出现在 API 响应中。

以下是可用的虚拟字段类型：

- **Join** - 实现字段之间的双向数据绑定

> [!TIP]
>
> 没有看到您需要的内置字段类型？可以创建它！通过结合字段验证和自定义组件，您可以覆盖组件在管理面板中的整个功能，从而有效地创建自己的字段类型。

## 字段选项

所有字段至少需要一个 `type` 属性。该属性将字段与其对应的字段类型匹配，以确定字段在管理面板中的外观和行为。每种字段类型都有其独特的选项集，这些选项取决于其类型。

要设置字段的类型，请在字段配置中使用 `type` 属性：

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text', 
  name: 'myField',
}
```

### 字段名称

所有数据字段都需要一个 `name` 属性。该属性是用来在数据库中存储和检索字段值的键。此属性在字段的同级字段中必须是唯一的。

要设置字段的名称，请在字段配置中使用 `name` 属性：

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text',
  name: 'myField', 
}
```

Payload 保留了一些字段名称供内部使用。使用这些保留字段名称将导致该字段从配置中被清除。

以下字段名称是禁止使用的，不能作为字段名：

- `__v`
- `salt`
- `hash`
- `file`

### 字段级钩子

除了可以在文档级别定义钩子外，您还可以在字段级别定义更精细的逻辑。

要定义字段级钩子，请在字段配置中使用 `hooks` 属性：

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text',
  name: 'myField',
  hooks: {
    // ...
  },
}
```

### 字段级访问控制

除了可以在文档级别定义访问控制外，您还可以在字段级别定义更精细的权限。

要定义字段级访问控制，请在字段配置中使用 `access` 属性：

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text',
  name: 'myField',
  access: {
    // ...
  },
}
```

### 默认值

字段可以选择预填充初始值。在创建或更新操作时，默认值可用于管理面板和 API 请求，以填充缺失或未定义的字段值。

要设置字段的默认值，请在字段配置中使用 `defaultValue` 属性：

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text',
  name: 'myField',
  defaultValue: 'Hello, World!', 
}
```

默认值可以定义为静态值或返回值的函数。当 `defaultValue` 被静态定义时，Payload 的数据库适配器会将其应用于数据库架构或模型。

函数形式的 `defaultValue` 可以使用以下参数属性：

- **user** - 已认证的用户对象
- **locale** - 当前选定的语言区域字符串
- **req** - PayloadRequest 对象

以下是 `defaultValue` 函数的示例：

```javascript
import type { Field } from 'payload'

const translation: {
  en: 'Written by'
  es: 'Escrito por'
}

export const myField: Field = {
  name: 'attribution',
  type: 'text',
  defaultValue: ({ user, locale, req }) =>
    `${translation[locale]} ${user.name}`,
}
```

> [!TIP]
>
> 你可以使用 **async defaultValue** 函数，通过 `req.payload` 从 API 请求或本地 API 获取数据来填充字段。

### 验证

字段会根据其 **字段类型**（Field Type）和 **字段选项**（Field Options）自动进行验证，例如 `required` 或 `min`、`max` 值限制等。

如果需要，你可以自定义或完全替换默认验证逻辑，方法是在字段配置中使用 `validate` 属性：

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text',
  name: 'myField',
  validate: (value) => Boolean(value) || 'This field is required', 
}
```

自定义验证函数应返回 `true`（表示验证通过）或一个字符串（表示错误信息，将在 API 响应中显示）。

`validate` 函数接收以下参数：

| 参数    | 描述                       |
| ------- | -------------------------- |
| `value` | 被验证字段的值             |
| `ctx`   | 包含额外数据和上下文的对象 |

#### 验证上下文（Validation Context）

`ctx` 参数包含完整的文档数据、同级字段数据、当前操作信息，以及其他有用信息（如当前认证用户）

```javascript
import type { Field } from 'payload'

export const MyField: Field = {
  type: 'text',
  name: 'myField',
  validate: (val, { user }) =>
    Boolean(user) || 'You must be logged in to save this field',
}
```

以下附加属性包含在 `ctx` 对象中：

| 属性          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `data`        | 包含当前正在编辑的完整集合或全局文档的对象。                 |
| `siblingData` | 包含仅限于此字段同级父级范围内的文档数据的对象。             |
| `operation`   | 根据 UI 操作或 API 调用，值为 `create` 或 `update`。         |
| `path`        | 字段在模式中的完整路径，表示为字符串片段数组，包括数组索引。例如 `['group', 'myArray', '1', 'textField']`。 |
| `id`          | 当前正在编辑的文档 ID。在 `create` 操作时未定义。            |
| `req`         | 当前 HTTP 请求对象，包含 `payload`、`user` 等信息。          |
| `event`       | 取值 `onChange` 或 `submit`，取决于当前操作。用于性能优化。  |

#### 复用默认字段验证

当使用自定义验证函数时，Payload 会用你的验证替换默认验证。然而，你可能只想在默认验证的基础上添加自定义逻辑。

要复用默认字段验证，可以在自定义验证函数内调用它们：

```javascript
import { text } from 'payload/shared'

const field: Field = {
  name: 'notBad',
  type: 'text',
  validate: (val, args) => {
    if (val === 'bad') return 'This cannot be "bad"'
    return text(val, args) 
  },
}
```

以下是所有默认字段验证函数的列表：

```javascript
import {
  array,
  blocks,
  checkbox,
  code,
  date,
  email,
  group,
  json,
  number,
  point,
  radio,
  relationship,
  richText,
  select,
  tabs,
  text,
  textarea,
  upload,
} from 'payload/shared'
```

#### 异步字段验证

自定义验证函数可以根据需要是异步的。这使得可以请求外部服务或执行其他各种异步逻辑。

在编写异步验证函数时，需要考虑性能影响。验证会在每次字段更改时执行，因此应尽可能轻量。如果需要执行高开销的验证（例如查询数据库），请考虑使用 `ctx` 对象中的 `event` 属性，仅在表单提交时运行验证。

要编写异步验证函数，请使用 `async` 关键字定义函数：

```javascript
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    {
      name: 'customerNumber',
      type: 'text',
      validate: async (val, { event }) => {
        if (event === 'onChange') {
          return true
        }

        // only perform expensive validation when the form is submitted
        const response = await fetch(`https://your-api.com/customers/${val}`)

        if (response.ok) {
          return true
        }

        return 'The customer number provided does not match any customers within our records.'
      },
    },
  ],
}
```

## 自定义 ID 字段

所有集合都会自动生成自己的 ID 字段。如果需要，可以通过在配置中提供显式的 ID 字段来覆盖此行为。该字段应为必填字段，或者通过 Hook 动态生成 ID。

要定义自定义 ID 字段，请添加一个顶级字段，并将 `name` 属性设置为 `id`：

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  fields: [
    {
      name: 'id', 
      required: true,
      type: 'number',
    },
  ],
}
```

> [!NOTE]
>
> 自定义 ID 字段只能是 `Number` 或 `Text` 类型。类型为 `Text` 的自定义 ID 字段不得包含 `/` 或 `.` 字符。

## 管理员选项

您可以通过字段配置中的 `admin` 属性自定义字段在管理面板中的外观和行为。

```javascript
import type { CollectionConfig } from 'payload'

export const CollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'myField',
      type: 'text',
      admin: {
        
        // ...
      },
    },
  ],
}
```

以下选项可用：

| 选项                  | 描述                                                         |
| --------------------- | ------------------------------------------------------------ |
| **condition**         | 根据其他字段的值以编程方式显示/隐藏字段。更多详情。          |
| **components**        | 可将所有字段组件替换为自定义组件。                           |
| **description**       | 在字段旁边显示的辅助文本，为编辑者提供更多信息。更多详情。   |
| **position**          | 通过 `position: 'sidebar'` 指定字段是否应呈现在侧边栏中。    |
| **width**             | 限制字段的宽度。可以传递像素、百分比等字符串值。特别适用于 `Row` 类型中的字段，以便水平排列。 |
| **style**             | 在字段的根元素中注入 CSS 样式属性。                          |
| **className**         | 为字段的根 DOM 元素附加 CSS 类。                             |
| **readOnly**          | 仅在管理面板中设置字段为只读，对 API 无影响，防止编辑者修改字段值。 |
| **disabled**          | 如果字段被禁用，它将在管理面板中完全被隐藏。                 |
| **disableBulkEdit**   | 设为 `true` 以防止字段出现在批量编辑的选项中。对于 UI 字段，默认值为 `true`。 |
| **disableListColumn** | 设为 `true` 以防止字段出现在列表视图的列选择器中。           |
| **disableListFilter** | 设为 `true` 以防止字段出现在列表视图的筛选选项中。           |
| **hidden**            | 将字段转换为隐藏输入类型。它的值仍会随管理面板中的请求提交，但字段本身对编辑者不可见。 |

### 字段描述

字段描述用于为编辑者提供关于字段的额外信息，例如特殊说明。描述的位置因字段类型而异，但通常会以较为低调的样式显示在字段输入框下方。

字段描述可通过以下三种方式配置：

- 作为字符串。
- 作为返回字符串的函数。更多详情。
- 作为 React 组件。更多详情。

要为字段添加自定义描述，请在字段配置中使用 `admin.description` 属性。

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'myField',
      type: 'text',
      admin: {
        description: 'Hello, world!', 
      },
    },
  ],
}
```

> [!NOTE]
>
> 要使用自定义组件替换字段描述，请使用 `admin.components.Description` 属性。更多详情。

#### 描述函数

自定义描述也可以定义为一个函数。描述函数在服务器上执行，并可以根据用户当前的语言环境格式化简单的描述。

要将描述函数添加到字段，请在字段配置中将 `admin.description` 属性设置为一个函数：

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'myField',
      type: 'text',
      admin: {
        description: ({ t }) => `${t('Hello, world!')}`, 
      },
    },
  ],
}
```

所有描述函数都会接收以下参数：

| 参数 | 描述                                  |
| ---- | ------------------------------------- |
| t    | 用于国际化管理面板的 t 函数。更多细节 |

> [!NOTE]
>
> 如果需要在表单内订阅实时更新，请使用描述组件代替。

### 条件逻辑

你可以根据其他字段的值显示或隐藏字段，通过在字段上使用条件逻辑。字段的 `admin.config` 中的 `condition` 属性接受一个函数，该函数接受以下参数：

| 参数        | 描述                                         |
| ----------- | -------------------------------------------- |
| data        | 当前正在编辑的整个文档的数据。               |
| siblingData | 仅包含与该字段为同级的字段数据。             |
| ctx         | 一个包含有关字段位置和用户的附加信息的对象。 |

`ctx` 对象：

| 属性      | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| blockData | 最近的父级区块数据。如果字段不在区块内，则为 `undefined`。   |
| path      | 字段在架构中的完整路径，表示为一个字符串数组，包含数组索引。例如：`['group', 'myArray', '1', 'textField']`。 |
| user      | 当前已认证的用户对象。                                       |

`condition` 函数应该返回一个布尔值，用于控制字段是否显示。

示例：

```javascript
{
  fields: [
    {
      name: 'enableGreeting',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'greeting',
      type: 'text',
      admin: {
        condition: (data, siblingData, { blockData, path, user }) => {
          if (data.enableGreeting) {
            return true
          } else {
            return false
          }
        },
      },
    },
  ]
}
```

### 自定义组件

在管理面板中，字段有三个不同的呈现位置：

- **Field** - 在编辑视图中渲染的实际表单字段。
- **Cell** - 在列表视图中渲染的表格单元格组件。
- **Filter** - 在列表视图中渲染的筛选组件。
- **Diff** - 在版本差异视图中渲染的差异组件。

要将字段组件替换为你自己的组件，可以在字段配置中使用 `admin.components` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const CollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      // ...
      admin: {
        components: {
          
          // ...
        },
      },
    },
  ],
}
```

以下选项可用：

| 组件            | 描述                                               |
| --------------- | -------------------------------------------------- |
| **Field**       | 编辑视图中渲染的表单字段。更多详情。               |
| **Cell**        | 列表视图中渲染的表格单元格。更多详情。             |
| **Filter**      | 列表视图中渲染的筛选组件。更多详情。               |
| **Label**       | 覆盖字段组件的默认标签。更多详情。                 |
| **Error**       | 覆盖字段组件的默认错误信息。更多详情。             |
| **Diff**        | 覆盖在版本差异视图中渲染的差异组件。更多详情。     |
| **Description** | 覆盖字段组件的默认描述。更多详情。                 |
| **beforeInput** | 一组将在字段组件的输入框之前添加的元素。更多详情。 |
| **afterInput**  | 一组将在字段组件的输入框之后添加的元素。更多详情。 |

#### Field

字段组件是实际在编辑视图中渲染的表单字段。用户在编辑文档时与此输入框交互。

要替换为自定义的字段组件，请在字段配置中使用 `admin.components.Field` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const CollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      // ...
      admin: {
        components: {
          Field: '/path/to/MyFieldComponent', 
        },
      },
    },
  ],
}
```

有关如何构建自定义组件的详细信息，请参见《构建自定义组件》。

> [!NOTE]
>
> 除了替换整个字段组件之外，您还可以通过使用 `Label`、`Error`、`beforeInput` 和 `afterInput` 属性，仅替换或插入特定部分。

#### 默认属性

所有字段组件默认接收以下属性：

| 属性           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| docPreferences | 包含文档首选项的对象。                                       |
| field          | 在客户端组件中，这是经过清理的客户端字段配置；在服务器组件中，这是原始字段配置。服务器组件还将通过 `clientField` 属性接收清理过的字段配置（见下文）。 |
| locale         | 字段的本地化设置。更多细节。                                 |
| readOnly       | 一个布尔值，表示该字段是否为只读。                           |
| user           | 当前经过身份验证的用户。更多细节。                           |
| validate       | 一个可用于验证字段的函数。                                   |
| path           | 一个字符串，表示运行时字段的直接动态路径，例如 `myGroup.myArray.0.myField`。 |
| schemaPath     | 一个字符串，表示字段配置的直接静态路径，例如 `posts.myGroup.myArray.myField`。 |
| indexPath      | 一个以连字符分隔的字符串，表示在最近命名的祖先字段内字段的路径，例如 `0-0`。 |

除了上述属性，所有服务器组件还将接收以下属性：

| 属性        | 描述                             |
| ----------- | -------------------------------- |
| clientField | 可序列化的客户端字段配置。       |
| field       | 字段配置。                       |
| data        | 当前正在编辑的文档。             |
| i18n        | i18n 对象。                      |
| payload     | Payload 类。                     |
| permissions | 基于当前身份验证用户的字段权限。 |
| siblingData | 字段同级字段的数据。             |
| user        | 当前身份验证的用户。更多细节。   |
| value       | 渲染时字段的值。                 |

#### 发送和接收来自表单的值

当替换字段组件时，您需要负责从表单中发送和接收字段的值。

为此，从 `@payloadcms/ui` 导入 `useField` 钩子，并使用它来管理字段的值：

```javascript
'use client'
import { useField } from '@payloadcms/ui'

export const CustomTextField: React.FC = () => {
  const { value, setValue } = useField() 

  return <input onChange={(e) => setValue(e.target.value)} value={value} />
}
```

#### TypeScript

在构建自定义字段组件时，您可以导入客户端字段属性以确保组件的类型安全。每个字段类型和服务器/客户端环境都有一个明确的类型。约定是将字段类型作为前缀添加到目标类型，例如：`TextFieldClientComponent`。

```javascript
import type {
  TextFieldClientComponent,
  TextFieldServerComponent,
  TextFieldClientProps,
  TextFieldServerProps,
  // ...and so on for each Field Type
} from 'payload'
```

查看每个单独的字段类型以获取准确的类型导入。

#### Cell

Cell 组件在列表视图的表格中渲染。它表示字段的值，当该字段在表格单元格中显示时。

要替换为自定义的 Cell 组件，请在字段配置中使用 `admin.components.Cell` 属性：

```javascript
import type { Field } from 'payload'

export const myField: Field = {
  name: 'myField',
  type: 'text',
  admin: {
    components: {
      Cell: '/path/to/MyCustomCellComponent', 
    },
  },
}
```

所有 Cell 组件都接收相同的默认字段组件属性，以及以下属性：

| 属性    | 描述                                                 |
| ------- | ---------------------------------------------------- |
| link    | 一个布尔值，表示该单元格是否应该被包装在一个链接中。 |
| onClick | 一个函数，当单元格被点击时会调用此函数。             |

#### Filter

Filter 组件是实际的输入元素，显示在列表视图中的 "Filter By" 下拉菜单中，用于在构建过滤器时表示此字段。

要替换为自定义的 Filter 组件，请在您的字段配置中使用 admin.components.Filter 属性：

```javascript
import type { Field } from 'payload'

export const myField: Field = {
  name: 'myField',
  type: 'text',
  admin: {
    components: {
      Filter: '/path/to/MyCustomFilterComponent', 
    },
  },
}
```

#### Label

标签组件（Label）是在任何需要通过标签表示字段的地方渲染的组件。通常用于编辑视图（Edit View），但也可以在列表视图（List View）以及其他地方使用。

要替换为自定义的标签组件，请在您的字段配置中使用 `admin.components.Label` 属性：

```javascript
import type { Field } from 'payload'

export const myField: Field = {
  name: 'myField',
  type: 'text',
  admin: {
    components: {
      Label: '/path/to/MyCustomLabelComponent', 
    },
  },
}
```

##### TypeScript

在构建自定义标签组件时，您可以导入组件类型，以确保组件中的类型安全。每种字段类型和服务器/客户端环境都有一个显式的标签组件类型。约定是将 `LabelServerComponent` 或 `LabelClientComponent` 附加到字段类型的名称上，例如：`TextFieldLabelClientComponent`。

```javascript
import type {
  TextFieldLabelServerComponent,
  TextFieldLabelClientComponent,
  // ...and so on for each Field Type
} from 'payload'
```

#### Description

除了使用 Description 属性外，您还可以使用自定义组件作为字段描述。当您需要向用户提供更复杂的反馈时，这非常有用，例如渲染动态字段值或其他交互元素。

要将 Description 组件添加到字段中，请在您的字段配置中使用 `admin.components.Description` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'myField',
      type: 'text',
      admin: {
        components: {
          Description: '/path/to/MyCustomDescriptionComponent', 
        },
      },
    },
  ],
}
```

##### TypeScript

在构建自定义描述组件时，您可以导入组件属性以确保组件的类型安全。每个字段类型和服务器/客户端环境都有一个明确的描述组件类型。约定是将 `DescriptionServerComponent` 或 `DescriptionClientComponent` 附加到字段类型的名称后，例如 `TextFieldDescriptionClientComponent`。

```javascript
import type {
  TextFieldDescriptionServerComponent,
  TextFieldDescriptionClientComponent,
  // And so on for each Field Type
} from 'payload'
```

#### Error

错误组件在字段验证失败时呈现。通常，它显示在字段输入下方，并以视觉上引人注目的样式展示。

要替换为自定义的错误组件，请在您的字段配置中使用 `admin.components.Error` 属性：

```javascript
import type { Field } from 'payload'

export const myField: Field = {
  name: 'myField',
  type: 'text',
  admin: {
    components: {
      Error: '/path/to/MyCustomErrorComponent', 
    },
  },
}
```

##### TypeScript

在构建自定义错误组件时，您可以导入组件类型，以确保组件的类型安全。每个字段类型和服务器/客户端环境都有一个显式的错误组件类型。约定是将 `ErrorServerComponent` 或 `ErrorClientComponent` 附加到字段类型的名称，例如 `TextFieldErrorClientComponent`。

```javascript
import type {
  TextFieldErrorServerComponent,
  TextFieldErrorClientComponent,
  // And so on for each Field Type
} from 'payload'
```

#### Diff

Diff 组件在版本差异视图中呈现。仅在启用了版本控制的实体中可见。

要替换为自定义的 Diff 组件，请在您的字段配置中使用 `admin.components.Diff` 属性：

```javascript
import type { Field } from 'payload'

export const myField: Field = {
  name: 'myField',
  type: 'text',
  admin: {
    components: {
      Diff: '/path/to/MyCustomDiffComponent', 
    },
  },
}
```

##### TypeScript

在构建自定义 Diff 组件时，您可以导入组件类型以确保组件的类型安全。每个字段类型和服务器/客户端环境都有一个明确的 Diff 组件类型。约定是将 `DiffServerComponent` 或 `DiffClientComponent` 添加到字段类型后，例如 `TextFieldDiffClientComponent`。

```javascript
import type {
  TextFieldDiffServerComponent,
  TextFieldDiffClientComponent,
  // And so on for each Field Type
} from 'payload'
```

#### `afterInput` 和 `beforeInput`

通过这两个属性，您可以在输入元素之前和之后添加多个组件，正如它们的名称所示。当您需要在字段旁边渲染附加元素而不替换整个字段组件时，这非常有用。

要在输入元素之前和之后添加组件，请在您的字段配置中使用 `admin.components.beforeInput` 和 `admin.components.afterInput` 属性：

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'myField',
      type: 'text',
      admin: {
        components: {
          beforeInput: ['/path/to/MyCustomComponent'],
          afterInput: ['/path/to/MyOtherCustomComponent'],
        },
      },
    },
  ],
}
```

## TypeScript

您可以从 `payload` 包中导入 Payload 字段类型以及其他常见类型。

```javascript
import type { Field } from 'payload'
```

