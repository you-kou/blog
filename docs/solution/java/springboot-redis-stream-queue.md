---
description: 本文详细介绍了如何基于 Redis Stream 和 Spring Boot 搭建一个高效的订单异步处理框架。通过 Redis Stream 作为消息队列，将耗时操作异步化处理，提升系统的响应速度和吞吐量。文章涵盖了从配置到实现的完整开发步骤，适合开发者和架构师参考。
head:
  - [meta, { name: "keywords", content: "Redis Stream, Spring Boot, 订单异步处理, 消息队列, Redis, 电商系统, 高并发, 异步处理框架, 消费者组, 死信队列" }]
  - [meta, { property: "og:title", content: "基于 Redis Stream 的订单异步处理框架搭建" }]
  - [meta, { property: "og:description", content: "本文详细介绍了如何基于 Redis Stream 和 Spring Boot 搭建一个高效的订单异步处理框架。通过 Redis Stream 作为消息队列，将耗时操作异步化处理，提升系统的响应速度和吞吐量。文章涵盖了从配置到实现的完整开发步骤，适合开发者和架构师参考。" }]
---

# 基于 Redis Stream 的订单异步处理框架搭建

## 项目背景

在电商系统中，订单业务是一个核心模块，涉及订单的创建、更新和取消等操作。这些操作中，有些是耗时操作，例如库存扣减、支付处理、物流调度等。如果将这些操作放在主业务流程中同步处理，会导致用户请求的响应时间变长，影响用户体验。为了提高系统的响应速度和吞吐量，我们引入 Redis Stream 作为消息队列，将耗时操作异步化处理。

## 技术选型

- **Spring Boot 3.4.3**：核心框架，提供快速开发、自动配置和内嵌服务器支持。
- **`spring-boot-starter-web`**：提供 RESTful API 支持，用于构建订单相关的 HTTP 接口。
- **`spring-boot-starter-validation`**：提供数据校验功能，确保请求参数和配置数据的合法性。
- **`spring-boot-starter-data-redis`**：提供 Redis 操作支持，包括 RedisTemplate 和 Redis Stream API。
- **Redis Stream**：作为消息队列，支持消息的持久化和消费者组功能，用于异步处理耗时操作。
- **SLF4J + Logback**：提供日志记录功能，便于调试和监控。

## 开发详解

### 配置 Redis 连接和消息队列

#### Redis 连接配置

首先，我们需要在 `application.yml` 文件中配置 Redis 的连接信息。以下是配置内容：

```yaml
spring:
  redis:
    host: localhost      # Redis 服务器地址
    port: 6379           # Redis 端口
    database: 0          # Redis 数据库索引（默认 0）
    password:            # Redis 连接密码（如果没有密码，可留空）
    timeout: 5000ms      # 连接超时时间（单位：毫秒）

    lettuce:
      pool:
        min-idle: 10     # 连接池中的最小空闲连接数
        max-idle: 20     # 连接池中的最大空闲连接数
        max-active: 50   # 连接池的最大连接数
        max-wait: 5000ms # 连接池最大等待时间（负值表示无限等待）
```

**说明：**

- `host` 和 `port` 指定了 Redis 服务器的地址和端口。
- `database` 指定了 Redis 的数据库索引，默认为 0。
- `password` 是 Redis 的连接密码，如果没有密码可以留空。
- `timeout` 设置了连接超时时间，避免长时间等待。
- `lettuce.pool` 配置了 Lettuce 连接池的参数，包括最小空闲连接数、最大空闲连接数、最大连接数和最大等待时间。这些参数可以根据实际并发需求进行调整。

#### 消息队列配置

接下来，我们为订单业务定义了几个消息队列。每个队列对应一个 Redis Stream，并指定了消费者组名称。以下是配置内容：

```yaml
queue:
  groups:
    order-create:
      name: order:create:queue  # 订单创建队列的 Stream 名称
      group: order-group        # 消费者组名称
    order-update:
      name: order:update:queue  # 订单更新队列的 Stream 名称
      group: order-group        # 消费者组名称
    order-cancel:
      name: order:cancel:queue  # 订单取消队列的 Stream 名称
      group: user-group         # 消费者组名称
```

**说明：**

- `order-create`、`order-update` 和 `order-cancel` 分别对应订单创建、订单更新和订单取消的业务场景。
- `name` 是 Redis Stream 的名称，用于标识不同的消息队列。
- `group` 是消费者组的名称，用于将多个消费者组织在一起，共同处理消息。

#### 配置的作用

- **Redis 连接配置**：确保应用程序能够正确连接到 Redis 服务器，并通过连接池管理连接资源，提高性能和稳定性。
- **消息队列配置**：定义了订单业务中需要处理的三种任务（创建、更新、取消），并为每种任务分配了独立的 Stream 和消费者组，便于后续的消息生产和消费。

### 实现队列配置类

实现 `QueueConfig` 类，用于加载 Redis Stream 和消费者组的配置。这个类通过 Spring Boot 的 `@ConfigurationProperties` 注解将配置文件中的队列配置映射到 Java 对象中，并提供了必要的验证功能。

#### 创建 `QueueConfig` 类

以下是 `QueueConfig` 类的完整代码：

