---
title: "角色和成员管理"
keywords: 'Kubernetes, KubeSphere, DevOps, role, member'
description: '角色和成员管理'
linkTitle: "角色和成员管理"
weight: 11130
---

本教程演示了如何在 DevOps 工程中管理角色和成员。 有关 KubeSphere 角色的更多信息，请参见角色管理概述。

在 DevOps 工程范围内，您可以向角色授予以下资源的权限：

- 流水线
- 凭证
- DevOps 配置
- 访问控制

## 先决条件

至少已创建一个 DevOps 工程，例如 `demo-devops`。 此外，您需要在 DevOps 工程级别具有管理员角色的帐户（例如 `devops-admin`）。

## 内置角色

在**工程角色**中，有三个可用的内置角色，如下所示。 内置角色是在创建 DevOps 工程时由 KubeSphere 自动创建的，并且无法对其进行编辑或删除。

| 内置角色     | 描述信息                                                  |
| ------------------ | ------------------------------------------------------------ |
| viewer | DevOps 工程观察者，可以查看 DevOps 工程下所有的资源。 |
| operator   | DevOps 工程普通成员，可以在 DevOps 工程下创建流水线凭证等。 |
| admin     | DevOps 工程管理员，可以管理 DevOps 工程下所有的资源。 |

## 创建一个 DevOps 工程角色

1. 以 `devops-admin` 身份登录控制台，然后在 **DevOps 工程**列表下选择一个 DevOps 项目（例如 `demo-devops`）。

   {{< notice note >}}

   以 `devops-admin` 帐户为例。只要您使用的帐户被授予了一个角色，包括在DevOps工程级别访问控制中的**工程观察者**、**工程管理员**和**工程维护者**的授权，它就可以创建 DevOps 项目角色。

   {{</ notice >}}

2. 转到**工程管理**中的**工程角色**，单击**创建**并设置**角色标识符**。 在此示例中，将创建一个名为 `pipeline-creator` 的角色。 单击**编辑权限**继续。

   ![Create a devops project role](/images/docs/devops-admin-zh/devops_role_step1.png)

3. 在**流水线管理**中，选择您希望授予该角色用户所拥有的权限。 例如，为此角色选择了**流水线管理**和**流水线查看**。 单击**确定**完成。

   ![Edit Authorization](/images/docs/devops-admin-zh/devops_role_step2.png)

   {{< notice note >}}

   **依赖于**表示首先需要选择主要授权（**依赖于**之后列出的），以便可以分配关联授权。

   {{</ notice >}}

4. 新创建的角色将列在**工程角色**中。 您可以单击右侧的三个点对其进行编辑。

   ![Edit Roles](/images/docs/devops-admin-zh/devops_role_list.png)

   {{< notice note >}}

  仅授予 `pipeline-creator` 角色流水线管理和查看权限可能无法满足您的实际需求。本示例仅用于演示目的。您可以根据实际需要自定义角色权限。

   {{</ notice >}}

## 邀请新成员

1. 在**工程管理**中选择**工程成员**，然后单击**邀请成员**。

2. 邀请用户加入 DevOps 项目。向用户授予 `pipeline-creator` 的角色。

   ![invite member](/images/docs/devops-admin-zh/devops_invite_member.png)

   {{< notice note >}}

   首先必须先邀请用户加入 DevOps 工程所在的企业空间。

   {{</ notice >}}

3. 将用户添加到 DevOps 工程后，单击**确定**。 在**工程成员**中，您可以看到列出了新邀请的成员。

    ![list member](/images/docs/devops-admin-zh/devops_list_member.png)

4. 您还可以通过编辑现有成员或从 DevOps 工程中将其删除来更改其角色。

   ![edit member role](/images/docs/devops-admin-zh/devops_user_edit.png)
