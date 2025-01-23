# 快速开始

## 前置准备

- [Node.js](https://nodejs.org/) 18 及以上版本。
- 通过命令行界面 (CLI) 访问 VitePress 的终端。
- 支持 [Markdown](https://en.wikipedia.org/wiki/Markdown) 语法的编辑器。
- [GitHub](https://github.com/) 账号。

::: tip 
本文中出现的仓库名或仓库地址请自行替换。
:::

## 创建部署 VitePress 应用

登录 GitHub 官网，在 GitHub 任何页面的右上角，选择 **+**，然后单击“New repository”。

<img src="https://r2storage.us.kg/markdown/blog-vitepress/quick-start/GitHub%20-%20%E6%96%B0%E5%BB%BA%E4%BB%93%E5%BA%93%20-%20%E7%82%B9%E5%87%BB%E6%96%B0%E5%BB%BA%E6%8C%89%E9%92%AE.webp" alt="创建存储库" style="zoom: 50%;margin: 0 auto;" />

输入存储库名称等信息，单击“创建存储库”，完成存储库的创建。创建存储库时需要注意仓库的可见性应该设置为 `public`。

![新建仓库 - 配置仓库](https://r2storage.us.kg/markdown/blog-vitepress/quick-start/GitHub%20-%20%E6%96%B0%E5%BB%BA%E4%BB%93%E5%BA%93%20-%20%E9%85%8D%E7%BD%AE%E4%BB%93%E5%BA%93.png)

开启 GitHub Actions

![新建仓库 - 开启 Github Actions](https://r2storage.us.kg/markdown/blog-vitepress/quick-start/GitHub%20-%20%E6%96%B0%E5%BB%BA%E4%BB%93%E5%BA%93%20-%20%E5%BC%80%E5%90%AF%20Github%20Actions.png)

在本地磁盘上创建项目目录，切换工作目录到项目的根目录，在命令行中输入以下命令，完成 Git 仓库的初始化：

```
git init
```

在项目根目录下创建 `.gitignore` 文件，并将下列文件和目录排除版本控制：

```txt
docs/.vitepress/dist
docs/.vitepress/cache
node_modules
```

在项目根目录下创建工作流文件 `.github/workflows/deploy.yml`。

```yaml
# Sample workflow for building and deploying a VitePress site to GitHub Pages
#
name: Deploy VitePress site to Pages

on:
  # Runs on pushes targeting the `main` branch. Change this to `master` if you're
  # using the `master` branch as the default branch.
  push:
    branches: [main]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
      # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm # or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: npm ci # or pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: |
          npm run docs:build # or pnpm docs:build / yarn docs:build / bun run docs:build
          touch docs/.vitepress/dist/.nojekyll
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: docs/.vitepress/dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

确保你安装了最新版本的 [Node.js](https://nodejs.org/)，并且你的当前工作目录正是项目的根目录。

在命令行中运行以下命令启动安装向导：

```sh
npx vitepress init
```

回答几个简单的问题：

```tex
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  ● Default Theme (Out of the box, good-looking docs)
│  ○ Default Theme + Customization
│  ○ Custom Theme
│ 
◇  Use TypeScript for config and theme files?
│  > Yes / No
│ 
◆  Add VitePress npm scripts to package.json?
│  > Yes / No
└
```

如果不确定如何回答，你可以参考下列答案：

![VitePress 创建向导](https://r2storage.us.kg/markdown/blog-vitepress/quick-start/VitePress%20-%20%E5%88%9B%E5%BB%BA%E5%90%91%E5%AF%BC.png)

安装  `vitepress` 依赖：

```sh
npm add -D vitepress
```

使用以下命令运行项目：

```sh
npm run docs:dev
```

开发服务默认会运行在 `http://localhost:5173` 上。在浏览器中访问 URL 查看新站点的运行情况吧！

![默认博客站点](https://r2storage.us.kg/markdown/blog-vitepress/quick-start/VitePress%20-%20%E9%BB%98%E8%AE%A4%E9%A1%B5%E9%9D%A2.png)

修改 `.vitepress/config.mjs` 配置文件中的 `base` 配置。如果计划在子路径例如 GitHub 页面下部署站点，则需要设置此项。如果计划将站点部署到 `https://foo.github.io/bar/`，那么应该将 `base` 设置为 `'/bar/'`。它应该始终以 `/` 开头和结尾。

![image-20250122190758100](https://r2storage.us.kg/markdown/blog-vitepress/quick-start/VitePress%20-%20%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%20-%20%E6%B7%BB%E5%8A%A0%20base%20%E9%85%8D%E7%BD%AE.png)

添加、提交、推送项目文件到 GitHub。

```sh
git add --all
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:you-kou/blog.git
git push -u origin main
```

推送成功后，使用下列网址 `https://<username>.github.io/[repository]/` 访问已发布的网站，如果能够访问成功，并且显示正确，说明网站部署成功。

## 参考资料

- [VitePress 快速开始](https://vitepress.dev/zh/guide/getting-started)

- [VitePress 站点配置](https://vitepress.dev/zh/reference/site-config#base)

- [创建 GitHub Pages 站点](https://docs.github.com/zh/pages/getting-started-with-github-pages/creating-a-github-pages-site)

- [使用自定义工作流](https://docs.github.com/zh/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

