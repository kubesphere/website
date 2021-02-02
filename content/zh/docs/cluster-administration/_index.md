---
title: "集群管理"
description: "理解管理集群的基础知识"
layout: "single"

linkTitle: "集群管理"

weight: 8000

icon: "/images/docs/docs.svg"

---

在 KubeSphere 中，您可以使用交互式 Web 控制台或内置的原生命令行工具 `kubectl` 来设置集群并配置其功能。作为集群管理员，您将负责一系列任务，包括在节点上管理调度并添加标签、控制集群可见性、​​监控集群状态、设置集群的告警规则和通知规则，以及配置存储和日志收集解决方案等。

{{< notice note >}}

本章未介绍多集群管理。有关此功能的更多信息，请参见[多集群管理](../multicluster-management/)。

{{</ notice >}}

## [节点管理](../cluster-administration/nodes/)

监控节点状态并了解如何添加节点标签和污点。

## [集群状态监控](../cluster-administration/cluster-status-monitoring/)

根据不同的指标（包括物理资源、etcd 和 APIServer）监控集群如何运行。

## [应用资源监控](../cluster-administration/application-resources-monitoring/)

监控集群中的应用资源，例如不同项目的部署数量和 CPU 使用情况。

## [持久卷和存储类型](../cluster-administration/persistent-volume-and-storage-class/)

了解 PV、PVC 和存储类型的基本概念，并演示如何在 KubeSphere 中管理存储类型和 PVC。

## 集群告警和通知

### [KubeSphere 中的 Alertmanager](../cluster-administration/cluster-wide-alerting-and-notification/alertmanager/)

了解如何在 KubeSphere 中使用 Alertmanager 管理告警。

### [Notification Manager](../cluster-administration/cluster-wide-alerting-and-notification/notification-manager/)

了解如何使用 Notification Manager 管理通知。

### [告警策略（节点级别）](../cluster-administration/cluster-wide-alerting-and-notification/alerting-policy/)

了解如何为节点设置告警策略。

### [告警消息（节点级别）](../cluster-administration/cluster-wide-alerting-and-notification/alerting-message/)

了解如何查看节点的告警策略并处理告警消息。

## 集群设置

### [集群可见性和授权](../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)

了解如何设置集群可见性和授权。

### 日志收集

#### [介绍](../cluster-administration/cluster-settings/log-collections/introduction/)

了解集群日志收集的基础知识，包括工具和一般步骤。

#### [将 Elasticsearch 作为接收器](../cluster-administration/cluster-settings/log-collections/add-es-as-receiver/)

了解如何添加 Elasticsearch 来接收日志、事件或审计日志。

#### [添加 Kafka 作为接收器](../cluster-administration/cluster-settings/log-collections/add-kafka-as-receiver/)

了解如何添加 Kafka 来接收日志、事件或审计日志。

#### [添加 Fluentd 作为接收器](../cluster-administration/cluster-settings/log-collections/add-fluentd-as-receiver/)

了解如何添加 Fluentd 来接收日志、事件或审计日志。

### [邮件服务器](../cluster-administration/cluster-settings/mail-server/)

自定义您的电子邮件地址设置，以接收来自告警的通知。

## [平台设置](../cluster-administration/platform-settings/)

自定义平台设置，例如 Logo、标题等。

## [关闭和重启集群](../cluster-administration/shut-down-and-restart-cluster-gracefully/)

了解如何平稳地关闭和重启集群。