```java
package online.snippet.redisstreammq.queue;

import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.Map;

/**
 * 队列配置类
 * <p>
 * 该类用于加载 Redis Stream 和消费者组的配置。
 */
@Component
@ConfigurationProperties(prefix = "queue")
@Validated // 启用配置验证
public class QueueConfig {

    @NotNull // 确保配置不为空
    private Map<String, StreamGroup> groups;

    /**
     * 获取队列和消费者组的映射
     *
     * @return 队列和消费者组的映射
     */
    public Map<String, StreamGroup> getGroups() {
        return groups;
    }

    /**
     * 设置队列和消费者组的映射
     *
     * @param groups 队列和消费者组的映射
     */
    public void setGroups(Map<String, StreamGroup> groups) {
        this.groups = groups;
    }

    /**
     * Redis Stream 和消费者组的映射类
     */
    public static class StreamGroup {
        @NotNull // 确保队列名称不为空
        private String name; // 队列名称

        @NotNull // 确保消费者组名称不为空
        private String group; // 消费者组名称

        /**
         * 获取队列名称
         *
         * @return 队列名称
         */
        public String getName() {
            return name;
        }

        /**
         * 设置队列名称
         *
         * @param name 队列名称
         */
        public void setName(String name) {
            this.name = name;
        }

        /**
         * 获取消费者组名称
         *
         * @return 消费者组名称
         */
        public String getGroup() {
            return group;
        }

        /**
         * 设置消费者组名称
         *
         * @param group 消费者组名称
         */
        public void setGroup(String group) {
            this.group = group;
        }

        @Override
        public String toString() {
            return "StreamGroup{" +
                    "name='" + name + '\'' +
                    ", group='" + group + '\'' +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "QueueConfig{" +
                "groups=" + groups +
                '}';
    }
}
```

#### 代码解析

- **`@ConfigurationProperties` 注解**：
  - 该注解用于将配置文件中的属性映射到 Java 对象中。
  - `prefix = "queue"` 表示从配置文件中加载以 `queue` 为前缀的属性。
- **`@Validated` 注解**：
  - 启用配置验证功能，确保配置属性的值符合要求。
- **`groups` 属性**：
  - 这是一个 `Map<String, StreamGroup>` 类型的属性，用于存储队列名称和对应的消费者组配置。
  - `@NotNull` 注解确保该属性不为空。
- **`StreamGroup` 内部类**：
  - 用于表示 Redis Stream 和消费者组的映射关系。
  - 包含两个属性：
    - `name`：队列名称，对应 Redis Stream 的名称。
    - `group`：消费者组名称，用于标识消费者组。
  - 这两个属性都通过 `@NotNull` 注解确保不为空。
- **`toString` 方法**：
  - 重写了 `toString` 方法，方便打印配置信息，便于调试。

#### 配置验证

- 在 `application.yml` 中定义的队列配置（如 `order-create`、`order-update` 等）会被自动映射到 `QueueConfig` 类的 `groups` 属性中。
- 如果配置文件中缺少必要的属性（如 `name` 或 `group`），或者属性值为空，Spring Boot 会抛出异常，提示配置错误。

### 定义队列常量

定义 `QueueConstants` 类，用于保存 Redis Stream 队列的名称。这个类是一个常量类，目的是集中管理队列名称，避免在代码中硬编码字符串，提高代码的可维护性和可读性。

#### 创建 `QueueConstants` 类

以下是 `QueueConstants` 类的完整代码：

```java
package online.snippet.redisstreammq.queue;

/**
 * 队列常量类，用于保存 Redis Stream 队列的名称
 */
public final class QueueConstants {

    // 私有构造函数，防止实例化
    private QueueConstants() {
        throw new UnsupportedOperationException("常量类不可实例化");
    }

    // 订单相关队列
    public static final String ORDER_CREATE_QUEUE = "order-create"; // 订单创建队列
    public static final String ORDER_UPDATE_QUEUE = "order-update"; // 订单更新队列
    public static final String ORDER_CANCEL_QUEUE = "order-cancel"; // 订单取消队列
}
```

#### 代码解析

- **`final` 类**：
  - `QueueConstants` 类被声明为 `final`，表示该类不可被继承。
- **私有构造函数**：
  - 构造函数被声明为 `private`，防止外部实例化该类。
  - 在构造函数中抛出了 `UnsupportedOperationException`，进一步确保该类不会被意外实例化。
- **常量定义**：
  - 定义了三个常量，分别表示订单创建队列、订单更新队列和订单取消队列的名称。
  - 这些常量的值与 `application.yml` 配置文件中的队列名称一致。
- **常量的作用**：
  - 集中管理队列名称，避免在代码中直接使用字符串，减少出错的可能性。
  - 提高代码的可读性和可维护性，例如在代码中可以通过 `QueueConstants.ORDER_CREATE_QUEUE` 来引用订单创建队列的名称。

### 定义消息处理器接口

我们`IMessageHandler` 接口，用于规范从 Redis Stream 中消费的消息的处理逻辑。这个接口是一个泛型接口，允许处理不同类型的消息内容。

#### 创建 `IMessageHandler` 接口

以下是 `IMessageHandler` 接口的完整代码：

