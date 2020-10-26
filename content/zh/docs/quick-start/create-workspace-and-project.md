---
title: "Create Workspace, Project, Account and Role"
keywords: 'KubeSphere, Kubernetes, Multi-tenant, Workspace, Account, Role, Project'
description: 'Create Workspace, Project, Account and Role'

linkTitle: "Create Workspace, Project, Account and Role"
weight: 3030
---


## Objective

This guide demonstrates how to create roles and user accounts which are required for the following tutorials. Meanwhile, you will learn how to create projects and DevOps projects within your workspace where your workloads are running. After this tutorial, you will become familiar with KubeSphere multi-tenant management system.

## Prerequisites

KubeSphere needs to be installed in your machine.

## Estimated Time

About 15 minutes.

## Architecture

The multi-tenant system of KubeSphere features **three** levels of hierarchical structure which are cluster, workspace and project. A project in KubeSphere is a Kubernetes namespace.

You can create multiple workspaces within a Kubernetes cluster. Under each workspace, you can also create multiple projects.

Each level has multiple built-in roles. Besides, KubeSphere allows you to create roles with customized authorization as well. The KubeSphere hierarchy is applicable for enterprise users with different teams or groups, and different roles within each team.

## Hands-on Lab

### Task 1: Create an Account

After KubeSphere is installed, you need to add different users with varied roles to the platform so that they can work at different levels on various resources. Initially, you only have one default account, which is admin, granted the role `platform-admin`. In the first task, you will create an account `user-manager` and further create more accounts as `user-manager`.

1. Log in the web console as `admin` with the default account and password (`admin/P@88w0rd`).

{{< notice tip >}}

For account security, it is highly recommended that you change your password the first time you log in the console. To change your password, select **User Settings** in the drop-down menu in the top-right corner. In **Password Setting**, set a new password.

{{</ notice >}}

2. After you log in the console, click **Platform** in the top-left corner and select **Access Control**.

   ![access-control](https://ap3.qingstor.com/kubesphere-website/docs/access-control.png)

In **Account Roles**, there are four available built-in roles as shown below. The account to be created next will be assigned the role `users-manager`.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| workspaces-manager | Workspace manager in the platform who manages all workspaces in the platform. |
| users-manager      | User manager in the platform who manages all users.          |
| platform-regular   | Normal user in the platform who has no access to any resources before joining a workspace or cluster. |
| platform-admin     | Platform administrator who can manage all resources in the platform. |

{{< notice note >}}

Built-in roles are created automatically by KubeSphere and cannot be edited or deleted.

{{</ notice >}} 

3. In **Accounts**, click **Create**. In the pop-up window, provide all the necessary information (marked with *) and select `users-manager`  for **Role**. Refer to the image below as an example.

![create-account](https://ap3.qingstor.com/kubesphere-website/docs/create-account.jpg)

Click **OK** after you finish. A newly-created account will display in the account list in **Accounts**.

4. Log out of the console and log back in with the account `user-manager` to create four accounts that will be used in the following tutorials.

{{< notice tip >}} 

To log out, click your username in the top-right corner and select **Log Out**.

{{</ notice >}}

For detailed information about the four accounts you need to create, refer to the table below.

| Account         | Role               | Description                                                  |
| --------------- | ------------------ | ------------------------------------------------------------ |
| ws-manager      | workspaces-manager | Create and manage all workspaces.                            |
| ws-admin        | platform-regular   | Manage all resources in a specified workspace (This account is used to invite new members to a workspace in this example). |
| project-admin   | platform-regular   | Create and manage projects and DevOps projects, and invite new members into the projects. |
| project-regular | platform-regular   | `project-regular` will be invited to a project or DevOps project by `project-admin`. This account will be used to create workloads, pipelines and other resources in a specified project. |

5. Verify the four accounts created.

![account-list](https://ap3.qingstor.com/kubesphere-website/docs/account-list.png)

### Task 2: Create a Workspace

In this task, you need to create a workspace using the account `ws-manager` created in the previous task. As the basic logic unit for the management of projects, DevOps projects and organization members, workspaces underpin multi-tenant system of KubeSphere.

1. Log in KubeSphere as `ws-manager` which has the authorization to manage all workspaces on the platform. Click **Platform** in the top-left corner. In **Workspaces**, you can see there is only one default workspace **system-workspace** listed, where system-related components and services run. You are not allowed to delete this workspace.

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.jpg)

2. Click **Create** on the right, name the new workspace `demo-workspace` and set the user `ws-admin` as the workspace manager shown in the screenshot below:

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.png)

Click **Create** after you finish.

3. Log out of the console and log back in as `ws-admin`. In **Workspace Settings**, select **Workspace Members** and click **Invite Member**.

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827111048.png)

4. Invite both `project-admin` and `project-regular` to the workspace. Grant them the role `workspace-self-provisioner` and `workspace-viewer` respectively. 

{{< notice note >}} 

The actual role name follows a naming convention: `workspace name-role name`. For example, in this workspace named `demo`, the actual role name of the role `workspace-viewer` is `demo-workspace-viewer`.

{{</ notice >}} 

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827113124.png)

5. After you add both `project-admin` and `project-regular` to the workspace, click **OK**. In **Workspace Members**, you can see three members listed.

| Account         | Role                       | Description                                                  |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| ws-admin        | workspace-admin            | Manage all resources under the workspace (We use this account to invite new members to the workspace). |
| project-admin   | workspace-self-provisioner | Create and manage projects and DevOps projects, and invite new members to join the projects. |
| project-regular | workspace-viewer           | `project-regular` will be invited by `project-admin` to join a project or DevOps project. The account can be used to create workloads, pipelines, etc. |

