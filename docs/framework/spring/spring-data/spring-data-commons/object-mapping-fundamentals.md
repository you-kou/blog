# 对象映射基础

本节介绍了 Spring Data 对象映射的基础知识，包括对象创建、字段和属性访问、可变性和不可变性。请注意，本节仅适用于不使用底层数据存储（如 JPA）对象映射的 Spring Data 模块。有关特定数据存储的对象映射（如索引、自定义列或字段名称等），请务必参考特定存储的章节。

Spring Data 对象映射的核心职责是创建领域对象的实例，并将存储原生数据结构映射到这些对象上。这意味着我们需要两个基本步骤：

1. 使用公开的构造函数之一进行实例创建。
2. 填充实例以实现所有公开的属性。

## 对象创建

Spring Data 会自动尝试检测用于实例化该类型对象的持久实体构造函数。解析算法如下：

1. 如果有一个使用 @PersistenceCreator 注解的静态工厂方法，则使用该方法。
2. 如果只有一个构造函数，则使用该构造函数。
3. 如果有多个构造函数，并且正好有一个使用 @PersistenceCreator 注解，则使用该构造函数。
4. 如果类型是 Java Record，则使用规范构造函数。
5. 如果有无参构造函数，则使用该构造函数，其他构造函数将被忽略。

值解析假设构造函数/工厂方法的参数名称与实体的属性名称匹配，即解析将按照填充属性的方式进行，包括映射中的所有自定义（不同的数据存储列或字段名称等）。这也要求类文件中有参数名称信息，或者构造函数上存在 @ConstructorProperties 注解。

可以使用 Spring Framework 的 @Value 注解，并结合存储特定的 SpEL 表达式来自定义值解析。有关更多详细信息，请参考特定存储的映射章节。

### 对象创建内部机制

为了避免反射的开销，Spring Data 默认使用一个在运行时生成的工厂类，该类会直接调用领域类的构造函数。即对于这个示例类型：

```java
class Person {
  Person(String firstname, String lastname) { … }
}
```

我们将在运行时创建一个语义上等效于以下的工厂类：

```java
class PersonObjectInstantiator implements ObjectInstantiator {

  Object newInstance(Object... args) {
    return new Person((String) args[0], (String) args[1]);
  }
}
```

这为我们提供了大约 10% 的性能提升，避免了反射的开销。为了使域类能够进行这种优化，它需要遵守以下约束条件：

- 它不能是私有类
- 它不能是非静态内部类
- 它不能是 CGLib 代理类
- Spring Data 使用的构造函数不能是私有的

如果满足其中任何一个条件，Spring Data 将回退到通过反射实例化实体。

## 属性填充

一旦实体的实例被创建，Spring Data 会填充该类的所有剩余持久化属性。除非已经通过实体的构造函数填充（即通过其构造函数参数列表传递），否则标识符属性将首先被填充，以便解析循环对象引用。之后，所有未被构造函数填充的非瞬态属性会被设置到实体实例上。为此，我们使用以下算法：

- 如果属性是不可变的，但暴露了 `with...` 方法（见下文），我们使用 `with...` 方法来创建一个新的实体实例并更新属性值。
- 如果定义了属性访问（即通过 getter 和 setter），我们调用 setter 方法。
- 如果属性是可变的，我们直接设置字段值。
- 如果属性是不可变的，我们使用持久化操作要使用的构造函数（见对象创建）来创建该实例的副本。

默认情况下，我们直接设置字段值。

### 属性填充内部实现

类似于我们在对象构造中的优化，Spring Data 还使用运行时生成的访问器类来与实体实例交互。

```java
class Person {

  private final Long id;
  private String firstname;
  private @AccessType(Type.PROPERTY) String lastname;

  Person() {
    this.id = null;
  }

  Person(Long id, String firstname, String lastname) {
    // Field assignments
  }

  Person withId(Long id) {
    return new Person(id, this.firstname, this.lastame);
  }

  void setLastname(String lastname) {
    this.lastname = lastname;
  }
}
```

生成的属性访问器

```java
class PersonPropertyAccessor implements PersistentPropertyAccessor {

  private static final MethodHandle firstname;

  private Person person;

  public void setProperty(PersistentProperty property, Object value) {

    String name = property.getName();

    if ("firstname".equals(name)) {
      firstname.invoke(person, (String) value);
    } else if ("id".equals(name)) {
      this.person = person.withId((Long) value);
    } else if ("lastname".equals(name)) {
      this.person.setLastname((String) value);
    }
  }
}
```

让我们来看一下以下实体：

```java
class Person {

  private final @Id Long id;
  private final String firstname, lastname;
  private final LocalDate birthday;
  private final int age;

  private String comment;
  private @AccessType(Type.PROPERTY) String remarks;

  static Person of(String firstname, String lastname, LocalDate birthday) {

    return new Person(null, firstname, lastname, birthday,
      Period.between(birthday, LocalDate.now()).getYears());
  }

  Person(Long id, String firstname, String lastname, LocalDate birthday, int age) {

    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.birthday = birthday;
    this.age = age;
  }

  Person withId(Long id) {
    return new Person(id, this.firstname, this.lastname, this.birthday, this.age);
  }

  void setRemarks(String remarks) {
    this.remarks = remarks;
  }
}
```

