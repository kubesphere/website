---
title: "角色和成员管理"
keywords: 'KubeSphere, Kubernetes, 角色, 成员, 管理, 项目'
description: '项目中的角色和成员管理'

linkTitle: "角色和成员管理"
weight: 13200
---

本教程演示如何管理项目中的角色和成员。

您可以在项目范围内向角色授予以下资源的权限：

- 应用负载
- 存储
- 配置
- 监控告警
- 项目设置
- 访问控制

## 准备工作

您需要至少创建一个项目（例如 `demo-project`）。 此外，您还需要准备一个在项目层角色为 `admin` 的帐户（例如 `project-admin`）。有关详情请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

## 内置角色

在**项目角色**页面有三个内置角色。内置角色由 KubeSphere 在项目创建时自动创建，不能编辑或删除。您只能查看其权限列表和授权用户列表。

| 内置角色 | 描述                                                |
| ------------------ | ------------------------------------------------------------ |
| viewer | 项目观察者，可以查看项目下所有的资源。 |
| operator   | 项目维护者，可以管理项目下除用户和角色之外的资源。 |
| admin     | 项目管理员，可以对项目下的所有资源执行所有操作。此角色可以完全控制项目下的所有资源。 |

1. 在**项目角色**页面，点击 `admin` 查看该角色的详情，如下图所示：

    ![view role details](/images/docs/zh-cn/project-admin/project_role_detail.png)

2. 您可以点击**授权用户**选项卡查看被授予 `admin` 角色的用户。

## 创建项目角色

1. 以 `project-admin` 用户登录控制台，在**项目管理**页面选择一个项目（例如 `demo-project`）。

    {{< notice note >}}

此处以 `project-admin` 帐户为例。在**访问控制**页面，只要您帐户的角色具有**成员查看**、**角色管理**和**角色查看**权限，该帐户就可用于创建项目角色。

{{</ notice >}}

2. 打开**项目设置**下的**项目角色**页面，点击**创建**，设置**角色标识符**（此处以创建 `project-monitor` 角色为例），点击**编辑权限**进行下一步。

    ![Create a project role](/images/docs/zh-cn/project-admin/project_role_create_step1.png)

3. 选择授予此角色的帐户的权限（例如**应用负载**中的**应用负载查看**，以及**监控告警**中的**告警消息查看**和**告警策略查看**），点击**确定**完成操作。

    ![Edit Authorization](/images/docs/zh-cn/project-admin/project_role_create_step2.png)

    {{< notice note >}}

某些权限**依赖于**其他权限。要选择从属的权限，必须选择其依赖的权限。

    {{</ notice >}}

4. 角色创建后会显示在**项目角色**页面。您可以点击角色右边的三个点对其进行编辑。

    ![Edit Roles](/images/docs/zh-cn/project-admin/project_role_list.png)

    {{< notice note >}}

`project-monitor` 角色在**监控告警**中仅被授予有限的权限，可能无法满足您的需求。此处仅为示例，您可以根据需求创建自定义角色。

{{</ notice >}}

## 邀请成员

1. 选择**项目设置**下的**项目成员**，点击**邀请成员**。
2. 邀请一个用户加入当前项目，对其授予 `project-monitor` 角色。 

    ![invite member](/images/docs/zh-cn/project-admin/project_invite_member_step2.png)

    {{< notice note >}}

要进行此操作，该用户必须先被邀请至当前项目的企业空间。

    {{</ notice >}}

3. 点击**确定**。用户被邀请至当前项目后会显示在**项目成员**页面。

4. 您可以修改现有成员的角色或将其从项目中移除。

    ![edit member role](/images/docs/zh-cn/project-admin/project_user_edit.png)
