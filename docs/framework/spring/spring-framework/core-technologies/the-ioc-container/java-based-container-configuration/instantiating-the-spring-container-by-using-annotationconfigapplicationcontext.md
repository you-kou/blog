# 使用 `AnnotationConfigApplicationContext` 实例化 Spring 容器

 以下部分介绍了 Spring 3.0 引入的 `AnnotationConfigApplicationContext`。这个多功能的 `ApplicationContext` 实现不仅能够接受 `@Configuration` 类作为输入，还可以接受普通的 `@Component` 类以及带有 JSR-330 元数据的类。

当提供 `@Configuration` 类作为输入时，该 `@Configuration` 类本身会被注册为一个 bean 定义，并且类中所有声明的 `@Bean` 方法也会被注册为 bean 定义。

当提供 `@Component` 和 JSR-330（如 `@Inject`）注解的类时，它们会被注册为 bean 定义，并且默认假设这些类内部使用了 `@Autowired` 或 `@Inject` 进行依赖注入。

## 简单构造

与 `ClassPathXmlApplicationContext` 通过 Spring XML 文件作为输入进行实例化的方式类似，你可以使用 `@Configuration` 类作为 `AnnotationConfigApplicationContext` 的输入进行实例化。这使得 Spring 容器可以完全不依赖 XML 配置，如下示例所示：

```java
public static void main(String[] args) {
	ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
	MyService myService = ctx.getBean(MyService.class);
	myService.doStuff();
}
```

如前所述，`AnnotationConfigApplicationContext` 不仅限于仅与 `@Configuration` 类一起使用。任何 `@Component` 或 JSR-330 注解的类都可以作为输入提供给构造函数，以下示例展示了这一点：

```java
public static void main(String[] args) {
	ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
	MyService myService = ctx.getBean(MyService.class);
	myService.doStuff();
}
```

前面的示例假设 `MyServiceImpl`、`Dependency1` 和 `Dependency2` 使用了 Spring 依赖注入注解，如 `@Autowired`。

## 通过使用 register(Class<?>…) 编程方式构建容器

你可以使用无参构造函数实例化 `AnnotationConfigApplicationContext`，然后通过 `register()` 方法进行配置。当以编程方式构建 `AnnotationConfigApplicationContext` 时，这种方法特别有用。以下示例展示了如何做到这一点：

```java
public static void main(String[] args) {
	AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
	ctx.register(AppConfig.class, OtherConfig.class);
	ctx.register(AdditionalConfig.class);
	ctx.refresh();
	MyService myService = ctx.getBean(MyService.class);
	myService.doStuff();
}
```

## 通过 scan(String…) 启用组件扫描

要启用组件扫描，你可以按如下方式注解你的 `@Configuration` 类：

```java
@Configuration
@ComponentScan(basePackages = "com.acme")
public class AppConfig  {
	// ...
}
```

> [!TIP]
>
> 有经验的 Spring 用户可能熟悉 Spring 的 `context:` 命名空间中的 XML 声明等效项，如下例所示：
>
> ```xml
> <beans>
> 	<context:component-scan base-package="com.acme"/>
> </beans>
> ```

在前面的例子中，`com.acme` 包被扫描以查找任何使用 `@Component` 注解的类，这些类将作为 Spring bean 定义注册到容器中。`AnnotationConfigApplicationContext` 提供了 `scan(String...)` 方法，以允许相同的组件扫描功能，如下例所示：

```java
public static void main(String[] args) {
	AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
	ctx.scan("com.acme");
	ctx.refresh();
	MyService myService = ctx.getBean(MyService.class);
}
```

> [!NOTE]
>
> 请记住，`@Configuration` 类是用 `@Component` 注解的元注解，因此它们是组件扫描的候选类。在前面的例子中，假设 `AppConfig` 声明在 `com.acme` 包（或其下的任何包）中，那么它会在调用 `scan()` 时被拾取。在调用 `refresh()` 后，所有它的 `@Bean` 方法会被处理并作为 bean 定义注册到容器中。

## 支持 Web 应用程序的 `AnnotationConfigWebApplicationContext`

`AnnotationConfigWebApplicationContext` 是 `AnnotationConfigApplicationContext` 的一个 WebApplicationContext 变体。你可以在配置 Spring 的 `ContextLoaderListener` servlet 监听器、Spring MVC 的 `DispatcherServlet` 等时使用这个实现。以下是配置一个典型 Spring MVC Web 应用程序的 `web.xml` 片段（注意 `contextClass` 和 `init-param` 的使用）：

```xml
<web-app>
	<!-- Configure ContextLoaderListener to use AnnotationConfigWebApplicationContext
		instead of the default XmlWebApplicationContext -->
	<context-param>
		<param-name>contextClass</param-name>
		<param-value>
			org.springframework.web.context.support.AnnotationConfigWebApplicationContext
		</param-value>
	</context-param>

	<!-- Configuration locations must consist of one or more comma- or space-delimited
		fully-qualified @Configuration classes. Fully-qualified packages may also be
		specified for component-scanning -->
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>com.acme.AppConfig</param-value>
	</context-param>

	<!-- Bootstrap the root application context as usual using ContextLoaderListener -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>

	<!-- Declare a Spring MVC DispatcherServlet as usual -->
	<servlet>
		<servlet-name>dispatcher</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<!-- Configure DispatcherServlet to use AnnotationConfigWebApplicationContext
			instead of the default XmlWebApplicationContext -->
		<init-param>
			<param-name>contextClass</param-name>
			<param-value>
				org.springframework.web.context.support.AnnotationConfigWebApplicationContext
			</param-value>
		</init-param>
		<!-- Again, config locations must consist of one or more comma- or space-delimited
			and fully-qualified @Configuration classes -->
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>com.acme.web.MvcConfig</param-value>
		</init-param>
	</servlet>

	<!-- map all requests for /app/* to the dispatcher servlet -->
	<servlet-mapping>
		<servlet-name>dispatcher</servlet-name>
		<url-pattern>/app/*</url-pattern>
	</servlet-mapping>
</web-app>
```

> [!NOTE]
>
> 对于编程使用场景，`GenericWebApplicationContext` 可以作为 `AnnotationConfigWebApplicationContext` 的替代方案。有关详细信息，请参见 `GenericWebApplicationContext` 的 javadoc。

