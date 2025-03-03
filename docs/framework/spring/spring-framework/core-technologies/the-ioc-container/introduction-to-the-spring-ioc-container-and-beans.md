# Spring IoC 容器和 Bean 简介

本章介绍了 Spring 框架实现的控制反转（IoC）原理。依赖注入（DI）是 IoC 的一种特殊形式，其中对象通过构造函数参数、工厂方法的参数或构造后设置的属性来定义它们的依赖关系。IoC 容器在创建 Bean 时会注入这些依赖。这一过程是控制反转的典型表现，即对象本身不再控制其依赖关系的实例化或定位，而是由容器来处理。

Spring 框架的 IoC 容器基于 `org.springframework.beans` 和 `org.springframework.context` 包。`BeanFactory` 接口提供了一个高级配置机制，能够管理任何类型的对象。`ApplicationContext` 是 `BeanFactory` 的子接口，增强了如下功能：

- 更易于集成 Spring AOP 特性
- 消息资源处理（用于国际化）
- 事件发布
- 特定应用层上下文，如用于 Web 应用的 `WebApplicationContext`

简而言之，`BeanFactory` 提供了配置框架和基本功能，而 `ApplicationContext` 则提供了更多企业级的功能。`ApplicationContext` 是 `BeanFactory` 的超集，本章中描述的 Spring IoC 容器都使用 `ApplicationContext`。更多关于使用 `BeanFactory` 的信息，请参考相关的 BeanFactory API 部分。

在 Spring 中，由 IoC 容器管理的应用对象称为 Bean。Bean 是由 Spring IoC 容器实例化、组装和管理的对象。Bean 及其依赖关系通过容器使用的配置元数据进行定义。