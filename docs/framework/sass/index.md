# [Sass 基础](https://sass-lang.com/)

## 预处理

单靠 CSS 也能写出有趣的样式，但样式表变得越来越庞大、复杂，也更难维护。这时预处理器就能派上用场。Sass 拥有 CSS 目前还没有的功能，比如嵌套、混合宏、继承等各种实用功能，能帮助你编写健壮、易维护的 CSS。

一旦你开始使用 Sass，它会将你预处理的 Sass 文件保存为普通的 CSS 文件，供网站使用。

最直接的方式是在终端中操作。一旦 Sass 安装完成，你可以使用 `sass` 命令将 Sass 编译为 CSS。你需要告诉 Sass 要构建哪个文件，以及 CSS 输出到哪里。例如，在终端中运行：

```sh
sass input.scss output.css
```

这会将一个 Sass 文件 `input.scss` 编译为 `output.css`。

你也可以使用 `--watch` 标志来监听单个文件或整个目录。`watch` 标志会告诉 Sass 监听你的源文件的更改，并在每次保存 Sass 时重新编译 CSS。如果你想监听 `input.scss` 文件，而不是手动构建，只需在命令中添加 `watch` 标志，如下所示：

```sh
sass --watch input.scss output.css
```

你还可以通过使用文件夹路径作为输入和输出，并用冒号分隔它们，来监听并输出到目录。例如：

```sh
sass --watch app/sass:public/stylesheets
```

Sass 会监听 `app/sass` 文件夹中的所有文件变化，并将 CSS 编译到 `public/stylesheets` 文件夹中。

> [!NOTE]
>
> Sass 有两种语法！`.scss` 语法最常用，它是 CSS 的超集，这意味着所有有效的 CSS 也是有效的 SCSS。而 `.sass` 缩进语法则较为少见：它使用缩进代替大括号来嵌套语句，使用换行而非分号来分隔语句。我们提供的所有示例都有这两种语法版本。

## 嵌套

在编写 HTML 时，你可能注意到它具有清晰的嵌套结构和视觉层级。而 CSS 本身则没有这种结构。

Sass 允许你以符合 HTML 视觉层级的方式嵌套 CSS 选择器。需要注意的是，过度嵌套的规则会导致选择器过于复杂，难以维护，通常被认为是糟糕的实践。

牢记这一点，下面是一个网站导航常见样式的示例：

::: code-group

```scss[scss.js]
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

```css[css.js]
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

:::

你会注意到，`ul`、`li` 和 `a` 选择器是嵌套在 `nav` 选择器中的。这是一种很好的方式来组织你的 CSS，使其更具可读性。