---
title: "Role and Member Management"
keywords: 'KubeSphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Role and Member Management in a Project'

linkTitle: "Role and Member Management"
weight: 2130
---

This guide demonstrates how to manage roles and members in your project. For the overview of KubeSphere roles, see the [Overview of Role Management](../todo). 

In project scope, you can grant the following resources' permissions to a role:

- Application Workloads
- Storage
- Configurations
- Monitoring & Alerting
- Project Settings
- Access Control

## Prerequisites

At least one project has been created, such as `demo-project`. And you need an account of the `project-admin` role. See the [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/) if not yet.

## Built-in roles

In **Project Roles**, there are three available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when creating the project and they cannot be edited or deleted. You can only review permissions and authorized users.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| viewer | Allows viewer access to view all resources in the namespace. |
| regular   | The maintainer of the project who can manage resources other than users and roles in the project. |
| admin     | Allows admin access to perform any action on any resource. It gives full control over all resources in the namespace. |

1. In **Project Roles** , click on the title of `admin`.

![view role details](/images/docs/project-admin/project_role_detail.png)

2. You can also switch to the **Authorized Users** tab, to see all the users that are granted with an `admin` role.

## Create a Project Role

1. Log in the console as `project-admin` and select `demo-project` under **Projects** list.
2. Go to **Project Roles** in **Project Settings**, click **Create** and set a **Role Identifier**. In this example, a role named `project-monitor` will be created.

![Create a project role](/images/docs/project-admin/project_role_create_step1.png)

Click **Edit Authorization** to continue.

3. Select the authorization that you want the user granted this role to have. For example, **Application Workloads View** in **Application Workloads**, **Alerting Messages View** and **Alerting Policies View** in **Monitoring & Alerting** are selected for this role. Click **OK** to finish.

![Edit Authorization](/images/docs/project-admin/project_role_create_step2.png)

{{< notice note >}} 

**Depend on** means the major authorization (the one listed after **Depend on**) needs to be selected first so that the affiliated authorization can be assigned.

{{</ notice >}} 

4. Newly-created roles will be listed in **Project Roles**. You can click the three dots on the right to edit it.

![Edit Roles](/images/docs/project-admin/project_role_list.png)

{{< notice note >}} 

The role of `project-monitor` is only granted with Monitoring & Alerting view permission, which may not satisfy your demand. This example is only for demonstration purpose. You can create customized roles based on your needs.

{{</ notice >}} 

## Invite a New Member

1. In **Project Settings**, select **Project Members** and click **Invite Member**.

2. Invite a user to the project. Grant the role of `project-monitor` to the user. 

![invite member](/images/docs/project-admin/project_invite_member_step2.png)

{{< notice note >}} 

The user must be invited to the project's workspace first.

{{</ notice >}} 

3. After you add a user to the project, click **OK**. In **Project Members**, you can see the newly invited member listed.

4. You can also change the role of an existing member by editing it or remove it from the project.

![edit member role](/images/docs/project-admin/project_user_edit.png)

