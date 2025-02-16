# Spring 项目生态

从配置到安全性，从 Web 应用到大数据——无论您的应用程序有哪些基础架构需求，Spring 项目都能帮助您构建。 从小处着手，仅使用您需要的部分——Spring 采用模块化设计。

## Spring Boot

Spring Boot 让创建独立的、生产级的 Spring 应用变得简单，您可以“一键运行”。

我们对 Spring 平台和第三方库提供了开箱即用的默认配置，让您能快速上手，无需繁琐设置。大多数 Spring Boot 应用仅需最少的 Spring 配置。

## Spring Framework

Spring 框架为现代基于 Java 的企业应用提供了全面的编程和配置模型，适用于任何部署平台。

Spring 的核心优势在于应用级基础架构支持：它专注于企业应用的“底层管道”，使开发团队能够专注于业务逻辑，而无需受限于特定的部署环境。

## Spring Data

Spring Data 的使命是提供一个熟悉且一致的基于 Spring 的数据访问编程模型，同时保留底层数据存储的独特特性。

它简化了数据访问技术的使用，支持关系型和非关系型数据库、Map-Reduce 框架以及云端数据服务。Spring Data 是一个涵盖多个子项目的“顶层项目”，每个子项目都针对特定的数据库。该项目与众多公司和开发者合作，共同推动这些创新技术的发展。

## Spring Cloud

Spring Cloud 为开发者提供工具，帮助快速构建分布式系统中的常见模式（如配置管理、服务发现、断路器、智能路由、微代理、控制总线、短生命周期微服务和契约测试）。

分布式系统的协调往往涉及大量的样板代码，而 Spring Cloud 使开发者能够快速搭建实现这些模式的服务和应用。无论是在本地开发环境、裸机数据中心，还是 Cloud Foundry 等托管平台上，Spring Cloud 都能良好运行。

## Spring Cloud Data Flow

基于微服务的流式与批处理数据处理，适用于 Cloud Foundry 和 Kubernetes。

Spring Cloud Data Flow 提供工具，用于构建复杂的流式和批处理数据管道拓扑。这些数据管道由 Spring Boot 应用组成，并基于 Spring Cloud Stream 或 Spring Cloud Task 微服务框架构建。

Spring Cloud Data Flow 支持多种数据处理场景，包括 ETL（提取、转换、加载）、数据导入/导出、事件流处理和预测分析。

## Spring Security

Spring Security 是一个功能强大且高度可定制的身份验证和访问控制框架，它已成为保护基于 Spring 的应用程序的事实标准。

Spring Security 专注于为 Java 应用提供身份验证和授权功能。与所有 Spring 项目一样，它的真正优势在于其强大的扩展性，能够轻松适配自定义需求。

## Spring Authorization Server

Spring Authorization Server 是一个框架，实现了 OAuth 2.1 和 OpenID Connect 1.0 规范以及其他相关规范。

它基于 Spring Security 构建，提供安全、轻量且可定制的基础，用于构建 OpenID Connect 1.0 身份提供者（Identity Provider）和 OAuth2 授权服务器产品。

## Spring for GraphQL

Spring for GraphQL 为基于 GraphQL Java 的 Spring 应用提供支持。该项目由 GraphQL Java 团队与 Spring 工程团队共同开发，秉承“尽量减少约束”的理念，同时提供广泛的使用场景支持。

Spring for GraphQL 是 GraphQL Java 团队的 GraphQL Java Spring 项目的继任者，旨在成为所有 Spring GraphQL 应用的基础。

## Spring Session

Spring Session 提供了一个 API 和实现，用于管理用户的会话信息。

## Spring Integration

Spring Integration 扩展了 Spring 编程模型，以支持广泛使用的企业集成模式（Enterprise Integration Patterns）。Spring Integration 实现了轻量级消息传递，支持基于 Spring 的应用程序内部的消息通信，并通过声明式适配器与外部系统集成。这些适配器在 Spring 对远程调用、消息传递和调度的支持上提供了更高层次的抽象。

