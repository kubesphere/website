---
title: "DevOps 工程管理"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '本教程演示了如何创建和管理 DevOps 工程。'
linkTitle: "DevOps 工程管理 "
weight: 11120
---

本教程演示了如何创建和管理 DevOps 工程。

## 先决条件

- 您需要创建一个企业空间和一个具有项目管理 (`project-admin`) 权限的帐户，该账户必须是被赋予企业空间普通用户角色。想要查询更多的信息，请参考[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。 

## 创建一个 DevOps 工程

1. 用项目管理员身份登录。 转到 **DevOps 工程**，然后单击**创建**。

   ![devops-project-create](/images/docs/devops-user-guide-zh/using-devops-zh/devops-project-management-zh/devops-project-create.png)

2. 提供 DevOps 工程的基本信息，然后单击**确定**。

   ![create-devops](/images/docs/devops-user-guide-zh/using-devops-zh/devops-project-management-zh/create-devops.png)

   - **名称**: 此 DevOps 工程的简洁明了的名称，便于用户识别，例如 `demo-devops`。
   - **别名**: DevOps 工程的别名。
   - **描述信息**: DevOps 工程的简要介绍。
   - **集群设置**: 在当前版本中，DevOps 工程无法同时跨多个集群运行。 如果启用了[多集群功能](../../../multicluster-management/)，则必须选择运行 DevOps 工程的集群。

3.创建后，DevOps 工程将出现在下面的列表中。

   ![devops-list](/images/docs/devops-user-guide-zh/using-devops-zh/devops-project-management-zh/devops-list.png)

## 查看 DevOps 工程

单击刚刚创建的 DevOps 工程，转到其详细信息页面。 允许具有不同权限的租户在 DevOps 工程中执行各种任务，包括创建 CI/CD 流水线、凭据以及管理帐户和角色。

![devops-detail-page](/images/docs/devops-user-guide-zh/using-devops-zh/devops-project-management-zh/devops-detail-page.png)

### 流水线

流水线是一系列的插件集合，可以通过组合它们来实现持续集成（CI）和持续交付（CD）的功能，因此您的代码可以自动交付给任何目标。

### 凭证

具有所需权限的 DevOps 工程用户可以为与外部环境进行交互的流水线配置凭据。 一旦用户在 DevOps 工程中添加了这些凭据，DevOps 工程就可以使用凭据与第三方应用程序（例如 GitHub，GitLab 和 Docker Hub）进行交互。 有关更多信息，请参阅[凭证管理](../../../devops-user-guide/how-to-use/credential-management/)。

### 成员和角色

与项目相似，DevOps 工程还要求授予用户不同的角色，然后才能在 DevOps 工程中工作。 项目管理员（例如 `project-admin`）负责邀请租户并授予他们不同的角色。 有关更多信息，请参见[角色和成员管理](../role-and-member-management/)。

## 编辑或删除 DevOps 工程

1. 单击**工程管理**下的**基本信息**，您可以查看当前 DevOps 工程的概述，包括项目角色和成员的数量，工程名称和工程创建者。

2. 单击右侧的**工程管理**，您可以编辑 DevOps 工程的基本信息或删除 DevOps 工程。

   ![project-basic-info](/images/docs/devops-user-guide-zh/using-devops-zh/devops-project-management-zh/project-basic-info.png)