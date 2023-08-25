---
title: "在 KubeSphere 中使用 Alertmanager 管理告警"
keywords: 'Kubernetes, Prometheus, Alertmanager, 告警'
description: '了解如何在 KubeSphere 中使用 Alertmanager 管理告警。'
linkTitle: "KubeSphere 中的 Alertmanager"
weight: 8510
---

Alertmanager 处理由客户端应用程序（例如 Prometheus 服务器）发出的告警。它会将告警去重、分组 (Grouping) 并路由至正确的接收器，例如电子邮件、PagerDuty 或者 OpsGenie。它还负责告警沉默 (Silencing) 和抑制 (Inhibition)。有关更多详细信息，请参考 [Alertmanager 指南](https://prometheus.io/docs/alerting/latest/alertmanager/)。

从初次发布开始，KubeSphere 就一直使用 Prometheus 作为监控服务的后端。从 3.0 版本开始，KubeSphere 的监控栈新增了 Alertmanager 来管理从 Prometheus 和其他服务组件（例如 [kube-events](https://github.com/kubesphere/kube-events) 和 kube-auditing）发出的告警。

![alertmanager-kubesphere](/images/docs/v3.3/cluster-administration/cluster-wide-alerting-and-notification/alertmanager-in-kubesphere/alertmanager@kubesphere.png)

## 使用 Alertmanager 管理 Prometheus 告警

Prometheus 的告警分为两部分。Prometheus 服务器根据告警规则向 Alertmanager 发送告警。随后，Alertmanager 管理这些告警，包括沉默、抑制、聚合等，并通过不同方式发送通知，例如电子邮件、应需 (on-call) 通知系统以及聊天平台。

从 3.0 版本开始，KubeSphere 向 Prometheus 添加了开源社区中流行的告警规则，用作内置告警规则。默认情况下，KubeSphere 3.3 中的 Prometheus 会持续评估这些内置告警规则，然后向 Alertmanager 发送告警。

## 使用 Alertmanager 管理 Kubernetes 事件告警

Alertmanager 可用于管理 Prometheus 以外来源发出的告警。在 3.0 版及更高版本的 KubeSphere 中，用户可以用它管理由 Kubernetes 事件触发的告警。有关更多详细信息，请参考 [kube-events](https://github.com/kubesphere/kube-events)。

## 使用 Alertmanager 管理 KubeSphere 审计告警

在 3.0 版及更高版本的 KubeSphere 中，用户还可以使用 Alertmanager 管理由 Kubernetes 或 KubeSphere 审计事件触发的告警。

## 接收 Alertmanager 告警的通知

一般来说，要接收 Alertmanager 告警的通知，用户需要手动编辑 Alertmanager 的配置文件，配置接收器（例如电子邮件和 Slack）的设置。

这对 Kubernetes 用户来说并不方便，并且违背了 KubeSphere 的多租户规则/架构。具体来说，由不同命名空间中的工作负载所触发的告警可能会发送至同一个租户，然而这些告警信息本应发给不同的租户。

为了使用 Alertmanager 管理平台上的告警，KubeSphere 提供了 [Notification Manager](https://github.com/kubesphere/notification-manager)，它是一个 Kubernetes 原生通知管理工具，完全开源。它符合多租户规则，提供用户友好的 Kubernetes 通知体验，3.0 版及更高版本的 KubeSphere 均默认安装 Notification Manager。

有关使用 Notification Manager 接收 Alertmanager 通知的详细信息，请参考 [Notification Manager](https://github.com/kubesphere/notification-manager)。