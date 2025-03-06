# 日志记录

Spring Boot 使用 Commons Logging 进行所有内部日志记录，但将底层日志实现留给用户选择。默认配置支持 Java Util Logging、Log4j2 和 Logback。在每种情况下，日志记录器都已预配置为使用控制台输出，且可选地支持文件输出。

默认情况下，如果使用 Spring Boot 的 starters，日志记录会使用 Logback。同时，Spring Boot 还包含了适当的 Logback 路由配置，以确保使用 Java Util Logging、Commons Logging、Log4J 或 SLF4J 的依赖库也能正常工作。

> [!TIP]
>
> Java 有许多日志框架可供选择。如果上述列表看起来让你感到困惑，不必担心。通常，你无需更改日志依赖，Spring Boot 的默认配置已经能够很好地工作。

> [!TIP]
>
> 当你将应用程序部署到 servlet 容器或应用服务器时，使用 Java Util Logging API 执行的日志记录不会被路由到应用程序的日志中。这意味着容器或其他已部署到该容器的应用程序所执行的日志记录不会出现在你的应用程序日志中。

## 日志格式

Spring Boot 的默认日志输出如下所示：

```
2025-02-20T14:15:52.373Z  INFO 125657 --- [myapp] [           main] o.s.b.d.f.logexample.MyApplication       : Starting MyApplication using Java 17.0.14 with PID 125657 (/opt/apps/myapp.jar started by myuser in /opt/apps/)
2025-02-20T14:15:52.385Z  INFO 125657 --- [myapp] [           main] o.s.b.d.f.logexample.MyApplication       : No active profile set, falling back to 1 default profile: "default"
2025-02-20T14:15:55.401Z  INFO 125657 --- [myapp] [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8080 (http)
2025-02-20T14:15:55.479Z  INFO 125657 --- [myapp] [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2025-02-20T14:15:55.488Z  INFO 125657 --- [myapp] [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.36]
2025-02-20T14:15:55.671Z  INFO 125657 --- [myapp] [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2025-02-20T14:15:55.684Z  INFO 125657 --- [myapp] [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 3015 ms
2025-02-20T14:15:57.042Z  INFO 125657 --- [myapp] [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http) with context path '/'
2025-02-20T14:15:57.095Z  INFO 125657 --- [myapp] [           main] o.s.b.d.f.logexample.MyApplication       : Started MyApplication in 6.4 seconds (process running for 7.393)
2025-02-20T14:15:57.106Z  INFO 125657 --- [myapp] [ionShutdownHook] o.s.b.w.e.tomcat.GracefulShutdown        : Commencing graceful shutdown. Waiting for active requests to complete
2025-02-20T14:15:57.130Z  INFO 125657 --- [myapp] [tomcat-shutdown] o.s.b.w.e.tomcat.GracefulShutdown        : Graceful shutdown complete
```

以下内容会被输出：

- **日期和时间**：精确到毫秒，且易于排序。
- **日志级别**：ERROR、WARN、INFO、DEBUG 或 TRACE。
- **进程 ID**。
- **--- 分隔符**：用于区分实际日志消息的开始。
- **应用程序名称**：默认情况下仅在设置了 `spring.application.name` 时以方括号括起来记录。
- **应用程序组**：默认情况下仅在设置了 `spring.application.group` 时以方括号括起来记录。
- **线程名称**：以方括号括起来（控制台输出时可能被截断）。
- **关联 ID**：如果启用了追踪（在上面的示例中未显示）。
- **日志记录器名称**：通常是源类的名称（通常被缩写）。
- **日志消息**。

> [!NOTE]
>
> Logback 并没有 FATAL 级别，它被映射为 ERROR 级别。

> [!TIP]
>
> 如果你设置了 `spring.application.name` 属性，但不希望它被记录，可以将 `logging.include-application-name` 设置为 `false`。

> [!TIP]
>
> 如果你设置了 `spring.application.group` 属性，但不希望它被记录，可以将 `logging.include-application-group` 设置为 `false`。

## 控制台输出

