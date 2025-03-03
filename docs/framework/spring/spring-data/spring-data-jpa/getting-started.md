# 开始使用

一种快速启动并设置工作环境的简便方法是通过 start.spring.io 创建一个基于 Spring 的项目，或者在 Spring Tools 中创建一个 Spring 项目。

## Hello World

让我们从一个简单的实体及其对应的仓库开始：

```java
@Entity
class Person {

  @Id @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String name;

  // getters and setters omitted for brevity
}

interface PersonRepository extends Repository<Person, Long> {

  Person save(Person person);

  Optional<Person> findById(long id);
}
```

创建主应用程序以运行，如下例所示：

```java
@SpringBootApplication
public class DemoApplication {

  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }

  @Bean
  CommandLineRunner runner(PersonRepository repository) {
    return args -> {

      Person person = new Person();
      person.setName("John");

      repository.save(person);
      Person saved = repository.findById(person.getId()).orElseThrow(NoSuchElementException::new);
    };
  }
}
```

即使在这个简单的示例中，也有一些值得注意的地方：

- **仓库实例会自动实现**。当作为 `@Bean` 方法的参数时，这些仓库会被自动注入，无需额外的注解。
- 基本的仓库扩展自 `Repository`。我们建议根据你的应用需求考虑暴露多少 API 接口。更复杂的仓库接口包括 `ListCrudRepository` 或 `JpaRepository`。