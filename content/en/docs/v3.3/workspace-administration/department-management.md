---
title: "Department Management"
keywords: 'KubeSphere, Kubernetes, Department, Role, Permission, Group'
description: 'Create departments in a workspace and assign users to different departments to implement permission control.'
linkTitle: "Department Management"
weight: 9800
---

This document describes how to manage workspace departments.

A department in a workspace is a logical unit used for permission control. You can set a workspace role, multiple project roles, and multiple DevOps project roles in a department, and assign users to the department to control user permissions in batches. 

## Prerequisites

- You need to [create a workspace and a user](../../quick-start/create-workspace-and-project/) assigned the `workspace-admin` role in the workspace. This document uses the `demo-ws` workspace and the `ws-admin` account as an example.
- To set project roles or DevOps project roles in a department, you need to [create at least one project or DevOps project](../../quick-start/create-workspace-and-project/) in the workspace.

## Create a Department

1. Log in to the KubeSphere web console as `ws-admin` and go to the `demo-ws` workspace.

2. On the left navigation bar, choose **Departments** under **Workspace Settings**, and click **Set Departments** on the right.

3. In the **Set Departments** dialog box, set the following parameters and click **OK** to create a department.

   {{< notice note >}}

   * If a department has already been created in the workspace, you can click **Create Department** to add more departments to the workspace.
   * You can create multiple departments and multiple sub-departments in each department. To create a subdepartment, select a department on the left department tree and click **Create Department** on the right.

   {{</ notice >}}

   * **Name**: Name of the department.
   * **Alias**: Alias of the department.
   * **Workspace Role**: Role of all department members in the current workspace.
   * **Project Role**: Role of all department members in a project. You can click **Add Project** to specify multiple project roles. Only one role can be specified for each project.
   * **DevOps Project Role**: Role of all department members in a DevOps project. You can click **Add DevOps Project** to specify multiple DevOps project roles. Only one role can be specified for each DevOps project.

4. Click **OK** after the department is created, and then click **Close**. On the **Departments** page, the created department is displayed in a department tree on the left.

## Assign a User to a Department

1. On the **Departments** page, select a department in the department tree on the left and click **Not Assigned** on the right.

2. In the user list, click <img src="/images/docs/v3.3/workspace-administration/department-management/assign.png" height="20px"> on the right of a user, and click **OK** for the displayed message to assign the user to the department.

   {{< notice note >}}

   * If permissions provided by the department overlap with existing permissions of the user, new permissions are added to the user. Existing permissions of the user are not affected.
   * Users assigned to a department can perform operations according to the workspace role, project roles, and DevOps project roles associated with the department without being invited to the workspace, projects, and DevOps projects.

   {{</ notice >}}

## Remove a User from a Department

1. On the **Departments** page, select a department in the department tree on the left and click **Assigned** on the right.
2. In the assigned user list, click <img src="/images/docs/v3.3/workspace-administration/department-management/remove.png" height="20px"> on the right of a user, enter the username in the displayed dialog box, and click **OK** to remove the user.

## Delete and Edit a Department

1. On the **Departments** page, click **Set Departments**.

2. In the **Set Departments** dialog box, on the left, click the upper level of the department to be edited or deleted.

3. Click <img src="/images/docs/v3.3/workspace-administration/department-management/edit.png" height="20px"> on the right of the department to edit it.

   {{< notice note >}}

   For details, see [Create a Department](#create-a-department).

   {{</ notice >}}

4. Click <img src="/images/docs/v3.3/workspace-administration/department-management/remove.png" height="20px"> on the right of the department, enter the department name in the displayed dialog box, and click **OK** to delete the department.

   {{< notice note >}}

   * If a department contains sub-departments, the sub-departments will also be deleted.
   * After a department is deleted, the associated roles will be unbound from the users.

   {{</ notice >}}