### Task 3: Create a Project

In this task, you need to create a project using the account `project-admin` created in the previous task. A project in KubeSphere is the same as a namespace in Kubernetes, which provides virtual isolation for resources. For more information, see [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).

1. Log in KubeSphere as `project-admin`. In **Projects**, click **Create**.

![kubesphere-projects](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-projects.png)

2. Enter the project name (e.g. `demo-project`) and click **OK** to finish. You can also add an alias and description for the project.

![demo-project](https://ap3.qingstor.com/kubesphere-website/docs/demo-project.png)

3. In **Projects**, click the project created just now to view its detailed information.

![click-demo-project](https://ap3.qingstor.com/kubesphere-website/docs/click-demo-project.png)

4. In the overview page of the project, the project quota remains unset by default. You can click **Set** and specify resource requests and limits based on your needs (e.g. 1 core for CPU and 1000Gi for memory).

![project-overview](https://ap3.qingstor.com/kubesphere-website/docs/quota.png)

![set-quota](https://ap3.qingstor.com/kubesphere-website/docs/20200827134613.png)

5. Invite `project-regular` to this project and grant this user the role `operator`. Please refer to the image below for specific steps.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200827135424.png)

{{< notice info >}}

The user granted the role `operator` will be a project maintainer who can manage resources other than users and roles in the project.

{{</ notice >}}

#### Set Gateway

Before creating a route, you need to enable a gateway for this project. The gateway is an [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) running in the project.

{{< notice info >}}

A route refers to Ingress in Kubernetes, which is an API object that manages external access to the services in a cluster, typically HTTP.

{{</ notice >}}

6. To set a gateway, go to **Advanced Settings** in **Project Settings** and click **Set Gateway**. The account `project-admin` is still used in this step.

![set-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200827141823.png)

7. Choose the access method **NodePort** and click **Save**.

![nodeport](https://ap3.qingstor.com/kubesphere-website/docs/20200827141958.png)

8. Under **Internet Access**, it can be seen that the Gateway Address and the NodePort of http and https all display in the page.

{{< notice note >}}

If you want to expose services using the type `LoadBalancer`, you need to use the [LoadBalancer plugin of cloud providers](https://kubernetes.io/zh/docs/concepts/cluster-administration/cloud-providers/). If your Kubernetes cluster is running in a bare metal environment, it is recommended you use [Porter](https://github.com/kubesphere/porter) as the LoadBalancer plugin.

{{</ notice >}} 

![NodePort-setting-done](https://ap3.qingstor.com/kubesphere-website/docs/20200827142411.png)

### 任务 4: 创建角色

完成上述任务后，您将知道可以为用户授予不同级别的不同角色。先前任务中使用的角色都是 Ku​​beSphere 本身创建的内置角色。在此任务中，您将学习如何自己定义角色以满足工作需求。

1. 再次以`admin`账户登录控制台并转到 **访问控制** 。
2. 在 **账户角色** 中，列出了四个无法被删除和修改的系统角色。点击 **创建** 和设置 **角色标识符**。在此示例中，将创建名为 `roles-manager` 的角色。

![create-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827153339.png)

{{< notice 注意 >}}

建议您输入角色说明来声明角色的用途。此处创建的角色将仅负责角色管理，包括添加和删除角色。

{{</ notice >}} 

点击 **编辑权限** 继续。

3. 在 **访问控制** 中，选择您希望被授予了该角色的用户所拥有的权限。例如，为此角色选择 **账户查看**，**角色管理**，**角色查看**。点击 **确定** 完成创建。

![edit-authorization](https://ap3.qingstor.com/kubesphere-website/docs/20200827153651.png)

{{< notice 注意 >}} 

**依赖于** 是指需要先选择主要授权（**依赖于** 之后列出的授权），以便可以分配关联授权。

{{</ notice >}} 

4. 新创建的角色将列在 **账户角色** 中。你可以点击右侧的三个点来编辑它。

![roles-manager](https://ap3.qingstor.com/kubesphere-website/docs/20200827154723.png)

5. 在 **账户管理** 中，你可以添加一个新的账户并授予角色 `roles-manager` ，或者通过编辑将现有账户的角色更改为 `roles-manager` 。

![edit-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827155205.png)

{{< notice 注意 >}} 

The role of `roles-manager` overlaps with `users-manager` while the latter is also capable of user management. This example is only for demonstration purpose. You can create customized roles based on your needs.

{{</ notice >}} 

### Task 5: Create a DevOps Project (Optional)

{{< notice note >}}

To create a DevOps project, you need to install KubeSphere DevOps system in advance, which is a pluggable component providing CI/CD pipelines, Binary-to-image, Source-to-image features, and more. For more information about how to enable DevOps, see [KubeSphere DevOps System](../../pluggable-components/devops/).

{{</ notice >}} 

1. Log in the console as `project-admin` for this task. In **DevOps Projects**, click **Create**.

![devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827145521.png)

2. Enter the DevOps project name (e.g. `demo-devops`) and click **OK**. You can also add an alias and description for the project.

![devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827145755.png)

3. In **DevOps Projects**, click the project created just now to view its detailed information.

![new-devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827150523.png)

4. Go to **Project Management** and select **Project Members**. Click **Invite Member** to grant `project-regular` the role of `operator`, who is allowed to create pipelines and credentials.

![devops-invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827150704.png)

Congratulations! You are now familiar with the multi-tenant management system of KubeSphere. In the next several tutorials, the account `project-regular` will also be used to demonstrate how to create applications and resources in a project or DevOps project.
