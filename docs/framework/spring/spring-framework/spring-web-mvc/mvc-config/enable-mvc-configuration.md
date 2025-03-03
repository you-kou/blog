# 启用 MVC 配置

MVC Java 配置和 MVC XML 命名空间提供了适用于大多数应用程序的默认配置，并且提供了一个配置 API 用于自定义该配置。

你可以使用 `@EnableWebMvc` 注解来启用基于编程方式的 MVC 配置，或者使用 `<mvc:annotation-driven>` 来启用 XML 配置，以下是一个示例：

```java
@Configuration
@EnableWebMvc
public class WebConfiguration {
}
```

> [!NOTE]
>
> 在使用 Spring Boot 时，你可能希望使用类型为 `WebMvcConfigurer` 的 `@Configuration` 类，但不使用 `@EnableWebMvc`，以保持 Spring Boot 的 MVC 自定义配置。