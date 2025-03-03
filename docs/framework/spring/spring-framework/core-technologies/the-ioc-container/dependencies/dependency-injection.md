# 依赖注入

依赖注入（DI）是一种过程，其中对象仅通过构造函数参数、工厂方法的参数或在对象实例化后或从工厂方法返回后设置的属性来定义它们的依赖关系（即它们与之协作的其他对象）。然后，容器在创建 Bean 时注入这些依赖关系。这个过程从根本上与 Bean 自己控制其依赖关系的实例化或位置的方式相反（因此被称为控制反转），即 Bean 不再通过直接构造类或使用服务定位器模式来控制依赖关系。

使用 DI 原则后，代码更加简洁，当对象通过容器提供依赖时，解耦效果更好。对象不再查找它的依赖关系，也不知道依赖关系的具体位置或类。因此，您的类变得更易于测试，尤其是当依赖关系是接口或抽象基类时，可以在单元测试中使用存根或模拟实现。

DI 主要有两种变体：基于构造函数的依赖注入和基于 Setter 的依赖注入。

## 基于构造函数的依赖注入

基于构造函数的依赖注入是通过容器调用带有多个参数的构造函数来完成的，每个参数代表一个依赖关系。通过特定参数调用静态工厂方法来构造 Bean 几乎是等效的，因此本讨论将构造函数参数和静态工厂方法参数视为相似。以下示例展示了一个只能通过构造函数注入的类：

```java
public class SimpleMovieLister {

	// the SimpleMovieLister has a dependency on a MovieFinder
	private final MovieFinder movieFinder;

	// a constructor so that the Spring container can inject a MovieFinder
	public SimpleMovieLister(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// business logic that actually uses the injected MovieFinder is omitted...
}
```

请注意，这个类没有什么特别之处。它是一个 POJO（普通旧 Java 对象），没有依赖于容器特定的接口、基类或注解。

### 构造函数参数解析

构造函数参数解析通过使用参数的类型来进行匹配。如果在 Bean 定义的构造函数参数中没有潜在的歧义，那么在 Bean 定义中定义构造函数参数的顺序，就是在实例化 Bean 时将这些参数传递给相应构造函数的顺序。考虑以下类：

```java
package x.y;

public class ThingOne {

	public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
		// ...
	}
}
```

假设 `ThingTwo` 和 `ThingThree` 类之间没有继承关系，那么就不存在潜在的歧义。因此，以下配置可以正常工作，并且您无需在 `<constructor-arg/>` 元素中显式指定构造函数参数的索引或类型。

```xml
<beans>
	<bean id="beanOne" class="x.y.ThingOne">
		<constructor-arg ref="beanTwo"/>
		<constructor-arg ref="beanThree"/>
	</bean>

	<bean id="beanTwo" class="x.y.ThingTwo"/>

	<bean id="beanThree" class="x.y.ThingThree"/>
</beans>
```

当引用另一个 Bean 时，类型是已知的，因此可以进行匹配（就像前面的示例一样）。当使用简单类型时，例如 `<value>true</value>`，Spring 无法确定值的类型，因此无法在没有帮助的情况下通过类型进行匹配。考虑以下类：

```java
package examples;

public class ExampleBean {

	// Number of years to calculate the Ultimate Answer
	private final int years;

	// The Answer to Life, the Universe, and Everything
	private final String ultimateAnswer;

	public ExampleBean(int years, String ultimateAnswer) {
		this.years = years;
		this.ultimateAnswer = ultimateAnswer;
	}
}
```

#### 构造函数参数类型匹配

在前述场景中，如果您通过 `type` 属性显式指定构造函数参数的类型，容器可以使用类型匹配来处理简单类型，如下例所示：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<constructor-arg type="int" value="7500000"/>
	<constructor-arg type="java.lang.String" value="42"/>
</bean>
```

#### 构造函数参数索引

您可以使用 `index` 属性显式指定构造函数参数的索引，如下例所示：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<constructor-arg index="0" value="7500000"/>
	<constructor-arg index="1" value="42"/>
</bean>
```

除了通过解决多个简单值的歧义外，指定索引还可以解决构造函数有两个相同类型参数时的歧义问题。

> [!NOTE]
>
> 索引是从 0 开始的。

#### 构造函数参数名称

您也可以使用构造函数参数名称来进行值的歧义解析，如下例所示：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<constructor-arg name="years" value="7500000"/>
	<constructor-arg name="ultimateAnswer" value="42"/>
</bean>
```

请记住，为了使这个功能开箱即用，您的代码必须使用 `-parameters` 标志进行编译，以便 Spring 可以从构造函数中查找参数名称。如果您无法或不想使用 `-parameters` 标志编译代码，您可以使用 JDK 注解 `@ConstructorProperties` 显式命名构造函数参数。示例类应如下所示：

```java
package examples;

public class ExampleBean {

	// Fields omitted

