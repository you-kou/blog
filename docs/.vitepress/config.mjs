import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lazyers博客",
  description: "欢迎来到我的技术博客！\n" +
      "这里是我分享技术心得、编程技巧和项目实践的空间。从前端到后端，从开发工具到最佳实践，我会用简洁的语言记录下学习与探索的过程。希望这些内容能为你带来启发，帮助你在技术道路上更加高效。一起成长，一起偷懒式高效工作！",
  themeConfig: {
    logo: '/logo.png',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
