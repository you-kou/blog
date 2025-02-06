# Maven 坐标

POM 包含了项目所需的所有信息，以及在构建过程中需要使用的插件配置。它是“谁”、“什么”和“哪里”的声明性体现，而构建生命周期则对应“何时”和“如何”。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>my-project</artifactId>
  <version>1.0</version>
</project>
```

上面定义的 POM 是 Maven 允许的最基本形式。`groupId:artifactId:version` 是必填字段（尽管如果它们继承自父 POM，则不需要显式定义）。这三个字段类似于地址和时间戳的结合。它标识了存储库中的一个特定位置，就像是 Maven 项目的坐标系统一样：

- `groupId`：通常在一个组织或项目中是唯一的。例如，所有核心的 Maven 工件（或者说应该）都位于 `groupId` 为 `org.apache.maven` 下。`groupId` 不一定使用点分符号，例如，JUnit 项目就是一个例子。需要注意的是，带点的 `groupId` 不必与项目中的包结构对应，尽管遵循这种做法是个好习惯。当存储在存储库中时，`groupId` 类似于操作系统中 Java 包结构的表现形式。点会被操作系统特定的目录分隔符（例如 Unix 系统中的 '/'）所替代，从而形成从基准存储库开始的相对目录结构。在给出的示例中，`org.codehaus.mojo` 组会存储在目录 `$M2_REPO/org/codehaus/mojo` 中。
- `artifactId` ：通常是项目的名称，代表了项目在 Maven 中的唯一标识。尽管 `groupId` 也很重要，但在团队讨论中，成员们很少会提及 `groupId`（因为它通常是相同的，例如 MojoHaus 项目的 `groupId` 是 `org.codehaus.mojo`）。`artifactId` 和 `groupId` 一起构成了一个键，用来唯一标识该项目，确保它与世界上其他任何项目都不同（至少应该是这样）。与 `groupId` 一起，`artifactId` 完全定义了该工件在仓库中的相对路径。以上面的项目为例，`my-project` 存储在 `$M2_REPO/org/codehaus/mojo/my-project` 目录下。
- `version` ：是命名中的最后一部分。`groupId:artifactId` 表示一个项目，但它并未指出我们讨论的是该项目的哪个版本。我们是想要 2018 年的 `junit:junit`（版本 4.12），还是 2007 年的版本（3.8.2）？简而言之：代码会发生变化，这些变化需要版本控制，而 `version` 元素用于确保这些版本的一致性。它还在工件的仓库中，用来区分不同的版本。例如，`my-project` 的 1.0 版本文件存储在 `$M2_REPO/org/codehaus/mojo/my-project/1.0` 目录结构下。

上述三个元素指向一个项目的特定版本，告诉 Maven 我们在处理哪个项目，以及我们希望在软件生命周期中的哪个阶段使用它们。