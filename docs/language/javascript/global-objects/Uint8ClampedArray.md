# Uint8ClampedArray

**`Uint8ClampedArray`**（8 位无符号整型固定数组）类型化数组表示一个由值固定在 0-255 区间的 8 位无符号整型组成的数组；如果你指定一个在 [0,255] 区间外的值，它将被替换为 0 或 255；如果你指定一个非整数，那么它将被设置为最接近它的整数。（数组）内容被初始化为 0。一旦（数组）被创建，你可以使用对象的方法引用数组里的元素，或使用标准的数组索引语法（即使用方括号标记）。