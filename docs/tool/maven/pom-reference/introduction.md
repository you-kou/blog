# 简介

## 什么是 POM？

POM（Project Object Model，项目对象模型）是 Maven 项目的核心，使用 `pom.xml` 文件来表示。谈论 Maven 项目时，它不仅仅是指一组包含代码的文件，更是一种哲学上的概念。一个项目不仅包括配置文件，还涵盖了开发人员及其角色、缺陷跟踪系统、组织与许可证信息、项目的 URL、依赖关系以及所有与代码执行相关的细节。可以说，它是项目的综合信息来源。实际上，在 Maven 中，一个项目不一定包含代码，只需要一个 `pom.xml` 文件。

## 快速概览

这是 POM 文件中 `project` 元素下的直接子元素列表。请注意，`modelVersion` 包含了 4.0.0，这是目前唯一支持的 POM 版本，并且始终是必需的。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <!-- The Basics -->
  <groupId>...</groupId>
  <artifactId>...</artifactId>
  <version>...</version>
  <packaging>...</packaging>
  <dependencies>...</dependencies>
  <parent>...</parent>
  <dependencyManagement>...</dependencyManagement>
  <modules>...</modules>
  <properties>...</properties>
  <!-- Build Settings -->
  <build>...</build>
  <reporting>...</reporting>
  <!-- More Project Information -->
  <name>...</name>
  <description>...</description>
  <url>...</url>
  <inceptionYear>...</inceptionYear>
  <licenses>...</licenses>
  <organization>...</organization>
  <developers>...</developers>
  <contributors>...</contributors>
  <!-- Environment Settings -->
  <issueManagement>...</issueManagement>
  <ciManagement>...</ciManagement>
  <mailingLists>...</mailingLists>
  <scm>...</scm>
  <prerequisites>...</prerequisites>
  <repositories>...</repositories>
  <pluginRepositories>...</pluginRepositories>
  <distributionManagement>...</distributionManagement>
  <profiles>...</profiles>
</project>
```

