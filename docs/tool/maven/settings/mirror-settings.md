# 为仓库使用镜像

通过仓库（Repositories），你可以指定从哪些位置下载特定的构件（如依赖项和 Maven 插件）。仓库可以在项目内部声明，这意味着如果你有自定义仓库，与你共享项目的用户可以直接获得正确的配置。然而，你可能希望为特定仓库使用备用镜像，而不修改项目文件。

使用镜像的原因包括：

- 互联网上有一个同步的镜像，地理位置更近，下载速度更快。
- 你希望用自己的内部仓库替换特定的仓库，以便更好地控制。
- 你想运行一个仓库管理器来提供本地缓存，并需要使用它的 URL 作为镜像。

要为指定的仓库配置镜像，你需要在你的 `settings.xml` 文件（位于 `${user.home}/.m2/settings.xml`）中进行设置。你需要为新的镜像仓库指定唯一的 `id` 和 `url`，并通过 `mirrorOf` 指定所要镜像的仓库 ID。

例如，Maven 默认包含的主中央仓库（Maven Central）的 ID 是 `central`，如果你想使用不同的镜像实例，可以进行如下配置：

```xml
<settings>
  ...
  <mirrors>
    <mirror>
      <id>other-mirror</id>
      <name>Other Mirror Repository</name>
      <url>https://other-mirror.repo.other-company.com/maven2</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
  </mirrors>
  ...
</settings>
```

请注意，对于每个仓库，最多只能配置一个镜像。换句话说，你不能将同一个仓库映射到一组具有相同 `<mirrorOf>` 值的镜像。Maven 不会合并这些镜像，而是仅选择第一个匹配项。

如果你希望对多个仓库提供一个统一的视图，应该使用仓库管理器（Repository Manager）来实现。

注意：官方 Maven 仓库位于 https://repo.maven.apache.org/maven2，由 Sonatype 公司托管，并通过 CDN 在全球范围内分发。

## 解决maven下载速度慢的问题

Maven下载依赖速度慢通常是由于默认仓库位于国外，网络延迟较高。

以下是几个常见的国内 Maven 镜像配置，你可以将它们添加到 `settings.xml` 文件中，以加快依赖下载速度。

### 阿里云 Maven 镜像

```xml
<mirrors>
    <mirror>
        <id>aliyunmaven</id>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

------

### 华为云 Maven 镜像

```xml
<mirrors>
    <mirror>
        <id>huaweicloud</id>
        <mirrorOf>central</mirrorOf>
        <url>https://repo.huaweicloud.com/repository/maven/</url>
    </mirror>
</mirrors>
```

------

### 腾讯云 Maven 镜像

```xml
<mirrors>
    <mirror>
        <id>tencent</id>
        <mirrorOf>central</mirrorOf>
        <url>https://mirrors.cloud.tencent.com/nexus/repository/maven-public/</url>
    </mirror>
</mirrors>
```

------

### 网易 Maven 镜像

```xml
<mirrors>
    <mirror>
        <id>netease</id>
        <mirrorOf>central</mirrorOf>
        <url>https://mirrors.163.com/maven/repository/maven-public/</url>
    </mirror>
</mirrors>
```

------

### 开源中国 Maven 镜像

```xml
<mirrors>
    <mirror>
        <id>oschina</id>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.oschina.net/content/groups/public/</url>
    </mirror>
</mirrors>
```

------

### 清华大学 Maven 镜像

```xml
<mirrors>
    <mirror>
        <id>tuna</id>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.tuna.tsinghua.edu.cn/repository/maven-central/</url>
    </mirror>
</mirrors>
```

------

### 配置多个镜像

```xml
<mirrors>
    <mirror>
        <id>aliyunmaven</id>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
    <mirror>
        <id>huaweicloud</id>
        <mirrorOf>central</mirrorOf>
        <url>https://repo.huaweicloud.com/repository/maven/</url>
    </mirror>
    <mirror>
        <id>tuna</id>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.tuna.tsinghua.edu.cn/repository/maven-central/</url>
    </mirror>
</mirrors>
```

------

### 注意事项

- **`<mirrorOf>` 标签**：指定镜像的作用范围。`central` 表示替换 Maven 中央仓库，你也可以使用 `*` 替换所有仓库。
- **优先级**：Maven 会按顺序使用第一个可用的镜像。
- **网络环境**：根据你的网络环境选择最适合的镜像。