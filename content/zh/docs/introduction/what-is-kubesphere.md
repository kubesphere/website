---
title: "什么是 KubeSphere"
keywords: 'Kubernetes, KubeSphere, 介绍'
description: '什么是 KubeSphere'

weight: 2100
---

## 概述

[KubeSphere](https://kubesphere.io) 是一个管理云原生应用程序的**分布式操作系统**，[Kubernetes](https://kubernetes.io) 是它的内核，为第三方应用程序的无缝集成提供了即插即用架构，以增强其生态系统。

KubeSphere 还是一个多租户企业级容器平台，拥有全栈自动化的 IT 运维和简化的 DevOps 工作流。它提供开发者友好型的向导式 web UI，帮助企业构建更加强健和功能丰富的平台。它拥有企业 Kubernetes 策略所需的最常见功能，如 Kubernetes 资源管理、DevOps (CI/CD)、应用程序生命周期管理、监控、日志、服务网格、多租户、告警和通知、审计、存储和网络、自动扩缩、访问控制、GPU支持、多集群部署和管理、网络策略、仓库管理以及安全管理。

KubeSphere **围绕 Kubernetes 集成了多种生态系统工具**，从而使用户体验保持一致，降低了复杂性。同时，它还具有上游 Kubernetes 尚未提供的新功能，减轻了 Kubernetes 的痛点，包括存储、网络、安全和可用性。KubeSphere 不仅让开发者和 DevOps 团队能在统一的控制台中使用他们喜欢的工具，而且最重要的是，这些功能是可插拔和可选的，因此与平台是松耦合的。

## 在任意平台上运行 KubeSphere

作为一个轻量级平台，KubeSphere 对不同的云生态系统更加友好，因为它对 Kubernetes 本身没有任何改动。换句话说，KubeSphere 可以部署在**任何基础设施上的任意兼容现有版本的** **Kubernetes 集群**上，包括虚拟机、裸金属、本地环境、公共云和混合云。KubeSphere 用户可以选择在云和容器平台上安装 KubeSphere，如阿里巴巴云、AWS、青云、腾讯云、华为云和 Rancher，甚至可以导入和管理他们现有的使用主要 Kubernetes 发行版创建的 Kubernetes 集群。KubeSphere 与现有 Kubernetes 平台的无缝集成意味着用户的业务不会受到影响，他们当前的资源或资产不会受到任何修改。有关更多信息，请参见[在 Linux 上安装](../../installing-on-linux/)和[在 Kubernetes 上安装](../../installing-on-kubernetes/)。

KubeSphere 为用户隐藏了底层基础设施的细节，并帮助企业在各种基础设施类型之间对现有容器化的应用无缝地进行现代化、迁移、部署和管理。因此，KubeSphere 使开发者和运维团队专注于应用程序开发，并通过企业级的可观察性和故障排除、统一的监控和日志记录、集中式存储和网络管理、易用的 CI/CD 流水线等来加快 DevOps 自动化工作流程和交付流程。

![KubeSphere Overview](https://pek3b.qingstor.com/kubesphere-docs/png/20200224091526.png)

## 3.0 新增功能

- **多集群管理**：随着我们迎来混合云时代，多集群管理已成为时代的主题。作为 Kubernetes 上最必要的功能之一，多集群管理可以满足用户的迫切需求。在最新版本 3.0 中，我们为 KubeSphere 配备了独有的多集群功能，可以为部署在不同云中的集群提供一个中央控制平面。用户可以导入和管理在主流基础设施厂商（例如 Amazon EKS 和 Google GKE 等）平台上创建的现有 Kubernetes 集群。这将大幅降低用户的学习成本，同时简化操作和维护流程。Solo 和 Federation 是多集群管理的两种特有模式，使 KubeSphere 在同类产品中脱颖而出。

- **改善可观察性**：我们增强了可观察性，涵盖自定义监控、租户事件管理、多样化的通知方法（例如微信和 Slack）以及更多特性，功能变得更加强大。另外，用户现在可以自定义监控面板，并根据自己的需求选择各种指标和图表。还值得一提的是，KubeSphere 3.0 与 Prometheus 兼容，后者是云原生行业中 Kubernetes 监控的事实标准。

- **增强安全性**：安全一直是我们在 KubeSphere 中关注的重点之一。在这方面，功能增强可以概括如下：
- **审计**：通过保存记录来追踪谁在何时做了何事。添加对审计的支持极为重要，特别是对于金融业和银行业等传统行业而言。
  
- **网络策略和隔离**：网络策略允许在同一群集内进行网络隔离，这意味着可以在某些实例 (Pod) 之间设置防火墙。用户通过配置网络隔离，控制同一集群内 Pod 之间的流量以及来自外部的流量，实现应用程序隔离，增强安全性。用户还可以决定是否可以从外部访问某个服务。
  
- **Open Policy Agent**：KubeSphere 基于 [Open Policy Agent](https://www.openpolicyagent.org/) 提供了灵活、精细的访问控制。用户可以使用通用体系架构以统一的方式管理其安全性和授权策略。
  
- **OAuth 2.0**：用户现在可以轻松地通过 OAuth 2.0 协议集成第三方应用程序。
  
- **Web 控制台的多语言支持**：KubeSphere 在设计之初便面向全球用户。得益于来自全球社区成员们的贡献，KubeSphere 3.0 的 Web 控制台现已支持四种官方语言：英文、简体中文、繁体中文和西班牙文。预计未来将支持更多语言。

除了上述主要新增功能之外，KubeSphere 3.0 还具有其他功能升级。有关更多详细信息，请参见 3.0.0 的[发行说明](../../release/release-v300/)。

## 开源

借助开源的模式，KubeSphere 社区驱动着开发工作以开放的方式进行。KubeSphere **100% 开源**，已广泛安装和使用于开发、测试和生产环境中，大量服务在 KubeSphere 之上平稳运行。您可在 [GitHub](https://github.com/kubesphere/) 上找到所有源代码、文档和讨论。

## 产品规划

### 易捷版 -> KubeSphere 1.0.x -> KubeSphere 2.0.x -> KubeSphere 2.1.x -> KubeSphere 3.0.0

![Roadmap](https://pek3b.qingstor.com/kubesphere-docs/png/20190926000413.png)

## 全景图

KubeSphere 是 CNCF 基金会成员并且通过了 [Kubernetes 一致性认证](https://www.cncf.io/certification/software-conformance/#logos)，进一步丰富了 [CNCF 云原生全景图。
](https://landscape.cncf.io/landscape=observability-and-analysis&license=apache-license-2-0)

![CNCF Landscape](https://pek3b.qingstor.com/kubesphere-docs/png/20191011233719.png)