```java
package online.snippet.redisstreammq.queue.handler;

/**
 * 消息处理器接口
 * <p>
 * 该接口定义了处理从 Redis Stream 中消费的消息的规范。
 * 只要 {@link #handle} 方法不抛出异常，就认为消息处理成功。
 *
 * @param <T> 消息内容的类型
 */
public interface IMessageHandler<T> {

    /**
     * 处理消息
     *
     * @param content 消息内容
     * @throws Exception 如果处理过程中发生错误，抛出异常
     */
    void handle(T content) throws Exception;
}
```

#### 代码解析

- **泛型接口**：
  - `IMessageHandler` 是一个泛型接口，`<T>` 表示消息内容的类型。
  - 通过泛型，可以支持处理不同类型的消息内容，例如订单创建消息、订单更新消息等。
- **`handle` 方法**：
  - 这是接口中定义的唯一方法，用于处理消息。
  - 方法参数 `content` 是消息内容，类型为泛型 `T`。
  - 方法可以抛出 `Exception`，表示在处理消息时如果发生错误，可以通过抛出异常来通知调用方。
- **设计目的**：
  - 该接口定义了消息处理的规范，任何实现了 `IMessageHandler` 的类都必须提供 `handle` 方法的实现。
  - 通过接口的方式，可以灵活地扩展不同的消息处理器，例如订单创建处理器、订单更新处理器等。

### 实现订单创建消息处理器

实现一个具体的消息处理器类 `OrderCreateHandler`，用于处理订单创建消息（其他消息处理类逻辑和 `OrderCreateHandler`类似，不再赘述）。这个类实现了 `IMessageHandler` 接口，并定义了处理订单创建消息的逻辑。

#### 创建 `OrderCreateHandler` 类

以下是 `OrderCreateHandler` 类的完整代码：

```java
package online.snippet.redisstreammq.queue.handler;

import online.snippet.redisstreammq.queue.QueueConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 订单创建消息处理器
 * <p>
 * 该处理器用于处理订单创建消息，模拟订单创建逻辑。
 */
@Component(QueueConstants.ORDER_CREATE_QUEUE) // 使用常量定义组件名称
public class OrderCreateHandler implements IMessageHandler<Map<String, String>> {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void handle(Map<String, String> content) {
        // 验证消息内容
        if (!isValidContent(content)) {
            logger.error("订单创建消息格式错误: {}", content);
            throw new IllegalArgumentException("订单创建消息格式错误");
        }

        // 解析消息内容
        String orderId = content.get("orderId");
        String userId = content.get("userId");
        double amount = Double.parseDouble(content.get("amount").replace("\"", ""));

        // 记录处理开始日志
        logger.info("开始处理订单创建消息: orderId={}, userId={}, amount={}", orderId, userId, amount);

        try {
            // 模拟订单创建耗时操作
            simulateOrderCreation();

            // 记录处理成功日志
            logger.info("订单创建消息处理成功: orderId={}", orderId);
        } catch (InterruptedException e) {
            // 记录中断异常日志
            logger.error("订单创建处理被中断: orderId={}", orderId, e);
            Thread.currentThread().interrupt(); // 恢复中断状态
            throw new RuntimeException("订单创建处理被中断", e); // 重新抛出异常，由上层处理
        } catch (Exception e) {
            // 记录其他异常日志
            logger.error("订单创建处理失败: orderId={}, 错误信息: {}", orderId, e.getMessage(), e);
            throw new RuntimeException("订单创建处理失败", e); // 重新抛出异常，由上层处理
        }
    }

    /**
     * 验证消息内容是否合法
     *
     * @param content 消息内容
     * @return 如果消息内容合法，返回 true；否则返回 false
     */
    private boolean isValidContent(Map<String, String> content) {
        return content != null
                && content.containsKey("orderId")
                && content.containsKey("userId")
                && content.containsKey("amount");
    }

    /**
     * 模拟订单创建耗时操作
     *
     * @throws InterruptedException 如果操作被中断
     */
    private void simulateOrderCreation() throws InterruptedException {
        Thread.sleep(5000); // 模拟耗时操作
    }
}
```

#### 代码解析

- **`@Component` 注解**：
  - 使用 `@Component` 注解将 `OrderCreateHandler` 类声明为 Spring 组件。
  - 组件的名称通过 `QueueConstants.ORDER_CREATE_QUEUE` 常量定义，确保与配置文件中的队列名称一致。
- **`IMessageHandler` 接口实现**：
  - 实现了 `IMessageHandler<Map<String, String>>` 接口，表示处理的消息内容是一个键值对形式的 `Map`。
  - `handle` 方法是消息处理的核心逻辑。
- **消息内容验证**：
  - 在 `handle` 方法中，首先调用 `isValidContent` 方法验证消息内容是否合法。
  - 如果消息内容缺少必要的字段（如 `orderId`、`userId`、`amount`），则抛出 `IllegalArgumentException`。
- **消息内容解析**：
  - 从 `Map` 中提取 `orderId`、`userId` 和 `amount` 字段。
  - `amount` 字段需要去除双引号并转换为 `double` 类型。
- **模拟订单创建逻辑**：
  - 调用 `simulateOrderCreation` 方法模拟订单创建的耗时操作（例如数据库写入、调用外部服务等）。
  - 通过 `Thread.sleep(5000)` 模拟 5 秒的耗时操作。
