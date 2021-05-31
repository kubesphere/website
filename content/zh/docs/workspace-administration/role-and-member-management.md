---
title: "企业空间角色和成员管理"
keywords: "Kubernetes, workspace, KubeSphere, 多租户"
description: "自定义企业空间角色并将角色授予用户。"
linkTitle: "企业空间角色和成员管理"
weight: 9400
---

本教程演示如何在企业空间中管理角色和成员。在企业空间级别，您可以向角色授予以下模块中的权限：

- **项目管理**
- **DevOps 工程管理**
- **应用管理**
- **访问控制**
- **企业空间设置**

## 准备工作

至少已创建一个企业空间，例如 `demo-workspace`。您还需要准备一个帐户（如 `ws-admin`），该帐户在企业空间级别具有 `workspace-admin` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

{{< notice note >}} 

实际角色名称的格式：`workspace name-role name`。例如，在名为 `demo-workspace` 的企业空间中，角色 `admin` 的实际角色名称为 `demo-workspace-admin`。

{{</ notice >}} 

## 内置角色

**企业角色**页面列出了以下四个可用的内置角色。创建企业空间时，KubeSphere 会自动创建内置角色，并且内置角色无法进行编辑或删除。您只能查看内置角色的权限或将其分配给用户。

| **内置角色** | **描述信息**                                          |
| ------------------ | ------------------------------------------------------------ |
| `workspace-viewer` | 企业空间的观察者，可以查看企业空间下所有的资源。 |
| `workspace-self-provisioner`   | 企业空间普通成员，可以在企业空间下创建项目和 DevOps 工程。 |
| `workspace-regular` | 企业空间普通成员，无法在企业空间下创建项目和 DevOps 工程。 |
| `workspace-admin`   | 企业空间管理员，可对任何资源进行任意操作。它可以充分管理企业空间下所有的资源。 |

若要查看角色所含权限：

1. 以 `ws-admin` 身份登录控制台。在**企业角色**中，点击一个角色（例如，`workspace-admin`）以查看角色详情。

   ![role-details](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/role-details.png)

2. 点击**授权用户**选项卡，查看被授予该角色的所有用户。

## 创建企业角色

1. 转到**企业空间设置**下的**企业角色**。

2. 在**企业角色**中，点击**创建**并设置**角色标识符**（例如，`demo-project-admin`）。点击**编辑权限**继续。

3. 在弹出的窗口中，权限归类在不同的**模块**下。在本示例中，点击**项目管理**，并为该角色选择**项目创建**、**项目管理**和**项目查看**。点击**确定**完成操作。

   {{< notice note >}} 

**依赖于**表示当前授权项依赖所列出的授权项，勾选该权限后系统会自动选上所有依赖权限。

   {{</ notice >}} 

4. 新创建的角色将在**企业角色**中列出，点击右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/three-dots.png" height="20px"> 以编辑该角色。

   ![role-list](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/role-list.png)

## 邀请新成员

1. 转到**企业空间设置**下**企业成员**，点击**邀请成员**。
2. 点击右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/add.png" height="20px"> 以邀请一名成员加入企业空间，并为其分配一个角色。



3. 将成员加入企业空间后，点击**确定**。您可以在**企业成员**列表中查看新邀请的成员。

4. 若要编辑现有成员的角色或将其从企业空间中移除，点击右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/three-dots.png" height="20px"> 并选择对应的操作。

   ![edit-existing-user](/images/docs/zh-cn/workspace-administration-and-user-guide/role-and-member-management/edit-existing-user.png)
