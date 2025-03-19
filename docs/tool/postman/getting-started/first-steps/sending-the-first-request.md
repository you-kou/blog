# 发送你的第一个API请求

Postman的API客户端让你可以创建并发送API请求，包括HTTP、GraphQL和gRPC请求。使用Postman，你可以向接口发送请求、从数据源获取数据，或者测试API的功能，**无需在终端输入命令或编写代码**。当你创建一个新请求并点击“发送”时，API的响应会直接显示在Postman里。

## 发送API请求

确保你已经**下载并安装**了Postman桌面应用程序。准备好后，打开Postman桌面应用，开始发送你的第一个API请求。

1. 在工作区中选择 **“+”** 打开一个新标签页。
2. 在请求URL中输入 **`postman-echo.com/get`**。
3. 点击 **“发送”**（Send）。

Postman会在下方的面板中显示服务器返回的响应数据。

![](https://assets.postman.com/postman-docs/v11/send-first-request-v11.23b.jpg)

## 发生了什么？

在这个示例中，Postman充当了客户端应用程序，与API服务器进行通信。让我们看看当你点击**“发送”**时发生了什么：

1. **Postman** 向位于 **`postman-echo.com`** 的 **Postman Echo API** 服务器发送了一个 **GET** 请求。
2. **API服务器** 接收到请求，进行处理，然后返回了一个响应给Postman。
3. **Postman** 收到了这个响应，并在**响应面板**中展示了结果。

**你成功用Postman发送了一个API请求，并得到了来自API服务器的响应**。不妨停下来，感受一下这个过程有多酷！

![](https://assets.postman.com/postman-docs/anatomy-of-a-request-v8.jpg)