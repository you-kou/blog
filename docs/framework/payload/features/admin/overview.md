# 管理面板

Payload会动态生成一个美观且完全类型安全的管理面板，用于管理您的用户和数据。即使包含超过100个字段，它仍能保持高性能，并已被翻译成30多种语言。在管理面板中，您可以管理内容、渲染站点、预览草稿、比较版本等。

该管理面板设计为可贴合您的品牌。您可以通过替换自定义组件无限地定制和扩展管理界面——从简单的字段标签到整个视图，都可以进行修改或替换，以完美地为编辑者量身定制界面。

管理面板使用TypeScript编写，并采用Next.js App Router构建，支持React Server组件，从而在前端使用本地API。您只需一行命令即可将Payload安装到任何现有的Next.js应用中，并将其部署到任何地方。

![Admin Panel with collapsible sidebar](https://payloadcms.com/images/docs/admin.jpg)

重新设计的管理面板配备了默认展开的可折叠侧边栏，提供更高的扩展性和增强的横向空间。

## 项目结构

管理面板充当Payload的整个HTTP层，为您的应用程序提供完整的CRUD接口。这意味着REST和GraphQL API只是紧挨着您的前端应用存在的Next.js路由。

安装Payload后，您的应用程序中将创建以下文件和目录：

```txt
app/
├─ (payload)/
├── admin/
├─── [[...segments]]/
├──── page.tsx
├──── not-found.tsx
├── api/
├─── [...slug]/
├──── route.ts
├── graphql/
├──── route.ts
├── graphql-playground/
├──── route.ts
├── custom.scss
├── layout.tsx
```

如上所示，所有Payload路由都嵌套在`(payload)`路由组中。这样可以通过限定所有布局和样式，为管理面板与应用程序的其他部分创建边界。例如，这个目录中的`layout.tsx`文件是Payload管理文档`html`标签的位置，用于设置正确的`lang`和`dir`属性等。

`admin`目录包含与界面本身相关的所有页面，而`api`和`graphql`目录则包含与REST API和GraphQL API相关的所有路由。所有管理路由都可以轻松配置，以满足您的应用程序的具体需求。

> [!NOTE]
>
> 如果您不打算使用管理面板、REST API或GraphQL API，可以通过删除Next.js应用中对应的目录来选择停用。不过，这些功能的开销完全限制在这些路由内，不使用时不会拖慢或影响Payload的其他部分。

最后，`custom.scss`文件是您可以添加或覆盖管理面板全局样式的地方，比如修改配色方案。仅通过CSS就能自定义外观和体验，这是管理面板的一大强大功能，更多详情请参见相关文档。

所有自动生成的文件顶部都会包含以下注释：

```
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */,
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
```

## 管理选项

所有管理面板的选项都在您的Payload配置文件中，通过`admin`属性进行定义：

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    
    // ...
  },
})
```

以下选项可用：

| **选项**                     | **描述**                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| **avatar**                   | 设置账户头像。选项包括：`gravatar`、`default`或自定义React组件。 |
| **autoLogin**                | 用于开发和演示时自动登录，方便快捷。                         |
| **buildPath**                | 指定存储生产环境中已构建管理面板包的绝对路径。默认路径为`path.resolve(process.cwd(), 'build')`。 |
| **components**               | 用于覆盖管理面板中的组件，影响整个面板。                     |
| **custom**                   | 传递给管理面板的任何自定义属性。                             |
| **dateFormat**               | 设置管理面板中所有日期的显示格式，支持任何有效的`date-fns`格式模式。 |
| **livePreview**              | 启用实时编辑，立即预览前端应用程序的视觉反馈。               |
| **meta**                     | 设置管理面板的基本元数据。                                   |
| **routes**                   | 替换内置的管理面板路由，使用您自己的自定义路由。             |
| **suppressHydrationWarning** | 若设为`true`，则在根`<html>`标签渲染期间抑制React的水合不匹配警告。默认值为`false`。 |
| **theme**                    | 限制管理面板仅使用您选择的主题。默认为“全部”。               |
| **timezones**                | 配置管理面板的时区设置。                                     |
| **user**                     | 指定允许登录到管理面板的集合的`slug`。                       |

> [!NOTE]
>
> 这些是管理面板的**根级选项**。您还可以通过各自的`admin`键，自定义**集合管理选项**和**全局管理选项**。

### 管理用户集合

要指定哪个集合可以登录管理面板，请将`admin.user`键设置为启用了认证功能的集合的`slug`值：

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    user: 'admins', 
  },
})
```

> [!IMPORTANT]
>
> 管理面板只能由**单个**启用了认证的集合使用。要为集合启用认证，只需在集合配置中设置`auth: true`。更多信息请参阅**认证**部分。

默认情况下，如果您没有指定集合，Payload会自动提供一个**用户集合**（User Collection）来访问管理面板。您可以通过创建一个`slug: 'users'`的自定义集合来修改或覆盖默认的用户集合配置，这样Payload就会使用您提供的集合，而不是默认版本。

您可以使用任何支持**认证**（Authentication）的集合来访问管理面板，不一定要叫`users`。例如，您可能想设置两个支持认证的集合：

- **admins**：用于拥有更高权限的管理员，管理数据并访问管理面板
- **customers**：用于应用的最终用户，不允许登录管理面板

要实现这个配置，可以在`config`中指定：`admin: { user: 'admins' }`这样只有`admins`集合中的用户才能访问管理面板，任何认证为`customers`的用户都会被禁止访问。更多细节请参阅**访问控制**部分。

### 基于角色的访问控制（RBAC）

您还可以允许**多种用户类型**访问管理面板，但限制他们的权限，这就是**基于角色的访问控制**（RBAC）。例如，您可能希望在`admins`集合中设置两个角色：

- **super-admin**：拥有完整权限，可以在管理面板执行任何操作
- **editor**：仅限于管理内容，不能进行其他操作

要实现这种功能，您可以在启用了认证的集合中添加一个`roles`字段（或类似字段），然后使用`access.admin`属性，根据该字段的值授予或拒绝访问权限。更多细节请参阅**访问控制**部分。要查看完整的、可运行的RBAC示例，可以参考官方的**认证示例（Auth Example）**。
