# [映射请求](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html)

本节讨论带注解控制器的请求映射。

## `@RequestMapping`

你可以使用 `@RequestMapping` 注解将请求映射到控制器方法。该注解提供了多个属性，可用于匹配 URL、HTTP 方法、请求参数、请求头和媒体类型。它既可以应用于类级别，以定义共享映射，也可以应用于方法级别，以限定到特定的端点映射。

此外，`@RequestMapping` 还有特定于 HTTP 方法的快捷变体：

- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@PatchMapping`

这些快捷方式是自定义注解（Custom Annotations），提供它们的原因是，大多数情况下，控制器方法应该映射到特定的 HTTP 方法，而不是使用 `@RequestMapping`，因为 `@RequestMapping` 默认匹配所有 HTTP 方法。不过，在类级别仍然需要使用 `@RequestMapping` 来定义共享映射。

> [!NOTE]
>
> `@RequestMapping` 不能与其他 `@RequestMapping` 注解一起使用在同一个元素（类、接口或方法）上。如果在同一个元素上检测到多个 `@RequestMapping` 注解，系统会记录警告日志，并且只会使用第一个映射。这一规则同样适用于 `@GetMapping`、`@PostMapping` 等组合 `@RequestMapping` 注解。

以下示例展示了类级别和方法级别的映射：

```java
@RestController
@RequestMapping("/persons")
class PersonController {

	@GetMapping("/{id}")
	public Person getPerson(@PathVariable Long id) {
		// ...
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void add(@RequestBody Person person) {
		// ...
	}
}
```

## URI 模式

`@RequestMapping` 方法可以使用 URL 模式进行映射。有两种选择：

- **PathPattern** - 这是一个预解析的模式，与 URL 路径进行匹配，URL 路径也会预解析为 `PathContainer`。这种解决方案专为 Web 使用设计，能够有效处理编码和路径参数，并且匹配效率较高。
- **AntPathMatcher** - 将字符串模式与字符串路径进行匹配。这是最初的解决方案，也用于 Spring 配置中，选择类路径、文件系统和其他位置上的资源。它效率较低，并且字符串路径输入在处理编码和其他 URL 问题时存在挑战。

`PathPattern` 是 Web 应用程序的推荐解决方案，并且是 Spring WebFlux 中唯一的选择。从 Spring 5.3 版本开始，`PathPattern` 可用于 Spring MVC，并且从 6.0 版本起默认启用。有关路径匹配选项的自定义配置，请参见 MVC 配置。

`PathPattern` 支持与 `AntPathMatcher` 相同的模式语法。此外，它还支持捕获模式，例如 `{*spring}`，用于匹配路径结尾的 0 个或多个路径段。`PathPattern` 还限制了 `**` 用于匹配多个路径段的使用，使其仅在模式的末尾允许。这消除了许多选择最佳匹配模式时的歧义问题。有关完整的模式语法，请参考 `PathPattern` 和 `AntPathMatcher`。

一些示例模式：

- `"/resources/ima?e.png"` - 匹配路径段中的一个字符
- `"/resources/*.png"` - 匹配路径段中的零个或多个字符
- `"/resources/**"` - 匹配多个路径段
- `"/projects/{project}/versions"` - 匹配一个路径段并将其捕获为变量
- `"/projects/{project:[a-z]+}/versions"` - 匹配并使用正则表达式捕获一个变量

捕获的 URI 变量可以通过 `@PathVariable` 访问。例如：

```java
@GetMapping("/owners/{ownerId}/pets/{petId}")
public Pet findPet(@PathVariable Long ownerId, @PathVariable Long petId) {
	// ...
}
```

你可以在类级别和方法级别声明 URI 变量，示例如下：

```java
@Controller
@RequestMapping("/owners/{ownerId}")
public class OwnerController {

