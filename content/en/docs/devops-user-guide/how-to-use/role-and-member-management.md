---
title: "Role and Member Management"
keywords: 'Kubernetes, KubeSphere, DevOps, role, member'
description: 'Role and Member Management'

weight: 600
---

This guide demonstrates how to manage roles and members in your DevOps project. For more information about KubeSphere roles, see Overview of Role Management.

In DevOps project scope, you can grant the following resources' permissions to a role:

- Pipelines
- Credentials
- DevOps Settings
- Access Control

## Prerequisites

At least one DevOps project has been created, such as `demo-devops`. Besides, you need an account of the `admin` role (e.g. `devops-admin`) at the DevOps project level. 

## Built-in Roles

In **Project Roles**, there are three available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when a DevOps project is created and they cannot be edited or deleted.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| viewer | The viewer who can view all resources in the DevOps project. |
| operator   | The normal member in a DevOps project who can create pipelines and credentials in the DevOps project. |
| admin     | The administrator in the DevOps project who can perform any action on any resource. It gives full control over all resources in the DevOps project. |

## Create a DevOps Project Role

1. Log in the console as `devops-admin` and select a DevOps project (e.g. `demo-devops`) under **DevOps Projects** list.

{{< notice note >}}

The account `devops-admin` is used as an example. As long as the account you are using is granted a role including the authorization of **Project Members View**, **Project Roles Management** and **Project Roles View** in **Access Control** at DevOps project level, it can create a DevOps project role.

{{</ notice >}} 

2. Go to **Project Roles** in **Project Management**, click **Create** and set a **Role Identifier**. In this example, a role named `pipeline-creator` will be created. Click **Edit Authorization** to continue.

![Create a devops project role](/images/docs/devops-admin/devops_role_step1.png)

3. In **Pipelines Management**, select the authorization that you want the user granted this role to have. For example, **Pipelines Management** and **Pipelines View** are selected for this role. Click **OK** to finish.

![Edit Authorization](/images/docs/devops-admin/devops_role_step2.png)

{{< notice note >}} 

**Depend on** means the major authorization (the one listed after **Depend on**) needs to be selected first so that the affiliated authorization can be assigned.

{{</ notice >}} 

4. Newly-created roles will be listed in **Project Roles**. You can click the three dots on the right to edit it.

![Edit Roles](/images/docs/devops-admin/devops_role_list.png)

{{< notice note >}} 

The role of `pipeline-creator` is only granted **Pipelines Management** and **Pipelines View**, which may not satisfy your need. This example is only for demonstration purpose. You can create customized roles based on your needs.

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

