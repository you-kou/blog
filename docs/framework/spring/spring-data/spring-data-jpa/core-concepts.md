# 核心概念

Spring Data 仓库抽象中的核心接口是 Repository。它作为类型参数接受要管理的领域类以及领域类的标识符类型。这个接口主要作为一个标记接口，用于捕获要处理的类型，并帮助您发现扩展该接口的接口。

> [!TIP]
>
> Spring Data 将领域类型视为实体，更具体地说，是聚合。因此，您会看到文档中使用“实体”一词，这个词可以与“领域类型”或“聚合”互换使用。
>
> 正如您在引言中可能已经注意到的，它已经暗示了领域驱动设计（DDD）的概念。我们按照 DDD 的方式来看待领域对象。领域对象有标识符（否则它们将是没有身份的值对象），并且在使用某些模式访问数据时，我们需要引用标识符。引用标识符将在讨论仓库和查询方法时变得更加有意义。

CrudRepository 和 ListCrudRepository 接口为正在管理的实体类提供了复杂的 CRUD 功能。

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

该接口中声明的方法通常被称为 CRUD 方法。ListCrudRepository 提供了等效的方法，但它们返回 List，而 CrudRepository 方法返回 Iterable。

> [!IMPORTANT]
>
> 仓库接口隐含了一些保留的方法，比如 `findById(ID identifier)`，它会针对领域类型的标识符属性，无论其属性名称是什么。有关更多信息，请参阅“定义查询方法”。
>
> 如果名为 `Id` 的属性并不代表标识符，您可以使用 `@Query` 注解自定义查询。沿着这条路径走可能会很容易引发混淆，不建议这样做，因为如果 ID 类型和 `Id` 属性的类型不一致，您很快就会遇到类型限制问题。

> [!NOTE]
>
> 我们还提供了特定于持久化技术的抽象，如 `JpaRepository` 或 `MongoRepository`。这些接口扩展了 `CrudRepository`，除了提供通用的、与持久化技术无关的接口（如 `CrudRepository`）之外，还暴露了底层持久化技术的功能。

除了 `CrudRepository`，还有 `PagingAndSortingRepository` 和 `ListPagingAndSortingRepository`，它们添加了额外的方法以简化对实体的分页访问：

```java
public interface PagingAndSortingRepository<T, ID>  {

  Iterable<T> findAll(Sort sort);

  Page<T> findAll(Pageable pageable);
}
```

> [!NOTE]
>
> 扩展接口的支持取决于实际的存储模块。虽然本文档解释了通用方案，但请确保您的存储模块支持您想要使用的接口。

要按每页 20 条记录访问 User 的第二页，可以执行以下操作：

```java
PagingAndSortingRepository<User, Long> repository = // … get access to a bean
Page<User> users = repository.findAll(PageRequest.of(1, 20));
```

ListPagingAndSortingRepository 提供了等效的方法，但返回一个 List，而 PagingAndSortingRepository 方法则返回一个 Iterable。

除了查询方法外，还可以进行查询衍生，包括 count 和 delete 查询。以下是用于衍生计数查询的接口定义：

```java
interface UserRepository extends CrudRepository<User, Long> {

  long countByLastname(String lastname);
}
```

以下是衍生删除查询的接口定义：

```java
interface UserRepository extends CrudRepository<User, Long> {

  long deleteByLastname(String lastname);

  List<User> removeByLastname(String lastname);
}
```

