# 基础知识

POM（项目对象模型）包含有关项目的所有必要信息，以及在构建过程中使用的插件配置。它是“谁”（who）、“什么”（what）和“在哪里”（where）的声明性体现，而构建生命周期则对应“何时”（when）和“如何”（how）。

这并不意味着 POM 不能影响生命周期的流程——它可以。例如，通过配置 `maven-antrun-plugin`，可以在 POM 中嵌入 Apache Ant 任务。但本质上，POM 仍然是一个声明。而 `build.xml` 文件告诉 Ant 在运行时要精确执行哪些操作（过程式），POM 只是声明其配置（声明式）。如果某种外部因素导致生命周期跳过 Ant 插件的执行，它并不会影响其他已执行插件的正常运行。这与 `build.xml` 文件不同，在 `build.xml` 中，任务通常依赖于之前执行的行。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>my-project</artifactId>
  <version>1.0</version>
</project>
```

