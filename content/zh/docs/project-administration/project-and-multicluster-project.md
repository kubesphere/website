---
title: "项目和多集群项目"
keywords: 'KubeSphere, Kubernetes, 项目, 多集群项目'
description: '了解如何创建不同类型的项目。'

linkTitle: "项目和多集群项目"
weight: 13100
---

KubeSphere 中的项目即 Kubernetes [命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)，用于将资源划分成互不重叠的分组。这一功能可在多个租户之间分配集群资源，是一种逻辑分区功能。

多集群项目跨集群运行，能为用户提供高可用性，并在问题发生时将问题隔离在某个集群内，避免影响业务。有关更多信息，请参见[多集群管理](../../multicluster-management/)。

本教程演示如何管理项目和多集群项目。

## 准备工作

- 您需要有一个可用的企业空间和一个帐户 (`project-admin`)。该帐户必须在该企业空间拥有 `workspace-self-provisioner` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。
- 在创建多集群项目前，您需要通过[直接连接](../../multicluster-management/enable-multicluster/direct-connection/)或[代理连接](../../multicluster-management/enable-multicluster/agent-connection/)启用多集群功能。

## 项目

### 创建项目

1. 前往企业空间的**项目管理**页面，点击**项目**选项卡下的**创建**。

    {{< notice note >}}

- 您可以在**集群**下拉列表中更改创建项目的集群。该下拉列表只有在启用多集群功能后才可见。

- 如果页面上没有**创建**按钮，则表示您的企业空间没有可用的集群。您需要联系平台管理员或集群管理员，以便在集群中创建企业空间资源。平台管理员或集群管理员需要在**集群管理**页面设置**集群可见性**，才能[将集群分配给企业空间](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)。

    {{</ notice >}}

2. 在弹出的**创建项目**窗口中输入项目名称，根据需要添加别名或说明。在**集群设置**下，选择要创建项目的集群（如果没有启用多集群功能，则不会出现此选项），然后点击**确定**。

3. 创建的项目会显示在下图所示的列表中。您可以点击项目名称打开**概览**页面。

    ![project-list](/images/docs/zh-cn/project-administration/project-and-multicluster-project/project-list.png)

### 编辑项目

1. 前往您的项目，选择**项目设置**下的**基本信息**，在页面右侧点击**项目管理**。

2. 从下拉菜单中选择**编辑信息**。

    ![project-basic-information](/images/docs/zh-cn/project-administration/project-and-multicluster-project/project-basic-information.png)
    
    {{< notice note >}}

项目名称无法编辑。如需修改其他信息，请参考相应的文档教程。

{{</ notice >}}

3. 若要删除项目，选择该下拉菜单中的**删除项目**，在弹出的对话框中输入项目名称，点击**确定**。

   {{< notice warning >}}

项目被删除后无法恢复，项目中的资源也会从项目中移除。

{{</ notice >}}

## 多集群项目

### 创建多集群项目

1. 前往企业空间的**项目管理**页面，点击**多集群项目**选项卡，再点击**创建**。

    {{< notice note >}}

- 如果页面上没有**创建**按钮，则表示您的企业空间没有可用的集群。您需要联系平台管理员或集群管理员，以便在集群中创建企业空间资源。平台管理员或集群管理员需要在**集群管理**页面设置**集群可见性**，才能[将集群分配给企业空间](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)。
- 请确保至少有两个集群已分配给您的企业空间。

    {{</ notice >}}

2. 在弹出的**创建多集群项目**窗口中输入项目名称，并根据需要添加别名或说明。在**集群设置**下，点击**添加集群**为项目选择多个集群，然后点击**确定**。

3. 创建的多集群项目会显示在下图所示的列表中。您可以点击项目名称打开**概览**页面。

    ![multi-cluster-list](/images/docs/zh-cn/project-administration/project-and-multicluster-project/multi-cluster-list.png)

### 编辑多集群项目

1. 前往您的多集群项目，选择**项目设置**下的**基本信息**，在页面右侧点击**项目管理**。

2. 从下拉菜单中选择**编辑信息**。

    ![multi-cluster-basic-information](/images/docs/zh-cn/project-administration/project-and-multicluster-project/multi-cluster-basic-information.png)
    
    {{< notice note >}}

项目名称无法编辑。如需修改其他信息，请参考相应的文档教程。

{{</ notice >}}

3. 若要删除多集群项目，选择该下拉菜单中的**删除项目**，在弹出的对话框中输入项目名称，点击**确定**。

   {{< notice warning >}}

多集群项目被删除后无法恢复，项目中的资源也会从项目中移除。

{{</ notice >}}