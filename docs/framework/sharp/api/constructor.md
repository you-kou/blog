# 构造函数

## new

```javascript
new Sharp([input], [options])
```

用于创建 sharp 实例的构造函数工厂，可链式调用后续方法。

可以从该对象中以流的方式输出 JPEG、PNG、WebP、GIF、AVIF 或 TIFF 格式的图像数据。使用基于流的输出时，派生属性可通过 info 事件获取。

处理过程中遇到的非关键问题会作为 warning 事件触发。

实现了 stream.Duplex 类。

当加载动画图像的多个页面/帧时，这些页面会被组合为一个垂直堆叠的“卫生纸卷”图像，其整体高度为 pageHeight 乘以页面数。

**抛出异常：**

- `Error`：参数无效

| 参数                         | 类型                                                         | 默认值      | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ | ----------- | ------------------------------------------------------------ |
| `[input]`                    | Buffer \| ArrayBuffer \| Uint8Array \| Uint8ClampedArray \| Int8Array \| Uint16Array \| Int16Array \| Uint32Array \| Int32Array \| Float32Array \| Float64Array \| string \| Array |             | 如果提供，可以是包含 JPEG、PNG、WebP、AVIF、GIF、SVG 或 TIFF 图像数据的 Buffer / ArrayBuffer / Uint8Array / Uint8ClampedArray，或包含原始像素图像数据的 TypedArray，或包含 JPEG、PNG、WebP、AVIF、GIF、SVG 或 TIFF 图像文件路径的字符串。也可以提供输入数组，这些将被合并。当未提供时，可将 JPEG、PNG、WebP、AVIF、GIF、SVG、TIFF 或原始像素图像数据以流形式传入对象中。 |
| `[options]`                  | Object                                                       |             | 如果提供，是一个包含可选属性的对象。                         |
| `options.failOn`             | string                                                       | `'warning'` | 处理无效像素数据时何时中止，按灵敏度从低到高为：`'none'`、`'truncated'`、`'error'`、`'warning'`。更高级别隐含更低级别。无效的元数据总是会中止。 |
| `options.limitInputPixels`   | number \| boolean                                            | 268402689   | 不处理像素数量（宽 × 高）超过此限制的输入图像。假设输入元数据中包含的图像尺寸是可信的。设为整数像素数，设为 0 或 false 以移除限制，设为 true 使用默认限制 268402689（0x3FFF x 0x3FFF）。 |
| `options.unlimited`          | boolean                                                      | false       | 设为 true 以移除有助于防止内存耗尽的安全机制（适用于 JPEG、PNG、SVG、HEIF）。 |
| `options.autoOrient`         | boolean                                                      | false       | 设为 true 以根据 EXIF 方向自动旋转/翻转图像（如果有）。      |
| `options.sequentialRead`     | boolean                                                      | true        | 设为 false 使用随机访问而非顺序读取。有些操作会自动这样做。  |
| `options.density`            | number                                                       | 72          | 用于矢量图像的 DPI，范围为 1 到 100000。                     |
| `options.ignoreIcc`          | number                                                       | false       | 是否忽略嵌入的 ICC 配置文件（如果有）。                      |
| `options.pages`              | number                                                       | 1           | 多页输入（GIF、WebP、TIFF）要提取的页数，设为 -1 表示所有页。 |
| `options.page`               | number                                                       | 0           | 多页输入（GIF、WebP、TIFF）开始提取的页码，从零开始。        |
| `options.subifd`             | number                                                       | -1          | 要为 OME-TIFF 提取的 subIFD（子图像文件目录），默认为主图像。 |
| `options.level`              | number                                                       | 0           | 要从多级输入（如 OpenSlide）中提取的级别，从零开始。         |
| `options.pdfBackground`      | string \| Object                                             |             | PDF 部分透明时使用的背景颜色。通过 color 模块解析以提取红、绿、蓝和 alpha 的值。需要使用支持 PDFium、Poppler、ImageMagick 或 GraphicsMagick 的全局安装 libvips。 |
| `options.animated`           | boolean                                                      | false       | 设为 true 可读取动画图像（GIF、WebP、TIFF）的所有帧/页，相当于将 pages 设为 -1。 |
| `options.raw`                | Object                                                       |             | 描述原始像素输入图像数据。请参阅 raw() 以了解像素排列。      |
| `options.raw.width`          | number                                                       |             | 图像宽度（像素整数）。                                       |
| `options.raw.height`         | number                                                       |             | 图像高度（像素整数）。                                       |
| `options.raw.channels`       | number                                                       |             | 通道数，范围为 1 到 4。                                      |
| `options.raw.premultiplied`  | boolean                                                      |             | 指定原始输入是否已进行 alpha 预乘，设为 true 可避免 sharp 再次预乘图像。可选，默认为 false。 |
| `options.create`             | Object                                                       |             | 描述要创建的新图像。                                         |
| `options.create.width`       | number                                                       |             | 图像宽度（像素整数）。                                       |
| `options.create.height`      | number                                                       |             | 图像高度（像素整数）。                                       |
| `options.create.channels`    | number                                                       |             | 通道数，可为 3（RGB）或 4（RGBA）。                          |
| `options.create.background`  | string \| Object                                             |             | 通过 color 模块解析以提取红、绿、蓝和 alpha 的值。           |
| `options.create.noise`       | Object                                                       |             | 描述要创建的噪声。                                           |
| `options.create.noise.type`  | string                                                       |             | 要生成的噪声类型，目前仅支持 gaussian。                      |
| `options.create.noise.mean`  | number                                                       |             | 生成噪声的像素平均值。                                       |
| `options.create.noise.sigma` | number                                                       |             | 生成噪声的像素标准差。                                       |
| `options.text`               | Object                                                       |             | 描述要创建的新文本图像。                                     |
| `options.text.text`          | string                                                       |             | 要作为 UTF-8 字符串渲染的文本。可包含 Pango 标记，例如 `<i>Le</i>Monde`。 |
| `options.text.font`          | string                                                       |             | 要使用的字体名称。                                           |
| `options.text.fontfile`      | string                                                       |             | 可由 font 使用的字体文件的绝对文件系统路径。                 |
| `options.text.width`         | number                                                       | 0           | 换行时的像素宽度。超出该宽度的文本行将在词边界处断开。       |
| `options.text.height`        | number                                                       | 0           | 最大高度（像素整数）。指定后，dpi 将被忽略，文本将自动适配由 width 和 height 定义的像素分辨率。如果未指定 width 或设为 0，将被忽略。 |
| `options.text.align`         | string                                                       | `'left'`    | 多行文本的对齐方式：`'left'`、`'centre'`、`'center'`、`'right'`。 |
| `options.text.justify`       | boolean                                                      | false       | 设为 true 可对文本进行两端对齐。                             |
| `options.text.dpi`           | number                                                       | 72          | 渲染文本时的分辨率（大小）。若指定了 height 则不生效。       |
| `options.text.rgba`          | boolean                                                      | false       | 设为 true 启用 RGBA 输出。用于彩色 emoji 渲染或支持 Pango 标记功能（如 `<span foreground="red">Red!</span>`）。 |
| `options.text.spacing`       | number                                                       | 0           | 文本行高（点数）。若未指定，则使用字体行高。                 |
| `options.text.wrap`          | string                                                       | `'word'`    | 提供 width 时的换行样式，可为 `'word'`、`'char'`、`'word-char'`（优先按词，回退按字符）或 `'none'`。 |
| `options.join`               | Object                                                       |             | 描述输入图像数组如何拼接。                                   |
| `options.join.across`        | number                                                       | 1           | 要横向拼接的图像数量。                                       |
| `options.join.animated`      | boolean                                                      | false       | 设为 true 将图像拼接为动画图像。                             |
| `options.join.shim`          | number                                                       | 0           | 拼接图像之间插入的像素数。                                   |
| `options.join.background`    | string \| Object                                             |             | 通过 color 模块解析以提取红、绿、蓝和 alpha 的值。           |
| `options.join.halign`        | string                                                       | `'left'`    | 横向拼接图像的对齐方式：`'left'`、`'centre'`、`'center'`、`'right'`。 |
| `options.join.valign`        | string                                                       | `'top'`     | 纵向拼接图像的对齐方式：`'top'`、`'centre'`、`'center'`、`'bottom'`。 |

