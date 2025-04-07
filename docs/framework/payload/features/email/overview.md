# 电子邮件功能

## 简介

Payload 有几个可以导入的电子邮件适配器，用于启用电子邮件功能。大多数人会想要安装 `@payloadcms/email-nodemailer` 包。这个包提供了一种简单的方式来使用 Nodemailer 发送电子邮件，对于已经熟悉 Nodemailer 的人来说不会造成困扰。

电子邮件适配器应该传递给 Payload 配置中的 `email` 属性。这样 Payload 就可以发送与身份验证相关的电子邮件，比如密码重置、新用户验证，以及满足你可能有的任何其他电子邮件发送需求。

## 配置

### 默认配置

当不需要或不想使用电子邮件功能时，Payload 在启动时会记录一条警告信息，提示电子邮件功能未配置。而且，每次尝试发送电子邮件时，也会记录一条警告信息。

### 电子邮件适配器

一个电子邮件适配器至少需要以下字段：

| 选项                   | 描述                                             |
| ---------------------- | ------------------------------------------------ |
| `defaultFromName` *    | 邮件发送时 “发件人” 字段中显示的名称部分         |
| `defaultFromAddress` * | 邮件发送时 “发件人” 字段中使用的电子邮件地址部分 |

注：带星号（*）表示该字段为必需项。

### 官方电子邮件适配器

| 名称       | 包名                           | 描述                                                         |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| Nodemailer | @payloadcms/email - nodemailer | 可使用任何 Nodemailer 传输方式，包括 SMTP、Resend、SendGrid 等。在 Payload 2.x 中此为默认提供的适配器，是最简单的迁移途径。 |
| Resend     | @payloadcms/email - resend     | 通过 Resend 的 REST API 发送电子邮件。对于像 Vercel 这样的无服务器平台，此适配器是首选，因为它比 Nodemailer 适配器轻量得多。 |

## Nodemailer 配置

| 选项               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `transport`        | 当你想自行配置时使用的 Nodemailer 传输对象。若设置了 `transportOptions`，则不需要此选项。 |
| `transportOptions` | 用于配置 Payload 将创建的传输器的对象。有关所有可用选项，请参阅 Nodemailer 文档或查看以下示例。 |

## 使用 SMTP

可以通过在电子邮件选项中的 `transportOptions` 对象来传递简单邮件传输协议（SMTP）的相关选项。有关更多信息，包括何时应将 `secure` 设置为 `true` 或 `false` 的详细信息，请参阅 Nodemailer 的 SMTP 文档。

**以下是使用 SMTP 的电子邮件选项示例：**

```typescript
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    // Nodemailer 传输选项
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
```

**使用 `nodemailer.createTransport` 的电子邮件选项示例：**

```typescript
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    // 可以使用任何 Nodemailer 传输方式
    transport: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
})
```

**自定义传输：**

你也可以使用自己的 Nodemailer 传输方式。以下是使用 SendGrid 的 Nodemailer 传输方式的示例：

```typescript
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    transportOptions: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    }),
  }),
})
```

在开发过程中，如果不向 `nodemailerAdapter` 传递任何参数，它将使用 `ethereal.email` 服务。

在启动时，这会将 `ethereal.email` 的详细信息记录到控制台。

```typescript
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter(),
})
```

## Resend 配置

Resend 适配器要求在选项中传入 API 密钥，该密钥可在 Resend 仪表板中找到。如果你在 Vercel 上部署应用，推荐使用这个包，因为它比 Nodemailer 适配器轻量得多。

| 选项     | 描述                     |
| -------- | ------------------------ |
| `apiKey` | Resend 服务的 API 密钥。 |

```typescript
import { buildConfig } from 'payload'
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'dev@payloadcms.com',
    defaultFromName: 'Payload CMS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
```

## 发送邮件

当配置好有效的传输方式后，在任何可以访问 Payload 的地方，你都能通过调用 `payload.sendEmail(message)` 来发送邮件。`message` 对象需包含收件人 `to`、邮件主题 `subject` 以及邮件内容（可以是 HTML 格式的 `html` 或者纯文本格式的 `text`）。此外，还有其他可选配置项，具体可查看 `sendEmail` 方法的参数说明。不过，对这些可选配置的支持情况取决于所使用的适配器。

```typescript
// 发送邮件示例
const email = await payload.sendEmail({
  to: 'test@example.com',
  subject: '这是一封测试邮件',
  text: '这是我的邮件正文内容',
});
```

## 使用多个邮件提供商

Payload 支持使用单个电子邮件传输器，但这并不妨碍你使用多个传输器。设想这样一个应用场景：批量发送电子邮件的处理方式与事务性电子邮件的处理方式不同，并且可以通过钩子函数来实现这种不同的处理。