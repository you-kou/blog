# SpringApplication

**SpringApplication** 类提供了一种方便的方式来引导从 `main()` 方法启动的 Spring 应用程序。在许多情况下，你可以委托给静态方法 `SpringApplication.run(Class, String...)`，如下例所示：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyApplication.class, args);
	}

}
```

当你的应用程序启动时，你应该看到类似如下的输出：

```txt
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.4.3)

2025-02-20T14:16:02.993Z  INFO 126323 --- [           main] o.s.b.d.f.logexample.MyApplication       : Starting MyApplication using Java 17.0.14 with PID 126323 (/opt/apps/myapp.jar started by myuser in /opt/apps/)
2025-02-20T14:16:03.006Z  INFO 126323 --- [           main] o.s.b.d.f.logexample.MyApplication       : No active profile set, falling back to 1 default profile: "default"
2025-02-20T14:16:07.963Z  INFO 126323 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8080 (http)
2025-02-20T14:16:08.040Z  INFO 126323 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2025-02-20T14:16:08.041Z  INFO 126323 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.36]
2025-02-20T14:16:08.241Z  INFO 126323 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2025-02-20T14:16:08.262Z  INFO 126323 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 4960 ms
2025-02-20T14:16:09.633Z  INFO 126323 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http) with context path '/'
2025-02-20T14:16:09.670Z  INFO 126323 --- [           main] o.s.b.d.f.logexample.MyApplication       : Started MyApplication in 8.489 seconds (process running for 9.432)
2025-02-20T14:16:09.677Z  INFO 126323 --- [ionShutdownHook] o.s.b.w.e.tomcat.GracefulShutdown        : Commencing graceful shutdown. Waiting for active requests to complete
2025-02-20T14:16:09.683Z  INFO 126323 --- [tomcat-shutdown] o.s.b.w.e.tomcat.GracefulShutdown        : Graceful shutdown complete
```

默认情况下，会显示 **INFO** 日志消息，包括一些相关的启动详细信息，如启动应用程序的用户。如果你需要其他日志级别，可以根据 **日志级别** 章节中的描述进行设置。应用程序版本是通过主应用程序类的包中的实现版本来确定的。可以通过将 `spring.main.log-startup-info` 设置为 `false` 来关闭启动信息日志记录。这还将关闭应用程序当前活动配置文件的日志记录。

> [!TIP]
>
> 要在启动期间添加额外的日志记录，你可以在 **SpringApplication** 的子类中重写 `logStartupInfo(boolean)` 方法。

## 启动失败

如果你的应用程序启动失败，注册的 **FailureAnalyzer** beans 将有机会提供专门的错误消息以及解决问题的具体操作。例如，如果你在端口 8080 启动一个 Web 应用程序，而该端口已经被占用，你应该看到类似如下的消息：

```txt
***************************
APPLICATION FAILED TO START
***************************

Description:

Embedded servlet container failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that is listening on port 8080 or configure this application to listen on another port.
```

> [!NOTE]
>
> Spring Boot 提供了许多 **FailureAnalyzer** 实现，你也可以添加自定义的实现。

如果没有 **FailureAnalyzer** 能够处理该异常，你仍然可以显示完整的条件报告，以更好地理解出了什么问题。为此，你需要启用 `debug` 属性或为 `ConditionEvaluationReportLoggingListener` 启用 **DEBUG** 级别的日志记录。

例如，如果你通过 `java -jar` 运行你的应用程序，可以按照以下方式启用 `debug` 属性：

```sh
$ java -jar myproject-0.0.1-SNAPSHOT.jar --debug
```

## 懒加载初始化

`SpringApplication` 允许应用程序进行懒加载初始化。当启用懒加载初始化时，bean 会在需要时才创建，而不是在应用程序启动时就创建。因此，启用懒加载初始化可以减少应用程序启动所需的时间。在 Web 应用程序中，启用懒加载初始化将导致许多与 Web 相关的 bean 在收到 HTTP 请求之前不会被初始化。

懒加载初始化的一个缺点是，它可能会延迟发现应用程序中的问题。如果一个配置错误的 bean 被懒加载初始化，故障将不再在启动时发生，而是在该 bean 被初始化时才会显现。还必须小心确保 JVM 有足够的内存来容纳所有应用程序的 beans，而不仅仅是启动时初始化的那些。由于这些原因，懒加载初始化默认是禁用的，建议在启用懒加载初始化之前，先对 JVM 的堆内存大小进行微调。

可以通过在 `SpringApplicationBuilder` 上使用 `lazyInitialization` 方法或在 `SpringApplication` 上使用 `setLazyInitialization` 方法以编程方式启用懒加载初始化。或者，可以通过以下示例所示的 `spring.main.lazy-initialization` 属性来启用懒加载初始化：

```yaml
spring:
  main:
    lazy-initialization: true
