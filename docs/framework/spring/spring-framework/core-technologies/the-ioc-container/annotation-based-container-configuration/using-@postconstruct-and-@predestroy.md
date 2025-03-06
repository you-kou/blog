# 使用 `@PostConstruct` 和 `@PreDestroy`

`CommonAnnotationBeanPostProcessor` 不仅识别 `@Resource` 注解，还识别 JSR-250 生命周期注解：`jakarta.annotation.PostConstruct` 和 `jakarta.annotation.PreDestroy`。这些注解在 Spring 2.5 中引入，提供了与初始化回调和销毁回调机制不同的替代方法。只要在 Spring 的 `ApplicationContext` 中注册了 `CommonAnnotationBeanPostProcessor`，携带这些注解的方法将在生命周期的相应点被调用，就像对应的 Spring 生命周期接口方法或显式声明的回调方法一样。以下示例演示了如何在初始化时预填充缓存，并在销毁时清除缓存：

```java
public class CachingMovieLister {

	@PostConstruct
	public void populateMovieCache() {
		// populates the movie cache upon initialization...
	}

	@PreDestroy
	public void clearMovieCache() {
		// clears the movie cache upon destruction...
	}
}
```

有关结合各种生命周期机制的详细信息，请参阅《结合生命周期机制》。

> [!NOTE]
>
> 像 @Resource 一样，@PostConstruct 和 @PreDestroy 注解类型是 JDK 6 到 8 标准 Java 库的一部分。然而，整个 javax.annotation 包在 JDK 9 中从核心 Java 模块中分离出来，并最终在 JDK 11 中被移除。从 Jakarta EE 9 开始，该包现在位于 jakarta.annotation。如果需要，jakarta.annotation-api 需要通过 Maven Central 获取，并像其他库一样添加到应用程序的类路径中。

