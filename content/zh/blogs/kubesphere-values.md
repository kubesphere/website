---
title: '一文说清 KubeSphere 容器平台的价值'
tag: 'DevOps, KubeSphere, 微服务'
keywords: 'DevOps, Kubernetes, KubeSphere, Observability, microservice'
createTime: '2020-04-10'
author: 'Feynman, Ray'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200410130334.png'
---

KubeSphere 作为云原生家族 **后起之秀**，开源近两年的时间以来收获了诸多用户与开发者的认可。本文通过大白话从零诠释 KubeSphere 的定位与价值，以及不同团队为什么会选择 KubeSphere。

## 对于企业 KubeSphere 是什么

KubeSphere 是在 Kubernetes 之上构建的 **多租户** 容器平台，以应用为中心，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。使用 KubeSphere 不仅能够帮助企业在公有云或私有化数据中心快速搭建 Kubernetes 集群，还提供了一套功能丰富的向导式操作界面。

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D/KubeSphere-2.1.1-demo.mp4">
</video>

KubeSphere 能够帮助企业快速构建一个功能丰富的容器云平台，让企业在享受 Kubernetes 的弹性伸缩与敏捷部署的同时，还可以在容器平台拥有 IaaS 平台的存储与网络能力，获得与 IaaS 一样稳定的用户体验。比如在 KubeSphere 2.1.1 新增了对阿里云与腾讯云块存储插件的集成，支持为 Pod 挂载公有云的存储，为有状态应用提供更稳定的持久化存储的能力。

![对于企业 KubeSphere 是什么](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133408.png)

在日常的运维开发中，我们可能需要使用与管理大量的开源工具，频繁地在不同工具的 GUI 和 CLI 窗口操作，每一个工具的单独安装、使用与运维都会带来一定的学习成本，而 KubeSphere 容器平台能够统一纳管与对接这些工具，提供一致性的用户体验。这意味着，我们不需要再去多线程频繁地在各种开源组件的控制面板窗口和命令行终端切换，极大赋能企业中的开发和运维团队，提高生产效率。

![统一纳管工具](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133506.png)

## 对于开发者 KubeSphere 是什么

有很多用户习惯把 KubeSphere 定义为 “云原生全家桶”。不难理解，KubeSphere 就像是一个一揽子解决方案，我们设计了一套完整的管理界面，开发与运维在一个统一的平台中，可以非常方便地安装与管理用户最常用的云原生工具，从业务视角提供了一致的用户体验来降低复杂性。为了不影响底层 Kubernetes 本身的灵活性，也为了让用户能够按需安装，KubeSphere 所有功能组件都是可插拔的。

![对于开发者 KubeSphere 是什么](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133832.png)

KubeSphere 基于 OpenPitrix 和 Helm 提供了应用商店，对内可作为团队间共享企业内部的中间件、大数据、APM 和业务应用等，方便开发者一键部署应用至 Kubernetes 中；对外可作为根据行业特性构建行业交付标准、交付流程和应用生命周期管理的基础，作为行业通用的应用商店，可根据不同需求应对不同的业务场景。在 3.0 版本还将支持计量 (Metering)，方便企业对应用与集群资源消耗的成本进行管理。

![KubeSphere 应用商店](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133902.png)

## 对于运维 KubeSphere 是什么

可观测性是容器云平台非常关键的一环，狭义上主要包含监控、日志和追踪等，广义上还包括告警、事件、审计等。对于 Kubernetes 运维人员来说，通常需要搭建和运维一整套可观测性的技术架构，例如 Prometheus + Grafana + AlertManager、EFK 等等。并且，企业通常还需要对不同租户能够看到的监控、日志、事件、审计等信息，实现按不同租户隔离，这些需求的引入无疑会增大企业的运维成本与复杂性。

KubeSphere 能够帮助运维人员基于 Kubernetes 快速搭建一套满足云原生可观测性标准的技术架构，支持在一个统一的平台纳管这些组件，或对接外部已有的组件。KubeSphere 能够在一套管理界面中，实现从基础设施层级到容器微服务层级的多维度日志与监控，支持逐级下钻定位异常资源，并且能够满足多租户隔离的需求。在 3.0 版本还将持续增强可观测性，近一步丰富事件与审计的可视化管理能力。

