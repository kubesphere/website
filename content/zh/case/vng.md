---
title: VNG
description:

css: scss/case-detail.scss

section1:
  title: VNG
  content: VNG Corporation 是越南领先的互联网科技公司。在 2014 年，我们被评为越南唯一一家估值 10 亿美元的创业公司。VNG 推出了许多重要产品，比如 Zalo、ZaloPay 和 Zing 等，吸引了数亿用户。
  image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619222719.png

section2:
  listLeft:
    - title: ZaloPay 介绍
      contentList:
        - content: ZaloPay 发布于 2017 年，建立在 Zalo 的基础上，继承了 Zalo 生态中的诸多便利。在 Zalo 已有的生态系统中有着庞大的 Zalo 用户，活跃用户在 1 亿左右。相较于 Momo、Moca 的 GrabPay，以及 ViettelPay 等，ZaloPay 更具竞争力。
        - content: 在由越南最大的新闻类门户网站 VnExpress 所举办的 2018 技术大奖（2018 Tech Awards）颁奖典礼上，ZaloPay 荣获年度支付应用程序第三名。MoMo 占据头名位置，ViettelPay 紧随其后，Moca 的 GrabPay、VinGroup 的 VinID 以及 SEA 的 AirPay 也加入了市场，整个环境非常激烈。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619222719.png

    - title: 拥抱新科技
      contentList:
        - content: VNG 是一家大公司，业务领域广泛。我们致力于使用最为尖端的框架、技术和编程语言来开发产品，创建架构。
        - content: 依靠过时的架构去构建和开发应用程序会导致可扩展性、适应性和可观测性等各方面的问题。例如，对于传统的单体架构，想要对一个大型、复杂的紧耦合应用程序进行更改非常之难。此外，单体架构可扩展性差、技术壁垒高。换言之，产品上市的计划可能会延后，更新周期也会拉长。然而，我们所追求的是业务的快速发展与交付，各类服务需要对各种改变迅速作出反应。
        - content: 毫无疑问，Docker 和 Kubernetes 为满足我们的业务需求提供了最好的自定义技术架构。关于容器化和其优势所在自不必多说。组件化加快了我们的开发速度，开发出的产品也更为可靠。Kubernetes 让我们的滚动升级和回滚模式自动化，通过探针监控应用的状况。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619223445.png

    - title: 采用 Kubernetes 和 KubeSphere
      contentList:
        - content: 2018 年底，我们使用 Kubernetes 作为容器编排解决方案。Kubernetes 帮助我们声明式地管理我们的集群，让我们得以控制应用版本，轻松复制应用。然而，有太多的问题需要我们去考虑，如日志监控、DevOps 和中间件等，这也使得 Kubernetes 的学习曲线相对较高。实际上，我们对几种最常用的工具进行了调研。例如，我们利用 EFK 进行日志管理，采用 Jenkins 作为 CI/CD 的引擎进行业务更新，我们也会在自己的环境中使用 Redis 和 Kafka。
        - content: 这些常用的工具帮助我们提升了开发和运营的效率。然而，我们当前最大的挑战是开发者们需要学习、维护这些工具，在不同的终端和界面之间来回切换也相当耗费时间。因此，我们开始研究一种集中化的解决方案，可以将云原生技术栈集成到一个统一的 Web 控制台。我们对比了一些解决方案（如 Rancher 和原生的 Kubernetes），最后发现 KubeSphere 最为方便。
        - content: 我们把 KubeSphere 安装在已有的 Kubernetes 集群上。目前，我们拥有两个 Kubernetes 集群，分别用于沙盒和生产环境。考虑到数据隐私问题，我们把集群都部署在物理机上。我们使用 HAProxy 安装高可用集群以实现流量的负载均衡。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619223626.png

    - title: 为什么我们选择 KubeSphere
      contentList:
        - content: 借助 KubeSphere 提供的对开发者友好的向导式操作界面，我们能轻松地监控从基础设施到应用程序的资源消耗情况。由此，ZaloPay 商户平台在 KubeSphere 上也已经稳定运行了半年。KubeSphere 提供了一系列功能，整合并打包了云原生技术栈，例如开箱即用的应用程序生命周期管理功能、监控日志、多租户以及告警通知等。由于每个功能和组件都可插拔，我们可以根据自己的需求去启用。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619224814.png

    - type: 1
      contentList:
        - content: 对开发者友好的 Web 控制台
        - content: 多维度监控功能
        - content: 功能丰富且可插拔

    - title: 如何实现 DevOps
      contentList:
        - content: 通过执行 CI/CD 流水线，我们直接运行 ZaloPay 的商户平台。如下方视图，我们使用 KubeSphere 运行 CI/CD 流水线，将 GitLab、SonarQube、Docker、Kubernetes 和 Docker 仓库都整合到一套流程中。在第一阶段，流水线会对整个流程所需的一些必要环境进行初始化。接下来，通过设定环境条件（例如 checkout branch, deploy env 和 tag version 等），流水线会拉取 GitLab 上的源代码。在第三阶段会对 Golang 项目进行构建，触发 SonarQube 分析源代码，检查其质量。如果没有特殊情况或者代码没有重大问题，流水线将会进行下一阶段。
        - content: 一切正常运行之后，流水线会在第四阶段使用 Docker 打包项目。然后将 Docker 镜像推送至 Docker 仓库。第五阶段会将 Docker 镜像部署至所需的环境，例如沙盒和生产环境。流水线上的垃圾会随后清空，并向我们的团队发送流水线的运行结果。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619225121.png

    - title: 使用 SonarQube 进行代码质检
      contentList:
        - content: 我们使用 SonarQube 进行静态代码质量分析。下方的截图是 SonarQube 对我们服务分析结果的一个示例。这帮我们迅速定位问题，并找到我们代码中的缺陷。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619225841.png

    - type: 2
      content: 'KubeSphere 让 ZaloPay 的运维团队可以把更多的时间花在管理和工作流程的自动化上。'
      author: 'Tan To Nguyen Duy'

    - title: 问题和解决方案
      contentList:
        - content: 安装 KubeSphere 时，我们创建了一些 CRD。由于测试等一些原因，我重新安装并删除了一些资源。API Server 在处理 OpenAPI 验证 x-kubernetes-int-or-string 的 CRD 请求时，会出现 Panic。etcd 同时也会出现 Panic 并不断崩溃。
        - content: 这个问题出现在 Kubernetes v1.16.2 之前的版本。更新 Kubernetes API 并不安全，而且不可避免地会导致停机。不这么做的话则无法访问 API，kubectl 或所有的控制器也会终止运行。
        - content: 在 v1.16.2 之后的版本中，这些问题已经解决。在生产环境下请特别注意这些问题。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200620000210.png

    - title: 贡献开源
      contentList:
        - content: 为了满足对云原生技术栈集中管理的需求，我们选择使用 KubeSphere 在 Kubernetes 的基础上加强可观测性。现在，我们可以在几分钟内迅速部署新的微服务并分配资源。KubeSphere 同样也帮助开发者加快了产品上市时间。
        - content: KubeSphere 让 ZaloPay 的运维团队可以把更多的时间花在管理和工作流程的自动化上。KubeSphere 提供了丝滑的用户体验，对开发者友好的 Web 控制台将内在复杂的逻辑关系清晰地呈现，使得操作基础设施资源更为简单。KubeSphere 是世界上一个正在快速发展的开源社区。KubeSphere 社区帮助众多的公司和组织通过云原生技术轻松运营各自的业务，解决 Kubernetes 自身的痛点。
        - content: 我非常喜欢开源模式。这种模式让全世界的开发者们走得更近，得以在一个开放、活跃的社区相互讨论彼此的观点，帮助解决彼此的问题。我相信开源是软件行业的大势所在，我也在努力为这一社区贡献自己的一份力量。我希望 KubeSphere 可以继续助力开源社区的发展，为广大用户带来更好的产品。
      image:

  rightPart:
    icon: /images/case/vng.jpg
    list:
      - title: 行业
        content: 互联网科技
      - title: 地点
        content: 越南
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 高可用、安全、可观测性
      - title: 采用功能
        content: DevOps、日志、监控
      - title: 作者
        content: Tan To Nguyen Duy

---
