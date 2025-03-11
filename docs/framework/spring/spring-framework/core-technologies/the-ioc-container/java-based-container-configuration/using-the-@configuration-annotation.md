# 使用 `@Configuration` 注解

`@Configuration` 是一个类级别的注解，表示该类是一个 bean 定义的来源。`@Configuration` 类通过 `@Bean` 注解的方法声明 bean。在 `@Configuration` 类中，`@Bean` 方法之间的调用也可用于定义 bean 之间的依赖关系。有关 `@Bean` 和 `@Configuration` 的基本概念，请参考 **Basic Concepts: @Bean and @Configuration**。

## 注入 Bean 之间的依赖关系

当一个 bean 依赖于另一个 bean 时，可以通过在一个 `@Bean` 方法中调用另一个 `@Bean` 方法来表达这种依赖关系，如下示例所示：

```java
@Configuration
public class AppConfig {

	@Bean
	public BeanOne beanOne() {
		return new BeanOne(beanTwo());
	}

	@Bean
	public BeanTwo beanTwo() {
		return new BeanTwo();
	}
}
```

在上述示例中，`beanOne` 通过构造函数注入的方式接收 `beanTwo` 的引用。

> [!NOTE]
>
> 这种声明 Bean 之间依赖关系的方法 **仅在 `@Configuration` 类中** 生效。你 **不能** 通过普通的 `@Component` 类来声明 Bean 之间的依赖关系。

## 查找方法注入

查找方法注入（Lookup Method Injection）是一种高级特性，通常应谨慎使用。它适用于单例作用域（singleton）的 Bean 依赖于原型作用域（prototype）的 Bean 的情况。使用 Java 进行此类配置提供了一种自然的实现方式。以下示例展示了如何使用查找方法注入：

```java
public abstract class CommandManager {
	public Object process(Object commandState) {
		// grab a new instance of the appropriate Command interface
		Command command = createCommand();
		// set the state on the (hopefully brand new) Command instance
		command.setState(commandState);
		return command.execute();
	}

	// okay... but where is the implementation of this method?
	protected abstract Command createCommand();
}
```

通过 Java 配置，您可以创建 `CommandManager` 的子类，并覆盖其中的抽象方法 `createCommand()`，使其能够查找一个新的（原型作用域的）命令对象。以下示例展示了如何实现这一点：

```java
@Bean
@Scope("prototype")
public AsyncCommand asyncCommand() {
	AsyncCommand command = new AsyncCommand();
	// inject dependencies here as required
	return command;
}

@Bean
public CommandManager commandManager() {
	// return new anonymous implementation of CommandManager with createCommand()
	// overridden to return a new prototype Command object
	return new CommandManager() {
		protected Command createCommand() {
			return asyncCommand();
		}
	}
}
```

## 关于 Java 配置内部工作原理的更多信息

请参考以下示例，该示例展示了一个带有 `@Bean` 注解的方法被调用两次的情况：

```java
@Configuration
public class AppConfig {

	@Bean
	public ClientService clientService1() {
		ClientServiceImpl clientService = new ClientServiceImpl();
		clientService.setClientDao(clientDao());
		return clientService;
	}

	@Bean
	public ClientService clientService2() {
		ClientServiceImpl clientService = new ClientServiceImpl();
		clientService.setClientDao(clientDao());
		return clientService;
	}

	@Bean
	public ClientDao clientDao() {
		return new ClientDaoImpl();
	}
}
```

`clientDao()` 方法在 `clientService1()` 和 `clientService2()` 中分别被调用了一次。由于该方法创建并返回了 `ClientDaoImpl` 的新实例，通常情况下，你会期望得到两个不同的实例（每个服务一个）。但这可能会引发问题：在 Spring 中，默认情况下实例化的 bean 具有单例（singleton）作用域。

这正是 Spring 机制发挥作用的地方：所有带有 `@Configuration` 注解的类在启动时都会被 CGLIB 代理为子类。在该子类中，子方法会优先检查容器中是否已经缓存了（具有作用域的）bean，然后再决定是否调用父方法来创建新实例。

> [!NOTE]
>
> 该行为可能会根据 bean 的作用域而有所不同。这里讨论的是单例（singleton）作用域的情况。

> [!NOTE]
>
> 不需要额外将 CGLIB 添加到类路径（classpath），因为 CGLIB 的相关类已被重新打包到 `org.springframework.cglib` 包下，并直接包含在 `spring-core` JAR 文件中。

> [!TIP]
>
> 由于 CGLIB 在启动时动态添加功能，因此存在一些限制。特别是，配置类（`@Configuration`）不能声明为 `final`。不过，配置类的构造方法没有限制，包括可以使用 `@Autowired` 进行注入，或者声明一个非默认的构造方法以进行默认注入。
>
> 如果希望避免 CGLIB 施加的任何限制，可以考虑在非 `@Configuration` 类（例如普通的 `@Component` 类）上声明 `@Bean` 方法，或者在配置类上使用 `@Configuration(proxyBeanMethods = false)` 进行注解。在这种情况下，`@Bean` 方法之间的跨方法调用不会被拦截，因此必须完全依赖构造方法或方法级别的依赖注入。

