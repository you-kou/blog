# MVC 配置 API

在 Java 配置中，你可以实现 `WebMvcConfigurer` 接口，以下是一个示例：

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

	// Implement configuration methods...
}
```

在 XML 配置中，你可以查看 `<mvc:annotation-driven/>` 的属性和子元素。你可以查阅 Spring MVC 的 XML 架构，或者使用 IDE 的代码补全功能来发现可用的属性和子元素。

## 启用配置对比

| **特点**                 | **`@EnableWebMvc`**                                        | **继承 `WebMvcConfigurer`**                             |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------- |
| **启用默认配置**         | 启用 Spring MVC 默认配置，覆盖 Spring Boot 自动配置。      | 不启用默认配置，保持 Spring Boot 自动配置。             |
| **Spring Boot 自动配置** | 被禁用，完全自定义配置。                                   | 保持 Spring Boot 自动配置，允许定制部分功能。           |
| **配置方式**             | 需要全面配置，通常需要手动配置视图解析器等。               | 只定制需要的部分，如视图控制器、拦截器等。              |
| **使用场景**             | 需要完全控制 Spring MVC 配置，通常用于传统的 Spring 项目。 | 适合需要保留 Spring Boot 默认配置并进行简单定制的场景。 |

通常情况下，在 **Spring Boot 项目中**，推荐使用 `WebMvcConfigurer` 来进行定制，因为它更符合 Spring Boot 的配置约定，并且能够在不失去自动配置功能的前提下进行灵活定制。