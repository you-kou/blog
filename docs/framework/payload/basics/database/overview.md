# 数据库

Payload 是数据库无关的，这意味着您可以在 Payload 熟悉的 API 后使用任何类型的数据库。Payload 通过数据库适配器与数据库交互，数据库适配器是一个薄层，负责将 Payload 内部的数据结构转换为数据库的原生数据结构。

目前，Payload 官方支持以下数据库适配器：

- MongoDB（使用 Mongoose）
- Postgres（使用 Drizzle）
- SQLite（使用 Drizzle）

要配置数据库适配器，请在 Payload 配置中使用 db 属性：

```javascript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  // ...
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
```

> [!NOTE]
>
> 数据库适配器是一个外部依赖，必须与 Payload 分开单独安装。您可以在各自的文档中找到每个数据库适配器的安装说明。

## 选择数据库

在选择适合您项目和工作负载的数据库技术和托管选项时，需要考虑几个因素。理论上，Payload 可以支持任何数据库，但最终选择使用哪种数据库由您决定。

选择数据库时，主要有两种类型的数据库：

1. **非关系型数据库（Non-Relational Databases）**
2. **关系型数据库（Relational Databases）**

### 非关系型数据库

如果您的项目有很多动态字段，并且您愿意让 Payload 强制执行文档数据的完整性，**MongoDB** 是一个很好的选择。使用 MongoDB 时，您的 Payload 文档会作为一个完整的文档存储在数据库中——无论您是否启用了本地化、字段中有多少块字段或数组字段等。这意味着数据库中数据的结构将非常接近您的字段架构，存储和检索数据的复杂性也最小。

您应该选择 MongoDB 如果：

- 您更倾向于数据库的简洁性
- 您不想通过 DDL 更改来保持生产 / 测试数据库的一致性
- 项目中的大部分（或所有）内容都需要本地化
- 您大量使用数组、块或 `hasMany` 选择字段

### 关系型数据库

许多项目可能需要更严格的数据库架构，其中数据的形状在数据库级别受到强制执行。例如，如果您已经知道数据的形状并且它相对“平坦”，并且预计它不会经常变化，那么您的工作负载可能非常适合使用关系型数据库，如 **Postgres**。

如果您符合以下条件，可以选择像 **Postgres** 或 **SQLite** 这样的关系型数据库：

- 您可以接受使用迁移（Migrations）
- 您需要在数据库级别强制执行数据一致性
- 您有大量集合之间的关系，并且需要强制执行这些关系

## Payload 区别

需要注意的是，几乎所有的 Payload 功能都可以在我们官方支持的数据库适配器中使用，包括本地化、数组、块等。目前唯一在 **SQLite** 中不支持的功能是 **Point Field**，但这个功能很快就会添加。

最终选择使用哪个数据库取决于您项目的需求，Payload 并没有特别推荐您使用哪种数据库。