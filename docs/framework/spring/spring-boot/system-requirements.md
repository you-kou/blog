# 系统要求

Spring Boot 3.4.2 至少需要 Java 17，并兼容最高至 Java 23 的版本。同时，还需要 Spring Framework 6.2.2 或更高版本。

明确支持以下构建工具：

| 构建工具 | 版本                                              |
| :------- | :------------------------------------------------ |
| Maven    | 3.6.3 or later                                    |
| Gradle   | Gradle 7.x (7.6.4 or later) or 8.x (8.4 or later) |

## Servlet 容器

Spring Boot 支持以下嵌入式 Servlet 容器：

| 名字                           | Servlet 版本 |
| :----------------------------- | :----------- |
| Tomcat 10.1 (10.1.25 or later) | 6.0          |
| Jetty 12.0                     | 6.0          |
| Undertow 2.3                   | 6.0          |

您还可以将 Spring Boot 应用部署到任何兼容 Servlet 5.0+ 的容器中。

## GraalVM 原生镜像

Spring Boot 应用可以使用 GraalVM 22.3 或更高版本转换为原生镜像。

可以使用 GraalVM 提供的 native-image 工具，或 Gradle/Maven 插件中的原生构建工具来创建镜像。您还可以使用 native-image Paketo 构建包来创建原生镜像。

支持以下版本：

| 名字               | Version |
| :----------------- | :------ |
| GraalVM Community  | 22.3    |
| Native Build Tools | 0.10.4  |