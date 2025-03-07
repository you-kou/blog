# 定义查询方法

 仓库代理有两种方式从方法名派生存储特定的查询：

1. **直接从方法名派生查询**
2. **使用手动定义的查询**

可用的选项取决于实际的存储类型。然而，必须有一个策略来决定创建什么样的实际查询。接下来的部分将描述可用的选项。

## 查询查找策略

 以下策略可用于仓库基础设施解析查询。在XML配置中，可以通过`query-lookup-strategy`属性在命名空间中配置策略。对于Java配置，可以使用`EnableJpaRepositories`注解的`queryLookupStrategy`属性。某些策略可能不支持特定的数据存储。

- **CREATE** 尝试从查询方法名称构造存储特定的查询。通常的方法是移除方法名称中的一组已知前缀，然后解析剩余的部分。可以在“查询创建”中了解更多关于查询构建的信息。
- **USE_DECLARED_QUERY** 尝试查找声明的查询，如果找不到，则抛出异常。查询可以通过注解定义，也可以通过其他方式声明。请参阅特定存储的文档，查找该存储可用的选项。如果仓库基础设施在引导期间没有找到方法的声明查询，则会失败。
- **CREATE_IF_NOT_FOUND** （默认策略）结合了CREATE和USE_DECLARED_QUERY。它首先查找声明的查询，如果没有找到声明的查询，则基于方法名称创建自定义查询。这是默认的查找策略，因此如果没有显式配置，它会被使用。它允许通过方法名称快速定义查询，并通过需要时引入声明的查询来进行自定义调整。

## 查询创建

 Spring Data 仓库基础设施内置的查询构建机制对于在仓库实体上构建约束查询非常有用。

以下示例展示了如何创建多个查询：

```JAVA
interface PersonRepository extends Repository<Person, Long> {

  List<Person> findByEmailAddressAndLastname(EmailAddress emailAddress, String lastname);

  // Enables the distinct flag for the query
  List<Person> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);
  List<Person> findPeopleDistinctByLastnameOrFirstname(String lastname, String firstname);

  // Enabling ignoring case for an individual property
  List<Person> findByLastnameIgnoreCase(String lastname);
  // Enabling ignoring case for all suitable properties
  List<Person> findByLastnameAndFirstnameAllIgnoreCase(String lastname, String firstname);

  // Enabling static ORDER BY for a query
  List<Person> findByLastnameOrderByFirstnameAsc(String lastname);
  List<Person> findByLastnameOrderByFirstnameDesc(String lastname);
}
```

解析查询方法名称分为主题和谓词。第一部分（find…By，exists…By）定义了查询的主题，第二部分形成了谓词。引导部分（主题）可以包含更多表达式。位于find（或其他引导关键字）和By之间的任何文本都被视为描述性的，除非使用了结果限制关键字，如Distinct用于在要创建的查询中设置去重标志，或Top/First用于限制查询结果。

