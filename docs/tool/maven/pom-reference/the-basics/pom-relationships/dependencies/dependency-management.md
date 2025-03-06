# 依赖管理

依赖项可以在 `dependencyManagement` 部分进行管理，以影响那些没有完全限定的依赖的解析，或者强制使用特定的传递依赖版本。

## `dependencyManagement` 和 `dependencies`

`dependencyManagement` 和 `dependencies` 都是在 Maven 的 POM 文件中定义项目依赖的部分，但它们的作用有所不同：

### **`dependencies`**:

- **作用**：用于定义项目所需要的直接依赖。
- **定义**：在 `dependencies` 中列出的每个依赖都会在构建时被引入，并且这些依赖会被自动下载并使用。
- **作用范围**：依赖会被传递给当前项目及其子模块（在多模块项目中）。这些依赖是“直接依赖”。
- **使用场景**：如果一个项目直接使用某个库（例如：你的项目中使用了 `JUnit` 进行测试），则应将其列在 `dependencies` 部分。

示例：

```
xml复制编辑<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>5.3.9</version>
    </dependency>
</dependencies>
```

###  **`dependencyManagement`**:

- **作用**：用于集中管理依赖版本和其他配置，但不会直接引入依赖。
- **定义**：在 `dependencyManagement` 中列出的依赖不会直接添加到构建中，只有在子模块中显式声明时才会使用该版本和配置。
- **作用范围**：主要用于父 POM 文件中，用于定义子模块使用的依赖版本、范围和其他配置的标准。这有助于简化和集中管理多模块项目中的版本。
- **使用场景**：当你想在多个子模块中统一管理依赖版本时使用 `dependencyManagement`，而不需要在每个子模块中都显式声明版本号。

示例：

```
xml复制编辑<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.3.9</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 主要区别：

- **直接影响构建**：`dependencies` 会直接将依赖添加到项目的构建路径中，而 `dependencyManagement` 只定义了版本和其他配置，实际依赖需要在 `dependencies` 中显式声明。
- **使用场景**：`dependencyManagement` 主要用于父 POM 中集中管理版本，而 `dependencies` 用于具体的项目或模块中列出依赖。

简单来说，`dependencyManagement` 主要是为了版本和配置的管理，而 `dependencies` 则是实际的依赖声明。