- **异常处理**：
  - 如果处理过程中发生中断（`InterruptedException`），记录错误日志并恢复中断状态。
  - 如果发生其他异常，记录错误日志并重新抛出异常，由上层逻辑处理。
- **日志记录**：
  - 使用 `Logger` 记录处理开始、处理成功和处理失败的日志，便于调试和监控。

### 实现消息处理器工厂类

实现 `MessageHandlerFactory` 类，用于动态加载所有实现了 `IMessageHandler` 接口的 Bean，并根据队列名称获取对应的处理器。这个工厂类的作用是将消息处理器与队列名称关联起来，便于在消费消息时快速找到对应的处理器。

#### 创建 `MessageHandlerFactory` 类

以下是 `MessageHandlerFactory` 类的完整代码：

```java
package online.snippet.redisstreammq.queue;

import online.snippet.redisstreammq.queue.handler.IMessageHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 消息处理器工厂类
 * <p>
 * 该类用于动态加载所有实现了 {@link IMessageHandler} 接口的 Bean，并根据条件获取对应的处理器。
 */
@Component
public class MessageHandlerFactory {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final Map<String, IMessageHandler<?>> handlerMap = new HashMap<>();

    @Autowired
    public MessageHandlerFactory(ApplicationContext context, QueueConfig queueConfig) {
        // 获取所有实现了 IMessageHandler 接口的 Bean
        Map<String, IMessageHandler> handlers = context.getBeansOfType(IMessageHandler.class);

        // 将处理器注册到 Map 中
        for (Map.Entry<String, IMessageHandler> entry : handlers.entrySet()) {
            String handlerBeanName = entry.getKey(); // Bean 的名称
            IMessageHandler<?> handler = entry.getValue(); // 处理器实例

            // 从 QueueConfig 中获取队列名称
            QueueConfig.StreamGroup streamGroup = queueConfig.getGroups().get(handlerBeanName);
            if (streamGroup == null) {
                logger.warn("未找到处理器 {} 的队列配置，跳过注册", handlerBeanName);
                continue;
            }

            String handlerName = streamGroup.getName(); // 队列名称
            handlerMap.put(handlerName, handler); // 注册处理器
            logger.info("注册处理器: handlerName={}, handlerBeanName={}", handlerName, handlerBeanName);
        }
    }

    /**
     * 根据队列名称获取对应的处理器
     *
     * @param handlerName 队列名称
     * @return 对应的处理器，如果未找到则返回 null
     */
    public IMessageHandler<?> getHandler(String handlerName) {
        IMessageHandler<?> handler = handlerMap.get(handlerName);
        if (handler == null) {
            logger.warn("未找到对应的处理器: handlerName={}", handlerName);
        }
        return handler;
    }
}
```

#### 代码解析

- **`@Component` 注解**：
  - 使用 `@Component` 注解将 `MessageHandlerFactory` 类声明为 Spring 组件。
- **`handlerMap` 属性**：
  - 这是一个 `Map<String, IMessageHandler<?>>` 类型的属性，用于存储队列名称与处理器的映射关系。
- **构造函数**：
  - 通过 `@Autowired` 注入 `ApplicationContext` 和 `QueueConfig`。
  - 在构造函数中，使用 `context.getBeansOfType(IMessageHandler.class)` 获取所有实现了 `IMessageHandler` 接口的 Bean。
  - 遍历这些 Bean，并根据 `QueueConfig` 中的配置将处理器注册到 `handlerMap` 中。
- **处理器注册逻辑**：
  - 对于每个处理器 Bean，从 `QueueConfig` 中获取对应的队列名称。
  - 如果未找到队列配置，则跳过该处理器的注册。
  - 如果找到队列配置，则将队列名称与处理器实例关联，并存入 `handlerMap`。
- **`getHandler` 方法**：
  - 根据队列名称从 `handlerMap` 中获取对应的处理器。
  - 如果未找到处理器，则记录警告日志。
- **日志记录**：
  - 使用 `Logger` 记录处理器的注册信息和未找到处理器的警告信息，便于调试和监控。

### 实现 Redis Stream 消息监听器

实现 `RedisStreamListener` 类，用于监听 Redis Stream 中的消息，并根据队列名称动态获取处理器处理消息。该类还实现了重试机制和死信队列功能，确保消息处理的可靠性。

#### 创建 `RedisStreamListener` 类

以下是 `RedisStreamListener` 类的完整代码：

