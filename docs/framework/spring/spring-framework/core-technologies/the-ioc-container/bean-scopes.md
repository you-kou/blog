# Bean 范围（Scopes）

当您创建一个 Bean 定义时，实际上是在为创建该 Bean 定义所指定类的实际实例创建一个“配方”。这个“配方”概念很重要，因为它意味着，正如一个类一样，您可以从一个配方中创建多个对象实例。

您不仅可以控制注入对象的各种依赖关系和配置值，还可以控制从特定 Bean 定义创建的对象的范围。这个方法既强大又灵活，因为您可以通过配置来选择创建的对象的作用域，而不需要在 Java 类级别上硬编码对象的作用域。可以将 Bean 定义为部署在多个作用域中的一种。Spring 框架支持六种作用域，其中四种仅在使用 Web-aware ApplicationContext 时可用。您还可以创建自定义作用域。

| Scope                                                        | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [singleton](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton) | （默认）作用域将单个 Bean 定义作用于每个 Spring IoC 容器中的单个对象实例。 |
| [prototype](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-prototype) | 作用域将单个 Bean 定义作用于任意数量的对象实例。             |
| [request](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-request) | 将单个 Bean 定义作用于单个 HTTP 请求的生命周期。也就是说，每个 HTTP 请求都有一个基于单个 Bean 定义创建的实例。仅在支持 Web 的 Spring `ApplicationContext` 中有效。 |
| [session](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-session) | 将单个 Bean 定义作用于 HTTP `Session` 的生命周期。仅在支持 Web 的 Spring `ApplicationContext` 中有效。 |
| [application](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-application) | 将单个 Bean 定义作用于 `ServletContext` 的生命周期。仅在支持 Web 的 Spring `ApplicationContext` 中有效。 |
| [websocket](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/scope.html) | 将单个 Bean 定义作用于 `WebSocket` 的生命周期。仅在支持 Web 的 Spring `ApplicationContext` 中有效。 |

> [!NOTE]
>
> 线程作用域是可用的，但默认情况下未注册。有关更多信息，请参阅 SimpleThreadScope 的文档。有关如何注册此作用域或其他自定义作用域的说明，请参阅使用自定义作用域。

## 单例作用域

单例 bean 只有一个共享实例被管理，所有匹配该 bean 定义的 ID 或多个 ID 的请求都将返回该特定的 bean 实例。

换句话说，当你定义一个 bean 定义并将其作用域设置为单例时，Spring IoC 容器会创建该 bean 定义所定义的对象的一个实例。这个单一实例会被存储在一个单例 bean 的缓存中，所有后续的请求和对该命名 bean 的引用都会返回缓存中的对象。以下图展示了单例作用域的工作原理：

