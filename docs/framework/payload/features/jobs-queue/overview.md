# 作业队列

Payload 的作业队列为您提供了一种简单但强大的方法，将大规模或未来的任务卸载到独立的计算资源上，这是许多应用框架的一个非常强大的功能。

## 示例使用场景

**非阻塞工作负载**
 如果您需要在 Payload 钩子中执行一些复杂、运行缓慢的逻辑，但又不希望该钩子“阻塞”或拖慢从 Payload API 返回的响应，您可以将此逻辑排队并稍后执行，而不是直接在钩子中运行，这样就不会阻塞 API 响应的返回，直到昂贵的工作完成。

示例：

- 从文档中创建向量嵌入，并在文档更改时保持同步
- 在文档更改时将数据发送到第三方 API
- 根据客户操作触发电子邮件

**定时操作**
 如果您需要在未来某个特定日期执行或处理某个操作，您可以使用 `waitUntil` 属性排队一个作业。这会确保该作业在 `waitUntil` 日期过去之前不会被“取走”。

示例：

- 处理计划的帖子，在未来设定的时间执行
- 在给定时间取消发布帖子
- 在客户注册试用后的 X 天发送提醒电子邮件

**周期性同步或类似定时操作**
 某些应用可能需要定期执行某种类型的操作。作业非常适合这种需求，因为您可以使用 cron 定时执行逻辑，计划每晚、每 12 小时或某个类似的时间间隔执行。

示例：

- 定期向所有客户发送电子邮件
- 每晚定期触发前端重建
- 在非高峰时段同步资源到或从第三方 API

**卸载复杂操作**
 您可能需要执行计算密集型的操作，这可能会减慢您主要的 Payload API 服务器的速度。作业队列允许您将这些任务卸载到独立的计算资源上，而不是减慢运行 Payload API 的服务器。通过 Payload 任务定义，您甚至可以通过动态导入仅在使用时加载大依赖项，从而将它们与主 Next.js 捆绑包分开。这样可以加快 Next.js + Payload 的编译速度，并确保大型依赖项不会被捆绑到您的 Payload 生产构建中。

示例：

- 您需要创建并保持文档的向量嵌入同步，但您使用的是开源模型来生成嵌入
- 您有一个 PDF 生成器，需要动态生成并向客户发送文档的 PDF 版本
- 您需要使用无头浏览器执行某些类型的逻辑
- 您需要执行一系列操作，每个操作都依赖于前一个操作，并且应尽可能以“持久”的方式运行

## 工作原理

在使用 Payload 的作业队列之前，有几个概念需要了解。我们建议在使用之前熟悉这些概念，以便能够充分理解如何利用 Payload 作业队列的强大功能。

1. 任务
2. 工作流
3. 作业
4. 队列

这些概念协同工作，使您能够将长时间运行、资源密集或定时安排的工作从主 API 中卸载。

快速概述：

- **任务** 是执行特定业务逻辑的函数
- **工作流** 是一组特定任务的集合，任务应按顺序运行，并且可以从特定的失败点重新尝试
- **作业** 是单个任务或工作流的一个实例，将被执行
- **队列** 是将作业分成不同“组”的方式——例如，一些作业在夜间执行，其他作业每 10 分钟执行一次