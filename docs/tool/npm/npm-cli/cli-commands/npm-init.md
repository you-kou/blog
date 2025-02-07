# npm init

创建一个 `package.json` 文件。

## 概要

```sh
npm init <package-spec>
npm init <@scope>
```

## 说明

`npm init <initializer>` 可用于创建一个新的或现有的 npm 包。

在这种情况下，`initializer` 是一个名为 `create-<initializer>` 的 npm 包，它将通过 `npm-exec` 安装，并执行其主要的二进制文件——大概会创建或更新 `package.json` 文件，并执行其他与初始化相关的操作。

如果省略了 initializer（直接运行 `npm init`），`init` 将回退到传统的初始化行为。它会问你一系列问题，然后为你生成一个 `package.json` 文件。它会根据现有的字段、依赖关系和所选的选项做出合理的猜测。这个过程是严格的增量式操作，所以它会保留已经设置的字段和值。你也可以使用 `-y` 或 `--yes` 跳过问卷。如果你传递了 `--scope`，它将创建一个作用域包。

## 示例

生成时不询问任何问题：

```sh
npm init -y
```

