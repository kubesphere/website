---
title: "项目用户指南"
description: "帮助您更好地管理 KubeSphere 项目中的资源"
layout: "single"

linkTitle: "项目用户指南"
weight: 4300

icon: "/images/docs/docs.svg"
---

在 KubeSphere 中，具有必要权限的项目用户能够执行一系列任务，例如创建各种工作负载，配置卷，密钥和配置，设置各种发布策略，监控应用程序指标以及创建警报策略。 由于 KubeSphere 具有极大的灵活性和兼容性，而无需将任何代码入侵到本地 Kubernetes 中，因此用户可以轻松地开始测试，开发和生产环境所需的任何功能。

## 应用工作负载

### [部署](../project-user-guide/application-workloads/deployments/)

了解部署的基本概念以及如何在 KubeSphere 中创建部署。

### [有状态副本集](../project-user-guide/application-workloads/statefulsets/)

了解 StatefulSet 的基本概念以及如何在 KubeSphere 中创建 StatefulSet。

### [守护进程集](../project-user-guide/application-workloads/daemonsets/)

了解 DaemonSet 的基本概念以及如何在 KubeSphere 中创建 DaemonSet。

### [任务](../project-user-guide/application-workloads/jobs/)

了解 Jobs 的基本概念以及如何在 KubeSphere 中创建 Jobs。

### [定时任务](../project-user-guide/application-workloads/cronjob/)

了解 CronJobs 的基本概念以及如何在 KubeSphere 中创建 CronJobs。

### [服务](../project-user-guide/application-workloads/services/)

了解服务的基本概念以及如何在 KubeSphere 中创建服务。

### [Ingress](../project-user-guide/application-workloads/ingress/)

了解 Ingress 的基本概念（即 Ingress），以及如何在 KubeSphere 中创建 Ingress。

### [容器镜像设置](../project-user-guide/application-workloads/container-image-settings/)

在为工作负载设置容器镜像时，详细了解仪表板上的其他属性。

## 定制应用程序监控

### [介绍](../project-user-guide/custom-application-monitoring/introduction/)

介绍 KubeSphere 自定义监视功能和指标公开，包括公开方法和 ServiceMonitor CRD。

### 开始使用

#### [监控 MySQL](../project-user-guide/custom-application-monitoring/get-started/monitor-mysql/)

部署 MySQL 和 MySQL Exporter 并创建一个仪表板来监视该应用程序。

#### [监视示例 Web](../project-user-guide/custom-application-monitoring/get-started/monitor-sample-web/)

使用 Helm 图表来部署示例 Web 应用程序并创建仪表板以监视该应用程序。

### 可视化

#### [概览](../project-user-guide/custom-application-monitoring/visualization/overview/)

了解创建监控仪表板的一般步骤及其布局。

#### [面板](../project-user-guide/custom-application-monitoring/visualization/panel/)

探索仪表板属性和图表指标。

#### [查询](../project-user-guide/custom-application-monitoring/visualization/querying/)

了解如何指定监控指标。

## 告警

### [告警策略（工作负载级别）](../project-user-guide/alerting/alerting-policy/)

了解如何为工作负载设置告警策略。

### [告警消息（工作负载级别）](../project-user-guide/alerting/alerting-message/)

了解如何查看工作负载的告警策略。