```java
package online.snippet.redisstreammq.queue;

import online.snippet.redisstreammq.queue.handler.IMessageHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

/**
 * Redis Stream 消息监听器
 * <p>
 * 该类用于监听 Redis Stream 消息，并根据队列名称动态获取处理器处理消息。
 */
@Component
public class RedisStreamListener implements StreamListener<String, MapRecord<String, String, String>> {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final int MAX_RETRY = 3; // 最大重试次数
    private static final String DEAD_LETTER_QUEUE = "dead-letter-queue"; // 死信队列名称

    @Autowired
    private QueueConfig queueConfig;

    @Autowired
    private MessageHandlerFactory handlerFactory;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        String queueName = message.getStream();
        String recordId = message.getId().getValue();
        Map<String, String> content = message.getValue();

        // 记录消息接收日志
        logger.info("接收到消息: queueName={}, recordId={}, content={}", queueName, recordId, content);

        try {
            // 获取处理器
            IMessageHandler handler = handlerFactory.getHandler(queueName);
            if (handler == null) {
                logger.error("未找到对应的处理器: queueName={}", queueName);
                return;
            }

            // 获取消费者组名称
            Optional<QueueConfig.StreamGroup> groupOptional = queueConfig.getGroups().values().stream()
                    .filter(item -> item.getName().equals(queueName))
                    .findFirst();

            if (!groupOptional.isPresent()) {
                logger.error("未找到对应的消费者组: queueName={}", queueName);
                return;
            }

            String group = groupOptional.get().getGroup();

            // 重试机制
            int retryCount = 0;
            while (retryCount < MAX_RETRY) {
                try {
                    // 处理消息
                    handler.handle(content);

                    // 确认消息
                    redisTemplate.opsForStream().acknowledge(queueName, group, recordId);
                    logger.info("消息确认成功: queueName={}, recordId={}", queueName, recordId);

                    // 删除消息
                    redisTemplate.opsForStream().delete(queueName, recordId);
                    logger.info("消息删除成功: queueName={}, recordId={}", queueName, recordId);

                    break; // 处理成功，退出重试循环
                } catch (Exception e) {
                    retryCount++;
                    logger.error("消息处理失败，重试次数: {}, queueName={}, recordId={}, 错误信息: {}", retryCount, queueName, recordId, e.getMessage());

                    if (retryCount >= MAX_RETRY) {
                        logger.error("消息处理重试次数耗尽: queueName={}, recordId={}", queueName, recordId);

                        // 将消息转移到死信队列
                        redisTemplate.opsForStream().add(DEAD_LETTER_QUEUE, content);
                        logger.info("消息转移到死信队列: queueName={}, recordId={}", queueName, recordId);

                        // 确认消息，避免重复处理
                        redisTemplate.opsForStream().acknowledge(queueName, group, recordId);
                        logger.info("消息确认成功（重试耗尽）: queueName={}, recordId={}", queueName, recordId);

                        // 删除原队列中的消息
                        redisTemplate.opsForStream().delete(queueName, recordId);
                        logger.info("原队列消息删除成功: queueName={}, recordId={}", queueName, recordId);
                    }
                }
            }
        } catch (Exception e) {
            // 记录失败日志
            logger.error("消息处理失败: queueName={}, recordId={}, 错误信息: {}", queueName, recordId, e.getMessage(), e);
        }
    }
}
```

#### 代码解析

- **`StreamListener` 接口实现**：
  - 实现了 `StreamListener<String, MapRecord<String, String, String>>` 接口，用于监听 Redis Stream 中的消息。
  - `onMessage` 方法是消息处理的核心逻辑。
- **常量定义**：
  - `MAX_RETRY`：最大重试次数，设置为 3 次。
  - `DEAD_LETTER_QUEUE`：死信队列名称，用于存储处理失败的消息。
- **依赖注入**：
  - 通过 `@Autowired` 注入 `QueueConfig`、`MessageHandlerFactory` 和 `RedisTemplate`。
- **消息处理逻辑**：
  - 从消息中提取队列名称、消息 ID 和消息内容。
  - 使用 `MessageHandlerFactory` 根据队列名称获取对应的处理器。
  - 如果未找到处理器或消费者组，则记录错误日志并返回。
- **重试机制**：
  - 在 `while` 循环中尝试处理消息，最多重试 `MAX_RETRY` 次。
  - 如果处理成功，则确认消息并删除消息。
  - 如果处理失败，则记录错误日志并重试。
- **死信队列**：
  - 如果重试次数耗尽，则将消息转移到死信队列。
  - 确认消息并删除原队列中的消息，避免重复处理。
- **日志记录**：
  - 使用 `Logger` 记录消息接收、处理成功、处理失败和重试日志，便于调试和监控。

### 配置`RedisTemplate`

实现 `RedisConfig` 配置类，用于配置 `RedisTemplate`。通过自定义序列化器，确保 Key 和 Value 的序列化方式符合业务需求，并支持复杂对象的 JSON 序列化和反序列化。

#### 创建 `RedisConfig` 类

以下是 `RedisConfig` 类的完整代码：

```java
package online.snippet.redisstreammq.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 配置类
 * <p>
 * 该类用于配置 RedisTemplate，提供对 Redis 数据的操作支持。
 * 通过自定义序列化器，确保 Key 和 Value 的序列化方式符合业务需求。
 * </p>
 *
 * <p>
 * 主要功能：
 * 1. 配置 RedisTemplate 的 Key 和 Value 的序列化方式。
 * 2. 支持复杂对象的 JSON 序列化和反序列化。
 * </p>
 */
@Configuration
public class RedisConfig {

    /**
     * 配置 RedisTemplate，用于操作 Redis 数据
     *
     * @param factory Redis 连接工厂
     * @return 配置好的 RedisTemplate 实例
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 设置 Redis 连接工厂
        template.setConnectionFactory(factory);

        // Key 使用 String 序列化
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Value 使用 JSON 序列化
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        // 初始化 RedisTemplate
        template.afterPropertiesSet();
        return template;
    }
}
```

#### 代码解析

