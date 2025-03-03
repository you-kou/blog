# [使用 `@Resource` 注解进行注入](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/resource.html)

Spring 还支持通过在字段或 Bean 属性 setter 方法上使用 JSR-250 的 `@Resource` 注解（`jakarta.annotation.Resource`）进行注入。这是 Jakarta EE 中常见的模式：例如，在 JSF 管理的 Bean 和 JAX-WS 端点中。Spring 也支持 Spring 管理的对象使用这种模式。

`@Resource` 有一个 `name` 属性。默认情况下，Spring 将该值解释为要注入的 Bean 名称。换句话说，它遵循按名称注入的语义，如以下示例所示：

```java
public class SimpleMovieLister {

	private MovieFinder movieFinder;

	@Resource(name="myMovieFinder")
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}
}
```

如果没有显式指定名称，则默认名称由字段名或 setter 方法派生。在字段的情况下，它采用字段名；在 setter 方法的情况下，它采用 Bean 属性名称。以下示例将在 setter 方法中注入名为 `movieFinder` 的 Bean：

```java
public class SimpleMovieLister {

	private MovieFinder movieFinder;

	@Resource
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}
}
```

> [!NOTE]
>
> 通过注解提供的名称将被 `ApplicationContext` 解析为一个 Bean 名称，`CommonAnnotationBeanPostProcessor` 会识别这个名称。如果显式配置了 Spring 的 `SimpleJndiBeanFactory`，名称也可以通过 JNDI 进行解析。然而，我们建议您依赖默认行为，并使用 Spring 的 JNDI 查找功能，以保持间接访问的层次。

在没有显式指定名称的情况下使用 `@Resource` 注解的特殊情况下，与 `@Autowired` 类似，`@Resource` 会首先查找主类型匹配，而不是特定的命名 Bean，并解析一些已知的可解析依赖项：如 `BeanFactory`、`ApplicationContext`、`ResourceLoader`、`ApplicationEventPublisher` 和 `MessageSource` 接口。

因此，在以下示例中，`customerPreferenceDao` 字段首先查找名为 "customerPreferenceDao" 的 Bean，然后回退到按类型匹配查找 `CustomerPreferenceDao` 类型的 Bean：

```java
public class MovieRecommender {

	@Resource
	private CustomerPreferenceDao customerPreferenceDao;

	@Resource
	private ApplicationContext context;

	public MovieRecommender() {
	}

	// ...
}
```

**依赖注入注解总结**：

| 注解         | 注入方式       | 默认行为        | 可选属性/特性                                     |
| ------------ | -------------- | --------------- | ------------------------------------------------- |
| `@Autowired` | 按类型注入     | 必须匹配到 Bean | `required` 属性，支持 `@Qualifier` 和 `@Primary`  |
| `@Resource`  | 按名称注入     | 默认按名称查找  | 可指定 `name`，如果没有指定则按字段名或方法名推断 |
| `@Inject`    | 按类型注入     | 必须匹配到 Bean | 无 `required` 属性，支持 `@Qualifier`             |
| `@Value`     | 注入外部配置值 | 从配置文件加载  | 支持 SpEL，注入基本类型和配置值                   |

