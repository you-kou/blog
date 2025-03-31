# ControllerAdvice

```java
@Target(TYPE)
@Retention(RUNTIME)
@Documented
@Component
public @interface ControllerAdvice
```

@Component 的专业化用于声明 @ExceptionHandler、@InitBinder 或 @ModelAttribute 方法的类，这些方法可以在多个 @Controller 类之间共享。

带有 @ControllerAdvice 注解的类可以显式声明为 Spring Bean，或者通过类路径扫描自动检测到。所有这些 Bean 根据 Ordered 语义或 @Order / @Priority 声明进行排序，其中 Ordered 语义优先于 @Order / @Priority 声明。@ControllerAdvice Bean 会按该顺序在运行时应用。然而，@ControllerAdvice Bean 实现了 PriorityOrdered 的情况下，并不会优先于实现 Ordered 的 @ControllerAdvice Bean。此外，对于作用域 @ControllerAdvice Bean（例如请求作用域或会话作用域的 Bean），Ordered 不会被遵循。对于异常处理，@ExceptionHandler 会在第一个匹配的异常处理方法的建议中被选中。对于模型属性和数据绑定初始化，@ModelAttribute 和 @InitBinder 方法将遵循 @ControllerAdvice 的顺序。

注意：对于 @ExceptionHandler 方法，根异常匹配优先于仅匹配当前异常的原因，尤其是在特定建议 Bean 的处理方法中。然而，高优先级建议中的原因匹配仍然优先于低优先级建议 Bean 中的任何匹配（无论是根级别还是原因级别）。因此，请在具有相应优先级的建议 Bean 上声明主要的根异常映射。

默认情况下，@ControllerAdvice 中的方法全局应用于所有控制器。可以使用诸如 annotations()、basePackageClasses() 和 basePackages()（或其别名 value()）等选择器来定义一个更狭窄的目标控制器子集。如果声明了多个选择器，则会应用布尔 OR 逻辑，这意味着选定的控制器至少应该匹配一个选择器。请注意，选择器检查是在运行时执行的，因此添加多个选择器可能会对性能产生负面影响，并增加复杂性。