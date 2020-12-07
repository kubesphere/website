---
title: "Cluster Administration"
description: "Understand the basics of administering your clusters."
layout: "single"

linkTitle: "Cluster Administration"

weight: 8000

icon: "/images/docs/docs.svg"

---

In KubeSphere, you set a cluster's configurations and configure its features using the interactive web console or the built-in native command-line tool kubectl. As a cluster administrator, you are responsible for a series of tasks, including cordoning and adding labels to nodes, controlling cluster visibility, monitoring cluster status, setting cluster-wide alerting and notification rules, as well as configuring storage and log collection solutions.

{{< notice note >}}

Multi-cluster management is not covered in this chapter. For more information about this feature, see [Multi-cluster Management](../multicluster-management/).

{{</ notice >}}

## [Persistent Volume and Storage Class](../cluster-administration/persistent-volume-and-storage-class/)

Learn basic concepts of PVs, PVCs and storage classes, and demonstrate how to manage storage classes and PVCs in KubeSphere.

## [Node Management](../cluster-administration/nodes/)

Monitor node status and learn how to add node labels or taints.

## [Cluster Status Monitoring](../cluster-administration/cluster-status-monitoring/)

Monitor how a cluster is functioning based on different metrics, including physical resources, ETCD, and APIServer.

## [Application Resources Monitoring](../cluster-administration/application-resources-monitoring/)

Monitor application resources across the cluster, such as the number of Deployments and CPU usage of different projects.

## Cluster-wide Alerting and Notification

### [Alertmanager in KubeSphere](../cluster-administration/cluster-wide-alerting-and-notification/alertmanager/)

Learn how to manage alerts with Alertmanager in KubeSphere.

### [Notification Manager](../cluster-administration/cluster-wide-alerting-and-notification/notification-manager/)

Learn how to manage notifications with Notification Manager.

### [Alerting Policy (Node Level)](../cluster-administration/cluster-wide-alerting-and-notification/alerting-policy/)

Learn how to set alerting policies for nodes.

### [Alerting Message (Node Level)](../cluster-administration/cluster-wide-alerting-and-notification/alerting-message/)

Learn how to view alerting policies and deal with alerting messages for nodes.

## Cluster Settings

### [Cluster Visibility and Authorization](../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)

Learn how to set up cluster visibility and authorization.

### Log Collections

#### [Introduction](../cluster-administration/cluster-settings/log-collections/introduction/)

Learn the basics of cluster log collections, including tools and general steps.

#### [Add Elasticsearch as Receiver](../cluster-administration/cluster-settings/log-collections/add-es-as-receiver/)

Learn how to add Elasticsearch to receive logs, events or auditing logs.

#### [Add Kafka as Receiver](../cluster-administration/cluster-settings/log-collections/add-kafka-as-receiver/)

Learn how to add Kafka to receive logs, events or auditing logs.

#### [Add Fluentd as Receiver](../cluster-administration/cluster-settings/log-collections/add-fluentd-as-receiver/)

Learn how to add Fluentd to receive logs, events or auditing logs.

### [Mail Server](../cluster-administration/cluster-settings/mail-server/)

Customize your email address settings to receive notifications of any alert.

## [Platform Settings](../cluster-administration/platform-settings/)

Customize platform settings such as logo, title etc.

## [Cluster Shutdown and Restart](../cluster-administration/shut-down-and-restart-cluster-gracefully/)

Learn how to gracefully shut down your cluster and how to restart it.
