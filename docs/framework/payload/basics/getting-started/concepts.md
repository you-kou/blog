# Payload 概念

Payload 基于一组小而直观的高级概念。在开始使用 Payload 之前，熟悉这些概念有助于建立讨论 Payload 时的共同语言和理解。

## 配置

 Payload 配置是 Payload 的核心。它通过简单直观的 API 深度配置应用程序。Payload 配置是一个完全类型化的 JavaScript 对象，可以无限扩展。

## 数据库

 Payload 是数据库无关的，这意味着可以通过 "数据库适配器" 使用任何类型的数据库。

## 集合

 Collection 是一组共享相同 schema 的记录，称为 Documents（文档）。每个 Collection 根据定义的 Fields（字段）存储在数据库中。

## Globals

 Globals 在许多方面与 Collection 类似，但它们只对应单个 Document。每个 Global 也根据定义的 Fields 存储在数据库中。

## Fields

 Fields 是 Payload 的基本组成部分，定义了存储在数据库中的 Document 的 schema，并自动生成管理面板中的对应 UI。

## Hooks

 Hooks 允许在 Document 生命周期的特定事件（如读取前、创建后等）执行自定义逻辑。

## Authentication

 Payload 提供了安全、便携的用户账户管理功能，既可在管理面板使用，也能集成到自定义应用中。

## Access Control

 Access Control 决定用户对 Document 拥有哪些权限（读取、更新等），以及在管理面板中能看到什么内容。

## Admin Panel

 Payload 动态生成一个美观、完全类型安全的界面，用于管理用户和数据。管理面板是一个基于 Next.js App Router 构建的 React 应用。

## Retrieving Data

 Payload 提供了三种 API，用于创建、读取、更新、删除、登录、登出等操作：

- **Local API**：超快的直接数据库访问
- **REST API**：标准 HTTP 接口
- **GraphQL**：完整的 GraphQL API，带有 GraphQL Playground

> [!NOTE]
>
> 所有这些 API 都使用完全相同的查询语言。

### Local API

Payload 最强大的特点之一就是提供了 **Local API**，让你可以直接访问数据库数据。它速度极快，没有传统 HTTP 请求的开销，直接在 Node.js 中查询数据库。

Local API 是用 **TypeScript** 编写的，类型安全，使用体验极佳。它可以在服务器端的任何地方运行，包括 **Next.js 自定义路由**、**Payload Hooks**、**Payload 权限控制**，甚至 **React Server Components**。

下面是一个在 **React Server Component** 中使用 **Local API** 获取数据的简单示例：

```javascript
import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

const MyServerComponent: React.FC = () => {
  const payload = await getPayload({ config })

  // The `findResult` here will be fully typed as `PaginatedDocs<Page>`,
  // where you will have the `docs` that are returned as well as
  // information about how many items are returned / are available in total / etc
  const findResult = await payload.find({ collection: 'pages' })

  return (
    <ul>
      {findResult.docs.map((page) => {
        // Render whatever here!
        // The `page` is fully typed as your Pages collection!
      })}
    </ul>
  )
}
```

### REST API

默认情况下，Payload 会自动在你的应用路径 **/api** 下挂载 **REST API**。

比如，如果你有一个名为 **pages** 的 Collection，那么就可以直接通过 API 访问它：

```javascript
fetch('https://localhost:3000/api/pages') 
  .then((res) => res.json())
  .then((data) => console.log(data))
```

### GraphQL API

Payload 会自动提供 **GraphQL API**，支持查询（queries）和变更（mutations）。默认情况下，**GraphQL** 的路由挂载在 **/api/graphql** 路径下，同时还提供了 **GraphQL Playground**，可以在 **/api/graphql-playground** 访问。

你可以用任何 **GraphQL** 客户端来调用 **Payload** 的 **GraphQL API**。推荐几个常见的包：

- **graphql-request** —— 超轻量级的 GraphQL 客户端
- **@apollo/client** —— 功能丰富的行业标准 GraphQL 客户端

## Package Structure

Payload 被拆分成一系列独立的包，保持核心 **payload** 包尽可能轻量化。这样可以按需安装所需功能，灵活适配不同项目需求。

> [!IMPORTANT]
>
> 所有官方 **Payload** 包的版本号始终同步发布，确保所有官方包的版本保持一致，否则可能会遇到兼容性问题。

### `payload`

`payload` 包是 Payload 的核心业务逻辑所在。你可以把 Payload 想象成一个拥有超能力的 ORM——它包含了所有 Payload 操作的逻辑，如 **find**（查找）、**create**（创建）、**update**（更新）、**delete**（删除），并暴露了 Local API。它执行 **访问控制**、**Hooks**、**验证** 等功能。

Payload 本身非常精简，可以在任何 Node 环境中使用。只要安装了 **payload**，并且能访问你的 **Payload Config**，你就可以直接查询和修改数据库，而无需经过额外的 HTTP 层。

Payload 还包含了所有的 TypeScript 类型定义，可以直接从 **payload** 导入。

下面是如何导入一些常用 Payload 类型的示例：

```javascript
import { Config, CollectionConfig, GlobalConfig, Field } from 'payload'
```

### `@payloadcms/next`

Payload 本身负责直接的数据库访问和对 Payload 业务逻辑的控制，而 **@payloadcms/next** 包则负责 **Admin Panel** 和 Payload 暴露的整个 HTTP 层，包括 **REST API** 和 **GraphQL API**。

### `@payloadcms/graphql`

Payload 所有的 **GraphQL** 功能都被抽象到一个单独的包中。如果你不使用 **GraphQL**，Payload、Admin UI 和 **REST API** 将不会与 **GraphQL** 有任何重叠，且不会因 **GraphQL** 引入性能开销。尽管如此，**@payloadcms/next** 包中已经包含了 **GraphQL**，因此你不需要手动安装它。如果你在项目中使用 **GraphQL**，则需要在 **package.json** 中单独安装 **GraphQL**。

### `@payloadcms/ui`

这是 Payload Admin Panel 使用的 UI 库。所有的组件都从这个包中导出，你可以在扩展 Payload Admin UI 时重用它们，或者在你自己的 React 应用中使用 Payload 组件。有些组件是服务端组件，有些则是客户端组件。

### `@payloadcms/db-postgres, @payloadcms/db-vercel-postgres, @payloadcms/db-mongodb, @payloadcms/db-sqlite`

你可以根据项目需求选择数据库适配器。无论选择哪个，这些包都包含了 Payload 的整个数据层。每个项目只能使用一个数据库适配器。

### `@payloadcms/richtext-lexical, @payloadcms/richtext-slate`

Payload 的富文本功能被抽象到单独的包中。如果你希望在项目中启用富文本，需要安装其中一个包。我们推荐为所有新项目使用 **Lexical**，Payload 会重点支持该包，但如果你已经使用 **Slate**，它仍然会得到支持。

> [!NOTE]
>
> 富文本功能是完全可选的，你的项目可能不需要它。

