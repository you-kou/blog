# npm run-script

运行任意的包脚本。

## 概要

```sh
npm run-script <command> [-- <args>]

aliases: run, rum, urn
```

## 说明

这将从包的 `"scripts"` 对象中运行一个任意的命令。如果没有提供 `"command"`，它将列出可用的脚本。

`run[-script]` 被 test、start、restart 和 stop 命令使用，但也可以直接调用。当包中的脚本被打印出来时，它们会被分为生命周期脚本（如 test、start、restart）和直接运行的脚本。

任何位置参数都会传递给指定的脚本。使用 `--` 来传递带有 `--` 前缀的标志和选项，否则它们会被 npm 解析。

例如：

```sh
npm run test -- --grep="pattern"
```

