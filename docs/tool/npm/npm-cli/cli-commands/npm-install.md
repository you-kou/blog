# npm install

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

即使您从未发布您的包，如果您只想编写一个 Node 程序，并且可能还希望在将其打包成 tarball 后能够轻松地在其他地方安装它，您仍然可以从使用 npm 中获得很多好处。

- `npm install`（在一个包的目录中运行，不带参数）：

  将依赖项安装到本地的 node_modules 文件夹。
  
  在全局模式下（即在命令后附加 -g 或 --global），它将当前包上下文（即当前工作目录）安装为全局包。
  
  默认情况下，npm install 会安装 package.json 中列出的所有作为依赖的模块。
  
  使用 --production 标志（或者当 NODE_ENV 环境变量设置为 production 时），npm 将不会安装列在 devDependencies 中的模块。要在 NODE_ENV 环境变量设置为 production 时安装列在 dependencies 和 devDependencies 中的所有模块，可以使用 --production=false。
