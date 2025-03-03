# [基于注解的容器配置](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config.html)

Spring 提供了对基于注解配置的全面支持，通过在相关类、方法或字段声明上使用注解来处理组件类中的元数据。

此外，Spring 还支持 JSR-250 注解，如 @PostConstruct 和 @PreDestroy，以及支持 JSR-330（Java 依赖注入）注解，这些注解位于 jakarta.inject 包中，如 @Inject 和 @Named。

> [!NOTE]
>
> 注解注入在外部属性注入之前执行。因此，当通过混合方式进行注入时，外部配置（例如，通过 XML 指定的 bean 属性）实际上会覆盖属性上的注解。

从技术上讲，您可以将后处理器作为单独的 bean 定义进行注册，但它们已经在 `AnnotationConfigApplicationContext` 中隐式注册。

在基于 XML 的 Spring 配置中，您可以包含以下配置标签，以启用与注解配置的混合使用：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context
		https://www.springframework.org/schema/context/spring-context.xsd">

	<context:annotation-config/>

</beans>
```

`<context:annotation-config/>` 元素隐式注册以下后处理器：

- `ConfigurationClassPostProcessor`
- `AutowiredAnnotationBeanPostProcessor`
- `CommonAnnotationBeanPostProcessor`
- `PersistenceAnnotationBeanPostProcessor`
- `EventListenerMethodProcessor`

> [!NOTE]
>
> `<context:annotation-config/>` 仅在定义它的同一个应用程序上下文中查找注解。这意味着，如果你将 `<context:annotation-config/>` 放在 `DispatcherServlet` 的 `WebApplicationContext` 中，它只会检查你的控制器中的 `@Autowired` 注解的 beans，而不会检查你的服务中的 beans。

