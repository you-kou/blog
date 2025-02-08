# 资源命名

> [!IMPORTANT]
>
> 原文：[Learn REST API Design](https://www.restapitutorial.com/)

除了适当使用 HTTP 动词之外，**资源命名** 可能是创建清晰易用的 Web 服务 API 时最受讨论、最重要的概念之一。
如果资源命名得当，API 将直观且易于使用；如果命名不佳，API 可能会显得笨拙，难以理解和使用。
以下是一些关于为新 API 设计资源 URI 的建议，希望能帮助你入门。

> [!TIP]
>
> 每个资源应仅有两个基本 URL：
>
> 1. **集合 URL**（示例：`/users`）——用于表示该资源的集合。
> 2. **单个资源 URL**（示例：`/users/1234`）——用于表示集合中的特定元素。

本质上，RESTful API 只是由 **URI 集合、针对这些 URI 的 HTTP 调用，以及资源的 JSON 和/或 XML 表示** 组成，其中许多资源包含关系链接。RESTful 的 **可寻址性原则** 通过 URI 体现，每个资源都有自己的地址（URI），服务器可以提供的所有有价值的信息都被暴露为资源。**统一接口约束** 部分体现在 URI 和 HTTP 动词的结合，并且需要遵循标准和约定来使用它们。

在确定系统中的资源时，**应该使用名词而非动词或动作来命名**。换句话说，RESTful URI 应该指向某个“事物”（资源），而不是某个“动作”。名词具有属性，而动词则没有，这也是两者的一个重要区别。

一些示例资源：

- **系统中的用户** → `/users`
- **学生所选课程** → `/students/{student_id}/courses`
- **用户的帖子时间线** → `/users/{user_id}/timeline`
- **关注某个用户的其他用户** → `/users/{user_id}/followers`
- **关于马术的文章** → `/articles/horseback-riding`

服务套件中的每个资源至少应有一个 URI 来标识它。理想情况下，该 URI 应该**清晰易懂，并能够准确描述资源**。为了提高可理解性和可用性，URI 结构应遵循**可预测性**和**层次性**：

- **可预测性**意味着 URI 具有一致性，使其易于理解和记忆。
- **层次性**意味着 URI 体现数据的结构和关系，使资源组织更清晰。

虽然这并非 REST 的强制性规则或约束，但遵循这些原则可以提高 API 的可用性。

RESTful API 是面向**使用者** 设计的，因此 **URI 的命名和结构应传达清晰的意义**，让使用者能够轻松理解和操作。确定数据的边界可能并不容易，但只要深入理解你的数据，你通常可以找到合适的方式，为客户端提供合理的资源表示。**API 设计应以客户端需求为核心，而不是围绕数据存储方式进行设计。**

假设我们正在描述一个包含**客户**（customers）、**订单**（orders）、**订单项**（line items）、**产品**（products）等的订单系统。请考虑以下用于描述该服务套件中资源的 URI：

## 资源 URI 示例

### 客户

要在系统中插入（创建）一个新客户，我们可以使用：

- **POST** `http://www.example.com/customers`

要读取客户 ID 为 33245 的客户：

- **GET** `http://www.example.com/customers/33245`

相同的 URI 也可以用于 **PUT** 和 **DELETE**，分别用于更新和删除：

### 产品

以下是为产品提出的 URI 示例：

- **创建新产品**：
  - **POST** `http://www.example.com/products`
- **读取、替换、更新、删除 产品 ID 为 66432 的产品**，分别为：
  - **GET** `http://www.example.com/products/66432`
  - **PUT** `http://www.example.com/products/66432`
  - **PATCH** `http://www.example.com/products/66432`
  - **DELETE** `http://www.example.com/products/66432`

### 订单

现在，这就变得有趣了……如何为客户创建一个新订单呢？一个选择可能是：

- **POST** `http://www.example.com/orders`
  这确实能创建一个订单，但它可能不太符合客户的上下文。

因为我们想为一个客户创建订单（注意到资源之间的关系），这个 URI 可能没有那么直观。可以说，以下 URI 会提供更清晰的表达：

- **POST** `http://www.example.com/customers/33245/orders`

  现在我们明确知道这是为客户 ID# 33245 创建的订单。

那么以下这个会返回什么？

- **GET** `http://www.example.com/customers/33245/orders`很可能会返回客户 #33245 创建或拥有的订单列表。注意：我们可能会选择不支持该 URL 的 **DELETE** 或 **PUT** 方法，因为它是在操作客户所有订单的集合。

接下来，延续层次化概念，如何设计以下 URI 呢？

- **POST** `http://www.example.com/customers/33245/orders/8769/lineitems`这可能会为客户 ID# 33245 的订单 #8769 添加一个订单项。没错！**GET** 该 URI 可能会返回该订单中的所有订单项。然而，如果订单项不仅在客户上下文中有意义，也在客户之外的上下文中有意义，我们可能会提供一个：

- **POST** `http://www.example.com/orders/8769/lineitems`

沿着这个思路，由于可能存在多个 URI 用于表示同一资源，我们也可能提供：

- **GET** `http://www.example.com/orders/8769`这个 URI 允许我们根据订单号来检索订单，而不需要知道客户的编号。

为了更深入地体现层次结构：

- **GET** `http://www.example.com/customers/33245/orders/8769/lineitems/1`这可能会返回该订单中第一个订单项。

到这里，你应该能够看到层次化概念是如何运作的。没有硬性规则，关键是确保所设计的结构对服务的使用者来说是合理的。正如在软件开发的所有技巧中，**命名**对成功至关重要。

## 其他示例 API

查看一些广泛使用的 API 可以帮助你理解这个概念，并利用团队成员的直觉来优化 API 资源的 URI。以下是一些示例 API：

- **Twitter**: https://developer.twitter.com/en/docs/api-reference-index
- **Facebook**: https://developers.facebook.com/docs/reference/api/
- **LinkedIn**: https://developer.linkedin.com/apis