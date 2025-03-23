# 上传文件

本指南将带您了解创建服务器应用程序的过程，该应用程序可以接收 HTTP 多部分文件上传。

## 您将构建的内容

您将创建一个 Spring Boot Web 应用程序来接受文件上传，并构建一个简单的 HTML 界面用于上传测试文件。

## [创建项目](https://code-snippet.online/framework/spring/spring-boot/quick-start.html)

### starter 依赖

- Spring Web

- Thymeleaf

## 创建文件上传控制器

要在 Servlet 容器中上传文件，需要注册一个 `MultipartConfigElement` 类（在 `web.xml` 中对应 `<multipart-config>`）。不过，多亏了 Spring Boot，一切都会自动配置！

作为 Spring MVC 自动配置的一部分，Spring Boot 将创建一个 `MultipartConfigElement` Bean，并自动配置文件上传功能。

创建文件上传控制器`FileUploadController`，如下所示（文件位置： `src/main/java/com/example/uploadingfiles/FileUploadController.java`）：

```java
package com.example.uploadingfiles;

import java.io.IOException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.uploadingfiles.storage.StorageFileNotFoundException;
import com.example.uploadingfiles.storage.StorageService;

@Controller
public class FileUploadController {

	private final StorageService storageService;

	@Autowired
	public FileUploadController(StorageService storageService) {
		this.storageService = storageService;
	}

	@GetMapping("/")
	public String listUploadedFiles(Model model) throws IOException {

		model.addAttribute("files", storageService.loadAll().map(
				path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
						"serveFile", path.getFileName().toString()).build().toUri().toString())
				.collect(Collectors.toList()));

		return "uploadForm";
	}

	@GetMapping("/files/{filename:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

		Resource file = storageService.loadAsResource(filename);

		if (file == null)
			return ResponseEntity.notFound().build();

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}

	@PostMapping("/")
	public String handleFileUpload(@RequestParam("file") MultipartFile file,
			RedirectAttributes redirectAttributes) {

		storageService.store(file);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");

		return "redirect:/";
	}

	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}

}
```

`FileUploadController` 类使用 `@Controller` 注解，使 Spring MVC 能够检测到它并查找路由。每个方法都使用 `@GetMapping` 或 `@PostMapping` 进行标注，以将路径和 HTTP 操作绑定到特定的控制器方法。

在本例中：

- **`GET /`**：从 `StorageService` 获取当前上传文件的列表，并将其加载到 Thymeleaf 模板中。它使用 `MvcUriComponentsBuilder` 计算实际资源的链接。
- **`GET /files/{filename}`**：加载资源（如果存在），并通过 `Content-Disposition` 响应头将其发送到浏览器进行下载。
- **`POST /`**：处理多部分文件上传请求，并将文件交给 `StorageService` 进行保存。

> [!TIP]
>
> 在生产环境中，您更可能将文件存储在临时位置、数据库，或者 NoSQL 存储（如 MongoDB 的 GridFS）。**最好不要** 直接将文件存储在应用程序的文件系统中，以避免影响性能和可扩展性。

您需要提供一个 `StorageService`，以便控制器可以与存储层（例如文件系统）进行交互。以下代码（位于 `src/main/java/com/example/uploadingfiles/storage/StorageService.java`）展示了该接口：

```java
package com.example.uploadingfiles.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {

	void init();

	void store(MultipartFile file);

	Stream<Path> loadAll();

	Path load(String filename);

	Resource loadAsResource(String filename);

	void deleteAll();

}
```

您还需要四个类来支持存储服务：

```java
package com.example.uploadingfiles.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("storage")
public class StorageProperties {

	/**
	 * Folder location for storing files
	 */
	private String location;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

}
```

```java
package com.example.uploadingfiles.storage;

public class StorageException extends RuntimeException {

	public StorageException(String message) {
		super(message);
	}

	public StorageException(String message, Throwable cause) {
		super(message, cause);
	}
}
```

```java
package com.example.uploadingfiles.storage;

public class StorageFileNotFoundException extends StorageException {

	public StorageFileNotFoundException(String message) {
		super(message);
	}

	public StorageFileNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
```

```java
package com.example.uploadingfiles.storage;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileSystemStorageService implements StorageService {

	private final Path rootLocation;

	@Autowired
	public FileSystemStorageService(StorageProperties properties) {
        
        if(properties.getLocation().trim().length() == 0){
            throw new StorageException("File upload location can not be Empty."); 
        }

		this.rootLocation = Paths.get(properties.getLocation());
	}

	@Override
	public void store(MultipartFile file) {
		try {
			if (file.isEmpty()) {
				throw new StorageException("Failed to store empty file.");
			}
			Path destinationFile = this.rootLocation.resolve(
					Paths.get(file.getOriginalFilename()))
					.normalize().toAbsolutePath();
			if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
				// This is a security check
				throw new StorageException(
						"Cannot store file outside current directory.");
			}
			try (InputStream inputStream = file.getInputStream()) {
				Files.copy(inputStream, destinationFile,
					StandardCopyOption.REPLACE_EXISTING);
			}
		}
		catch (IOException e) {
			throw new StorageException("Failed to store file.", e);
		}
	}

	@Override
	public Stream<Path> loadAll() {
		try {
			return Files.walk(this.rootLocation, 1)
				.filter(path -> !path.equals(this.rootLocation))
				.map(this.rootLocation::relativize);
		}
		catch (IOException e) {
			throw new StorageException("Failed to read stored files", e);
		}

	}

	@Override
	public Path load(String filename) {
		return rootLocation.resolve(filename);
	}

	@Override
	public Resource loadAsResource(String filename) {
		try {
			Path file = load(filename);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			}
			else {
				throw new StorageFileNotFoundException(
						"Could not read file: " + filename);

			}
		}
		catch (MalformedURLException e) {
			throw new StorageFileNotFoundException("Could not read file: " + filename, e);
		}
	}

	@Override
	public void deleteAll() {
		FileSystemUtils.deleteRecursively(rootLocation.toFile());
	}

	@Override
	public void init() {
		try {
			Files.createDirectories(rootLocation);
		}
		catch (IOException e) {
			throw new StorageException("Could not initialize storage", e);
		}
	}
}
```

