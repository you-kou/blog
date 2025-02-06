---
description: 本文概述了如何安装和配置 Maven，创建项目并构建它，包括使用 Maven 命令行工具执行不同的目标和阶段，最终生成可分发的 JAR 文件。
head:
  - [meta, { name: "keywords", content: "Maven 安装, Maven 项目创建, Maven 项目构建" }]
  - [meta, { property: "og:title", content: "Maven 快速开始" }]
  - [meta, { property: "og:description", content: "本文概述了如何安装和配置 Maven，创建项目并构建它，包括使用 Maven 命令行工具执行不同的目标和阶段，最终生成可分发的 JAR 文件。" }]
---

# 快速开始

## 安装

::: info 前提条件

- 安装 JDK 8 或以上版本。
- 设置 `JAVA_HOME` 环境变量指向你的 JDK 安装路径，或者确保 `java` 可执行文件已添加到 `PATH` 中。

:::

首先，从官网[下载 Maven](https://maven.apache.org/download.html)。然后，解压安装包，并将 `bin` 目录（其中包含 `mvn` 命令）添加到 `PATH` 环境变量中即可完成安装。

之后，在终端或命令提示符中输入以下内容：

```sh
mvn --version
```

输出结果应类似于：

```tex
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: D:\apache-maven-3.6.3\apache-maven\bin\..
Java version: 1.8.0_232, vendor: AdoptOpenJDK, runtime: C:\Program Files\AdoptOpenJDK\jdk-8.0.232.09-hotspot\jre
Default locale: en_US, platform encoding: Cp1250
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```

## 项目创建

你需要为项目准备一个存放位置。

先在某个位置创建一个目录，并在该目录下打开终端。然后，在命令行中执行以下 Maven 命令：

```sh
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.5 -DinteractiveMode=false
```

如果你刚安装了 Maven，第一次运行可能会花费一些时间。

命令执行成功后，你会发现 `generate` 目标创建了一个与 `artifactId` 相同名称的目录。进入该目录。

```sh
cd my-app
```

在这个目录下，你会看到以下标准的项目结构。

```tex
my-app
|-- pom.xml
`-- src
    |-- main
    |   `-- java
    |       `-- com
    |           `-- mycompany
    |               `-- app
    |                   `-- App.java
    `-- test
        `-- java
            `-- com
                `-- mycompany
                    `-- app
                        `-- AppTest.java
```

`src/main/java` 目录包含项目的源代码，`src/test/java` 目录包含项目的测试代码，`pom.xml` 文件是项目的 **项目对象模型**（POM）。

### 项目对象模型 POM

`pom.xml` 文件是 Maven 项目配置的核心。它是一个单一的配置文件，包含了构建项目所需的大部分信息，能够以你希望的方式构建项目。虽然 POM 文件非常庞大，且其复杂性可能让人望而生畏，但要有效使用它，并不需要立即理解所有的细节。

这个项目的 POM 文件应该是这样的：

::: details POM 文件
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0-SNAPSHOT</version>
  <name>my-app</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.release>17</maven.compiler.release>
  </properties>
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.junit</groupId>
        <artifactId>junit-bom</artifactId>
        <version>5.11.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-api</artifactId>
      <scope>test</scope>
    </dependency>
    <!-- Optionally: parameterized tests support -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-params</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
       ... lots of helpful plugins
    </pluginManagement>
  </build>
</project>
```
:::

### 你刚刚做了什么？

你执行了 Maven 的目标 `archetype:generate`，并为该目标传递了各种参数。

前缀 `archetype` 是提供该目标的插件。这个 `archetype:generate` 目标基于 `maven-archetype-quickstart` 原型创建了一个简单的项目。

插件，暂时可以简单理解为一组具有共同目的的目标的集合。

### 构建项目

```sh
mvn package
```

命令行将打印出各种操作，并以以下内容结束：

```txt
 ...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  2.953 s
[INFO] Finished at: 2019-11-24T13:05:10+01:00
[INFO] ------------------------------------------------------------------------
```

与第一次执行的命令（`archetype:generate`）不同，第二个命令只是一个单独的词——`package`。与目标（goal）不同，`package` 是一个 **阶段**（phase）。阶段是构建生命周期中的一个步骤，生命周期是一个有序的阶段序列。当指定一个阶段时，Maven 会执行该阶段之前的所有阶段，并包括指定的阶段。例如，如果你执行 `compile` 阶段，实际上执行的阶段是：

1. validate
2. generate-sources
3. process-sources
4. generate-resources
5. process-resources
6. compile

你可以使用以下命令来测试刚刚编译和打包好的 JAR 文件：

```sh
java -cp target/my-app-1.0-SNAPSHOT.jar com.mycompany.app.App
```

这将打印出最经典的内容：

```txt
Hello World!
```

## 运行 Maven 工具

### Maven 阶段

虽然这不是一个完整的列表，但下面这些是最常执行的默认生命周期阶段：

- **validate**：验证项目是否正确，所有必要的信息是否可用。
- **compile**：编译项目的源代码。
- **test**：使用合适的单元测试框架测试编译后的源代码。这些测试不需要代码被打包或部署。
- **package**：将编译后的代码打包成可分发格式，如 JAR 文件。
- **integration-test**：如果需要，处理并将包部署到可以运行集成测试的环境中。
- **verify**：运行任何检查以验证包的有效性并确保其符合质量标准。
- **install**：将包安装到本地仓库中，以便在其他本地项目中作为依赖使用。
- **deploy**：在集成或发布环境中执行，将最终包复制到远程仓库，与其他开发人员和项目共享。

除了上面提到的默认生命周期外，还有两个值得注意的 Maven 生命周期，它们是：

- **clean**：清理之前构建生成的产物
- **site**：为项目生成站点文档

阶段实际上是映射到底层的目标（goals）。每个阶段执行的具体目标取决于项目的打包类型。例如，如果项目类型是 JAR，`package` 阶段会执行 `jar:jar` 目标；如果项目类型是 WAR，`package` 阶段则会执行 `war:war` 目标。	

一个有趣的事情是，阶段和目标可以按顺序执行。

```sh
mvn clean dependency:copy-dependencies package
```

该命令将清理项目、复制依赖并打包项目（当然，也会执行直到 `package` 阶段的所有其他阶段）。
