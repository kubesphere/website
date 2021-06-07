---
title: "企业组织"
keywords: 'KubeSphere, Kubernetes, 部门, 角色, 权限, 用户组'
description: '在企业空间中创建部门，将用户分配到不同部门中并授予权限。'
linkTitle: "企业组织"
weight: 9800
---

本文档介绍如何管理企业空间中的部门。

企业空间中的部门是用来管理权限的逻辑单元。您可以在部门中设置企业空间角色、多个项目角色以及多个 DevOps 工程角色，还可以将用户分配到部门中以批量管理用户权限。

## 准备工作

- 您需要[创建一个企业空间和一个帐户](../../quick-start/create-workspace-and-project/)，该帐户需在该企业空间中具有 `workspace-admin` 角色。本文档以 `demo-ws` 企业空间和 `ws-admin` 帐户为例。
- 如需在一个部门中设置项目角色或者 DevOps 工程角色，则需要在该企业空间中[创建至少一个项目或一个 DevOps 工程](../../quick-start/create-workspace-and-project/)。

## 创建部门

1. 以 `ws-admin` 用户登录 KubeSphere Web 控制台并进入 `demo-ws` 企业空间。

2. 在左侧导航栏选择**企业空间设置**下的**企业组织**，点击右侧的**维护组织结构**。

3. 在**维护组织结构**对话框中，设置以下字段，然后点击**确定**创建部门。

   {{< notice note >}}

   * 如果企业空间中已经创建过部门，您可以点击**添加新的子部门**为该企业空间添加更多部门。

   * 您可以在每个部门中创建多个部门和多个子部门。如需创建子部门，在左侧部门树中选择一个部门，然后点击右侧的**添加新的子部门**。

   {{</ notice >}}

   * **部门名称**：为部门设置一个名称。
   * **别名**：为部门设置一个别名。
   * **企业空间角色**：当前企业空间中所有部门成员的角色。
   * **绑定项目角色**：一个项目中所有部门成员的角色。您可以点击**添加项目**来指定多个项目角色。每个项目只能指定一个角色。
   * **绑定 DevOps 工程角色**：一个 DevOps 工程中所有部门成员的角色。您可以点击**添加 DevOps 工程**来指定多个 DevOps 工程角色。每个 DevOps 工程只能指定一个角色。

4. 部门创建完成后，点击**关闭**。在**企业组织**页面，可以在左侧的部门树中看到已创建的部门。

## 分配用户至部门

1. 在**企业组织**页面，选择左侧部门树中的一个部门，点击右侧的**未分配**。

2. 在未分配用户列表中，点击用户右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/department-management/assign.png" height="20px">，对出现的提示消息点击**确定**，以将用户分配到该部门。

   {{< notice note >}}

   * 如果部门提供的权限与用户的现有权限重叠，则会为用户添加新的权限。用户的现有权限不受影响。
   * 分配到某个部门的用户可以根据与该部门关联的企业空间角色、项目角色和 DevOps 工程角色来执行操作，而无需被邀请到企业空间、项目和 DevOps 工程中。

   {{</ notice >}}

## 从部门中移除用户

1. 在**企业组织**页面，选择左侧部门树中的一个部门，然后点击右侧的**已分配**。
2. 在已分配用户列表中，点击用户右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/department-management/remove.png" height="20px">，在出现的对话框中输入相应的用户名，然后点击**确定**来移除用户。

## 删除和编辑部门

1. 在**企业组织**页面，点击**维护组织结构**。

2. 在**维护组织结构**对话框的左侧，点击需要编辑或删除部门的上级部门。

3. 点击部门右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/department-management/edit.png" height="20px"> 进行编辑。

   {{< notice note >}}

   有关详细信息，请参见[创建部门](../../workspace-administration/department-management/#创建部门)。

   {{</ notice >}}

4. 点击部门右侧的 <img src="/images/docs/zh-cn/workspace-administration-and-user-guide/department-management/remove.png" height="20px">，在出现的对话框中输入相应的部门名称，然后点击**确定**来删除该部门。

   {{< notice note >}}

   * 如果删除的部门包含子部门，则子部门也将被删除。
   * 部门删除后，所有部门成员的授权也将被取消。

   {{</ notice >}}