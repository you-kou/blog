# 求值

 本节介绍了 SpEL 接口及其表达式语言的编程使用方式。

下面的代码演示了如何使用 SpEL API 计算字面量字符串表达式 "Hello World"。

```java
ExpressionParser parser = new SpelExpressionParser();
Expression exp = parser.parseExpression("'Hello World'");
String message = (String) exp.getValue(); // 变量 message 的值是 "Hello World"。
```

SpEL 最常用的类和接口位于 `org.springframework.expression` 包及其子包（如 `spel.support`）中。

`ExpressionParser` 接口负责解析表达式字符串。在前面的示例中，表达式字符串是由单引号包围的字符串字面量。`Expression` 接口负责计算定义的表达式字符串。在调用 `parser.parseExpression(…)` 和 `exp.getValue(…)` 时，可能会抛出的两种异常分别是 `ParseException` 和 `EvaluationException`。

SpEL 支持多种功能，例如调用方法、访问属性和调用构造函数 。

在下面的方法调用示例中，我们将在字符串字面量 `"Hello World"` 上调用 `concat` 方法。

```java
ExpressionParser parser = new SpelExpressionParser();
Expression exp = parser.parseExpression("'Hello World'.concat('!')");
String message = (String) exp.getValue(); // 变量 message 的值现在是 "Hello World!"。
```

下面的示例演示了如何访问字符串字面量 `"Hello World"` 的 `Bytes` JavaBean 属性。

```java
ExpressionParser parser = new SpelExpressionParser();

// invokes 'getBytes()'
Expression exp = parser.parseExpression("'Hello World'.bytes");
byte[] bytes = (byte[]) exp.getValue(); // 此行代码将字面量转换为字节数组。
```

SpEL 还支持使用标准点符号（如 `prop1.prop2.prop3`）访问嵌套属性，并支持相应的属性赋值。同时，也可以访问公共字段。

下面的示例演示了如何使用点符号获取字符串字面量的长度。

```java
ExpressionParser parser = new SpelExpressionParser();

// invokes 'getBytes().length'
Expression exp = parser.parseExpression("'Hello World'.bytes.length");
int length = (Integer) exp.getValue(); // 'Hello World'.bytes.length 返回该字面量的字节数组长度。
```

可以调用 `String` 的构造函数来创建字符串，而不是直接使用字符串字面量，如下示例所示。

```java
ExpressionParser parser = new SpelExpressionParser();
Expression exp = parser.parseExpression("new String('hello world').toUpperCase()");
String message = exp.getValue(String.class); // 从字面量构造一个新的字符串并将其转换为大写。
```

请注意使用的泛型方法：`public <T> T getValue(Class<T> desiredResultType)`。使用此方法可以避免将表达式的值强制转换为所需的结果类型。如果无法将值转换为类型 T 或通过注册的类型转换器进行转换，则会抛出 `EvaluationException`。

SpEL 更常见的用法是提供一个表达式字符串，该字符串会根据特定的对象实例（称为根对象）进行评估。下面的示例演示了如何从 `Inventor` 类的实例中检索 `name` 属性，以及如何在布尔表达式中引用 `name` 属性。

```java
// Create and set a calendar
GregorianCalendar c = new GregorianCalendar();
c.set(1856, 7, 9);

// The constructor arguments are name, birthday, and nationality.
Inventor tesla = new Inventor("Nikola Tesla", c.getTime(), "Serbian");

ExpressionParser parser = new SpelExpressionParser();

Expression exp = parser.parseExpression("name"); // Parse name as an expression
String name = (String) exp.getValue(tesla);
// name == "Nikola Tesla"

exp = parser.parseExpression("name == 'Nikola Tesla'");
boolean result = exp.getValue(tesla, Boolean.class);
// result == true
```

## 理解 EvaluationContext

`EvaluationContext` API 在评估表达式时用于解析属性、方法或字段，并帮助执行类型转换。Spring 提供了两种实现方式。

**SimpleEvaluationContext**

> 暴露了一组基本的 SpEL 语言功能和配置选项，适用于不需要完整 SpEL 语言语法的表达式类型，并应对其进行合理的限制。例子包括但不限于数据绑定表达式和基于属性的过滤器。
>

**StandardEvaluationContext**

> 暴露了 SpEL 语言功能和配置选项的完整集合。你可以使用它来指定默认的根对象，并配置所有可用的评估相关策略。
>

