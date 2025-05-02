# [Classnames](https://github.com/JedWatson/classnames#readme)

一个用于有条件地组合 classNames 的简单 JavaScript 工具。

使用你的包管理器从 npm 注册表安装：

```bash
npm install classnames
```

可在 Node.js、Browserify 或 webpack 中使用：

```javascript
const classNames = require('classnames');
classNames('foo', 'bar'); // => 'foo bar'
```

或者，你也可以直接通过 `<script>` 标签在页面中引入 `index.js`，它会导出一个全局的 `classNames` 方法，或者在使用 RequireJS 时定义模块。

## 用法

`classNames` 函数可以接受任意数量的参数，这些参数可以是字符串或对象。参数 `'foo'` 相当于 `{ foo: true }`。如果某个键所对应的值为假值，该键不会出现在输出结果中。

```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'

// 多种类型的多个参数
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// 其他假值会被忽略
classNames(null, false, 'bar', undefined, 0, { baz: null }, ''); // => 'bar'
```

数组会按上述规则递归展开：

```javascript
const arr = ['b', { c: true, d: false }];
classNames('a', arr); // => 'a b c'
```