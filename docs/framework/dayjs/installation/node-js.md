# Node.js

要在 Node.js 项目中开始使用 Day.js，只需将其依赖添加到你的 Node.js 包管理器中即可。

```bash
npm install dayjs
# or
yarn add dayjs
# or
pnpm add dayjs
```

然后在项目代码中引入即可：

```js
const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015
dayjs().format()
```