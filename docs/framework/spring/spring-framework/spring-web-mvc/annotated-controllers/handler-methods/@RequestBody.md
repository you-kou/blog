# `@RequestBody`

您可以使用 @RequestBody 注解，将请求体读取并通过 HttpMessageConverter 反序列化为一个对象。

以下示例展示了 @RequestBody 参数的用法：

```java
@PostMapping("/accounts")
public void handle(@RequestBody Account account) {
	// ...
}
```

您可以将 @RequestBody 与 jakarta.validation.Valid 或 Spring 的 @Validated 注解结合使用，这两者都会触发标准 Bean 验证（Standard Bean Validation）。默认情况下，验证错误会导致抛出 MethodArgumentNotValidException，并返回 400（BAD_REQUEST）响应。

另外，您也可以在控制器内通过 Errors 或 BindingResult 参数本地处理验证错误，如下示例所示：

```java
@PostMapping("/accounts")
public void handle(@Valid @RequestBody Account account, Errors errors) {
	// ...
}
```

如果由于其他参数带有 @Constraint 注解而触发方法级验证，则会抛出 HandlerMethodValidationException。