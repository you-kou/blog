# Bean 定义中的表达式

您可以使用 SpEL 表达式与配置元数据一起定义 Bean 实例。在这两种情况下，定义表达式的语法格式为 `#{ <表达式字符串> }`。

应用上下文中的所有 Bean 都可以作为预定义变量使用，并且可以通过它们的通用 Bean 名称访问。这包括标准的上下文 Bean，如 `environment`（类型为 `org.springframework.core.env.Environment`），以及 `systemProperties` 和 `systemEnvironment`（类型为 `Map<String, Object>`），用于访问运行时环境。

要指定默认值，您可以在字段、方法、方法参数或构造函数参数上使用 `@Value` 注解（或 XML 等效配置）。

以下示例为字段设置默认值：

```java
public class FieldValueTestBean {

	@Value("#{ systemProperties['user.region'] }")
	private String defaultLocale;

	public void setDefaultLocale(String defaultLocale) {
		this.defaultLocale = defaultLocale;
	}

	public String getDefaultLocale() {
		return this.defaultLocale;
	}
}
```

请注意，在这里不需要使用 `#` 符号作为预定义变量的前缀。

以下示例展示了在属性 setter 方法中使用等效的方式：

```java
public class PropertyValueTestBean {

	private String defaultLocale;

	@Value("#{ systemProperties['user.region'] }")
	public void setDefaultLocale(String defaultLocale) {
		this.defaultLocale = defaultLocale;
	}

	public String getDefaultLocale() {
		return this.defaultLocale;
	}
}
```

自动装配的方法和构造函数也可以使用 `@Value` 注解，如下例所示：

```java
public class SimpleMovieLister {

	private MovieFinder movieFinder;
	private String defaultLocale;

	@Autowired
	public void configure(MovieFinder movieFinder,
			@Value("#{ systemProperties['user.region'] }") String defaultLocale) {
		this.movieFinder = movieFinder;
		this.defaultLocale = defaultLocale;
	}

	// ...
}
```

```java
public class MovieRecommender {

	private String defaultLocale;

	private CustomerPreferenceDao customerPreferenceDao;

	public MovieRecommender(CustomerPreferenceDao customerPreferenceDao,
			@Value("#{systemProperties['user.country']}") String defaultLocale) {
		this.customerPreferenceDao = customerPreferenceDao;
		this.defaultLocale = defaultLocale;
	}

	// ...
}
```

您还可以通过名称引用其他 Bean 的属性，如下例所示：

```java
public class ShapeGuess {

	private double initialShapeSeed;

	@Value("#{ numberGuess.randomNumber }")
	public void setInitialShapeSeed(double initialShapeSeed) {
		this.initialShapeSeed = initialShapeSeed;
	}

	public double getInitialShapeSeed() {
		return initialShapeSeed;
	}
}
```

