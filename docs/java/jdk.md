<script setup>
import JdkVersion from '../components/JdkVersion/index.vue'
</script>

# JDK

对于每一个 Java 开发者来说，安装  JDK（Java Development Kit）是学习和使用 Java 的第一步。它包含以下主要功能：

1. **编译工具**：将Java代码（.java文件）编译成字节码（.class文件）。
2. **运行环境**：自带JVM（Java虚拟机）运行Java程序。
3. **开发工具**：如`javac`（编译器）、`java`（运行工具）、`jar`（打包工具）等。
4. **标准库**：JDK内置了大量的标准类库，包含文件操作、网络编程、多线程、集合框架等常用功能，开发者可以直接调用这些库，而无需从零编写功能。

简单来说，JDK 是 Java 开发的必备工具，帮助开发者编写、调试和运行Java程序。

## JDK 版本

JDK 的版本主要分为以下两类：

1. **LTS 版本**：这些版本是 Oracle 官方长期支持的稳定版本，适用于生产环境。JDK 8、JDK 11和 JDK 17都是LTS版本，它们在发布后会得到更长时间的更新和支持‌。

2. **非 LTS 版本**‌：这些版本虽然包含新特性和改进，但生命周期相对较短，通常支持六个月。例如，JDK 9、JDK 10、JDK 12至 JDK 16都是非 LTS 版本‌。

在选择 JDK 版本时，应当首选 JDK LTS 版本。LTS 版本具有以下优点：

- LTS（Long-Term Support）版本在发布前会经历更严格和全面的测试流程。例如，OpenJDK 的 LTS 版本会经过多个阶段的测试，包括功能测试、性能测试、兼容性测试等，以确保在各种不同的环境和应用场景下都能稳定运行，减少出现漏洞和错误的可能性。

- JDK LTS 版本通常会有较长的支持周期，一般为 5 年甚至更长时间。在这个期间内，会持续提供安全更新、性能优化和 Bug 修复等服务。例如，Oracle JDK 的 LTS 版本会在一定的时间内提供商业支持，保障用户的应用系统能够及时获得必要的更新和维护。

- JDK LTS 版本在设计和开发过程中，会充分考虑与其他主流技术框架、工具和库的兼容性。例如，Spring 框架、Hibernate 框架等通常会针对 JDK LTS 版本进行专门的测试和优化，确保在使用这些技术构建的应用中，JDK LTS 版本能够与它们良好地协同工作。

<JdkVersion />

## JDK 供应商

JDK（Java Development Kit）是Java开发的标准工具集，它定义了Java编程的规范和标准，涵盖了Java虚拟机（JVM）、Java核心类库以及一系列开发工具，是一个概念性的统称。

Java编程语言和JDK最初由Sun Microsystems公司开发，在Oracle收购Sun Microsystems之后，Oracle便成为了Java技术的主要维护者和规范制定者。Oracle通过Java Community Process（JCP）这一开放的、基于社区的流程来管理Java技术的发展和标准制定工作。在这个过程中，全球的Java开发者和利益相关者都能够参与到Java规范的制定和评审环节，但最终的决定权仍掌握在Oracle手中。
Oracle制定了JDK标准之后，其他各供应商就可以依据该标准来开发各自版本的JDK软件。尽管Oracle是JDK标准的主要制定者，但其他供应商也能根据自身的需求和特点，对 JDK 进行构建、优化以及扩展，从而推出具有自身特色的JDK发行版。
如今，JDK供应商众多，常见的有Oracle、OpenJDK、IBM、Amazon、Microsoft等。在选择JDK供应商时，需要综合考虑多个因素，比如技术支持（包括商业支持和社区支持）、性能优化（结合特定场景以及基准测试结果）、安全性（关注更新频率和漏洞处理情况）、兼容性（与各类框架库及操作系统的适配性）、成本（是付费使用还是免费获取）以及市场份额和口碑等。

在日常开发工作中，开发者通常会在Oracle JDK和OpenJDK这两者之间进行选择。

### Oracle JDK

Oracle JDK 是由 Oracle 公司开发并维护的 Java 开发工具包，作为 JDK 规范的一种具体实现，在商业应用中应用广泛。它历经 Oracle 公司严格的测试和质量控制流程，稳定性表现出色，Oracle 还会为其提供专业的技术支持与维护服务，十分适用于对稳定性和技术支持要求较高的企业级应用场景。

不过，Oracle JDK 采用 Oracle Binary Code License Agreement（BCLA），在商业使用方面存在一定限制，比如在某些情况下，尤其是在商业生产环境中使用时，可能需要购买许可证。这意味着在商业使用过程中，可能面临许可证限制和成本问题，特别是在大规模商业部署时，企业需要将许可证费用纳入考量范围。

正因如此，它尤为适合对稳定性和商业技术支持要求较高的企业级项目，特别是金融、电信等对软件稳定性、可靠性和合规性有着严格要求的关键领域，Oracle 提供的专业技术支持和长期维护，能够切实满足这些领域的需求。

