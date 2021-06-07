---
title: "Workspace Role and Member Management"
keywords: "Kubernetes, workspace, KubeSphere, multitenancy"
description: "Customize a workspace role and grant it to tenants."
linkTitle: "Workspace Role and Member Management"
weight: 9400
---

This tutorial demonstrates how to manage roles and members in a workspace. At the workspace level, you can grant permissions in the following modules to a role:

- **Project Management**
- **DevOps Project Management**
- **App Management**
- **Access Control**
- **Workspace Settings**

## Prerequisites

At least one workspace has been created, such as `demo-workspace`. Besides, you need an account of the `workspace-admin` role (for example, `ws-admin`) at the workspace level. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../quick-start/create-workspace-and-project/).

{{< notice note >}} 

The actual role name follows a naming convention: `workspace name-role name`. For example, for a workspace named `demo-workspace`, the actual role name of the role `admin` is `demo-workspace-admin`.

{{</ notice >}} 

## Built-in Roles

In **Workspace Roles**, there are four available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when a workspace is created and they cannot be edited or deleted. You can only view permissions included in a built-in role or assign it to a user.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `workspace-viewer` | The viewer in the workspace who can view all resources in the workspace. |
| `workspace-self-provisioner`   | The regular user in the workspace who can create projects and DevOps projects. |
| `workspace-regular` | The regular user in the workspace who cannot create projects or DevOps projects. |
| `workspace-admin`   | The administrator in the workspace who can perform any action on any resource. It gives full control over all resources in the workspace. |

To view the permissions that a role contains:

1. Log in to the console as `ws-admin`. In **Workspace Roles**, click a role (for example, `workspace-admin`) and you can see role details as shown below.

   ![role-permissions](/images/docs/workspace-administration/role-and-member-management/role-permissions.png)

2. Click the **Authorized Users** tab to see all the users that are granted the role.

## Create a Workspace Role

1. Navigate to **Workspace Roles** under **Workspace Settings**.

2. In **Workspace Roles**, click **Create** and set a role **Name** (for example, `demo-project-admin`). Click **Edit Permissions** to continue.

3. In the pop-up window, permissions are categorized into different **Modules**. In this example, click **Project Management** and select **Project Creation**, **Project Management**, and **Project Viewing** for this role. Click **OK** to finish creating the role.

   {{< notice note >}} 

   **Depends on** means the major permission (the one listed after **Depends on**) needs to be selected first so that the affiliated permission can be assigned.

   {{</ notice >}} 

4. Newly-created roles will be listed in **Workspace Roles**. To edit an existing role, click <img src="/images/docs/workspace-administration/role-and-member-management/three-dots.png" height="20px"> on the right.

   ![role-list](/images/docs/workspace-administration/role-and-member-management/role-list.png)

## Invite a New Member

1. Navigate to **Workspace Members** under **Workspace Settings**, and click **Invite Member**.
2. Invite a user to the workspace by clicking <img src="/images/docs/workspace-administration/role-and-member-management/add.png" height="20px"> on the right of it and assign a role to it.



3. After you add the user to the workspace, click **OK**. In **Workspace Members**, you can see the user in the list.

4. To edit the role of an existing user or remove the user from the workspace, click <img src="/images/docs/workspace-administration/role-and-member-management/three-dots.png" height="20px"> on the right and select the corresponding operation.

   ![edit-existing-user](/images/docs/workspace-administration/role-and-member-management/edit-existing-user.png)

