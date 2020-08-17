---
title: "Getting Started with Multi-tenant Management"
keywords: 'kubesphere, kubernetes, docker, multi-tenant'
description: 'The guide to get familiar with KubeSphere multi-tenant management'

linkTitle: "1"
weight: 3010
---


## Objective

This is the first lab exercise of KubeSphere. We strongly suggest you to learn it with your hands. This guide shows how to create workspace, role and user account which are required for next lab exercises. Moreover, you will learn how to create project and DevOps project within your workspace where is the place your workloads are running. After this lab, you will get familiar with KubeSphere multi-tenant management system.

## Prerequisites

You need to have a KubeSphere installed.

## Estimated Time

About 15 minutes

## Architecture

KubeSphere system is organized into **three** hierarchical structures of tenants which are cluster, workspace and project. Here a project is a Kubernetes namespace.

As shown below, you can create multiple workspaces within a Kubernetes cluster. Under each workspace you can also create multiple projects.

For each level, there are multiple built-in roles. and it allows you to create role with customized authorization as well. This hierarchy list is appropriate for enterprise users who have different teams or groups, and different roles within each team.

![Architecture](https://pek3b.qingstor.com/kubesphere-docs/png/20200105121616.png)

## Hands-on Lab

### Task 1: Create Roles and Accounts

The first task is going to create an account and a role, and assign the role to the user. This task must be done using the built-in user `admin` with the role `cluster-admin`.

There are three built-in roles in the cluster level as shown below.

| Built-in Roles | Description |
| --- | --- |
| cluster-admin | It has the privilege to manage any resources in the cluster. |
| workspaces-manager | It is able to manage workspaces including creating, deleting and managing the users of a workspace. |
| cluster-regular | Regular users have no authorization to manage resources before being invited to a workspaces. The access right is decided by the assigned role to the specific workspace or project.|

Here is an example showing you how to create a new role named `users-manager`, grant **account management** and **role management** capabilities to the role, then create a new account named `user-manager` and grant it the users-manager role.

| Account Name | Cluster Role | Responsibility |
| --- | --- | --- |
| user-manager | users-manager | Manage cluster accounts and roles |

1.1 Log in with the built-in user `admin`, click **Platform → Platform Roles**. You can see the role list as follows. Click **Create** to create a role which is used to manage all accounts and roles.

![Roles](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112614.png#align=left&display=inline&height=998&originHeight=998&originWidth=2822&search=&status=done&width=2822)

1.2. Fill in the basic information and authorization settings of the role.

- Name: `users-manager`
- Description: Describe the role's responsibilities, here we type `Manage accounts and roles`


1.3. Check all the access rights on the options of `Account Management` and `Role Management`; then click **Create**.

![Authorization Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200305172551.png)

1.4. Click **Platform → Accounts**. You can see the account list in the current cluster. Then click **Create**.

![Account List](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112945.png#align=left&display=inline&height=822&originHeight=822&originWidth=2834&search=&status=done&width=2834)

1.5. Fill in the new user's basic information. Set the username as `user-manager`; select the role `users-manager` and fill other items as required. Then click **OK** to create this account.

![Create Account](https://pek3b.qingstor.com/kubesphere-docs/png/20200105152641.png)

1.6. Then log out and log in with the user `user-manager` to create four accounts that are going to be used in next lab exercises. Once login, enter **Platform → Accounts**, then create the four accounts in the following table.

| Account Name | Cluster Role | Responsibility |
| --- | --- | --- |
| ws-manager | workspaces-manager | Create and manage all workspaces |
| ws-admin | cluster-regular | Manage all resources under a specific workspace  (This example is used to invite new members to join a workspace.) |
| project-admin | cluster-regular | Create and manage projects, DevOps projects and invite new members into the projects |
| project-regular | cluster-regular | The regular user will be invited to the project and DevOps project by the project-admin. We use this account to create workloads, pipelines and other resources under the specified project. |

1.7. Verify the four accounts that we have created.

![Verify Accounts](https://pek3b.qingstor.com/kubesphere-docs/png/20190716114245.png#align=left&display=inline&height=1494&originHeight=1494&originWidth=2794&search=&status=done&width=2794)

### Task 2: Create a Workspace

The second task is going to create a workspace using the user `ws-manager` created in the previous task. As we know, it is a workspace admin.

Workspace is the base for KubeSphere multi-tenant management. It is also the basic logic unit for projects, DevOps projects and organization members.

2.1. Log in KubeSphere with `ws-manager` which has the authorization to manage all workspaces on the platform.

Click **Platform → Workspace** on the left top corner. You can see there is only one default workspace **system-workspace** listed in the page, which is for running system related components and services. You are not allowed to delete this workspace.

Click **Create** in the workspace list page, name the new workspace `demo-workspace` and assign the user `ws-admin` as the workspace admin as the screenshot shown below:

![Workspace List](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130007.png#align=left&display=inline&height=736&originHeight=736&originWidth=1804&search=&status=done&width=1804)

2.2. Logout and sign in with `ws-admin` after `demo-workspace` is created. Then click **View Workspace**, select **Workspace Settings → Workspace Members** and click **Invite Member**.

![Invite Members](https://pek3b.qingstor.com/kubesphere-docs/png/20200105155226.png)

2.3. Invite both `project-admin` and `project-regular` and grant them `workspace-regular` accordingly, click **OK** to save it. Now there are three members in the `demo-workspace`.

| User Name | Role in the Workspace | Responsibility |
| --- | --- | --- |
| ws-admin | workspace-admin | Manage all resources under the workspace (We use this account to invite new members into the workspace). |
| project-admin | workspace-regular | Create and manage projects, DevOps projects, and invite new members to join. |
| project-regular | workspace-viewer | Will be invited by project-admin to join the project and DevOps project. We use this account to create workloads, pipelines, etc. |

![Workspace Members](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130517.png#align=left&display=inline&height=1146&originHeight=1146&originWidth=1318&search=&status=done&width=1318)

### Task 3: Create a Project

This task is going to show how to create a project and some related operations in the project using Project Admin.

3.1. Sign in with `project-admin` created in the first task, then click **Create** and select **Create a resource project**.

![Project List](https://pek3b.qingstor.com/kubesphere-docs/png/20190716131852.png#align=left&display=inline&height=1322&originHeight=1322&originWidth=2810&search=&status=done&width=2810)

3.2. Name it `demo-project`, then set the CPU limit to 1 Core and memory limit to 1000 Mi in the Advanced Settings, then click **Create**.

3.3. Choose **Project Settings → Project Members** and click **Invite Member**.

![Invite Project Members](https://pek3b.qingstor.com/kubesphere-docs/png/20200105160247.png)

3.4. Invite `project-regular` to this project and grant this user the role **operator**.

![Built-in Projects Roles](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132840.png#align=left&display=inline&height=1038&originHeight=1038&originWidth=1646&search=&status=done&width=1646)

![Project Roles](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132920.png#align=left&display=inline&height=518&originHeight=518&originWidth=2288&search=&status=done&width=2288)

#### Set Gateway

Before creating a route which is the Kubernetes Ingress, you need to enable a gateway for this project. The gateway is an [Nginx ingress controller](https://github.com/kubernetes/ingress-nginx) running in the project.

3.5. We continue to use `project-admin`. Choose **Project Settings → Advanced Settings** and click **Set Gateway**.

![Gateway Page](https://pek3b.qingstor.com/kubesphere-docs/png/20200105161214.png)

3.6. Choose the access method **NodePort** and click **Save**.

![Set Gateway](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134742.png#align=left&display=inline&height=946&originHeight=946&originWidth=2030&search=&status=done&width=2030)

3.7. Now we are able to see the Gateway Address, the NodePort of http and https appeared in the page.

> Note: If you want to expose services using LoadBalancer type, you need to use the [LoadBalancer plugin of cloud provider](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/). If your Kubernetes cluster is running on bare metal environment, we recommend you to use [Porter](https://github.com/kubesphere/porter) as the LoadBalancer plugin.

![NodePort Gateway](https://pek3b.qingstor.com/kubesphere-docs/png/20200105161335.png)

### Task 4: Create DevOps Project (Optional)

> Prerequisite: You need to install [KubeSphere DevOps system](../../installation/install-devops), which is a pluggable component providing CI/CD pipeline, Binary-to-image and Source-to-image features.

4.1. We still use the account `project-admin` to demonstrate this task. Click **Workbench** and click **Create** button, then select **Create a DevOps project**.

![Workbench](https://pek3b.qingstor.com/kubesphere-docs/png/20200105162512.png)

4.2. Fill in the basic information, e.g. name it `demo-devops`, then click **Create** button. It will take a while to initialize before switching to `demo-devops` page.

![demo-devops](https://pek3b.qingstor.com/kubesphere-docs/png/20200105162623.png)

4.3. Similarly, navigate to **Project Management → Project Members**, then click **Invite Member** and grant `project-regular` the role of `maintainer`, which is allowed to create pipeline, credentials, etc.

![Invite DevOps member](https://pek3b.qingstor.com/kubesphere-docs/png/20200105162710.png)

Congratulations! You've been familiar with KubeSphere multi-tenant management mechanism. In the next few tutorials, we will use the account `project-regular` to demonstrate how to create applications and resources under the project and the DevOps project.