默认的日志配置会将消息实时输出到控制台。默认情况下，ERROR 级别、WARN 级别和 INFO 级别的消息会被记录。你还可以通过使用 `--debug` 标志启动应用程序来启用“调试”模式。

```sh
$ java -jar myapp.jar --debug
```

> [!NOTE]
>
> 你也可以在 `application.properties` 中指定 `debug=true`。

启用调试模式后，一些核心日志记录器（嵌入式容器、Hibernate 和 Spring Boot）将被配置为输出更多信息。启用调试模式并不会将应用程序配置为记录所有 DEBUG 级别的消息。

另外，你可以通过使用 `--trace` 标志（或在 `application.properties` 中设置 `trace=true`）来启用“追踪”模式。这样做会为一些核心日志记录器（嵌入式容器、Hibernate 模式生成和整个 Spring 系列）启用追踪日志记录。

### 颜色编码输出

如果你的终端支持 ANSI，日志输出将使用颜色编码以提高可读性。你可以设置 `spring.output.ansi.enabled` 为支持的值，以覆盖自动检测。

颜色编码是通过使用 `%clr` 转换符来配置的。最简单的形式是，转换器会根据日志级别对输出进行着色，如下所示的示例所示：

```
%clr(%5p)
```

以下是日志级别与颜色的映射关系：

| 级别    | 颜色 |
| :------ | :--- |
| `FATAL` | 红色 |
| `ERROR` | 红色 |
| `WARN`  | 黄色 |
| `INFO`  | 绿色 |
| `DEBUG` | 绿色 |
| `TRACE` | 绿色 |

或者，您可以通过选项指定转换时应使用的颜色或样式。例如，要使文本变为黄色，请使用以下设置：

```
%clr(%d{yyyy-MM-dd'T'HH:mm:ss.SSSXXX}){yellow}
```

支持以下颜色和样式：

- 蓝色 (blue)
- 青色 (cyan)
- 淡色 (faint)
- 绿色 (green)
- 洋红色 (magenta)
- 红色 (red)
- 黄色 (yellow)

## 文件输出

默认情况下，Spring Boot 仅将日志输出到控制台，不会写入日志文件。如果除了控制台输出外，还需要将日志写入文件，需要在 `application.properties` 中设置 `logging.file.name` 或 `logging.file.path` 属性。

如果同时设置了这两个属性，则 `logging.file.path` 会被忽略，只有 `logging.file.name` 会生效。

下表展示了 `logging.*` 属性的组合使用方式：

| `logging.file.name`          | `logging.file.path`            | 描述                                                         |
| :--------------------------- | :----------------------------- | :----------------------------------------------------------- |
| (无)                         | (无)                           | 仅控制台日志输出。                                           |
| 特定文件（例如，`my.log`）。 | (无)                           | 写入 `logging.file.name` 指定的位置。该位置可以是绝对路径，也可以是相对于当前目录的相对路径。 |
| (无)                         | 特定目录（例如，`/var/log`）。 | 在 `logging.file.path` 指定的目录下写入 `spring.log` 文件。该目录可以是绝对路径，也可以是相对于当前目录的相对路径。 |
| 特定目录                     | 特定目录                       | 写入 `logging.file.name` 指定的位置，并忽略 `logging.file.path`。该位置可以是绝对路径，也可以是相对于当前目录的相对路径。 |

当日志文件达到 10 MB 时会进行轮换，与控制台输出一样，默认情况下会记录 ERROR 级别、WARN 级别和 INFO 级别的消息。

> [!TIP]
>
> 日志属性独立于实际的日志基础设施。因此，特定的配置键（例如 Logback 的 `logback.configurationFile`）不是由 Spring Boot 管理的。

## 文件轮换

如果您使用的是 Logback，可以通过 `application.properties` 或 `application.yaml` 文件来精细调整日志轮换设置。对于其他日志系统，您需要自己直接配置轮换设置（例如，如果使用 Log4j2，您可以添加一个 `log4j2.xml` 或 `log4j2-spring.xml` 文件）。

以下是支持的轮换策略属性：

