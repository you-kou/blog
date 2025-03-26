# 本地化

本地化是现代 CMS 中最重要的功能之一。它允许您管理多种语言的内容，然后根据用户请求的语言提供相应的内容。这类似于 I18n，但不同之处在于，您管理的不是应用程序界面的翻译，而是数据本身的翻译。

借助本地化，您可以根据用户的特定语言偏好提供个性化内容，比如多语言网站或多站点应用程序。您的 Payload 项目可以添加的语言数量没有限制。

要配置本地化，请在 Payload 配置中使用 `localization` 键：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  localization: {
    
    // ...
  },
})
```

## 配置选项

在 Payload 配置中添加 `localization` 属性，可以在整个项目中启用本地化功能。您需要提供支持的所有语言的列表，并设置其他一些选项。

要配置语言，请在 Payload 配置中使用 `localization.locales` 属性：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  localization: {
    locales: ['en', 'es', 'de'], // required
    defaultLocale: 'en', // required
  },
})
```

您还可以使用完整的配置对象来定义语言：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    // collections go here
  ],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Arabic',
        code: 'ar',
        // opt-in to setting default text-alignment on Input fields to rtl (right-to-left)
        // when current locale is rtl
        rtl: true,
      },
    ],
    defaultLocale: 'en', // required
    fallback: true, // defaults to true
  },
})
```

> [!TIP]
>
> 本地化与 I18n 配合使用效果非常好。

以下选项可用：

| **选项**                   | **描述**                                                     |
| -------------------------- | ------------------------------------------------------------ |
| **locales**                | 支持的所有语言数组。更多详情                                 |
| **defaultLocale**          | 必填字符串，必须与提供的语言数组中的某个语言代码匹配。默认情况下，如果未指定语言，文档将以此语言返回。 |
| **fallback**               | 布尔值，启用“回退”语言功能。如果请求文档时某个字段没有对应语言的本地化值，启用此属性后，文档会自动回退到回退语言的值。未启用时，除非在请求中明确提供回退，否则不会填充值。默认启用（`true`）。 |
| **filterAvailableLocales** | 一个函数，接收语言数组和 `req` 参数，返回要在管理 UI 选择器中显示的语言。 |

### 语言设置（Locales）

`locales` 数组是您希望支持的所有语言的列表。它可以是每种语言代码的字符串，也可以是更高级选项的完整配置对象。

语言代码不需要特定格式，您可以自行决定如何表示您的语言设置。常见的模式包括使用两字母的 ISO 639 语言代码，或者四字母的语言和国家代码（ISO 3166‑1），例如 `en-US`、`en-UK`、`es-MX` 等。

#### 语言对象（Locale Object）

| **选项**           | **描述**                                                     |
| ------------------ | ------------------------------------------------------------ |
| **code***          | 用于在 API 中标识语言的唯一代码，也用于 `locale` 和 `fallbackLocale`。**（必填）** |
| **label**          | 选择语言时用于显示的字符串，或者是一个对象，按 i18n 的键设置不同语言下的显示文本。 |
| **rtl**            | 布尔值，如果设置为 `true`，管理界面将以从右到左（Right-To-Left）的方式显示（适用于阿拉伯语、希伯来语等 RTL 语言）。 |
| **fallbackLocale** | 如果文档属性不存在，回退到此语言代码对应的内容。             |

**带星号（\*）的选项是必填项**

#### 筛选可用选项

在某些项目中，您可能希望筛选管理界面选择器中显示的可用语言。您可以在 Payload 配置中提供 `filterAvailableLocales` 函数来实现此功能。该函数在服务器端调用，并接收语言数组作为参数。这意味着您可以决定哪些语言显示在管理面板顶部的语言选择菜单中。您可以按用户筛选，或实现一个按租户等范围限制的函数。以下是在多租户应用程序中使用请求头的示例：

```javascript
// ... rest of payload config
localization: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  filterAvailableLocales: async ({ req, locales }) => {
    if (getTenantFromCookie(req.headers, 'text')) {
      const fullTenant = await req.payload.findByID({
        id: getTenantFromCookie(req.headers, 'text') as string,
        collection: 'tenants',
        req,
      })
      if (fullTenant && fullTenant.supportedLocales?.length) {
        return locales.filter((locale) => {
          return fullTenant.supportedLocales?.includes(locale.code as 'en' | 'es')
        })
      }
    }
    return locales
  },
}
```

由于筛选发生在应用程序的根级别，并且其结果不会在每次导航到新页面时重新计算，因此您可能需要在自定义组件中调用 `router.refresh`，以监视影响结果的值变化。在上面的示例中，当租户文档中的 `supportedLocales` 发生变化时，您可能需要执行此操作。

## 字段本地化

Payload 的本地化功能作用在**字段级别**，而不是**文档级别**。除了在基础 Payload 配置中启用本地化支持外，您还需要为每个想要本地化的字段单独指定设置。

以下是为字段启用本地化的示例：

```javascript
{
  name: 'title',
  type: 'text',
  localized: true,
}
```

通过上述配置，`title` 字段现在将在数据库中保存为包含所有语言的对象，而不再是单一字符串。

所有带有 `name` 属性的字段类型都支持 `localized` 属性——甚至包括数组和区块等更复杂的字段类型。

> [!NOTE]
>
> 对支持嵌套字段的字段类型启用本地化时，会自动为该字段内的所有子字段创建本地化“集合”。例如，如果您有一个使用 `blocks` 字段类型的页面布局，您可以选择在顶层的 `blocks` 字段上启用本地化，从而本地化整个布局，或者仅本地化布局中的某些字段。

> [!IMPORTANT]
>
> 当将现有字段从 `localized: true` 转换为非本地化，或从非本地化转换为 `localized: true` 时，文档中的数据结构会发生变化，因此该字段的现有数据将丢失。在更改已有数据的字段本地化设置之前，您可能需要考虑字段迁移策略。

## 获取本地化文档

在检索文档时，您可以指定希望接收的语言以及要使用的回退语言。

### REST API

REST API 的本地化功能依赖 URL 查询参数。

**`?locale=`**
 通过在端点 URL 中直接提供 `locale` 查询参数来指定您想要的语言。

**`?fallback-locale=`**
 通过提供 `fallback-locale` 查询参数来指定要使用的回退语言。
 这可以是您基础 Payload 配置中提供的有效语言，也可以是 `'null'`、`'false'` 或 `'none'` 来禁用回退功能。

**示例**:

```javascript
fetch('https://localhost:3000/api/pages?locale=es&fallback-locale=none');
```

### GraphQL API

 在 GraphQL API 中，您可以为所有相关的查询和变更指定 `locale` 和 `fallbackLocale` 参数。

**`locale`** 参数只接受有效的语言代码，但语言代码会自动格式化为有效的 GraphQL 枚举值（短横线或特殊字符将被转换为下划线，空格将被移除等）。如果您想查看语言代码是如何自动格式化的，可以使用 GraphQL Playground 查看。

**`fallbackLocale`** 参数接受有效的语言代码，也接受 `none` 来禁用回退功能。

**示例**:

```javascript
query {
  Posts(locale: de, fallbackLocale: none) {
    docs {
      title
    }
  }
}
```

在 GraphQL 中，在查询的顶层指定 `locale` 将自动应用到所有嵌套的关联字段中。您可以通过在嵌套的关联文档查询中重新指定 `locale` 参数来覆盖此行为。

### 本地 API

您可以在本地 API 中将 `locale` 和 `fallbackLocale` 作为 `options` 参数的属性进行指定。**`locale`** 属性接受任何有效的语言代码。**`fallbackLocale`** 属性接受任何有效的语言代码，同时也支持 `'null'`、`'false'`、`false` 和 `'none'` 来禁用回退功能。

**示例**:

```javascript
const posts = await payload.find({
  collection: 'posts',
  locale: 'es',
  fallbackLocale: false,
})
```

> [!TIP]
>
> REST 和本地 API 可以通过将 `locale` 参数设置为 `'all'` 或 `'*'`，在一次请求中返回所有本地化数据。响应的数据结构会以完整对象的形式返回，每个字段的值都会按照各自的语言代码作为键，而不是单一的翻译值。

