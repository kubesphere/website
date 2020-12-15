---
title: "项目用户指南"
description: "帮助您更好地管理 KubeSphere 项目中的资源"
layout: "single"

linkTitle: "项目用户指南"
weight: 10000

icon: "/images/docs/docs.svg"
---

在 KubeSphere 中，具有必要权限的项目用户能够执行一系列任务，例如创建各种工作负载，配置卷、密钥和 ConfigMap，设置各种发布策略，监控应用程序指标以及创建告警策略。由于 KubeSphere 具有极大的灵活性和兼容性，无需将任何代码植入到原生 Kubernetes 中，因此用户可以在测试、开发和生产环境快速上手 KubeSphere 的各种功能。

## 应用程序

### [应用模板](../project-user-guide/application/app-template/)

了解应用模板的概念以及它们如何在企业内部帮助部署应用程序。

### [使用应用模板部署应用](../project-user-guide/application/deploy-app-from-template/)

了解如何使用基于 Helm 的模板部署应用程序。

### [从应用商店中部署应用](../project-user-guide/application/deploy-app-from-appstore/)

了解如何从应用商店中部署应用程序。

### [构建微服务应用](../project-user-guide/application/compose-app/)

了解如何从零开始构建基于微服务的应用程序。

## 应用工作负载

### [部署](../project-user-guide/application-workloads/deployments/)

了解部署的基本概念以及如何在 KubeSphere 中创建部署。

### [有状态副本集](../project-user-guide/application-workloads/statefulsets/)

了解有状态副本集的基本概念以及如何在 KubeSphere 中创建有状态副本集。

### [守护进程集](../project-user-guide/application-workloads/daemonsets/)

了解守护进程集的基本概念以及如何在 KubeSphere 中创建守护进程集。

### [服务](../project-user-guide/application-workloads/services/)

了解服务的基本概念以及如何在 KubeSphere 中创建服务。

### [任务](../project-user-guide/application-workloads/jobs/)

了解任务的基本概念以及如何在 KubeSphere 中创建任务。

### [定时任务](../project-user-guide/application-workloads/cronjob/)

了解定时任务的基本概念以及如何在 KubeSphere 中创建定时任务。

### [应用路由](../project-user-guide/application-workloads/ingress/)

了解应用路由（即 Ingress）的基本概念以及如何在 KubeSphere 中创建应用路由。

### [容器镜像设置](../project-user-guide/application-workloads/container-image-settings/)

在为工作负载设置容器镜像时，详细了解仪表板上的不同属性。

## 配置

### [ConfigMap](../project-user-guide/configuration/configmaps/)

了解如何在 KubeSphere 中创建 ConfigMap。

### [密钥](../project-user-guide/configuration/secrets/)

了解如何在 KubeSphere 中创建密钥。

### [镜像仓库](../project-user-guide/configuration/image-registry/)

了解如何在 KubeSphere 中创建镜像仓库。

## 自定义应用程序监控

### [介绍](../project-user-guide/custom-application-monitoring/introduction/)

介绍 KubeSphere 自定义监控功能和指标暴露，包括暴露方法和 ServiceMonitor CRD。

### 示例

#### [监控 MySQL](../project-user-guide/custom-application-monitoring/examples/monitor-mysql/)

部署 MySQL 和 MySQL Exporter 并为该应用程序创建监控面板。

#### [监视示例 Web](../project-user-guide/custom-application-monitoring/examples/monitor-sample-web/)

使用 Helm Chart 来部署示例 Web 应用程序并为该应用程序创建监控面板。

### 可视化

#### [概览](../project-user-guide/custom-application-monitoring/visualization/overview/)

了解创建监控仪表板的一般步骤及其布局。

#### [面板](../project-user-guide/custom-application-monitoring/visualization/panel/)

探索仪表板属性和图表指标。

#### [查询](../project-user-guide/custom-application-monitoring/visualization/querying/)

了解如何指定监控指标。

## 灰度发布

### [概述](../project-user-guide/grayscale-release/overview/)

了解灰度发布的基本概念。

### [蓝绿部署](../project-user-guide/grayscale-release/blue-green-deployment/)

了解如何在 KubeSphere 中发布蓝绿部署。

### [金丝雀发布](../project-user-guide/grayscale-release/canary-release/)

了解如何在 KubeSphere 中部署金丝雀服务。

### [流量镜像](../project-user-guide/grayscale-release/traffic-mirroring/)

了解如何在 KubeSphere 中执行流量镜像任务。

## 存储卷管理

### [存储卷](../project-user-guide/storage/volumes/)

了解如何在 KubeSphere 中创建、编辑和挂载存储卷。

### [存储卷快照](../project-user-guide/storage/volume-snapshots/)

了解如何在 KubeSphere 中管理持久卷的快照。

## 告警

### [告警策略（工作负载级别）](../project-user-guide/alerting/alerting-policy/)

了解如何为工作负载设置告警策略。

### [告警消息（工作负载级别）](../project-user-guide/alerting/alerting-message/)

了解如何查看工作负载的告警策略。