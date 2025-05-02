# Blocks 字段

Blocks 字段非常强大，它存储了一个对象数组，每个数组项是一个具有独特 schema 的“块”（block），这些字段由你自定义。

Blocks 是构建灵活内容模型的极佳方式，可用于创建各种内容类型，包括：

- 一个布局构建工具，使编辑者可以设计高度可定制的页面或文章布局。Blocks 可以包含如 Quote（引用）、CallToAction（号召性用语）、Slider（轮播图）、Content（内容）、Gallery（画廊）等配置；
- 一个表单构建工具，其中可用的 block 配置可能包括 Text（文本）、Select（选择）、Checkbox（复选框）；
- 一个虚拟活动议程的“时间段”，其中一个时间段可以是 Break（休息）、Presentation（演讲）或 BreakoutSession（分组会议）。

![Admin Panel screenshot of add Blocks drawer view](https://payloadcms.com/images/docs/fields/blocks.png)

*添加 Blocks 字段的后台管理面板截图（抽屉视图）*



要添加一个 Blocks 字段，请在字段配置中将 type 设置为 blocks：

```javascript
import type { Field } from 'payload'

export const MyBlocksField: Field = {
  // ...
  type: 'blocks',
  blocks: [
    // ...
  ],
}
```

## 配置选项

| 选项                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| **name***            | 用作存储和从数据库中检索时的属性名。详见更多说明。           |
| **label**            | 在后台管理面板中作为标题显示的文本，也可以是一个包含多语言键的对象。如果未定义，则会根据 name 自动生成。 |
| **blocks***          | 一个 block 配置的数组，用于定义该字段可用的区块类型。        |
| **validate**         | 提供一个自定义验证函数，该函数将在后台管理面板和后端同时执行。详见更多说明。 |
| **minRows**          | 当存在值时，验证允许的最小条目数量。                         |
| **maxRows**          | 当存在值时，验证允许的最大条目数量。                         |
| **saveToJWT**        | 如果此字段是顶层字段并嵌套在支持认证的配置中，则将其数据包含进用户的 JWT 中。 |
| **hooks**            | 提供字段钩子以控制此字段的逻辑。详见更多说明。               |
| **access**           | 提供字段访问控制，用于指定哪些用户可以查看或操作该字段的数据。详见更多说明。 |
| **hidden**           | 完全限制该字段在所有 API 中的可见性。仍会保存到数据库，但不会出现在任何 API 响应或后台管理面板中。 |
| **defaultValue**     | 提供一个 block 数据数组，作为该字段的默认值。详见更多说明。  |
| **localized**        | 启用该字段的本地化功能。需要在基础配置中启用本地化。一旦启用，该字段内的所有数据将分别存储本地化版本，无需为每个子字段单独设置本地化。 |
| **unique**           | 强制集合中的每一条记录在该字段上具有唯一值。                 |
| **labels**           | 自定义后台管理面板中 block 行的标签显示。                    |
| **admin**            | 后台管理相关的配置。详见更多说明。                           |
| **custom**           | 自定义扩展点，用于添加插件等自定义数据。                     |
| **typescriptSchema** | 使用 JSON schema 覆盖字段类型生成逻辑。                      |
| **virtual**          | 设为 `true` 可使该字段不保存至数据库，或提供一个字符串路径以将该字段与某个关联关系绑定。详见虚拟字段说明。 |

*带 \* 的属性为必填项。*