- **`@Configuration` 注解**：
  - 使用 `@Configuration` 注解将 `RedisConfig` 类声明为配置类。
- **`@Bean` 注解**：
  - 使用 `@Bean` 注解将 `redisTemplate` 方法声明为一个 Bean，Spring 容器会管理该 Bean 的生命周期。
- **`RedisTemplate` 配置**：
  - 创建 `RedisTemplate<String, Object>` 实例，用于操作 Redis 数据。
  - 通过 `setConnectionFactory` 方法设置 Redis 连接工厂。
- **序列化配置**：
  - **Key 序列化**：
    - 使用 `StringRedisSerializer` 对 Key 进行序列化和反序列化，确保 Key 是字符串类型。
  - **Value 序列化**：
    - 使用 `GenericJackson2JsonRedisSerializer` 对 Value 进行 JSON 序列化和反序列化，支持复杂对象的存储和读取。
- **初始化**：
  - 调用 `afterPropertiesSet` 方法初始化 `RedisTemplate`，确保配置生效。

### 配置 Redis Stream 消息监听容器

实现 `RedisStreamConfig` 配置类，用于配置 Redis Stream 的消息监听容器和线程池。通过动态订阅多个 Stream 并创建消费者组，确保消息队列的高效处理。

#### 创建 `RedisStreamConfig` 类

以下是 `RedisStreamConfig` 类的完整代码：

```java
package online.snippet.redisstreammq.config;

import online.snippet.redisstreammq.queue.QueueConfig;
import online.snippet.redisstreammq.queue.RedisStreamListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.Subscription;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Redis Stream 配置类
 * <p>
 * 该类用于配置 Redis Stream 的消息监听容器和线程池，支持多 Stream 的动态订阅。
 * 通过自定义线程池和消息监听容器，确保消息队列的高效处理。
 * </p>
 *
 * <p>
 * 主要功能：
 * 1. 配置线程池，用于处理 Redis Stream 消息。
 * 2. 配置 StreamMessageListenerContainer，用于监听 Redis Stream 消息。
 * 3. 动态订阅多个 Stream，并创建消费者组。
 * </p>
 */
@Configuration
public class RedisStreamConfig {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RedisTemplate redisTemplate; // 用于操作 Redis Stream 的模板

    @Autowired
    private QueueConfig queueConfig; // 队列配置，包含 Stream 和消费者组信息

    @Autowired
    private RedisStreamListener redisStreamListener; // Redis Stream 消息监听器

    /**
     * 配置 Spring 管理的线程池
     * <p>
     * 该线程池用于处理 Redis Stream 消息，确保消息处理的并发性和高效性。
     * </p>
     *
     * @return 配置好的 ThreadPoolTaskExecutor 实例
     */
    @Bean(name = "redisStreamTaskExecutor")
    public ThreadPoolTaskExecutor redisStreamTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10); // 核心线程数
        executor.setMaxPoolSize(20); // 最大线程数
        executor.setQueueCapacity(100); // 队列容量
        executor.setThreadNamePrefix("RedisStreamThread-"); // 线程名前缀
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy()); // 拒绝策略
        executor.initialize();
        return executor;
    }

    /**
     * 配置 StreamMessageListenerContainer，使用自定义线程池
     * <p>
     * 该容器用于监听 Redis Stream 消息，并将消息分发给对应的处理器。
     * </p>
     *
     * @param factory                Redis 连接工厂
     * @param redisStreamTaskExecutor 自定义线程池
     * @return 配置好的 StreamMessageListenerContainer 实例
     */
    @Bean
    public StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamMessageListenerContainer(
            RedisConnectionFactory factory, ThreadPoolTaskExecutor redisStreamTaskExecutor) {
        StreamMessageListenerContainer.StreamMessageListenerContainerOptions<String, MapRecord<String, String, String>> options =
                StreamMessageListenerContainer.StreamMessageListenerContainerOptions
                        .builder()
                        .pollTimeout(Duration.ofSeconds(1)) // 轮询超时时间
                        .executor(redisStreamTaskExecutor) // 使用自定义线程池
                        .build();
        return StreamMessageListenerContainer.create(factory, options);
    }

    /**
     * 为所有 Stream 创建 Subscription
     * <p>
     * 该方法根据配置动态订阅多个 Stream，并创建对应的消费者组。
     * 如果消费者组已存在，则忽略创建操作。
     * </p>
     *
     * @param factory           Redis 连接工厂
     * @param listenerContainer StreamMessageListenerContainer 实例
     * @return 所有 Subscription 的列表
     */
    @Bean
    public List<Subscription> subscriptions(
            RedisConnectionFactory factory,
            StreamMessageListenerContainer<String, MapRecord<String, String, String>> listenerContainer) {

        List<Subscription> subscriptions = new ArrayList<>();

        // 获取配置中的所有 Stream
        Map<String, QueueConfig.StreamGroup> groups = queueConfig.getGroups();
        if (groups == null || groups.isEmpty()) {
            logger.warn("未配置任何 Redis Stream 消费者组，请检查配置文件。");
            return subscriptions;
        }

        // 为每个 Stream 创建 Subscription
        groups.forEach((streamName, streamGroup) -> {
            try {
                // 创建消费者组（如果不存在）
                redisTemplate.opsForStream().createGroup(streamGroup.getName(), streamGroup.getGroup());
                logger.info("✅ 成功创建消费者组：Stream = {}, Group = {}", streamGroup.getName(), streamGroup.getGroup());
            } catch (Exception e) {
                // 消费者组已存在，忽略异常
                logger.info("⏩ 消费者组已存在：Stream = {}, Group = {}", streamGroup.getName(), streamGroup.getGroup());
            }

            // 订阅消息
            Subscription subscription = listenerContainer.receive(
                    Consumer.from(streamGroup.getGroup(), "consumer1"), // 消费者名称固定为 consumer1
                    StreamOffset.create(streamGroup.getName(), ReadOffset.from(">")), // 从上次未消费的消息开始读取
                    redisStreamListener
            );

            logger.info("🚀 成功启动消息队列监听器：Stream = {}, Group = {}", streamGroup.getName(), streamGroup.getGroup());
            subscriptions.add(subscription);
        });

        // 启动监听容器
        listenerContainer.start();
        logger.info("🎉 StreamMessageListenerContainer 启动成功，开始监听消息队列。");

        return subscriptions;
    }
}
```

