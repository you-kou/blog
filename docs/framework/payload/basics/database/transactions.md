# 事务

数据库事务允许您的应用程序在一次全有或全无的提交中进行一系列数据库更改。考虑一个 HTTP 请求，它创建了一个新的订单，并且有一个 `afterChange` 钩子用于更新相关商品的库存数量。如果在更新商品时发生错误并且返回了 HTTP 错误，那么您不希望新的订单被持久化，或者其他商品的更改也不会被提交。这种与数据库的交互可以通过事务无缝处理。

默认情况下，Payload 会在所有数据更改操作中使用事务，只要配置的数据库支持事务。数据库中的更改会包含在所有 Payload 操作中，任何抛出的错误都会导致所有更改回滚而不会被提交。当数据库不支持事务时，Payload 将继续按预期操作，而不使用事务。

> [!NOTE]
>
> MongoDB 需要连接到复制集才能使用事务。

> [!NOTE]
>
> SQLite 中的事务默认是禁用的。您需要传递 `transactionOptions: {}` 来启用它们。

初始请求发往 Payload 时，将开始一个新的事务，并将其附加到 `req.transactionID`。如果您有一个与数据库交互的钩子，可以通过将 `req` 作为参数传递来选择使用相同的事务。例如：

```javascript
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // 因为 `req.transactionID` 是由 Payload 分配并传递的，
  // 只有当整个请求成功时，`my-slug` 才会被持久化。
  await req.payload.create({
    req,
    collection: 'my-slug',
    data: {
      some: 'data',
    },
  })
}
```

## 使用事务的异步钩子

由于 Payload 钩子可以是异步的，并且可以编写为不等待结果，因此在回滚的请求中可能会返回不正确的成功响应。如果您有一个钩子在其中没有等待结果，那么您不应该传递 `req.transactionID`。

```javascript
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // WARNING: an async call made with the same req, but NOT awaited,
  // may fail resulting in an OK response being returned with response data that is not committed
  const dangerouslyIgnoreAsync = req.payload.create({
    req,
    collection: 'my-slug',
    data: {
      some: 'other data',
    },
  })

  // Should this call fail, it will not rollback other changes
  // because the req (and its transactionID) is not passed through
  const safelyIgnoredAsync = req.payload.create({
    collection: 'my-slug',
    data: {
      some: 'other data',
    },
  })
}
```

## 直接访问事务

在编写自定义脚本或自定义端点时，您可能希望直接控制事务。这对于与 Payload 的 Local API 之外的数据库进行交互非常有用。

以下函数可用于管理事务：

- `payload.db.beginTransaction` - 启动一个新的会话并返回一个事务 ID，供其他 Payload Local API 调用使用。
- `payload.db.commitTransaction` - 需要传入事务的标识符，最终确定所有更改。
- `payload.db.rollbackTransaction` - 需要传入事务的标识符，丢弃所有更改。

Payload 使用 `req` 对象将事务 ID 传递给数据库适配器。如果您不使用 `req` 对象，可以创建一个新对象，直接将事务 ID 传递给数据库适配器方法和 Local API 调用。例如：

```javascript
import payload from 'payload'
import config from './payload.config'

const standalonePayloadScript = async () => {
  // initialize Payload
  await payload.init({ config })

  const transactionID = await payload.db.beginTransaction()

  try {
    // Make an update using the Local API
    await payload.update({
      collection: 'posts',
      data: {
        some: 'data',
      },
      where: {
        slug: { equals: 'my-slug' },
      },
      req: { transactionID },
    })

    /*
      You can make additional db changes or run other functions
      that need to be committed on an all or nothing basis
     */

    // Commit the transaction
    await payload.db.commitTransaction(transactionID)
  } catch (error) {
    // Rollback the transaction
    await payload.db.rollbackTransaction(transactionID)
  }
}

standalonePayloadScript()
```

## 禁用事务

如果您希望完全禁用事务，可以通过在数据库适配器配置中将 `transactionOptions` 设置为 `false` 来实现。所有官方的 Payload 数据库适配器都支持此选项。

除了允许在适配器级别禁用数据库事务外，您还可以通过在直接调用 Local API 时向 `args` 中添加 `disableTransaction: true` 来防止 Payload 使用事务。例如：

```javascript
await payload.update({
  collection: 'posts',
  data: {
    some: 'data',
  },
  where: {
    slug: { equals: 'my-slug' },
  },
  disableTransaction: true,
})
```