Spring Integration 的主要目标是提供一个简单的模型，用于构建企业集成解决方案，同时保持关注点的分离，这对于生成可维护、可测试的代码至关重要。

## Spring HATEOAS

Spring HATEOAS 提供了一些 API，帮助在使用 Spring 尤其是 Spring MVC 时，轻松创建符合 HATEOAS 原则的 REST 表示。它主要解决的问题是链接创建和表示组装。

## Spring Modulith

Spring Modulith 允许开发者构建结构良好的 Spring Boot 应用，并指导开发者根据领域驱动设计找到并使用应用模块。它支持验证这种模块化结构、对单个模块进行集成测试、观察应用在模块级别的行为，并根据创建的模块化结构生成文档片段。

## Spring REST Docs

Spring REST Docs 帮助您文档化 RESTful 服务。

它将使用 Asciidoctor 编写的手动文档与 Spring MVC Test 自动生成的代码片段结合起来。这种方法使您摆脱了像 Swagger 等工具生成文档的局限性。

它帮助您生成准确、简洁且结构良好的文档，让用户能够轻松获取所需的信息。

## Spring AI

Spring AI 是一个用于 AI 工程的应用框架。其目标是将 Spring 生态系统中的设计原则，如可移植性和模块化设计，应用到 AI 领域，并推动在 AI 领域使用 POJO（普通 Java 对象）作为应用构建的基本单元。

## Spring Batch

Spring Batch 是一个轻量级、全面的批处理框架，旨在支持开发对企业系统日常运作至关重要的稳健批处理应用。

Spring Batch 提供了多种可重用功能，处理大量记录时必不可少的功能，包括日志记录/追踪、事务管理、作业处理统计、作业重启、跳过和资源管理。它还提供了更先进的技术服务和功能，通过优化和分区技术，支持高吞吐量和高性能的批处理作业。无论是简单还是复杂的高容量批处理作业，都可以利用该框架以高度可扩展的方式处理大量信息。

## Spring CLI

Spring CLI 旨在提高您创建新项目和向现有项目添加功能的生产力。它通过提供以下高级功能来实现这一目标。

命令 "boot new" 克隆外部项目，并可选择性地将其重构为您选择的包名称。您还可以指定新项目的组 ID、工件 ID 和版本（可选）。

命令 "boot add" 会将外部项目合并到当前项目中。它智能地合并项目依赖、插件、注解、应用配置文件，并将外部项目代码重构到当前项目的包结构中。

用户自定义命令提供了一种用户友好的方式来定义和执行自定义命令，执行项目中的日常任务。通过声明式的命令定义与您的代码一起，您可以轻松创建新的控制器、添加依赖或配置文件。您还可以执行类似客户端 GitHub Actions 的其他命令行应用程序。

遵循 "Plain Old Java Projects" 的代码生成方法（在 "boot new" 和 "boot add" 命令中实现），允许公司定义一套标准项目，包含首选的库和编码风格。将 README.md 文件包含在这些项目中，使团队成员能够轻松开始使用新库或编程方法。例如，运行 "spring boot add jpa" 会将代码添加到您的项目中，并将 README.md 文件重命名为 README-jpa.md，便于发现。

用户自定义命令非常适合重复的编码任务。由于命令定义与代码一起存在，您的团队中的任何人都可以贡献或改进现有命令，而无需创建、更新和发布额外的工件或项目。

## Spring AMQP

Spring AMQP 项目将核心 Spring 概念应用于基于 AMQP 的消息解决方案开发。它提供了一个 "模板" 作为发送和接收消息的高级抽象。同时，它还支持基于消息驱动的 POJO，并通过 "监听容器" 提供支持。这些库有助于管理 AMQP 资源，并促进使用依赖注入和声明式配置。在这些情况下，您将看到与 Spring 框架中 JMS 支持的相似之处。

