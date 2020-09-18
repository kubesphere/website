---
title: "Role and Member Management"
keywords: 'kubernetes, kubesphere, air gapped, installation'
description: 'Role and Member Management'


weight: 2240
---

This guide demonstrates how to manage roles and members in your DevOps project. For the overview of KubeSphere roles, see the [Overview of Role Management](../todo). 

In DevOps project scope, you can grant the following resources' permissions to a role:

- Pipelines
- Credentials
- DevOps Settings
- Access Control

## Prerequisites

At least one DevOps project has been created, such as `demo-devops`. And you need an account of the `devops-admin` role. See the [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project/) if not yet.

## Built-in roles

In **Project Roles**, there are three available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when creating the DevOps project and they cannot be edited or deleted.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| viewer | Allows viewer access to view all resources in the DevOps project. |
| operator   | Normal member in a DevOps project who can create pipeline credentials in the DevOps project.|
| admin     | Allows admin access to perform any action on any resource. It gives full control over all resources in the DevOps project. |

## Create a DevOps Project Role

1. Log in the console as `devops-admin` and select `demo-devops` under **DevOps Projects** list.
2. Go to **Project Roles** in **Project Management**, click **Create** and set a **Role Identifier**. In this example, a role named `pipeline-creator` will be created.

![Create a devops project role](/images/docs/devops-admin/devops_role_step1.png)

Click **Edit Authorization** to continue.

3. In **Pipelines Management**, select the authorization that you want the user granted this role to have. For example, **Pipelines Management** and **Pipelines View** are selected for this role. Click OK to finish.

![Edit Authorization](/images/docs/devops-admin/devops_role_step2.png)

{{< notice note >}} 

**Depend on** means the major authorization (the one listed after **Depend on**) needs to be selected first so that the affiliated authorization can be assigned.

{{</ notice >}} 

4. Newly-created roles will be listed in **Project Roles**. You can click the three dots on the right to edit it.

![Edit Roles](/images/docs/devops-admin/devops_role_list.png)

{{< notice note >}} 

The role of `pipeline-creator` is only granted with Pipeline create/view permission, which may not satisfy your demand. This example is only for demonstration purpose. You can create customized roles based on your needs.

{{</ notice >}} 

## Invite a New Member

1. In **Project Management**, select **Project Members** and click **Invite Member**.

2. Invite a user to the DevOps project. Grant the role of `pipeline-creator` to the user. 

![invite member](/images/docs/devops-admin/devops_invite_member.png)

{{< notice note >}} 

The user must be invited to the DevOps project's workspace first.

{{</ notice >}} 

3. After you add a user to the DevOps project, click **OK**. In **Project Members**, you can see the newly invited member listed.

4. You can also change the role of an existing member by editing it or remove it from the DevOps project.

![edit member role](/images/docs/devops-admin/devops_user_edit.png)

