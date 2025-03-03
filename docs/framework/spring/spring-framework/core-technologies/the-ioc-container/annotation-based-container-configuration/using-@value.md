# [使用 `@Value`](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/value-annotations.html)

`@Value` 通常用于注入外部化的属性：

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name}") String catalog) {
        this.catalog = catalog;
    }
}
```

使用以下配置：

```java
@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig { }
```

以及以下 `application.properties` 文件：

```properties
catalog.name=MovieCatalog
```

在这种情况下，`catalog` 参数和字段将等于 `MovieCatalog` 的值。

Spring 提供了一个默认的宽松嵌入值解析器。它会尝试解析属性值，如果无法解析，则属性名称（例如 `${catalog.name}`）将作为值注入。如果您想严格控制不存在的值，应该声明一个 `PropertySourcesPlaceholderConfigurer` Bean，如下例所示：

```java
@Configuration
public class AppConfig {

	@Bean
	public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
	}
}
```

> [!NOTE]
>
> 在使用 JavaConfig 配置 `PropertySourcesPlaceholderConfigurer` 时，`@Bean` 方法必须是静态的。

使用上述配置可以确保如果任何 `${}` 占位符无法解析，Spring 初始化会失败。还可以使用 `setPlaceholderPrefix`、`setPlaceholderSuffix`、`setValueSeparator` 或 `setEscapeCharacter` 等方法来自定义占位符。

> [!NOTE]
>
> Spring Boot 默认配置了一个 `PropertySourcesPlaceholderConfigurer` Bean，它将从 `application.properties` 和 `application.yml` 文件中获取属性。

Spring 提供的内置转换器支持可以自动处理简单的类型转换（例如转换为 `Integer` 或 `int`）。多个以逗号分隔的值可以自动转换为 `String` 数组，无需额外的努力。

可以通过以下方式提供默认值：

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name:defaultCatalog}") String catalog) {
        this.catalog = catalog;
    }
}
```

Spring 的 `BeanPostProcessor` 在幕后使用 `ConversionService` 来处理将 `@Value` 中的字符串值转换为目标类型的过程。如果您希望为自定义类型提供转换支持，可以提供自己的 `ConversionService` Bean 实例，如下例所示：

```java
@Configuration
public class AppConfig {

    @Bean
    public ConversionService conversionService() {
        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
        conversionService.addConverter(new MyCustomConverter());
        return conversionService;
    }
}
```

当 `@Value` 包含一个 SpEL 表达式时，值将在运行时动态计算，如下例所示：

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("#{systemProperties['user.catalog'] + 'Catalog' }") String catalog) {
        this.catalog = catalog;
    }
}
```

SpEL 还支持使用更复杂的数据结构：

```java
@Component
public class MovieRecommender {

    private final Map<String, Integer> countOfMoviesPerCatalog;

    public MovieRecommender(
            @Value("#{{'Thriller': 100, 'Comedy': 300}}") Map<String, Integer> countOfMoviesPerCatalog) {
        this.countOfMoviesPerCatalog = countOfMoviesPerCatalog;
    }
}
```

