[`HttpStatus`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/HttpStatus.html) 是 Spring 框架中的一个枚举类，表示 HTTP 响应的状态码。它定义了一系列常见的 HTTP 状态码及其对应的意义，用于在 Web 开发中标识 HTTP 响应的处理结果。`HttpStatus` 是 Spring 的 `ResponseEntity` 等类中常用的组件之一，允许开发者方便地设置和控制响应的状态码。

常见的 `HttpStatus` 枚举值包括：

- `OK` (200)
- `CREATED` (201)
- `ACCEPTED` (202)
- `NO_CONTENT` (204)
- `BAD_REQUEST` (400)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `INTERNAL_SERVER_ERROR` (500)
- `SERVICE_UNAVAILABLE` (503)
- `GATEWAY_TIMEOUT` (504)