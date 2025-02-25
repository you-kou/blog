# 获取 HTTP 请求参数

在 Spring Boot 中，HTTP 请求传来的数据可以通过多种方式获取，具体取决于数据的来源（如 URL 路径、查询参数、请求体、请求头等）。以下是常见的获取方式总结：

## 从 URL 路径中获取数据

使用 `@PathVariable`。

**代码示例**

```java
@GetMapping("/user/{id}")
public String getUserById(@PathVariable String id) {
    return "User ID: " + id;
}
```

**请求示例**

- URL: `/user/123`
- 提取的 `id`: `123`

## 从查询参数中获取数据

使用 `@RequestParam`。

**代码示例**

```java
@GetMapping("/user")
public String getUserByName(@RequestParam String name) {
    return "User Name: " + name;
}
```

**请求示例**

- URL: `/user?name=John`
- 提取的 `name`: `John`

## 从请求体中获取数据

使用 `@RequestBody`，将请求体中的 JSON 或 XML 数据绑定到 Java 对象。

**代码示例**

```java
@PostMapping("/user")
public String createUser(@RequestBody User user) {
    return "User created: " + user.getName();
}
```

**请求示例**

请求体 (JSON):

```json
{
  "name": "John",
  "age": 30
}
```

## 从请求头中获取数据

使用 `@RequestHeader`。

**代码示例**

```java
@GetMapping("/user")
public String getUserAgent(@RequestHeader("User-Agent") String userAgent) {
    return "User Agent: " + userAgent;
}
```

**请求示例**

- 请求头: `User-Agent: Mozilla/5.0`
- 提取的 `userAgent`: `Mozilla/5.0`

## 从文件上传中获取数据

使用 `MultipartFile`，处理文件上传。

**代码示例**

```java
@PostMapping("/upload")
public String uploadFile(@RequestParam("file") MultipartFile file) {
    return "File uploaded: " + file.getOriginalFilename();
}
```