	@ConstructorProperties({"years", "ultimateAnswer"})
	public ExampleBean(int years, String ultimateAnswer) {
		this.years = years;
		this.ultimateAnswer = ultimateAnswer;
	}
}
```

## 基于 Setter 的依赖注入

基于 Setter 的依赖注入是通过容器在调用无参数构造函数或无参数静态工厂方法实例化 Bean 后，调用 Bean 上的 Setter 方法来完成的。

以下示例展示了一个只能通过纯 Setter 注入进行依赖注入的类。该类是常规的 Java 类，它是一个 POJO（普通旧 Java 对象），没有依赖于容器特定的接口、基类或注解。

```java
public class SimpleMovieLister {

	// the SimpleMovieLister has a dependency on the MovieFinder
	private MovieFinder movieFinder;

	// a setter method so that the Spring container can inject a MovieFinder
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// business logic that actually uses the injected MovieFinder is omitted...
}
```

`ApplicationContext` 支持构造函数注入和基于 Setter 的依赖注入（DI）用于它所管理的 Bean。它还支持在通过构造函数方式注入了一些依赖之后，继续使用基于 Setter 的 DI。您可以以 `BeanDefinition` 的形式配置这些依赖，并结合 `PropertyEditor` 实例来将属性从一种格式转换为另一种格式。然而，大多数 Spring 用户并不会直接（即以编程方式）操作这些类，而是通过 XML Bean 定义、带注解的组件（如使用 `@Component`、`@Controller` 等注解的类）或 Java 基础的 `@Configuration` 类中的 `@Bean` 方法来工作。这些源随后会被内部转换为 `BeanDefinition` 的实例，并用于加载整个 Spring IoC 容器实例。

> [!TIP]
>
> **构造函数注入还是 Setter 注入？**
> 由于您可以混合使用构造函数注入和 Setter 注入，因此一个好的原则是：对于必需的依赖项，使用构造函数注入；对于可选的依赖项，使用 Setter 方法或配置方法。需要注意的是，`@Autowired` 注解可以应用于 Setter 方法，使该属性成为必需的依赖项；然而，构造函数注入并结合程序化验证参数更为可取。
>
> Spring 团队通常推荐使用构造函数注入，因为它可以让您将应用组件实现为不可变对象，并确保必需的依赖项不会为 null。此外，构造函数注入的组件总是以完全初始化的状态返回给客户端（调用）代码。顺便提一句，构造函数参数过多通常是一个代码异味，暗示该类可能有过多的责任，应该重构以更好地进行责任分离。
>
> Setter 注入主要应仅用于可以在类内分配合理默认值的可选依赖项。否则，每当代码使用该依赖项时，必须进行非空检查。Setter 注入的一个好处是 Setter 方法使得该类的对象在之后可以重新配置或重新注入。因此，通过 JMX MBeans 进行管理是 Setter 注入的一个有力用例。
>
> 使用最适合特定类的 DI 风格。有时，在处理您没有源代码的第三方类时，选择会由您做出。例如，如果第三方类没有公开任何 Setter 方法，那么构造函数注入可能是唯一可用的 DI 形式。

## 依赖解析过程

容器执行 Bean 依赖解析的过程如下：

- **创建并初始化 ApplicationContext**
  ApplicationContext 会根据配置元数据进行创建和初始化，这些元数据描述了所有的 Bean。配置元数据可以通过 XML、Java 代码或注解来指定。
- **表达 Bean 的依赖**
  对于每个 Bean，它的依赖通过属性、构造函数参数或静态工厂方法的参数来表达（如果使用静态工厂方法而非普通构造函数）。这些依赖项会在 Bean 实际创建时提供给该 Bean。
- **定义属性或构造函数参数**
  每个属性或构造函数参数要么是一个要设置的值，要么是指向容器中其他 Bean 的引用。
- **类型转换**
  每个属性或构造函数参数，如果是一个值，会从其指定的格式转换为该属性或构造函数参数的实际类型。默认情况下，Spring 能将字符串格式提供的值转换为所有内建类型，例如 int、long、String、boolean 等。

Spring 容器在创建容器时会验证每个 Bean 的配置。然而，Bean 的属性不会在容器创建时立即设置，只有在 Bean 实际创建时才会设置这些属性。对于单例作用域的 Bean（默认情况下是单例），如果设置为预实例化，它们会在容器创建时被创建。作用域在 **Bean Scopes** 中定义。否则，Bean 只有在被请求时才会被创建。Bean 的创建可能会导致一张 Bean 的图谱被创建，因为该 Bean 的依赖以及其依赖的依赖（依此类推）会被创建并分配。需要注意的是，在这些依赖之间的解析不匹配可能会出现在稍后的阶段，即在受影响的 Bean 首次创建时。

> [!TIP]
>
> **循环依赖**
>
> 如果你主要使用构造器注入，那么可能会导致无法解决的循环依赖情况。
>
> 例如：类 A 通过构造器注入需要一个类 B 的实例，而类 B 通过构造器注入需要一个类 A 的实例。如果你配置了类 A 和类 B 互相注入，Spring IoC 容器会在运行时检测到这种循环引用，并抛出 `BeanCurrentlyInCreationException` 异常。
>
> 一种可能的解决方法是修改某些类的源代码，改为通过 setter 方法来配置，而不是构造器注入。或者，避免使用构造器注入，只使用 setter 注入。换句话说，尽管不推荐这样做，你可以通过 setter 注入配置循环依赖。
>
> 与没有循环依赖的典型情况不同，类 A 和类 B 之间的循环依赖迫使其中一个 Bean 在另一个 Bean 完全初始化之前被注入到另一个 Bean 中，这就形成了经典的“先有鸡还是先有蛋”的场景。

你通常可以信任 Spring 做出正确的决策。它会在容器加载时检测配置问题，例如引用不存在的 Bean 和循环依赖问题。Spring 会尽可能晚地设置属性和解决依赖，直到 Bean 实际被创建时。这意味着，一个加载正确的 Spring 容器，在你请求某个对象时，如果存在创建该对象或其依赖的问题，例如 Bean 因缺少或无效的属性而抛出异常，可能会在稍后的时刻才会抛出异常。这种配置问题的潜在延迟可见性是为什么 `ApplicationContext` 实现默认预实例化单例 Bean 的原因。虽然这会消耗一些前期时间和内存来创建这些 Bean，在它们实际需要之前，你可以在 `ApplicationContext` 创建时就发现配置问题，而不是稍后再发现。你仍然可以覆盖这种默认行为，使得单例 Bean 延迟初始化，而不是急切地预实例化。

如果不存在循环依赖，当一个或多个协作 Bean 被注入到依赖 Bean 中时，每个协作 Bean 会在注入到依赖 Bean 之前完全配置。这意味着，如果 Bean A 依赖于 Bean B，Spring IoC 容器会在调用 Bean A 的 setter 方法之前，完全配置 Bean B。换句话说，Bean 会被实例化（如果它不是预实例化的单例），它的依赖会被设置，并且相关的生命周期方法（例如配置的初始化方法或 `InitializingBean` 的回调方法）会被调用。

## 依赖注入的示例

以下示例使用基于XML的配置元数据进行Setter方法注入。Spring XML配置文件的一小部分指定了一些bean定义，如下所示：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<!-- setter injection using the nested ref element -->
	<property name="beanOne">
		<ref bean="anotherExampleBean"/>
	</property>

	<!-- setter injection using the neater ref attribute -->
	<property name="beanTwo" ref="yetAnotherBean"/>
	<property name="integerProperty" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

以下示例显示了对应的 `ExampleBean` 类：

```java
public class ExampleBean {

