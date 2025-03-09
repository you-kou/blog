import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CodeSnippet",
  description: "欢迎来到我的技术博客！\n" +
      "这里是我分享技术心得、编程技巧和项目实践的空间。从前端到后端，从开发工具到最佳实践，我会用简洁的语言记录下学习与探索的过程。希望这些内容能为你带来启发，帮助你在技术道路上更加高效。一起成长，一起偷懒式高效工作！",
  themeConfig: {

    // 本地搜索
    // https://vitepress.dev/zh/reference/default-theme-search#local-search
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    outline: {
      level: [2, 3], // 这里设置 h2 到 h3 级别的标题显示在大纲中
      label: '页面导航' // 自定义大纲标题
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: {
      '/tool/': [
        {
          text: '开发工具',
          items: [
            { text: '必备工具汇总', link: '/tool/summary' },
            { text: 'JDK', link: '/tool/jdk' }
          ]
        },
        {
          text: 'IDEA',
          collapsed: true,
          items: [
            { text: '设置', link: '/tool/idea/settings' },
          ]
        },
        {
          text: 'Maven',
          collapsed: true,
          items: [
            { text: '简介', link: '/tool/maven/introduction' },
            { text: '快速开始', link: '/tool/maven/quick-start' },
            {
              text: '依赖机制',
              link: '/tool/maven/dependency-mechanism',
              items: [
                { text: '传递依赖', link: '/tool/maven/dependency-mechanism/transitive-dependencies' },
                { text: '依赖范围', link: '/tool/maven/dependency-mechanism/dependency-scope' },
                { text: '依赖管理', link: '/tool/maven/dependency-mechanism/dependency-management' },
              ]
            },
            {
              text: 'POM 参考',
              items: [
                {
                  text: '基础知识',
                  link: '/tool/maven/pom-reference/the-basics',
                  items: [
                    { text: 'Maven 坐标', link: '/tool/maven/pom-reference/the-basics/maven-coordinates' },
                    { text: '打包', link: '/tool/maven/pom/essential/packaging' },
                    {
                      text: 'POM 关系',
                      link: '/tool/maven/pom-reference/the-basics/pom-relationships',
                      items: [
                        {
                          text: '依赖',
                          link: '/tool/maven/pom-reference/the-basics/pom-relationships/dependencies',
                          items: [
                            { text: '依赖管理', link: '/tool/maven/pom-reference/the-basics/pom-relationships/dependencies/dependency-management' },
                          ]
                        },
                      ]
                    }
                  ]
                },
              ]
            },
            {
              text: '配置',
              collapsed: true,
              items: [
                { text: '默认 settings.xml 文件', link: '/tool/maven/settings/default' },
                { text: '仓库镜像', link: '/tool/maven/settings/mirror-settings' },
              ]
            }
          ]
        },
        {
          text: 'NPM',
          collapsed: true,
          items: [
            { text: '简介', link: '/tool/npm/introduction' },
            { text: '安装', link: '/tool/npm/install' },
            {
              text: 'npm 命令行',
              items: [
                {
                  text: 'CLI 命令',
                  collapsed: true,
                  items: [
                    { text: 'npm init', link: '/tool/npm/npm-cli/cli-commands/npm-init' },
                    { text: 'npm-install', link: '/tool/npm/npm-cli/cli-commands/npm-install' },
                    { text: 'npm-run-script', link: '/tool/npm/npm-cli/cli-commands/npm-run-script' },
                  ]
                }
              ]
            }
          ]
        }
      ],
      '/framework/': [
        {
          text: '编程框架',
          items: [
            { text: '框架一览', link: '/framework/summary' }
          ]
        },
        {
          text: 'Spring',
          link: '/framework/spring/why-spring',
          items: [
            {
              text: 'Spring Boot',
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
                { text: '构建 RESTful Web 服务', link: '/framework/spring/spring-boot/building-a-restful-web-service' },
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
                            { text: '依赖注入', link: '/framework/spring/spring-framework/core-technologies/the-ioc-container/dependencies/dependency-injection' }
                          ]
                        },
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
              text: 'API',
              collapsed: true,
              items: [
                { text: 'HttpStatus', link: '/framework/spring/api/HttpStatus' },
                { text: 'ResponseEntity', link: '/framework/spring/api/ResponseEntity' },
              ]
            }
          ]
        },
      ],
      '/specification/': [
        {
          text: '最佳实践',
          items: [
            { text: '规范一览', link: '/framework/summary' }
          ]
        },
        {
          text: '数据格式',
          collapsed: true,
          items: [
            { text: 'csv', link: '/specification/data-format/csv' },
            { text: 'json', link: '/specification/data-format/json' },
            { text: 'xml', link: '/specification/data-format/xml' },
            { text: 'properties', link: '/specification/data-format/properties' },
            { text: 'yaml', link: '/specification/data-format/yaml' },
          ]
        },
        {
          text: '系统架构',
          collapsed: true,
          items: [
            { text: '前后端分离架构', link: '/specification/architecture/frontend-backend-separation' },
            { text: 'MVVM 框架', link: '/specification/architecture/mvvm' },
            { text: '领域驱动设计（DDD）', link: '/specification/architecture/ddd' },
          ]
        },
        {
          text: 'REST',
          collapsed: true,
          items: [
            { text: '什么是 REST?', link: '/specification/rest/what-is-rest' },
            { text: '六个约束条件', link: '/specification/rest/the-six-constraints' },
            { text: 'REST 快速提示', link: '/specification/rest/rest-quick-tips' },
            { text: 'HTTP 方法', link: '/specification/rest/http-methods' },
            { text: '资源命名', link: '/specification/rest/resource-naming' },
            { text: '幂等性', link: '/specification/rest/idempotence' },
            { text: '安全性', link: '/specification/rest/safety' },
          ]
        },
        {
          text: 'RFC',
          collapsed: true,
          items: [
            { text: 'RFC 简介', link: '/specification/rfc/rfc' },
            { text: 'URI 模板', link: '/specification/rfc/uri-template' },
          ]
        },
      ],
      '/solution/': [
        {
          text: '解决方案',
          collapsed: true,
          items: [
            {
              text: 'Java',
              items: [
                { text: '基于 Redis Stream 的订单异步处理框架搭建', link: '/solution/java/springboot-redis-stream-queue' },
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    config: (md) => {
      md.use(footnote) // 借助 markdown-it-footnote 插件来支持脚注
    }
  }
})