| Name                                                   | Description                                |
| :----------------------------------------------------- | :----------------------------------------- |
| `logging.logback.rollingpolicy.file-name-pattern`      | 用于创建日志归档的文件名模式。             |
| `logging.logback.rollingpolicy.clean-history-on-start` | 当应用程序启动时是否应执行日志归档清理。   |
| `logging.logback.rollingpolicy.max-file-size`          | 日志文件在归档之前的最大大小。             |
| `logging.logback.rollingpolicy.total-size-cap`         | 日志归档在被删除之前可以占用的最大大小。   |
| `logging.logback.rollingpolicy.max-history`            | 保留的最大归档日志文件数量（默认值为 7）。 |

## 日志级别

所有支持的日志系统都可以通过在 Spring 环境中设置日志级别（例如，在 `application.properties` 中）来配置，使用的格式是 `logging.level.<logger-name>=<level>`，其中 `level` 可以是以下之一：TRACE、DEBUG、INFO、WARN、ERROR、FATAL 或 OFF。根日志记录器可以通过 `logging.level.root` 进行配置。

以下示例展示了在 `application.properties` 中可能的日志设置：

```yaml
logging:
  level:
    root: "warn"
    org.springframework.web: "debug"
    org.hibernate: "error"
```

也可以通过环境变量设置日志级别。例如，`LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=DEBUG` 将把 `org.springframework.web` 的日志级别设置为 DEBUG。

> [!NOTE]
>
> 上述方法仅适用于包级别的日志记录。由于松散绑定始终将环境变量转换为小写，因此无法通过这种方式为单个类配置日志。如果需要为某个类配置日志，可以使用 `SPRING_APPLICATION_JSON` 变量。

## 日志组

将相关的日志记录器分组，以便能够同时配置它们，通常是很有用的。例如，您可能经常需要更改与 Tomcat 相关的所有日志记录器的日志级别，但可能很难记住顶级包名。

为了解决这个问题，Spring Boot 允许您在 Spring 环境中定义日志组。例如，您可以通过将其添加到 `application.properties` 来定义一个名为 “tomcat” 的日志组：

```yaml
logging:
  group:
    tomcat: "org.apache.catalina,org.apache.coyote,org.apache.tomcat"
```

定义后，您可以用一行配置更改该日志组中所有日志记录器的级别：

```yaml
logging:
  level:
    tomcat: "trace"
```

Spring Boot 提供了以下预定义的日志组，可直接使用：

| Name | Loggers                                                      |
| :--- | :----------------------------------------------------------- |
| web  | `org.springframework.core.codec`, `org.springframework.http`, `org.springframework.web`, `org.springframework.boot.actuate.endpoint.web`, `org.springframework.boot.web.servlet.ServletContextInitializerBeans` |
| sql  | `org.springframework.jdbc.core`, `org.hibernate.SQL`, `LoggerListener` |

## 使用日志关闭钩子

为了在应用程序终止时释放日志资源，Spring Boot 提供了一个关闭钩子（shutdown hook），当 JVM 退出时会触发日志系统的清理。此关闭钩子会自动注册，除非应用程序被部署为 WAR 文件。

如果应用程序具有复杂的上下文层次结构，默认的关闭钩子可能无法满足需求。在这种情况下，可以禁用关闭钩子，并直接使用底层日志系统提供的选项。例如，Logback 提供了上下文选择器（context selectors），允许每个 Logger 在其自己的上下文中创建。

可以使用 `logging.register-shutdown-hook` 属性来禁用关闭钩子，将其设置为 `false` 即可禁用注册。此属性可以在 `application.properties` 或 `application.yaml` 文件中进行配置：

```yaml
logging:
  register-shutdown-hook: false
```

## 自定义日志配置

不同的日志系统可以通过在类路径（classpath）中包含相应的库来激活，并且可以通过在类路径的根目录或 `logging.config` 这个 Spring 环境属性指定的位置提供适当的配置文件来进一步自定义。

可以通过 `org.springframework.boot.logging.LoggingSystem` 系统属性强制 Spring Boot 使用特定的日志系统，该属性的值应为 `LoggingSystem` 实现类的全限定名称。如果希望完全禁用 Spring Boot 的日志配置，可以将该属性设置为 `none`。

