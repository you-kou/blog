# 任务

> [!NOTE]
>
> “任务”是执行业务逻辑的函数定义，其输入和输出都具有强类型。

您可以在 Payload 配置中注册任务，然后创建使用这些任务的作业或工作流。可以将任务视为整洁、独立的“执行特定操作的函数”。

Payload 任务可以配置为在失败时自动重试，这使得它们在“持久”工作流中非常有价值，尤其是在像 AI 应用程序这样的场景中，其中大语言模型（LLM）可能会返回非确定性结果，且可能需要重试。

任务可以通过以下两种方式定义：在 Payload 配置中的 `jobs.tasks` 数组内定义，或在工作流中内联定义。

### 在配置中定义任务

只需将任务添加到 Payload 配置中的 `jobs.tasks` 数组。每个任务包括以下字段：

| 选项              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| **slug**          | 为此任务定义一个基于 slug 的名称。这个 slug 在任务和工作流之间必须是唯一的。 |
| **handler**       | 负责执行该任务的函数。您可以传递一个基于字符串的路径，指向任务函数文件，或者直接传递任务函数本身。如果您的任务中使用了大型依赖，建议使用字符串路径，这样可以避免将大型依赖打包进 Next.js 应用程序。传递字符串路径是一个高级功能，可能需要复杂的构建管道才能正常工作。 |
| **inputSchema**   | 定义输入字段的 schema——Payload 将为此 schema 生成类型。      |
| **interfaceName** | 您可以使用 `interfaceName` 来更改为此任务生成接口的名称。默认情况下，这个名称是 "Task" + 任务的 slug（首字母大写）。 |
| **outputSchema**  | 定义输出字段的 schema——Payload 将为此 schema 生成类型。      |
| **label**         | 为此任务定义一个人类友好的标签。                             |
| **onFail**        | 如果任务失败，执行的函数。                                   |
| **onSuccess**     | 如果任务成功，执行的函数。                                   |
| **retries**       | 指定如果任务失败，应重试多少次。如果未定义，任务将继承工作流的重试次数，或者没有重试次数。如果为 0，则任务不会重试。默认值是未定义的。 |

任务的逻辑定义在 `handler` 中——该 `handler` 可以是一个函数，也可以是指向函数的路径。当工作进程拾取包含此任务的作业时，`handler` 将会运行。

它应该返回一个包含 `output` 键的对象，其中 `output` 应包含任务的输出内容，如您所定义的。

示例：

```js
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        // Configure this task to automatically retry
        // up to two times
        retries: 2,

        // This is a unique identifier for the task

        slug: 'createPost',

        // These are the arguments that your Task will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // These are the properties that the function should output
        outputSchema: [
          {
            name: 'postID',
            type: 'text',
            required: true,
          },
        ],

        // This is the function that is run when the task is invoked
        handler: async ({ input, job, req }) => {
          const newPost = await req.payload.create({
            collection: 'post',
            req,
            data: {
              title: input.title,
            },
          })
          return {
            output: {
              postID: newPost.id,
            },
          }
        },
      } as TaskConfig<'createPost'>,
    ],
  },
})
```

除了将处理函数直接定义为提供给 Payload 配置的函数外，您还可以传递一个绝对路径，指向处理函数定义的位置。如果您的任务有大量依赖，并且您计划在一个有文件系统访问权限的独立进程中执行作业，这可能是确保您的 Payload + Next.js 应用程序保持快速编译并且依赖最小的一个方便方法。

请记住，这是一个高级功能，可能需要复杂的构建管道，特别是在生产环境中或在 Next.js 中使用时，例如通过调用 `/api/payload-jobs/run` 端点。您需要单独转译处理程序文件，并确保它们在作业执行时可用。如果您使用端点来执行作业，建议在 Payload 配置中直接定义处理程序函数，或者将处理程序放在 Next.js 之外的导入路径中。

一般而言，这是一个高级用例。以下是如何配置的示例：

`payload.config.ts`:

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  jobs: {
    tasks: [
      {
        // ...
        // The #createPostHandler is a named export within the `createPost.ts` file
        handler:
          path.resolve(dirname, 'src/tasks/createPost.ts') +
          '#createPostHandler',
      },
    ],
  },
})
```

然后，`createPost` 文件本身：

`src/tasks/createPost.ts`：

```javascript
import type { TaskHandler } from 'payload'

export const createPostHandler: TaskHandler<'createPost'> = async ({
  input,
  job,
  req,
}) => {
  const newPost = await req.payload.create({
    collection: 'post',
    req,
    data: {
      title: input.title,
    },
  })
  return {
    output: {
      postID: newPost.id,
    },
  }
}
```

### 配置任务恢复

默认情况下，如果一个任务已经成功执行过，并且一个工作流重新运行，那么该任务不会被重新执行。相反，之前任务执行的输出将被返回。这是为了防止不必要的任务重复执行。

您可以通过 `retries.shouldRestore` 属性来配置这种行为。该属性接受布尔值或函数。

- 如果 `shouldRestore` 设置为 `true`，则任务只有在之前失败时才会重新执行。这是默认行为。
- 如果 `shouldRestore` 设置为 `false`，即使任务之前成功，任务也会重新执行，忽略最大重试次数。
- 如果 `shouldRestore` 是一个函数，则该函数的返回值将决定任务是否应该重新执行。这可以用于更复杂的恢复逻辑，例如您可能希望任务最多重新执行 X 次，然后在连续的运行中恢复，或者仅在输入发生变化时重新执行任务。

示例：

```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        retries: {
          shouldRestore: false,
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
```

示例 - 根据输入数据确定任务是否应该恢复：

```javascript
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        inputSchema: [
          {
            name: 'someDate',
            type: 'date',
            required: true,
          },
        ],
        retries: {
          shouldRestore: ({ input }) => {
            if (new Date(input.someDate) > new Date()) {
              return false
            }
            return true
          },
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
```

## 嵌套任务

您可以在现有任务中运行子任务，通过在任务处理函数中使用 `tasks` 或 `inlineTask` 参数来实现：

```javascript
export default buildConfig({
  // ...
  jobs: {
    // It is recommended to set `addParentToTaskLog` to `true` when using nested tasks, so that the parent task is included in the task log
    // This allows for better observability and debugging of the task execution
    addParentToTaskLog: true,
    tasks: [
      {
        slug: 'parentTask',
        inputSchema: [
          {
            name: 'text',
            type: 'text',
          },
        ],
        handler: async ({ input, req, tasks, inlineTask }) => {
          await inlineTask('Sub Task 1', {
            task: () => {
              // Do something
              return {
                output: {},
              }
            },
          })

          await tasks.CreateSimple('Sub Task 2', {
            input: { message: 'hello' },
          })

          return {
            output: {},
          }
        },
      } as TaskConfig<'parentTask'>,
    ],
  },
})
```

