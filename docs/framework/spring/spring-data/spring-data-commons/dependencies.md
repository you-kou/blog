# 依赖关系

由于各个 Spring Data 模块的起始时间不同，许多模块的主版本号和次版本号也不同。为了找到兼容的版本，最简单的方法是依赖于 Spring Data Release Train BOM（版本发布列车）来定义兼容的版本。

在 Maven 项目中，您可以在 POM 文件的 `<dependencyManagement />` 部分声明这个依赖，示例如下：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.data</groupId>
      <artifactId>spring-data-bom</artifactId>
      <version>2024.1.3</version>
      <scope>import</scope>
      <type>pom</type>
    </dependency>
  </dependencies>
</dependencyManagement>
```

当前的发布列车版本是 2024.1.3。该列车版本使用 CalVer（公历版本）模式，格式为 YYYY.MINOR.MICRO。版本名称遵循以下模式：对于 GA（正式发布）版本和服务版本，版本名称为 `${calver}`。对于其他版本，版本名称遵循以下模式：${calver}-${modifier}，其中 modifier可以是以下之一：

- SNAPSHOT：当前的快照版本
- M1, M2 等：里程碑版本
- RC1, RC2 等：发布候选版本

您可以在我们的 Spring Data 示例库中找到使用 BOM 的工作示例。配置好 BOM 后，您可以在 `<dependencies />` 块中声明您想要使用的 Spring Data 模块，而无需指定版本，如下所示：

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
  </dependency>
<dependencies>
```

## Spring Boot中的依赖管理

Spring Boot 为您选择了一个较新的 Spring Data 模块版本。如果您仍然想要升级到较新的版本，可以将 `spring-data-bom.version` 属性设置为您想要使用的版本和迭代。

## Spring Framework

当前版本的 Spring Data 模块需要 Spring Framework 6.2.3 或更高版本。该模块也可能与该次版本的旧版修复版本兼容，但强烈建议使用该版本代中的最新版本。