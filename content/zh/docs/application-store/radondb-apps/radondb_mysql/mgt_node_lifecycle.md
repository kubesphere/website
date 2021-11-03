---
title: "在 KubeSphere 中管理 RadonDB MySQL 节点"
keywords: 'KubeSphere, Kubernetes, 节点生命周期, RadonDB MySQL'
description: '了解如何从 KubeSphere 管理 RadonDB MySQL 节点生命周期。'
linkTitle: "节点生命周期"
weight: 14524
---



本教程演示了如何在 KubeSphere 上管理 MySQL 节点生命周期，包括新增节点、查看节点、删除节点。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 请确保创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保已部署 RadonDB MySQL 集群。

## 新增节点

最多可创建 100 个节点。默认部署 1 个节点。

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。
2. 在应用列表下，选择 MySQL 集群，进入集群详情页面。
3. 在应用基本信息区域，点击**更多操作** > **新增节点**，弹出节点配置窗口。

   ![新增节点](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql—node.png)

4. 配置节点数量。
5. 点击**确定**，待集群状态切换为`运行中`，则新增节点完成。

   可在**节点**列表，查看新增节点节点信息。

## 查看节点信息

集群部署完成后，可在集群管理页面，扩容集群存储卷，支持选择存储卷范围 10 ～ 2048 Gi。

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。
2. 在应用列表下，选择 MySQL 集群，进入集群详情页面。
3. 在**节点**列表区域，可查看集群节点基本信息。

   ![节点基本信息](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql—node-basic.png)

4. 点击节点名称，进入节点容器组详情页面，可分别查看节点**配置文件**、**资源状态**、**调度信息**、**元数据**、**Monitoring**、**环境变量**、**事件**。

   - 在**配置文件**页面，可查看和下载当前节点配置文件信息。
   - 在**资源状态**页面，可查看节点当前资源配置和状态。
   - 在**调度信息**页面，可查看节点可调度资源信息。
   - 在**元数据**页面，可查看节点元数据信息。
   - 在 **Monitoring** 页面，可监控节点资源使用状态。
   - 在**环境变量**页面，可查看节点环境变量信息。
   - 在**事件**页面，记录节点操作事件。

   ![节点详细信息](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql—node-detail.png)

## 删除节点

1. 进入集群详情页面。
2. 在**节点**列表区域，点击节点名称，进入节点容器组详情页面。
3. 点击**删除**，弹出删除确认窗口。
4. 输入节点名称，点击**确认**，立即删除节点。
   返回集群详情页面，即可查看节点已删除。
