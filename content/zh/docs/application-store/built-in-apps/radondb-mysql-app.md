---
title: "在 KubeSphere 中部署 RadonDB MySQL"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB MySQL'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB MySQL。'
linkTitle: "在 KubeSphere 中部署 RadonDB MySQL"
weight: 14293
---

[RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) 是基于 [MySQL](https://MySQL.org) 的开源、云原生、高可用集群解决方案。通过使用 Raft 协议，RadonDB MySQL 可以快速进行故障转移，且不会丢失任何事务。

本教程演示如何从 KubeSphere 应用商店部署 RadonDB MySQL。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 RadonDB MySQL

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

2. 找到 RadonDB MySQL，点击**应用信息**页面上的**部署**。

   ![应用商店中的 RadonDB MySQL](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-in-app-store.png)

   ![部署 RadonDB MySQL](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/deploy-radondb-mysql.png)

3. 设置名称并选择应用版本。请确保将 RadonDB MySQL 部署在 `demo-project` 中，点击**下一步**。

   ![确认部署](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/confirm-deployment.png)

4. 在**应用配置**页面，您可以使用默认配置，或者编辑 YAML 文件以自定义配置。点击**部署**继续。

   ![设置应用配置](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/set-app-configuration.png)

5. 稍等片刻待 RadonDB MySQL 启动并运行。

   ![RadonDB MySQL 运行中](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-running.png)

### 步骤 2：访问 RadonDB MySQL

1. 进入**应用负载**下的**服务**页面，点击 RadonDB MySQL 服务名称。

   ![RadonDB MySQL 服务](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-service.png)

2. 在**容器组**下，展开菜单查看容器详情，然后点击**终端**图标。

   ![RadonDB MySQL 终端](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-terminal.png)

3. 在弹出窗口中，直接向终端输入命令使用该应用。

   ![访问 RadonDB MySQL](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-service-terminal.png)

4. 如果您想从集群外部访问 RadonDB MySQL，详细信息请参见 [RadonDB MySQL 开源项目](https://github.com/radondb/radondb-mysql-kubernetes)。