### OpenJDK

<img title="" src="https://r2.code-snippet.online/md/java/jdk/openjdk.png" alt="">

OpenJDK 是一个开源的 JDK 项目，它的诞生源于开源运动的兴起。2006 年，为满足社区对开源 Java 实现的需求，Sun Microsystems 将 Java 的大部分源代码开源，从而形成了 OpenJDK 项目。自此，OpenJDK 成为 Java 社区共同开发和维护的基础，任何人都能参与其开发过程，极大地促进了 Java 技术的快速发展与创新。

OpenJDK 由社区共同维护和开发，众多供应商基于它进行构建并提供服务，像 Adoptium（原 AdoptOpenJDK）、Red Hat、Azul Systems 等。它是 Oracle JDK 的开源版本，由 OpenJDK 社区负责开发和维护，基于 GPLv2（General Public License version 2）协议。这一协议允许开发者在各种场景下自由使用和修改代码，无需担忧版权问题，因此在开源项目和众多企业中得到广泛应用。

OpenJDK 具有诸多显著特点。它开源免费，使用成本低，且社区活跃，更新速度快，能够及时引入新的 Java 特性和技术，满足项目对新技术的需求。它注重开源和社区驱动，通常会迅速引入新的 Java 特性和技术以契合开发者的需求。虽然其功能与 Oracle JDK 基本一致，但在某些特性的实现细节和优化方向上可能存在差异。它还具备高度的可定制性和开放性，允许开发者自由地使用、修改和分发代码。借助社区的力量，OpenJDK 得以快速发展和持续改进，新特性和功能的推出速度较快。

在适用场景方面，OpenJDK 广泛应用于开源项目、对成本敏感的项目以及追求快速迭代和创新的互联网项目。这些项目往往看重技术的开放性和灵活性，期望能快速跟上 Java 技术的发展步伐，同时有效控制成本。

不过，OpenJDK 也存在一定局限。相对而言，其技术支持主要依赖社区，可能不像商业支持那样全面和及时。在某些特定场景下，项目团队或许需要自行解决一些技术问题。

#### OpenJDK 发行版

OpenJDK 是一个开源项目，很多供应商和组织基于其源代码构建了不同的发行版。

##### Eclipse Temurin

其前身为 AdoptOpenJDK，是由 Adoptium 社区维护和管理的 OpenJDK 发行版。该社区由众多企业和开发者组成，旨在提供高质量、中立且跨平台的 OpenJDK 构建版本。

提供多种操作系统（如 Windows、Linux、macOS）和架构（如 x64、ARM）的预构建包，构建过程经过严格测试，确保了稳定性和兼容性。

适用于各类 Java 开发项目，尤其适合对版本兼容性和稳定性有要求，且希望使用社区支持版本的开发者和企业。

##### Oracle OpenJDK

Oracle 是 Java 技术的原开发者和重要推动者，虽然 Oracle JDK 有商业版，但也提供基于 OpenJDK 的开源发行版。

与 Oracle 的其他产品（如数据库、中间件等）有更好的兼容性和集成性。在性能优化和稳定性方面有一定优势，并且提供了一些企业级的工具和特性。

适用于已经广泛使用 Oracle 技术栈的企业级项目，对 Java 开发环境的稳定性、性能以及与现有系统的兼容性有较高要求的场景。

##### Azul Zulu

由 Azul Systems 公司提供，Azul 在 Java 领域有深厚的技术积累，专注于提供高性能的 Java 运行时解决方案。

在垃圾回收和内存管理方面进行了优化，能显著提升应用的性能和响应速度。提供从嵌入式设备到数据中心的全系列 Java 运行时支持，并且支持长期支持版本（LTS）。

适用于对性能要求较高的大规模企业级应用，如金融交易系统、电商平台等。

##### Alibaba Dragonwell

<img title="" src="https://r2.code-snippet.online/md/java/jdk/alibaba-dragonwell.jpg" alt="">

由阿里巴巴基于 OpenJDK 开发，经过阿里巴巴内部大规模业务场景的验证和优化。

针对电商、金融等互联网业务场景进行了性能优化，例如在高并发处理、内存管理等方面表现出色。提供长期支持，保障企业应用的稳定运行。

适合国内互联网企业的 Java 应用开发，特别是电商、金融科技等领域的高并发业务场景。

## 参考资料

- [Java 版本历史](https://zh.wikipedia.org/zh-cn/Java%E7%89%88%E6%9C%AC%E6%AD%B7%E5%8F%B2)
- [Oracle OpenJDK 下载](https://jdk.java.net/archive/)
- [Oracle JDK 下载](https://www.oracle.com/java/technologies/downloads/?er=221886)
- [OpenJDK 官网](https://openjdk.org/)

<style module>
img {
  margin: 0 auto;
}
</style>
