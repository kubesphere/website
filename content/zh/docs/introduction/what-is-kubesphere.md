---
title: "什么是 KubeSphere"
keywords: 'Kubernetes, KubeSphere, 介绍'
description: '什么是 KubeSphere'

weight: 1100
---

## 概述

[KubeSphere](https://kubesphere.io) 是在 [Kubernetes](https://kubernetes.io) 之上构建的面向云原生应用的**分布式操作系统**，支持多云与多集群管理，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用 (plug-and-play) 的集成。

作为全栈化容器部署与多租户管理平台，KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。它拥有 Kubernetes 企业级服务所需的最常见功能，例如 Kubernetes 资源管理、DevOps、多集群部署与管理、应用生命周期管理、微服务治理、日志查询与收集、服务与网络、多租户管理、监控告警、事件审计、存储、访问控制、GPU 支持、网络策略、镜像仓库管理以及安全管理等。

KubeSphere **围绕 Kubernetes 集成了各种生态系统的工具**，提供了一致的用户体验以降低复杂性。同时，它还具备 Kubernetes 尚未提供的新功能，旨在解决 Kubernetes 本身存在的存储、网络、安全和易用性等痛点。KubeSphere 不仅允许开发人员和 DevOps 团队在统一的控制台中使用他们喜欢的工具，而且最重要的是，这些功能与平台松散耦合，因为他们可以选择是否安装这些可插拔组件。

## 支持在任意平台运行 KubeSphere

作为一个轻量级平台，KubeSphere 对不同云生态系统的支持变得更加友好，因为它没有对 Kubernetes 本身有任何的 Hack。换句话说，KubeSphere 可以**部署并运行在任何基础架构以及所有兼容现有版本的 Kubernetes 集群上**，包括虚拟机、裸机、本地环境、公有云和混合云等。KubeSphere 用户可以选择在云和容器平台（例如阿里云、AWS、青云QingCloud、腾讯云、华为云和 Rancher 等）上安装 KubeSphere，甚至可以导入和管理使用 Kubernetes 发行版创建的现有 Kubernetes 集群。KubeSphere 可以在不修改用户当前的资源或资产、不影响其业务的情况下与现有 Kubernetes 平台无缝集成。有关更多信息，请参见[在 Linux 上安装](../../installing-on-linux/)和[在 Kubernetes 上安装](../../installing-on-kubernetes/)。

KubeSphere 为用户屏蔽了基础设施底层复杂的技术细节，帮助企业在各类基础设施之上无缝地部署、更新、迁移和管理现有的容器化应用。通过这种方式，KubeSphere 使开发人员能够专注于应用程序开发，使运维团队能够通过企业级可观察性功能和故障排除机制、统一监控和日志记录、集中式存储和网络管理，以及易用的 CI/CD 流水线来加快 DevOps 自动化工作流程和交付流程等。

![KubeSphere Overview](https://pek3b.qingstor.com/kubesphere-docs/png/20200224091526.png)

## 3.0 新增功能

- **多集群管理**：随着我们迎来混合云时代，多集群管理已成为我们时代的主题。作为 Kubernetes 上最必要的功能之一，多集群管理可以满足用户的迫切需求。在最新版本 3.0 中，我们为 KubeSphere 配备了多集群功能，该功能可以为部署在不同云中的集群提供一个中央控制面板。用户可以导入和管理在主流基础设施提供商（例如 Amazon EKS 和 Google GKE 等）平台上创建的现有 Kubernetes 集群。通过简化操作和维护流程，这将大大降低用户们的学习成本。Solo 和 Federation 是多集群管理的两个特有模式，使 KubeSphere 在同类产品中脱颖而出。

- **改善可观察性**：KubeSphere 现支持自定义监控、租户事件管理，以及多样化的通知方法（例如，微信和 Slack）等，可观察性功能大幅增强。另外，用户现在可以自定义监控面板，并根据自己的需求选择各种监控指标和显示图表。还值得一提的是，KubeSphere 3.0 与 Prometheus 兼容，后者是云原生行业中 Kubernetes 监控的事实标准。

- **增强安全性**：安全始终是我们在 KubeSphere 中关注的重点之一。在这方面，功能增强可以概括如下：

  - **审计**：操作记录将被保存，包括操作的人员和时间。添加对审计的支持极为重要，特别是对于金融和银行业等传统行业而言。

  - **网络策略和隔离**：网络策略允许在同一群集内进行网络隔离，这意味着可以在某些实例 (Pod) 之间设置防火墙。通过配置网络策略控制同一集群内 Pod 之间的流量以及来自外部的流量，从而实现应用隔离并增强应用的安全性。用户还可以决定是否可以从外部访问某个服务。

  - **Open Policy Agent**：KubeSphere 基于 [Open Policy Agent](https://www.openpolicyagent.org/) 提供了细粒度的访问控制。用户可以使用通用体系架构以统一的方式管理其安全性和授权策略。

  - **OAuth 2.0**：用户现在可以轻松地通过 OAuth 2.0 协议集成第三方应用程序。
  
- **Web 控制台的多语言支持**：KubeSphere 在设计之初便面向全球用户。由于来自全球社区成员们的贡献，KubeSphere 3.0 的 Web 控制台现已支持四种官方语言：英文、简体中文、繁体中文和西班牙文。预计将来将支持更多语言。

除了上述主要新增功能之外，KubeSphere 3.0 还具有其他功能升级。有关更多详细信息，请参见 3.0.0 的[发行说明](../../release/release-v300/)。

## 开源

借助开源的模式，KubeSphere 社区驱动着开发工作以开放的方式进行。KubeSphere **100% 开源免费**，已大规模服务于社区用户，广泛地应用在以 Docker 和 Kubernetes 为中心的开发测试及生产环境中，大量服务平稳地运行在 KubeSphere 之上。您可在 [GitHub](https://github.com/kubesphere/) 上找到所有源代码、文档和讨论。

## 产品规划

### 易捷版 -> KubeSphere 1.0.x -> KubeSphere 2.0.x -> KubeSphere 2.1.x -> KubeSphere 3.0.0

![Roadmap](https://pek3b.qingstor.com/kubesphere-docs/png/20190926000413.png)

## Landscape

KubeSphere 是 CNCF 基金会成员并且通过了 [Kubernetes 一致性认证](https://www.cncf.io/certification/software-conformance/#logos)，进一步丰富了 [CNCF 云原生的生态。
](https://landscape.cncf.io/landscape=observability-and-analysis&license=apache-license-2-0)

![CNCF Landscape](https://pek3b.qingstor.com/kubesphere-docs/png/20191011233719.png)