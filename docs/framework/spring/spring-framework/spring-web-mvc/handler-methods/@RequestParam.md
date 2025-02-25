# `@RequestParam`

您可以使用  [`@RequestParam`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestparam.html) 注解将查询参数绑定到控制器方法的参数。

以下代码示例展示了其用法：

```java
@Controller
@RequestMapping("/pets")
public class EditPetForm {

	// ...

	@GetMapping
	public String setupForm(@RequestParam("petId") int petId, Model model) {
		Pet pet = this.clinic.loadPet(petId);
		model.addAttribute("pet", pet);
		return "petForm";
	}

	// ...

}
```

默认情况下，使用此注解的方法参数是必填的，但您可以通过将 @RequestParam 注解的 required 标志设置为 false，或者使用 java.util.Optional 包装参数，使方法参数变为可选。

如果目标方法参数的类型不是 String，Spring 会自动进行类型转换。

将参数类型声明为数组或列表可以解析同一参数名称的多个值。

当 @RequestParam 注解被声明为 Map<String, String> 或 MultiValueMap<String, String>，且未在注解中指定参数名称时，该映射会填充请求中的所有参数名称及其对应的值。以下示例展示了如何在表单数据处理中使用该功能：

```java
@Controller
@RequestMapping("/pets")
class EditPetForm {

	// ...

	@PostMapping(path = "/process", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public String processForm(@RequestParam MultiValueMap<String, String> params) {
		// ...
	}

	// ...
}
```

请注意，@RequestParam 的使用是可选的（例如，用于设置其属性）。默认情况下，任何简单值类型的参数（由 BeanUtils#isSimpleProperty 确定）且未被其他参数解析器解析时，都会被视为已使用 @RequestParam 进行注解。