> [!NOTE]
>
> 由于日志系统在 `ApplicationContext` 创建之前初始化，因此无法在 Spring 的 `@Configuration` 文件中通过 `@PropertySources` 控制日志配置。唯一可以更改日志系统或完全禁用日志的方法是通过**系统属性（System properties）**进行设置。

根据所使用的日志系统，会加载以下配置文件：

| Logging System          | Customization                                                |
| :---------------------- | :----------------------------------------------------------- |
| Logback                 | `logback-spring.xml`, `logback-spring.groovy`, `logback.xml`, or `logback.groovy` |
| Log4j2                  | `log4j2-spring.xml` or `log4j2.xml`                          |
| JDK (Java Util Logging) | `logging.properties`                                         |

> [!NOTE]
>
> 如果可能的话，建议使用 **-spring** 变体的日志配置文件（例如，`logback-spring.xml` 而不是 `logback.xml`）。如果使用标准的配置文件位置，Spring 将无法完全控制日志初始化。

> [!WARNING]
>
> 已知 Java Util Logging 存在类加载问题，在以 **“可执行 JAR”** 运行时可能会导致问题。因此，建议尽量避免在 **“可执行 JAR”** 中使用 Java Util Logging。

为了便于自定义配置，Spring 环境中的某些属性会被转换为**系统属性（System properties）**，从而允许日志系统配置使用这些属性。例如，在 `application.properties` 中设置 `logging.file.name`，或通过环境变量 `LOGGING_FILE_NAME` 进行设置，会导致系统属性 `LOG_FILE` 被赋值。

下表描述了被转换的属性：

| Spring Environment                  | System Property                 | Comments                                                     |
| :---------------------------------- | :------------------------------ | :----------------------------------------------------------- |
| `logging.exception-conversion-word` | `LOG_EXCEPTION_CONVERSION_WORD` | 记录异常时使用的转换关键字。                                 |
| `logging.file.name`                 | `LOG_FILE`                      | 如果已定义，它将在默认日志配置中使用。                       |
| `logging.file.path`                 | `LOG_PATH`                      | 如果已定义，它将在默认日志配置中使用。                       |
| `logging.pattern.console`           | `CONSOLE_LOG_PATTERN`           | 在控制台（stdout）上使用的日志模式。                         |
| `logging.pattern.dateformat`        | `LOG_DATEFORMAT_PATTERN`        | 日志日期格式的追加器（Appender）模式。                       |
| `logging.charset.console`           | `CONSOLE_LOG_CHARSET`           | 控制台日志输出时使用的字符集（charset）。                    |
| `logging.threshold.console`         | `CONSOLE_LOG_THRESHOLD`         | 控制台日志输出时使用的日志级别阈值。                         |
| `logging.pattern.file`              | `FILE_LOG_PATTERN`              | 在文件中使用的日志模式（如果启用了 `LOG_FILE`）。            |
| `logging.charset.file`              | `FILE_LOG_CHARSET`              | 文件日志输出时使用的字符集（如果启用了 `LOG_FILE`）。        |
| `logging.threshold.file`            | `FILE_LOG_THRESHOLD`            | 文件日志输出时使用的日志级别阈值。                           |
| `logging.pattern.level`             | `LOG_LEVEL_PATTERN`             | 渲染日志级别时使用的格式（默认 `%5p`）。                     |
| `logging.structured.format.console` | `CONSOLE_LOG_STRUCTURED_FORMAT` | 用于控制台日志输出的结构化日志格式。                         |
| `logging.structured.format.file`    | `FILE_LOG_STRUCTURED_FORMAT`    | 用于文件日志输出的结构化日志格式。                           |
| `PID`                               | `PID`                           | 当前进程 ID（如果可能且未作为操作系统环境变量定义，则会自动发现）。 |

如果您使用 Logback，以下属性也会被转换：

