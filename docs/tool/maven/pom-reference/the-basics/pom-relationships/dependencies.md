# 依赖

POM 的核心是其依赖列表。大多数项目在构建和运行时都依赖于其他项目。如果 Maven 只为你管理这个依赖列表，那你已经获得了很多。Maven 会在编译时下载并链接这些依赖，也会在其他需要依赖的目标执行时进行管理。更棒的是，Maven 会自动处理这些依赖的依赖（传递依赖），让你的依赖列表只关注项目所需的直接依赖。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  ...
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <type>jar</type>
      <scope>test</scope>
      <optional>true</optional>
    </dependency>
    ...
  </dependencies>
  ...
</project>
```

- **groupId**, **artifactId**, **version**:

  你将经常看到这些元素。这三者用于计算特定项目在某一时刻的 Maven 坐标，标定它作为当前项目的依赖。此计算的目的是选择一个匹配所有依赖声明的版本（由于传递依赖，同一个工件可能会有多个依赖声明）。这些值应该是：

  - **groupId**, **artifactId**: 直接对应依赖的坐标，
  - **version**: 一个用于计算依赖项有效版本的依赖版本规范。
  
  由于依赖项是通过 Maven 坐标来描述的，你可能会想：“这意味着我的项目只能依赖于 Maven 工件！” 答案是：“当然，但这其实是一件好事。” 这强制要求你只能依赖 Maven 能够管理的依赖项。

- **classifier**

  **classifier** 用于区分从同一个 POM 构建出来但内容不同的构件。它是一个可选的、任意的字符串 —— 如果存在，它会被附加到构件名称的版本号后面。

  以此为背景，考虑一个项目，它同时提供一个面向 Java 11 的构件，同时也提供一个仍然支持 Java 1.8 的构件。第一个构件可以加上 **jdk11** 作为 **classifier**，而第二个则使用 **jdk8**，这样客户端可以选择使用哪个版本。
  
  例如：
  
  - `my-project-1.0-jdk11.jar`
  - `my-project-1.0-jdk8.jar`
  
  另一个常见的 **classifier** 用法是将附加构件附加到项目的主构件上。如果你浏览 Maven 中央仓库，你会注意到 **classifier** `sources` 和 `javadoc` 被用来将项目的源代码和 API 文档与打包后的类文件一起发布。
  
  例如，一个项目可能包含以下构件：
  
  - `my-project-1.0.jar`：这是主构件，包含编译后的类文件。
  - `my-project-1.0-sources.jar`：包含项目的源代码。
  - `my-project-1.0-javadoc.jar`：包含项目的 API 文档。
  
  通过这种方式，项目的主构件可以与其源代码和文档一起分发，方便开发人员访问和使用。这种方法通常用于提供完整的开发和文档支持。

- **type**

  这与所选的依赖类型相对应，默认值为 `jar`。虽然它通常表示依赖项文件名中的扩展名，但并不总是如此：类型可以映射到不同的扩展名和 **classifier**。类型通常与所使用的打包方式对应，尽管这也并非总是如此。

- **scope**

  这个元素指的是当前任务（如编译和运行时、测试等）的类路径，以及如何限制依赖的传递性。Maven 提供了五种作用域：
  
  - **compile** - 这是默认作用域，当没有指定作用域时使用。编译依赖项在所有类路径中都可用，并且这些依赖项会传递到依赖的项目。
  
  - **provided** - 类似于 compile，但表示你期望 JDK 或容器在运行时提供该依赖项。它仅在编译和测试类路径中可用，不会传递。
  
  - **runtime** - 这个作用域表示依赖项在编译时不需要，但在执行时需要。它存在于运行时和测试类路径中，但不在编译类路径中。
  
  - **test** - 这个作用域表示依赖项对应用程序的正常使用不必要，仅在测试编译和执行阶段可用。它不会传递。
  
  - **system** - 这个作用域类似于 provided，但要求你显式地提供包含该依赖的 JAR 文件。该构件始终可用，并且不会在仓库中查找。

- **systemPath**

  只有在依赖作用域为 **system** 时，这个元素才会被使用。

- **optional**

  当该项目本身作为依赖时，使用 **optional** 标记一个依赖项为可选。例如，假设项目 A 依赖于项目 B 来编译某部分代码，而这部分代码在运行时可能不被使用，那么在整个项目中我们可能不需要项目 B。因此，如果项目 X 将项目 A 作为它的依赖项，Maven 就不需要安装项目 B。
  
  用符号表示，假设 `=>` 表示一个必需的依赖，而 `-->` 表示可选依赖，尽管在构建 A 时可能是 A => B，但在构建 X 时，情况则是 X => A --> B。
  
  简单来说，**optional** 让其他项目知道，在使用这个项目时，你并不需要这个依赖才能正常工作。