## 配置静态资源映射

为了让上传的文件可以通过 URL 访问，需要配置静态资源映射。在 Spring Boot 中，可以通过实现 `WebMvcConfigurer` 来添加自定义的静态资源映射：

```java
package com.example.uploadingfiles.config;

import com.example.uploadingfiles.storage.StorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private StorageProperties properties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将本地文件目录映射为 /uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + properties.getLocation() + "/");
    }
}
```

## 调整文件上传限制

在配置文件上传时，通常需要设置文件大小的限制。试想一下，如何处理一个 5GB 的文件上传！在 Spring Boot 中，我们可以通过一些属性设置来调整其自动配置的 `MultipartConfigElement`。

将以下属性添加到现有的属性设置中（位于 `src/main/resources/application.properties`）：

```properties
spring.servlet.multipart.max-file-size=128KB
spring.servlet.multipart.max-request-size=128KB
```

多部分设置的限制如下：

- `spring.servlet.multipart.max-file-size` 设置为 128KB，这意味着单个文件的大小不能超过 128KB。
- `spring.servlet.multipart.max-request-size` 设置为 128KB，这意味着整个 multipart/form-data 请求的总大小不能超过 128KB。

## 更新应用程序

您希望指定一个目标文件夹用于上传文件，因此需要增强 Spring Initializr 创建的基础 `UploadingFilesApplication` 类，并添加一个 Boot `CommandLineRunner`，在启动时删除并重新创建该文件夹。以下代码示例（来自 `src/main/java/com/example/uploadingfiles/UploadingFilesApplication.java`）展示了如何实现：

```java
package com.example.uploadingfiles;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import com.example.uploadingfiles.storage.StorageProperties;
import com.example.uploadingfiles.storage.StorageService;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class UploadingFilesApplication {

	public static void main(String[] args) {
		SpringApplication.run(UploadingFilesApplication.class, args);
	}

	@Bean
	CommandLineRunner init(StorageService storageService) {
		return (args) -> {
			storageService.deleteAll();
			storageService.init();
		};
	}
}
```

## 运行应用程序

`@SpringBootApplication` 是一个便利注解，它包含了以下所有功能：

- **`@Configuration`**：将类标记为应用程序上下文的 Bean 定义源。
- **`@EnableAutoConfiguration`**：告诉 Spring Boot 根据类路径设置、其他 Bean 和各种属性设置开始添加 Bean。例如，如果类路径中包含 `spring-webmvc`，此注解会将应用程序标记为 Web 应用程序，并激活关键行为，如设置 `DispatcherServlet`。
- **`@ComponentScan`**：告诉 Spring 在 `com/example` 包中查找其他组件、配置和服务，从而找到控制器。

`main()` 方法使用 Spring Boot 的 `SpringApplication.run()` 方法启动应用程序。您是否注意到没有一行 XML 代码？也没有 `web.xml` 文件。这个 Web 应用程序是 100% 纯 Java，您无需处理任何配置或基础设施。

## 测试您的应用程序

在我们的应用程序中，有多种方式可以测试这个特性。以下代码示例（来自 `src/test/java/com/example/uploadingfiles/FileUploadTests.java`）展示了一种使用 `MockMvc` 的方法，这样就不需要启动 Servlet 容器：

```java
package com.example.uploadingfiles;

import java.nio.file.Paths;
import java.util.stream.Stream;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.uploadingfiles.storage.StorageFileNotFoundException;
import com.example.uploadingfiles.storage.StorageService;

@AutoConfigureMockMvc
@SpringBootTest
public class FileUploadTests {

	@Autowired
	private MockMvc mvc;

	@MockBean
	private StorageService storageService;

	@Test
	public void shouldListAllFiles() throws Exception {
		given(this.storageService.loadAll())
				.willReturn(Stream.of(Paths.get("first.txt"), Paths.get("second.txt")));

		this.mvc.perform(get("/")).andExpect(status().isOk())
				.andExpect(model().attribute("files",
						Matchers.contains("http://localhost/files/first.txt",
								"http://localhost/files/second.txt")));
	}

	@Test
	public void shouldSaveUploadedFile() throws Exception {
		MockMultipartFile multipartFile = new MockMultipartFile("file", "test.txt",
				"text/plain", "Spring Framework".getBytes());
		this.mvc.perform(multipart("/").file(multipartFile))
				.andExpect(status().isFound())
				.andExpect(header().string("Location", "/"));

		then(this.storageService).should().store(multipartFile);
	}

	@SuppressWarnings("unchecked")
	@Test
	public void should404WhenMissingFile() throws Exception {
		given(this.storageService.loadAsResource("test.txt"))
				.willThrow(StorageFileNotFoundException.class);

		this.mvc.perform(get("/files/test.txt")).andExpect(status().isNotFound());
	}

}
```

在这些测试中，您使用各种 mock 来设置与控制器和 `StorageService` 的交互，同时还使用 `MockMultipartFile` 来模拟与 Servlet 容器本身的交互。

有关集成测试的示例，请参见 `FileUploadIntegrationTests` 类（位于 `src/test/java/com/example/uploadingfiles`）。