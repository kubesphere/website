---
title: "角色和成员管理"
keywords: "Kubernetes, workspace, KubeSphere, multitenancy"
description: "企业空间中的角色和成员管理"

linkTitle: "角色和成员管理"
weight: 9400
---

本指南向您演示了如何在企业空间中管理角色和成员。有关 KubeSphere 角色的更多信息，请参见角色管理概览。

在企业空间中，您可以向一个角色授权以下资源的权限：

- 项目
- DevOps
- 访问控制
- 应用管理
- 企业空间设置

## 准备工作

至少已创建一个企业空间，例如 `demo-workspace`。您还需要准备一个帐户（如 `ws-admin`），该帐户在企业空间层级拥有 `workspace-admin ` 角色。如果不清楚怎样进行准备工作，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

{{< notice note >}} 

实际的角色名称遵循命名约定：`workspace name-role name`。例如，在名为 `demo-workspace` 的企业空间中，角色 `workspace-admin` 的实际角色名称为 `demo-workspace-admin`。

{{</ notice >}} 

## 内置角色

在**企业角色**中，列出了如下所示的四个可用内置角色。创建企业空间时，KubeSphere 会自动创建内置角色，并且内置角色无法进行编辑或删除。您只能查看权限和授权用户。

| **内置角色** | **描述信息**                                          |
| ------------------ | ------------------------------------------------------------ |
| workspace-viewer | 企业空间的观察者，可以查看企业空间下所有的资源信息。 |
| workspace-self-provisioner     | 企业空间普通成员，可以在企业空间下创建项目和 DevOps 工程。 |
| workspace-regular   | 企业空间普通成员，无法在企业空间下创建项目和 DevOps 工程。 |
| workspace-admin     | 企业空间管理员，可对任何资源进行任意操作。它可以充分管理企业空间下所有的资源。 |

1. 在**企业角色**中，点击 `workspace-admin` 就可以查看如下所示的角色详情。

![企业成员详情](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/workspace-role-detail.PNG)

2. 您可以切换到**授权用户**标签页，查看被授予 `workspace-admin` 角色的所有用户。

## 创建企业角色

1. 以 `ws-admin` 身份登录控制台，转到**企业空间设置**下的**企业角色**。

{{< notice note >}}

此处使用 `ws-admin` 账户作为示例。只要账户在企业空间层级被授予的角色拥有**访问控制**下的**成员查看**、**角色查看**以及**角色管理**权限，您就可以使用该账户创建企业角色。

{{</ notice >}} 

2. 在**企业角色**中，点击**创建**并设置**角色标识符**。本示例将创建一个名为 `workspace-projects-admin` 的角色。点击**编辑权限**继续。

![创建企业角色步骤一](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/workspace-role-create-step1.PNG)

3. 在**项目管理**中，选择该角色所包含的权限。本示例中，为该角色选择了**项目创建**、**项目管理**和**项目查看**。点击**确定**完成操作。

![编辑权限](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/workspace-role-create-step2.PNG)

{{< notice note >}} 

**依赖于**意味着当前授权项依赖列出的授权项，系统会自动选上该依赖项。

{{</ notice >}} 

4. 新创建的角色将在**企业角色**中列出。您可以点击右侧的三个点对其进行编辑。

![编辑角色](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/workspace-role-edit.PNG)

{{< notice note >}} 

本示例中仅为 `workspace-projects-admin` 角色授予了**项目创建**、**项目管理**和**项目查看**权限用作演示。如果您有更多需求，可以按需创建自定义角色。

{{</ notice >}} 

## 邀请新成员

1. 在**企业空间设置**中，转到**企业成员**，再点击**邀请成员**。
2. 邀请一名成员加入企业空间，并为其授予 `workspace-projects-admin` 角色。

![邀请成员](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/workspace-invite-user.PNG)


3. 将成员加入企业空间后，点击**确定**。您可以在**企业成员**列表中查看新邀请的成员。
4. 您也可以编辑现有成员以更改其角色或将其从企业空间中移除。

![编辑成员角色](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/workspace-user-edit.PNG)

