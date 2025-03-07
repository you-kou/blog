# 查询方法

标准的 CRUD 功能存储库通常需要在底层数据存储上执行查询。使用 Spring Data，声明这些查询的过程通常包括以下四个步骤：

1. 声明一个接口，使其扩展 `Repository` 或其子接口之一，并指定其应处理的领域类和 ID 类型，如下例所示：

    ```java
    interface PersonRepository extends Repository<Person, Long> { … }
    ```

2. 在接口上声明查询方法。

    ```java
    interface PersonRepository extends Repository<Person, Long> {
      List<Person> findByLastname(String lastname);
    }
    ```

3. 设置 Spring 以使用 JavaConfig 或 XML 配置为这些接口创建代理实例。

    ```java
    import org.springframework.data.….repository.config.EnableJpaRepositories;
    
    @EnableJpaRepositories
    class Config { … }
    ```

    在此示例中，使用了 JPA 命名空间。如果您在其他存储中使用存储库抽象，则需要将其更改为相应存储模块的命名空间声明。换句话说，您应该将 `jpa` 替换为适合您存储的选项，例如 `mongodb`。

    请注意，JavaConfig 版本默认不会显式配置包，因为它默认使用带有注解的类所在的包。要自定义要扫描的包，可以使用数据存储特定存储库的 `@EnableJpaRepositories` 注解的 `basePackage...` 属性之一。

4. 注入存储库实例并使用它，如下例所示：

    ```java
    class SomeClient {
    
      private final PersonRepository repository;
    
      SomeClient(PersonRepository repository) {
        this.repository = repository;
      }
    
      void doSomething() {
        List<Person> persons = repository.findByLastname("Matthews");
      }
    }
    ```

