# 使用 @Bean 注解

`@Bean` 是一个方法级别的注解，直接对应于 XML 配置中的 `<bean/>` 元素。该注解支持 `<bean/>` 提供的一些属性，例如：

- `init-method`
- `destroy-method`
- 自动装配（autowiring）
- `name`

你可以在标注了 `@Configuration` 或 `@Component` 的类中使用 `@Bean` 注解。

## 声明一个 Bean

要声明一个 Bean，可以使用 `@Bean` 注解方法。你可以使用该方法在 `ApplicationContext` 中注册一个 Bean，其类型由方法的返回值指定。默认情况下，Bean 的名称与方法名称相同。以下示例展示了一个 `@Bean` 方法的声明：

```java
@Configuration
public class AppConfig {

	@Bean
	public TransferServiceImpl transferService() {
		return new TransferServiceImpl();
	}
}
```

上述配置与以下 Spring XML 配置完全等价：

```xml
<beans>
	<bean id="transferService" class="com.acme.TransferServiceImpl"/>
</beans>
```

这两种声明都会在 `ApplicationContext` 中创建一个名为 `transferService` 的 bean，并绑定到 `TransferServiceImpl` 类型的对象实例，如下所示：

```txt
transferService -> com.acme.TransferServiceImpl
```

您还可以使用默认方法（default methods）来定义 Bean。这样可以通过实现包含默认方法 Bean 定义的接口来组合 Bean 配置。

```java
public interface BaseConfig {

	@Bean
	default TransferServiceImpl transferService() {
		return new TransferServiceImpl();
	}
}

@Configuration
public class AppConfig implements BaseConfig {

}
```

您还可以使用接口（或基类）作为 @Bean 方法的返回类型进行声明，如下例所示：

```java
@Configuration
public class AppConfig {

	@Bean
	public TransferService transferService() {
		return new TransferServiceImpl();
	}
}
```

然而，这会将高级类型预测的可见性限制为指定的接口类型（TransferService）。完整类型（TransferServiceImpl）只有在受影响的单例 Bean 被实例化后，容器才能识别。非懒加载的单例 Bean 会按照声明顺序进行实例化，因此，当其他组件尝试按未声明的类型匹配（例如 `@Autowired TransferServiceImpl`，它仅在 `transferService` Bean 被实例化后才能解析）时，可能会出现不同的类型匹配结果。

> [!TIP]
>
> 如果您始终通过声明的服务接口引用您的类型，那么您的 `@Bean` 返回类型可以安全地遵循这一设计决策。然而，对于实现多个接口的组件，或者可能通过其实现类型引用的组件，最好声明尽可能具体的返回类型（至少要与引用该 Bean 的注入点所需的类型一样具体）。

## Bean 依赖关系

带有 `@Bean` 注解的方法可以具有任意数量的参数，这些参数描述了构建该 Bean 所需的依赖项。例如，如果我们的 `TransferService` 需要一个 `AccountRepository`，我们可以通过方法参数来实现该依赖关系，如下示例所示：

```java
@Configuration
public class AppConfig {

	@Bean
	public TransferService transferService(AccountRepository accountRepository) {
		return new TransferServiceImpl(accountRepository);
	}
}
```

解析机制与基于构造函数的依赖注入基本相同。有关详细信息，请参阅相关章节。

## 接收生命周期回调

使用 @Bean 注解定义的任何类都支持常规生命周期回调，并且可以使用 JSR-250 中的 @PostConstruct 和 @PreDestroy 注解。有关详细信息，请参见 JSR-250 注解。

常规的 Spring 生命周期回调也完全支持。如果一个 bean 实现了 InitializingBean、DisposableBean 或 Lifecycle 接口，它们各自的方法会被容器调用。

标准的 `*Aware` 接口集（如 BeanFactoryAware、BeanNameAware、MessageSourceAware、ApplicationContextAware 等）也得到了完全支持。

@Bean 注解支持指定任意的初始化和销毁回调方法，类似于 Spring XML 中 bean 元素的 init-method 和 destroy-method 属性，示例如下：

```java
public class BeanOne {

	public void init() {
		// initialization logic
	}
}

public class BeanTwo {

	public void cleanup() {
		// destruction logic
	}
}

@Configuration
public class AppConfig {

	@Bean(initMethod = "init")
	public BeanOne beanOne() {
		return new BeanOne();
	}

	@Bean(destroyMethod = "cleanup")
	public BeanTwo beanTwo() {
		return new BeanTwo();
	}
}
```

