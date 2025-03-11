# 创建仓库实例

本节介绍如何为定义的仓库接口创建实例和 Bean 定义。

## Java 配置

在 Java 配置类上使用特定于存储的 `@EnableJpaRepositories` 注解，以定义用于激活仓库的配置。
有关基于 Java 的 Spring 容器配置的介绍，请参阅 Spring 参考文档中的 JavaConfig。

启用 Spring Data 仓库的示例配置如下所示：

```java
@Configuration
@EnableJpaRepositories("com.acme.repositories")
class ApplicationConfiguration {

  @Bean
  EntityManagerFactory entityManagerFactory() {
    // …
  }
}
```

> [!NOTE]
>
> 前面的示例使用了 JPA 特定的注解，您需要根据实际使用的存储模块进行更改。EntityManagerFactory bean 的定义也是如此。请参阅相关存储模块的配置部分以获取详细信息。

## XML 配置

每个 Spring Data 模块都包含一个 `<repositories>` 元素，该元素允许您定义一个基础包，Spring 会自动扫描该包，如下示例所示：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns:beans="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns="http://www.springframework.org/schema/data/jpa"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/data/jpa
    https://www.springframework.org/schema/data/jpa/spring-jpa.xsd">

  <jpa:repositories base-package="com.acme.repositories" />

</beans:beans>
```

在上面的示例中，Spring 被指示扫描 `com.acme.repositories` 及其所有子包，以查找扩展 `Repository` 或其子接口的接口。对于找到的每个接口，Spring 基础设施都会注册特定于持久化技术的 `FactoryBean`，以创建适当的代理来处理查询方法的调用。每个 bean 都会根据接口名称派生出一个 bean 名称，例如 `UserRepository` 接口将被注册为 `userRepository`。对于嵌套的存储库接口，bean 名称会以其封闭类型的名称作为前缀。`base-package` 属性允许使用通配符，以便定义要扫描的包模式。

## 使用过滤器

默认情况下，基础设施会扫描配置的基础包下的所有扩展了特定持久化技术 `Repository` 子接口的接口，并为其创建 bean 实例。然而，您可能希望对哪些接口被实例化为 bean 进行更精细的控制。要实现这一点，可以在 `repository` 声明内部使用 `filter` 元素。其语义与 Spring 组件过滤器中的元素完全相同。有关详细信息，请参阅 Spring 参考文档中的相关内容。

例如，要排除某些接口，使其不被实例化为存储库 bean，可以使用以下配置：

```java
@Configuration
@EnableJpaRepositories(basePackages = "com.acme.repositories",
    includeFilters = { @Filter(type = FilterType.REGEX, pattern = ".*SomeRepository") },
    excludeFilters = { @Filter(type = FilterType.REGEX, pattern = ".*SomeOtherRepository") })
class ApplicationConfiguration {

  @Bean
  EntityManagerFactory entityManagerFactory() {
    // …
  }
}
```

上述示例包含所有以 `SomeRepository` 结尾的接口，并排除以 `SomeOtherRepository` 结尾的接口，使其不会被实例化。

## 独立使用

您也可以在 Spring 容器之外使用仓库基础设施，例如在 CDI 环境中。您仍然需要将一些 Spring 库添加到类路径中，但通常，您也可以通过编程方式设置仓库。提供仓库支持的 Spring Data 模块随附了特定持久化技术的 RepositoryFactory，您可以按照以下方式使用它：

```java
RepositoryFactorySupport factory = … // Instantiate factory here
UserRepository repository = factory.getRepository(UserRepository.class);
```

