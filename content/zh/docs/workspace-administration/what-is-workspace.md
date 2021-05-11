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

准备一个被授予 `workspaces-manager` 角色的帐户，例如[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)中创建的 `ws-manager` 帐户。

## 创建企业空间

1. 以 `ws-manager` 身份登录 KubeSphere Web 控制台。在**访问控制**页面，您可以查看平台上的所有企业空间。列表中已列出默认企业空间 `system-workspace`，该企业空间包含所有系统项目。

2. 点击**创建**。

   ![企业空间列表](/images/docs/zh-cn/workspace-administration-and-user-guide/workspace-overview/workspace-list.PNG)

3. **在基本信息**页面，为创建的企业空间输入名称，并从下拉菜单中选择一名企业空间管理员。点击**创建**以继续。

   ![输入企业空间信息](/images/docs/zh-cn/workspace-administration-and-user-guide/workspace-overview/provide-workspace-info.PNG)

   - **企业空间名称**：为企业空间设置一个专属名称。
   - **别名**：该企业空间的另一种名称。
   - **企业空间管理员**：管理该企业空间的帐户。
   - **描述信息**：企业空间的简短介绍。

4. 新创建的企业空间将在下图所示的列表中列出。

   ![创建的企业空间](/images/docs/zh-cn/workspace-administration-and-user-guide/workspace-overview/created-workspace.PNG)

5. 点击该企业空间，您就可以在**概览**页面查看企业空间中的资源状态。

   ![企业空间概览](/images/docs/zh-cn/workspace-administration-and-user-guide/workspace-overview/workspace-overview.PNG)

## 删除企业空间

1. 在企业空间页面，转到**企业空间设置**菜单下的**基本信息**。在**基本信息**页面，您可以查看该企业空间的基本信息，例如项目数量和成员数量。

   ![企业空间基本信息](/images/docs/zh-cn/workspace-administration-and-user-guide/workspace-overview/workspace-basic-info.PNG)

   {{< notice note >}}

   在该页面，您可以点击**编辑信息**更改企业空间的基本信息（企业空间名称无法更改），也可以打开或关闭[网络隔离](../../workspace-administration/workspace-network-isolation/)。

   {{</ notice >}} 

2. 要删除企业空间，先勾选**确定删除企业空间**，然后点击**删除**。

   ![删除企业空间](/images/docs/zh-cn/workspace-administration-and-user-guide/workspace-overview/delete-workspace.PNG)

   {{< notice warning >}}

   [企业空间删除后将无法恢复](../../faq/notices/delete-workspace)，并且企业空间下的资源也同时会被销毁。

   {{</ notice >}}
