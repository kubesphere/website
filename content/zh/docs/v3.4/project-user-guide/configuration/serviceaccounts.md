---

title: "服务帐户"
keywords: 'Kubesphere，Kubernetes，服务帐户'
description: '学习如何在 Kubesphere 上创建服务帐户。'
linkTitle: "服务帐户"
weight: 10440
version: "v3.4"
---

[服务帐户](https://kubernetes.io/zh/docs/tasks/configure-pod-container/configure-service-account/) 为 Pod 中运行的进程提供了标识。当用户访问集群时，API 服务器将用户认证为特定的用户帐户。当这些进程与 API 服务器联系时，Pod 里容器的进程将被验证为特定的服务帐户。

该文档描述了如何在 KubeSphere 上创建服务帐户。

## 前提条件

你已经创建一个企业空间、项目和用户（`project-regular`），将该用户邀请至创建的项目，并为其分配 `operator` 角色。有关更多信息，请参阅 [创建企业空间、项目、用户和平台角色](https://kubesphere.io/zh/docs/quick-start/create-workspace-and-project/)。

## 创建服务帐户

1. 以 `project-regular` 用户登录到 KubeSphere 控制台，点击**项目**。

1. 选择您想要创建服务账户的项目。

1. 在左侧导航栏，单击**配置** > **服务账户**。您会在**服务账户**页面看到一个名为 `default` 的服务帐户。该账户是在创建项目时自动创建的。

   {{< notice note >}}

   如果在项目中创建工作负载时未指定服务帐户，则将自动分配同一项目中的 `default`服务帐户。

   {{</ notice >}}

2. 单击**创建**。在显示的**创建服务账户**对话框中，您可以设置以下参数：

- **名称**（必填项）：服务帐户的唯一标识符。
- **别名**：服务帐户的别名，以帮助你更好地识别服务帐户。
- **简介**：服务帐户简介。
- **项目角色**：从服务帐户的下拉列表中选择一个项目角色。在一个项目中，不同的项目角色有[不同的权限](../../../project-administration/role-and-member-management/#built-in-roles)。

5. 完成参数设置后，单击**创建**。

## 查看服务帐户详情页

1. 在左侧导航栏，单击**配置** > **服务账户**。单击创建的服务帐户以转到其详细页。

2. 单击**编辑信息**以编辑服务账户基本信息，或单击**更多操作**执行下列任一操作：
   - **编辑 YAML**：查看、更新或下载 YAML 文件。
   - **修改角色**：修改服务帐户的项目角色。
   - **删除**：删除服务帐户。
   
3. 在右侧的**资源状态**页签，查看服务账户的保密字典和 kubeconfig 详情。

