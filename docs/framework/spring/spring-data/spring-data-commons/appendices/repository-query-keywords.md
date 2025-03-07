# 仓库查询关键字

## 支持的查询方法主题关键字

下表列出了 Spring Data 仓库查询派生机制通常支持的主题关键字，用于表达谓词。请查阅特定存储的文档以获取确切的支持关键字列表，因为某些列出的关键字可能在特定存储中不受支持。

| Keyword                                                      | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| `find…By`, `read…By`, `get…By`, `query…By`, `search…By`, `stream…By` | 通用查询方法通常返回存储库类型、`Collection` 或 `Streamable` 子类型，或结果包装器，如 `Page`、`GeoResults` 或其他特定存储的结果包装器。可以用作 `findBy…`、`findMyDomainTypeBy…`，或与其他关键字组合使用。 |
| `exists…By`                                                  | 存在投影，通常返回 `boolean` 类型的结果。                    |
| `count…By`                                                   | 计数投影，返回一个数值型结果。                               |
| `delete…By`, `remove…By`                                     | 删除查询方法，返回无结果（`void`）或删除的数量。             |
| `…First<number>…`, `…Top<number>…`                           | 限制查询结果为前 `<number>` 条结果。此关键字可以出现在 `find`（和其他关键字）与 `by` 之间的任何位置。 |
| `…Distinct…`                                                 | 使用 distinct 查询仅返回唯一结果。请查阅特定数据存储的文档，确认该功能是否受支持。此关键字可以出现在 `find`（和其他关键字）与 `by` 之间的任何位置。 |

## 保留方法

 下表列出了使用预定义功能（如 CrudRepository 中定义的功能）的保留方法。这些方法直接在存储特定的存储库代理的后端实现上调用。另见“定义查询方法”。

| `deleteAllById(Iterable<ID> identifiers)` |
| ----------------------------------------- |
| `deleteById(ID identifier)`               |
| `existsById(ID identifier)`               |
| `findAllById(Iterable<ID> identifiers)`   |
| `findById(ID identifier)`                 |

## 支持的查询方法谓词关键字和修饰符

下表列出了 Spring Data 存储库查询推导机制通常支持的谓词关键字。请查阅特定存储库的文档以获取准确的支持关键字列表，因为某些存储库可能不支持此处列出的某些关键字。

| Logical keyword       | Keyword expressions                            |
| :-------------------- | :--------------------------------------------- |
| `AND`                 | `And`                                          |
| `OR`                  | `Or`                                           |
| `AFTER`               | `After`, `IsAfter`                             |
| `BEFORE`              | `Before`, `IsBefore`                           |
| `CONTAINING`          | `Containing`, `IsContaining`, `Contains`       |
| `BETWEEN`             | `Between`, `IsBetween`                         |
| `ENDING_WITH`         | `EndingWith`, `IsEndingWith`, `EndsWith`       |
| `EXISTS`              | `Exists`                                       |
| `FALSE`               | `False`, `IsFalse`                             |
| `GREATER_THAN`        | `GreaterThan`, `IsGreaterThan`                 |
| `GREATER_THAN_EQUALS` | `GreaterThanEqual`, `IsGreaterThanEqual`       |
| `IN`                  | `In`, `IsIn`                                   |
| `IS`                  | `Is`, `Equals`, (or no keyword)                |
| `IS_EMPTY`            | `IsEmpty`, `Empty`                             |
| `IS_NOT_EMPTY`        | `IsNotEmpty`, `NotEmpty`                       |
| `IS_NOT_NULL`         | `NotNull`, `IsNotNull`                         |
| `IS_NULL`             | `Null`, `IsNull`                               |
| `LESS_THAN`           | `LessThan`, `IsLessThan`                       |
| `LESS_THAN_EQUAL`     | `LessThanEqual`, `IsLessThanEqual`             |
| `LIKE`                | `Like`, `IsLike`                               |
| `NEAR`                | `Near`, `IsNear`                               |
| `NOT`                 | `Not`, `IsNot`                                 |
| `NOT_IN`              | `NotIn`, `IsNotIn`                             |
| `NOT_LIKE`            | `NotLike`, `IsNotLike`                         |
| `REGEX`               | `Regex`, `MatchesRegex`, `Matches`             |
| `STARTING_WITH`       | `StartingWith`, `IsStartingWith`, `StartsWith` |
| `TRUE`                | `True`, `IsTrue`                               |
| `WITHIN`              | `Within`, `IsWithin`                           |

除了过滤谓词，以下修饰符也受到支持：

| Keyword                            | Description                                                  |
| :--------------------------------- | :----------------------------------------------------------- |
| `IgnoreCase`, `IgnoringCase`       | 与谓词关键词一起使用，用于不区分大小写的比较。               |
| `AllIgnoreCase`, `AllIgnoringCase` | 对所有适用的属性忽略大小写。在查询方法谓词中的某个位置使用。 |
| `OrderBy…`                         | 指定静态排序顺序，后跟属性路径和方向（例如 `OrderByFirstnameAscLastnameDesc`）。 |