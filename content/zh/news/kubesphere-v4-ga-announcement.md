---
title: 'KubeSphere v4 开源并发布全新可插拔架构 LuBan'
tag: '产品动态'
keyword: '社区, 开源, KubeSphere, KubeSphere LuBan, release, 可插拔架构, 扩展组件'
description: 'KubeSphere v4 是基于全新的云原生可扩展开放架构——KubeSphere LuBan 打造的云原生操作系统。'
createTime: '2024-10-10'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-ga-cover.png'
---

2024 年 10 月 10 日，KubeSphere 开源社区激动地向大家宣布，KubeSphere v4（开源版）已正式发布，同时发布全新可插拔架构 KubeSphere LuBan。

相较于 KubeSphere 之前所有的版本，KubeSphere v4 可以说是有了颠覆性的变化。KubeSphere v4 是基于全新的云原生可扩展开放架构——KubeSphere LuBan 打造的云原生操作系统，对于 KubeSphere 而言具有非凡的意义。

## KubeSphere LuBan

### 什么是 KubeSphere LuBan

鲁班（LuBan），是中国古代工匠的始祖。作为广大劳动人民智慧与创造力的象征，他通过工具提高劳动效率，将劳动者从原始繁重的任务中解放出来，使土木工艺呈现崭新面貌。KubeSphere 将全新微内核架构（KubeSphere Core）命名为 LuBan，借此寓意，期待为企业与开发者提供低成本、快速迭代和灵活集成的云原生产品，并带来专业、全能和极富创造力的使用与开发体验。

KubeSphere LuBan，是一个分布式的云原生可扩展开放架构，为扩展组件提供一个可热插拔的微内核。自此，KubeSphere 所有功能组件及第三方组件都会基于 KubeSphere LuBan，以扩展组件的方式无缝融入到 KubeSphere 控制台中，并独立维护版本，真正实现即插即用的应用级云原生操作系统。

KubeSphere LuBan 架构设计如下图所示。

