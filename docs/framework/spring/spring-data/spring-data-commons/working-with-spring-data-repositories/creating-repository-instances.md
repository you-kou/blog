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

