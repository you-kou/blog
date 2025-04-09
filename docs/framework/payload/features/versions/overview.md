# 版本

> [!NOTE]
>
> Payload 强大的版本功能允许您保持文档变化的历史记录，并且可以扩展以适应任何内容发布工作流。

启用时，Payload 将自动在数据库中为您的文档存储版本创建一个新集合，Admin UI 将扩展为提供额外的视图，允许您浏览文档版本、查看差异，以便精确查看文档中发生了哪些更改（以及它们发生的时间），并轻松地将文档恢复到之前的版本。

![Versions](https://payloadcms.com/images/docs/versions.png)

*比较文档的旧版本和新版本*



使用版本功能，您可以：

- 保持文档的审计日志/历史记录，记录每个更改，包括监控哪个用户进行了哪些更改
- 在需要回滚更改时，恢复文档和全局变量到先前的状态
- 为您的数据构建一个真正的草稿预览模式
- 通过访问控制管理谁可以看到草稿，谁只能看到已发布的文档
- 在集合和全局变量上启用自动保存，再也不丢失工作
- 构建强大的发布调度机制，创建文档并在未来某个日期自动公开可读

> [!NOTE]
>
> 版本功能具有极高的性能，并且完全是可选的。它们不会改变数据的结构。所有版本都存储在一个单独的集合中，您可以根据需要轻松启用或禁用。

## 选项

版本支持几种不同级别的功能，每种功能对文档工作流有不同的影响。

### 启用版本，禁用草稿

如果启用版本功能但保持草稿模式禁用，Payload 会在每次更新文档时自动创建一个新版本。这对于需要保留所有文档更新历史记录，但始终将最新文档版本视为“已发布”版本的用例非常适合。

例如，“启用版本，禁用草稿”的使用场景可能是在用户集合中，您可能希望保留所有对用户所做更改的版本历史记录（或审计日志）——但任何对用户的更改都应该始终视为“已发布”，而不需要维护“草稿”版本的用户。

### 启用版本和草稿

如果您启用版本和草稿功能，您可以控制哪些文档是已发布的，哪些文档是草稿。这使您能够编写访问控制策略，来管理谁可以查看已发布文档，谁可以查看草稿文档。它还允许您保存比最新已发布文档更新的版本（草稿），这在您想要草拟更改并可能在发布之前预览这些更改时非常有用。[阅读更多关于草稿的内容](https://chatgpt.com/c/67f5e9d2-dd44-8007-8ba8-ec8751c7ab3b#)。

### 启用版本、草稿和自动保存

当您启用版本、草稿和自动保存时，Admin UI 会在您编辑文档时自动保存您对新草稿版本所做的更改，这确保您永远不会丢失任何更改。自动保存不会影响您的已发布内容——它只是保存您的更改，并在您或您的编辑者准备好发布时，允许您发布这些更改。[阅读更多关于自动保存的内容](https://chatgpt.com/c/67f5e9d2-dd44-8007-8ba8-ec8751c7ab3b#)。

## 集合配置

配置版本功能是通过在集合配置中添加 `versions` 键来完成的。将其设置为 `true` 以启用默认的版本设置，或者通过将属性设置为包含以下可用选项的对象来自定义版本选项：

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| `maxPerDoc` | 使用此设置来控制每个文档保留多少个版本。必须是整数。默认值为 100，设置为 0 以保存所有版本。 |
| `drafts`    | 为该集合启用草稿模式。要启用，请设置为 `true` 或传递一个包含草稿选项的对象。 |

## 全局配置

全局版本功能与集合版本类似，但支持的配置属性略有不同。

| 选项     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| `max`    | 使用此设置来控制每个全局保留多少个版本。必须是整数。         |
| `drafts` | 为该全局启用草稿模式。要启用，请设置为 `true` 或传递一个包含草稿选项的对象。 |

### 数据库影响

启用版本功能后，将创建一个新的数据库集合来存储集合或全局的版本。该集合将基于集合或全局的 slug 命名，命名格式如下（其中 slug 被替换为您的集合或全局的 slug）：

```
_slug_versions
```

在这个新的版本集合中，每个文档将存储一组关于版本的元属性以及文档的完整副本。例如，一个版本的数据可能如下所示（以集合文档为例）：

```javascript
{
  "_id": "61cf752c19cdf1b1af7b61f1", // a unique ID of this version
  "parent": "61ce1354091d5b3ffc20ea6e", // the ID of the parent document
  "autosave": false, // used to denote if this version was created via autosave
  "version": {
    // your document's data goes here
    // all fields are set to not required and this property can be partially complete
  },
  "createdAt": "2021-12-31T21:25:00.992+00:00",
  "updatedAt": "2021-12-31T21:25:00.992+00:00"
}
```

## 版本操作

版本为集合和全局提供了新的操作。它们允许您查找和查询版本，通过 ID 查找单个版本，以及通过 ID 发布（或恢复）版本。集合和全局都支持相同的新操作。这些操作主要由管理员 UI 使用，但如果您在应用程序中编写自定义逻辑并希望利用它们，您也可以通过 REST、GraphQL 和 Local API 使用这些操作。

**集合 REST 端点：**

| 方法 | 路径                                 | 描述                 |
| ---- | ------------------------------------ | -------------------- |
| GET  | `/api/{collectionSlug}/versions`     | 查找和查询分页版本   |
| GET  | `/api/{collectionSlug}/versions/:id` | 通过 ID 查找特定版本 |
| POST | `/api/{collectionSlug}/versions/:id` | 通过 ID 恢复版本     |

**集合 GraphQL 查询：**

| 查询名称                           | 操作            |
| ---------------------------------- | --------------- |
| version{collection.label.singular} | findVersionByID |
| versions{collection.label.plural}  | findVersions    |

**变更操作：**

| 查询名称                                  | 操作           |
| ----------------------------------------- | -------------- |
| restoreVersion{collection.label.singular} | restoreVersion |

**集合 Local API 方法：**

### 查找

```javascript
// Result will be a paginated set of Versions.
// See /docs/queries/pagination for more.
const result = await payload.findVersions({
  collection: 'posts', // required
  depth: 2,
  page: 1,
  limit: 10,
  where: {}, // pass a `where` query here
  sort: '-createdAt',
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 通过 ID 查找

```javascript
// Result will be a Post document.
const result = await payload.findVersionByID({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 恢复

```javascript
// Result will be the restored global document.
const result = await payload.restoreVersion({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

**全局 REST 端点：**

| 方法 | 路径                                   | 描述               |
| ---- | -------------------------------------- | ------------------ |
| GET  | /api/globals/{globalSlug}/versions     | 查找并查询分页版本 |
| GET  | /api/globals/{globalSlug}/versions/:id | 按 ID 查找特定版本 |
| POST | /api/globals/{globalSlug}/versions/:id | 通过 ID 恢复版本   |

**全局 GraphQL 查询：**

| 查询名称               | 操作            |
| ---------------------- | --------------- |
| version{global.label}  | findVersionByID |
| versions{global.label} | findVersions    |

**全局 GraphQL 变更：**

| 查询名称                     | 操作           |
| ---------------------------- | -------------- |
| restoreVersion{global.label} | restoreVersion |

**全局本地 API 方法：**

### 查找

```javascript
// Result will be a paginated set of Versions.
// See /docs/queries/pagination for more.
const result = await payload.findGlobalVersions({
  slug: 'header', // required
  depth: 2,
  page: 1,
  limit: 10,
  where: {}, // pass a `where` query here
  sort: '-createdAt',
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 通过 ID 查找

```javascript
// Result will be a Post document.
const result = await payload.findGlobalVersionByID({
  slug: 'header', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### 恢复

```javascript
// Result will be the restored global document.
const result = await payload.restoreGlobalVersion({
  slug: 'header', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

