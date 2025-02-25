https://www.rfc-editor.org/rfc/rfc6570.html



# URI 模板（RFC 6570）

[URI 模板](https://www.rfc-editor.org/rfc/rfc6570.html)是一种紧凑的字符序列，通过变量扩展来描述一系列统一资源标识符（URI）。本规范定义了 URI 模板的语法，以及将 URI 模板扩展为 URI 引用的过程，并提供了在互联网中使用 URI 模板的指南。

## 介绍

### 概述

统一资源标识符（URI） [RFC3986] 通常用于在一组类似资源的公共空间（非正式称为“URI 空间”）中标识特定资源。例如，个人网站空间通常使用一种通用模式进行分配，例如：

- `http://example.com/˜fred/`

- `http://example.com/˜mark/`

或者一组词典条目可能按术语的首字母分组，形成层次结构，如同

- `http://example.com/dictionary/c/cat`
- `http://example.com/dictionary/d/dog`