该项目由两部分组成：spring-amqp 是基础抽象，而 spring-rabbit 是 RabbitMQ 的实现。

## Spring Flo

Spring Flo 是一个 JavaScript 库，提供了一个基本的嵌入式 HTML5 可视化构建器，用于构建管道和简单图形。这个库作为 Spring Cloud Data Flow 中流构建器的基础。

Flo 包含了集成流设计器的所有基本元素，如连接器、控制节点、调色板、状态转换和图形拓扑——重要的是，它还提供了文本 shell、领域特定语言（DSL）支持和一个图形画布，旨在创建和审查全面的工作流。

## Spring for Apache Kafka

Spring for Apache Kafka (spring-kafka) 项目将核心 Spring 概念应用于基于 Kafka 的消息解决方案开发。它提供了一个 "模板" 作为发送消息的高级抽象。同时，它还支持通过 @KafkaListener 注解和 "监听容器" 实现基于消息驱动的 POJO。这些库促进了依赖注入和声明式配置的使用。在这些方面，您将看到与 Spring 框架中的 JMS 支持以及 Spring AMQP 中的 RabbitMQ 支持的相似之处。

## Spring LDAP

Spring LDAP 是一个简化 Java 中 LDAP 编程的库，基于与 Spring Jdbc 相同的原则构建。

LdapTemplate 类封装了传统 LDAP 编程中涉及的所有繁琐工作，如创建、遍历 NamingEnumeration、处理异常和清理资源。这使得程序员可以专注于处理重要的部分——例如数据的来源（DN 和过滤器）以及如何处理数据（映射到和从域对象中、绑定、修改、解除绑定等），就像 JdbcTemplate 让程序员只需关注实际的 SQL 和数据如何映射到域模型一样。

除此之外，Spring LDAP 还提供了将 NamingExceptions 转换为未经检查的异常层次结构的异常转换功能，以及若干用于处理过滤器、LDAP 路径和属性的工具。

## Spring for Apache Pulsar

Spring for Apache Pulsar (spring-pulsar) 项目将核心 Spring 概念应用于基于 Pulsar 的消息解决方案开发。它提供了一个 "模板" 作为发送消息的高级抽象。同时，它还支持通过 @PulsarListener 注解和 "监听容器" 实现基于消息驱动的 POJO。您将看到与 Spring for Apache Kafka 项目中提供的 Apache Kafka 支持的相似之处。

## Spring Shell

Spring Shell 项目的用户可以通过依赖 Spring Shell 的 JAR 包并添加自定义命令（这些命令作为 Spring Bean 的方法）轻松构建一个功能完备的 shell（即命令行）应用。创建命令行应用非常有用，例如与项目的 REST API 进行交互，或者处理本地文件内容。

## Spring Statemachine

Spring Statemachine 是一个框架，供应用程序开发人员在 Spring 应用中使用状态机概念。

## Spring Web Flow

Spring Web Flow 基于 Spring MVC，允许实现 Web 应用程序中的“流程”。一个流程封装了一系列步骤，指引用户完成某个业务任务的执行。它跨越多个 HTTP 请求，具有状态，处理事务数据，具有可重用性，并且可能是动态的和长期运行的。

## Spring Web Services

Spring Web Services (Spring-WS) 专注于创建基于文档的 Web 服务。Spring Web Services 旨在促进基于契约优先的 SOAP 服务开发，允许通过多种方式操作 XML 有效载荷来创建灵活的 Web 服务。该产品基于 Spring 本身，这意味着您可以将 Spring 的概念（如依赖注入）作为 Web 服务的核心部分来使用。

人们使用 Spring-WS 的原因有很多，但大多数人是在发现其他 SOAP 堆栈无法遵循 Web 服务最佳实践时选择了 Spring-WS。Spring-WS 使最佳实践变得更加简单，包括诸如 WS-I 基本配置文件、契约优先开发以及契约与实现之间松耦合等实践。