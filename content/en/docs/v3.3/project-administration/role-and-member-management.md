---
title: "Project Role and Member Management"
keywords: 'KubeSphere, Kubernetes, role, member, management, project'
description: 'Learn how to manage access control for a project.'
linkTitle: "Project Role and Member Management"
weight: 13200
---

This tutorial demonstrates how to manage roles and members in a project. At the project level, you can grant permissions in the following modules to a role:

- **Application Workloads**
- **Storage**
- **Configurations**
- **Monitoring & Alerting**
- **Access Control**
- **Project Settings**

## Prerequisites

At least one project has been created, such as `demo-project`. Besides, you need a user of the `admin` role (for example, `project-admin`) at the project level. For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

## Built-in Roles

In **Project Roles**, there are three available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when a project is created and they cannot be edited or deleted. You can only view permissions included in a built-in role or assign it to a user.

<table>
  <tr>
    <th width="17%">Built-in Roles</th>
    <th width="83%">Description</th>
  </tr>
  <tr>
    <td><code>viewer</code></td>
    <td>Project viewer who can view all resources in the project.</td>
  </tr>
   <tr>
     <td><code>operator</code></td>
     <td>Project operator who can manage resources other than users and roles in the project.</td>
  </tr>
  <tr>
    <td><code>admin</code></td>
     <td>Project administrator who has full control over all resources in the project.</td>
  </tr>
</table>

To view the permissions that a role contains:

1. Log in to the console as `project-admin`. In **Project Roles**, click a role (for example, `admin`) to view the role details.

2. Click the **Authorized Users** tab to check users that have been granted the role.

## Create a Project Role

1. Navigate to **Project Roles** under **Project Settings**.

2. In **Project Roles**, click **Create** and set a role name (for example, `project-monitor`). Click **Edit Permissions** to continue.

3. In the pop-up window, permissions are categorized into different **Modules**. In this example, select **Application Workload Viewing** in **Application Workloads**, and **Alerting Message Viewing** and **Alerting Policy Viewing** in **Monitoring & Alerting**. Click **OK** to finish creating the role.

    {{< notice note >}}

**Depends on** means the major permission (the one listed after **Depends on**) needs to be selected first so that the affiliated permission can be assigned.

{{</ notice >}}

4. Newly-created roles will be listed in **Project Roles**. To edit an existing role, click <img src="/images/docs/v3.3/project-administration/role-and-member-management/three-dots.png" height="20px" alt="icon"> on the right.

## Invite a New Member

1. Navigate to **Project Members** under **Project Settings**, and click **Invite**.

2. Invite a user to the project by clicking <img src="/images/docs/v3.3/project-administration/role-and-member-management/add.png" height="20px" alt="icon"> on the right of it and assign a role to it.

3. After you add the user to the project, click **OK**. In **Project Members**, you can see the user in the list.

4. To edit the role of an existing user or remove the user from the project, click <img src="/images/docs/v3.3/project-administration/role-and-member-management/three-dots.png" height="20px" alt="icon"> on the right and select the corresponding operation.
