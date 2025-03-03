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