#### 代码解析

- **`@Configuration` 注解**：
  - 使用 `@Configuration` 注解将 `RedisStreamConfig` 类声明为配置类。
- **依赖注入**：
  - 通过 `@Autowired` 注入 `RedisTemplate`、`QueueConfig` 和 `RedisStreamListener`。
- **线程池配置**：
  - 使用 `ThreadPoolTaskExecutor` 配置线程池，用于处理 Redis Stream 消息。
  - 核心线程数为 10，最大线程数为 20，队列容量为 100。
  - 线程名前缀为 `RedisStreamThread-`，拒绝策略为 `CallerRunsPolicy`。
- **消息监听容器配置**：
  - 使用 `StreamMessageListenerContainer` 配置消息监听容器。
  - 轮询超时时间为 1 秒，使用自定义线程池处理消息。
- **动态订阅 Stream**：
  - 遍历 `QueueConfig` 中的所有 Stream 配置，为每个 Stream 创建消费者组（如果不存在）。
  - 使用 `listenerContainer.receive` 方法订阅消息，消费者名称为 `consumer1`，从上次未消费的消息开始读取。
  - 将订阅信息存入 `subscriptions` 列表。
- **启动监听容器**：
  - 调用 `listenerContainer.start()` 方法启动监听容器，开始监听消息队列。
- **日志记录**：
  - 使用 `Logger` 记录消费者组创建、消息监听器启动和容器启动的日志，便于调试和监控。

### 实现订单服务类

实现 `OrderService` 类，用于处理订单相关的业务逻辑，并将耗时操作放入 Redis Stream 消息队列中异步处理。通过这种方式，可以提高系统的响应速度和吞吐量。

#### 创建 `OrderService` 类

以下是 `OrderService` 类的完整代码：

```java
package online.snippet.redisstreammq.service;

import online.snippet.redisstreammq.queue.QueueConfig;
import online.snippet.redisstreammq.queue.QueueConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 订单服务类
 * <p>
 * 该类用于处理订单相关的业务逻辑，并将耗时操作放入 Redis Stream 消息队列中异步处理。
 */
@Service
public class OrderService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private QueueConfig queueConfig;

    /**
     * 创建订单
     */
    public void createOrder() {
        // 基本业务逻辑
        // ...

        // 将耗时操作放入消息队列
        String queueName = getQueueName(QueueConstants.ORDER_CREATE_QUEUE);
        Map<String, String> message = buildCreateOrderMessage("123", "456", 100.0);
        sendMessage(queueName, message);
        logger.info("创建订单请求已经添加到消息队列: queueName={}, message={}", queueName, message);
    }

    /**
     * 更新订单
     */
    public void updateOrder() {
        // 基本业务逻辑
        // ...

        // 将耗时操作放入消息队列
        String queueName = getQueueName(QueueConstants.ORDER_UPDATE_QUEUE);
        Map<String, String> message = buildUpdateOrderMessage("123", "456", 150.0);
        sendMessage(queueName, message);
        logger.info("更新订单请求已经添加到消息队列: queueName={}, message={}", queueName, message);
    }

    /**
     * 取消订单
     */
    public void cancelOrder() {
        // 基本业务逻辑
        // ...

        // 将耗时操作放入消息队列
        String queueName = getQueueName(QueueConstants.ORDER_CANCEL_QUEUE);
        Map<String, String> message = buildCancelOrderMessage("123", "456");
        sendMessage(queueName, message);
        logger.info("取消订单请求已经添加到消息队列: queueName={}, message={}", queueName, message);
    }

    /**
     * 获取队列名称
     *
     * @param queueKey 队列键名
     * @return 队列名称
     */
    private String getQueueName(String queueKey) {
        return queueConfig.getGroups().get(queueKey).getName();
    }

    /**
     * 构造创建订单消息
     *
     * @param orderId 订单ID
     * @param userId  用户ID
     * @param amount  订单金额
     * @return 消息内容
     */
    private Map<String, String> buildCreateOrderMessage(String orderId, String userId, double amount) {
        Map<String, String> message = new HashMap<>();
        message.put("orderId", orderId);
        message.put("userId", userId);
        message.put("amount", String.valueOf(amount));
        return message;
    }

    /**
     * 构造更新订单消息
     *
     * @param orderId 订单ID
     * @param userId  用户ID
     * @param amount  订单金额
     * @return 消息内容
     */
    private Map<String, String> buildUpdateOrderMessage(String orderId, String userId, double amount) {
        Map<String, String> message = new HashMap<>();
        message.put("orderId", orderId);
        message.put("userId", userId);
        message.put("amount", String.valueOf(amount));
        return message;
    }

    /**
     * 构造取消订单消息
     *
     * @param orderId 订单ID
     * @param userId  用户ID
     * @return 消息内容
     */
    private Map<String, String> buildCancelOrderMessage(String orderId, String userId) {
        Map<String, String> message = new HashMap<>();
        message.put("orderId", orderId);
        message.put("userId", userId);
        return message;
    }

    /**
     * 发送消息到 Redis Stream
     *
     * @param queueName 队列名称
     * @param message   消息内容
     */
    private void sendMessage(String queueName, Map<String, String> message) {
        try {
            redisTemplate.opsForStream().add(queueName, message);
        } catch (Exception e) {
            logger.error("发送消息到队列失败: queueName={}, message={}, 错误信息: {}", queueName, message, e.getMessage(), e);
            throw new RuntimeException("发送消息到队列失败", e);
        }
    }
}
```

