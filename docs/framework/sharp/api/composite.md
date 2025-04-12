# 合成图像

```
 composite(images) ⇒ Sharp
```

在已处理（调整大小、裁剪等）的图像上叠加合成图像。

用于合成的图像必须与已处理图像尺寸相同或更小。如果同时提供了 `top` 和 `left` 选项，它们的优先级高于 `gravity`。

同一处理流程中的其他操作（如调整大小、旋转、翻转、镜像、裁剪）总是在合成之前应用于输入图像。

`blend` 选项可以是以下之一： `clear`、`source`、`over`、`in`、`out`、`atop`、`dest`、`dest-over`、`dest-in`、`dest-out`、`dest-atop`、`xor`、`add`、`saturate`、`multiply`、`screen`、`overlay`、`darken`、`lighten`、`colour-dodge`、`color-dodge`、`colour-burn`、`color-burn`、`hard-light`、`soft-light`、`difference`、`exclusion`。

更多关于混合模式的信息请参见：

- https://www.libvips.org/API/current/libvips-conversion.html#VipsBlendMode
- https://www.cairographics.org/operators/

**抛出异常：**

-  `Error` 参数无效

| 参数                               | 类型              | 默认值      | 描述                                                         |
| ---------------------------------- | ----------------- | ----------- | ------------------------------------------------------------ |
| images                             | Array.            |             | 要合成的图像的有序列表                                       |
| [images[].input]                   | Buffer \| String  |             | 包含图像数据的 Buffer，图像文件路径的字符串，或 Create 对象（见下文） |
| [images[].input.create]            | Object            |             | 描述要创建的空白叠加图像                                     |
| [images[].input.create.width]      | Number            |             | 宽度（像素）                                                 |
| [images[].input.create.height]     | Number            |             | 高度（像素）                                                 |
| [images[].input.create.channels]   | Number            |             | 通道数（3-4）                                                |
| [images[].input.create.background] | String \| Object  |             | 使用 color 模块解析为红、绿、蓝和 alpha 的背景颜色值         |
| [images[].input.text]              | Object            |             | 描述要创建的文本图像                                         |
| [images[].input.text.text]         | String            |             | 要渲染的 UTF-8 字符串文本，可包含 Pango 标记，例如 `<i>Le</i>Monde` |
| [images[].input.text.font]         | String            |             | 要使用的字体名称                                             |
| [images[].input.text.fontfile]     | String            |             | 字体文件的绝对文件系统路径                                   |
| [images[].input.text.width]        | Number            | 0           | 要进行自动换行的像素宽度，超出宽度的文本会在单词边界处断行   |
| [images[].input.text.height]       | Number            | 0           | 最大像素高度。定义此项时将忽略 DPI，文本将自动适应指定的宽高分辨率。如果未指定宽度或宽度为 0，则此项无效 |
| [images[].input.text.align]        | String            | `'left'`    | 文本对齐方式（'left'、'centre'、'center'、'right'）          |
| [images[].input.text.justify]      | Boolean           | false       | 设置为 true 启用文本两端对齐                                 |
| [images[].input.text.dpi]          | Number            | 72          | 渲染文本时使用的分辨率（大小）。如果指定了高度，则该设置无效 |
| [images[].input.text.rgba]         | Boolean           | false       | 设置为 true 启用 RGBA 输出。适用于彩色 emoji 渲染或使用 Pango 标记功能（如 `<span foreground="red">Red!</span>`） |
| [images[].input.text.spacing]      | Number            | 0           | 文本行高（点）。如果未指定则使用字体默认行高                 |
| [images[].autoOrient]              | Boolean           | false       | 设置为 true 时根据 EXIF 方向信息调整图像方向（如果存在）     |
| [images[].blend]                   | String            | `'over'`    | 与下方图像的混合方式                                         |
| [images[].gravity]                 | String            | `'centre'`  | 叠加图像的位置重力                                           |
| [images[].top]                     | Number            |             | 距离顶部边缘的像素偏移量                                     |
| [images[].left]                    | Number            |             | 距离左侧边缘的像素偏移量                                     |
| [images[].tile]                    | Boolean           | false       | 设置为 true 时将叠加图像按指定重力在整个图像上重复铺满       |
| [images[].premultiplied]           | Boolean           | false       | 设置为 true 可避免对下方图像进行预乘操作，等同于 vips 的 `--premultiplied` 选项 |
| [images[].density]                 | Number            | 72          | 向量叠加图像的 DPI                                           |
| [images[].raw]                     | Object            |             | 使用原始像素数据时的叠加描述                                 |
| [images[].raw.width]               | Number            |             | 原始图像的宽度（像素）                                       |
| [images[].raw.height]              | Number            |             | 原始图像的高度（像素）                                       |
| [images[].raw.channels]            | Number            |             | 原始图像的通道数                                             |
| [images[].animated]                | Boolean           | false       | 设置为 true 可读取动画图像的所有帧/页面                      |
| [images[].failOn]                  | String            | `'warning'` | 参见构造函数参数                                             |
| [images[].limitInputPixels]        | Number \| Boolean | 268402689   | 参见构造函数参数                                             |

**示例：**

```javascript
await sharp(background)
  .composite([
    { input: layer1, gravity: 'northwest' },
    { input: layer2, gravity: 'southeast' },
  ])
  .toFile('combined.png');
```

**示例：**

```javascript
const output = await sharp('input.gif', { animated: true })
  .composite([
    { input: 'overlay.png', tile: true, blend: 'saturate' }
  ])
  .toBuffer();
```

**示例：**

```javascript
sharp('input.png')
  .rotate(180)
  .resize(300)
  .flatten( { background: '#ff6600' } )
  .composite([{ input: 'overlay.png', gravity: 'southeast' }])
  .sharpen()
  .withMetadata()
  .webp( { quality: 90 } )
  .toBuffer()
  .then(function(outputBuffer) {
    // outputBuffer contains upside down, 300px wide, alpha channel flattened
    // onto orange background, composited with overlay.png with SE gravity,
    // sharpened, with metadata, 90% quality WebP image data. Phew!
  });
```

