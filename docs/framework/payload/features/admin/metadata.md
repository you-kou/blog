# 页面元数据

管理员面板中的每个页面都会自动接收从实时文档数据、用户当前语言环境等动态生成的元数据。这包括页面标题、描述、og:image 等，无需额外配置。

元数据可在根级别进行全面配置，并向各个集合、文档和自定义视图层层传递。这使得可以精确控制任意页面的元数据，同时提供合理的默认值。

所有元数据都会被注入到 Next.js 的 `generateMetadata` 函数中，并用于生成管理员面板页面的 `<head>`。Payload 提供了 Next.js 所有可用的元数据选项。

在管理员面板中，元数据可以在以下级别进行自定义：

- **根级元数据**
- **集合元数据**
- **全局元数据**
- **视图元数据**

所有这些类型的元数据结构类似，但根级别有一些关键区别。要自定义元数据，请参考可用范围列表，确定适用的范围，并在 Payload 配置中编写相应的元数据。

## 根级元数据

根级元数据适用于管理员面板中的所有页面。在这里，您可以控制诸如每个页面标题的后缀、浏览器标签页中显示的 favicon，以及在社交媒体上分享管理员面板时使用的 Open Graph 数据等内容。

要自定义根级元数据，请在 Payload 配置中使用 `admin.meta` 键：

```javascript
{
  // ...
  admin: {
    meta: {
      title: 'My Admin Panel',
      description: 'The best admin panel in the world',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
    },
  },
}
```

根级元数据可用的选项如下：

| **键**               | **类型**                             | **描述**                                                     |
| -------------------- | ------------------------------------ | ------------------------------------------------------------ |
| `defaultOGImageType` | `dynamic`（默认）、`static` 或 `off` | 默认 OG 图像的类型。如果设置为 `dynamic`，Payload 将使用 Next.js 的图像生成功能，根据页面标题创建图像。设置为 `static` 时，Payload 将使用 `defaultOGImage` URL。设置为 `off` 时，Payload 不会生成 OG 图像。 |
| `titleSuffix`        | `string`                             | 在每个页面标题末尾追加的后缀。默认值为 `"- Payload"`。       |
| `[keyof Metadata]`   | `unknown`                            | Next.js `generateMetadata` 函数支持的所有其他属性。          |

> [!NOTE]
>
> 这些是管理员面板的根级选项。您还可以在集合、全局和文档级别通过各自的配置自定义元数据。

### 图标

图标配置对应于 `<link>` 标签，这些标签用于指定管理员面板的图标。`icons` 键是一个对象数组，每个对象代表一个独立的图标。图标通过 `rel` 属性进行区分，该属性指定了文档与图标之间的关系。

最常见的图标类型是 **favicon**，它显示在浏览器标签页中，由 `rel="icon"` 指定。其他常见的图标类型包括：

- **`apple-touch-icon`**：当管理员面板被保存到 Apple 设备的主屏幕时使用。
- **`mask-icon`**：Safari 用于遮罩管理员面板图标的图标。

要自定义图标，请在 Payload 配置中使用 `admin.meta.icons` 属性：

```javascript
{
  // ...
  admin: {
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/apple-touch-icon.png',
        },
      ],
    },
  },
}
```

要查看所有可用的图标选项，请参阅 Next.js 官方文档。

### Open Graph

Open Graph 元数据是一组标签，用于控制 URL 在社交媒体平台上分享时的显示方式。Payload 会自动生成 Open Graph 元数据，但可以在根级别进行自定义。

要自定义 Open Graph 元数据，请在 Payload 配置中使用 `admin.meta.openGraph` 属性：

```javascript
{
  // ...
  admin: {
    meta: {
      openGraph: {
        description: 'The best admin panel in the world',
        images: [
          {
            url: 'https://example.com/image.jpg',
            width: 800,
            height: 600,
          },
        ],
        siteName: 'Payload',
        title: 'My Admin Panel',
      },
    },
  },
}
```

要查看所有可用的 Open Graph 选项，请参阅 Next.js 官方文档。

### Robots

`robots` 属性用于控制管理员面板 `<head>` 中渲染的 `robots` 元标签，可用于管理搜索引擎如何索引页面及其在搜索结果中的显示方式。

默认情况下，管理员面板的设置会阻止搜索引擎索引其中的页面。

要自定义 Robots 配置，请在 Payload 配置中使用 `admin.meta.robots` 属性：

```javascript
{
  // ...
  admin: {
    meta: {
      robots: 'noindex, nofollow',
    },
  },
}
```

要查看所有可用的 Robots 选项，请参阅 Next.js 官方文档。

### 防止爬取

尽管通过 `admin.meta.robots` 设置元标签可以阻止搜索引擎索引网页，但它并不能完全阻止页面被爬取。

如果要彻底防止页面被爬取，请在项目的根目录下添加 `robots.txt` 文件。

```properties
User-agent: *
Disallow: /admin/
```

如果您通过 `config.routes` 自定义了管理员面板的路径，请确保相应更新 `robots.txt` 文件中的 `Disallow` 指令，以匹配您的自定义路径。

## 集合元数据

集合元数据适用于管理员面板中某个特定集合的所有页面。它用于自定义该集合中所有视图的标题和描述，除非视图本身进行了覆盖。

要自定义集合元数据，请在集合配置中使用 `admin.meta` 键：

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    meta: {
      title: 'My Collection',
      description: 'The best collection in the world',
    },
  },
}
```

集合元数据的配置选项与根级元数据的配置相同。

## 全局元数据

全局元数据适用于管理员面板中某个特定全局配置的所有页面。它用于自定义该全局配置中所有视图的标题和描述，除非视图本身进行了覆盖。

要自定义全局元数据，请在全局配置中使用 `admin.meta` 键：

```javascript
import { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    meta: {
      title: 'My Global',
      description: 'The best admin panel in the world',
    },
  },
}
```

全局元数据的配置选项与根级元数据的配置相同。

## 视图元数据

视图元数据适用于管理员面板中的特定视图。它用于自定义特定视图的标题和描述，并会覆盖在根级、集合级或全局级设置的元数据。

要自定义视图元数据，请在视图配置中使用 `meta` 键：

```javascript
{
  // ...
  admin: {
    views: {
      dashboard: {
        meta: {
          title: 'My Dashboard',
          description: 'The best dashboard in the world',
        }
      },
    },
  },
}
```

