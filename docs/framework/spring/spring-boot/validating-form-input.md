https://www.baeldung.com/spring-boot-bean-validation



# 验证表单输入

## 概述

在验证用户输入方面，Spring Boot 直接开箱即用地提供了强大的支持，这是一个常见但至关重要的任务。

虽然 Spring Boot 支持与自定义验证器的无缝集成，但执行验证的事实标准是 [Hibernate Validator](http://hibernate.org/validator/)，这是 [Bean Validation 框架](https://www.baeldung.com/javax-validation)的参考实现。

在本教程中，我们将探讨如何在 Spring Boot 中验证领域对象（Domain Objects）。

## Maven 依赖项

在本示例中，我们将通过构建一个基本的 REST 控制器来学习如何在 Spring Boot 中验证领域对象。

该控制器首先接收一个领域对象，然后使用 Hibernate Validator 进行验证，最后将其持久化到内存中的 H2 数据库中。

该项目的依赖项相当标准：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency> 
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency> 
<dependency> 
    <groupId>com.h2database</groupId> 
    <artifactId>h2</artifactId>
    <version>2.1.214</version> 
    <scope>runtime</scope>
</dependency>
```

如上所示，我们在 `pom.xml` 文件中包含了 `spring-boot-starter-web`，因为它是创建 REST 控制器所必需的。

此外，请确保在 Maven Central 上检查 `spring-boot-starter-jpa` 和 H2 数据库的最新版本。

从 Spring Boot 2.3 开始，我们还需要显式添加 `spring-boot-starter-validation` 依赖项：

```xml
<dependency> 
    <groupId>org.springframework.boot</groupId> 
    <artifactId>spring-boot-starter-validation</artifactId> 
</dependency>
```

## 一个简单的领域类

在项目的依赖项已就绪后，接下来我们需要定义一个示例 JPA 实体类，其作用仅用于建模用户。

让我们来看一下这个类：

```java
@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    
    @NotBlank(message = "Name is mandatory")
    private String name;
    
    @NotBlank(message = "Email is mandatory")
    private String email;
    
    // standard constructors / setters / getters / toString
        
}
```

我们的 `User` 实体类实现确实非常简单，但它清楚地展示了如何使用 Bean Validation 的约束来限制 `name` 和 `email` 字段。

为了简化，我们仅使用了 `@NotBlank` 约束目标字段，并通过 `message` 属性指定了错误消息。

因此，在 Spring Boot 验证该类实例时，被约束的字段必须 **不为 null**，并且去除空格后的长度必须大于零。

此外，Bean Validation 还提供了许多其他实用的约束，除了 `@NotBlank` 之外，我们还可以应用和组合不同的验证规则到受约束的类中。更多信息，请参考官方的 **Bean Validation** 文档。

由于我们将使用 **Spring Data JPA** 将用户保存到 **内存中的 H2 数据库**，因此还需要定义一个简单的 **Repository 接口**，用于对 `User` 对象执行基本的 CRUD 操作：

```java
@Repository
public interface UserRepository extends CrudRepository<User, Long> {}
```

## 实现 REST 控制器

当然，我们需要实现一个层，使我们能够获取 `User` 对象受约束字段的值。

这样，我们就可以对其进行验证，并根据验证结果执行一些进一步的操作。

Spring Boot 通过 REST 控制器的实现，使这一看似复杂的过程变得非常简单。

让我们来看一下 REST 控制器的实现：

```java
@RestController
public class UserController {

    @PostMapping("/users")
    ResponseEntity<String> addUser(@Valid @RequestBody User user) {
        // persisting the user
        return ResponseEntity.ok("User is valid");
    }
    
