<script setup>
import { ref } from 'vue'

const list = ref([
  {
    title: 'MyBatis',
    banner: 'https://mybatis.org/images/mybatis-logo.png',
    href: 'https://code-snippet.online/framework/mybatis/sqlmap-xml/result-maps.html',
    text: 'MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。',
    style: 1
  }, {
    title: 'Spring',
    subtitle: '提升你的 Java 代码，探索 Spring 能为你做什么。',
    href: 'https://code-snippet.online/framework/spring/why-spring.html',
    avatar: 'https://spring.io/favicon.svg?v=96334d577af708644f6f0495dd1c7bc8',
    text: 'Spring 使得 Java 编程变得更快捷、更简单、更安全。Spring 专注于速度、简洁性和生产力，这使它成为世界上最受欢迎的 Java 框架。',
    style: 2
  }, {
    title: 'Payload',
    subtitle: 'Next.js 无头 CMS 与应用框架',
    href: 'https://code-snippet.online/framework/payload/basics/getting-started/what-is-payload.html',
    avatar: 'https://payloadcms.com/images/favicon.svg',
    text: 'Payload 是一款基于 TypeScript 和 React 构建的开源无头 CMS 及应用框架。它能助您构建任何类型的应用。',
    style: 2
  }, {
    title: '设计模式',
    href: 'https://code-snippet.online/specification/design-patterns/overview-of-design-patterns.html',
    text: '软件设计模式（Software Design Pattern），又称设计模式，是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。它描述了在软件设计过程中的一些不断重复发生的问题，以及该问题的解决方案。也就是说，它是解决特定问题的一系列套路，是前辈们的代码设计经验的总结，具有一定的普遍性，可以反复使用。',
    style: 3
  }, {
    title: 'REST',
    href: 'https://code-snippet.online/specification/rest/what-is-rest.html',
    text: 'REST（表述性状态转移）API 彻底革新了开发者构建和集成网络服务的方式，实现了系统间的无缝通信。',
    style: 3
  }, {
    title: 'Maven',
    banner: 'https://maven.apache.org/images/maven-logo-black-on-white.png',
    href: 'https://code-snippet.online/tool/maven/introduction.html',
    text: 'Apache Maven 是一款软件项目管理和构建工具，基于项目对象模型（POM）的概念，Maven 能够通过 一个集中的配置信息 管理项目的构建、报告和文档。',
    style: 1
  }, {
    title: 'Java',
    href: 'https://code-snippet.online/language/java/',
    avatar: 'https://www.oracle.com/asset/web/favicons/favicon-32.png',
    text: 'Oracle Java 是全球排名第一的编程语言和开发平台。它降低了成本，缩短了开发周期，推动了创新，并提高了应用服务质量。全球有数百万开发者在运行超过 600 亿个 Java 虚拟机，Java 继续成为企业和开发者首选的开发平台。',
    style: 2
  }, {
    title: 'sharp',
    href: 'https://code-snippet.online/framework/sharp/',
    avatar: 'https://sharp.pixelplumbing.com/_astro/sharp-logo.CiVIswaO.svg',
    text: '高性能 Node.js 图像处理。',
    style: 2
  },
])
</script>

<template>
  <v-container>
    <v-row align="start" justify="start">
      <v-col v-for="item in list" lg="3" md="4" sm="6" cols="12">
        <v-card v-if="item.style === 1" :href="item.href">
          <v-card-item>
            <v-img :src="item.banner" cover></v-img>
          </v-card-item>
          <v-card-text>{{ item.text }}</v-card-text>
        </v-card>

        <v-card v-if="item.style === 2" :title="item.title" :href="item.href">
          <template v-slot:prepend>
            <v-avatar size="24">
              <v-img :src="item.avatar"></v-img>
            </v-avatar>
          </template>
          <v-card-subtitle v-if="item.subtitle" :title="item.subtitle">{{ item.subtitle }}</v-card-subtitle>
          <v-card-text>{{ item.text }}</v-card-text>
        </v-card>

        <v-card v-if="item.style === 3" :title="item.title" :href="item.href">
          <v-card-subtitle v-if="item.subtitle" :title="item.subtitle">{{ item.subtitle }}</v-card-subtitle>
          <v-card-text>{{ item.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.vp-doc a {
  text-decoration: none;
  color: inherit;
}

.vp-doc a:hover {
  color: inherit;
}
</style>