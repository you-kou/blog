# URI 模板

## 什么是URI模板？

URI模板（RFC 6570标准）是一种用于动态构建URI的字符串格式。它通过在固定文本中嵌入**变量表达式**，实现根据参数值生成具体URI的功能。例如：

```uri
https://api.example.com/users/{username}/posts{?page,size}
```

## 为什么要使用URI模板？

1. **动态生成**：轻松处理带参数的URI
2. **可读性高**：比字符串拼接更直观
3. **标准化**：遵循RFC规范，跨语言通用
4. **安全性**：自动处理特殊字符编码

## 基础语法详解

### 变量表达式

基本格式：`{变量名}`
示例：

```uri
# 简单替换
/blog/{year}/{month}

# 多参数查询
/search{?q,category}
```

### 操作符说明

操作符决定变量值的呈现方式：

| 操作符 | 名称     | 示例         | 输出结果                   |
| :----- | :------- | :----------- | :------------------------- |
| 无     | 简单扩展 | {var}        | value → "value"            |
| +      | 保留扩展 | {+path}/file | /foo/bar → "/foo/bar/file" |
| #      | 片段扩展 | {#section}   | results → "#results"       |
| .      | 点号扩展 | {.domain}    | example → ".example"       |
| /      | 路径扩展 | {/path}      | foo → "/foo"               |
| ;      | 参数扩展 | {;params}    | a=1 → ";a=1"               |
| ?      | 查询扩展 | {?query}     | q=hi → "?q=hi"             |
| &      | 查询延续 | {&params}    | page=2 → "&page=2"         |

## 实际应用示例

### 场景1：用户资料接口

```uri
https://api.example.com/{version}/users/{user_id}{?fields}
```

参数：

- version = v2
- user_id = 123
- fields = name,email

生成结果：

```uri
https://api.example.com/v2/users/123?fields=name,email
```

### 场景2：搜索分页

```uri
/search{.fmt}{?q,page,size,sort}
```

参数：

- fmt = json
- q = "web development"
- page = 2
- size = 20

生成结果（自动编码空格）：

```uri
/search.json?q=web%20development&page=2&size=20
```

## 代码实现示例（JavaScript）

使用流行的`uri-template`库：

```javascript
const UriTemplate = require('uri-template');

// 定义模板
const template = UriTemplate.parse(
  '/search{?q,page,size}{#section}'
);

// 展开参数
const uri = template.expand({
  q: 'URI templates',
  page: 1,
  size: 10,
  section: 'results'
});

console.log(uri); 
// 输出：/search?q=URI%20templates&page=1&size=10#results
```

## 最佳实践

1. **优先使用查询参数**：对可选参数使用`{?param}`形式
2. **路径参数保持简洁**：路径中的变量尽量用名词（如`/users/{id}`）
3. **处理空值**：当变量为null或undefined时，该表达式段自动消失
4. **编码规范**：特殊字符会自动进行百分比编码

## 常见问题

**Q：变量名允许哪些字符？**
A：支持字母、数字、下划线，建议使用小写+下划线命名法

**Q：如何表示数组参数？**
A：使用逗号分隔：`{?list}` → `?list=1,2,3`

**Q：多个操作符可以组合吗？**
A：每个表达式只能包含一个操作符，位于最前

## 学习资源

1. [RFC 6570官方文档](https://tools.ietf.org/html/rfc6570)
2. [URI Template测试工具](https://uri-template-tester.glitch.me/)
3. [各语言实现库列表](https://github.com/uri-templates)