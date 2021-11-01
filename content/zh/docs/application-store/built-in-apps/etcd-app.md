---
title: "在 KubeSphere 中部署 etcd"
keywords: 'Kubernetes, KubeSphere, etcd, 应用商店'
description: '了解如何从 KubeSphere 应用商店中部署 etcd 并访问服务。'
linkTitle: "在 KubeSphere 中部署 etcd"
weight: 14210
---

[etcd](https://etcd.io/) 是一个采用 Go 语言编写的分布式键值存储库，用来存储供分布式系统或机器集群访问的数据。在 Kubernetes 中，etcd 是服务发现的后端，存储集群状态和配置。

本教程演示如何从 KubeSphere 应用商店部署 etcd。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 etcd

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

   ![项目概览](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/project-overview-1.PNG)

2. 找到 etcd，点击**应用信息**页面上的**部署**。

   ![应用商店 etcd](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/etcd-app-store-2.PNG)

   ![部署 etcd](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/deploy-etcd-3.PNG)

3. 设置名称并选择应用版本。请确保将 etcd 部署在 `demo-project` 中，点击**下一步**。

   ![部署位置](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/deployment-location-4.PNG)

4. 在**应用配置**页面，指定 etcd 的持久化存储卷大小，点击**部署**。

   ![指定存储卷](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/specify-volume-5.PNG)

   {{< notice note >}}

   要指定 etcd 的更多值，请使用右上角的拨动开关查看 YAML 格式的应用清单文件，并编辑其配置。

   {{</ notice >}} 

5. 在**应用**页面的**基于模板的应用**选项卡下，稍等片刻待 etcd 启动并运行。

   ![etcd 运行中](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/etcd-running-6.PNG)

### 步骤 2：访问 etcd 服务

应用部署后，您可以在 KubeSphere 控制台上使用 etcdctl 命令行工具与 etcd 服务器进行交互，直接访问 etcd。

1. 在**工作负载**的**有状态副本集**选项卡中，点击 etcd 的服务名称。

   ![etcd 有状态副本集](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/etcd-statefulset-7.PNG)

2. 在**容器组**下，展开菜单查看容器详情，然后点击**终端**图标。

   ![etcd 终端](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/etcd-terminal-8.PNG)

3. 在终端中，您可以直接读写数据。例如，分别执行以下两个命令。

   ```bash
   etcdctl set /name kubesphere
   ```

   ```bash
   etcdctl get /name
   ```

   ![etcd 命令](/images/docs/zh-cn/appstore/built-in-apps/deploy-etcd-on-ks/etcd-command-9.PNG)

4. KubeSphere 集群内的客户端可以通过 `<app name>.<project name>.svc.<K8s domain>:2379`（例如本教程中是 `etcd-rscvf6.demo-project.svc.cluster.local:2379`） 访问 etcd 服务。

5. 有关更多信息，请参见 [etcd 官方文档](https://etcd.io/docs/v3.4.0/)。

