# Maven 坐标

上面定义的 POM 是 Maven 允许的最低要求。`groupId`、`artifactId` 和 `version` 是所有项目必须的字段（尽管如果从父 POM 继承，它们可以不显式定义——关于继承的更多内容后续介绍）。这三个字段类似于地址和时间戳的结合体，标记了存储库中的特定位置，并作为 Maven 项目的坐标系统：

- **groupId（组 ID）**：通常在一个组织或项目中是唯一的。例如，所有核心 Maven 组件的 `groupId` 都是 `org.apache.maven`。`groupId` 不一定要使用点符号表示，例如 `junit` 项目就没有点分隔。需要注意的是，`groupId` 并不一定与项目的 Java 包结构一致，但最好保持一致。当存储在 Maven 仓库中时，它的作用类似于 Java 的包结构。点符号会被操作系统特定的目录分隔符替换（如 Unix 系统中的 `/`），形成相对于仓库根目录的路径。例如，`org.codehaus.mojo` 这个 `groupId` 在仓库中的路径是 `$M2_REPO/org/codehaus/mojo`。
- **artifactId（构件 ID）**：通常是项目的名称。尽管 `groupId` 也很重要，但在同一个组织内部，人们通常不会提到 `groupId`（例如，MojoHaus 项目下的所有构件 `groupId` 都是 `org.codehaus.mojo`）。`artifactId` 结合 `groupId` 形成唯一的标识符，以区分世界上所有的项目。在存储库中，`artifactId` 也是构件路径的一部分。例如，`my-project` 在仓库中的存储路径为 `$M2_REPO/org/codehaus/mojo/my-project`。
- **version（版本）**：这是命名系统中的最后一部分。`groupId:artifactId` 仅仅标识了一个项目，但它并不能说明具体是哪一个版本。例如，我们需要 `junit:junit` 2018 年的版本（4.12），还是 2007 年的版本（3.8.2）？代码在不断变化，这些变化需要进行版本管理，而 `version` 这个字段就是用来管理这些版本的。在存储库中，它还用于区分不同版本的构件。例如，`my-project` 1.0 版本的文件存储在 `$M2_REPO/org/codehaus/mojo/my-project/1.0` 目录下。

这三个元素（`groupId`、`artifactId`、`version`）共同指向了项目的特定版本，使 Maven 知道项目的身份以及处于其生命周期的哪个阶段。