# Servlet Web 应用程序

如果你想构建基于 Servlet 的 Web 应用程序，可以利用 Spring Boot 为 Spring MVC 或 Jersey 提供的自动配置功能。

## “Spring Web MVC 框架”

Spring Web MVC 框架（通常称为 “Spring MVC”）是一个功能丰富的 “模型 - 视图 - 控制器” Web 框架。Spring MVC 允许你创建特殊的 @Controller 或 @RestController Bean 来处理传入的 HTTP 请求。通过使用 @RequestMapping 注解，控制器中的方法会被映射到 HTTP 请求。

以下代码展示了一个提供 JSON 数据的典型 @RestController：

```java
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class MyRestController {

	private final UserRepository userRepository;

	private final CustomerRepository customerRepository;

	public MyRestController(UserRepository userRepository, CustomerRepository customerRepository) {
		this.userRepository = userRepository;
		this.customerRepository = customerRepository;
	}

	@GetMapping("/{userId}")
	public User getUser(@PathVariable Long userId) {
		return this.userRepository.findById(userId).get();
	}

	@GetMapping("/{userId}/customers")
	public List<Customer> getUserCustomers(@PathVariable Long userId) {
		return this.userRepository.findById(userId).map(this.customerRepository::findByUser).get();
	}

	@DeleteMapping("/{userId}")
	public void deleteUser(@PathVariable Long userId) {
		this.userRepository.deleteById(userId);
	}

}
```

“WebMvc.fn” 这种函数式变体将路由配置与实际的请求处理分离开来，如下例所示：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RequestPredicate;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RequestPredicates.accept;
import static org.springframework.web.servlet.function.RouterFunctions.route;

@Configuration(proxyBeanMethods = false)
public class MyRoutingConfiguration {

	private static final RequestPredicate ACCEPT_JSON = accept(MediaType.APPLICATION_JSON);

	@Bean
	public RouterFunction<ServerResponse> routerFunction(MyUserHandler userHandler) {
		return route()
				.GET("/{user}", ACCEPT_JSON, userHandler::getUser)
				.GET("/{user}/customers", ACCEPT_JSON, userHandler::getUserCustomers)
				.DELETE("/{user}", ACCEPT_JSON, userHandler::deleteUser)
				.build();
	}

}
```

```java
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class MyUserHandler {

	public ServerResponse getUser(ServerRequest request) {
		...
	}

	public ServerResponse getUserCustomers(ServerRequest request) {
		...
	}

	public ServerResponse deleteUser(ServerRequest request) {
		...
	}

}
```

Spring MVC 是 Spring 核心框架的一部分，详细信息可参考官方文档。在 spring.io/guides 上还有几篇关于 Spring MVC 的指南。

> [!TIP]
>
> 你可以按需定义任意数量的 `RouterFunction` Bean，以实现路由定义的模块化。如果需要设置优先级，这些 Bean 可以进行排序。

### 错误处理

默认情况下，Spring Boot 提供了一个 `/error` 映射，它能合理地处理所有错误，并且该映射会在 Servlet 容器中被注册为一个 “全局” 错误页面。对于机器客户端，它会生成一个包含错误详情、HTTP 状态码和异常消息的 JSON 响应。对于浏览器客户端，有一个 “白标” 错误视图，它会以 HTML 格式呈现相同的数据（若要自定义该视图，可添加一个解析为 `error` 的视图）。

如果你想自定义默认的错误处理行为，可以设置多个 `server.error` 属性。具体可参阅附录中的 “服务器属性” 部分。

若要完全替换默认行为，你可以实现 `ErrorController` 接口并注册该类型的 Bean 定义，或者添加一个 `ErrorAttributes` 类型的 Bean，这样就能使用现有的机制，但替换其中的内容。

> [!TIP]
>
> 基本错误控制器（BasicErrorController）可用作自定义错误控制器（ErrorController）的基类。如果你想为新的内容类型添加处理程序，这尤其有用（默认情况下，它专门处理 `text/html` 类型，并为其他所有类型提供一个备用处理方式）。要实现这一点，需继承 `BasicErrorController`，添加一个带有 `@RequestMapping` 注解且包含 `produces` 属性的公共方法，然后创建你新类型的 Bean。

从 Spring 框架 6.0 起，支持 RFC 9457 问题详情规范。Spring MVC 可以使用 `application/problem+json` 媒体类型生成自定义错误消息，例如：

```json
{
	"type": "https://example.org/problems/unknown-project",
	"title": "Unknown project",
	"status": 404,
	"detail": "No project found for id 'spring-unknown'",
	"instance": "/projects/spring-unknown"
}
```

可以通过将 `spring.mvc.problemdetails.enabled` 设置为 `true` 来启用此支持。

你还可以定义一个使用 `@ControllerAdvice` 注解的类，为特定的控制器和 / 或异常类型自定义要返回的 JSON 文档，如下例所示：

```java
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice(basePackageClasses = SomeController.class)
public class MyControllerAdvice extends ResponseEntityExceptionHandler {

	@ResponseBody
	@ExceptionHandler(MyException.class)
	public ResponseEntity<?> handleControllerException(HttpServletRequest request, Throwable ex) {
		HttpStatus status = getStatus(request);
		return new ResponseEntity<>(new MyErrorBody(status.value(), ex.getMessage()), status);
	}

	private HttpStatus getStatus(HttpServletRequest request) {
		Integer code = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		HttpStatus status = HttpStatus.resolve(code);
		return (status != null) ? status : HttpStatus.INTERNAL_SERVER_ERROR;
	}

}
```

在上述示例中，如果 `MyException` 是由与 `SomeController` 定义在同一包中的控制器抛出的，那么将使用 `MyErrorBody` POJO 的 JSON 表示形式，而不是 `ErrorAttributes` 的表示形式。

在某些情况下，控制器层面处理的错误不会被 Web 观测或指标基础设施记录。应用程序可以通过在观测上下文中设置已处理的异常，确保这些异常能被观测记录下来。