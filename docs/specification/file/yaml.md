# YAML 文件格式

YAML（Yet Another Markup Language）是一种简洁易读的配置文件格式，常用于 Spring Boot、Kubernetes、Docker 等项目的配置管理。

## 基本语法

- **使用缩进表示层级关系（建议 2 个或 4 个空格，不允许使用 Tab）。**
- **键值对格式为 `key: value`，冒号 `:` 后必须有一个空格。**
- **支持字符串、数值、布尔值、列表、对象等多种数据类型。**

**示例：**

```yaml
server:
  port: 8080
  address: 127.0.0.1
```

------

## 注释

- `#` 号表示注释，行尾或独占一行均可。

**示例：**

```yaml
# 服务器配置
server:
  port: 8080  # 端口号
```

## 数据类型

YAML 支持多种数据类型，如字符串、数值、布尔值、列表和对象。

### 字符串

- 普通字符串可直接写，无需引号。
- 包含特殊字符（如 `:`、`#`、换行符等）时，需要使用引号。

**示例：**

```yaml
app:
  name: MyApp
  description: "Spring Boot 应用"
```

### 数值

- 数值可以直接写，不需要引号。

**示例：**

```yaml
server:
  port: 8080
```

### 布尔值

- `true` / `false`（大小写敏感）。

**示例：**

```yaml
feature:
  enabled: true
```

### 空值

- 使用 `null` 或者省略键值对。

**示例：**

```yaml
database:
  username: null  # 或者不写 username
```

## 数组（列表）

- 使用 `-` 表示列表元素，每个 `-` 号后要有一个空格。

**示例：**

```yaml
fruits:
  - apple
  - banana
  - orange
```

- 也可以使用 `[]` 形式：

```yaml
fruits: [apple, banana, orange]
```

## 对象（映射）

- 通过缩进嵌套定义对象（类似 JSON）。

**示例：**

```yaml
database:
  driver: com.mysql.cj.jdbc.Driver
  url: jdbc:mysql://localhost:3306/test
  username: root
  password: 123456
```

- 也可以使用 `{}` 形式：

```yaml
database: { driver: com.mysql.cj.jdbc.Driver, url: jdbc:mysql://localhost:3306/test }
```

------

## 变量引用

- 使用 `$(变量名)` 或 `${变量名}` 来引用已有值（仅限 Spring Boot）。

**示例：**

```yaml
server:
  port: 8080
  custom-port: ${server.port}  # 引用 server.port 的值
```

## 多环境配置

- 使用 `spring.profiles` 来管理不同环境配置。

**示例：**

```yaml
spring:
  profiles:
    active: dev  # 激活 dev 环境

---
spring:
  profiles: dev
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db

---
spring:
  profiles: prod
  datasource:
    url: jdbc:mysql://localhost:3306/prod_db
```

## 完整 YAML 配置示例

```yaml
server:
  port: 8080
  address: 127.0.0.1

spring:
  application:
    name: MyApp
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

logging:
  level:
    root: INFO

feature:
  enabled: true

fruits:
  - apple
  - banana
  - orange
```

## YAML vs. Properties 对比

| 特性         | `.properties`    | `.yaml`                    |
| ------------ | ---------------- | -------------------------- |
| **语法格式** | `key=value`      | 缩进层级结构               |
| **可读性**   | 结构扁平，不直观 | 结构清晰，易读             |
| **数据类型** | 仅支持字符串     | 支持字符串、整数、布尔值等 |
| **列表支持** | 逗号分隔 `a,b,c` | `-` 表示每个元素           |
| **嵌套结构** | `a.b.c=value`    | 直接使用缩进               |

**推荐使用 `.yaml`**，因其结构清晰，适用于复杂配置。