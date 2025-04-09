# CanvasRenderingContext2D：getImageData() 方法

Canvas 2D API 的 **`CanvasRenderingContext2D.getImageData()`** 返回一个 `ImageData` 对象，用于描述 canvas 指定区域的隐含像素数据。

这个方法不受画布的变换矩阵影响。如果指定的矩形超出画布的边界，返回的 `ImageData` 对象中超出画布边界的像素将是透明黑色。

## 语法

```javascript
getImageData(sx, sy, sw, sh)
getImageData(sx, sy, sw, sh, settings)
```

### 参数

- `sx`

  要提取 `ImageData` 的矩形左上角的 x 轴坐标。

- `sy`

  要提取 `ImageData` 的矩形左上角的 y 轴坐标。

- `sw`

  要提取 `ImageData` 的矩形的宽度。正值向右延伸，负值向左延伸。

- `sh`

  要提取 `ImageData` 的矩形的高度。正值向下延伸，负值向上延伸。

- `settings` 可选

  一个具有以下属性的对象：`colorSpace`：指定图像数据的颜色空间。可以设置为 `"srgb"` 表示 sRGB 色彩空间，或 `"display-p3"` 表示 display-p3 色彩空间。

### 返回值

包含指定矩形的画布图像数据的 `ImageData` 对象。矩形的左上角坐标为 `(sx, sy)`，右下角坐标为 `(sx + sw - 1, sy + sh - 1)`。

### 异常

- `IndexSizeError` `DOMException`

  如果 `sw` 或 `sh` 中有任何一个为零时抛出。

- `SecurityError` `DOMException`

  画布包含或可能包含从与文档本身加载的原点不同的源加载的像素。 要避免在此情况下抛出 `SecurityError` `DOMException`，请配置 CORS 允许以这种方式使用源图像。参见允许图片和 canvas 跨源使用。