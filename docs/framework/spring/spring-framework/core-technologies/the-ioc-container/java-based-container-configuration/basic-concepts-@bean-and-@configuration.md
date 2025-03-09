# 基本概念：@Bean 和 @Configuration

Spring 的 Java 配置支持的核心组件是带有 @Configuration 注解的类和带有 @Bean 注解的方法。

@Bean 注解用于指示方法实例化、配置和初始化一个新对象，该对象将由 Spring IoC 容器管理。对于熟悉 Spring 的 `<beans/>` XML 配置的人来说，@Bean 注解的作用类似于 `<bean/>` 元素。@Bean 注解的方法可以与任何 Spring @Component 一起使用，但它们最常用于 @Configuration bean。

使用 @Configuration 注解标注的类表示其主要目的是作为 Bean 定义的来源。此外，@Configuration 类允许在同一类中通过调用其他 @Bean 方法来定义 Bean 之间的依赖关系。最简单的 @Configuration 类示例如下：

```java
@Configuration
public class AppConfig {

	@Bean
	public MyServiceImpl myService() {
		return new MyServiceImpl();
	}
}
```

前面的 `AppConfig` 类等同于以下 Spring `<beans/>` XML 配置：

```xml
<beans>
	<bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

> [!NOTE]
>
> 在常见场景中，`@Bean` 方法通常声明在 `@Configuration` 类中，以确保完整的配置类处理生效，并使跨方法引用被重定向到容器的生命周期管理。这可以防止 `@Bean` 方法被普通的 Java 方法调用，从而减少难以追踪的微妙错误。
>
> 当 `@Bean` 方法声明在未使用 `@Configuration` 注解的类中，或者 `@Configuration(proxyBeanMethods=false)` 被声明时，它们将以“轻量级（lite）模式”进行处理。在这种模式下，`@Bean` 方法只是一个普通的工厂方法，没有特殊的运行时处理（即不会生成 CGLIB 子类）。因此，手动调用这样的 `@Bean` 方法不会被容器拦截，每次调用都会创建一个新实例，而不是复用已有的单例（或作用域）实例。
>
> 因此，不使用运行时代理的 `@Bean` 方法不应声明相互依赖的 `@Bean` 方法。相反，它们应该基于所属组件的字段运行，并且可以通过工厂方法的参数接收自动装配的协作者（autowired collaborators）。这样的方法无需调用其他 `@Bean` 方法，而是通过工厂方法参数表达依赖关系。其优点是无需在运行时进行 CGLIB 子类化，从而减少了开销和内存占用。

`@Bean` 和 `@Configuration` 注解的详细讨论将在接下来的部分进行。不过，在此之前，我们将先介绍使用基于 Java 的配置创建 Spring 容器的各种方法。