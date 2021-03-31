---
title: "Role and Member Management In Your Project"
keywords: 'KubeSphere, Kubernetes, role, member, management, project'
description: 'Role and Member Management in a Project'

linkTitle: "Role and Member Management"
weight: 13200
---

This guide demonstrates how to manage roles and members in your project. For more information about KubeSphere roles, see Overview of Role Management.

In project scope, you can grant the following resources' permissions to a role:

- Application Workloads
- Storage
- Configurations
- Monitoring & Alerting
- Project Settings
- Access Control

## Prerequisites

At least one project has been created, such as `demo-project`. Besides, you need an account of the `admin` role (e.g. `project-admin`) at the project level. See [Create Workspaces, Projects, Accounts and Roles](../../quick-start/create-workspace-and-project/) if it is not ready yet.

## Built-in Roles

In **Project Roles**, there are three available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when a project is created and they cannot be edited or deleted. You can only view permissions and authorized user list.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| viewer | The viewer who can view all resources in the project. |
| operator   | The maintainer of the project who can manage resources other than users and roles in the project. |
| admin     | The administrator in the project who can perform any action on any resource. It gives full control over all resources in the project. |

1. In **Project Roles**, click `admin` and you can see the role detail as shown below.

    ![view role details](/images/docs/project-admin/project_role_detail.png)

2. You can switch to **Authorized Users** tab to see all the users that are granted an `admin` role.

## Create a Project Role

1. Log in to the console as `project-admin` and select a project (e.g. `demo-project`) under **Projects** list.

    {{< notice note >}}

The account `project-admin` is used as an example. As long as the account you are using is granted a role including the authorization of **Project Members View**, **Project Roles Management** and **Project Roles View** in **Access Control** at project level, it can create a project role.

    {{</ notice >}}

2. Go to **Project Roles** in **Project Settings**, click **Create** and set a **Role Identifier**. In this example, a role named `project-monitor` will be created. Click **Edit Authorization** to continue.

    ![Create a project role](/images/docs/project-admin/project_role_create_step1.png)

3. Select the authorization that you want this role to contain. For example, **Application Workloads View** in **Application Workloads**, and **Alerting Messages View** and **Alerting Policies View** in **Monitoring & Alerting** are selected for this role. Click **OK** to finish.

    ![Edit Authorization](/images/docs/project-admin/project_role_create_step2.png)

    {{< notice note >}}

**Depend on** means the major authorization (the one listed after **Depend on**) needs to be selected first so that the affiliated authorization can be assigned.

    {{</ notice >}}

4. Newly-created roles will be listed in **Project Roles**. You can click the three dots on the right to edit it.

    ![Edit Roles](/images/docs/project-admin/project_role_list.png)

    {{< notice note >}}

The role of `project-monitor` is only granted limited permissions in **Monitoring & Alerting**, which may not satisfy your need. This example is only for demonstration purpose. You can create customized roles based on your needs.

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
