# Postgres

要将 Payload 与 Postgres 配合使用，请安装包 `@payloadcms/db-postgres`。它使用 Drizzle ORM 和 node-postgres 与您提供的 Postgres 数据库进行交互。

另外，还可以使用 `@payloadcms/db-vercel-postgres` 包，它经过优化，专门用于与 Vercel 配合使用。

该包会在开发模式下自动管理数据库的更改，并提供完整的迁移控制功能，您可以利用这些功能保持其他数据库环境与您的模式同步。DDL 转换会自动生成。

要将 Payload 配置为使用 Postgres，请将 `postgresAdapter` 传递到您的 Payload 配置中，如下所示：

**用法**

`@payloadcms/db-postgres`：

```javascript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  // Configure the Postgres adapter here
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
```

`@payloadcms/db-vercel-postgres`:

```javascript
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  // Automatically uses proces.env.POSTGRES_URL if no options are provided.
  db: vercelPostgresAdapter(),
  // Optionally, can accept the same options as the @vercel/postgres package.
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
})
```

> [!NOTE]
>
> 如果您使用的是 `vercelPostgresAdapter`，并且 `process.env.POSTGRES_URL` 或 `pool.connectionString` 指向本地数据库（例如，主机名为 `localhost` 或 `127.0.0.1`），我们会使用 `pg` 模块进行连接池管理，而不是使用 `@vercel/postgres`。这是因为 `@vercel/postgres` 不支持与本地数据库一起使用。如果您想禁用这种行为，您可以将 `forceUseVercelPostgres: true` 传递给适配器的参数，并按照 Vercel 的指南设置 Docker Neon DB。

## 选项

| 选项                          | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| **pool**                      | 连接池选项，将传递给 Drizzle 和 node-postgres 或 @vercel/postgres。 |
| **push**                      | 禁用开发模式下 Drizzle 的数据库推送功能。默认情况下，推送仅在开发模式下启用。 |
| **migrationDir**              | 自定义迁移文件存储的目录。                                   |
| **schemaName (experimental)** | 用于 PostgreSQL 模式的字符串，默认为 'public'。              |
| **idType**                    | 用于 id 列的数据库数据类型，可以是 'serial' 或 'uuid'。      |
| **transactionOptions**        | PgTransactionConfig 对象，用于事务处理，或设置为 false 来禁用事务。更多详情。 |
| **disableCreateDatabase**     | 如果数据库不存在，设置为 true 来禁用自动创建数据库。默认值为 false。 |
| **localesSuffix**             | 用于存储本地化字段的表名后缀，默认为 '_locales'。            |
| **relationshipsSuffix**       | 用于存储关系的表名后缀，默认为 '_rels'。                     |
| **versionsSuffix**            | 用于存储版本信息的表名后缀，默认为 '_v'。                    |
| **beforeSchemaInit**          | Drizzle schema 钩子，在 schema 构建之前运行。更多详情。      |
| **afterSchemaInit**           | Drizzle schema 钩子，在 schema 构建之后运行。更多详情。      |
| **generateSchemaOutputFile**  | 重写由 `payload generate:db-schema` 生成的 schema 文件路径，默认为 `{CWD}/src/payload-generated.schema.ts`。 |
| **allowIDOnCreate**           | 设置为 true 来在创建 API 操作中使用传递的 id，而不是使用自定义 ID 字段。 |

## 访问 Drizzle

在 Payload 初始化后，该适配器将向您公开 Drizzle 的全部功能，供您根据需要使用。

为了确保类型安全，您需要首先使用以下命令生成 Drizzle 模式：

```sh
npx payload generate:db-schema
```

然后，您可以按以下方式访问 Drizzle：

```javascript
import { posts } from './payload-generated-schema'
// To avoid installing Drizzle, you can import everything that drizzle has from our re-export path.
import { eq, sql, and } from '@payloadcms/db-postgres/drizzle'

// Drizzle's Querying API: https://orm.drizzle.team/docs/rqb
const posts = await payload.db.drizzle.query.posts.findMany()
// Drizzle's Select API https://orm.drizzle.team/docs/select
const result = await payload.db.drizzle
  .select()
  .from(posts)
  .where(
    and(eq(posts.id, 50), sql`lower(${posts.title}) = 'example post title'`),
  )
```

## 表、关系和枚举

除了直接暴露 Drizzle 之外，所有的表、Drizzle 关系和枚举配置也通过 `payload.db` 属性对您开放。

- **表** - `payload.db.tables`
- **枚举** - `payload.db.enums`
- **关系** - `payload.db.relations`

