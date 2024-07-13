---
title: "在 KubeSphere 上部署 MeterSphere"
keywords: 'KubeSphere, Kubernetes, 应用程序, MeterSphere'
description: '了解如何在 KubeSphere 中部署 MeterSphere。'
linkTitle: "在 KubeSphere 上部署 MeterSphere"
weight: 14330
version: "v3.3"
---

MeterSphere 是一站式的开源企业级连续测试平台，涵盖测试跟踪、界面测试和性能测试等功能。

本教程演示了如何在 KubeSphere 上部署 MeterSphere。

## 准备工作

- 您需要启用 [OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要为本教程创建一个企业空间、一个项目以及两个帐户（`ws-admin` 和 `project-regular`）。在企业空间中，`ws-admin` 帐户必须被赋予 `workspace-admin` 角色，`project-regular` 帐户必须被赋予 `operator` 角色。如果还未创建好，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## **动手实验**

### 步骤 1：添加应用仓库

1. 以 `ws-admin` 身份登录 KubeSphere。在企业空间中，访问**应用管理**下的**应用仓库**，然后点击**添加**。

2. 在出现的对话框中，输入 `metersphere` 作为应用仓库名称，输入 `https://charts.kubesphere.io/test` 作为应用仓库 URL。点击**验证**来验证 URL，如果可用，则会在 URL 右侧看到一个绿色的对号。点击**确定**继续操作。

3. 仓库成功导入到 KubeSphere 后，会显示在列表里。


### 步骤 2：部署 MeterSphere

1. 登出 KubeSphere，再以 `project-regular` 登录。在您的项目中，访问**应用负载**下的**应用**，然后点击**创建**。

2. 在出现的对话框中，选择**从应用模板**。

3. 从下拉菜单中选择 `metersphere`，然后点击 **metersphere-chart**。

4. 在**应用信息**选项卡和**Chart 文件**选项卡，可以看到控制台的默认配置。点击**安装**继续。

5. 在**基本信息**页面，可以看到应用名称、应用版本以及部署位置。点击**下一步**继续。

6. 在**应用设置**页面，将 `imageTag` 的值从 `master` 改为 `v1.6`，然后点击**安装**。

7. 等待 MeterSphere 应用正常运行。

8. 访问**工作负载**，可以看到为 MeterSphere 创建的所有部署和有状态副本集。

   {{< notice note >}}
   
   可能需要过一段时间才能看到所有部署和有状态副本集正常运行。
   
   {{</ notice >}}

### 步骤 3：访问 MeterSphere

1. 问**应用负载**下的**服务**，可以看到 MeterSphere 服务，其服务类型默认设置为 `NodePort`。

2. 您可以通过 `<NodeIP>:<NodePort>` 使用默认帐户及密码 (`admin/metersphere`) 访问 MeterSphere。

   ![login-metersphere](/images/docs/v3.x/zh-cn/appstore/external-apps/deploy-metersphere/login-metersphere.png)

   {{< notice note >}}

   根据您 Kubernetes 集群部署位置的不同，您可能需要在安全组中打开端口，并配置相关的端口转发规则。请确保使用自己的 `NodeIP`。

   {{</ notice >}}