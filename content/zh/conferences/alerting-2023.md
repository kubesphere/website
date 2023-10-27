---
title: '使用 Kubernetes 原生方式实现多集群告警'
author: '向军涛，雷万钧'
createTime: '2023-09-27'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-alerting.png'
---

## 议题简介

在这个演示中，我们将揭示一个基于 Kubernetes 的解决方案，以满足多集群和多租户告警和通知的需求。我们的综合方法涵盖了指标、事件、审计和日志的告警，同时确保与 alertmanager 的兼容性。对于指标，我们提供了适用于不同告警范围的分层 RuleGroups CRDs，同时保持与 Prometheus 规则定义的兼容性。我们还为 Kubernetes 事件和审计事件开发了特定的规则定义和评估器（即 rulers），它们共享同一规则评估引擎。我们的通知实现名为 notification-manager，提供了许多通知渠道和基本功能，如路由、过滤、聚合和通过 CRDs 进行静默。不仅如此，还提供了全面的通知历史记录、多集群和多租户支持。这些功能有助于在各种告警源之间实现无缝集成。

## 分享者简介

向军涛：KubeSphere 监控、告警和事件管理模块的核心维护者，对 Kubernetes 和云原生开源技术以及大数据技术有浓厚的兴趣。

雷万钧：KubeSphere 可观测性和 Serverless 团队资深开发工程师。Fluent Operator、Notification Manager 和 OpenFunction 的维护者。热爱云原生和开源技术，参与了多个开源项目，如 thanos 和 buildpacks 等。

## 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/Multi-Cluster-Alerting-A-Kubernetes-Native-Approach.mp4" type="video/mp4">
</video>