## 开发模式中的原型设计

Drizzle 提供了两种在开发模式下进行本地工作的方式。

第一种是 `db push`，它会自动将您对 Payload 配置（以及 Drizzle 模式）的更改推送到数据库，因此每次更改 Payload 配置时都不需要手动迁移。这仅适用于开发模式，并且不应与手动运行 `migrate` 命令混用。

如果您在开发模式下所做的更改可能导致数据丢失，系统会给出警告。默认情况下，`push` 是启用的，但如果需要，您可以选择禁用它。

另外，您也可以禁用 `push`，并仅依赖迁移来保持本地数据库与 Payload 配置同步。

## 迁移工作流

在 Postgres 中，迁移是使用 Payload 的基础部分，您应该熟悉其工作方式。

## Drizzle 模式钩子

### `beforeSchemaInit`

在模式构建之前运行。您可以使用此钩子扩展数据库结构，添加不会由 Payload 管理的表。

```javascript
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  integer,
  pgTable,
  serial,
} from '@payloadcms/db-postgres/drizzle/pg-core'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          addedTable: pgTable('added_table', {
            id: serial('id').notNull(),
          }),
        },
      }
    },
  ],
})
```

一种使用场景是在迁移到 Payload 时保留现有的数据库结构。默认情况下，Payload 会删除当前的数据库模式，但在这种情况下可能并不理想。要快速从数据库生成 Drizzle 模式，可以使用 **Drizzle Introspection**。你应该会得到一个类似如下的 `schema.ts` 文件：

```javascript
import {
  pgTable,
  uniqueIndex,
  serial,
  varchar,
  text,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
})

export const countries = pgTable(
  'countries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(countries.name),
    }
  },
)
```

你可以在配置中导入它们，并使用 `beforeSchemaInit` 钩子将其附加到模式，如下所示：

```javascript
import { postgresAdapter } from '@payloadcms/db-postgres'
import { users, countries } from '../drizzle/schema'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          users,
          countries,
        },
      }
    },
  ],
})
```

确保 Payload 的集合不会与数据库中的表名重叠。例如，如果你已经有一个 slug 为 "users" 的集合，你应该更改该集合的 slug 或 `dbName`，以避免表名冲突。

### `afterSchemaInit` 

在 Drizzle 模式构建后运行。你可以使用此钩子修改模式，以添加 Payload 不支持的功能，或者添加你不希望出现在 Payload 配置中的列。

要扩展表，Payload 在 `args` 中提供了 `extendTable` 工具。你可以参考 Drizzle 文档。

以下示例添加了 `extra_integer_column` 列，并在 `country` 和 `city` 列上创建了一个复合索引：

```javascript
import { postgresAdapter } from '@payloadcms/db-postgres'
import { index, integer } from '@payloadcms/db-postgres/drizzle/pg-core'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    {
      slug: 'places',
      fields: [
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
      ],
    },
  ],
  db: postgresAdapter({
    afterSchemaInit: [
      ({ schema, extendTable, adapter }) => {
        extendTable({
          table: schema.tables.places,
          columns: {
            extraIntegerColumn: integer('extra_integer_column'),
          },
          extraConfig: (table) => ({
            country_city_composite_index: index(
              'country_city_composite_index',
            ).on(table.country, table.city),
          }),
        })

        return schema
      },
    ],
  }),
})
```

### 注意生成的 schema：

在 schema 钩子中添加的列和表不会被添加到通过 `payload generate:db-schema` 生成的 Drizzle schema 中。如果你希望它们出现在生成的 schema 中，你需要手动编辑这个文件，或者在 `beforeSchemaInit` 钩子中修改 Payload 的内部 "raw" SQL schema。

```javascript
import { postgresAdapter } from '@payloadcms/db-postgres'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      // Add a new table
      adapter.rawTables.myTable = {
        name: 'my_table',
        columns: {
          my_id: {
            name: 'my_id',
            type: 'serial',
            primaryKey: true,
          },
        },
      }

      // Add a new column to generated by Payload table:
      adapter.rawTables.posts.columns.customColumn = {
        name: 'custom_column',
        // Note that Payload SQL doesn't support everything that Drizzle does.
        type: 'integer',
        notNull: true,
      }
      // Add a new index to generated by Payload table:
      adapter.rawTables.posts.indexes.customColumnIdx = {
        name: 'custom_column_idx',
        unique: true,
        on: ['custom_column'],
      }

      return schema
    },
  ],
})
```