```

> [!TIP]
>
> 如果你希望在使用懒加载初始化的情况下，为某些 beans 禁用懒加载，可以通过显式将它们的懒加载属性设置为 `false`，使用 `@Lazy(false)` 注解。

## 自定义横幅

启动时打印的横幅可以通过将 `banner.txt` 文件添加到类路径中，或者通过设置 `spring.banner.location` 属性来更改该文件的位置。如果文件的编码不是 UTF-8，可以设置 `spring.banner.charset`。

在你的 `banner.txt` 文件中，你可以使用 `Environment` 中可用的任何键，以及以下任意占位符：

| Variable                                                     | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| `${application.version}`                                     | 应用程序的版本号，如在 `MANIFEST.MF` 文件中声明。例如，`Implementation-Version: 1.0` 会被打印为 `1.0`。 |
| `${application.formatted-version}`                           | 应用程序的版本号，如在 `MANIFEST.MF` 文件中声明，并格式化为显示形式（用括号括起来并以 `v` 为前缀）。例如，`(v1.0)`。 |
| `${spring-boot.version}`                                     | 你正在使用的 Spring Boot 版本。例如，`3.4.3`。               |
| `${spring-boot.formatted-version}`                           | 你正在使用的 Spring Boot 版本，格式化为显示形式（用括号括起来并以 `v` 为前缀）。例如，`(v3.4.3)`。 |
| `${Ansi.NAME}` (or `${AnsiColor.NAME}`, `${AnsiBackground.NAME}`, `${AnsiStyle.NAME}`) | 其中，`NAME` 是 ANSI 转义代码的名称。                        |
| `${application.title}`                                       | 应用程序的标题，如在 `MANIFEST.MF` 文件中声明。例如，`Implementation-Title: MyApp` 会打印为 `MyApp`。 |

> [!TIP]
>
> 如果你想通过编程方式生成横幅，可以使用 `SpringApplication.setBanner(…)` 方法。使用 `Banner` 接口并实现你自己的 `printBanner()` 方法。

你还可以使用 `spring.main.banner-mode` 属性来决定横幅是否需要打印到 `System.out`（控制台）、发送到配置的日志记录器（log），或者根本不生成（off）。

打印的横幅作为单例 bean 注册，名称为：`springBootBanner`。

> [!NOTE]
>
> `application.title`、`application.version` 和 `application.formatted-version` 属性仅在使用 `java -jar` 或 `java -cp` 启动 Spring Boot 启动器时可用。如果你以解压的 JAR 文件形式运行并使用 `java -cp <classpath> <mainclass>` 启动，或者以原生镜像的形式运行应用，这些值将无法解析。
>
> 要使用这些 `application` 属性，需通过 `java -jar` 启动应用，或者通过 `java org.springframework.boot.loader.launch.JarLauncher` 启动解压的 JAR 文件。这样会在构建类路径并启动应用之前初始化应用的横幅属性。

## 自定义 SpringApplication

如果 SpringApplication 的默认设置不符合你的需求，你可以创建一个本地实例并进行自定义。例如，要关闭横幅（banner），你可以这样写：

```java
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(MyApplication.class);
		application.setBannerMode(Banner.Mode.OFF);
		application.run(args);
	}

}
```

> [!NOTE]
>
> 构造传递给 `SpringApplication` 的参数是 Spring beans 的配置来源。在大多数情况下，这些参数是对 `@Configuration` 类的引用，但它们也可以是对 `@Component` 类的直接引用。

也可以通过使用 `application.properties` 文件来配置 `SpringApplication`。

## 流式构建器 API

如果你需要构建一个 `ApplicationContext` 层次结构（多个上下文具有父子关系），或者如果你更倾向于使用流式构建器 API，你可以使用 `SpringApplicationBuilder`。

`SpringApplicationBuilder` 允许你将多个方法调用链接在一起，并包括父子方法，允许你创建一个层次结构，如下例所示：

```java
		new SpringApplicationBuilder().sources(Parent.class)
			.child(Application.class)
			.bannerMode(Banner.Mode.OFF)
			.run(args);
