# [使用 `@Autowired`](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired.html)

> [!NOTE]
>
> JSR 330 的 @Inject 注解可以替代 Spring 的 @Autowired 注解，在本节中包含的示例中使用。

您可以将 @Autowired 注解应用于构造函数，如下例所示：

```java
public class MovieRecommender {

	private final CustomerPreferenceDao customerPreferenceDao;

	@Autowired
	public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
		this.customerPreferenceDao = customerPreferenceDao;
	}

	// ...
}
```

> [!NOTE]
>
> 从 Spring Framework 4.3 起，如果目标 bean 只定义了一个构造函数，则不再需要在该构造函数上使用 @Autowired 注解。然而，如果有多个构造函数可用，并且没有默认构造函数，那么必须至少在一个构造函数上使用 @Autowired 注解，以指示容器应该使用哪一个构造函数。

您也可以将 @Autowired 注解应用于传统的 setter 方法，示例如下：

```java
public class SimpleMovieLister {

	private MovieFinder movieFinder;

	@Autowired
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// ...
}
```

您还可以将注解应用于具有任意名称和多个参数的方法，如下例所示：

```java
public class MovieRecommender {

	private MovieCatalog movieCatalog;

	private CustomerPreferenceDao customerPreferenceDao;

	@Autowired
	public void prepare(MovieCatalog movieCatalog,
			CustomerPreferenceDao customerPreferenceDao) {
		this.movieCatalog = movieCatalog;
		this.customerPreferenceDao = customerPreferenceDao;
	}

	// ...
}
```

您可以将 @Autowired 应用于字段，甚至与构造函数混合使用，如下例所示：

```java
public class MovieRecommender {

	private final CustomerPreferenceDao customerPreferenceDao;

	@Autowired
	private MovieCatalog movieCatalog;

	@Autowired
	public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
		this.customerPreferenceDao = customerPreferenceDao;
	}

	// ...
}
```

> [!TIP]
>
> 确保您的目标组件（例如 MovieCatalog 或 CustomerPreferenceDao）始终以用于 `@Autowired` 注入点的类型声明，否则在运行时可能会因“未找到匹配类型”错误而导致注入失败。
>
> 对于 XML 定义的 Bean 或通过类路径扫描找到的组件，容器通常可以提前知道具体类型。然而，对于 `@Bean` 工厂方法，您需要确保声明的返回类型足够明确。对于实现多个接口的组件，或者可能通过其实现类型引用的组件，请考虑在工厂方法中声明最具体的返回类型（至少要与引用该 Bean 的注入点所需的类型一样具体）。

> **自我注入（Self Injection）**
>
> `@Autowired` 也支持对自身的注入（即对当前被注入 Bean 的自引用）。
>
> 然而，需要注意的是，自我注入是一种**后备机制**（fallback mechanism）。对于其他组件的常规依赖总是优先考虑。因此，自引用不会参与常规自动装配候选项的选择，特别是它**永远不会**被视为主要候选项，相反，它的优先级始终最低。
>
> 在实际开发中，应仅将自我引用作为**最后的手段**，例如在**通过 Bean 的事务代理调用同一实例的其他方法**时。如果遇到这种情况，建议**将相关方法提取到一个独立的委托 Bean**，以避免使用自我注入。
>
> 另一种替代方案是使用 `@Resource`，它可以通过 Bean 的**唯一名称**获取一个指向当前 Bean 的代理对象。
>
> > [!NOTE]
> >
> > 在同一个 `@Configuration` 类中尝试注入 `@Bean` 方法的返回结果，实际上也是一种自引用场景。
> >
> > 要么在实际需要的地方（方法签名中）延迟解析这些引用（而不是在配置类中的 `@Autowired` 字段上），要么将受影响的 `@Bean` 方法声明为 `static`，使其与包含它的配置类实例及其生命周期解耦。否则，这些 Bean 仅会在回退阶段被考虑，而在其他配置类中匹配的 Bean（如果可用）将被优先作为主要候选项。

您还可以通过在期望该类型数组的字段或方法上添加 `@Autowired` 注解，指示 Spring 从 `ApplicationContext` 提供该特定类型的所有 Bean，如下例所示：

```java
public class MovieRecommender {

	@Autowired
	private MovieCatalog[] movieCatalogs;

	// ...
}
```

同样适用于特定类型的集合，如下例所示：

```java
public class MovieRecommender {

	private Set<MovieCatalog> movieCatalogs;

	@Autowired
	public void setMovieCatalogs(Set<MovieCatalog> movieCatalogs) {
		this.movieCatalogs = movieCatalogs;
	}

	// ...
}
```

> [!TIP]
>
> 如果您希望数组或列表中的项目按照特定顺序排序，您的目标 Bean 可以实现 `org.springframework.core.Ordered` 接口，或者使用 `@Order` 或标准的 `@Priority` 注解。否则，它们的顺序将遵循容器中对应目标 Bean 定义的注册顺序。
>
> 您可以在目标类级别和 `@Bean` 方法上声明 `@Order` 注解，可能用于单个 Bean 定义（如果存在多个定义使用相同的 Bean 类）。`@Order` 值可能会影响注入点的优先级，但请注意，它们不会影响单例启动顺序，后者是由依赖关系和 `@DependsOn` 声明决定的正交问题。
>
> 需要注意的是，`@Order` 注解在配置类上只会影响启动时在整体配置类集合中的评估顺序。这些配置级别的顺序值不会影响包含的 `@Bean` 方法。对于 Bean 层次的排序，每个 `@Bean` 方法需要有自己的 `@Order` 注解，这适用于特定 Bean 类型的多个匹配项（由工厂方法返回）。
>
> 需要注意的是，标准的 `jakarta.annotation.Priority` 注解在 `@Bean` 层级不可用，因为它不能在方法上声明。它的语义可以通过 `@Order` 值与 `@Primary` 结合使用，在每种类型的单个 Bean 上建模。

