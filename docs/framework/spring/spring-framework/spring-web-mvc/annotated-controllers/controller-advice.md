# [控制器增强](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)

`@ExceptionHandler`、`@InitBinder` 和 `@ModelAttribute` 方法仅适用于它们所在的 `@Controller` 类或该类的层级结构。

如果这些方法声明在 `@ControllerAdvice` 或 `@RestControllerAdvice` 类中，则它们适用于所有控制器。此外，从 Spring 5.3 开始，`@ControllerAdvice` 中的 `@ExceptionHandler` 方法可以用于处理来自任何 `@Controller` 或其他处理器的异常。

`@ControllerAdvice` 具有 `@Component` 的元注解，因此可以通过组件扫描将其注册为 Spring Bean。`@RestControllerAdvice` 具有 `@ControllerAdvice` 和 `@ResponseBody` 的元注解，这意味着 `@ExceptionHandler` 方法的返回值将通过 **响应体消息转换** 进行渲染，而不是通过 HTML 视图。

在应用程序启动时，`RequestMappingHandlerMapping` 和 `ExceptionHandlerExceptionResolver` 会检测 **控制器增强**（Controller Advice）Bean，并在运行时应用它们。

全局 `@ExceptionHandler` 方法（定义在 `@ControllerAdvice` 中）会在 **局部**（定义在 `@Controller` 内部）方法之后执行。相比之下，全局 `@ModelAttribute` 和 `@InitBinder` 方法会 **先于** 局部方法执行。

`@ControllerAdvice` 注解提供了一些属性，可用于限定它应用的控制器和处理器。例如：

```java
// Target all Controllers annotated with @RestController
@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}

// Target all Controllers within specific packages
@ControllerAdvice("org.example.controllers")
public class ExampleAdvice2 {}

// Target all Controllers assignable to specific classes
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class ExampleAdvice3 {}
```