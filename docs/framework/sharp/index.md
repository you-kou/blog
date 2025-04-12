# [高性能 Node.js 图像处理](https://sharp.pixelplumbing.com/)

这个高速 Node-API 模块的典型使用场景是将常见格式的大图像转换为尺寸不同、适合网页使用的 JPEG、PNG、WebP、GIF 和 AVIF 小图像。

它可以在所有支持 Node-API v9 的 JavaScript 运行时中使用，包括 Node.js >= 18.17.0、Deno 和 Bun。

由于使用了 libvips，图像缩放的速度通常比最快的 ImageMagick 和 GraphicsMagick 设置快 4 到 5 倍。

颜色空间、嵌入的 ICC 配置文件以及 Alpha 透明通道都能被正确处理。Lanczos 重采样可确保在高速处理的同时不牺牲图像质量。

除了图像缩放外，还支持旋转、裁剪、合成和伽马校正等操作。

大多数现代的 macOS、Windows 和 Linux 系统无需额外安装或运行时依赖。

```sh
npm install sharp
```