即使是类型化的 `Map` 实例，也可以进行自动注入，只要预期的键类型是 `String`。地图的值包含所有预期类型的 Bean，键包含相应的 Bean 名称，如下例所示：

```java
public class MovieRecommender {

	private Map<String, MovieCatalog> movieCatalogs;

	@Autowired
	public void setMovieCatalogs(Map<String, MovieCatalog> movieCatalogs) {
		this.movieCatalogs = movieCatalogs;
	}

	// ...
}
```

默认情况下，当没有匹配的候选 Bean 可用于给定的注入点时，自动注入会失败。在声明的数组、集合或映射的情况下，至少需要一个匹配的元素。

默认行为是将带注解的方法和字段视为必需的依赖项。您可以通过如下示例改变这种行为，使框架能够通过将注入点标记为非必需（即通过将 `@Autowired` 中的 `required` 属性设置为 `false`）来跳过无法满足的注入点：

```java
public class SimpleMovieLister {

	private MovieFinder movieFinder;

	@Autowired(required = false)
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// ...
}
```

> [!NOTE]
>
> 如果一个方法的依赖（或者在有多个参数的情况下，其中一个依赖）不可用，则该非必需方法根本不会被调用。在这种情况下，非必需字段也不会被填充，而是保留其默认值。
>
> 换句话说，将 `required` 属性设置为 `false` 表示该属性在自动注入时是可选的，如果无法进行自动注入，则该属性会被忽略。这允许为属性分配默认值，并通过依赖注入选择性地覆盖这些默认值。

注入的构造函数和工厂方法参数是一个特殊情况，因为由于 Spring 的构造函数解析算法，它们在 `@Autowired` 中的 `required` 属性具有不同的含义，这可能涉及多个构造函数。在单构造函数的情况下，构造函数和工厂方法参数默认是必需的，但在某些特殊规则下，如多元素注入点（数组、集合、映射）会在没有匹配的 Bean 时解析为空实例。这允许一种常见的实现模式，其中所有依赖项都可以在一个唯一的多参数构造函数中声明——例如，声明为一个没有 `@Autowired` 注解的公共构造函数。

> [!NOTE]
>
> 任何给定的 Bean 类只能有一个构造函数声明 `@Autowired` 且 `required` 属性设置为 `true`，表示在作为 Spring Bean 使用时需要自动注入该构造函数。因此，如果 `required` 属性保持默认值 `true`，则只能有一个构造函数可以标注 `@Autowired`。如果多个构造函数声明了该注解，它们都必须声明 `required=false`，才能被视为自动注入的候选项（类似于 XML 中的 `autowire=constructor`）。将选择具有最多依赖项并且能够通过 Spring 容器中的匹配 Bean 满足的构造函数。如果没有候选构造函数能够满足依赖关系，则会使用主构造函数/默认构造函数（如果存在）。类似地，如果一个类声明了多个构造函数，但没有一个被 `@Autowired` 注解标注，则会使用主构造函数/默认构造函数（如果存在）。如果一个类最初只声明了一个构造函数，则即使该构造函数没有标注注解，也会始终使用该构造函数。需要注意的是，被注解的构造函数不一定是 `public` 的。

另外，您可以通过 Java 8 的 `java.util.Optional` 来表达某个依赖项的非必需性质，如下例所示：

```java
public class SimpleMovieLister {

	@Autowired
	public void setMovieFinder(Optional<MovieFinder> movieFinder) {
		...
	}
}
```

您也可以使用 `@Nullable` 注解（可以是任何包中的，例如来自 JSR-305 的 `javax.annotation.Nullable`）或直接利用 Kotlin 内建的 null 安全支持：

```java
public class SimpleMovieLister {

	@Autowired
	public void setMovieFinder(@Nullable MovieFinder movieFinder) {
		...
	}
}
```

您也可以将 `@Autowired` 用于那些是众所周知的可解析依赖的接口：`BeanFactory`、`ApplicationContext`、`Environment`、`ResourceLoader`、`ApplicationEventPublisher` 和 `MessageSource`。这些接口及其扩展接口，如 `ConfigurableApplicationContext` 或 `ResourcePatternResolver`，会自动被解析，无需特殊配置。以下示例展示了如何自动注入 `ApplicationContext` 对象：

```java
public class MovieRecommender {

	@Autowired
	private ApplicationContext context;

	public MovieRecommender() {
	}

	// ...
}
```

> [!NOTE]
>
> `@Autowired`、`@Inject`、`@Value` 和 `@Resource` 注解由 Spring 的 `BeanPostProcessor` 实现处理。这意味着您不能在自己的 `BeanPostProcessor` 或 `BeanFactoryPostProcessor` 类型中使用这些注解（如果有的话）。这些类型必须通过使用 XML 或 Spring 的 `@Bean` 方法显式地进行“注入”。

