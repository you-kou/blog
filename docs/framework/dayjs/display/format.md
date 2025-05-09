# Format

根据传入的占位符返回格式化后的日期。

将字符放在方括号中，即可原样返回而不被格式化替换 (例如， `[MM]`)。

```js
dayjs().format() 
// 默认返回的是 ISO8601 格式字符串 '2020-04-02T08:02:17-05:00'

dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') 
// 'YYYYescape 2019-01-25T00:00:00-02:00Z'

dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
```

## 支持的格式化占位符列表

| 占位符 | 输出             | 详情                                                         |
| ------ | ---------------- | ------------------------------------------------------------ |
| `YY`   | 18               | 两位数的年份                                                 |
| `YYYY` | 2018             | 四位数的年份                                                 |
| `M`    | 1-12             | 月份，从 1 开始                                              |
| `MM`   | 01-12            | 月份，两位数                                                 |
| `MMM`  | Jan-Dec          | 缩写的月份名称                                               |
| `MMMM` | January-December | 完整的月份名称                                               |
| `D`    | 1-31             | 月份里的一天                                                 |
| `DD`   | 01-31            | 月份里的一天，两位数                                         |
| `d`    | 0-6              | 一周中的一天，星期天是 0                                     |
| `dd`   | Su-Sa            | 最简写的星期几                                               |
| `ddd`  | Sun-Sat          | 简写的星期几                                                 |
| `dddd` | Sunday-Saturday  | 星期几                                                       |
| `H`    | 0-23             | 小时                                                         |
| `HH`   | 00-23            | 小时，两位数                                                 |
| `h`    | 1-12             | 小时, 12 小时制                                              |
| `hh`   | 01-12            | 小时, 12 小时制, 两位数                                      |
| `m`    | 0-59             | 分钟                                                         |
| `mm`   | 00-59            | 分钟，两位数                                                 |
| `s`    | 0-59             | 秒                                                           |
| `ss`   | 00-59            | 秒 两位数                                                    |
| `SSS`  | 000-999          | 毫秒 三位数                                                  |
| `Z`    | +05:00           | UTC 的偏移量，±HH:mm                                         |
| `ZZ`   | +0500            | UTC 的偏移量，±HHmm                                          |
| `A`    | AM PM            |                                                              |
| `a`    | am pm            |                                                              |
| ...    | ...              | 其他格式 ( 依赖 [`AdvancedFormat` ](https://day.js.org/docs/zh-CN/plugin/advanced-format)插件 ) |

