# `.properties` 文件格式

`.properties` 文件是一种基于键值对（key-value）的配置文件格式，通常用于 Java 应用程序（如 Spring Boot）进行配置。

## 基本格式

- 每行一个配置项，采用 `key=value` 或 `key: value` 的形式（推荐使用 `=`）。

- `key` 不能包含空格，`value` 可以包含空格。

  **示例：**

  ```properties
  server.port=8080
  spring.application.name=MyApp
  ```

##  注释

- 使用 `#` 或 `!` 开头的行表示注释。

  **示例：**

  ```properties
  # 这是一个注释
  ! 这也是一个注释
  server.port=8080
  ```

## 字符串值

- 值默认是字符串，不需要加引号。

- 如果值包含特殊字符（如 `=`、`:` 或 `#`），可以使用反斜杠 `\` 进行转义。

  **示例：**

  ```properties
  app.name=My Application
  special.character=This\=is\=a\=test
  ```

##  多行值

- 如果值太长，可以使用反斜杠 `\` 进行换行（续行）。

  **示例：**

  ```properties
  message=This is a very long message that \
          spans multiple lines.
  ```

------

## 数组/列表

- `.properties` 文件本身不支持原生数组或列表，但可以使用逗号分隔。

  **示例：**

  ```properties
  my.list=apple,banana,orange
  ```

- 另一种方式是使用索引（不常用）：

  ```properties
  my.list.0=apple
  my.list.1=banana
  my.list.2=orange
  ```

## 变量引用

- `.properties` 文件不支持直接引用其他键的值，但 Spring Boot 允许使用 `${}` 进行变量引用。

  **示例（Spring Boot）**：

  ```properties
  server.port=8080
  my.server.port=${server.port}
  ```

## 环境变量

- 在 Spring Boot 中，可以使用 `spring.profiles.active` 来指定不同的环境。

  **示例：**

  ```properties
  spring.profiles.active=dev
  ```

## 示例完整 `.properties` 文件

```properties
# 应用名称
spring.application.name=MyApp

# 服务器配置
server.port=8080
server.address=127.0.0.1

# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=123456

# 日志级别
logging.level.root=INFO

# 列表
my.list=item1,item2,item3

# 变量引用
custom.port=${server.port}
```

