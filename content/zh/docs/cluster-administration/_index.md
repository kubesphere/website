---
title: "集群管理"
description: "理解管理集群的基础知识"
layout: "single"

linkTitle: "集群管理"

weight: 4100

icon: "/images/docs/docs.svg"

---

在 KubeSphere 中，您可以使用交互式 Web 控制台或内置的本地命令行工具 `kubectl` 设置集群并配置其功能。作为集群管理员，您将负责一系列任务，包括在节点上管理调度并添加标签，控制集群可见性，​​监控集群状态，设置集群的告警范围和通知规则，以及配置存储和日志收集的方案等。

{{< notice note >}}

本章未介绍多集群管理。有关此功能的更多信息，请参见[多集群管理](../multicluster-management/)。

{{</ notice >}}

## [持久卷 (PV) 和存储类 (Storage Class)](../cluster-administration/persistent-volume-and-storage-class/)

了解持久卷 (PV)，持久卷实例 (PVC) 和存储类 (Storge Class) 的基本概念，并演示如何在 KubeSphere 中管理存储类和持久卷实例。

## [节点管理](../cluster-administration/nodes/)

监控节点状态并了解如何添加节点标签和污点。

## [集群状态监控](../cluster-administration/cluster-status-monitoring/)

根据不同的指标（包括物理资源、ETCD 和 APIServer）监控集群如何运行。

## [应用资源监控](../cluster-administration/application-resources-monitoring/)

监控集群中的应用资源，比如不同项目的 Deployment 数量和 CPU 使用情况。

## 群集范围的告警和通知

### [kubeSphere中的Alertmanager](../cluster-administration/cluster-wide-alerting-and-notification/alertmanager/)

了解如何在 KubeSphere 中使用 Alertmanager 管理警报。

### [通知管理器](../cluster-administration/cluster-wide-alerting-and-notification/notification-manager/)

了解如何使用通知管理器管理通知。

### [告警策略 (节点级别)](../cluster-administration/cluster-wide-alerting-and-notification/alerting-policy/)

了解如何为节点设置告警策略。

### [告警信息 (节点级别)](../cluster-administration/cluster-wide-alerting-and-notification/alerting-message/)

了解如何查看节点的告警策略。

## 集群设置

### 日志收集

#### [介绍](../cluster-administration/cluster-settings/log-collections/introduction/)

了解集群日志收集的基础知识，包括工具和常规步骤。

#### [将Elasticsearch作为接收者](../cluster-administration/cluster-settings/log-collections/add-es-as-receiver/)

了解如何添加 Elasticsearch 来接收日志、事件或审计日志。

#### [将Kafka添加为接收者](../cluster-administration/cluster-settings/log-collections/add-kafka-as-receiver/)

了解如何添加 Kafka 来接收日志、事件或审计日志。

#### [将Fluentd添加为接收者](../cluster-administration/cluster-settings/log-collections/add-fluentd-as-receiver/)

了解如何添加 Fluentd 来接收日志、事件或审计日志。

### [邮件服务器](../cluster-administration/cluster-settings/mail-server/)

自定义您的电子邮件地址设置，以接收任何告警的通知。

## [自定义平台信息](../cluster-administration/platform-settings/customize-basic-information/)

自定义平台设置，如 Logo、标题等。

## [关闭和重启集群](../cluster-administration/shuting-down-and-restart-cluster-cracefully/)

了解如何优雅地关闭集群以及如何重新启动它。