**示例：**

```javascript
sharp('input.jpg')
  .resize(300, 200)
  .toFile('output.jpg', function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
```

**示例：**

```javascript
// Read image data from remote URL,
// resize to 300 pixels wide,
// emit an 'info' event with calculated dimensions
// and finally write image data to writableStream
const { body } = fetch('https://...');
const readableStream = Readable.fromWeb(body);
const transformer = sharp()
  .resize(300)
  .on('info', ({ height }) => {
    console.log(`Image height is ${height}`);
  });
readableStream.pipe(transformer).pipe(writableStream);
```

**示例：**

```javascript
// Create a blank 300x200 PNG image of semi-translucent red pixels
sharp({
  create: {
    width: 300,
    height: 200,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 0.5 }
  }
})
.png()
.toBuffer()
.then( ... );
```

**示例：**

```javascript
// Convert an animated GIF to an animated WebP
await sharp('in.gif', { animated: true }).toFile('out.webp');
```

**示例：**

```javascript
// Read a raw array of pixels and save it to a png
const input = Uint8Array.from([255, 255, 255, 0, 0, 0]); // or Uint8ClampedArray
const image = sharp(input, {
  // because the input does not contain its dimensions or how many channels it has
  // we need to specify it in the constructor options
  raw: {
    width: 2,
    height: 1,
    channels: 3
  }
});
await image.toFile('my-two-pixels.png');
```

**示例：**

```javascript
// Generate RGB Gaussian noise
await sharp({
  create: {
    width: 300,
    height: 200,
    channels: 3,
    noise: {
      type: 'gaussian',
      mean: 128,
      sigma: 30
    }
 }
}).toFile('noise.png');
```

**示例：**

```javascript
// Generate an image from text
await sharp({
  text: {
    text: 'Hello, world!',
    width: 400, // max width
    height: 300 // max height
  }
}).toFile('text_bw.png');
```

**示例：**

```javascript
// Generate an rgba image from text using pango markup and font
await sharp({
  text: {
    text: '<span foreground="red">Red!</span><span background="cyan">blue</span>',
    font: 'sans',
    rgba: true,
    dpi: 300
  }
}).toFile('text_rgba.png');
```

**示例：**

```javascript
// Join four input images as a 2x2 grid with a 4 pixel gutter
const data = await sharp(
 [image1, image2, image3, image4],
 { join: { across: 2, shim: 4 } }
).toBuffer();
```

**示例：**

```javascript
// Generate a two-frame animated image from emoji
const images = ['😀', '😛'].map(text => ({
  text: { text, width: 64, height: 64, channels: 4, rgba: true }
}));
await sharp(images, { join: { animated: true } }).toFile('out.gif');
```