附录包含了[查询方法主题关键字](/framework/spring/spring-data/spring-data-commons/appendices/repository-query-keywords#支持的查询方法主题关键字)和[查询方法谓词关键字](/framework/spring/spring-data/spring-data-commons/appendices/repository-query-keywords#支持的查询方法谓词关键字和修饰符)的完整列表，包括排序和字母大小写修饰符。然而，第一个By作为分隔符，表示实际条件谓词的开始。在最基本的层面上，你可以在实体属性上定义条件，并使用And和Or将它们连接起来。

解析方法的实际结果取决于您为其创建查询的持久化存储。然而，有一些一般的注意事项：

- 这些表达式通常是属性遍历与运算符的组合，可以进行连接。您可以使用AND和OR将属性表达式组合在一起。您还可以使用运算符，如Between、LessThan、GreaterThan和Like，来对属性表达式进行操作。支持的运算符可能因数据存储而异，因此请查阅适当的参考文档部分。

- 方法解析器支持为单个属性设置IgnoreCase标志（例如，findByLastnameIgnoreCase(…)），或为所有支持忽略大小写的类型的属性（通常是String实例，例如findByLastnameAndFirstnameAllIgnoreCase(…)）设置此标志。是否支持忽略大小写可能因存储而异，因此请查阅参考文档中与存储特定查询方法相关的部分。

- 您可以通过将OrderBy子句附加到查询方法来引用属性并提供排序方向（Asc或Desc），从而应用静态排序。要创建支持动态排序的查询方法，请参见“分页、大结果集迭代、排序和限制”。

## 保留方法名称

虽然派生的仓库方法通过名称绑定到属性，但在某些方法名的情况下，有一些例外，这些方法是从基仓库继承的，针对标识符属性。这些保留方法，如 CrudRepository#findById（或仅 findById），无论声明的方法中实际使用的属性名称如何，都会针对标识符属性。

考虑以下持有属性 `pk`，并通过 `@Id` 标记为标识符的领域类型，以及名为 `id` 的属性。在这种情况下，您需要特别注意查找方法的命名，因为它们可能会与预定义的签名发生冲突：

```java
class User {
  @Id Long pk; // 标识符属性（主键）。

  Long id; // 一个名为 id 的属性，但不是标识符。

  // …
}

interface UserRepository extends Repository<User, Long> {

  Optional<User> findById(Long id); // 目标是 pk 属性（即标记为 @Id 的属性，视为标识符），因为它引用了 CrudRepository 基础仓库方法。因此，它不是一个派生查询，尽管使用 id 作为属性名称可能会让人误解，因为这是一个保留方法。

  Optional<User> findByPk(Long pk); // 通过名称直接引用 pk 属性，它是一个派生查询。

  Optional<User> findUserById(Long id); // 通过在 find 和 by 之间使用描述性标记，目标是 id 属性，以避免与保留方法发生冲突。
}
```

这种特殊行为不仅适用于查找方法，还适用于存在性（exists）和删除（delete）方法。请参考[Repository查询关键字](/framework/spring/spring-data/spring-data-commons/appendices/repository-query-keywords#保留方法)以获取方法列表。

## 属性表达式

属性表达式只能引用托管实体的直接属性，如前面的示例所示。在查询创建时，您已经确保解析的属性是托管域类的属性。但是，您还可以通过遍历嵌套属性来定义约束。考虑以下方法签名：

```java
List<Person> findByAddressZipCode(ZipCode zipCode);
```

假设一个 Person 类有一个 Address 属性，而 Address 又有一个 ZipCode 属性。在这种情况下，方法会创建 x.address.zipCode 属性的遍历。解析算法首先将整个部分（AddressZipCode）作为属性进行解释，并检查域类中是否有该名称的属性（小写形式）。如果算法成功，它将使用该属性。如果没有，它会从右侧的驼峰式单词中拆分源部分为头部和尾部，并尝试查找相应的属性——在我们的示例中是 AddressZip 和 Code。如果算法找到带有该头部的属性，它将使用尾部并继续构建树，从那里开始将尾部按照之前描述的方式拆分。如果第一次拆分没有匹配，算法会将拆分点移到左边（Address, ZipCode），并继续。

虽然这种方法适用于大多数情况，但算法也可能选择错误的属性。假设 Person 类有一个 addressZip 属性。在第一次拆分时，算法会匹配并选择错误的属性，并失败（因为 addressZip 的类型可能没有 code 属性）。

为了解决这个歧义，您可以在方法名中使用下划线（_）手动定义遍历点。因此，我们的方法名将如下所示：

```java
List<Person> findByAddress_ZipCode(ZipCode zipCode);
```

> [!NOTE]
>
> 因为我们将下划线（_）视为保留字符，因此强烈建议遵循标准的 Java 命名约定（即在属性名称中不使用下划线，而是采用驼峰命名法）。

> [!CAUTION]
>
> *字段名称以下划线开头：*
>
> 字段名称可以以下划线开始，例如 `String _name`。确保保留下划线并使用双下划线来拆分嵌套路径，例如 `user__name`。
>
> *大写字段名称：*
>
> 完全由大写字母组成的字段名称可以按原样使用。如果需要嵌套路径，则需要通过下划线拆分，例如 `USER_name`。
>
> *字段名称中有第二个大写字母：*
>
> 字段名称由一个小写字母开头，后跟一个大写字母（例如 `String qCode`）的情况，可以通过两个大写字母来解决，如 `QCode`。请注意潜在的路径歧义。
>
> *路径歧义：*
>
> 在以下示例中，属性 `qCode` 和 `q` 的排列（其中 `q` 包含一个名为 `code` 的属性）创建了路径 `QCode` 的歧义。
>
> ```java
> record Container(String qCode, Code q) {}
> record Code(String code) {}
> ```
>
> 由于首先会考虑直接匹配属性，因此任何潜在的嵌套路径将不会被考虑，算法会选择 `qCode` 字段。为了选择 `q` 中的 `code` 字段，需要使用下划线表示法 `Q_Code`。

## 返回集合或迭代器的存储库方法

 返回多个结果的查询方法可以使用标准的 Java Iterable、List 和 Set。除此之外，我们还支持返回 Spring Data 的 Streamable（Iterable 的自定义扩展）以及 Vavr 提供的集合类型。有关所有可能的查询方法返回类型，请参阅附录。

### 使用 Streamable 作为查询方法返回类型

 你可以将 Streamable 作为 Iterable 或任何集合类型的替代方案。它提供了便利的方法来访问非并行的 Stream（Iterable 中缺失的）以及直接对元素进行 ….filter(…) 和 ….map(…) 操作的能力，并且可以将 Streamable 连接到其他 Streamable 中：

```java
interface PersonRepository extends Repository<Person, Long> {
  Streamable<Person> findByFirstnameContaining(String firstname);
  Streamable<Person> findByLastnameContaining(String lastname);
}

Streamable<Person> result = repository.findByFirstnameContaining("av")
  .and(repository.findByLastnameContaining("ea"));
```

### 返回自定义 Streamable 包装类型

为集合提供专用的包装类型是一个常用的模式，用于提供查询结果的 API，该查询结果返回多个元素。通常，这些类型通过调用返回类似集合的类型的仓库方法并手动创建包装类型的实例来使用。Spring Data 允许你使用这些包装类型作为查询方法的返回类型，只要它们满足以下条件：

- 该类型实现了 Streamable。
- 该类型暴露了一个构造函数或一个名为 `of(…)` 或 `valueOf(…)` 的静态工厂方法，该方法接受 Streamable 作为参数。

以下是一个示例：

```java
class Product { // 一个暴露访问产品价格的API的Product实体。
  MonetaryAmount getPrice() { … }
}

@RequiredArgsConstructor(staticName = "of")
class Products implements Streamable<Product> { // 一个Streamable<Product>的包装类型，可以通过使用Products.of(…)（使用Lombok注解创建的工厂方法）构造。也可以使用一个接受Streamable<Product>的标准构造函数。

  private final Streamable<Product> streamable;

  public MonetaryAmount getTotal() { // 该包装类型暴露了一个额外的API，用于计算Streamable<Product>上的新值。
    return streamable.stream()
      .map(Product::getPrice)
      .reduce(Money.of(0), MonetaryAmount::add);
  }


  @Override
  public Iterator<Product> iterator() { // 实现Streamable接口并委托给实际结果。
    return streamable.iterator();
  }
}

interface ProductRepository implements Repository<Product, Long> {
  Products findAllByDescriptionContaining(String text); // 这个包装类型Products可以直接作为查询方法的返回类型使用。您无需在查询后手动包装Streamable<Product>。
}
```

### Vavr Collections 支持

Vavr 是一个在 Java 中采用函数式编程概念的库。它提供了一套自定义的集合类型，您可以将这些类型用作查询方法的返回类型，如下表所示：

| Vavr collection type     | Used Vavr implementation type      | Valid Java source types |
| :----------------------- | :--------------------------------- | :---------------------- |
| `io.vavr.collection.Seq` | `io.vavr.collection.List`          | `java.util.Iterable`    |
| `io.vavr.collection.Set` | `io.vavr.collection.LinkedHashSet` | `java.util.Iterable`    |
| `io.vavr.collection.Map` | `io.vavr.collection.LinkedHashMap` | `java.util.Map`         |

您可以使用第一列中的类型（或其子类型）作为查询方法的返回类型，并根据实际查询结果的 Java 类型（第三列）使用第二列中的类型作为实现类型。或者，您可以声明 Traversable（Vavr 的 Iterable 等价物），然后我们会根据实际的返回值推导实现类。也就是说，一个 java.util.List 会被转换为 Vavr 的 List 或 Seq，一个 java.util.Set 会变成 Vavr 的 LinkedHashSet Set，等等。

## 流式查询结果

您可以通过使用 Java 8 的 `Stream<T>` 作为返回类型，逐步处理查询方法的结果。与将查询结果包装成一个流不同，使用特定于数据存储的方法来执行流式处理，如下所示的示例所示：

```java
@Query("select u from User u")
Stream<User> findAllByCustomQueryAndStream();

Stream<User> readAllByFirstnameNotNull();

@Query("select u from User u")
Stream<User> streamAllPaged(Pageable pageable);
```

> [!NOTE]
>
> 流可能会包装底层特定于数据存储的资源，因此必须在使用后关闭。您可以通过使用 `close()` 方法手动关闭流，或者使用 Java 7 的 try-with-resources 块，如下例所示：
>
> ```java
> try (Stream<User> stream = repository.findAllByCustomQueryAndStream()) {
>   stream.forEach(…);
> }
> ```

> [!NOTE]
>
> 并非所有 Spring Data 模块目前都支持 `Stream<T>` 作为返回类型。

## 异步查询结果

 您可以通过使用 Spring 的异步方法执行功能来异步运行仓库查询。这意味着方法在调用时会立即返回，而实际的查询会在提交到 Spring TaskExecutor 的任务中执行。异步查询与响应式查询不同，且不应混合使用。有关响应式支持的更多细节，请参阅特定存储的文档。以下示例展示了多个异步查询：

```java
@Async
Future<User> findByFirstname(String firstname);

@Async
CompletableFuture<User> findOneByFirstname(String firstname);
```

## 分页、迭代大结果集、排序和限制

 为了处理查询中的参数，您可以像前面示例中所看到的那样定义方法参数。除此之外，基础设施还识别一些特定类型，如 Pageable、Sort 和 Limit，用于动态地应用分页、排序和结果限制。以下示例展示了这些功能：

```java
Page<User> findByLastname(String lastname, Pageable pageable);

Slice<User> findByLastname(String lastname, Pageable pageable);

List<User> findByLastname(String lastname, Sort sort);

List<User> findByLastname(String lastname, Sort sort, Limit limit);

List<User> findByLastname(String lastname, Pageable pageable);
```

> [!IMPORTANT]
>
> 接受 Sort、Pageable 和 Limit 的 API 期望传入非空值。如果您不想应用任何排序或分页，可以使用 Sort.unsorted()、Pageable.unpaged() 和 Limit.unlimited()。

第一个方法允许您将一个 `org.springframework.data.domain.Pageable` 实例传递给查询方法，从而动态地将分页添加到静态定义的查询中。`Page` 知道总共有多少元素和页数。这是通过基础设施触发计数查询来计算总体数目实现的。由于这可能很昂贵（取决于所使用的存储），您可以选择返回 `Slice`。`Slice` 仅知道是否有下一个 `Slice` 可用，这在遍历较大的结果集时可能足够。

排序选项也通过 `Pageable` 实例处理。如果您只需要排序，可以向方法添加一个 `org.springframework.data.domain.Sort` 参数。如您所见，返回 `List` 也是可能的。在这种情况下，不会创建构建实际 `Page` 实例所需的附加元数据（这反过来意味着不发出可能需要的额外计数查询）。相反，它限制查询只查找给定范围内的实体。

> [!NOTE]
>
> 为了找出整个查询能得到多少页，您必须触发一个额外的计数查询。默认情况下，这个查询是从您实际触发的查询派生出来的。

> [!IMPORTANT]
>
> 特殊参数在查询方法中只能使用一次。
>  一些上述描述的特殊参数是互斥的。请考虑以下无效的参数组合。
>
> | Parameters             | Example                               | Reason                              |
> | :--------------------- | :------------------------------------ | :---------------------------------- |
> | `Pageable` and `Sort`  | `findBy…(Pageable page, Sort sort)`   | `Pageable` already defines `Sort`   |
> | `Pageable` and `Limit` | `findBy…(Pageable page, Limit limit)` | `Pageable` already defines a limit. |
>
> `Top` 关键字用于限制结果数量，可以与 `Pageable` 一起使用，其中 `Top` 定义了结果的最大总数，而 `Pageable` 参数可能会减少这个数量。

### 适当的方法是哪个？ 

通过以下表格展示的查询方法返回类型，可以最清楚地展示 Spring Data 抽象提供的价值。该表格显示了查询方法可以返回的类型。

| Method                                                       | Amount of Data Fetched                                       | Query Structure                                              | Constraints                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`List`](https://docs.spring.io/spring-data/commons/reference/repositories/query-methods-details.html#repositories.collections-and-iterables) | All results.                                                 | Single query.                                                | 查询结果可能会耗尽所有内存。获取所有数据可能会消耗大量时间。 |
| [`Streamable`](https://docs.spring.io/spring-data/commons/reference/repositories/query-methods-details.html#repositories.collections-and-iterables.streamable) | All results.                                                 | Single query.                                                | 查询结果可能会耗尽所有内存。获取所有数据可能会消耗大量时间。 |
| [`Stream`](https://docs.spring.io/spring-data/commons/reference/repositories/query-methods-details.html#repositories.query-streaming) | Chunked (one-by-one or in batches) depending on `Stream` consumption. | Single query using typically cursors.                        | 使用完流后必须关闭，以避免资源泄漏。                         |
| `Flux<T>`                                                    | Chunked (one-by-one or in batches) depending on `Flux` consumption. | Single query using typically cursors.                        | 存储模块必须提供响应式基础设施。                             |
| `Slice<T>`                                                   | `Pageable.getPageSize() + 1` at `Pageable.getOffset()`       | 一对多查询从 `Pageable.getOffset()` 开始，应用限制来获取数据。 | `Slice` 只能导航到下一个 `Slice`。`Slice` 提供了是否还有更多数据可获取的详细信息。当偏移量过大时，基于偏移量的查询会变得低效，因为数据库仍然需要对完整的结果集进行物化。`Window` 提供了是否还有更多数据可获取的详细信息。 |
| `Page<T>`                                                    | `Pageable.getPageSize()` at `Pageable.getOffset()`           | 一对多查询从 `Pageable.getOffset()` 开始，并应用限制。此外，可能需要 `COUNT(…)` 查询来确定元素的总数。 | 通常，`COUNT(…)` 查询是必需的，但它们会非常昂贵。当偏移量过大时，基于偏移量的查询会变得低效，因为数据库仍然需要物化整个结果集。 |

### 分页和排序

您可以使用属性名称定义简单的排序表达式。可以将多个表达式连接起来，收集多个标准成一个表达式。

```java
Sort sort = Sort.by("firstname").ascending()
  .and(Sort.by("lastname").descending());
```

为了更具类型安全地定义排序表达式，可以从要定义排序表达式的类型开始，并使用方法引用来定义排序的属性。

```java
TypedSort<Person> person = Sort.sort(Person.class);

Sort sort = person.by(Person::getFirstname).ascending()
  .and(person.by(Person::getLastname).descending());
```

> [!NOTE]
>
> `TypedSort.by(…)` 通过使用运行时代理（通常是使用 CGlib）来实现，这可能会在使用像 Graal VM Native 这样的工具进行原生镜像编译时产生干扰。

如果您的存储实现支持 Querydsl，您还可以使用生成的元模型类型来定义排序表达式：

```java
QSort sort = QSort.by(QPerson.firstname.asc())
  .and(QSort.by(QPerson.lastname.desc()));
```

### 限制查询结果

除了分页，您还可以使用专门的 Limit 参数来限制结果大小。您还可以通过使用 First 或 Top 关键字来限制查询方法的结果，这两个关键字可以互换使用，但不能与 Limit 参数混合使用。您可以在 Top 或 First 后附加一个可选的数字值，以指定返回的最大结果大小。如果没有附加数字，则假定返回的结果大小为 1。以下示例演示了如何限制查询大小：

```java
List<User> findByLastname(Limit limit);

User findFirstByOrderByLastnameAsc();

User findTopByOrderByAgeDesc();

Page<User> queryFirst10ByLastname(String lastname, Pageable pageable);

Slice<User> findTop3ByLastname(String lastname, Pageable pageable);

List<User> findFirst10ByLastname(String lastname, Sort sort);

List<User> findTop10ByLastname(String lastname, Pageable pageable);
```

限制表达式还支持 `Distinct` 关键字，用于支持去重查询的数据存储。此外，对于将结果集限制为一个实例的查询，支持将结果包装到 `Optional` 关键字中。

如果在限制查询上应用了分页或切片（以及可用页面数量的计算），它将仅在有限的结果集内应用。

> [!NOTE]
>
> 将结果限制与使用 `Sort` 参数的动态排序相结合，可以让你表达查询方法，用于获取 "K" 个最小元素以及 "K" 个最大元素。

