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
            { text: '必备工具汇总', link: '/tool/summary' }
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
