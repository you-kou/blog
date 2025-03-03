# 消息转换器

你可以通过重写 `configureMessageConverters()` 方法，在 Java 配置中设置要使用的 `HttpMessageConverter` 实例，从而替换默认使用的实例。你还可以通过重写 `extendMessageConverters()` 方法，在最后自定义配置的消息转换器列表。

> [!NOTE]
>
> 在 Spring Boot 应用程序中，`WebMvcAutoConfiguration` 会添加它检测到的所有 `HttpMessageConverter` Bean，除此之外，还会使用默认的转换器。因此，在 Spring Boot 应用中，建议使用 `HttpMessageConverters` 机制来配置消息转换器。或者，作为替代，你可以使用 `extendMessageConverters` 方法在最后修改消息转换器。

以下示例展示了如何添加 XML 和 Jackson JSON 转换器，并使用自定义的 `ObjectMapper`，而不是默认的转换器：

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
		Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder()
				.indentOutput(true)
				.dateFormat(new SimpleDateFormat("yyyy-MM-dd"))
				.modulesToInstall(new ParameterNamesModule());
		converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
		converters.add(new MappingJackson2XmlHttpMessageConverter(builder.createXmlMapper(true).build()));
	}
}
```

在前面的示例中，使用 `Jackson2ObjectMapperBuilder` 创建了一个通用配置，供 `MappingJackson2HttpMessageConverter` 和 `MappingJackson2XmlHttpMessageConverter` 使用。这个配置启用了格式化输出（缩进）、自定义的日期格式，并注册了 `jackson-module-parameter-names`，该模块添加了对访问参数名称的支持（这是 Java 8 中新增的特性）。

> [!NOTE]
>
> 启用 Jackson XML 支持的缩进功能，除了需要 `jackson-dataformat-xml` 依赖外，还需要额外添加 `woodstox-core-asl` 依赖。

还有一些有趣的 Jackson 模块可供使用：

- **jackson-datatype-money**：支持 `javax.money` 类型（非官方模块）。
- **jackson-datatype-hibernate**：支持 Hibernate 特定的类型和属性（包括延迟加载方面）。