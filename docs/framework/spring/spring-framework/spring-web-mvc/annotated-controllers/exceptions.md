# [异常](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-exceptions.html)

`@Controller` 和 `@ControllerAdvice` 类可以包含 `@ExceptionHandler` 方法，用于处理控制器方法中的异常。以下示例展示了这样一个异常处理方法：

```java
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Controller
public class SimpleController {

	@ExceptionHandler(IOException.class)
	public ResponseEntity<String> handle() {
		return ResponseEntity.internalServerError().body("Could not read file storage");
	}

}
```

异常匹配可以针对**直接抛出的顶层异常**（例如直接抛出的 `IOException`），也可以针对**顶层包装异常中的直接原因**（例如被 `IllegalStateException` 包裹的 `IOException`）。

对于异常类型匹配，最好将目标异常声明为方法参数，就像前面的示例所示。或者，也可以在 `@ExceptionHandler` 注解中**指定特定的异常类型**来进行匹配。

通常，我们建议在**方法参数**中尽可能具体地声明异常类型，并在 `@ControllerAdvice` 中定义主要的**根异常映射**，同时使用适当的 **order** 进行优先级管理。

## 媒体类型映射

除了异常类型之外，`@ExceptionHandler` 方法还可以声明**可生成的媒体类型**（producible media types）。这使得应用程序可以根据 HTTP 客户端请求的媒体类型（通常在 **"Accept"** 请求头中指定）来优化错误响应。

应用程序可以直接在注解上声明**可生成的媒体类型**，针对相同的异常类型进行不同的处理：

```java
@ExceptionHandler(produces = "application/json")
public ResponseEntity<ErrorMessage> handleJson(IllegalArgumentException exc) {
	return ResponseEntity.badRequest().body(new ErrorMessage(exc.getMessage(), 42));
}

@ExceptionHandler(produces = "text/html")
public String handle(IllegalArgumentException exc, Model model) {
	model.addAttribute("error", new ErrorMessage(exc.getMessage(), 42));
	return "errorView";
}
```

在这里，多个方法处理相同的异常类型，但不会被视为重复声明。相反，API 客户端如果请求 `"application/json"`，将收到 **JSON 格式的错误响应**，而浏览器则会获得 **HTML 格式的错误页面**。

每个 `@ExceptionHandler` 注解可以声明多个可生成的媒体类型。在错误处理阶段，**内容协商机制**（Content Negotiation）将决定最终使用哪种内容类型进行响应。

## 方法参数

`@ExceptionHandler` 方法支持与 `@RequestMapping` 方法相同的参数类型，**唯一的区别是请求体可能已经被消费**（即读取过）。

## 返回值

`@ExceptionHandler` 方法支持与 `@RequestMapping` 方法相同的返回值类型。