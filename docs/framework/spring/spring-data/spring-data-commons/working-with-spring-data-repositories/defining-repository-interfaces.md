# 定义存储库接口

要定义存储库接口，首先需要定义一个特定于领域类的存储库接口。该接口必须扩展 `Repository` 并指定领域类和 ID 类型。如果要为该领域类型公开 CRUD 方法，可以扩展 `CrudRepository` 或其变体之一，而不是直接扩展 `Repository`。

## 细化存储库定义

有几种方式可以开始定义存储库接口。

最常见的方法是扩展 `CrudRepository`，它提供了基本的 CRUD（创建、读取、更新、删除）功能方法。在 Spring Data 3.0 版本中，还引入了 `ListCrudRepository`，它与 `CrudRepository` 类似，但对于返回多个实体的方法，它返回 `List` 而不是 `Iterable`，这可能会更容易使用。

如果你使用的是响应式存储（Reactive Store），可以选择 `ReactiveCrudRepository` 或 `RxJava3CrudRepository`，具体取决于你使用的响应式框架。

如果你使用 Kotlin，可以选择 `CoroutineCrudRepository`，它利用了 Kotlin 的协程（Coroutines）。

此外，如果需要支持排序功能，可以扩展 `PagingAndSortingRepository`、`ReactiveSortingRepository`、`RxJava3SortingRepository` 或 `CoroutineSortingRepository`。这些接口提供了 `Sort` 抽象，`PagingAndSortingRepository` 还支持 `Pageable` 抽象。需要注意的是，在 Spring Data 3.0 之前的版本中，排序存储库接口是继承自对应的 CRUD 存储库的，而从 3.0 版本开始，它们不再继承。因此，如果既需要 CRUD 功能，又需要排序功能，则需要同时扩展相应的 CRUD 和 Sorting 接口。

如果你不想扩展 Spring Data 提供的接口，也可以使用 `@RepositoryDefinition` 注解来自定义存储库（Repository）接口。扩展 CRUD 存储库接口将暴露一整套用于操作实体的方法。如果你希望只公开特定的方法，可以从 CRUD 存储库中挑选需要的方法，并复制到你的领域存储库（Domain Repository）中。在此过程中，还可以更改方法的返回类型。Spring Data 会尽可能地遵循你指定的返回类型。例如，对于返回多个实体的方法，可以选择 `Iterable<T>`、`List<T>`、`Collection<T>` 或 VAVR 提供的 `List<T>`。

如果应用中的多个存储库需要相同的方法集合，可以定义一个基础接口（Base Interface）来供其他存储库继承。这样的接口必须使用 `@NoRepositoryBean` 注解，以防止 Spring Data 直接实例化它，并因无法确定存储库对应的实体类型而导致错误（因为基础接口仍然包含泛型类型变量）。

以下示例展示了如何有选择地暴露 CRUD 方法（在本例中，仅暴露 `findById` 和 `save` 方法）：

```java
@NoRepositoryBean
interface MyBaseRepository<T, ID> extends Repository<T, ID> {

  Optional<T> findById(ID id);

  <S extends T> S save(S entity);
}

interface UserRepository extends MyBaseRepository<User, Long> {
  User findByEmailAddress(EmailAddress emailAddress);
}
```

在前面的示例中，你定义了一个适用于所有领域存储库的公共基础接口，并暴露了 `findById(...)` 和 `save(...)` 方法。这些方法会被路由到由 Spring Data 提供的存储库实现（例如，如果使用 JPA，默认实现是 `SimpleJpaRepository`）。这是因为它们与 `CrudRepository` 中的方法签名相匹配。因此，`UserRepository` 现在可以保存用户、通过 ID 查找单个用户，并触发查询来根据电子邮件地址查找用户。

> [!NOTE]
>
> 中间存储库接口使用 `@NoRepositoryBean` 注解。确保将该注解添加到所有不希望 Spring Data 在运行时创建实例的存储库接口上。

