# PageHelper在一对一和一对多结果映射的分页查询中统计失准的问题

> **为什么不支持一对一和一对多结果映射的分页查询？**
>
> 在一对一和一对多时，根据分页条件查询出100条数据时，由于一对一和一对多会去重，经过嵌套处理后数据量会减少，因此分页想要获得100条数据无法实现。想要支持这种情况可以使用嵌套查询。嵌套查询会额外执行SQL，主SQL可以得到正确的结果数量，因此可以正常分页。

在使用 **PageHelper** 和 **MyBatis** 进行分页查询时，如果涉及 **LEFT JOIN** 或其他 **JOIN** 操作，尤其是 **一对多** 关系，可能会导致分页统计不准确。其根本原因在于：

- **LEFT JOIN** 会产生重复的主表记录。
- **count(\*)** 统计了这些重复行，导致 **PageHelper** 计算的总条数偏大。
- **MyBatis ResultMap** 去重只保留唯一主对象，最终结果数减少，导致分页页数、数据不符。

## 现象还原

### 1. 数据库建表

先创建 **用户表** 和 **订单表**，模拟一对多关系：

```sql
-- 用户表
CREATE TABLE `user` (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP
);

-- 订单表
CREATE TABLE `order` (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    order_date TIMESTAMP,
    total_amount DOUBLE
);
```

### 2. 插入测试数据

插入几条模拟数据，确保有用户有多笔订单的情况：

```sql
-- 插入用户数据
INSERT INTO `user` (user_id, username, email, created_at)
VALUES
    (1, 'Alice', 'alice@example.com', '2023-10-01 10:00:00'),
    (2, 'Bob', 'bob@example.com', '2023-10-02 11:00:00');

-- 插入订单数据
INSERT INTO `order` (order_id, user_id, order_date, total_amount)
VALUES
    (101, 1, '2023-10-03 12:00:00', 100.00),
    (102, 1, '2023-10-04 13:00:00', 200.00),
    (103, 2, '2023-10-05 14:00:00', 150.00);
```

**预期数据结构**

- **Alice** 有 **2** 个订单
- **Bob** 有 **1** 个订单

### 3. Spring Boot 项目搭建

创建 Spring Boot 项目，这里展示关键代码

#### Mapper 配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="online.snippet.pagehelper.mapper.UserMapper">

    <!-- 用户和订单关联映射 -->
    <resultMap id="UserResultMap" type="online.snippet.pagehelper.entity.User">
        <id property="userId" column="user_id" />
        <result property="username" column="username" />
        <result property="email" column="email" />
        <result property="createdAt" column="created_at" />

        <!-- 嵌套订单数据 -->
        <collection property="orders" ofType="online.snippet.pagehelper.entity.Order" notNullColumn="order_id">
            <id property="orderId" column="order_id" />
            <result property="userId" column="order_user_id" />
            <result property="orderDate" column="order_date" />
            <result property="totalAmount" column="total_amount" />
        </collection>
    </resultMap>

    <!-- 查询用户订单 -->
    <select id="selectUserOrders" resultMap="UserResultMap">
        SELECT
            u.user_id,
            u.username,
            u.email,
            u.created_at,
            o.order_id,
            o.user_id AS order_user_id,
            o.order_date,
            o.total_amount
        FROM `user` u
        LEFT JOIN `order` o ON u.user_id = o.user_id
    </select>
</mapper>
```

#### Controller 接口

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        // 开启分页
        PageHelper.startPage(pageNum, pageSize);

        // 执行查询
        List<User> users = userMapper.selectUserOrders();

        // 返回分页结果
        return ResponseEntity.ok(new PageInfo<>(users));
    }
}
```

### 4. 测试接口，还原问题现象

用 Postman 或浏览器访问接口：

```bash
GET /users/orders?pageNum=1&pageSize=10
```

**返回结果（有误差）**

```json
{
  "total": 3,
  "list": [
    {
      "userId": 1,
      "username": "Alice",
      "orders": [
        {"orderId": 101, "totalAmount": 100.0},
        {"orderId": 102, "totalAmount": 200.0}
      ]
    },
    {
      "userId": 2,
      "username": "Bob",
      "orders": [
        {"orderId": 103, "totalAmount": 150.0}
      ]
    }
  ]
}
```

预期总用户数是 2（Alice、Bob），但实际 total 返回 3，因为 LEFT JOIN 导致重复行被多算了一条。

## 原因解析

### MyBatis的ResultMap去重机制

MyBatis的 **ResultMap** 会对主对象（`User`）去重，核心逻辑是按主键 **id** 判断是否重复。

- 如果`user_id`相同，只合并子对象`Order`到原来的`User`对象里。
- 但`count(*)` 不懂 **ResultMap** 的去重逻辑，只知道“每行都算1次”，所以统计错了。

**示例结果表**：

| user_id | username | order_id | total_amount |
| ------- | -------- | -------- | ------------ |
| 1       | Alice    | 101      | 100.00       |
| 1       | Alice    | 102      | 200.00       |
| 2       | Bob      | 103      | 150.00       |

### PageHelper的问题本质

- **count(\*)** 统计3条，但最终MyBatis只返回2条用户。

## 解决方案

### 方案一：嵌套查询（官方推荐）

- **第1次查询**：只查主表，按用户分页。
- **第2次查询**：按分页结果查子表。

```
<select id="selectUser" resultMap="UserResultMap">
    SELECT * FROM user LIMIT #{pageNum}, #{pageSize}
</select>

<select id="selectOrders" resultMap="OrderResultMap">
    SELECT * FROM orders WHERE user_id = #{userId}
</select>
```

### 方案二：手动优化 count 查询

在一对多关联查询场景下，PageHelper 默认生成的 `count(*)` 查询可能导致统计结果不准确。我们可以利用 `setCountColumn` 方法手动优化 `count` 查询：

```java
PageHelper.startPage(pageNum, pageSize)
    .setCountColumn("DISTINCT u.user_id");
```

这样 `count()` 统计的就是 **去重后的真实用户数量** 了。

#### PageHelper 源码分析

在追踪 `PageHelper` 生成 `count` SQL 的过程中，我们定位到了 `DefaultCountSqlParser` 类的 `getSmartCountSql` 方法。

它内部调用了 `sqlToCount` 方法，将原始查询转换为 `count()` 形式：

```java
List<SelectItem<?>> COUNT_ITEM = new ArrayList<>();
COUNT_ITEM.add(new SelectItem(new Column("count(" + name + ")")));
```

默认情况下，`name = '0'`，生成的 `count` 语句类似于：

```sql
SELECT count(0) 
FROM user u 
LEFT JOIN orders o ON u.id = o.user_id;
```

如果原始 SQL 是一对多关联查询，结果集会出现重复行，这时 `count(*)` 统计的是“总行数”而不是“去重后的记录数”，导致统计结果偏大。

##### setCountColumn 方法的作用

`setCountColumn` 方法的作用就是 **修改上述代码中 `name` 变量的值**，从而改变 `count()` 的生成逻辑。

比如我们设置：

```java
.setCountColumn("DISTINCT u.user_id")
```

最终生成的 SQL 变成：

```sql
SELECT count(DISTINCT u.user_id) 
FROM user u 
LEFT JOIN orders o ON u.id = o.user_id;
```

这样统计的就是去重后的用户数，避免了重复统计的问题。