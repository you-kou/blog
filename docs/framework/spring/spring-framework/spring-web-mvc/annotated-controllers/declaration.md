# [声明](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann.html)

你可以在 Servlet 的 WebApplicationContext 中使用标准的 Spring Bean 定义来定义控制器 Bean。`@Controller` 这个标注（stereotype）支持自动检测，符合 Spring 对 `@Component` 类的类路径扫描和自动注册 Bean 定义的通用支持。此外，它还作为被注解类的标识，表明该类的角色是 Web 组件。

要启用对 `@Controller` Bean 的自动检测，你可以在 Java 配置中添加组件扫描，示例如下：

```java
@Configuration
@ComponentScan("org.example.web")
public class WebConfiguration {

	// ...
}
```

`@RestController` 是一个组合注解（composed annotation），它本身带有 `@Controller` 和 `@ResponseBody` 的元注解（meta-annotated）。这表示该控制器的所有方法都继承了类级别的 `@ResponseBody` 注解，因此方法的返回值会直接写入响应体，而不是通过视图解析和 HTML 模板进行渲染。