	private AnotherBean beanOne;

	private YetAnotherBean beanTwo;

	private int i;

	public void setBeanOne(AnotherBean beanOne) {
		this.beanOne = beanOne;
	}

	public void setBeanTwo(YetAnotherBean beanTwo) {
		this.beanTwo = beanTwo;
	}

	public void setIntegerProperty(int i) {
		this.i = i;
	}
}
```

在前面的示例中，setter 方法被声明为与 XML 文件中指定的属性相匹配。以下示例使用构造器注入（constructor-based DI）：

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<!-- constructor injection using the nested ref element -->
	<constructor-arg>
		<ref bean="anotherExampleBean"/>
	</constructor-arg>

	<!-- constructor injection using the neater ref attribute -->
	<constructor-arg ref="yetAnotherBean"/>

	<constructor-arg type="int" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

以下示例展示了相应的 `ExampleBean` 类：

```java
public class ExampleBean {

	private AnotherBean beanOne;

	private YetAnotherBean beanTwo;

	private int i;

	public ExampleBean(
		AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {
		this.beanOne = anotherBean;
		this.beanTwo = yetAnotherBean;
		this.i = i;
	}
}
```

在bean定义中指定的构造函数参数作为`ExampleBean`构造函数的参数使用。

现在考虑这个例子的变体，在该变体中，Spring被告知调用一个静态工厂方法来返回对象的实例，而不是使用构造函数：

```xml
<bean id="exampleBean" class="examples.ExampleBean" factory-method="createInstance">
	<constructor-arg ref="anotherExampleBean"/>
	<constructor-arg ref="yetAnotherBean"/>
	<constructor-arg value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

以下示例展示了对应的 `ExampleBean` 类：

```java
public class ExampleBean {

	// a private constructor
	private ExampleBean(...) {
		...
	}

	// a static factory method; the arguments to this method can be
	// considered the dependencies of the bean that is returned,
	// regardless of how those arguments are actually used.
	public static ExampleBean createInstance (
		AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {

		ExampleBean eb = new ExampleBean (...);
		// some other operations...
		return eb;
	}
}
```

静态工厂方法的参数通过 `<constructor-arg/>` 元素提供，方式与实际使用构造函数时完全相同。返回工厂方法的类的类型不必与包含静态工厂方法的类的类型相同（尽管在此示例中它们是相同的）。实例（非静态）工厂方法也可以以基本相同的方式使用（除了使用 `factory-bean` 属性代替 `class` 属性），因此我们在这里不讨论这些细节。