> [!NOTE]
>
> 默认情况下，通过 Java 配置定义的 bean 如果具有公共的 `close` 或 `shutdown` 方法，会自动注册一个销毁回调。如果您的 bean 具有公共的 `close` 或 `shutdown` 方法，并且不希望它在容器关闭时被调用，可以在 bean 定义中添加 `@Bean(destroyMethod = "")`，以禁用默认（推断的）模式。
>
> 对于通过 JNDI 获取的资源，您可能默认需要这样做，因为其生命周期由应用程序外部管理。特别是对于 `DataSource`，请务必这样做，因为在 Jakarta EE 应用服务器上，它已知可能会引发问题。
>
> 以下示例展示了如何防止 `DataSource` 触发自动销毁回调：
>
> ```java
> @Bean(destroyMethod = "")
> public DataSource dataSource() throws NamingException {
> 	return (DataSource) jndiTemplate.lookup("MyDS");
> }
> ```
>
> 此外，在 `@Bean` 方法中，通常使用**编程方式**进行 JNDI 查找，可以使用 Spring 提供的 `JndiTemplate` 或 `JndiLocatorDelegate` 辅助类，或者直接使用 JNDI 的 `InitialContext`。但**不要使用** `JndiObjectFactoryBean` 变体，因为它会强制您将返回类型声明为 `FactoryBean`，而不是实际的目标类型，这将导致在其他 `@Bean` 方法中引用该资源时变得更加困难。

对于上面示例中的 `BeanOne`，同样可以在构造时**直接调用** `init()` 方法，如下示例所示：

```java
@Configuration
public class AppConfig {

	@Bean
	public BeanOne beanOne() {
		BeanOne beanOne = new BeanOne();
		beanOne.init();
		return beanOne;
	}

	// ...
}
```

> [!NOTE]
>
> 当直接使用 Java 编写代码时，您可以自由操作对象，而不必始终依赖容器的生命周期。

## 指定 Bean 作用域

 Spring 提供了 @Scope 注解，以便您可以指定 Bean 的作用域。

### 使用 @Scope 注解

您可以指定使用 @Bean 注解定义的 Bean 具有特定的作用域。您可以使用 Bean 作用域部分指定的任何标准作用域。

默认作用域是 singleton，但您可以使用 @Scope 注解进行覆盖，如下例所示:

```java
@Configuration
public class MyConfiguration {

	@Bean
	@Scope("prototype")
	public Encryptor encryptor() {
		// ...
	}
}
```

### @Scope 和 scoped-proxy

Spring 提供了一种通过作用域代理（scoped proxy）处理作用域依赖的便捷方式。在 XML 配置中，最简单的方法是使用 `<aop:scoped-proxy/>` 元素。在 Java 配置中，使用 @Scope 注解并结合 proxyMode 属性可以实现相同的功能。默认值为 `ScopedProxyMode.DEFAULT`，通常表示不会创建作用域代理，除非在组件扫描指令级别配置了不同的默认值。您可以指定以下模式：`ScopedProxyMode.TARGET_CLASS`（基于类的代理）、`ScopedProxyMode.INTERFACES`（基于接口的代理）、`ScopedProxyMode.NO`（不创建代理）。

如果将 XML 参考文档中的作用域代理示例（请参阅作用域代理）迁移到 Java 配置的 @Bean 方法，大致如下所示:

```java
// an HTTP Session-scoped bean exposed as a proxy
@Bean
@SessionScope
public UserPreferences userPreferences() {
	return new UserPreferences();
}

@Bean
public Service userService() {
	UserService service = new SimpleUserService();
	// a reference to the proxied userPreferences bean
	service.setUserPreferences(userPreferences());
	return service;
}
```

## 自定义 Bean 命名

默认情况下，配置类会使用 `@Bean` 方法的名称作为生成的 Bean 名称。不过，可以通过 `name` 属性覆盖此默认行为，如下例所示:

```java
@Configuration
public class AppConfig {

	@Bean("myThing")
	public Thing thing() {
		return new Thing();
	}
}
```

## Bean 别名（Aliasing）

正如 **命名 Bean** 部分所讨论的，有时希望为同一个 Bean 赋予多个名称，这通常称为 **Bean 别名**。`@Bean` 注解的 `name` 属性接受一个字符串数组，用于定义多个别名。以下示例展示了如何为一个 Bean 设置多个别名：

```java
@Configuration
public class AppConfig {

	@Bean({"dataSource", "subsystemA-dataSource", "subsystemB-dataSource"})
	public DataSource dataSource() {
		// instantiate, configure and return DataSource bean...
	}
}
```

## Bean 描述（Description）

有时，提供更详细的文本描述对于 Bean 来说是有帮助的，特别是在 Bean 通过 JMX 公开用于监控时。

要为 `@Bean` 添加描述，可以使用 `@Description` 注解，如下示例所示：

```java
@Configuration
public class AppConfig {

	@Bean
	@Description("Provides a basic example of a bean")
	public Thing thing() {
		return new Thing();
	}
}
```