## 使用多个 Spring Data 模块的存储库

 在应用程序中使用一个独特的 Spring Data 模块很简单，因为所有在定义的作用域内的存储库接口都绑定到该 Spring Data 模块。有时，应用程序需要使用多个 Spring Data 模块。在这种情况下，存储库定义必须区分持久化技术。当类路径上检测到多个存储库工厂时，Spring Data 会进入严格存储库配置模式。严格配置使用存储库或域类的详细信息来决定存储库定义的 Spring Data 模块绑定：

1. 如果存储库定义扩展了特定模块的存储库接口，那么它就是该特定 Spring Data 模块的有效候选。
2. 如果域类使用特定模块的类型注解进行注解，那么它是该特定 Spring Data 模块的有效候选。Spring Data 模块接受第三方注解（如 JPA 的 @Entity）或提供自己的注解（如 Spring Data MongoDB 和 Spring Data Elasticsearch 中的 @Document）。

以下示例展示了一个使用模块特定接口（在此案例中为 JPA）的存储库：

```java
interface MyRepository extends JpaRepository<User, Long> { }

@NoRepositoryBean
interface MyBaseRepository<T, ID> extends JpaRepository<T, ID> { … }

interface UserRepository extends MyBaseRepository<User, Long> { … }

// MyRepository 和 UserRepository 在它们的类型层次结构中扩展了 JpaRepository。它们是 Spring Data JPA 模块的有效候选者。
```

以下示例展示了一个使用通用接口的存储库：

```java
interface AmbiguousRepository extends Repository<User, Long> { … }

@NoRepositoryBean
interface MyBaseRepository<T, ID> extends CrudRepository<T, ID> { … }

interface AmbiguousUserRepository extends MyBaseRepository<User, Long> { … }

// AmbiguousRepository 和 AmbiguousUserRepository 仅在它们的类型层次结构中扩展了 Repository 和 CrudRepository。当使用单一的 Spring Data 模块时，这是可以的，但在使用多个模块时，无法区分这些仓库应该绑定到哪个特定的 Spring Data 模块。
```

以下示例展示了一个使用带有注解的领域类的仓库：

```java
interface PersonRepository extends Repository<Person, Long> { … }

@Entity
class Person { … }

interface UserRepository extends Repository<User, Long> { … }

@Document
class User { … }

// PersonRepository 引用的是 Person，而 Person 被 JPA 的 @Entity 注解标记，因此这个仓库显然属于 Spring Data JPA。UserRepository 引用的是 User，而 User 被 Spring Data MongoDB 的 @Document 注解标记。
```

以下是一个不推荐的示例，展示了使用混合注解的域类的仓库：

```java
interface JpaPersonRepository extends Repository<Person, Long> { … }

interface MongoDBPersonRepository extends Repository<Person, Long> { … }

@Entity
@Document
class Person { … }

// 这个示例展示了一个域类同时使用了JPA和Spring Data MongoDB的注解。它定义了两个仓库：JpaPersonRepository 和 MongoDBPersonRepository，一个用于JPA，另一个用于MongoDB。然而，Spring Data无法区分这两个仓库，导致未定义的行为。
```

仓库类型细节和区分域类注解被用于严格的仓库配置，用来识别特定Spring Data模块的仓库候选项。在同一个域类型上使用多个持久化技术特定的注解是可能的，并且允许在多个持久化技术中复用域类型。然而，Spring Data将无法再确定与仓库绑定的唯一模块。

区分仓库的最后一种方法是通过作用域仓库基础包。基础包定义了扫描仓库接口定义的起始点，这意味着仓库定义应位于适当的包中。默认情况下，注解驱动的配置使用配置类的包。基于XML的配置中，基础包是必需的。

以下示例展示了基于注解的基础包配置：

```java
@EnableJpaRepositories(basePackages = "com.acme.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.acme.repositories.mongo")
class Configuration { … }
```

