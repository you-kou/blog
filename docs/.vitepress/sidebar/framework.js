const catalog = 'framework';

export default [
  { text: '编程框架', link: '/framework/framework' },
  {
    text: 'MyBatis',
    collapsed: true,
    items: [
      {
        text: 'XML 映射文件',
        items: [
          { text: '结果映射', link: `/${catalog}/mybatis/sqlmap-xml/result-maps` },
        ]
      }
    ]
  },
  {
    text: 'Spring',
    collapsed: true,
    link: '/framework/spring/why-spring',
    items: [
      {
        text: 'Spring Boot',
        collapsed: true,
        items: [
          {
            text: '参考',
            items: [
              {
                text: '核心功能',
                items: [
                  { text: 'SpringApplication', link: '/framework/spring/spring-boot/reference/core-features/spring-application' },
                  { text: '日志记录', link: '/framework/spring/spring-boot/reference/core-features/logging' },
                ]
              }
            ]
          },
          { text: '系统要求', link: '/framework/spring/spring-boot/system-requirements' },
          { text: '快速开始', link: '/framework/spring/spring-boot/quick-start' },
          { text: '获取 HTTP 请求参数', link: '/framework/spring/spring-boot/get-request-parameters' },
          { text: 'Web 响应设计', link: '/framework/spring/spring-boot/http-response' },
        ]
      },
      {
        text: 'Spring Framework',
        collapsed: true,
        items: [
          {
            text: '核心技术',
            items: [
              { text: 'Spring IoC 容器和 Bean 简介', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/introduction-to-the-spring-ioc-container-and-beans' },
              {
                text: 'IoC 容器',
                items: [
                  {
                    text: '依赖',
                    items: [
                      { text: '依赖注入', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/dependencies/dependency-injection' },
                    ]
                  },
                  { text: 'Bean 范围', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/bean-scopes' },
                  {
                    text: '基于注解的容器配置',
                    link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/annotation-based-container-configuration',
                    items: [
                      { text: '使用 @Autowired', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/annotation-based-container-configuration/using-@autowired' },
                      { text: '使用 @Resource` 注解进行注入', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/annotation-based-container-configuration/injection-with-@resource' },
                      { text: '使用 @Value', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/annotation-based-container-configuration/using-@value' },
                      { text: '使用 @PostConstruct 和 @PreDestroy', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/annotation-based-container-configuration/using-@postconstruct-and-@predestroy' },
                    ]
                  },
                  {
                    text: '基于 Java 的容器配置',
                    link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/java-based-container-configuration',
                    items: [
                      { text: '基本概念：@Bean 和 @Configuration', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/java-based-container-configuration/basic-concepts-@bean-and-@configuration' },
                      { text: '使用 AnnotationConfigApplicationContext 实例化 Spring 容器', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/java-based-container-configuration/instantiating-the-spring-container-by-using-annotationconfigapplicationcontext' },
                      { text: '使用 @Bean 注解', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/java-based-container-configuration/using-the-@bean-annotation' },
                      { text: '使用 @Configuration 注解', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/java-based-container-configuration/using-the-@configuration-annotation' },
                    ]
                  },
                ]
              },
              {
                text: 'Spring 表达式语言',
                link: '/framework/spring/spring-framework/core-technologies/spring-expression-language',
                items: [
                  { text: '求值', link: '/framework/spring/spring-framework/core-technologies/spring-expression-language/evaluation' },
                  { text: 'Bean 定义中的表达式', link: '/framework/spring/spring-framework/core-technologies/spring-expression-language/expressions-in-bean-definitions' },
                ]
              },
            ]
          },
          {
            text: 'Spring Web MVC',
            items: [
              {
                text: '带注解的控制器',
                items: [
                  { text: '声明', link: '/framework/spring/spring-framework/spring-web-mvc/annotated-controllers/declaration' },
                  { text: '映射请求', link: '/framework/spring/spring-framework/spring-web-mvc/annotated-controllers/mapping-requests' },
                  {
                    text: '处理方法',
                    items: [
                      { text: '@RequestParam', link: '/framework/spring/spring-framework/spring-web-mvc/annotated-controllers/handler-methods/@RequestParam' },
                      { text: '@RequestBody', link: '/framework/spring/spring-framework/spring-web-mvc/annotated-controllers/handler-methods/@RequestBody' },
                    ]
                  },
                  { text: '异常', link: '/framework/spring/spring-framework/spring-web-mvc/annotated-controllers/exceptions' },
                  { text: '控制器增强', link: '/framework/spring/spring-framework/spring-web-mvc/annotated-controllers/controller-advice' },
                ]
              },
              {
                text: 'MVC 配置',
                items: [
                  { text: '启用 MVC 配置', link: '/framework/spring/spring-framework/spring-web-mvc/mvc-config/enable-mvc-configuration' },
                  { text: 'MVC 配置 API', link: '/framework/spring/spring-framework/spring-web-mvc/mvc-config/mvc-config-api' },
                  { text: '消息转换器', link: '/framework/spring/spring-framework/spring-web-mvc/mvc-config/message-converters' },
                  { text: '静态资源', link: '/framework/spring/spring-framework/spring-web-mvc/mvc-config/static-resources' },
                ]
              },
            ]
          },
        ]
      },
      {
        text: 'Spring Data',
        collapsed: true,
        items: [
          {
            text: 'Spring Data Commons',
            link: '/framework/spring/spring-data/spring-data-jpa',
            items: [
              { text: '概述', link: '/framework/spring/spring-data/spring-data-commons/overview' },
              { text: '依赖关系', link: '/framework/spring/spring-data/spring-data-commons/dependencies' },
              { text: '对象映射基础', link: '/framework/spring/spring-data/spring-data-commons/object-mapping-fundamentals' },
              {
                text: '使用 Spring Data 仓库',
                items: [
                  { text: '核心概念', link: '/framework/spring/spring-data/spring-data-commons/working-with-spring-data-repositories/core-concepts' },
                  { text: '查询方法', link: '/framework/spring/spring-data/spring-data-commons/working-with-spring-data-repositories/query-methods' },
                  { text: '定义存储库接口', link: '/framework/spring/spring-data/spring-data-commons/working-with-spring-data-repositories/defining-repository-interfaces' },
                  { text: '定义查询方法', link: '/framework/spring/spring-data/spring-data-commons/working-with-spring-data-repositories/defining-query-methods' },
                  { text: '创建仓库实例', link: '/framework/spring/spring-data/spring-data-commons/working-with-spring-data-repositories/creating-repository-instances' },
                ]
              },
              {
                text: '附录',
                items: [
                  { text: '仓库查询关键字', link: '/framework/spring/spring-data/spring-data-commons/appendices/repository-query-keywords' },
                  { text: 'Repository查询返回类型', link: '/framework/spring/spring-data/spring-data-commons/appendices/repository-query-return-types' },
                ]
              },
            ]
          },
          {
            text: 'Spring Data JPA',
            link: '/framework/spring/spring-data/spring-data-jpa',
            items: [
              { text: '开始使用', link: '/framework/spring/spring-data/spring-data-jpa/getting-started' },
              { text: '核心概念', link: '/framework/spring/spring-data/spring-data-jpa/core-concepts' },
              { text: '定义存储库接口', link: '/framework/spring/spring-data/spring-data-jpa/defining-repository-interfaces' },
              { text: '配置', link: '/framework/spring/spring-data/spring-data-jpa/configuration' },
            ]
          },
        ]
      },
      {
        text: '指南',
        collapsed: true,
        items: [
          { text: '构建 RESTful Web 服务', link: '/framework/spring/guides/building-a-restful-web-service' },
          { text: '上传文件', link: '/framework/spring/guides/uploading-files' },
        ]
      },
      {
        text: 'API',
        collapsed: true,
        items: [
          {
            text: 'org.springframework.util',
            items: [
              { text: 'FileSystemUtils', link: '/framework/spring/api/org.springframework.util/FileSystemUtils' },
            ]
          },
          {
            text: 'org.springframework.web.multipart',
            items: [
              { text: 'MultipartFile', link: '/framework/spring/api/org.springframework.web.multipart/MultipartFile' },
            ]
          },
          {
            text: 'org.springframework.web.bind.annotation',
            items: [
              { text: 'ControllerAdvice', link: '/framework/spring/api/org.springframework.web.bind.annotation/ControllerAdvice' },
            ]
          },
          {
            text: 'org.springframework.web.util.pattern',
            items: [
              { text: 'PathPattern', link: '/framework/spring/api/org.springframework.web.util.pattern/PathPattern' },
            ]
          },
          { text: 'HttpStatus', link: '/framework/spring/api/HttpStatus' },
          { text: 'ResponseEntity', link: '/framework/spring/api/ResponseEntity' },
        ]
      }
    ]
  },
  {
    text: 'Payload',
    collapsed: true,
    items: [
      {
        text: '基础',
        collapsed: true,
        items: [
          {
            text: '入门指南',
            items: [
              { text: '什么是 Payload？', link: `/${catalog}/payload/basics/getting-started/what-is-payload` },
              { text: 'Payload 概念', link: `/${catalog}/payload/basics/getting-started/concepts` },
              { text: '安装', link: `/${catalog}/payload/basics/getting-started/installation` },
            ]
          },
          {
            text: '配置',
            items: [
              { text: '概述', link: `/${catalog}/payload/basics/configuration/overview` },
              { text: '集合', link: `/${catalog}/payload/basics/configuration/collections` },
              { text: '全局', link: `/${catalog}/payload/basics/configuration/globals` },
              { text: 'I18n', link: `/${catalog}/payload/basics/configuration/i18n` },
              { text: '本地化', link: `/${catalog}/payload/basics/configuration/localization` },
            ]
          },
          {
            text: '数据库',
            items: [
              { text: '概述', link: `/${catalog}/payload/basics/database/overview` },
              { text: 'Postgres', link: `/${catalog}/payload/basics/database/postgres` },
            ]
          },
          {
            text: '字段',
            items: [
              { text: '概述', link: `/${catalog}/payload/basics/fields/overview` },
              { text: 'Array', link: `/${catalog}/payload/basics/fields/array` },
              { text: 'Date', link: `/${catalog}/payload/basics/fields/date` },
              { text: 'Number', link: `/${catalog}/payload/basics/fields/number` },
              { text: 'Radio Group', link: `/${catalog}/payload/basics/fields/radio` },
              { text: 'Relationship', link: `/${catalog}/payload/basics/fields/relationship` },
              { text: 'Join', link: `/${catalog}/payload/basics/fields/join` },
              { text: 'Row', link: `/${catalog}/payload/basics/fields/row` },
              { text: 'Select', link: `/${catalog}/payload/basics/fields/select` },
              { text: 'Text', link: `/${catalog}/payload/basics/fields/text` },
              { text: 'UI', link: `/${catalog}/payload/basics/fields/ui` },
              { text: 'Upload', link: `/${catalog}/payload/basics/fields/upload` },
            ]
          },
          {
            text: '访问控制',
            items: [
              { text: '概述', link: `/${catalog}/payload/basics/access-control/overview` },
              { text: '集合', link: `/${catalog}/payload/basics/access-control/collections` },
            ]
          },
          {
            text: '钩子',
            items: [
              { text: '概述', link: `/${catalog}/payload/basics/hooks/overview` },
            ]
          },
        ]
      },
      {
        text: '数据管理',
        collapsed: true,
        items: [
          {
            text: '本地 API',
            items: [
              { text: '概述', link: `/${catalog}/payload/managing-data/local-api/overview` },
            ]
          },
          {
            text: 'REST API',
            items: [
              { text: '概述', link: `/${catalog}/payload/managing-data/rest-api/overview` },
            ]
          },
          {
            text: '查询',
            items: [
              { text: '概述', link: `/${catalog}/payload/managing-data/queries/overview` },
            ]
          },
        ]
      },
      {
        text: '特性',
        collapsed: true,
        items: [
          {
            text: '管理',
            items: [
              { text: '概述', link: `/${catalog}/payload/features/admin/overview` },
              { text: '元数据', link: `/${catalog}/payload/features/admin/metadata` },
            ]
          },
          {
            text: '认证',
            items: [
              { text: '概述', link: `/${catalog}/payload/features/authentication/overview` },
              { text: 'JWT 策略', link: `/${catalog}/payload/features/authentication/jwt` },
              { text: 'API 密钥策略', link: `/${catalog}/payload/features/authentication/api-keys` },
              { text: '令牌数据', link: `/${catalog}/payload/features/authentication/token-data` },
            ]
          },
          {
            text: '上传',
            items: [
              { text: '概述', link: `/${catalog}/payload/features/upload/overview` },
            ]
          },
          {
            text: '邮件',
            items: [
              { text: '概述', link: `/${catalog}/payload/features/email/overview` },
            ]
          },
        ]
      }
    ]
  }
]