#### 代码解析

- **`@Service` 注解**：
  - 使用 `@Service` 注解将 `OrderService` 类声明为 Spring 的服务组件。
- **依赖注入**：
  - 通过 `@Autowired` 注入 `RedisTemplate` 和 `QueueConfig`。
- **订单业务方法**：
  - **`createOrder`**：处理订单创建逻辑，并将耗时操作放入消息队列。
  - **`updateOrder`**：处理订单更新逻辑，并将耗时操作放入消息队列。
  - **`cancelOrder`**：处理订单取消逻辑，并将耗时操作放入消息队列。
- **消息构造方法**：
  - **`buildCreateOrderMessage`**：构造订单创建消息。
  - **`buildUpdateOrderMessage`**：构造订单更新消息。
  - **`buildCancelOrderMessage`**：构造订单取消消息。
- **发送消息方法**：
  - **`sendMessage`**：将消息发送到 Redis Stream 中。
  - 使用 `redisTemplate.opsForStream().add` 方法将消息添加到指定的队列中。
  - 如果发送失败，则记录错误日志并抛出异常。
- **日志记录**：
  - 使用 `Logger` 记录消息发送的日志，便于调试和监控。

### 实现订单控制器

实现 `OrderController` 类，用于提供订单相关的 RESTful API。通过该控制器，可以测试订单服务的功能，并验证 Redis Stream 消息队列的异步处理能力。

#### 创建 `OrderController` 类

以下是 `OrderController` 类的完整代码：

```java
package online.snippet.redisstreammq.controller;

import online.snippet.redisstreammq.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 订单控制器
 * <p>
 * 该类用于提供订单相关的 RESTful API。
 */
@RestController
@RequestMapping("/order")
public class OrderController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单
     *
     * @return HTTP 响应
     */
    @PostMapping
    public ResponseEntity<Void> createOrder() {
        logger.info("接收到创建订单请求");
        try {
            orderService.createOrder();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("创建订单失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 更新订单
     *
     * @return HTTP 响应
     */
    @PutMapping
    public ResponseEntity<Void> updateOrder() {
        logger.info("接收到更新订单请求");
        try {
            orderService.updateOrder();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("更新订单失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 取消订单
     *
     * @return HTTP 响应
     */
    @DeleteMapping
    public ResponseEntity<Void> cancelOrder() {
        logger.info("接收到取消订单请求");
        try {
            orderService.cancelOrder();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("取消订单失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
```

- #### 代码解析

- **`@RestController` 注解**：
  - 使用 `@RestController` 注解将 `OrderController` 类声明为 RESTful 控制器。
- **`@RequestMapping` 注解**：
  - 使用 `@RequestMapping("/order")` 注解将控制器的根路径设置为 `/order`。
- **依赖注入**：
  - 通过 `@Autowired` 注入 `OrderService`。
- **订单相关 API**：
  - **`createOrder`**：
    - 使用 `@PostMapping` 注解映射到 HTTP POST 请求。
    - 调用 `orderService.createOrder()` 方法处理订单创建逻辑。
    - 返回 HTTP 200 状态码表示成功，返回 HTTP 500 状态码表示失败。
  - **`updateOrder`**：
    - 使用 `@PutMapping` 注解映射到 HTTP PUT 请求。
    - 调用 `orderService.updateOrder()` 方法处理订单更新逻辑。
    - 返回 HTTP 200 状态码表示成功，返回 HTTP 500 状态码表示失败。
  - **`cancelOrder`**：
    - 使用 `@DeleteMapping` 注解映射到 HTTP DELETE 请求。
    - 调用 `orderService.cancelOrder()` 方法处理订单取消逻辑。
    - 返回 HTTP 200 状态码表示成功，返回 HTTP 500 状态码表示失败。
- **日志记录**：
  - 使用 `Logger` 记录请求接收和处理结果的日志，便于调试和监控。