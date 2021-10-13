---
title: "角色和成员管理"
keywords: 'Kubernetes, KubeSphere, DevOps, 角色, 成员'
description: '在 DevOps 工程中创建并管理各种角色和成员。'
linkTitle: "角色和成员管理"
weight: 11130
---

本教程演示如何在 DevOps 工程中管理角色和成员。

在 DevOps 工程范围内，您可以向角色授予以下资源的权限：

- 流水线
- 凭证
- DevOps 工程设置
- 访问控制

## 准备工作

至少已创建一个 DevOps 工程，例如 `demo-devops`。此外，您需要一个在 DevOps 工程级别具有 `admin` 角色的用户（例如 `devops-admin`）。

## 内置角色

在**工程角色**中，有三个可用的内置角色，如下所示。创建 DevOps 工程时，KubeSphere 会自动创建内置角色，并且无法编辑或删除这些角色。

| 内置角色 | 描述信息                                                |
| ------------------ | ------------------------------------------------------------ |
| viewer | DevOps 工程观察者，可以查看 DevOps 工程下所有的资源。 |
| operator   | DevOps 工程普通成员，可以在 DevOps 工程下创建流水线凭证等。 |
| admin     | DevOps 工程管理员，可以管理 DevOps 工程下所有的资源。 |

## 创建 DevOps 工程角色

1. 以 `devops-admin` 身份登录控制台，然后前往 **DevOps 工程**页面选择一个 DevOps 工程（例如 `demo-devops`）。

   {{< notice note >}}

   本教程使用 `devops-admin` 帐户作为示例。只要您使用的帐户被授予的角色包含 DevOps 工程级别**访问控制**中的**成员查看**、**角色管理**和**角色查看**的权限，此帐户便可以创建 DevOps 工程角色。

   {{</ notice >}} 

2. 转到**工程管理**中的**工程角色**，点击**创建**并设置**角色标识符**。在本示例中，将创建一个名为 `pipeline-creator` 的角色。点击**编辑权限**继续。

   ![创建角色](/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/devops-role-step_1.png)

3. 在**流水线管理**中，选择您希望授予该角色的权限。例如，为此角色选择了**流水线管理**和**流水线查看**。点击**确定**完成操作。

   ![分配角色](/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/devops-role-step_2.png)

   {{< notice note >}} 

   **依赖于**表示首先需要选择主要权限（**依赖于**之后列出的），以便可以分配关联权限。

   {{</ notice >}} 

4. 新创建的角色将列在**工程角色**中。您可以点击右侧的 <img src="/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/three-dots.png" height="15px"> 对其进行编辑。

   ![角色列表](/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/devops-role-list_3.png)

   {{< notice note >}} 

   `pipeline-creator` 角色仅被授予**流水线管理**和**流水线查看**权限，可能无法满足您的实际需求。本示例仅用于演示，您可以根据实际需要创建自定义角色。

   {{</ notice >}} 

## 邀请新成员

1. 在**工程管理**中选择**工程成员**，然后点击**邀请成员**。

2. 点击 <img src="/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/plus-button.png" height="15px"> 邀请帐户加入此 DevOps 工程，并向此帐户授予 `pipeline-creator` 角色。

   ![邀请成员](/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/devops-invite-member_4.png)

   {{< notice note >}} 

   必须先邀请用户加入 DevOps 工程所在的企业空间。

   {{</ notice >}} 

3. 点击**确定**将用户添加到此 DevOps 工程。在**工程成员**中，您可以看到列出了新邀请的成员。

4. 您还可以通过编辑现有成员来更改其角色或将其从 DevOps 工程中删除。

   ![编辑成员](/images/docs/zh-cn/devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/devops-user-edit_5.png)

