# 静态资源

这个选项提供了一种方便的方式，从基于 `Resource` 的位置列表中提供静态资源。

在下一个示例中，假设请求以 `/resources` 开头，系统将使用相对路径来查找并提供静态资源，这些资源相对于 Web 应用程序根目录下的 `/public` 或类路径下的 `/static`。这些资源会设置为一年后的过期时间，以确保浏览器缓存得到最大化利用，从而减少浏览器发出的 HTTP 请求。`Last-Modified` 信息从 `Resource#lastModified` 推导而来，以便支持带有 "Last-Modified" 头的 HTTP 条件请求。

以下代码示例展示了如何实现：

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**")
				.addResourceLocations("/public", "classpath:/static/")
				.setCacheControl(CacheControl.maxAge(Duration.ofDays(365)));
	}
}
```

另请参阅静态资源的 HTTP 缓存支持。

资源处理器还支持一系列 `ResourceResolver` 实现和 `ResourceTransformer` 实现，你可以利用这些实现创建一个工具链，用于处理优化后的资源。

你可以使用 `VersionResourceResolver` 来处理基于内容计算的 MD5 哈希、固定的应用版本或其他方式的版本化资源 URL。`ContentVersionStrategy`（MD5 哈希）是一个不错的选择——但有一些显著的例外情况，比如与模块加载器一起使用的 JavaScript 资源。

以下示例展示了如何使用 `VersionResourceResolver`：

```java
@Configuration
public class VersionedConfiguration implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**")
				.addResourceLocations("/public/")
				.resourceChain(true)
				.addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"));
	}
}
```

你可以使用 `ResourceUrlProvider` 来重写 URL，并应用完整的解析器和转换器链——例如，插入版本号。MVC 配置提供了一个 `ResourceUrlProvider` Bean，方便将其注入到其他组件中。你还可以通过 `ResourceUrlEncodingFilter` 使重写过程对 Thymeleaf、JSP、FreeMarker 等使用 URL 标签的模板引擎透明，支持依赖 `HttpServletResponse#encodeURL` 的功能。

请注意，当同时使用 `EncodedResourceResolver`（例如，用于提供 gzip 或 Brotli 压缩的资源）和 `VersionResourceResolver` 时，必须按照此顺序注册它们。这能确保基于内容的版本总是可靠地计算出来，基于未编码的文件。

对于 WebJars，推荐和最有效的使用方式是使用带版本号的 URL，例如 `/webjars/jquery/1.2.0/jquery.min.js`。相关资源位置默认在 Spring Boot 中配置（或者可以通过 `ResourceHandlerRegistry` 手动配置），无需添加 `org.webjars:webjars-locator-core` 依赖。

像 `/webjars/jquery/jquery.min.js` 这样没有版本号的 URL 也受支持，通过 `WebJarsResourceResolver` 实现，前提是 `org.webjars:webjars-locator-core` 库在类路径上存在，但这可能会导致类路径扫描，从而影响应用程序启动性能。该解析器可以重写 URL 以包括 jar 文件的版本号，还可以匹配没有版本号的传入 URL，例如，从 `/webjars/jquery/jquery.min.js` 重写为 `/webjars/jquery/1.2.0/jquery.min.js`。

> [!NOTE]
>
> 基于 `ResourceHandlerRegistry` 的 Java 配置提供了更精细的控制选项，例如，最后修改行为和优化的资源解析。