![](https://kubesphere.io/images/ks-qkcp/zh/v4.0/4.0-architecture.png)

### 为什么推出 KubeSphere LuBan

自 2018 年以来，KubeSphere 混合多云容器管理平台已发布过十几个版本，其中包括三个重大版本。为了满足用户需求，KubeSphere 集成了众多企业级功能，如多租户管理，多集群管理，DevOps，GitOps，服务网格，微服务，可观测（包括监控、告警、日志、审计、事件、通知等），应用商店，边缘计算，网络与存储管理等。

虽然 KubeSphere 的一站式容器解决方案极大地提升了用户的容器使用体验，但也带来了如下挑战：

- **发版周期长**：在发布新版本时，需要等待所有组件完成开发、测试并通过集成测试。

- **响应用户不及时**：由于各组件无法单独迭代，KubeSphere 发布后，对社区和用户组件反馈处理需要等待 KubeSphere 发布新版本后才能一并交付给用户，导致响应不够及时。

- **代码耦合**：尽管目前已能实现单独启用/禁用特定组件，但这些组件的前后端代码仍然耦合在一起，容易互相影响，架构上不够优雅。

- **系统资源占用过多**：部分组件默认启用，对于没有相关需求的用户来说，可能会占用过多的系统资源。

### KubeSphere LuBan 的优势有哪些

- **插件式的核心框架**：支持独立开发和部署组件以扩展系统的功能。组件可以根据需求进行添加、升级或移除，而不需要修改核心框架的代码。

- **全开放的基础 UI 组件库**：组件对所有人开放，任何人都可以自由地访问、使用和扩展这些组件。用户根据自己的需求进行定制和扩展，以满足不同的设计和功能要求。

- **前后端热更新、热修复**：开发者可以在系统运行时对前端和后端进行实时更新和修复，提高了开发和运维的效率，同时保证了应用程序的可用性和用户体验。

- **开放性扩展中心，生态共建**：我们提供一个开放的平台，鼓励第三方开发者通过组件向系统添加新的功能或增强现有功能，在系统的框架内进行开发和集成，并将他们的组件与系统进行无缝连接，共同构建一个健康、繁荣的生态系统。

### 基于 KubeSphere LuBan 可以做什么

1. KubeSphere 用户

KubeSphere 用户可以自由选择启用哪些 KubeSphere 扩展组件。同时还能将自己的应用无缝融入到 KubeSphere 控制台。此外，随着 KubeSphere 扩展组件生态的丰富，用户可以在 KubeSphere 扩展市场中自由选择更丰富的产品和服务，最终实现容器管理平台的千人千面的效果。

2. KubeSphere 维护者

扩展机制使得维护者可以更聚焦 KubeSphere 核心功能的开发，并可使得 KubeSphere Core 更加轻量，版本发布节奏也可以加快。此外，因为扩展组件能够独立进行迭代，能够更及时地满足用户的需求。

3. KubeSphere 贡献者

扩展机制的引入使得 KubeSphere Core 及 KubeSphere 其他扩展组件变得更加松耦合，开发也更加易于上手。

4. 云原生应用开发商（ISV）或其他开源项目

众多 ISV 或其他开源项目可以低成本将产品或开源项目无缝融入到 KubeSphere 生态系统中。比如 Karmada/KubeEdge 的开发人员可以基于 KubeSphere LuBan 开发独立的 Karmada/KubeEdge 控制台。

## KubeSphere v4 简介

KubeSphere v4，是 KubeSphere 团队打造的全新云原生操作系统，不仅继承了之前版本的企业级资源与业务管理、一站式云原生解决方案等强大功能，还能轻松实现应用的上下游联动、随时随地集成各类优质扩展组件，并提供无缝融合的业务能力与高度一致的产品体验。

其中内核部分（KubeSphere Core）仅包含系统运行的必备基础功能，而将独立的业务模块分别封装在各个扩展组件（Extensions）中。

### 新特性

* 基于全新微内核架构 KubeSphere LuBan 重构
* 内置 KubeSphere 扩展市场
* 支持通过扩展中心统一管理扩展组件
* 支持 UI、API 扩展
* 支持通过 kubeconfig 一键导入 member 集群
* 支持 KubeSphere 服务帐户
* 支持动态扩展 Resource API
* 支持添加集群、企业空间、项目到快捷访问
* 支持通过容器终端进行文件上传和下载
* 支持适配不同厂商的云原生网关（Kubernetes Ingress API）
* 支持 API 限流
* 支持在页面创建持久卷
* 支持基于 OCI 的 Helm Chart 仓库

另外，KubeSphere 4.1.2 增加了默认的扩展组件仓库（见下文）。

同时修复了 KubeSphere 4.1.1 存在的以下问题：

- 部分扩展组件页面白屏的问题
- ks-core 卸载时部分资源残留的问题
- K8s 1.19 环境无法安装的问题

其他变化请查看变更说明：
- https://www.kubesphere.io/zh/docs/v4.1/20-release-notes/release-v411/
- https://www.kubesphere.io/zh/docs/v4.1/20-release-notes/release-v412/

### KubeSphere 扩展组件

KubeSphere 扩展组件用于扩展 KubeSphere 的平台能力，用户可在系统运行时动态地安装、卸载、启用、禁用扩展组件。

监控、告警、通知、项目网关和集群网关、卷快照、网络隔离等功能，将由扩展组件来提供。

目前，我们已经开源了 20 个扩展组件，分别是：

* KubeSphere 网络
* KubeSphere 应用商店管理
* KubeSphere 服务网格
* KubeSphere 存储
* KubeSphere 多集群代理连接
* KubeSphere 网关
* DevOps
* 联邦集群应用管理
* OpenSearch 分布式检索与分析引擎
* Grafana for WhizardTelemetry
* Grafana Loki for WhizardTelemetry
* WhizardTelemetry 数据流水线
* WhizardTelemetry 平台服务
* WhizardTelemetry 告警
* WhizardTelemetry 事件
* WhizardTelemetry 日志
* WhizardTelemetry 监控
* WhizardTelemetry 通知
* Metrics Server
* Gatekeeper

扩展组件仓库： https://github.com/kubesphere-extensions/ks-extensions/。

### 安装试用

**特别说明：目前不支持从 3.4.x 版本直接升级到 v4 版本，需要先卸载原来的版本，再安装 v4 版本。**

- 参考文档： https://www.kubesphere.io/zh/docs/v4.1/03-installation-and-upgrade/02-install-kubesphere/02-install-kubernetes-and-kubesphere/

- 安装扩展组件参考文档： https://www.kubesphere.io/zh/docs/v4.1/06-extension-user-guide/01-install-components-pdf/

从 v4.1.1 升级到 v4.1.2，升级和安装部署可以使用以下命令：

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.2.tgz --debug --wait
```

详细文档请参考： https://kubesphere.io/zh/docs/v4.1/02-quickstart/01-install-kubesphere。

## 参与贡献

正如前文所说，扩展机制的引入使得 KubeSphere Core 及 KubeSphere 其他扩展组件变得更加松耦合，开发也更加易于上手。

社区目前正在逐步发布开源的扩展组件，为各位用户提供更多的功能，让各位用户有更多的选择。同时，社区也非常欢迎各位开发者以及 ISV 参与进来，开发自己的扩展组件，共同丰富扩展组件生态。

目前，已经有一位参与开源之夏的学生贡献者张豈明，开发了一款扩展组件 Pod Status Analysis Tool，地址： https://github.com/kubesphere-extensions/ks-extensions-contrib/tree/main/pod-analyzer。

- 贡献仓库： https://github.com/kubesphere-extensions/ks-extensions-contrib

- 开发指南： https://dev-guide.kubesphere.io/extension-dev-guide/zh/

## 未来计划与展望

KubeSphere 愿景是打造一个以 Kubernetes 为内核的云原生分布式操作系统，它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用（plug-and-play）的集成，支持云原生应用在多云与多集群的统一分发和运维管理。

KubeSphere v4 将正式实现这个愿景，真正成为可插拔架构的产品，让用户可以选择自己需要的组件。

后续，我们将开源更多的扩展组件，为用户提供更多的选择。