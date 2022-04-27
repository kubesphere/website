---
title: "DevOps 项目管理"
keywords: 'Kubernetes, KubeSphere, DevOps, Jenkins'
description: '创建并管理 DevOps 项目，了解 DevOps 项目中的各项基本元素。'
linkTitle: "DevOps 项目管理"
weight: 11120
---

本教程演示如何创建和管理 DevOps 项目。

## 准备工作

- 您需要创建一个企业空间和一个用户 (`project-admin`)，必须邀请该用户至该企业空间并赋予 `workspace-self-provisioner` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

## 创建 DevOps 项目

1. 以 `project-admin` 身份登录 KubeSphere 控制台，转到 **DevOps 项目**，然后点击**创建**。

2. 输入 DevOps 项目的基本信息，然后点击**确定**。

   - **名称**：此 DevOps 项目的简明名称，便于用户识别，例如 `demo-devops`。
   - **别名**：此 DevOps 项目的别名。
   - **描述信息**：此 DevOps 项目的简要介绍。
   - **集群设置**：在当前版本中，DevOps 项目无法同时跨多个集群运行。如果您已启用[多集群功能](../../../multicluster-management/)，则必须选择一个集群来运行 DevOps 项目。

3. DevOps 项目创建后，会显示在下图所示的列表中。

## 查看 DevOps 项目

点击刚刚创建的 DevOps 项目，转到其详情页面。具有不同权限的租户可以在 DevOps 项目中执行各种任务，包括创建 CI/CD 流水线和凭证以及管理帐户和角色。

### 流水线

流水线是一系列插件的集合，使您可以持续地测试和构建代码。流水线将持续集成 (CI) 和持续交付 (CD) 进行结合，提供精简的工作流，使您的代码可以自动交付给任何目标。

### 凭证

具有所需权限的 DevOps 项目用户可以为流水线配置凭证，以便与外部环境进行交互。用户在 DevOps 项目中添加凭证后，DevOps 项目就可以使用这些凭证与第三方应用程序（例如 GitHub、GitLab 和 Docker Hub）进行交互。有关更多信息，请参见[凭证管理](../../how-to-use/devops-settings/credential-management/)。

### 成员和角色

与项目相似，DevOps 项目也需要为用户授予不同的角色，然后用户才能在 DevOps 项目中工作。项目管理员（例如 `project-admin`）负责邀请租户并授予他们不同的角色。有关更多信息，请参见[角色和成员管理](../../how-to-use/devops-settings/role-and-member-management/)。

## 编辑或删除 DevOps 项目

1. 点击 **DevOps 项目设置**下的**基本信息**，您可以查看当前 DevOps 项目的概述，包括项目角色和项目成员的数量、项目名称和项目创建者。

2. 点击右侧的 **DevOps 管理**，您可以编辑此 DevOps 项目的基本信息或删除 DevOps 项目。