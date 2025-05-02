# Spring Bean 和依赖注入

你可以自由使用任何标准的 Spring Framework 技术来定义你的 Bean 及其注入的依赖。我们通常推荐使用构造函数注入来装配依赖，并使用 @ComponentScan 查找 Bean。

如果你按照上述建议组织代码（将应用类放在顶层包中），可以在不带参数的情况下添加 @ComponentScan，或者使用 @SpringBootApplication 注解，它隐式包含了 @ComponentScan。你所有的应用组件（@Component、@Service、@Repository、@Controller 以及其他）都会自动注册为 Spring Bean。

以下示例展示了一个使用构造函数注入获取所需 RiskAssessor Bean 的 @Service Bean：

```java
import org.springframework.stereotype.Service;

@Service
public class MyAccountService implements AccountService {

	private final RiskAssessor riskAssessor;

	public MyAccountService(RiskAssessor riskAssessor) {
		this.riskAssessor = riskAssessor;
	}

	// ...

}
```

如果一个 Bean 有多个构造函数，你需要使用 @Autowired 标注你希望 Spring 使用的那个构造函数：

```java
@Service
public class MyAccountService implements AccountService {

	private final RiskAssessor riskAssessor;

	private final PrintStream out;

	@Autowired
	public MyAccountService(RiskAssessor riskAssessor) {
		this.riskAssessor = riskAssessor;
		this.out = System.out;
	}

	public MyAccountService(RiskAssessor riskAssessor, PrintStream out) {
		this.riskAssessor = riskAssessor;
		this.out = out;
	}

	// ...

}
```

> [!TIP]
>
> 注意，使用构造函数注入可以让 `riskAssessor` 字段被标记为 `final`，表示它之后不能被修改。