```

> [!NOTE]
>
> 在创建 `ApplicationContext` 层次结构时，存在一些限制。例如，Web 组件必须包含在子上下文中，并且父上下文和子上下文使用相同的 `Environment`。有关详细信息，请参阅 `SpringApplicationBuilder` 的 API 文档。

## 应用程序可用性

当应用程序部署在平台上时，它们可以通过诸如 Kubernetes 探针等基础设施向平台提供关于其可用性的信息。Spring Boot 默认支持常用的“存活”（liveness）和“就绪”（readiness）可用性状态。如果您使用 Spring Boot 的“actuator”支持，那么这些状态会作为健康检查端点组暴露出来。

此外，您还可以通过将 `ApplicationAvailability` 接口注入到自己的 bean 中来获取可用性状态。

### Liveness State

“Liveness” 状态表示应用程序的内部状态是否允许其正常工作，或者在当前失败的情况下能否自行恢复。如果 “Liveness” 状态失效，意味着应用程序已经进入不可恢复的状态，此时基础设施应重新启动该应用程序。

> [!NOTE]
>
> 一般来说，“Liveness” 状态不应基于外部检查（例如健康检查）。如果这样做，当外部系统（如数据库、Web API、外部缓存）发生故障时，可能会触发大量重启，导致平台出现级联故障。

Spring Boot 应用的内部状态主要由 Spring **ApplicationContext** 表示。如果应用上下文成功启动，Spring Boot 便认为应用处于有效状态。应用在上下文刷新完成后即被视为存活，详情请参见 **Spring Boot 应用生命周期** 及相关的 **Application Events**。

### Readiness 状态

**Readiness 状态**表示应用程序是否已准备好处理流量。如果 “Readiness” 状态失败，则表明当前不应向该应用程序路由流量。通常，这种情况会发生在启动期间（例如 **CommandLineRunner** 和 **ApplicationRunner** 组件仍在执行时），或者当应用程序决定自身负载过高，无法接收额外流量时。

应用程序在 **应用和命令行运行器（runners）** 被调用后即被视为“就绪”，详情请参见 **Spring Boot 应用生命周期** 及相关的 **Application Events**。

> [!NOTE]
>
> 在应用启动过程中需要执行的任务，应使用 **CommandLineRunner** 和 **ApplicationRunner** 组件，而不是 Spring 组件生命周期回调（如 `@PostConstruct`）。

### **管理应用可用性状态**

应用组件可以随时通过注入 **ApplicationAvailability** 接口并调用其方法来获取当前的可用性状态。通常，应用程序更倾向于监听状态更新或主动更新应用的状态。

例如，我们可以将应用的 **"Readiness"** 状态导出到一个文件，以便 Kubernetes **"exec Probe"** 通过该文件进行检查：

```java
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.ReadinessState;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MyReadinessStateExporter {

	@EventListener
	public void onStateChange(AvailabilityChangeEvent<ReadinessState> event) {
		switch (event.getState()) {
			case ACCEPTING_TRAFFIC -> {
				// create file /tmp/healthy
			}
			case REFUSING_TRAFFIC -> {
				// remove file /tmp/healthy
			}
		}
	}

}
```

当应用程序崩溃且无法恢复时，我们也可以更新应用程序的状态：

```java
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.LivenessState;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class MyLocalCacheVerifier {

	private final ApplicationEventPublisher eventPublisher;

	public MyLocalCacheVerifier(ApplicationEventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void checkLocalCache() {
		try {
			// ...
		}
		catch (CacheCompletelyBrokenException ex) {
			AvailabilityChangeEvent.publish(this.eventPublisher, ex, LivenessState.BROKEN);
		}
	}

}
```

Spring Boot 通过 Actuator 健康检查端点提供 Kubernetes HTTP 探针，用于“存活性 (Liveness)”和“就绪性 (Readiness)”。您可以在专门的部分获取有关在 Kubernetes 上部署 Spring Boot 应用程序的更多指导。

## 应用事件与监听器

除了常规的 Spring 框架事件（如 `ContextRefreshedEvent`）外，`SpringApplication` 还会发送一些额外的应用事件。

> [!NOTE]
>
> 某些事件实际上是在 `ApplicationContext` 创建之前触发的，因此无法通过 `@Bean` 注册监听器。你可以使用 `SpringApplication.addListeners(…)` 方法或 `SpringApplicationBuilder.listeners(…)` 方法来注册这些监听器。
>
> 如果希望这些监听器在应用程序创建方式不同的情况下都能自动注册，可以在项目中添加 `META-INF/spring.factories` 文件，并使用 `ApplicationListener` 关键字引用你的监听器，如下示例所示：
>
> ```
> org.springframework.context.ApplicationListener=com.example.project.MyListener
> ```

应用事件在应用运行过程中按以下顺序发送：

- **`ApplicationStartingEvent`**：在运行开始时发送，但除了监听器和初始化器的注册之外，不进行任何处理。
- **`ApplicationEnvironmentPreparedEvent`**：在确定应用环境 (`Environment`) 但 `ApplicationContext` 尚未创建时发送。
- **`ApplicationContextInitializedEvent`**：在 `ApplicationContext` 准备就绪并调用 `ApplicationContextInitializers` 之后，但在加载任何 Bean 定义之前发送。
- **`ApplicationPreparedEvent`**：在启动 `refresh` 之前发送，此时 Bean 定义已经加载。
- **`ApplicationStartedEvent`**：在 `ApplicationContext` 刷新完成后发送，但在调用任何应用程序和命令行运行器 (`ApplicationRunner` 和 `CommandLineRunner`) 之前发送。
- **`AvailabilityChangeEvent (LivenessState.CORRECT)`**：在 `ApplicationStartedEvent` 之后立即发送，表明应用被认为是存活的 (`live`)。
- **`ApplicationReadyEvent`**：在所有应用程序和命令行运行器执行完毕后发送。
- **`AvailabilityChangeEvent (ReadinessState.ACCEPTING_TRAFFIC)`**：在 `ApplicationReadyEvent` 之后立即发送，表示应用已准备好处理请求。
- **`ApplicationFailedEvent`**：如果应用启动过程中发生异常，则会发送该事件。

上述列表仅包含与 `SpringApplication` 相关的 `SpringApplicationEvent`。除此之外，在 `ApplicationPreparedEvent` 之后、`ApplicationStartedEvent` 之前，还会触发一些额外的事件：

- 当 Web 服务器准备就绪后，会发送 `WebServerInitializedEvent`。其中，`ServletWebServerInitializedEvent` 和 `ReactiveWebServerInitializedEvent` 分别是针对 Servlet 服务器和响应式服务器的变体。

- 当 `ApplicationContext` 被刷新时，会发送 `ContextRefreshedEvent`。

> [!TIP]
>
> 你通常不需要使用应用事件，但了解它们的存在是很有用的。在 Spring Boot 内部，事件被用来处理各种任务。

> [!NOTE]
>
> 事件监听器不应执行可能耗时的任务，因为它们默认在同一线程中运行。可以考虑使用应用程序和命令行运行器来替代。

应用事件是通过 Spring 框架的事件发布机制发送的。该机制的一部分确保了发布到子上下文监听器的事件，也会被发布到任何祖先上下文中的监听器。因此，如果应用程序使用了多个 `SpringApplication` 实例的层次结构，监听器可能会接收到多个相同类型的应用事件实例。

为了让监听器区分属于其上下文的事件和属于子上下文的事件，监听器应请求注入其应用上下文，然后将注入的上下文与事件的上下文进行比较。可以通过实现 `ApplicationContextAware` 接口，或者如果监听器是一个 bean，可以使用 `@Autowired` 注解来注入上下文。

**Web 环境**
`SpringApplication` 会为你自动创建合适类型的 `ApplicationContext`。用于确定 `WebApplicationType` 的算法如下：

- 如果 Spring MVC 存在，则使用 `AnnotationConfigServletWebServerApplicationContext`。
- 如果 Spring MVC 不存在且 Spring WebFlux 存在，则使用 `AnnotationConfigReactiveWebServerApplicationContext`。
- 否则，使用 `AnnotationConfigApplicationContext`。

这意味着，如果在同一个应用中同时使用了 Spring MVC 和 Spring WebFlux 的新 `WebClient`，默认情况下将使用 Spring MVC。你可以通过调用 `setWebApplicationType(WebApplicationType)` 来轻松覆盖这一行为。

此外，还可以通过调用 `setApplicationContextFactory(…)` 完全控制所使用的 `ApplicationContext` 类型。

> [!TIP]
>
> 在使用 `SpringApplication` 进行 JUnit 测试时，通常需要调用 `setWebApplicationType(WebApplicationType.NONE)`。这样做可以禁用 Web 环境的自动配置，确保测试环境不涉及 Web 相关的上下文。

## 访问应用程序参数

如果需要访问传递给 `SpringApplication.run(…)` 的应用程序参数，可以注入 `ApplicationArguments` bean。`ApplicationArguments` 接口提供对原始 `String[]` 参数的访问，以及解析后的选项参数和非选项参数，如下所示：

```java
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

@Component
public class MyBean {

	public MyBean(ApplicationArguments args) {
		boolean debug = args.containsOption("debug");
		List<String> files = args.getNonOptionArgs();
		if (debug) {
			System.out.println(files);
		}
		// if run with "--debug logfile.txt" prints ["logfile.txt"]
	}

}
```

> [!TIP]
>
> Spring Boot 还会将 `CommandLinePropertySource` 注册到 Spring 环境中。这样，你也可以通过使用 `@Value` 注解来注入单个应用程序参数。

## 使用 ApplicationRunner 或 CommandLineRunner

如果你需要在 `SpringApplication` 启动后运行特定代码，可以实现 `ApplicationRunner` 或 `CommandLineRunner` 接口。这两个接口的工作方式相同，都提供一个 `run` 方法，该方法会在 `SpringApplication.run(…)` 完成之前被调用。

> [!NOTE]
>
> 这个契约非常适合在应用程序启动后但在开始接受流量之前运行的任务。

`CommandLineRunner` 接口提供对应用程序参数的访问，参数以字符串数组的形式传递，而 `ApplicationRunner` 则使用前面讨论的 `ApplicationArguments` 接口。以下示例展示了一个具有 `run` 方法的 `CommandLineRunner`：

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MyCommandLineRunner implements CommandLineRunner {

	@Override
	public void run(String... args) {
		// Do something...
	}

}
```

如果定义了多个 `CommandLineRunner` 或 `ApplicationRunner` bean，且需要按照特定顺序调用，你可以额外实现 `Ordered` 接口或使用 `@Order` 注解来指定执行顺序。

## 应用程序退出

每个 `SpringApplication` 都会向 JVM 注册一个关闭钩子，以确保在退出时应用上下文能够平稳关闭。所有标准的 Spring 生命周期回调（如 `DisposableBean` 接口或 `@PreDestroy` 注解）都可以使用。

此外，如果某些 bean 希望在调用 `SpringApplication.exit()` 时返回特定的退出代码，它们可以实现 `ExitCodeGenerator` 接口。然后，这个退出代码可以传递给 `System.exit()`，以作为状态代码返回，如下示例所示：

```java
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MyApplication {

	@Bean
	public ExitCodeGenerator exitCodeGenerator() {
		return () -> 42;
	}

	public static void main(String[] args) {
		System.exit(SpringApplication.exit(SpringApplication.run(MyApplication.class, args)));
	}

}
```

此外，`ExitCodeGenerator` 接口也可以由异常来实现。当遇到这样的异常时，Spring Boot 会返回由实现的 `getExitCode()` 方法提供的退出代码。

如果有多个 `ExitCodeGenerator`，则会使用第一个生成的非零退出代码。为了控制生成器被调用的顺序，可以额外实现 `Ordered` 接口或使用 `@Order` 注解。

## 管理员功能

可以通过指定 `spring.application.admin.enabled` 属性来启用与管理员相关的功能。这将在平台的 MBeanServer 上暴露 `SpringApplicationAdminMXBean`。你可以使用此功能远程管理你的 Spring Boot 应用程序。该功能对于任何服务包装器实现也可能非常有用。

> [!TIP]
>
> 如果你想知道应用程序运行在哪个 HTTP 端口，可以通过 `local.server.port` 属性获取该信息。

## 应用程序启动跟踪

在应用程序启动过程中，`SpringApplication` 和 `ApplicationContext` 执行与应用程序生命周期、bean 生命周期甚至应用事件处理相关的许多任务。通过 `ApplicationStartup`，Spring 框架允许你使用 `StartupStep` 对象跟踪应用程序启动顺序。这些数据可以用于性能分析，或者仅仅是为了更好地理解应用程序的启动过程。

你可以在设置 `SpringApplication` 实例时选择一个 `ApplicationStartup` 实现。例如，要使用 `BufferingApplicationStartup`，你可以这样写：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup;

@SpringBootApplication
public class MyApplication {

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(MyApplication.class);
		application.setApplicationStartup(new BufferingApplicationStartup(2048));
		application.run(args);
	}

}
```

第一个可用的实现是 `FlightRecorderApplicationStartup`，它由 Spring 框架提供。该实现将 Spring 特定的启动事件添加到 Java Flight Recorder 会话中，旨在对应用程序进行性能分析，并将其 Spring 上下文生命周期与 JVM 事件（如内存分配、垃圾回收、类加载等）进行关联。一旦配置完成，你可以通过启用 Flight Recorder 来运行应用程序并记录数据：

```sh
$ java -XX:StartFlightRecording:filename=recording.jfr,duration=10s -jar demo.jar
```

Spring Boot 附带了 `BufferingApplicationStartup` 变体；该实现用于缓冲启动步骤，并将它们导出到外部指标系统。应用程序可以在任何组件中请求 `BufferingApplicationStartup` 类型的 bean。

此外，Spring Boot 还可以配置为暴露一个启动端点，以 JSON 文档的形式提供这些信息。

## 虚拟线程

如果你正在使用 Java 21 或更高版本，可以通过将 `spring.threads.virtual.enabled` 属性设置为 `true` 来启用虚拟线程。

在为应用程序启用此选项之前，你应该考虑阅读官方的 Java 虚拟线程文档。在某些情况下，应用程序可能会因为“固定虚拟线程”而导致吞吐量降低；该页面还解释了如何使用 JDK Flight Recorder 或 `jcmd` 命令行工具检测此类情况。

> [!NOTE]
>
> 如果启用了虚拟线程，配置线程池的属性将不再起作用。这是因为虚拟线程是在 JVM 全局的线程池中调度的，而不是在专用的线程池中调度的。

> [!WARNING]
>
> 虚拟线程的一个副作用是它们是守护线程。如果所有线程都是守护线程，JVM 会退出。比如，当你依赖 `@Scheduled` bean 来保持应用程序运行时，这种行为可能会成为一个问题。如果使用虚拟线程，调度线程是虚拟线程，因此是守护线程，这样就无法保持 JVM 的运行。这不仅影响调度，其他技术也可能会遇到类似情况。为了确保 JVM 在所有情况下都保持运行，建议将 `spring.main.keep-alive` 属性设置为 `true`。这样，即使所有线程都是虚拟线程，也能确保 JVM 保持活跃。

