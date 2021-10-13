---
title: "企业空间概述"
keywords: "Kubernetes, KubeSphere, workspace"
description: "了解 KubeSphere 企业空间的概念以及如何创建和删除企业空间。"
linkTitle: "企业空间概述"
weight: 9100
---

企业空间是用来管理[项目](../../project-administration/)、[DevOps 工程](../../devops-user-guide/)、[应用模板](../upload-helm-based-application/)和应用仓库的一种逻辑单元。您可以在企业空间中控制资源访问权限，也可以安全地在团队内部分享资源。

最佳的做法是为租户（集群管理员除外）创建新的企业空间。同一名租户可以在多个企业空间中工作，并且多个租户可以通过不同方式访问同一个企业空间。

本教程演示如何创建和删除企业空间。

## 准备工作

准备一个被授予 `workspaces-manager` 角色的用户，例如[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)中创建的 `ws-manager` 帐户。

## 创建企业空间

1. 以 `ws-manager` 身份登录 KubeSphere Web 控制台。点击左上角的**平台管理**并选择**访问控制**。在**企业空间**页面，点击**创建**。

   {{< notice note >}}

   列表中已列出默认企业空间 `system-workspace`，该企业空间包含所有系统项目。

   {{</ notice >}}

2. 在**基本信息**页面，为创建的企业空间输入名称，并从下拉菜单中选择一名企业空间管理员。点击**创建**以继续。

   - **名称**：为企业空间设置一个专属名称。
   - **别名**：该企业空间的另一种名称。
   - **管理员**：管理该企业空间的帐户。
   - **描述**：企业空间的简短介绍。

3. 企业空间创建后将显示在企业空间列表中。

4. 点击该企业空间，您可以在**概览**页面查看企业空间中的资源状态。

## 删除企业空间

在 KubeSphere 中，可以通过企业空间对项目进行分组管理，企业空间下项目的生命周期会受到企业空间的影响。具体来说，企业空间删除之后，企业空间下的项目及关联的资源也同时会被销毁。

删除企业空间之前，请先确定您是否要解绑部分关键项目。

### 删除前解绑项目

若要删除企业空间并保留其中的部分项目，删除前请先执行以下命令：

```
kubectl label ns <namespace> kubesphere.io/workspace- && kubectl patch ns <namespace>   -p '{"metadata":{"ownerReferences":[]}}' --type=merge
```

{{< notice note >}} 

以上命令会移除与企业空间关联的 Label 并移除 ownerReferences。之后，您可以将解绑的项目重新[分配给新的企业空间](../../faq/access-control/add-kubernetes-namespace-to-kubesphere-workspace/)。

{{</ notice >}} 

### 在控制台上删除企业空间

从企业空间解绑关键项目后，您可以按照以下步骤删除企业空间。

{{< notice note >}} 

如果您使用 kubectl 删除企业空间资源对象，请务必谨慎操作。

{{</ notice >}} 

1. 在企业空间页面，转到**企业空间设置**菜单下的**基本信息**。在**基本信息**页面，您可以查看该企业空间的基本信息，例如项目数量和成员数量。

   {{< notice note >}}

   在该页面，您可以点击**编辑信息**更改企业空间的基本信息（企业空间名称无法更改），也可以开启或关闭[网络隔离](../../workspace-administration/workspace-network-isolation/)。

   {{</ notice >}} 

2. 若要删除企业空间，点击**删除企业空间**下的**删除**。在出现的对话框中输入企业空间的名称，然后点击**确定**。

   {{< notice warning >}}

   企业空间删除后将无法恢复，并且企业空间下的资源也同时会被销毁。

   {{</ notice >}}
