# 打包

现在我们已经有了 `groupId:artifactId:version` 这样的地址结构，还有一个标准标签可以帮助我们更完整地定义“什么”——那就是项目的 **packaging**（打包类型）。在我们的例子中，前面提到的 `org.codehaus.mojo:my-project:1.0` 的 POM 被定义为打包成一个 JAR 文件。如果我们想将它改为 WAR 文件，可以通过声明不同的打包类型来实现：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  ...
  <packaging>war</packaging>
  ...
</project>
```

当没有声明 **packaging** 时，Maven 默认认为打包类型是 **jar**。有效的打包类型是组件角色 `org.apache.maven.lifecycle.mapping.LifecycleMapping` 的 Plexus 角色提示（role-hints）[^1]。目前，核心打包类型包括：`pom`、`jar`[^2]、`maven-plugin`、`ejb`、`war`[^3]、`ear`、`rar`。这些定义了在特定包结构的构建生命周期阶段上执行的默认目标列表。

[^1]: Plexus 角色提示是 Maven 中用于指定组件角色（role）的一种机制。Plexus 是 Maven 的一个核心框架，它负责管理和注入各种插件和组件。在 Maven 中，角色提示是通过将不同的角色（例如：插件、任务等）与特定的实现类绑定来实现的。 简单来说，角色提示 是用来标识组件的不同实现或配置的方式。当 Maven 需要加载一个组件时，它会根据 角色（role） 和 角色提示（role-hint） 找到相应的实现。通过这种方式，Maven 能够更加灵活地加载和使用插件或其他功能模块。举个例子，org.apache.maven.lifecycle.mapping.LifecycleMapping 是一个组件角色，定义了不同生命周期阶段的执行目标，而 Plexus 角色提示则是用于指定与该角色关联的实现。通过这种方式，Maven 能够根据实际需求选择合适的插件或者任务来执行。
[^2]: JAR（Java ARchive）是一个用于将多个文件（通常是 Java 类文件及相关资源）打包成一个压缩文件的格式。它是 Java 平台中的一种归档文件格式，通常用于分发 Java 程序、库、插件等。JAR 文件本质上是一个 ZIP 格式的压缩文件，但它带有 .jar 扩展名。
[^3]: WAR（Web Application Archive）是 Java EE（Enterprise Edition）中的一种归档文件格式，用于打包和分发 web 应用程序。与 JAR 文件类似，WAR 文件也是一个压缩文件，但它专门用于 web 应用。WAR 文件通常包含了运行 Web 应用所需的所有内容，并且可以直接部署到支持 Servlet 和 JSP 的服务器上，如 Apache Tomcat、Jetty 或 JBoss。
