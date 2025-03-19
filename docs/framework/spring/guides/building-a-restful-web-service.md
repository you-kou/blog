# 构建 RESTful Web 服务

本指南将带您一步步创建一个使用 **Spring** 构建的“Hello, World” **RESTful** Web 服务。

## 您将构建的内容

您将构建一个服务，它将在 `http://localhost:8080/greeting` 接受 **HTTP GET** 请求。

它将返回一个 **JSON** 格式的问候信息，示例如下：

```json
{"id":1,"content":"Hello, World!"}
```

您可以通过查询字符串中的可选 **name** 参数来自定义问候语，如下所示：

```
http://localhost:8080/greeting?name=User
```

**name** 参数的值将覆盖默认值 **"World"**，并在响应中体现，如下所示：

```json
{"id":1,"content":"Hello, User!"}
```

## [创建项目](https://code-snippet.online/framework/spring/spring-boot/quick-start.html)

### starter 依赖

- Spring Web

## 创建资源表示类

现在，您已经设置好了项目和构建系统，可以开始创建您的 Web 服务。

首先，考虑服务的交互方式。

该服务将处理 **`/greeting`** 的 **GET** 请求，并可选地在查询字符串中包含 **name** 参数。**GET** 请求应返回 **200 OK** 响应，并在响应体中包含 **JSON** 格式的问候信息，示例如下：

```json
{
    "id": 1,
    "content": "Hello, World!"
}
```

**`id`** 字段是问候语的唯一标识符，**`content`** 是问候语的文本表示。

为了对问候语进行建模，需要创建一个**资源表示类**（Resource Representation Class）。为此，可以使用 **Java record** 类来表示 **`id`** 和 **`content`** 数据，如下所示（文件位置：`src/main/java/com/example/restservice/Greeting.java`）：

```java
package com.example.restservice;

public record Greeting(long id, String content) { }
```

> [!NOTE]
>
> 此应用程序使用 **Jackson JSON** 库自动将 **`Greeting`** 类型的实例转换为 **JSON**。Jackson 由 **Spring Web Starter** 默认包含，无需额外配置。

## 创建资源控制器

在 **Spring** 构建 **RESTful** Web 服务的方法中，**HTTP** 请求由**控制器**（`Controller`）处理。

这些组件通过 **`@RestController`** 注解标识，如下所示的 **`GreetingController`**（位于 `src/main/java/com/example/restservice/GreetingController.java`）处理对 **`/greeting`** 的 **GET** 请求，并返回 **`Greeting`** 类的新实例：

```java
package com.example.restservice;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/greeting")
	public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		return new Greeting(counter.incrementAndGet(), String.format(template, name));
	}
}
```

这个控制器代码简洁明了，但其内部隐藏了许多机制。我们将逐步解析其工作原理。

**`@GetMapping`** 注解确保 **HTTP GET** 请求到 **`/greeting`** 时，会映射到 **`greeting()`** 方法进行处理。

> [!NOTE]
>
> 对于其他 **HTTP** 方法，还有相应的注解（例如 **`@PostMapping`** 用于 **POST**）。此外，还有一个 **`@RequestMapping`** 注解，它是所有这些注解的父注解，也可以作为它们的同义词（例如 **`@RequestMapping(method=GET)`**）。

**`@RequestParam`** 将查询字符串参数 **`name`** 的值绑定到 **`greeting()`** 方法的 **`name`** 参数。如果请求中缺少 **`name`** 参数，则使用默认值 **World**。

方法体的实现创建并返回一个新的 **`Greeting`** 对象，**`id`** 和 **`content`** 属性基于计数器的下一个值，并使用问候语模板格式化给定的 **`name`**。

传统 **MVC** 控制器与上面展示的 **RESTful Web 服务控制器** 之间的一个关键区别在于 **HTTP** 响应体的创建方式。传统 MVC 控制器依赖于视图技术来将问候语数据服务器端渲染为 **HTML**，而 **RESTful Web 服务控制器** 则填充并返回一个 **Greeting** 对象。对象数据将直接以 **JSON** 格式写入 **HTTP** 响应。

这段代码使用了 **Spring** 的 **`@RestController`** 注解，它标识该类为控制器，并且每个方法返回一个领域对象而不是视图。它是同时包含 **`@Controller`** 和 **`@ResponseBody`** 的简写形式。

**Greeting** 对象必须转换为 **JSON**。得益于 **Spring** 对 **HTTP** 消息转换器的支持，你无需手动进行此转换。由于 **Jackson 2** 已经在类路径中，**Spring** 会自动选择 **`MappingJackson2HttpMessageConverter`** 来将 **Greeting** 实例转换为 **JSON**。

## 运行服务

Spring Initializr 会为你创建一个应用程序类。在这种情况下，你无需进一步修改该类。以下是应用程序类的示例（来自 `src/main/java/com/example/restservice/RestServiceApplication.java`）：

```java
package com.example.restservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestServiceApplication.class, args);
	}

}
```

`@SpringBootApplication` 是一个方便的注解，它包括了以下所有内容：

- `@Configuration`: 将类标记为应用程序上下文的 Bean 定义来源。
- `@EnableAutoConfiguration`: 告诉 Spring Boot 根据类路径设置、其他 Beans 和各种属性设置开始添加 Beans。例如，如果 `spring-webmvc` 在类路径中，应用程序会被标记为 Web 应用程序，并激活关键行为，如设置 `DispatcherServlet`。
- `@ComponentScan`: 告诉 Spring 在 `com/example` 包中查找其他组件、配置和服务，从而找到控制器。

`main()` 方法使用 Spring Boot 的 `SpringApplication.run()` 方法来启动应用程序。你注意到没有一行 XML 吗？也没有 `web.xml` 文件。这个 Web 应用程序是 100% 纯 Java，你不需要处理任何配置管道或基础设施。

## 测试服务

现在服务已经启动，访问 `http://localhost:8080/greeting`，你应该能看到：

```json
{"id":1,"content":"Hello, World!"}
```

通过访问 `http://localhost:8080/greeting?name=User` 提供一个名称查询字符串参数。注意到 `content` 属性的值从 `Hello, World!` 变为 `Hello, User!`，如下所示：

```json
{"id":2,"content":"Hello, User!"}
```

这个变化证明了 `GreetingController` 中的 `@RequestParam` 配置按预期工作。`name` 参数被赋予了默认值 `World`，但可以通过查询字符串明确覆盖。

还可以注意到 `id` 属性从 1 变为 2。这证明你在多个请求之间使用的是同一个 `GreetingController` 实例，并且它的 `counter` 字段在每次调用时都会按预期递增。