`SimpleEvaluationContext` 仅支持 SpEL 语言语法的子集。例如，它排除了 Java 类型引用、构造函数和 Bean 引用。它还要求你明确选择表达式中属性和方法的支持级别。在创建 `SimpleEvaluationContext` 时，你需要选择在 SpEL 表达式中对数据绑定所需的支持级别：

- 只读访问的数据绑定
- 读写访问的数据绑定
- 自定义 `PropertyAccessor`（通常不是基于反射的），可以与 `DataBindingPropertyAccessor` 结合使用

为了方便起见，`SimpleEvaluationContext.forReadOnlyDataBinding()` 使得通过 `DataBindingPropertyAccessor` 进行只读访问属性成为可能。类似地，`SimpleEvaluationContext.forReadWriteDataBinding()` 使得对属性进行读写访问成为可能。或者，可以通过 `SimpleEvaluationContext.forPropertyAccessors(…)` 配置自定义的访问器，可能会禁用赋值，并通过构造器选择性启用方法解析和/或类型转换器。

### 类型转换

默认情况下，SpEL 使用 Spring 核心提供的转换服务（`org.springframework.core.convert.ConversionService`）。这个转换服务内置了许多常见转换的转换器，但也完全可扩展，允许你添加自定义的类型转换器。此外，它支持泛型类型。这意味着，当你在表达式中使用泛型类型时，SpEL 会尝试进行转换，以确保它遇到的任何对象都保持类型正确性。

这在实践中意味着什么？假设使用 `setValue()` 设置一个 `List` 属性。该属性的类型实际上是 `List<Boolean>`。SpEL 识别到列表中的元素需要在放入列表之前转换为 `Boolean` 类型。下面的示例展示了如何进行这种转换。

```java
class Simple {
	public List<Boolean> booleanList = new ArrayList<>();
}

Simple simple = new Simple();
simple.booleanList.add(true);

EvaluationContext context = SimpleEvaluationContext.forReadOnlyDataBinding().build();

// "false" is passed in here as a String. SpEL and the conversion service
// will recognize that it needs to be a Boolean and convert it accordingly.
parser.parseExpression("booleanList[0]").setValue(context, simple, "false");

// b is false
Boolean b = simple.booleanList.get(0);
```

## 解析器配置

可以通过使用解析器配置对象（`org.springframework.expression.spel.SpelParserConfiguration`）来配置 SpEL 表达式解析器。该配置对象控制某些表达式组件的行为。例如，如果你对一个集合进行索引操作，并且指定索引位置的元素为 `null`，SpEL 可以自动创建该元素。这在使用由属性引用链组成的表达式时非常有用。类似地，如果你对集合进行索引操作，并指定一个大于当前集合大小的索引，SpEL 可以自动扩展集合以容纳该索引。为了在指定索引处添加元素，SpEL 会尝试使用元素类型的默认构造函数来创建该元素，然后设置指定的值。如果元素类型没有默认构造函数，则会在集合中添加 `null`。如果没有内置的转换器或自定义转换器能够设置该值，`null` 将保留在集合的指定索引处。以下示例演示了如何自动扩展一个 `List`。

```java
class Demo {
	public List<String> list;
}

// Turn on:
// - auto null reference initialization
// - auto collection growing
SpelParserConfiguration config = new SpelParserConfiguration(true, true);

ExpressionParser parser = new SpelExpressionParser(config);

Expression expression = parser.parseExpression("list[3]");

Demo demo = new Demo();

Object o = expression.getValue(demo);

// demo.list will now be a real collection of 4 entries
// Each entry is a new empty String
```

默认情况下，SpEL 表达式不能包含超过 10,000 个字符；然而，`maxExpressionLength` 是可以配置的。如果你以编程方式创建 `SpelExpressionParser`，可以在创建提供给 `SpelExpressionParser` 的 `SpelParserConfiguration` 时指定一个自定义的 `maxExpressionLength`。如果你希望设置用于解析 SpEL 表达式的 `maxExpressionLength`，例如在 `ApplicationContext` 中（例如，在 XML Bean 定义中、`@Value` 注解中等），可以设置一个名为 `spring.context.expression.maxLength` 的 JVM 系统属性或 Spring 属性，来指定你的应用程序所需的最大表达式长度（参见支持的 Spring 属性）。

## SpEL 编译

Spring 提供了一个用于 SpEL 表达式的基本编译器。通常，表达式是解释执行的，这提供了在评估过程中高度的动态灵活性，但却不能提供最佳的性能。对于偶尔使用的表达式，这种方式是可以接受的，但当它被其他组件如 Spring Integration 使用时，性能可能变得非常重要，而且在这种情况下并不需要太多的动态性。

