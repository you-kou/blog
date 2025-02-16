# 快速开始

本节将介绍如何开发一个简单的“Hello World!” web 应用程序，并选择 Maven 作为构建系统。

## 先决条件

在开始之前，请打开终端并运行以下命令，以确保你安装了正确版本的Java：

```sh
$ java -version
openjdk version "17.0.4.1" 2022-08-12 LTS
OpenJDK Runtime Environment (build 17.0.4.1+1-LTS)
OpenJDK 64-Bit Server VM (build 17.0.4.1+1-LTS, mixed mode, sharing)
```

> [!TIP]
>
> 官方推荐使用 [BellSoft Liberica JDK](https://bell-sw.com/pages/downloads/) 17 或 21 版本。

### Maven

运行以下命令，以确保你已经安装了 Maven：

```sh
$ mvn -v
Apache Maven 3.8.5 (3599d3414f046de2324203b78ddcf9b5e4388aa0)
Maven home: usr/Users/developer/tools/maven/3.8.5
Java version: 17.0.4.1, vendor: BellSoft, runtime: /Users/developer/sdkman/candidates/java/17.0.4.1-librca
```

> [!NOTE]
>
> 大多数现代 Java IDE 都内置支持 Maven，一般不需要单独安装 Maven。

## 使用 IDEA 创建项目

1. 设置项目基本信息。

  <img src="https://r2.code-snippet.online/md/framework/spring-boot/quick-start/setup-step1.png" style="margin:0 auto;" />

2. 由于我们正在开发 Web 应用程序，因此我们添加`spring-boot-starter-web`依赖项。

  <img src="https://r2.code-snippet.online/md/framework/spring-boot/quick-start/setup-step2.png" style="margin:0 auto;" />

3. 点击 `Finish` 完成项目创建，默认会创建一个名为`MyprojectApplication` Java 文件。

  <img src="https://r2.code-snippet.online/md/framework/spring-boot/quick-start/setup-step3.png" style="margin:0 auto;" />

## 编写代码

要完成我们的应用程序，我们需要在`MyprojectApplication`中添加一些简单的功能代码。

```java{5-6,8,12-15}
package com.example.myproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class MyprojectApplication {

    @RequestMapping("/")
    public String home() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(MyprojectApplication.class, args);
    }

}
```

### `@RestController` 和 `@RequestMapping` 注解

`MyprojectApplication` 类上的第一个注解是 `@RestController`。这是一个*stereotype* 注解（stereotype annotation）。它为阅读代码的人以及 Spring 提供了关于该类作用的提示。在这种情况下，我们的类是一个 Web 控制器 (`@Controller`)，因此 Spring 会在处理传入的 Web 请求时考虑该类。

`@RequestMapping` 注解提供了“路由”信息。它告诉 Spring，任何带有 `/` 路径的 HTTP 请求都应该映射到 `home` 方法。`@RestController` 注解则告诉 Spring 将返回的字符串直接渲染并返回给调用者。

> [!NOTE]
>
> `@RestController` 和 `@RequestMapping` 注解是 Spring MVC 注解（它们并不限于 Spring Boot）。

### `@SpringBootApplication` 注解

第二个类级别的注解是 `@SpringBootApplication`。这个注解被称为元注解，它结合了 `@SpringBootConfiguration`、`@EnableAutoConfiguration` 和 `@ComponentScan` 注解。

在这些注解中，我们最感兴趣的是 `@EnableAutoConfiguration`。`@EnableAutoConfiguration` 告诉 Spring Boot 根据你添加的 jar 依赖来“猜测”你想要如何配置 Spring。由于 `spring-boot-starter-web` 添加了 Tomcat 和 Spring MVC，自动配置假设你正在开发一个 web 应用，并据此设置 Spring。

> [!CAUTION]
>
> **启动器和自动配置**
>
> 自动配置是为了与启动器（starters）配合良好而设计的，但这两个概念并不是直接关联的。你可以自由选择和使用启动器之外的 jar 依赖，Spring Boot 仍然会尽最大努力自动配置你的应用。

### “main” 方法

我们应用的最后部分是 `main` 方法。这个方法是一个标准的方法，遵循 Java 应用程序入口点的约定。我们的 `main` 方法通过调用 `SpringApplication.run()` 委托给 Spring Boot 的 `SpringApplication` 类。`SpringApplication` 启动我们的应用，启动 Spring，进而启动自动配置的 Tomcat Web 服务器。我们需要将 `MyprojectApplication.class` 作为参数传递给 `run` 方法，以告诉 `SpringApplication` 哪个是主要的 Spring 组件。`args` 数组也会被传递，以暴露任何命令行参数。

## 运行程序

此时，应用程序应该可以正常工作。点击 IDEA 的运行按钮，启动应用程序。

<img src="https://r2.code-snippet.online/md/framework/spring-boot/quick-start/application-start.png" style="margin:0 auto;" />

你应该看到类似以下的输出：

```txt
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::  (v3.4.2)
....... . . .
....... . . . (log output here)
....... . . .
........ Started MyApplication in 0.906 seconds (process running for 6.514)
```

如果您在浏览器中打开 `localhost:8080`，您应该看到以下输出：

```txt
Hello World!
```

