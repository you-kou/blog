# 配置

本节介绍通过以下方式配置 Spring Data JPA：

- **“基于注解的配置”**（Java 配置）
- **“Spring 命名空间”**（XML 配置）

## 基于注解的配置

Spring Data JPA 仓库支持可以通过 JavaConfig 或自定义 XML 命名空间激活，如下例所示：

```java
@Configuration
@EnableJpaRepositories
@EnableTransactionManagement
class ApplicationConfig {

  @Bean
  public DataSource dataSource() {

    EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
    return builder.setType(EmbeddedDatabaseType.HSQL).build();
  }

  @Bean
  public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

    HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    vendorAdapter.setGenerateDdl(true);

    LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
    factory.setJpaVendorAdapter(vendorAdapter);
    factory.setPackagesToScan("com.acme.domain");
    factory.setDataSource(dataSource());
    return factory;
  }

  @Bean
  public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {

    JpaTransactionManager txManager = new JpaTransactionManager();
    txManager.setEntityManagerFactory(entityManagerFactory);
    return txManager;
  }
}
```

> [!NOTE]
>
> 必须创建 `LocalContainerEntityManagerFactoryBean`，而不是直接创建 `EntityManagerFactory`，因为前者除了创建 `EntityManagerFactory` 之外，还参与异常转换机制。

前面的配置类使用 `spring-jdbc` 的 `EmbeddedDatabaseBuilder` API 设置了一个嵌入式 HSQL 数据库。然后，Spring Data 设置 `EntityManagerFactory`，并使用 Hibernate 作为示例持久化提供程序。这里声明的最后一个基础组件是 `JpaTransactionManager`。最后，该示例通过 `@EnableJpaRepositories` 注解激活 Spring Data JPA 仓库，该注解的属性与 XML 命名空间基本相同。如果未配置基础包，则默认使用配置类所在的包。

## Spring 命名空间

Spring Data 的 JPA 模块包含一个自定义命名空间，允许定义仓库（repository）Bean。它还包含一些特定于 JPA 的功能和元素属性。通常，可以使用 `<repositories>` 元素来设置 JPA 仓库，如下所示：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jpa="http://www.springframework.org/schema/data/jpa"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/data/jpa
    https://www.springframework.org/schema/data/jpa/spring-jpa.xsd">

  <jpa:repositories base-package="com.acme.repositories" />

</beans>
```

> [!TIP]
>
> JavaConfig 更优还是 XML 更优？XML 曾经是 Spring 配置的主要方式。然而，在当今 Java 快速发展的时代（包括 record 类型、注解等），新项目通常尽可能使用纯 Java 配置。虽然目前没有立即移除 XML 支持的计划，但某些最新功能**可能**无法通过 XML 使用。

使用 `<repositories>` 元素时，它会为所有带有 `@Repository` 注解的 Bean 启用持久化异常转换，以便 JPA 持久化提供程序抛出的异常能够转换为 Spring 的 `DataAccessException` 层次结构。

### 自定义命名空间属性

除了 `<repositories>` 元素的默认属性外，JPA 命名空间还提供了额外的属性，使您可以更详细地控制仓库（repository）的设置：

| `entity-manager-factory-ref` | 明确指定 `EntityManagerFactory` 以用于 `repositories` 元素检测到的仓库。通常在应用程序中存在多个 `EntityManagerFactory` bean 时使用。<br/>如果未进行配置，Spring Data 会自动在 `ApplicationContext` 中查找名称为 `entityManagerFactory` 的 `EntityManagerFactory` bean。 |
| ---------------------------- | ------------------------------------------------------------ |
| `transaction-manager-ref`    | 明确指定 `PlatformTransactionManager` 以用于 `repositories` 元素检测到的仓库。通常仅在应用程序配置了多个事务管理器或 `EntityManagerFactory` bean 时才需要使用。<br/>默认情况下，将使用当前 `ApplicationContext` 内定义的单个 `PlatformTransactionManager`。 |

> [!NOTE]
>
> 如果未显式定义 `transaction-manager-ref`，Spring Data JPA 需要在应用程序上下文中存在一个名为 `transactionManager` 的 `PlatformTransactionManager` Bean。

## 启动模式（Bootstrap Mode）

默认情况下，Spring Data JPA 的仓库（Repository）是 Spring Bean，它们是 **单例作用域**（singleton scoped）并 **提前初始化**（eagerly initialized）。在应用程序启动过程中，它们会与 **JPA 的 EntityManager** 交互，以进行 **验证** 和 **元数据分析**。
由于初始化 **JPA EntityManagerFactory** 可能会占用较长的启动时间，Spring 框架支持 **在后台线程中初始化** 该组件。为了 **有效利用后台初始化**，需要尽可能延迟 JPA 仓库的初始化。

从 **Spring Data JPA 2.1** 开始，可以通过 **`@EnableJpaRepositories` 注解** 或 **XML 命名空间** 配置 **`BootstrapMode`**，它有以下可选值：

- **`DEFAULT`（默认值）**：

  仓库会被 **提前初始化**，除非明确使用 `@Lazy` 注解。如果某个 Bean 需要依赖某个仓库实例，那么仓库仍然会立即初始化。

- **`LAZY`（懒加载）**：

  **所有仓库默认都是懒加载的**，并且 Spring 会为其创建 **代理对象**，以便在需要时才进行真正的初始化。如果某个 Bean **仅仅将仓库实例存储在字段中，而不立即调用它**，那么仓库不会被实例化。**第一次与仓库交互时才会初始化** 并进行验证。

- **`DEFERRED`（延迟加载）**：

  **与 `LAZY` 模式基本相同**，但在 **`ContextRefreshedEvent` 事件触发时** 进行仓库初始化。这意味着仓库会 **在应用完全启动之前进行验证**，可以避免运行时错误。

### 推荐建议

**如果不使用异步 JPA 引导（bootstrap）**，请继续使用默认的启动模式（`DEFAULT`）。

**如果使用异步 JPA 引导**，则 `DEFERRED` 是一个合理的默认选择。它确保只有在 **`EntityManagerFactory` 的设置时间比应用程序其他组件的初始化时间长** 时，Spring Data JPA 的启动过程才会等待。尽管如此，它仍然确保在应用程序启动之前，仓库会正确地初始化并验证。

**`LAZY`** 适用于 **测试场景和本地开发**。一旦你确认仓库能够正确初始化，或者在测试应用程序的其他部分时，验证所有仓库可能会 **不必要地增加启动时间**。同样，这适用于本地开发，在这种情况下，可能只需要初始化某些特定的仓库。