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
              text: 'POM',
              collapsed: true,
              items: [
                { text: '简介', link: '/tool/maven/pom/introduction' },
                {
                  text: '基础',
                  collapsed: true,
                  items: [
                    { text: 'Maven 坐标', link: '/tool/maven/pom/essential/maven-coordinates' },
                    { text: '打包', link: '/tool/maven/pom/essential/packaging' },
                    { text: 'POM 关系', link: '/tool/maven/pom/essential/pom-relationships' },
                  ]
                }
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
          collapsed: true,
          items: [
            { text: 'Spring 项目生态', link: '/framework/spring/projects' },
            {
              text: 'Spring Boot',
              collapsed: true,
              items: [
                { text: '系统要求', link: '/framework/spring/spring-boot/system-requirements' },
                { text: '快速开始', link: '/framework/spring/spring-boot/quick-start' },
                { text: '构建 RESTful Web 服务', link: '/framework/spring/spring-boot/building-a-restful-web-service' },
                { text: 'Web 响应设计', link: '/framework/spring/spring-boot/response' },
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
          text: '文件格式',
          collapsed: true,
          items: [
            { text: '.properties 文件格式', link: '/specification/file/properties' },
            { text: '.yaml', link: '/specification/file/yaml' }
          ]
        },
        {
          text: '系统架构',
          collapsed: true,
          items: [
            { text: '前后端分离架构', link: '/specification/architecture/frontend-backend-separation' },
            { text: 'MVVM 框架', link: '/specification/architecture/mvvm' },
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