SpEL 编译器旨在解决这个问题。在评估过程中，编译器会生成一个 Java 类，该类在运行时体现表达式的行为，并使用该类来实现更快速的表达式评估。由于表达式缺乏类型信息，编译器在执行编译时使用在解释执行期间收集的信息。例如，编译器无法单凭表达式知道属性引用的类型，但在第一次解释执行时，它会找出该类型。当然，如果依赖于此类推导出的信息来进行编译，当表达式元素的类型随着时间变化时，可能会引发问题。因此，编译最适用于那些类型信息在重复评估过程中不会发生变化的表达式。

考虑以下基本表达式。

```java
someArray[0].someProperty.someOtherProperty < 0.1
```

由于前面的表达式涉及数组访问、某些属性解引用和数值操作，因此性能提升非常明显。在一次 50,000 次迭代的微基准测试中，使用解释器评估表达式需要 75 毫秒，而使用编译版评估则仅需 3 毫秒。

### 编译器配置

默认情况下，编译器是关闭的，但你可以通过两种不同的方式打开它。你可以通过使用解析器配置过程（如前所述）来打开编译器，或者在 SpEL 用法嵌入到其他组件中时，使用 Spring 属性来启用它。本节讨论这两种方法。

编译器可以在以下三种模式之一下运行，这些模式定义在 `org.springframework.expression.spel.SpelCompilerMode` 枚举中。模式如下：

**OFF**

> 编译器关闭，所有表达式将在解释模式下进行评估。这是默认模式。
>

**IMMEDIATE**

> 在即时模式下，表达式会尽可能快地编译，通常是在第一次解释执行之后。如果已编译的表达式评估失败（例如，由于类型变化，如前所述），表达式评估的调用者将收到一个异常。如果表达式元素的类型随时间变化，考虑切换到混合模式或关闭编译器。
>

**MIXED**

> 在混合模式下，表达式评估会在解释模式和编译模式之间静默切换。经过若干次成功的解释执行后，表达式会被编译。如果已编译的表达式评估失败（例如，由于类型变化），该失败会被内部捕获，系统会为该表达式切换回解释模式。基本上，IMMEDIATE 模式下调用者收到的异常会在混合模式下被内部处理。稍后，编译器可能会生成另一个编译版本并切换到它。这个在解释模式和编译模式之间切换的循环将继续，直到系统判断继续尝试没有意义——例如，当达到某个失败阈值时——此时系统会永久切换到该表达式的解释模式。
>

即时模式存在的原因是混合模式可能会导致有副作用的表达式出现问题。如果编译的表达式在部分成功后崩溃，它可能已经做了一些影响系统状态的事情。如果发生了这种情况，调用者可能不希望它在解释模式下静默重新运行，因为表达式的一部分可能会被执行两次。

选择模式后，使用 `SpelParserConfiguration` 来配置解析器。以下示例展示了如何进行配置。

```java
SpelParserConfiguration config = new SpelParserConfiguration(SpelCompilerMode.IMMEDIATE,
		this.getClass().getClassLoader());

SpelExpressionParser parser = new SpelExpressionParser(config);

Expression expr = parser.parseExpression("payload");

MyMessage message = new MyMessage();

Object payload = expr.getValue(message);
```

当你指定编译器模式时，还可以指定一个 `ClassLoader`（允许传递 `null`）。编译后的表达式会在提供的 `ClassLoader` 下创建一个子 `ClassLoader`。重要的是，确保如果指定了 `ClassLoader`，它能够看到所有参与表达式评估过程的类型。如果没有指定 `ClassLoader`，则使用默认的 `ClassLoader`（通常是执行表达式评估时线程的上下文 `ClassLoader`）。

配置编译器的第二种方式适用于当 SpEL 嵌入到其他组件中时，并且可能无法通过配置对象进行配置。在这种情况下，可以通过 JVM 系统属性（或通过 SpringProperties 机制）设置 `spring.expression.compiler.mode` 属性，将其设置为 `SpelCompilerMode` 枚举值之一（off、immediate 或 mixed）。

### 编译器限制

Spring 不支持编译所有类型的表达式。主要关注的是那些可能在性能关键的上下文中使用的常见表达式。以下几种类型的表达式无法编译：

- 涉及赋值的表达式
- 依赖于转换服务的表达式
- 使用自定义解析器的表达式
- 使用重载运算符的表达式
- 使用数组构造语法的表达式
- 使用选择或投影的表达式
- 使用 Bean 引用的表达式

未来可能会支持更多类型表达式的编译。