	@GetMapping("/pets/{petId}")
	public Pet findPet(@PathVariable Long ownerId, @PathVariable Long petId) {
		// ...
	}
}
```

URI 变量会自动转换为适当的类型，如果转换失败，则会引发 `TypeMismatchException`。默认支持简单类型（如 `int`、`long`、`Date` 等），你也可以注册对其他数据类型的支持。有关详细信息，请参阅类型转换和 `DataBinder`。

你可以显式地为 URI 变量命名（例如，`@PathVariable("customId")`），但如果变量名相同，并且代码是使用 `-parameters` 编译器标志编译的，则可以省略这个细节。

语法 `{varName:regex}` 用于声明一个带有正则表达式的 URI 变量。例如，给定 URL `"/spring-web-3.0.5.jar"`，以下方法可以提取名称、版本和文件扩展名：

```java
@GetMapping("/{name:[a-z-]+}-{version:\\d\\.\\d\\.\\d}{ext:\\.[a-z]+}")
public void handle(@PathVariable String name, @PathVariable String version, @PathVariable String ext) {
	// ...
}
```

URI 路径模式也可以包含嵌入式的 `${…}` 占位符，这些占位符在启动时通过使用 `PropertySourcesPlaceholderConfigurer` 从本地、系统、环境以及其他属性源中解析。你可以使用这种方式，例如，根据某些外部配置来参数化一个基本 URL。

## 模式比较

当多个模式匹配一个 URL 时，必须选择最合适的匹配。这是通过以下方式之一实现的，具体取决于是否启用了已解析的 `PathPattern`：

- `PathPattern.SPECIFICITY_COMPARATOR`
- `AntPathMatcher.getPatternComparator(String path)`

这两者有助于排序，将更具体的模式排在前面。如果模式的 URI 变量（计为 1）、单个通配符（计为 1）和双通配符（计为 2）较少，则该模式更为具体。在得分相等的情况下，选择较长的模式。在得分和长度相同的情况下，选择包含更多 URI 变量而非通配符的模式。

默认的映射模式（`/**`）会被排除在得分之外，并且总是排在最后。此外，前缀模式（例如 `/public/**`）被认为比没有双通配符的其他模式不那么具体。

## 后缀匹配

从 Spring 5.3 开始，默认情况下，Spring MVC 不再执行 `.*` 后缀模式匹配，即不再将控制器映射到 `/person` 时，同时隐式地映射到 `/person.*`。因此，路径扩展不再用于解释请求的响应内容类型——例如，`/person.pdf`、`/person.xml` 等。

使用文件扩展名的这种方式在浏览器发送难以一致解释的 `Accept` 头时是必要的，但现在这已经不再是必须的，使用 `Accept` 头应该是首选的方式。

随着时间的推移，使用文件名扩展在多种方式上已经证明是有问题的。当与 URI 变量、路径参数和 URI 编码结合使用时，可能会导致歧义。在进行基于 URL 的授权和安全性推理时（有关更多详细信息，请参阅下一节），也变得更加困难。

要完全禁用路径扩展的使用（在 5.3 版本之前），可以设置以下配置：

- `useSuffixPatternMatching(false)`，参见 `PathMatchConfigurer`
- `favorPathExtension(false)`，参见 `ContentNegotiationConfigurer`

尽管通过 `"Accept"` 头请求其他内容类型已成为首选，但某些情况下仍然可能需要通过其他方式（例如，输入浏览器中的 URL）来请求内容类型。一个安全的替代方案是使用查询参数策略。如果必须使用文件扩展名，可以考虑通过 `ContentNegotiationConfigurer` 的 `mediaTypes` 属性限制为显式注册的扩展名列表。

## 后缀匹配与反射文件下载（RFD）攻击

反射文件下载（RFD）攻击类似于 XSS，因为它依赖于请求输入（例如，查询参数和 URI 变量）被反射到响应中。然而，与在 HTML 中插入 JavaScript 不同，RFD 攻击依赖于浏览器切换到执行下载并在稍后双击时将响应视为可执行脚本。

在 Spring MVC 中，使用 `@ResponseBody` 和 `ResponseEntity` 方法的控制器存在风险，因为它们可以呈现不同的内容类型，客户端可以通过 URL 路径扩展请求这些内容类型。禁用后缀模式匹配和使用路径扩展进行内容协商可以降低风险，但不足以防止 RFD 攻击。

为了防止 RFD 攻击，在呈现响应体之前，Spring MVC 会添加一个 `Content-Disposition:inline;filename=f.txt` 头部，建议使用固定且安全的下载文件。仅当 URL 路径包含一个既不被允许为安全的文件扩展名，也没有明确注册用于内容协商时，才会执行此操作。然而，当 URL 被直接输入到浏览器时，这可能会产生副作用。

许多常见的路径扩展名默认被允许作为安全的。具有自定义 `HttpMessageConverter` 实现的应用程序可以显式注册文件扩展名以进行内容协商，避免为这些扩展名添加 `Content-Disposition` 头部。请参阅 **Content Types**。

## 可消费的媒体类型

你可以根据请求的 `Content-Type` 来缩小请求映射的范围，示例如下：

```java
@PostMapping(path = "/pets", consumes = "application/json")
public void addPet(@RequestBody Pet pet) {
	// ...
}
```

`consumes` 属性还支持否定表达式，例如 `!text/plain` 表示除 `text/plain` 外的任何内容类型。

你可以在类级别声明共享的 `consumes` 属性。然而，与大多数其他请求映射属性不同，当在类级别使用时，方法级别的 `consumes` 属性会覆盖而不是扩展类级别的声明。

> [!TIP]
>
> `MediaType` 提供了常用媒体类型的常量，例如 `APPLICATION_JSON_VALUE` 和 `APPLICATION_XML_VALUE`。

## 可生成的媒体类型

你可以根据 `Accept` 请求头和控制器方法生成的内容类型列表来缩小请求映射的范围，示例如下：

```java
@GetMapping(path = "/pets/{petId}", produces = "application/json")
@ResponseBody
public Pet getPet(@PathVariable String petId) {
	// ...
}
```

媒体类型可以指定字符集。否定表达式也是支持的，例如 `!text/plain` 表示除 `"text/plain"` 外的任何内容类型。

你可以在类级别声明共享的 `produces` 属性。然而，与大多数其他请求映射属性不同，当在类级别使用时，方法级别的 `produces` 属性会覆盖而不是扩展类级别的声明。

> [!TIP]
>
> `MediaType` 提供了常用媒体类型的常量，例如 `APPLICATION_JSON_VALUE` 和 `APPLICATION_XML_VALUE`。

## 请求参数和请求头

你可以根据请求参数的条件来缩小请求映射的范围。你可以检查请求参数的存在（`myParam`）、不存在（`!myParam`），或者匹配特定值（`myParam=myValue`）。以下示例展示了如何测试特定值：

```java
@GetMapping(path = "/pets/{petId}", params = "myParam=myValue")
public void findPet(@PathVariable String petId) {
	// ...
}
```

你也可以对请求头条件使用相同的方法，示例如下：

```java
@GetMapping(path = "/pets/{petId}", headers = "myHeader=myValue")
public void findPet(@PathVariable String petId) {
	// ...
}
```

> [!TIP]
>
> 你可以使用请求头条件来匹配 `Content-Type` 和 `Accept`，但更好的做法是使用 `consumes` 和 `produces` 属性。

## HTTP HEAD 和 OPTIONS

`@GetMapping`（以及 `@RequestMapping(method=HttpMethod.GET)`）透明地支持 HTTP HEAD 请求映射。控制器方法无需更改。一个响应包装器会在 `jakarta.servlet.http.HttpServlet` 中应用，确保设置 `Content-Length` 头部，表示已写入的字节数（但实际上不会写入响应体）。

默认情况下，HTTP OPTIONS 请求通过设置 `Allow` 响应头来处理，`Allow` 头部列出了所有与 URL 模式匹配的 `@RequestMapping` 方法所支持的 HTTP 方法。

对于没有声明 HTTP 方法的 `@RequestMapping`，`Allow` 头部会被设置为 `GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS`。控制器方法应始终声明支持的 HTTP 方法（例如，使用特定的 HTTP 方法变体，如 `@GetMapping`、`@PostMapping` 等）。

你可以显式地将 `@RequestMapping` 方法映射到 HTTP HEAD 和 HTTP OPTIONS 请求，但在常见情况下，这并不是必要的。

## 自定义注解

pring MVC 支持使用组合注解进行请求映射。这些组合注解本身是通过 `@RequestMapping` 注解的元注解，并通过组合来重新声明 `@RequestMapping` 属性的子集（或全部），使其具有更狭窄和具体的用途。

例如，`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping` 和 `@PatchMapping` 都是组合注解的例子。提供这些组合注解的原因是，大多数控制器方法应当映射到特定的 HTTP 方法，而不是使用 `@RequestMapping`，因为 `@RequestMapping` 默认会匹配所有的 HTTP 方法。如果你需要了解如何实现组合注解，可以参考这些注解是如何声明的。

> [!TIP]
>
> `@RequestMapping` 不能与其他 `@RequestMapping` 注解在同一元素（类、接口或方法）上同时使用。如果检测到在同一元素上使用了多个 `@RequestMapping` 注解，将会记录警告，并且仅使用第一个映射。这也适用于组合的 `@RequestMapping` 注解，如 `@GetMapping`、`@PostMapping` 等。

Spring MVC 还支持自定义请求映射属性和自定义请求匹配逻辑。这是一个更高级的选项，需要通过子类化 `RequestMappingHandlerMapping` 并重写 `getCustomMethodCondition` 方法来实现。在该方法中，你可以检查自定义属性，并返回自己的 `RequestCondition`。

## 显式注册

您可以通过编程方式注册处理方法，这对于动态注册或一些高级用例非常有用，例如在不同的URL下使用同一处理器的不同实例。以下示例演示了如何注册一个处理方法：

```java
@Configuration
public class MyConfig {

	@Autowired
	public void setHandlerMapping(RequestMappingHandlerMapping mapping, UserHandler handler)
			throws NoSuchMethodException {

		RequestMappingInfo info = RequestMappingInfo
				.paths("/user/{id}").methods(RequestMethod.GET).build();

		Method method = UserHandler.class.getMethod("getUser", Long.class);

		mapping.registerMapping(info, handler, method);
	}
}
```

## `@HttpExchange`

虽然 @HttpExchange 的主要目的是通过生成的代理来抽象 HTTP 客户端代码，但该注解所放置的 HTTP 接口本身是一个与客户端和服务器无关的契约。除了简化客户端代码外，还有一些情况下，HTTP 接口可以作为服务器暴露其 API 供客户端访问的便捷方式。这会导致客户端和服务器之间的耦合度增加，并且通常对于公共 API 来说不是一个好选择，但对于内部 API 来说可能正是所期望的目标。这种方法在 Spring Cloud 中被广泛使用，也正是为什么 @HttpExchange 被支持作为 @RequestMapping 在控制器类中处理服务器端请求的替代方案。

例如：

```java
@HttpExchange("/persons")
interface PersonService {

	@GetExchange("/{id}")
	Person getPerson(@PathVariable Long id);

	@PostExchange
	void add(@RequestBody Person person);
}

@RestController
class PersonController implements PersonService {

	public Person getPerson(@PathVariable Long id) {
		// ...
	}

	@ResponseStatus(HttpStatus.CREATED)
	public void add(@RequestBody Person person) {
		// ...
	}
}
```



`@HttpExchange` 和 `@RequestMapping` 之间有一些区别。`@RequestMapping` 可以通过路径模式、HTTP 方法等映射多个请求，而 `@HttpExchange` 声明一个具体的端点，指定 HTTP 方法、路径和内容类型。

对于方法参数和返回值，通常来说，`@HttpExchange` 支持 `@RequestMapping` 支持的参数子集。特别地，它排除了任何特定于服务器端的参数类型。有关详细信息，请参见 `@HttpExchange` 和 `@RequestMapping` 的参数列表。

`@HttpExchange` 还支持 `headers()` 参数，该参数接受类似 `name=value` 的键值对，类似于客户端 `@RequestMapping(headers={})` 中的用法。在服务器端，这扩展为 `@RequestMapping` 支持的完整语法。