---
title: "Role and Member Management"
keywords: "kubernetes, workspace, kubesphere, multitenancy"
description: "Role and Member Management in a Workspace"

linkTitle: "Role and Member Management"
weight: 200
---

This guide demonstrates how to manage roles and members in your workspace. For the overview of KubeSphere roles, see the [Overview of Role Management](../todo). 

In workspace scope, you can grant the following resources' permissions to a role:

- Projects
- DevOps
- Access Control
- Apps Management
- Workspace Settings

## Prerequisites

At least one workspace has been created, such as `demo-workspace`. And you need an account of the `workspace-admin` role. See the [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/) if not yet.

{{< notice note >}} 

The actual role name follows a naming convention: `workspace name-role name`. For example, in this workspace named `demo-workspace`, the actual role name of the role `workspace-admin` is `demo-workspace-admin`.

{{</ notice >}} 

## Built-in roles

In **Workspace Roles**, there are four available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when creating the workspace and they cannot be edited or deleted. You can only review permissions and authorized users.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| workspace-viewer | Allows viewer access to view all resources in the workspace. |
| workspace-self-provisioner     | Regular user in the workspace who can create namespaces and DevOps projects.          |
| workspace-regular   | Regular user in the workspace who cannot create namespaces or DevOps projects. |
| workspace-admin     | Allows admin access to perform any action on any resource. It gives full control over all resources in the workspace. |

1. In **Workspace Roles** , click on the title of `workspace-admin`.

![invite member](/images/docs/ws-admin/workspace_role_detail.png)

2. You can also switch to the **Authorized Users** tab, to see all the users that are granted with a `workspace-admin` role.

## Create a Workspace Role

1. Log in the console as `ws-admin` and go to **Workspace Roles** in **Workspace Settings**.
2. In **Workspace Roles**, click **Create** and set a **Role Identifier**. In this example, a role named `workspace-projects-manager` will be created.

![Create a workspace role](/images/docs/ws-admin/workspace_role_create_step1.png)

Click **Edit Authorization** to continue.

3. In **Projects management**, select the authorization that you want the user granted this role to have. For example, **Projects Create**, **Projects Management**, and **Projects View** are selected for this role. Click **OK** to finish.

![Edit Authorization](/images/docs/ws-admin/workspace_role_create_step2.png)

{{< notice note >}} 

**Depend on** means the major authorization (the one listed after **Depend on**) needs to be selected first so that the affiliated authorization can be assigned.

{{</ notice >}} 

4. Newly-created roles will be listed in **Workspace Roles**. You can click the three dots on the right to edit it.

![Edit Roles](/images/docs/ws-admin/workspace_role_edit.png)

{{< notice note >}} 

The role of `workspace-projects-manager` is only granted with Projects create/view permission, which may not satisfy your demand. This example is only for demonstration purpose. You can create customized roles based on your needs.

{{</ notice >}} 

## Invite a New Member

1. In **Workspace Settings**, select **Workspace Members** and click **Invite Member**.

2. Invite a user to the workspace. Grant the role `workspace-projects-manager` to the user. 

![invite member](/images/docs/ws-admin/workspace_invite_user.png)


3. After you add a user to the workspace, click **OK**. In **Workspace Members**, you can see the newly invited member listed.

4. You can also change the role of an existing member by editing it or remove it from the workspace.

![edit member role](/images/docs/ws-admin/workspace_user_edit.png)

