# [Optional](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html)

```java
public final class Optional<T>
extends Object
```

一个容器对象，其内部可能包含也可能不包含非空值。如果存在值，`isPresent()` 返回 `true`；如果不存在值，该对象被视为空，`isPresent()` 返回 `false`。

提供了一些依赖于是否存在值的方法，例如 `orElse()`（如果不存在值则返回一个默认值）和 `ifPresent()`（如果存在值则执行某个操作）。

这是一个基于值的类；程序员应将相等的实例视为可互换的，并且不应将其实例用于同步操作，否则可能会导致不可预测的行为。例如，在未来的版本中，同步操作可能会失败。

> [!NOTE]
>
> `Optional` 主要用于作为方法的返回类型，用于明确表示“无结果”的情况，在这种情况下使用 `null` 可能会导致错误。其类型为 `Optional` 的变量本身不应为 `null`，而应始终指向一个 `Optional` 实例。

## 方法

### get

```java
public T get()
```

如果存在值，则返回该值；否则抛出 `NoSuchElementException`。

> [!NOTE]
>
> 推荐使用的方法是 `orElseThrow()`，作为该方法的替代方案。

**返回值：**
由该 `Optional` 描述的非空值

**异常：**
抛出 `NoSuchElementException`，如果没有值存在

### map

```java
public <U> Optional<U> map(Function<? super T,? extends U> mapper)
```

如果存在值，则返回一个 `Optional`，其描述了将给定的映射函数应用于该值后的结果（类似于通过 `ofNullable(T)` 得到的结果）；否则返回一个空的 `Optional`。
如果映射函数返回的结果为 `null`，则该方法返回一个空的 `Optional`。

> [!NOTE]
>
> 该方法支持对 `Optional` 值进行后续处理，无需显式检查返回状态。例如，以下代码遍历一个 URI 流，选择尚未处理的一个，并从该 URI 创建一个路径，返回一个 `Optional<Path>`：
>
> ```java
> Optional<Path> p =
>     uris.stream().filter(uri -> !isProcessedYet(uri))
>                   .findFirst()
>                   .map(Paths::get);
> ```
>
> 在此，`findFirst` 返回一个 `Optional<URI>`，随后 `map` 对该 URI 应用 `Paths.get` 并返回一个 `Optional<Path>`（如果存在目标 URI）。

**类型参数：**
`U` - 映射函数返回值的类型

**参数：**
`mapper` - 要应用于值的映射函数（如果值存在）

**返回值：**
一个 `Optional`，描述将映射函数应用于当前 `Optional` 中的值后的结果；如果当前没有值，则返回空的 `Optional`

**异常：**
抛出 `NullPointerException`，如果映射函数为 `null`

### orElseThrow

```java
public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier)
                                    throws X
```

如果存在值，则返回该值；否则抛出由异常提供函数生成的异常。

> [!NOTE]
>
> 可以使用带空参数列表的异常构造方法引用作为提供函数，例如：`IllegalStateException::new`

**类型参数：**
 `X` - 要抛出的异常类型

**参数：**
 `exceptionSupplier` - 用于生成要抛出的异常的提供函数

**返回值：**
 如果存在值，则返回该值

**异常：**
 抛出 `X`，如果没有值存在
 抛出 `NullPointerException`，如果没有值且异常提供函数为 `null`