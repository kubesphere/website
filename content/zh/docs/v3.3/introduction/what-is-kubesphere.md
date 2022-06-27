---
title: "什么是 KubeSphere"
keywords: 'Kubernetes, KubeSphere, 介绍'
description: '什么是 KubeSphere'
linkTitle: "什么是 KubeSphere"
weight: 1100
---

## 概述

[KubeSphere](https://kubesphere.io) 是在 [Kubernetes](https://kubernetes.io) 之上构建的面向云原生应用的**分布式操作系统**，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维能力，简化企业的 DevOps 工作流。它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用 (plug-and-play) 的集成。

作为全栈的多租户容器平台，KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。KubeSphere 为用户提供构建企业级 Kubernetes 环境所需的多项功能，例如**多云与多集群管理、Kubernetes 资源管理、DevOps、应用生命周期管理、微服务治理（服务网格）、日志查询与收集、服务与网络、多租户管理、监控告警、事件与审计查询、存储管理、访问权限控制、GPU 支持、网络策略、镜像仓库管理以及安全管理**等。

KubeSphere 还开源了 [KubeKey](https://github.com/kubesphere/kubekey) 帮助企业一键在公有云或数据中心快速搭建 Kubernetes 集群，提供单节点、多节点、集群插件安装，以及集群升级与运维。

![功能概览](/images/docs/v3.3/zh-cn/introduction/what-is-kubesphere/kubesphere-feature-overview.jpeg)

## 开发运维友好

KubeSphere 为用户屏蔽了基础设施底层复杂的技术细节，帮助企业在各类基础设施之上无缝地部署、更新、迁移和管理现有的容器化应用。通过这种方式，KubeSphere 使开发人员能够专注于应用程序开发，使运维团队能够通过企业级可观测性功能和故障排除机制、统一监控和日志查询、存储和网络管理，以及易用的 CI/CD 流水线等来加快 DevOps 自动化工作流程和交付流程等。

## 支持在任意平台运行 KubeSphere

作为一个灵活的轻量级容器 PaaS 平台，KubeSphere 对不同云生态系统的支持非常友好，因为它对原生 Kubernetes 本身没有任何的侵入 (Hack)。换句话说，KubeSphere 可以**部署并运行在任何基础架构以及所有版本兼容的 Kubernetes 集群**之上，包括虚拟机、物理机、数据中心、公有云和混合云等。

您可以选择在公有云和托管 Kubernetes 集群（例如阿里云、AWS、青云QingCloud、腾讯云、华为云等）上安装 KubeSphere，**还可以导入和纳管已有的 Kubernetes 集群**。

KubeSphere 可以在不修改用户当前的资源或资产、不影响其业务的情况下部署在现有的 Kubernetes 平台上。有关更多信息，请参见[在 Linux 上安装](../../installing-on-linux/)和[在 Kubernetes 上安装](../../installing-on-kubernetes/)。

## 完全开源

借助开源的模式，KubeSphere 社区驱动着开发工作以开放的方式进行。KubeSphere **100% 开源免费**，已大规模服务于社区用户，广泛地应用在以 Docker 和 Kubernetes 为中心的开发、测试及生产环境中，大量服务平稳地运行在 KubeSphere 之上。您可在 [GitHub](https://github.com/kubesphere/) 上找到所有源代码、文档和讨论，所有主要的开源项目介绍可以在[开源项目列表](../../../projects/)中找到。

## 云原生 Landscape

KubeSphere 是 CNCF 基金会成员并且通过了 [Kubernetes 一致性认证](https://www.cncf.io/certification/software-conformance/#logos)，进一步丰富了 [CNCF 云原生的生态](https://landscape.cncf.io/?landscape=observability-and-analysis&license=apache-license-2-0)。

![cncf-landscape](/images/docs/v3.3/zh-cn/introduction/what-is-kubesphere/cncf-landscape.png)