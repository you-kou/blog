[`ResponseEntity`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/ResponseEntity.html) 是 **Spring Framework** 中的一个重要类，通常用于在 Web 层构建和返回 HTTP 响应，它是 **Spring MVC** 中 `@ResponseBody` 注解的核心组成部分，能帮助我们灵活地控制 HTTP 响应的状态码、头信息以及响应体内容。

## 基本概念

`ResponseEntity` 是一个通用的响应实体类，用来包装返回的内容、响应的状态码、以及可选的响应头信息。它允许开发人员在控制器方法中灵活地定制 HTTP 响应。

## 构造方法

`ResponseEntity` 提供了几种构造方式：

1. **只包含响应体**

   ```java
   ResponseEntity<T> response = new ResponseEntity<>(T body);
   ```

   - 只包含响应体内容，状态码默认是 `200 OK`。

2. **包含响应体和状态码**

   ```java
   ResponseEntity<T> response = new ResponseEntity<>(T body, HttpStatus status);
   ```

   - 允许设置响应体内容和 HTTP 状态码。

3. **包含响应体、状态码和自定义头信息**

   ```java
   ResponseEntity<T> response = new ResponseEntity<>(T body, HttpHeaders headers, HttpStatus status);
   ```

   - 允许设置响应体内容、

## 常用的方法

### `ResponseEntity` 的静态构造方法

- **`ResponseEntity.ok()`**

  - 用于返回状态码 `200 OK`，并且可以设置响应体。

  ```java
  return ResponseEntity.ok("This is a successful response.");
  ```

- **`ResponseEntity.status(HttpStatus status)`**

  - 用于设置自定义的 HTTP 状态码。

  ```java
  return ResponseEntity.status(HttpStatus.CREATED).body("Resource created successfully.");
  ```

- **`ResponseEntity.created(URI location)`**

  - 用于设置 HTTP 状态码为 `201 Created`，并设置 `Location` 头部指向新创建的资源 URI。

  ```java
  URI location = URI.create("/resources/1");
  return ResponseEntity.created(location).body("Resource created.");
  ```

- **`ResponseEntity.noContent()`**

  - 用于返回无内容的响应，通常用于 `204 No Content` 状态码。

  ```java
  return ResponseEntity.noContent().build();
  ```

- **`ResponseEntity.accepted()`**

  - 用于返回 `202 Accepted` 状态码。

  ```java
  return ResponseEntity.accepted().body("Request accepted for processing.");
  ```

###  设置响应体、状态码和头部

`ResponseEntity` 本身也允许你手动设置响应体、状态码以及响应头。

- **设置响应体、状态码和头部**

  ```java
  HttpHeaders headers = new HttpHeaders();
  headers.add("Custom-Header", "HeaderValue");
  
  return new ResponseEntity<>("Response body", headers, HttpStatus.OK);
  ```

- **构造空响应体，带有头部和状态码**

  ```java
  HttpHeaders headers = new HttpHeaders();
  headers.add("Custom-Header", "HeaderValue");
  
  return new ResponseEntity<>(headers, HttpStatus.NO_CONTENT);
  ```

### 链式调用的响应设置方法

`ResponseEntity` 也提供了一些方法可以进行链式调用来设置响应信息：

- **`header(String headerName, String... headerValues)`**

  - 用于向响应头中添加自定义头信息。

  ```java
  return ResponseEntity.ok()
           .header("X-Custom-Header", "CustomValue")
           .body("Response with custom header");
  ```

- **`headers(HttpHeaders headers)`**

  - 用于设置完整的响应头信息。

  ```java
  HttpHeaders headers = new HttpHeaders();
  headers.add("Content-Type", "application/json");
  
  return ResponseEntity.ok().headers(headers).body("Response with full headers");
  ```

- **`build()`**

  - 用于构建没有响应体的响应（比如 `204 No Content`）。

  ```java
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  ```

## 常见的应用场景

- **自定义 HTTP 状态码**：通过 `ResponseEntity` 可以方便地设置不同的 HTTP 状态码，适用于需要返回成功、失败或其他状态的场景。

  例如，返回 `404` 错误：

  ```java
  return new ResponseEntity<>("Resource not found", HttpStatus.NOT_FOUND);
  ```

- **返回带有头信息的响应**：可以通过 `ResponseEntity` 设置自定义的响应头，适用于需要返回额外元数据的情况，如设置 CORS 或缓存相关的头信息。

  例如，设置自定义头：

  ```java
  HttpHeaders headers = new HttpHeaders();
  headers.add("Custom-Header", "HeaderValue");
  return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
  ```

- **返回空响应体**：可以使用 `ResponseEntity` 返回一个不带响应体的响应，常用于某些 API 在成功执行后不需要返回数据的情况。

  例如，返回 `204 No Content` 状态码：

  ```java
  return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  ```