![](https://docs.spring.io/spring-framework/reference/_images/singleton.png)

Spring 中的单例 bean 概念与《设计模式：可复用面向对象软件的基础》（Gang of Four，GoF）一书中定义的单例模式有所不同。GoF 单例模式将对象的作用域硬编码为每个类加载器只创建一个特定类的实例。而 Spring 的单例作用域最好描述为每个容器和每个 bean 一个实例。这意味着，如果你在单个 Spring 容器中为某个特定类定义了一个 bean，那么 Spring 容器将创建该 bean 定义所定义的类的一个且仅一个实例。单例作用域是 Spring 的默认作用域。在 XML 中定义单例 bean，可以按如下方式定义：

```xml
<bean id="accountService" class="com.something.DefaultAccountService"/>

<!-- the following is equivalent, though redundant (singleton scope is the default) -->
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>
```

## 原型作用域

非单例的原型作用域会导致每次请求该特定bean时都会创建一个新的bean实例。也就是说，当bean被注入到另一个bean中，或者通过容器的getBean()方法请求时，都会创建一个新的实例。通常，您应该将原型作用域用于所有有状态的bean，而将单例作用域用于无状态的bean。

下图展示了Spring的原型作用域：

![](https://docs.spring.io/spring-framework/reference/_images/prototype.png)

（数据访问对象（DAO）通常不会配置为原型，因为典型的DAO不保存任何会话状态。我们更容易重用单例图的核心。）

以下示例在XML中将一个bean定义为原型：

```xml
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

与其他作用域不同，Spring不管理原型bean的完整生命周期。容器实例化、配置并组装原型对象后将其交给客户端，不再记录该原型实例。因此，尽管所有对象都会调用初始化生命周期回调方法，但对于原型bean，配置的销毁生命周期回调方法不会被调用。客户端代码必须清理原型作用域对象，并释放原型bean持有的昂贵资源。为了让Spring容器释放原型作用域bean持有的资源，可以尝试使用自定义bean后处理器，它持有需要清理的bean的引用。

在某些方面，Spring容器在原型作用域bean中的角色类似于Java的new操作符。从那时起，所有生命周期管理都必须由客户端处理。（有关Spring容器中bean生命周期的详细信息，请参见生命周期回调。）

## 具有原型bean依赖的单例bean

当您使用具有原型bean依赖的单例作用域bean时，需要注意，依赖项是在实例化时解析的。因此，如果您将一个原型作用域的bean依赖注入到一个单例作用域的bean中，则会实例化一个新的原型bean，并将其依赖注入到单例bean中。这个原型实例是唯一会提供给单例作用域bean的实例。

然而，假设您希望单例作用域的bean在运行时重复获取新的原型作用域bean实例。您不能将原型作用域的bean依赖注入到单例bean中，因为该注入只发生一次，即Spring容器在实例化单例bean并解析和注入其依赖项时。如果您需要在运行时多次获取原型bean的新实例，请参阅方法注入。

## 请求、会话、应用和WebSocket作用域

请求、会话、应用和WebSocket作用域仅在您使用Web感知的Spring ApplicationContext实现（例如XmlWebApplicationContext）时可用。如果您在常规Spring IoC容器中使用这些作用域，例如ClassPathXmlApplicationContext，系统将抛出IllegalStateException，并报告未知的bean作用域错误。

### 初始Web配置

为了支持在请求、会话、应用和WebSocket级别的bean作用域（Web作用域bean），在定义bean之前需要进行一些初步配置。（此初步设置对于标准作用域：单例和原型作用域不需要。）

如何完成此初始设置取决于您的具体Servlet环境。

如果您在Spring Web MVC中访问作用域bean，实际上是在Spring DispatcherServlet处理的请求中，则无需进行特别的设置。DispatcherServlet已经暴露了所有相关的状态。

如果您使用的是Servlet Web容器，并且请求在Spring的DispatcherServlet之外进行处理（例如，当使用JSF时），则需要注册org.springframework.web.context.request.RequestContextListener ServletRequestListener。这可以通过使用WebApplicationInitializer接口进行编程实现。或者，将以下声明添加到您的Web应用程序的web.xml文件中：

```xml
<web-app>
	...
	<listener>
		<listener-class>
			org.springframework.web.context.request.RequestContextListener
		</listener-class>
	</listener>
	...
</web-app>
```

另外，如果您的监听器设置存在问题，可以考虑使用Spring的RequestContextFilter。过滤器映射取决于周围的Web应用程序配置，因此您需要根据实际情况进行修改。以下是Web应用程序中的过滤器部分示例：

```xml
<web-app>
	...
	<filter>
		<filter-name>requestContextFilter</filter-name>
		<filter-class>org.springframework.web.filter.RequestContextFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>requestContextFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	...
</web-app>
```

DispatcherServlet、RequestContextListener和RequestContextFilter都做相同的事情，即将HTTP请求对象绑定到处理该请求的线程。这使得请求作用域和会话作用域的bean可以在调用链的后续阶段使用。

### 请求作用域 (Request scope)

考虑以下用于bean定义的XML配置：

```xml
<bean id="loginAction" class="com.something.LoginAction" scope="request"/>
```

Spring容器会在每一个HTTP请求中使用loginAction bean定义创建一个新的LoginAction bean实例。也就是说，loginAction bean是按HTTP请求级别进行作用域限定的。您可以尽情修改所创建实例的内部状态，因为从同一loginAction bean定义创建的其他实例不会看到这些状态变化。它们是特定于单个请求的。当请求处理完成后，与请求作用域相关的bean将被丢弃。

在使用基于注解的组件或Java配置时，可以使用@RequestScope注解将一个组件分配到请求作用域。以下示例展示了如何做到这一点：

```java
@RequestScope
@Component
public class LoginAction {
	// ...
}
```

### 会话作用域 (Session Scope)

考虑以下XML配置来定义一个bean：

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session"/>
```

Spring容器通过使用 `userPreferences` bean 定义创建 `UserPreferences` bean 的新实例，生命周期为单个 HTTP 会话。换句话说，`userPreferences` bean 实际上是按 HTTP 会话级别进行作用域管理的。与请求作用域的bean一样，您可以随意更改创建的实例的内部状态，因为其他使用相同 `userPreferences` bean 定义创建的 HTTP 会话实例不会看到这些状态的变化，因为这些变化是特定于单个 HTTP 会话的。当 HTTP 会话最终被丢弃时，作用于该特定 HTTP 会话的 bean 也会被丢弃。

在使用注解驱动的组件或 Java 配置时，可以使用 `@SessionScope` 注解将一个组件分配到会话作用域。

```java
@SessionScope
@Component
public class UserPreferences {
	// ...
}
```

### 应用范围

考虑以下 XML 配置来定义一个 bean：

```xml
<bean id="appPreferences" class="com.something.AppPreferences" scope="application"/>
```

Spring 容器使用 appPreferences bean 定义为整个 web 应用程序创建一个新的 AppPreferences bean 实例。也就是说，appPreferences bean 的作用域是 ServletContext 级别，并作为常规的 ServletContext 属性存储。这与 Spring 单例 bean 有些相似，但有两个重要的区别：它是每个 ServletContext 的单例，而不是每个 Spring ApplicationContext 的单例（在任何给定的 web 应用程序中可能有多个 Spring ApplicationContext）；并且它实际上作为 ServletContext 属性公开，因此可见。

在使用基于注解的组件或 Java 配置时，可以使用 @ApplicationScope 注解将一个组件分配到应用范围。以下示例展示了如何操作：

```java
@ApplicationScope
@Component
public class AppPreferences {
	// ...
}
```

### WebSocket 作用域

WebSocket 作用域与 WebSocket 会话的生命周期相关，并适用于 STOMP over WebSocket 应用程序，详情请参见 WebSocket 作用域。

### 作用域 Bean 作为依赖项

 Spring IoC 容器不仅管理对象（Bean）的实例化，还管理协作对象（或依赖项）的连接。如果你希望将一个 HTTP 请求作用域的 Bean 注入到另一个生命周期较长的 Bean 中，你可以选择注入一个 AOP 代理来代替作用域 Bean。也就是说，你需要注入一个代理对象，它公开与作用域对象相同的公共接口，但它也能从相关的作用域（例如 HTTP 请求）中检索真实的目标对象，并将方法调用委托给真实的对象。

> [!NOTE]
>
> 你还可以在作用域为单例的 Bean 之间使用 `<aop:scoped-proxy/>`，此时引用会通过一个中间代理进行访问，该代理是可序列化的，因此能够在反序列化时重新获取目标单例 Bean。
>
> 当声明 `<aop:scoped-proxy/>` 用于作用域为原型的 Bean 时，每次通过共享代理调用方法时，都会创建一个新的目标实例，并将调用转发到该实例。
>
> 此外，作用域代理并不是访问生命周期较短作用域 Bean 的唯一方式。你还可以将注入点（即构造函数或 setter 参数或自动注入字段）声明为 `ObjectFactory<MyTargetBean>`，通过 `getObject()` 方法按需每次获取当前实例，而不必持有实例或将其单独存储。
>
> 作为扩展变体，你可以声明 `ObjectProvider<MyTargetBean>`，它提供了几个额外的访问变体，包括 `getIfAvailable` 和 `getIfUnique`。
>
> JSR-330 变体称为 Provider，使用 `Provider<MyTargetBean>` 声明，并通过每次检索时的相应 `get()` 方法进行调用。有关 JSR-330 的更多详细信息，请参阅此处。

以下示例中的配置只有一行，但理解其背后的“为什么”和“如何”同样重要：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/aop
		https://www.springframework.org/schema/aop/spring-aop.xsd">

	<!-- an HTTP Session-scoped bean exposed as a proxy -->
	<bean id="userPreferences" class="com.something.UserPreferences" scope="session">
		<!-- instructs the container to proxy the surrounding bean -->
		<aop:scoped-proxy/>
	</bean>

	<!-- a singleton-scoped bean injected with a proxy to the above bean -->
	<bean id="userService" class="com.something.SimpleUserService">
		<!-- a reference to the proxied userPreferences bean -->
		<property name="userPreferences" ref="userPreferences"/>
	</bean>
</beans>
```

要创建这样的代理，您需要将一个子元素 `<aop:scoped-proxy/>` 插入到作用域为请求、会话和自定义作用域的 bean 定义中（参见选择要创建的代理类型和基于 XML 的配置）。

为什么请求、会话和自定义作用域级别的 bean 定义在常见场景中需要 `<aop:scoped-proxy/>` 元素？考虑以下的单例 bean 定义，并与您需要为上述作用域定义的内容进行对比（请注意，以下的 `userPreferences` bean 定义本身是不完整的）：

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session"/>

<bean id="userManager" class="com.something.UserManager">
	<property name="userPreferences" ref="userPreferences"/>
</bean>
```

在前面的例子中，单例 bean（`userManager`）被注入了对 HTTP 会话作用域 bean（`userPreferences`）的引用。这里的关键点是，`userManager` bean 是单例的：它在每个容器中只实例化一次，并且它的依赖（在本例中只有一个，即 `userPreferences` bean）也只注入一次。这意味着，`userManager` bean 只操作与最初注入的那个相同的 `userPreferences` 对象。

这不是将生命周期较短的作用域 bean 注入到生命周期较长的作用域 bean 中时所希望的行为（例如，将 HTTP 会话作用域的协作 bean 作为依赖注入到单例 bean 中）。相反，您需要一个单一的 `userManager` 对象，并且在 HTTP 会话的生命周期内，您需要一个与该 HTTP 会话特定的 `userPreferences` 对象。因此，容器创建了一个对象，该对象暴露与 `UserPreferences` 类完全相同的公共接口（理想情况下是 `UserPreferences` 的实例），可以从作用域机制中获取实际的 `UserPreferences` 对象（例如，HTTP 请求、会话等）。容器将这个代理对象注入到 `userManager` bean 中，`userManager` 并不知道这个 `UserPreferences` 引用是一个代理对象。在此例中，当 `UserManager` 实例在依赖注入的 `UserPreferences` 对象上调用方法时，实际上是调用了代理对象上的方法。代理对象随后从（本例中）HTTP 会话中获取实际的 `UserPreferences` 对象，并将方法调用委托给获取到的实际 `UserPreferences` 对象。

因此，当将请求作用域和会话作用域的 bean 注入到协作对象中时，您需要以下（正确且完整的）配置，如下例所示：

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session">
	<aop:scoped-proxy/>
</bean>

<bean id="userManager" class="com.something.UserManager">
	<property name="userPreferences" ref="userPreferences"/>
</bean>
```

**选择创建代理的类型**

默认情况下，当 Spring 容器为标记为 `<aop:scoped-proxy/>` 元素的 bean 创建代理时，Spring 会创建一个基于 CGLIB 的类代理。

> [!NOTE]
>
> CGLIB 代理不拦截私有方法。尝试在这样的代理上调用私有方法将不会委托给实际的作用域目标对象。

另外，您可以通过在 `<aop:scoped-proxy/>` 元素的 `proxy-target-class` 属性中设置 `false` 来配置 Spring 容器为此类作用域的 Bean 创建基于标准 JDK 接口的代理。使用 JDK 接口代理意味着您不需要额外的库在应用程序的类路径中来实现这种代理。然而，这也意味着作用域 Bean 的类必须实现至少一个接口，并且所有注入作用域 Bean 的协作者必须通过它的接口之一来引用该 Bean。以下示例展示了基于接口的代理：

```xml
<!-- DefaultUserPreferences implements the UserPreferences interface -->
<bean id="userPreferences" class="com.stuff.DefaultUserPreferences" scope="session">
	<aop:scoped-proxy proxy-target-class="false"/>
</bean>

<bean id="userManager" class="com.stuff.UserManager">
	<property name="userPreferences" ref="userPreferences"/>
</bean>
```

有关选择基于类的代理还是基于接口的代理的更多详细信息，请参见《代理机制》章节。

### 直接注入请求/会话引用

作为工厂作用域的替代方案，Spring WebApplicationContext 还支持将 `HttpServletRequest`、`HttpServletResponse`、`HttpSession`、`WebRequest`（如果 JSF 存在）以及 `FacesContext` 和 `ExternalContext` 注入到 Spring 管理的 bean 中，方法是通过基于类型的自动装配来进行，类似于注入其他 bean 的常规方式。Spring 通常会为这些请求和会话对象注入代理，这样的代理具有在单例 bean 和可序列化 bean 中工作的优势，类似于工厂作用域 bean 的作用域代理。

## 自定义作用域

Spring 的 bean 作用域机制是可扩展的。你可以定义自己的作用域，甚至重新定义现有的作用域，尽管后者被认为是不好的实践，并且不能覆盖内置的单例和原型作用域。

### 创建自定义作用域

要将自定义作用域集成到 Spring 容器中，你需要实现 `org.springframework.beans.factory.config.Scope` 接口，本节将介绍该接口。关于如何实现你自己的作用域，你可以参考 Spring 框架本身提供的作用域实现以及 `Scope` 的 javadoc，它详细解释了你需要实现的方法。

`Scope` 接口有四个方法，用于从作用域中获取对象、从作用域中移除对象并销毁它们。

例如，session 作用域的实现返回会话作用域的 bean（如果不存在，该方法会返回一个新的实例，并将其绑定到会话中以供未来引用）。以下方法返回来自底层作用域的对象：

```java
Object get(String name, ObjectFactory<?> objectFactory)
```

例如，session 作用域的实现会将会话作用域的 bean 从底层会话中移除。该对象应当被返回，但如果没有找到具有指定名称的对象，你可以返回 `null`。以下方法从底层作用域中移除对象：

```java
Object remove(String name)
```

以下方法注册了一个回调，作用域应在其被销毁或指定的对象在作用域中被销毁时调用该回调：

```java
void registerDestructionCallback(String name, Runnable destructionCallback)
```

有关销毁回调的更多信息，请参见 javadoc 或 Spring 范围实现。

以下方法获取底层作用域的会话标识符：

```java
String getConversationId()
```

这个标识符对于每个作用域都是不同的。对于会话作用域的实现，标识符可以是会话标识符。

### 使用自定义作用域

在编写并测试一个或多个自定义作用域实现后，您需要让 Spring 容器知道您的新作用域。以下方法是将新作用域注册到 Spring 容器的核心方法：

```java
void registerScope(String scopeName, Scope scope);
```

这个方法在 `ConfigurableBeanFactory` 接口中声明，该接口可以通过大多数具体的 `ApplicationContext` 实现的 `BeanFactory` 属性来访问，这些实现是 Spring 提供的。

`registerScope(..)` 方法的第一个参数是与作用域关联的唯一名称。Spring 容器中类似的名称示例有 `singleton` 和 `prototype`。第二个参数是您希望注册并使用的自定义 `Scope` 实现的实例。

假设您编写了自定义的 `Scope` 实现，并按以下示例进行注册：

> [!NOTE]
>
> 以下示例使用了 `SimpleThreadScope`，这是 Spring 附带的，但默认情况下未注册。对于您自己的自定义 `Scope` 实现，注册过程将是相同的。

```java
Scope threadScope = new SimpleThreadScope();
beanFactory.registerScope("thread", threadScope);
```

然后，您可以创建遵循自定义 `Scope` 规则的 bean 定义，如下所示：

```java
<bean id="..." class="..." scope="thread">
```

通过自定义 `Scope` 实现，您不仅可以通过编程方式注册该 `Scope`，还可以通过声明方式进行注册，方法是使用 `CustomScopeConfigurer` 类，以下示例展示了这种方式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/aop
		https://www.springframework.org/schema/aop/spring-aop.xsd">

	<bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
		<property name="scopes">
			<map>
				<entry key="thread">
					<bean class="org.springframework.context.support.SimpleThreadScope"/>
				</entry>
			</map>
		</property>
	</bean>

	<bean id="thing2" class="x.y.Thing2" scope="thread">
		<property name="name" value="Rick"/>
		<aop:scoped-proxy/>
	</bean>

	<bean id="thing1" class="x.y.Thing1">
		<property name="thing2" ref="thing2"/>
	</bean>

</beans>
```

> [!NOTE]
>
> 当您将 `<aop:scoped-proxy/>` 放在一个 `FactoryBean` 实现的 `<bean>` 声明中时，作用域被应用到的是工厂 bean 本身，而不是从 `getObject()` 方法返回的对象。

