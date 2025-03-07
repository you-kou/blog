# 核心概念

Spring Data 仓库抽象的核心接口是 `Repository`。它以要管理的领域类及其标识符类型作为类型参数。该接口主要作为标记接口，用于捕获要处理的类型，并帮助发现扩展该接口的其他接口。

> [!TIP]
>
> Spring Data 认为领域类型是实体，更具体地说是聚合体。因此，在整个文档中会看到“实体”一词，它可以与“领域类型”或“聚合体”互换使用。
>
> 正如在介绍中所提到的，Spring Data 已经暗示了领域驱动的概念。我们将领域对象视为 DDD（领域驱动设计）中的领域对象。领域对象具有标识符（否则它们将是无标识的值对象），在使用某些模式访问数据时，我们需要引用标识符。随着我们深入讨论仓库（Repository）和查询方法，引用标识符的意义将变得更加重要。

`CrudRepository` 和 `ListCrudRepository` 接口为被管理的实体类提供了强大的 CRUD（**创建、读取、更新、删除**）功能。

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {

  <S extends T> S save(S entity);

  Optional<T> findById(ID primaryKey);

  Iterable<T> findAll();

  long count();

  void delete(T entity);

  boolean existsById(ID primaryKey);

  // … more functionality omitted.
}
```

此接口中声明的方法通常被称为 CRUD 方法。`ListCrudRepository` 提供了等效的方法，但它返回 `List`，而 `CrudRepository` 的方法返回 `Iterable`。

> [!IMPORTANT]
>
> 仓库接口隐含了一些保留方法，例如 `findById(ID identifier)`，它针对的是领域类型的标识符属性，而不考虑其具体的属性名称。有关详细信息，请参阅“定义查询方法”。
>
> 如果某个名为 `Id` 的属性并不指代标识符，则可以使用 `@Query` 注解自定义查询。然而，这种做法容易引起混淆，因此不建议使用，因为如果 ID 类型与 `Id` 属性的类型不匹配，很快就会遇到类型限制问题。

> [!NOTE]
>
> 我们还提供了特定于持久化技术的抽象，例如 `JpaRepository` 或 `MongoRepository`。这些接口扩展了 `CrudRepository`，除了 `CrudRepository` 这样与持久化技术无关的通用接口外，还暴露了底层持久化技术的特性和能力。

除了 `CrudRepository` 之外，还有 `PagingAndSortingRepository` 和 `ListPagingAndSortingRepository`，它们提供了额外的方法，以便更轻松地对实体进行分页访问：

```java
public interface PagingAndSortingRepository<T, ID>  {

  Iterable<T> findAll(Sort sort);

  Page<T> findAll(Pageable pageable);
}
```

> [!NOTE]
>
> 扩展接口的支持取决于具体的数据存储模块。虽然本篇文档介绍了通用的方案，但请确保您所使用的数据存储模块支持您想要使用的接口。

要访问 `User` 实体的第二页，并设置每页大小为 20，您可以使用以下方式：

```java
PagingAndSortingRepository<User, Long> repository = // … get access to a bean
Page<User> users = repository.findAll(PageRequest.of(1, 20));
```

`ListPagingAndSortingRepository` 提供了等效的方法，但返回 `List`，而 `PagingAndSortingRepository` 方法返回 `Iterable`。

除了查询方法外，还支持对计数（count）和删除（delete）查询进行派生。以下是派生计数查询的接口定义示例：

```java
interface UserRepository extends CrudRepository<User, Long> {

  long countByLastname(String lastname);
}
```

以下列出了派生删除查询的接口定义示例：

```java
interface UserRepository extends CrudRepository<User, Long> {

  long deleteByLastname(String lastname);

  List<User> removeByLastname(String lastname);
}
```

