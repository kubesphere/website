---
title: 'KubeSphere 团队将在 KubeCon China 中带来两个重磅分享'
keywords: KubeCon, Meetup, Kubernetes
description: OpenFunction & 多集群
createTime: '2023-08-16'
author: 'KubeSphere'
image: https://pek3b.qingstor.com/kubesphere-community/images/kubecon-china-2023-cover.png
tag: "社区动态"
---

由 Linux 基金会、云原生计算基金会（CNCF）主办的 KubeCon + CloudNativeCon + Open Source Summit China 2023 [详细日程](https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/program/schedule/)终于来了！

本届 KubeCon 也是时隔几年后再次于中国线下举办，将围绕云原生和开源的所有事物进行分享和交流 - 安全、服务网格、网络 + 边缘、开放 AI + 数据、WebAssembly 以及你不应错过的许多其他主题。

在此次技术峰会中，KubeSphere 团队将带来两个议题分享，让我们先睹为快！

## 议题 1

### 议题名称

Run Serverless Workloads on Any Infrastructure with OpenFunction

使用 OpenFunction 在任何基础设施上运行无服务器工作负载

### 议题简介

云原生技术的崛起使得我们可以以相同的方式在公有云、私有云或本地数据中心运行应用程序或工作负载。但是，对于需要访问不同云或开源中间件的各种 BaaS 服务的无服务器工作负载来说，这并不容易。在这次演讲中，OpenFunction 维护者将详细介绍如何使用 OpenFunction 解决这个问题，以及 OpenFunction 的最新更新和路线图：
- 使用 Dapr 将 FaaS 与 BaaS 解耦
- 使用 Dapr 代理而不是 Dapr sidecar 来加速函数启动
- 使用 Kubernetes Gateway API 构建 OpenFunction 网关
- 使用 WasmEdge 运行时运行 WebAssembly 函数
- OpenFunction 在自动驾驶行业的应用案例
- 最新更新和路线图

### 讲师简介

- 霍秉杰：KubeSphere 可观测性、边缘计算和 Serverless 团队负责人，Fluent Operator 和 OpenFunction 项目的创始人，还是多个可观测性开源项目包括 Kube-Events、Notification Manager 等的作者，热爱云原生技术，并贡献过 KEDA、Prometheus Operator、Thanos、Loki 和 Falco 等知名开源项目。
- 王翼飞：青云科技资深软件工程师，负责开发和维护 OpenFunction 项目。专注于 Serverless 领域的研发，对 Knative、Dapr、Keda 等开源项目有深入的了解和实践经验。

### 分享时间

2023 年 9 月 27 日下午 3:50-4:25

### 会议室

3层 302 会议室

## 议题 2

### 议题名称

Multi-Cluster Alerting: A Kubernetes-Native Approach

以云原生的方式实现多集群告警

### 议题简介

在这个演示中，我们将揭示一个基于 Kubernetes 的解决方案，以满足多集群和多租户告警和通知的需求。我们的综合方法涵盖了指标、事件、审计和日志的告警，同时确保与 alertmanager 的兼容性。对于指标，我们提供了适用于不同告警范围的分层 RuleGroups CRDs，同时保持与 Prometheus 规则定义的兼容性。我们还为 Kubernetes 事件和审计事件开发了特定的规则定义和评估器（即 rulers），它们共享同一规则评估引擎。我们的通知实现名为 notification-manager，提供了许多通知渠道和基本功能，如路由、过滤、聚合和通过 CRDs 进行静默。不仅如此，还提供了全面的通知历史记录、多集群和多租户支持。这些功能有助于在各种告警源之间实现无缝集成。

### 讲师简介

- 向军涛：KubeSphere 监控、告警和事件管理模块的核心维护者，对 Kubernetes 和云原生开源技术以及大数据技术有浓厚的兴趣。
- 雷万钧：KubeSphere 可观测性和 Serverless 团队资深开发工程师。Fluent Operator、Notification Manager 和 OpenFunction 的维护者。热爱云原生和开源技术，参与了多个开源项目，如 thanos 和 buildpacks 等。

### 分享时间

2023 年 9 月 27 日下午 4:40-5:15

### 会议室

3层 305B 会议室

## 展台有奖活动

在本次峰会中，KubeSphere 社区将会在活动现场设置展台。如果您对 KubeSphere 或者云原生感兴趣，欢迎来 KubeSphere 展台互动。我们会在展台设置抽奖小活动，只要来互动，就有机会获得 KubeSphere 社区周边礼品，如背包、马克杯、T恤、徽章等等。