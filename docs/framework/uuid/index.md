# [uuid](https://github.com/uuidjs/uuid#readme)

## 快速开始

1. 安装

```bash
npm install uuid
```

2. 创建一个 UUID

ESM 语法（必须使用具名导出）：

```js
import { v4 as uuidv4 } from 'uuid';
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
```

... CommonJS：

```js
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
```

如需了解时间戳 UUID、命名空间 UUID 及其他选项，请继续阅读...

## API 概览

| 方法/属性          | 说明                                    | 版本说明        |
| ------------------ | --------------------------------------- | --------------- |
| `uuid.NIL`         | nil UUID 字符串（全为零）               | 新增于 uuid@8.3 |
| `uuid.MAX`         | 最大 UUID 字符串（全为一）              | 新增于 uuid@9.1 |
| `uuid.parse()`     | 将 UUID 字符串转换为字节数组            | 新增于 uuid@8.3 |
| `uuid.stringify()` | 将字节数组转换为 UUID 字符串            | 新增于 uuid@8.3 |
| `uuid.v1()`        | 创建版本 1（基于时间戳）的 UUID         |                 |
| `uuid.v1ToV6()`    | 从版本 1 UUID 创建版本 6 UUID           | 新增于 uuid@10  |
| `uuid.v3()`        | 创建版本 3（使用 MD5 的命名空间）UUID   |                 |
| `uuid.v4()`        | 创建版本 4（随机）UUID                  |                 |
| `uuid.v5()`        | 创建版本 5（使用 SHA-1 的命名空间）UUID |                 |
| `uuid.v6()`        | 创建版本 6（重排序的时间戳）UUID        | 新增于 uuid@10  |
| `uuid.v6ToV1()`    | 从版本 6 UUID 创建版本 1 UUID           | 新增于 uuid@10  |
| `uuid.v7()`        | 创建版本 7（基于 Unix 时间戳）UUID      | 新增于 uuid@10  |
| `uuid.v8()`        | “故意留空”                              |                 |
| `uuid.validate()`  | 测试字符串是否为有效 UUID               | 新增于 uuid@8.3 |
| `uuid.version()`   | 检测 UUID 的 RFC 版本                   | 新增于 uuid@8.3 |