| Spring Environment                                     | System Property                                | Comments                                                     |
| :----------------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------------- |
| `logging.logback.rollingpolicy.file-name-pattern`      | `LOGBACK_ROLLINGPOLICY_FILE_NAME_PATTERN`      | 滚动日志文件名称的模式（默认 `${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz`）。 |
| `logging.logback.rollingpolicy.clean-history-on-start` | `LOGBACK_ROLLINGPOLICY_CLEAN_HISTORY_ON_START` | 是否在启动时清理归档的日志文件。                             |
| `logging.logback.rollingpolicy.max-file-size`          | `LOGBACK_ROLLINGPOLICY_MAX_FILE_SIZE`          | 日志文件的最大大小。                                         |
| `logging.logback.rollingpolicy.total-size-cap`         | `LOGBACK_ROLLINGPOLICY_TOTAL_SIZE_CAP`         | 要保留的日志备份的总大小。                                   |
| `logging.logback.rollingpolicy.max-history`            | `LOGBACK_ROLLINGPOLICY_MAX_HISTORY`            | 要保留的最大归档日志文件数量。                               |

所有支持的日志系统在解析其配置文件时都可以查阅系统属性。以下是一些默认配置示例，您可以在 `spring-boot.jar` 中找到这些示例：

- **[Logback](https://github.com/spring-projects/spring-boot/tree/v3.4.3/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/logback/defaults.xml)**
- [**Log4j 2**](https://github.com/spring-projects/spring-boot/tree/v3.4.3/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/log4j2/log4j2.xml)
- [**Java Util Logging**](https://github.com/spring-projects/spring-boot/tree/v3.4.3/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/java/logging-file.properties)

> [!TIP]
>
> 如果您想在日志属性中使用占位符，应该使用 Spring Boot 的语法，而不是底层框架的语法。特别地，如果使用 Logback，应该使用 **冒号（:）** 作为属性名称和默认值之间的分隔符，而不是使用 **冒号和短横线（:-）**。

> [!TIP]
>
> 您可以通过仅覆盖 `LOG_LEVEL_PATTERN`（或使用 Logback 时的 `logging.pattern.level`）来将 MDC 和其他临时内容添加到日志行中。例如，如果使用 `logging.pattern.level=user:%X{user} %5p`，则默认的日志格式将包含一个名为 "user" 的 MDC 条目（如果存在），如以下示例所示：
>
> ```
> 2019-08-30 12:30:04.031 user:someone INFO 22174 --- [  nio-8080-exec-0] demo.Controller
> Handling authenticated request
> ```

## 结构化日志

结构化日志是一种技术，其中日志输出以定义良好的、通常是机器可读的格式编写。Spring Boot 支持结构化日志，并原生支持以下 JSON 格式：

- Elastic Common Schema (ECS)
- Graylog Extended Log Format (GELF)
- Logstash

要启用结构化日志，可以将属性 `logging.structured.format.console`（用于控制台输出）或 `logging.structured.format.file`（用于文件输出）设置为您想使用的格式 ID。

如果您使用自定义日志配置，请更新您的配置以尊重 `CONSOLE_LOG_STRUCTURED_FORMAT` 和 `FILE_LOG_STRUCTURED_FORMAT` 系统属性。以 `CONSOLE_LOG_STRUCTURED_FORMAT` 为例：

::: code-group

```Logback
<!-- replace your encoder with StructuredLogEncoder -->
<encoder class="org.springframework.boot.logging.logback.StructuredLogEncoder">
	<format>${CONSOLE_LOG_STRUCTURED_FORMAT}</format>
	<charset>${CONSOLE_LOG_CHARSET}</charset>
</encoder>
```

```Log4j2
<!-- replace your PatternLayout with StructuredLogLayout -->
<StructuredLogLayout format="${sys:CONSOLE_LOG_STRUCTURED_FORMAT}" charset="${sys:CONSOLE_LOG_CHARSET}"/>
```

:::

您还可以参考 Spring Boot 中包含的默认配置：

- [**Log4j2 控制台追加器（Console Appender）**](https://github.com/spring-projects/spring-boot/tree/v3.4.3/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/log4j2/log4j2.xml)
- [**Log4j2 控制台和文件追加器（Console and File Appender）**](https://github.com/spring-projects/spring-boot/tree/v3.4.3/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/log4j2/log4j2-file.xml)

### Elastic Common Schema (ECS)

Elastic Common Schema 是一种基于 JSON 的日志格式。

要启用 Elastic Common Schema 日志格式，将相应的格式属性设置为 `ecs`：

```yaml
logging:
  structured:
    format:
      console: ecs
      file: ecs
```

一行日志看起来像这样：

```json
{"@timestamp":"2024-01-01T10:15:00.067462556Z","log.level":"INFO","process.pid":39599,"process.thread.name":"main","service.name":"simple","log.logger":"org.example.Application","message":"No active profile set, falling back to 1 default profile: \"default\"","ecs.version":"8.11"}
```

该格式还会将 MDC 中的每个键值对添加到 JSON 对象中。您还可以使用 SLF4J 流式日志 API，通过 `addKeyValue` 方法将键值对添加到记录的 JSON 对象中。

服务的值可以通过以下 `logging.structured.ecs.service` 属性进行自定义：

```yaml
logging:
  structured:
    ecs:
      service:
        name: MyService
        version: 1.0
        environment: Production
        node-name: Primary
```

> [!NOTE]
>
> 如果未指定，`logging.structured.ecs.service.name` 默认为 `spring.application.name`。

> [!NOTE]
>
> `logging.structured.ecs.service.version` 默认为 `spring.application.version`。

### Graylog 扩展日志格式 (GELF)

Graylog 扩展日志格式是一个基于 JSON 的日志格式，适用于 Graylog 日志分析平台。

要启用 Graylog 扩展日志格式，将相应的格式属性设置为 `gelf`：

```yaml
logging:
  structured:
    format:
      console: gelf
      file: gelf
```

一行日志看起来像这样：

```json
{"version":"1.1","short_message":"No active profile set, falling back to 1 default profile: \"default\"","timestamp":1725958035.857,"level":6,"_level_name":"INFO","_process_pid":47649,"_process_thread_name":"main","_log_logger":"org.example.Application"}
```

该格式还会将 MDC 中的每个键值对添加到 JSON 对象中。您还可以使用 SLF4J 流式日志 API，通过 `addKeyValue` 方法将键值对添加到记录的 JSON 对象中。

可以通过以下 `logging.structured.gelf` 属性自定义多个字段：

```yaml
logging:
  structured:
    gelf:
      host: MyService
      service:
        version: 1.0
```

> [!NOTE]
>
> 如果未指定，`logging.structured.gelf.host` 默认为 `spring.application.name`。

> [!NOTE]
>
> `logging.structured.gelf.service.version` 默认为 `spring.application.version`。

### Logstash JSON 格式

Logstash JSON 格式是基于 JSON 的日志格式。

要启用 Logstash JSON 日志格式，将相应的格式属性设置为 `logstash`：

```yaml
logging:
  structured:
    format:
      console: logstash
      file: logstash
```

一行日志看起来像这样：

```json
{"@timestamp":"2024-01-01T10:15:00.111037681+02:00","@version":"1","message":"No active profile set, falling back to 1 default profile: \"default\"","logger_name":"org.example.Application","thread_name":"main","level":"INFO","level_value":20000}
```

该格式还会将 MDC 中的每个键值对添加到 JSON 对象中。您还可以使用 SLF4J 流式日志 API，通过 `addKeyValue` 方法将键值对添加到记录的 JSON 对象中。

如果添加了标记（markers），这些标记将显示在 JSON 中的 `tags` 字符串数组中。

### 自定义结构化日志 JSON

Spring Boot 会为结构化日志输出选择合理的默认 JSON 名称和值。然而，有时您可能希望根据自己的需求对 JSON 做一些小的调整。例如，您可能想要更改一些名称，以匹配日志摄取系统的预期。您也可能希望过滤掉某些字段，因为它们对您来说没有用处。

以下属性允许您更改结构化日志 JSON 的写入方式：

| Property                                                     | Description                           |
| :----------------------------------------------------------- | :------------------------------------ |
| `logging.structured.json.include` & `logging.structured.json.exclude` | Filters specific paths from the JSON  |
| `logging.structured.json.rename`                             | Renames a specific member in the JSON |
| `logging.structured.json.add`                                | Adds additional members to the JSON   |

例如，以下配置将排除 `log.level`，将 `process.id` 重命名为 `procid`，并添加一个固定的 `corpname` 字段：

```yaml
logging:
  structured:
    json:
      exclude: log.level
      rename:
        process.id: procid
      add:
        corpname: mycorp
```

> [!TIP]
>
> 对于更高级的自定义，您可以编写自己的类，实现 `StructuredLoggingJsonMembersCustomizer` 接口，并通过 `logging.structured.json.customizer` 属性声明它。您还可以通过在 `META-INF/spring.factories` 文件中列出它们的实现来声明。

### 支持其他结构化日志格式

Spring Boot 的结构化日志支持是可扩展的，允许您定义自己的自定义格式。为此，您需要实现 `StructuredLogFormatter` 接口。使用 Logback 时，泛型类型参数必须是 `ILoggingEvent`，使用 Log4j2 时必须是 `LogEvent`（这意味着您的实现与特定的日志系统绑定）。然后，您的实现将被调用，传入日志事件并返回要记录的字符串，如下例所示：

```java
import ch.qos.logback.classic.spi.ILoggingEvent;

import org.springframework.boot.logging.structured.StructuredLogFormatter;

class MyCustomFormat implements StructuredLogFormatter<ILoggingEvent> {

	@Override
	public String format(ILoggingEvent event) {
		return "time=" + event.getInstant() + " level=" + event.getLevel() + " message=" + event.getMessage() + "\n";
	}

}
```

如示例所示，您可以返回任何格式，格式不一定是 JSON。

要启用您的自定义格式，将属性 `logging.structured.format.console` 或 `logging.structured.format.file` 设置为您实现的完全限定类名。

您的实现可以使用一些构造函数参数，这些参数会被自动注入。有关更多详细信息，请参见 `StructuredLogFormatter` 的 JavaDoc。

## Logback 扩展

Spring Boot 包含了一些 Logback 的扩展，可以帮助进行高级配置。您可以在 `logback-spring.xml` 配置文件中使用这些扩展。

> [!NOTE]
>
> 由于标准的 `logback.xml` 配置文件加载得太早，因此无法在其中使用扩展。您需要使用 `logback-spring.xml`，或者定义 `logging.config` 属性。

> [!WARNING]
>
> 这些扩展不能与 Logback 的配置扫描一起使用。如果尝试这样做，在更改配置文件时，日志中可能会出现类似以下的错误：
>
> ```
> ERROR in ch.qos.logback.core.joran.spi.Interpreter@4:71 - no applicable action for [springProperty], current ElementPath is [[configuration][springProperty]]
> ERROR in ch.qos.logback.core.joran.spi.Interpreter@4:71 - no applicable action for [springProfile], current ElementPath is [[configuration][springProfile]]
> ```

### 特定于 Profile 的配置

`<springProfile>` 标签允许您根据活动的 Spring 配置文件（profile）可选地包含或排除配置部分。Profile 配置部分可以放置在 `<configuration>` 元素的任何位置。使用 `name` 属性指定适用该配置的 profile。`<springProfile>` 标签可以包含一个 profile 名称（例如 `staging`），或者一个 profile 表达式。Profile 表达式允许表达更复杂的 profile 逻辑，例如：`production & (eu-central | eu-west)`更多详细信息，请参考 Spring Framework 参考指南。以下示例展示了三个 profile 配置：

```xml
<springProfile name="staging">
	<!-- configuration to be enabled when the "staging" profile is active -->
</springProfile>

<springProfile name="dev | staging">
	<!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</springProfile>

<springProfile name="!production">
	<!-- configuration to be enabled when the "production" profile is not active -->
</springProfile>
```

### 环境属性

`<springProperty>` 标签允许您将 Spring 环境（Spring Environment）中的属性暴露给 Logback 配置使用。如果您希望在 Logback 配置中访问 `application.properties` 文件中的值，这将非常有用。该标签的工作方式类似于 Logback 的标准 `<property>` 标签。但不同的是，它不是直接指定一个值，而是从 Spring 环境中获取属性值。如果您希望将属性存储到本地作用域以外的地方，可以使用 `scope` 属性。如果环境中未设置该属性，并希望提供一个默认值，可以使用 `defaultValue` 属性。以下示例展示了如何在 Logback 中暴露环境属性：

```xml
<springProperty scope="context" name="fluentHost" source="myapp.fluentd.host"
		defaultValue="localhost"/>
<appender name="FLUENT" class="ch.qos.logback.more.appenders.DataFluentAppender">
	<remoteHost>${fluentHost}</remoteHost>
	...
</appender>
```

> [!NOTE]
>
> 来源必须使用短横线命名法（kebab case）（例如 `my.property-name`）。然而，属性可以按照宽松规则添加到环境中。

## Log4j2 扩展

Spring Boot 包含许多 Log4j2 的扩展，这些扩展有助于进行高级配置。您可以在任何 `log4j2-spring.xml` 配置文件中使用这些扩展。

> [!NOTE]
>
> 由于标准的 `log4j2.xml` 配置文件加载过早，因此无法在其中使用扩展。您需要使用 `log4j2-spring.xml` 或定义 `logging.config` 属性。

> [!WARNING]
>
> 这些扩展取代了 Log4j 提供的 Spring Boot 支持。您应确保不要在构建中包含 `org.apache.logging.log4j:log4j-spring-boot` 模块。

### 基于 Profile 的特定配置

`<SpringProfile>` 标签允许您根据活动的 Spring 配置文件（Profile）选择性地包含或排除配置部分。Profile 片段可以放在 `<Configuration>` 元素的任何位置。使用 `name` 属性指定哪些 Profile 可以接受该配置。`<SpringProfile>` 标签可以包含一个 Profile 名称（例如 `staging`），也可以包含一个 Profile 表达式。

Profile 表达式允许表达更复杂的逻辑，例如：`production & (eu-central | eu-west)`更多详细信息，请参考 Spring Framework 官方文档。以下示例展示了三个不同的 Profile 配置：

```xml
<SpringProfile name="staging">
	<!-- configuration to be enabled when the "staging" profile is active -->
</SpringProfile>

<SpringProfile name="dev | staging">
	<!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</SpringProfile>

<SpringProfile name="!production">
	<!-- configuration to be enabled when the "production" profile is not active -->
</SpringProfile>
```

### 环境属性查找

如果您希望在 Log4j2 配置中引用 Spring 环境（Spring Environment）中的属性，可以使用 `spring:` 前缀进行查找。
这样做可以方便地在 Log4j2 配置中访问 `application.properties` 文件中的值。

以下示例展示了如何设置名为 `applicationName` 和 `applicationGroup` 的 Log4j2 属性，它们分别从 Spring 环境中读取 `spring.application.name` 和 `spring.application.group`：

```xml
<Properties>
	<Property name="applicationName">${spring:spring.application.name}</Property>
	<Property name="applicationGroup">${spring:spring.application.group}</Property>
</Properties>
```

> [!NOTE]
>
> 查找键应使用短横线命名法（kebab case），例如 `my.property-name`。

### Log4j2 系统属性

Log4j2 支持许多系统属性，可用于配置不同的项。例如，`log4j2.skipJansi` 系统属性可用于配置 ConsoleAppender 是否会尝试在 Windows 上使用 Jansi 输出流。

所有在 Log4j2 初始化后加载的系统属性都可以从 Spring 环境中获取。例如，您可以将 `log4j2.skipJansi=false` 添加到 `application.properties` 文件中，以使 ConsoleAppender 在 Windows 上使用 Jansi。

> [!NOTE]
>
> Spring 环境只有在系统属性和操作系统环境变量没有包含正在加载的值时才会被考虑。

> [!WARNING]
>
> 在 Log4j2 初始化的早期阶段加载的系统属性无法引用 Spring 环境。例如，Log4j2 用于允许选择默认 Log4j2 实现的属性，在 Spring 环境可用之前就已被使用，因此不能在此阶段引用 Spring 环境。