    // standard constructors / other methods
    
}
```

在 Spring REST 环境中，`addUser()` 方法的实现相当标准。

当然，最关键的部分是使用了 `@Valid` 注解。

当 Spring Boot 发现一个参数带有 `@Valid` 注解时，它会自动引导默认的 JSR 380 实现 —— **Hibernate Validator**，并对该参数进行验证。

当目标参数未能通过验证时，Spring Boot 会抛出 `MethodArgumentNotValidException` 异常。

## @ExceptionHandler 注解

虽然 Spring Boot 自动验证传递给 `addUser()` 方法的 `User` 对象非常方便，但该过程缺少的一部分是如何处理验证结果。

`@ExceptionHandler` 注解允许我们通过一个方法处理指定类型的异常。

因此，我们可以使用它来处理验证错误：

```java
@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler(MethodArgumentNotValidException.class)
public Map<String, String> handleValidationExceptions(
  MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
        String fieldName = ((FieldError) error).getField();
        String errorMessage = error.getDefaultMessage();
        errors.put(fieldName, errorMessage);
    });
    return errors;
}
```

我们指定了 `MethodArgumentNotValidException` 异常作为要处理的异常。因此，当指定的 `User` 对象无效时，Spring Boot 会调用此方法。

该方法将每个无效字段的名称和验证后错误消息存储在一个 `Map` 中。然后，它将该 `Map` 以 JSON 格式返回给客户端，以便进一步处理。

简而言之，REST 控制器使我们能够轻松处理不同端点的请求、验证 `User` 对象，并以 JSON 格式发送响应。

这种设计足够灵活，可以通过多个 Web 层来处理控制器的响应，范围从模板引擎（如 Thymeleaf），到功能全面的 JavaScript 框架（如 Angular）。

## 测试 REST 控制器

我们可以通过集成测试轻松地测试 REST 控制器的功能。

让我们开始模拟/自动装配 `UserRepository` 接口实现、`UserController` 实例和一个 `MockMvc` 对象：

```java
@RunWith(SpringRunner.class) 
@WebMvcTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    @MockBean
    private UserRepository userRepository;
    
    @Autowired
    UserController userController;

    @Autowired
    private MockMvc mockMvc;

    //...
    
}
```

由于我们仅测试 Web 层，因此使用 `@WebMvcTest` 注解。它允许我们使用 `MockMvcRequestBuilders` 和 `MockMvcResultMatchers` 类实现的一组静态方法，轻松地测试请求和响应。

现在，让我们测试 `addUser()` 方法，分别传入有效和无效的 `User` 对象作为请求体：

```java
@Test
public void whenPostRequestToUsersAndValidUser_thenCorrectResponse() throws Exception {
    MediaType textPlainUtf8 = new MediaType(MediaType.TEXT_PLAIN, Charset.forName("UTF-8"));
    String user = "{\"name\": \"bob\", \"email\" : \"bob@domain.com\"}";
    mockMvc.perform(MockMvcRequestBuilders.post("/users")
      .content(user)
      .contentType(MediaType.APPLICATION_JSON_UTF8))
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.content()
        .contentType(textPlainUtf8));
}

@Test
public void whenPostRequestToUsersAndInValidUser_thenCorrectResponse() throws Exception {
    String user = "{\"name\": \"\", \"email\" : \"bob@domain.com\"}";
    mockMvc.perform(MockMvcRequestBuilders.post("/users")
      .content(user)
      .contentType(MediaType.APPLICATION_JSON_UTF8))
      .andExpect(MockMvcResultMatchers.status().isBadRequest())
      .andExpect(MockMvcResultMatchers.jsonPath("$.name", Is.is("Name is mandatory")))
      .andExpect(MockMvcResultMatchers.content()
        .contentType(MediaType.APPLICATION_JSON_UTF8));
    }
}
```

此外，我们还可以使用免费的 API 生命周期测试应用程序，如 Postman，来测试 REST 控制器 API。

## 运行示例应用程序

最后，我们可以通过标准的 `main()` 方法运行我们的示例项目：

```java
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
    
    @Bean
    public CommandLineRunner run(UserRepository userRepository) throws Exception {
        return (String[] args) -> {
            User user1 = new User("Bob", "bob@domain.com");
            User user2 = new User("Jenny", "jenny@domain.com");
            userRepository.save(user1);
            userRepository.save(user2);
            userRepository.findAll().forEach(System.out::println);
        };
    }
}
```

如预期的那样，我们应该在控制台看到几个 `User` 对象被打印出来。

向 `http://localhost:8080/users` 端点发送包含有效 `User` 对象的 POST 请求将返回字符串 "User is valid"。

同样，发送一个缺少 `name` 和 `email` 值的 `User` 对象的 POST 请求将返回以下响应：

```json
{
  "name":"Name is mandatory",
  "email":"Email is mandatory"
}
```

