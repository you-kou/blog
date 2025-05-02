# 替换为你自己的 React 组件

Payload 的后台管理面板设计极简，目的是便于自定义并让你完全掌控 UI。为实现这种高度定制化，Payload 提供了一种模式，允许你通过 Payload 配置文件提供自定义的 React 组件。

Payload 中的所有自定义组件默认都是 React 服务器组件（React Server Components）。这使得你可以在前端直接使用本地 API（Local API）。几乎后台管理面板的每个部分都支持自定义组件，实现极致的细粒度控制。

> [!NOTE]
>
> 客户端组件（Client Components）仍然完全支持。要在你的应用中使用客户端组件，只需在文件顶部添加 `'use client'` 指令。Payload 会在渲染前自动检测并移除所有不可序列化的默认 props。

Payload 中有四种主要类型的自定义组件：

1. **根组件（Root Components）**
2. **集合组件（Collection Components）**
3. **全局组件（Global Components）**
4. **字段组件（Field Components）**

要使用自定义组件，首先确定你想实现的功能对应的组件范围，然后查阅可用组件列表，并据此编写对应的 React 组件。

## 定义自定义组件

当 Payload 编译后台管理面板时，它会检查你的配置中是否存在自定义组件。如果检测到，Payload 要么用你的组件替换其默认组件，要么在默认没有组件的地方直接渲染你的组件。虽然 Payload 支持在多个位置使用自定义组件，但每个组件的定义方式都是使用组件路径。

要添加自定义组件，请在你的 Payload 配置中指向其文件路径：

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        Button: '/src/components/Logout#MyComponent', 
      },
    },
  },
})
```

### 组件路径

 了确保 Payload 配置完全兼容 Node.js 且尽可能轻量，组件不会直接在配置文件中导入。而是通过其文件路径来识别，由后台管理面板自行解析。

组件路径默认是相对于你项目的根目录的。这个根目录要么是当前工作目录，要么是配置项 `config.admin.importMap.baseDir` 中指定的目录。

使用具名导出的组件可以通过在路径末尾添加 `#` 和导出名，或使用 `exportName` 属性来指定。如果组件是默认导出，则可以省略不写。

```javascript
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  // ...
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'), 
    },
    components: {
      logout: {
        Button: '/components/Logout#MyComponent', 
      },
    },
  },
})
```

在这个示例中，我们将基础目录设置为 `src` 目录，并省略路径字符串中的 `/src/` 部分。

### 组件配置

虽然自定义组件通常定义为字符串，但你也可以传递一个包含附加选项的对象：

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        Button: {
          path: '/src/components/Logout',
          exportName: 'MyComponent',
        },
      },
    },
  },
})
```

以下是可用的选项：

| 属性            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| **clientProps** | 如果是客户端组件，将传递给自定义组件的 props。详见更多说明。 |
| **exportName**  | 与其在组件路径中使用 `#` 来声明具名导出，你也可以省略它们，直接在这里传递。 |
| **path**        | 自定义组件的文件路径。具名导出可以附加到路径的末尾，并用 `#` 分隔。 |
| **serverProps** | 如果是服务器组件，将传递给自定义组件的 props。详见更多说明。 |

### 导入映射

为了让 Payload 使用组件路径，系统会自动生成一个“导入映射”（Import Map），该映射文件位于 `src/app/(payload)/admin/importMap.js` 或 `app/(payload)/admin/importMap.js`。该文件包含你配置中的所有自定义组件，并将它们与各自的路径关联。当 Payload 需要查找组件时，它会使用这个文件来找到正确的导入路径。

导入映射会在启动时自动生成，并且每当热模块替换（Hot Module Replacement, HMR）运行时会重新生成，或者你也可以通过运行 `payload generate:importmap` 来手动重新生成它。

#### 覆盖导入映射位置

通过使用 `config.admin.importMap.importMapFile` 属性，你可以覆盖导入映射的位置。如果你希望将导入映射放置在不同的位置，或者希望使用自定义的文件名，这将非常有用。

```javascript
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  // ...
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(
        dirname,
        'app',
        '(payload)',
        'custom-import-map.js',
      ), 
    },
  },
})
```

#### 自定义导入

如果需要，可以将自定义项附加到导入映射中。这通常仅对插件作者有用，他们需要添加一个在已知位置没有引用的自定义导入。

要将自定义导入添加到导入映射中，可以在你的 Payload 配置中使用 `admin.dependencies` 属性：

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // ...
    dependencies: {
      myTestComponent: {
        // myTestComponent is the key - can be anything
        path: '/components/TestComponent.js#TestComponent',
        type: 'component',
        clientProps: {
          test: 'hello',
        },
      },
    },
  },
})
```

## 构建自定义组件

Payload 中的所有自定义组件默认都是 React 服务器组件（React Server Components）。这使得可以直接在前端使用本地 API（Local API）等功能。

### 默认 Props

为了让构建自定义组件尽可能简单，Payload 会自动提供一些常见的 props，例如 payload 类和 i18n 对象。这意味着在后台管理面板中构建自定义组件时，你不需要自己获取这些值。

以下是一个示例：

```javascript
import React from 'react'
import type { Payload } from 'payload'

async function MyServerComponent({
  payload, 
}: {
  payload: Payload
}) {
  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
  })

  return <p>{page.title}</p>
}
```

每个自定义组件默认接收以下 props：

| 属性        | 描述       |
| ----------- | ---------- |
| **payload** | Payload 类 |
| **i18n**    | i18n 对象  |

提醒：所有自定义组件还会接收与正在渲染的组件相关的其他各种 props。有关每个组件的完整默认 props 列表，请参见根组件（Root Components）、集合组件（Collection Components）、全局组件（Global Components）或字段组件（Field Components）。

### 自定义 Props

你也可以将自定义 props 传递给自定义组件。为此，你可以根据你的 prop 是否可序列化，以及你的组件是服务器组件（Server Component）还是客户端组件（Client Component），使用 `clientProps` 或 `serverProps` 属性。

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    
    components: {
      logout: {
        Button: {
          path: '/src/components/Logout#MyComponent',
          clientProps: {
            myCustomProp: 'Hello, World!', 
          },
        },
      },
    },
  },
})
```

你的组件可以通过如下方式接收这个 prop：

```javascript
import React from 'react'
import { Link } from '@payloadcms/ui'

export function MyComponent({ myCustomProp }: { myCustomProp: string }) {
  return <Link href="/admin/logout">{myCustomProp}</Link>
}
```

