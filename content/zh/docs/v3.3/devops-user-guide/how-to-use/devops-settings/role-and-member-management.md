---
title: "角色和成员管理"
keywords: 'Kubernetes, KubeSphere, DevOps, 角色, 成员'
description: '在 DevOps 项目中创建并管理各种角色和成员。'
linkTitle: "角色和成员管理"
weight: 11242
---

本教程演示如何在 DevOps 项目中管理角色和成员。

在 DevOps 项目范围内，您可以向角色授予以下资源的权限：

- 流水线
- 凭证
- DevOps 项目设置
- 访问控制

## 准备工作

至少已创建一个 DevOps 项目，例如 `demo-devops`。此外，您需要一个在 DevOps 项目级别具有 `admin` 角色的用户（例如 `devops-admin`）。

## 内置角色

在 **DevOps 项目角色**中，有三个可用的内置角色，如下所示。创建 DevOps 项目时，KubeSphere 会自动创建内置角色，并且无法编辑或删除这些角色。

| 内置角色 | 描述信息                                                |
| ------------------ | ------------------------------------------------------------ |
| viewer | DevOps 项目观察者，可以查看 DevOps 项目下所有的资源。 |
| operator   | DevOps 项目普通成员，可以在 DevOps 项目下创建流水线凭证等。 |
| admin     | DevOps 项目管理员，可以管理 DevOps 项目下所有的资源。 |

## 创建 DevOps 项目角色

1. 以 `devops-admin` 身份登录控制台，然后前往 **DevOps 项目**页面选择一个 DevOps 项目（例如 `demo-devops`）。

   {{< notice note >}}

   本教程使用 `devops-admin` 帐户作为示例。只要您使用的帐户被授予的角色包含 DevOps 项目级别**访问控制**中的**成员查看**、**角色管理**和**角色查看**的权限，此帐户便可以创建 DevOps 项目角色。

   {{</ notice >}} 

2. 转到 **DevOps 项目设置**中的 **DevOps 项目角色**，点击**创建**并设置**名称**。在本示例中，将创建一个名为 `pipeline-creator` 的角色。点击**编辑权限**继续。

3. 在**流水线管理**中，选择您希望授予该角色的权限。例如，为此角色选择了**流水线管理**和**流水线查看**。点击**确定**完成操作。

   {{< notice note >}} 

   **依赖于**表示首先需要选择主要权限（**依赖于**之后列出的），以便可以分配关联权限。

   {{</ notice >}} 

4. 新创建的角色将列在 **DevOps 项目角色**中。您可以点击右侧的 <img src="/images/docs/v3.3/common-icons/three-dots.png" height="15px"> 对其进行编辑。

   {{< notice note >}} 

   `pipeline-creator` 角色仅被授予**流水线管理**和**流水线查看**权限，可能无法满足您的实际需求。本示例仅用于演示，您可以根据实际需要创建自定义角色。

   {{</ notice >}} 

## 邀请新成员

1. 在 **DevOps 项目设置**中选择 **DevOps 项目成员**，然后点击**邀请**。

2. 点击 <img src="/images/docs/v3.3/common-icons/invite-member-button.png" height="15px"> 邀请帐户加入此 DevOps 项目，并向此帐户授予 `pipeline-creator` 角色。

   {{< notice note >}} 

   必须先邀请用户加入 DevOps 项目所在的企业空间。

   {{</ notice >}} 

3. 点击**确定**将用户添加到此 DevOps 项目。在 **DevOps 项目成员**中，您可以看到列出了新邀请的成员。

4. 您还可以通过编辑现有成员来更改其角色或将其从 DevOps 项目中删除。


