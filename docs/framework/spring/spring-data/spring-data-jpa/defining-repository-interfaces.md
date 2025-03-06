# 定义存储库接口

要定义一个存储库接口，首先需要定义一个特定于域类的存储库接口。该接口必须扩展 `Repository` 并指定域类和 ID 类型。如果你想为该域类型公开 CRUD 方法，可以扩展 `CrudRepository` 或它的变体，而不是 `Repository`。

## 微调存储库定义

你可以通过几种不同的方式开始定义你的存储库接口。

典型的方法是扩展 `CrudRepository`，它为你提供 CRUD 功能的方法。CRUD 代表创建（Create）、读取（Read）、更新（Update）和删除（Delete）。在 3.0 版本中，我们还引入了 `ListCrudRepository`，它与 `CrudRepository` 非常相似，但对于那些返回多个实体的方法，它返回 `List` 而不是 `Iterable`，你可能会觉得它更容易使用。

如果你使用的是反应式存储，你可能会选择 `ReactiveCrudRepository`，或者根据使用的反应式框架选择 `RxJava3CrudRepository`。

如果你使用的是 Kotlin，你可能会选择 `CoroutineCrudRepository`，它利用了 Kotlin 的协程。

此外，如果你需要能够指定 `Sort` 抽象或在第一个情况下指定 `Pageable` 抽象的方法，你可以扩展 `PagingAndSortingRepository`、`ReactiveSortingRepository`、`RxJava3SortingRepository` 或 `CoroutineSortingRepository`。请注意，多个排序存储库不再像 Spring Data 3.0 之前的版本那样扩展各自的 CRUD 存储库。因此，如果你需要两个功能，你需要同时扩展这两个接口。

如果你不想扩展 Spring Data 接口，你也可以用 `@RepositoryDefinition` 注解你的存储库接口。扩展其中一个 CRUD 存储库接口会公开一组完整的方法来操作你的实体。如果你希望选择性地公开方法，你可以将你希望公开的方法从 CRUD 存储库复制到你的领域存储库。在这样做时，你可以更改方法的返回类型。Spring Data 会尽可能地尊重返回类型。例如，对于返回多个实体的方法，你可以选择 `Iterable<T>`、`List<T>`、`Collection<T>` 或 VAVR 列表。

如果你应用中的许多存储库应该具有相同的一组方法，你可以定义自己的基础接口进行继承。这样的接口必须用 `@NoRepositoryBean` 注解。这可以防止 Spring Data 尝试直接创建它的实例并失败，因为它无法确定该存储库的实体，因为它仍然包含一个泛型类型变量。

以下示例展示了如何选择性地公开 CRUD 方法（在此案例中是 `findById` 和 `save`）：

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

在之前的示例中，你定义了一个所有领域存储库的通用基础接口，并公开了 `findById(…)` 和 `save(…)` 方法。这些方法会路由到你选择的存储库的基础实现中，Spring Data 会提供相应的实现（例如，如果你使用 JPA，默认实现是 `SimpleJpaRepository`）。因为它们与 `CrudRepository` 中的方法签名匹配。所以 `UserRepository` 现在可以保存用户、通过 ID 查找单个用户，并触发查询通过电子邮件地址查找用户。

> [!NOTE]
>
> 中间存储库接口使用了 `@NoRepositoryBean` 注解。确保将该注解添加到所有不希望 Spring Data 在运行时创建实例的存储库接口上。

## 使用多个 Spring Data 模块的存储库

在应用程序中使用唯一的 Spring Data 模块使事情变得简单，因为在定义的范围内，所有存储库接口都绑定到该 Spring Data 模块。有时，应用程序需要使用多个 Spring Data 模块。在这种情况下，存储库定义必须区分持久化技术。当检测到类路径上有多个存储库工厂时，Spring Data 会进入严格的存储库配置模式。严格配置使用存储库或领域类的详细信息来决定存储库定义的 Spring Data 模块绑定：

- 如果存储库定义扩展了特定模块的存储库接口，则它是该特定 Spring Data 模块的有效候选。
- 如果领域类带有特定模块的类型注解，则它是该特定 Spring Data 模块的有效候选。Spring Data 模块接受第三方注解（例如 JPA 的 @Entity）或提供自己的注解（例如 Spring Data MongoDB 和 Spring Data Elasticsearch 的 @Document）。

以下示例展示了一个使用模块特定接口（此处为 JPA）的存储库：

```java
interface MyRepository extends JpaRepository<User, Long> { }

@NoRepositoryBean
interface MyBaseRepository<T, ID> extends JpaRepository<T, ID> { … }

interface UserRepository extends MyBaseRepository<User, Long> { … }

// MyRepository 和 UserRepository 在它们的类型层次结构中扩展了 JpaRepository。它们是 Spring Data JPA 模块的有效候选者。
```

以下示例显示了一个使用泛型接口的仓库：

```java
interface AmbiguousRepository extends Repository<User, Long> { … }

@NoRepositoryBean
interface MyBaseRepository<T, ID> extends CrudRepository<T, ID> { … }

interface AmbiguousUserRepository extends MyBaseRepository<User, Long> { … }

// AmbiguousRepository 和 AmbiguousUserRepository 仅在其类型层次结构中扩展了 Repository 和 CrudRepository。当使用唯一的 Spring Data 模块时，这是可以的，但当有多个模块时，无法区分这些仓库应该绑定到哪个特定的 Spring Data 模块。
```

以下示例展示了使用带有注解的域类的仓库：

```java
interface PersonRepository extends Repository<Person, Long> { … }

@Entity
class Person { … }

interface UserRepository extends Repository<User, Long> { … }

@Document
class User { … }

// PersonRepository 引用的 Person 被 JPA 的 @Entity 注解标注，因此该仓库显然属于 Spring Data JPA。UserRepository 引用的 User 被 Spring Data MongoDB 的 @Document 注解标注。
```

以下是一个不良示例，展示了一个使用混合注解的领域类的仓库：

```java
interface JpaPersonRepository extends Repository<Person, Long> { … }

interface MongoDBPersonRepository extends Repository<Person, Long> { … }

@Entity
@Document
class Person { … }

// 这个示例展示了一个领域类同时使用了 JPA 和 Spring Data MongoDB 注解。它定义了两个仓库，JpaPersonRepository 和 MongoDBPersonRepository，一个用于 JPA，另一个用于 MongoDB。Spring Data 无法区分这两个仓库，这会导致未定义的行为。
```

仓库类型的详细信息和区分领域类注解用于严格的仓库配置，以识别特定 Spring Data 模块的仓库候选者。使用多个持久化技术特定注解在同一个领域类型上是可能的，这使得领域类型可以在多个持久化技术之间重用。然而，Spring Data 无法再确定与仓库绑定的唯一模块。

区分仓库的最后一种方式是通过作用域仓库的基础包。基础包定义了扫描仓库接口定义的起点，这意味着仓库定义应该位于适当的包中。默认情况下，基于注解的配置使用配置类的包。基于 XML 的配置中，基础包是必需的。

以下示例展示了注解驱动配置基础包的方式：

```java
@EnableJpaRepositories(basePackages = "com.acme.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.acme.repositories.mongo")
class Configuration { … }
```