![对于运维 KubeSphere 是什么](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133938.png)

## 对于 DevOps 团队 KubeSphere 是什么

对于 DevOps 团队而言，日常工作除了开发一些自动化的工具之外，还需要运维与管理众多开源工具链。DevOps 本身作为一个很广义的方法论，也可以被认为是一种文化，很多 DevOps 团队在落地过程中，也会遇到各种各样问题，例如 CI/CD 工具繁多、涉及人员和环境较多、流程相对复杂等等。

![对于 DevOps 团队 KubeSphere 是什么](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134006.png)

我们选择以工具型产品的形式，将 DevOps 在 KubeSphere 中落地。KubeSphere DevOps 系统选择 Jenkins 作为其 CI/CD 引擎，借助 Jenkins 丰富的插件体系和易于进行扩展开发的特性，帮助 DevOps 团队在一个统一的平台中，打通开发、测试、构建、部署、监控、日志与通知等流程。KubeSphere 为 DevOps 团队打造了以容器为载体的端到端的应用交付平台，实现从项目管理、应用开发、持续集成、单元测试、制品构建到应用的生产交付，所有的流程都是一个完整的闭环。

![KubeSphere DevOps](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134030.png)

基于 Kubernetes，KubeSphere DevOps 充分利用和释放 Kubernetes 动态扩展的能力。例如，我们在内置的 DevOps 系统使用了 Jenkins Kubernetes 的动态 Agent，即默认全部使用动态的 Kubernetes Slave，这样的方案相较于传统虚拟机上的 Jenkins 要更加灵活敏捷。同时，在 KubeSphere DevOps 中内置了用户常用的 Agent 类型，例如 Maven、Node.js、Go 等，并且还支持用户自定义与扩展的 Agent 类型。

![KubeSphere DevOps](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134046.png)

我们将内置的 Jenkins 与 KubeSphere 账户打通，满足企业对 CI/CD 流水线多租户隔离与统一认证的需求。另外，KubeSphere DevOps 支持创建 InSCM 与 OutOfSCM 两种形式的流水线。这样能很好地兼容项目已有的 Jenkinsfile，或使用图形化编辑流水线。

![KubeSphere 流水线](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134153.png)

业务开发者即使还没有深入了解 Docker 与 Kubernetes 的机制，也可以借助 KubeSphere 内置的自动化 CD 工具，如 Binary to Image 和 Source to Image。用户只需要提交一个仓库地址，或上传 JAR/WAR/Binary 等二进制文件，即可快速将制品打包成 Docker 镜像并发布到镜像仓库，最终将服务自动发布至 Kubernetes 中，无需编写一行 Dockerfile。并且，在自动构建的过程中，能够生成动态日志，帮助开发者快速定位服务构建与发布的问题。

![Binary/Source to Image](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134220.png)

## 对于运营 KubeSphere 是什么

在产品新版本发布前，运营团队通常需要引入一部分流量对新版本灰度测试。灰度发布可以保证整体系统的稳定，在初始灰度的时候就可以对新版本进行测试，方便及时发现和调整问题，以验证产品的可行性和收集用户反馈。

![KubeSphere 灰度发布](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134244.png)

KubeSphere 基于 Istio 提供了蓝绿部署、金丝雀发布、流量镜像等三种灰度策略，无需修改应用的服务代码，即可实现灰度、流量治理、Tracing、流量监控、调用链等服务治理功能，即让产品的迭代能够按照不同的灰度策略对新版本进行线上环境的测试，并且能够在服务拓扑与 Tracing 中发现微服务间互相请求的网络问题。

![KubeSphere service mesh](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134326.png)

## 如何安装 KubeSphere

KubeSphere 支持部署和运行在包括 公有云、私有云、虚机、物理机 和 Kubernetes 等任何基础设施之上，并支持在线与离线安装，可参考 [KubeSphere 官方文档](https://kubesphere.com.cn/docs/zh-CN/installation/intro/) 进行安装。
