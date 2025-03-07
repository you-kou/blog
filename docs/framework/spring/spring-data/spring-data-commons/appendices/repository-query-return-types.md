# Repository查询返回类型

## 支持的查询返回类型

以下表格列出了Spring Data存储库通常支持的返回类型。然而，请查阅特定存储的文档以获取支持的确切返回类型，因为这里列出的某些类型可能在特定存储中不受支持。

> [!NOTE]
>
> 地理空间类型（如GeoResult、GeoResults和GeoPage）仅适用于支持地理空间查询的数据存储。一些存储模块可能会定义它们自己的结果包装类型。

| Return type                                                  | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| `void`                                                       | 表示没有返回值。                                             |
| Primitives                                                   | Java 原始类型。                                              |
| Wrapper types                                                | Java 包装类型。                                              |
| `T`                                                          | 唯一实体。期望查询方法最多返回一个结果。如果未找到结果，返回 `null`。如果返回多个结果，将触发 `IncorrectResultSizeDataAccessException`。 |
| `Iterator<T>`                                                | 一个 `Iterator`。                                            |
| `Collection<T>`                                              | 一个 `Collection`。                                          |
| `List<T>`                                                    | 一个 `List`。                                                |
| `Optional<T>`                                                | 一个 Java 8 或 Guava 的 `Optional`。期望查询方法最多返回一个结果。如果没有找到结果，则返回 `Optional.empty()` 或 `Optional.absent()`。如果返回多个结果，将触发 `IncorrectResultSizeDataAccessException`。 |
| `Option<T>`                                                  | 可以是 Scala 或 Vavr 的 `Option` 类型。语义上与之前描述的 Java 8 的 `Optional` 行为相同。 |
| `Stream<T>`                                                  | 一个 Java 8 的 `Stream`。                                    |
| `Streamable<T>`                                              | `Iterable` 的便捷扩展，直接暴露方法以便流式处理、映射和过滤结果、连接等操作。 |
| Types that implement `Streamable` and take a `Streamable` constructor or factory method argument | 暴露构造函数或 `….of(…)` / `….valueOf(…)` 工厂方法，接受 `Streamable` 作为参数的类型。有关详细信息，请参见 [返回自定义 Streamable 包装类型](https://docs.spring.io/spring-data/commons/reference/repositories/query-methods-details.html#repositories.collections-and-iterables.streamable-wrapper)。 |
| Vavr `Seq`, `List`, `Map`, `Set`                             | Vavr 集合类型。有关详细信息，请参见 [Vavr 集合的支持](https://docs.spring.io/spring-data/commons/reference/repositories/query-methods-details.html#repositories.collections-and-iterables.vavr)。 |
| `Future<T>`                                                  | 一个 `Future`。要求方法使用 `@Async` 注解，并且需要启用 Spring 的异步方法执行功能。 |
| `CompletableFuture<T>`                                       | 一个 Java 8 的 `CompletableFuture`。要求方法使用 `@Async` 注解，并且需要启用 Spring 的异步方法执行功能。 |
| `Slice<T>`                                                   | 一个带有数据大小的块，并指示是否还有更多数据可用。需要一个 `Pageable` 方法参数。 |
| `Page<T>`                                                    | 一个带有额外信息的`Slice`，例如结果的总数。需要一个`Pageable`方法参数。 |
| `Window<T>`                                                  | 一个通过滚动查询获得的结果`Window`。提供`ScrollPosition`以发出下一个滚动查询。需要一个`ScrollPosition`方法参数。 |
| `GeoResult<T>`                                               | 一个带有附加信息的结果条目，例如与参考位置的距离。           |
| `GeoResults<T>`                                              | 一个包含附加信息的 `GeoResult<T>` 列表，例如与参考位置的平均距离。 |
| `GeoPage<T>`                                                 | 一个包含 `GeoResult<T>` 的 `Page`，例如与参考位置的平均距离。 |
| `Mono<T>`                                                    | 一个使用反应式存储库的 Project Reactor `Mono`，发出零个或一个元素。期望查询方法最多返回一个结果。如果没有找到结果，则返回 `Mono.empty()`。如果返回多个结果，则触发 `IncorrectResultSizeDataAccessException`。 |
| `Flux<T>`                                                    | 一个使用反应式存储库的 Project Reactor `Flux`，发出零个、一个或多个元素。返回 `Flux` 的查询还可以发出无限数量的元素。 |
| `Single<T>`                                                  | 一个使用反应式存储库的 RxJava `Single`，发出单个元素。期望查询方法最多返回一个结果。如果未找到结果，将返回 `Mono.empty()`。如果返回多个结果，将触发 `IncorrectResultSizeDataAccessException`。 |
| `Maybe<T>`                                                   | 一个使用反应式存储库的 RxJava `Maybe`，发出零个或一个元素。期望查询方法最多返回一个结果。如果未找到结果，将返回 `Mono.empty()`。如果返回多个结果，将触发 `IncorrectResultSizeDataAccessException`。 |
| `Flowable<T>`                                                | 一个使用反应式存储库的 RxJava `Flowable`，发出零个、一个或多个元素。返回 `Flowable` 的查询还可以发出无限数量的元素。 |