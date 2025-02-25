# [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)

安装一个包。

## 概要

```sh
npm install [<package-spec> ...]
```

## 说明

该命令会安装一个包及其依赖的所有包。如果该包有 package-lock 文件、npm shrinkwrap 文件或 yarn lock 文件，依赖项的安装将根据这些文件进行，并遵循以下优先级顺序：

- `npm-shrinkwrap.json`
- `package-lock.json`
- `yarn.lock`

一个 package（包）可以是以下几种形式：

- a) 一个包含 `package.json` 文件的文件夹，用于描述程序
- b) 一个经过 gzip 压缩的 tarball 文件，其中包含 (a)
- c) 一个指向 (b) 的 URL
- d) 一个以 `<name>@<version>` 形式发布在注册表（registry）上的包，其内容为 (c)
- e) 一个以 `<name>@<tag>` 形式的标签（详见 `npm dist-tag`），指向 (d)
- f) 一个仅以 `<name>` 形式存在的包，其中 "latest" 标签满足 (e)
- g) 一个 `<git remote url>`，可解析为 (a)

即使您从未发布您的包，如果您只想编写一个 Node 程序 (a)，并且可能还希望在将其打包成 tarball 后能够轻松地在其他地方安装它，您仍然可以从使用 npm 中获得很多好处。

- `npm install`（在 package 目录中，无参数）：

  将依赖安装到本地 `node_modules` 文件夹。
  
  在全局模式下（即使用 `-g` 或 `--global` 选项时），会将当前包（即当前工作目录）安装为全局包。
  
  默认情况下，`npm install` 会安装 `package.json` 文件中列出的所有 `dependencies`（依赖）。
  
  使用 `--production` 选项（或将 `NODE_ENV` 环境变量设置为 `production`）时，npm 不会安装 `devDependencies`（开发依赖）。如果希望在 `NODE_ENV=production` 时仍然安装 `dependencies` 和 `devDependencies`，可以使用 `--production=false`。

  > [!NOTE]
  >
  > `--production` 选项在向项目添加依赖时没有特殊含义。

- `npm install [<@scope>/]<name>`

  执行 `<name>@<tag>` 形式的安装，其中 `<tag>` 是 "tag" 配置项的值。（详见配置，默认值为 `latest`。）

  在大多数情况下，这将安装 npm 注册表（registry）中标记为 `latest` 的模块版本。
  
  例如：
  
  ```sh
  npm install sax
  ```
  
  `npm install` 默认会将指定的包保存到 `dependencies`。此外，你可以使用一些额外的标志（flags）来控制它们的保存位置和方式：
  
  - `-P, --save-prod`：将包保存到 `dependencies`，这是默认行为，除非使用了 `-D` 或 `-O`。
  
  - `-D, --save-dev`：将包保存到 `devDependencies`。
  
  - `--save-peer`：将包保存到 `peerDependencies`。
  
  - `-O, --save-optional`：将包保存到 `optionalDependencies`。
  
  - `--no-save`：不会将包保存到任何依赖项中。
  
  在使用上述选项将依赖保存到 `package.json` 时，还可以使用两个额外的可选标志（flags）：
  
  - `-E, --save-exact`：保存依赖时使用精确版本号，而不是 npm 默认的语义化版本范围（semver）运算符。
  
  - `-B, --save-bundle`：保存依赖时，同时将其添加到 `bundleDependencies` 列表中。

  此外，如果你有 `npm-shrinkwrap.json` 或 `package-lock.json` 文件，它们也将被一并更新。

  `<scope>` 是可选的。包将从与指定范围关联的注册表中下载。如果给定的范围没有关联的注册表，则假定使用默认注册表。详见 `scope`。

  注意：如果在范围名称中没有包含 `@` 符号，npm 会将其解释为一个 GitHub 仓库，详见下文。范围名称后面必须跟一个斜杠 `/`。
  
  例如：
  
  ```sh
  npm install sax
  npm install githubname/reponame
  npm install @myorg/privatepackage
  npm install node-tap --save-dev
  npm install dtrace-provider --save-optional
  npm install readable-stream --save-exact
  npm install ansi-regex --save-bundle
  ```
  
  
