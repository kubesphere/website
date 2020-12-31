---
title: "Role and Member Management"
keywords: "Kubernetes, workspace, KubeSphere, multitenancy"
description: "Role and Member Management in a Workspace"

linkTitle: "Role and Member Management"
weight: 9400
---

This guide demonstrates how to manage roles and members in your workspace. For more information about KubeSphere roles, see Overview of Role Management.

In workspace scope, you can grant the following resources' permissions to a role:

- Projects
- DevOps
- Access Control
- Apps Management
- Workspace Settings

## Prerequisites

At least one workspace has been created, such as `demo-workspace`. Besides, you need an account of the `workspace-admin` role (e.g. `ws-admin`) at the workspace level. See [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/) if they are not ready yet.

{{< notice note >}} 

The actual role name follows a naming convention: `workspace name-role name`. For example, for a workspace named `demo-workspace`, the actual role name of the role `admin` is `demo-workspace-admin`.

{{</ notice >}} 

## Built-in Roles

In **Workspace Roles**, there are four available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when a workspace is created and they cannot be edited or deleted. You can only review permissions and authorized users.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| workspace-viewer | The viewer in the workspace who can view all resources in the workspace. |
| workspace-self-provisioner     | The regular user in the workspace who can create projects and DevOps projects. |
| workspace-regular   | The regular user in the workspace who cannot create projects or DevOps projects. |
| workspace-admin     | The administrator in the workspace who can perform any action on any resource. It gives full control over all resources in the workspace. |

1. In **Workspace Roles** , click  `admin` and you can see the role detail as shown below.

   ![workspace_role_detail](/images/docs/workspace-administration/role-and-member-management/workspace_role_detail.png)

2. You can switch to **Authorized Users** tab to see all the users that are granted the `admin` role.

## Create a Workspace Role

1. Log in to the console as `ws-admin` and go to **Workspace Roles** in **Workspace Settings**.

   {{< notice note >}}

   The account `ws-admin` is used as an example. As long as the account you are using is granted a role including the authorization of **Workspace Members View**, **Workspace Roles Management** and **Workspace Roles View** in **Access Control** at the workspace level, it can create a workspace role.

   {{</ notice >}} 

2. In **Workspace Roles**, click **Create** and set a **Role Identifier**. In this example, a role named `workspace-projects-admin` will be created. Click **Edit Authorization** to continue.

   ![workspace_role_create_step1](/images/docs/workspace-administration/role-and-member-management/workspace_role_create_step1.png)

3. In **Projects management**, select the authorization that you want this role to contain. For example, **Projects Create**, **Projects Management**, and **Projects View** are selected for this role. Click **OK** to finish.

   ![workspace_role_create_step2](/images/docs/workspace-administration/role-and-member-management/workspace_role_create_step2.png)

   {{< notice note >}} 

   **Depend on** means the major authorization (the one listed after **Depend on**) needs to be selected first so that the affiliated authorization can be assigned.

   {{</ notice >}} 

4. Newly-created roles will be listed in **Workspace Roles**. You can click the three dots on the right to edit it.

   ![workspace_role_edit](/images/docs/workspace-administration/role-and-member-management/workspace_role_edit.png)

   {{< notice note >}} 

   The role of `workspace-projects-admin` is only granted **Projects Create**, **Projects Management**, and **Projects View**, which may not satisfy your need. This example is only for demonstration purpose. You can create customized roles based on your needs.

   {{</ notice >}} 

## Invite a New Member

1. In **Workspace Settings**, select **Workspace Members** and click **Invite Member**.

2. Invite a user to the workspace. Grant the role `workspace-projects-admin` to the user. 

   ![workspace_invite_user](/images/docs/workspace-administration/role-and-member-management/workspace_invite_user.png)


3. After you add a user to the workspace, click **OK**. In **Workspace Members**, you can see the newly invited member listed.

4. You can also change the role of an existing member by editing it or remove it from the workspace.

   ![workspace_user_edit](/images/docs/workspace-administration/role-and-member-management/workspace_user_edit.png)

