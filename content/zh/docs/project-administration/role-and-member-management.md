---
title: "项目角色和成员管理"
keywords: 'KubeSphere, Kubernetes, 角色, 成员, 管理, 项目'
description: '了解如何进行项目访问管理。'
linkTitle: "项目角色和成员管理"
weight: 13200
---

本教程演示如何在项目中管理角色和成员。在项目级别，您可以向角色授予以下模块中的权限：

- **应用负载**
- **存储管理**
- **配置中心**
- **监控告警**
- **访问控制**
- **项目设置**

## 准备工作

您需要至少创建一个项目（例如 `demo-project`）。此外，您还需要准备一个在项目级别具有 `admin` 角色的用户（例如 `project-admin`）。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)。

## 内置角色

**项目角色**页面列出了以下三个可用的内置角色。创建项目时，KubeSphere 会自动创建内置角色，并且内置角色无法进行编辑或删除。您只能查看内置角色的权限或将其分配给用户。

<table>
  <tr>
    <th width="17%">内置角色</th>
    <th width="83%">描述</th>
  </tr>
  <tr>
    <td><code>viewer</code></td>
    <td>项目观察者，可以查看项目下所有的资源。</td>
  </tr>
   <tr>
     <td><code>operator</code></td>
     <td>项目维护者，可以管理项目下除用户和角色之外的资源。</td>
  </tr>
  <tr>
    <td><code>admin</code></td>
     <td>项目管理员，可以对项目下的所有资源执行所有操作。此角色可以完全控制项目下的所有资源。</td>
  </tr>
</table>

若要查看角色所含权限：

1. 以 `project-admin` 身份登录控制台。在**项目角色**中，点击一个角色（例如，`admin`）以查看角色详情。

2. 点击**授权用户**选项卡，查看所有被授予该角色的用户。

## 创建项目角色

1. 转到**项目设置**下的**项目角色**。

2. 在**项目角色**中，点击**创建**并设置**角色标识符**（例如，`project-monitor`）。点击**编辑权限**继续。

3. 在弹出的窗口中，权限归类在不同的**功能模块**下。在本示例中，为该角色选择**应用负载**中的**应用负载查看**，以及**监控告警**中的**告警消息查看**和**告警策略查看**。点击**确定**完成操作。

    {{< notice note >}}

**依赖于**表示当前授权项依赖所列出的授权项，勾选该权限后系统会自动选上所有依赖权限。

{{</ notice >}}

4. 新创建的角色将在**项目角色**中列出，点击右侧的 <img src="/images/docs/zh-cn/project-administration/role-and-member-management/three-dots.png" height="20px"> 以编辑该角色。


## 邀请新成员

1. 转到**项目设置**下的**项目成员**，点击**邀请**。

2. 点击右侧的 <img src="/images/docs/zh-cn/project-administration/role-and-member-management/add.png" height="20px"> 以邀请一名成员加入项目，并为其分配一个角色。

3. 将成员加入项目后，点击**确定**。您可以在**项目成员**列表中查看新邀请的成员。

4. 若要编辑现有成员的角色或将其从项目中移除，点击右侧的 <img src="/images/docs/zh-cn/project-administration/role-and-member-management/three-dots.png" height="20px"> 并选择对应的操作。

    

