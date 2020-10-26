---
title: "创建工作空间，项目，账户和角色"
keywords: 'KubeSphere，Kubernetes，多租户，Workspace，Account，Role，Project'
description: '创建工作空间，项目，账户和角色'

linkTitle: "创建工作空间，项目，账户和角色"
weight: 3030
---


## 目标

本指南演示了如何创建后续教程需要的角色和用户帐户。同时，您将会学习如何在运行工作负载的工作空间中创建普通项目和 DevOps 项目。通过这个教程，您将会熟悉 KubeSphere 的多租户管理系统。

## 前置条件

需要您已经完成安装 KubeSphere。

## 预计时间

15 分钟左右。

## Architecture

The multi-tenant system of KubeSphere features **three** levels of hierarchical structure which are cluster, workspace and project. A project in KubeSphere is a Kubernetes namespace.

You can create multiple workspaces within a Kubernetes cluster. Under each workspace, you can also create multiple projects.

Each level has multiple built-in roles. Besides, KubeSphere allows you to create roles with customized authorization as well. The KubeSphere hierarchy is applicable for enterprise users with different teams or groups, and different roles within each team.

## 动手实验

### 任务 1: 创建账户

完成 KubeSphere 安装后，您需要向平台添加具有不同角色的不同用户，以便他们可以在各种资源上以不同级别工作。最开始您只有一个默认账户，即 admin ，授权为 `platform-admin` 角色。在第一个任务中，您将会创建一个账户 `user-manager`，并进一步创建更多账户作为 `user-manager`。

1. 使用默认账户和密码 （`admin/P@88w0rd`）以 admin 身份登录 web 控制台。

{{< notice 提示 >}}

为保证账户安全，强烈建议您在首次登录控制台时更改密码。您可在页面右上角的下拉菜单中选择 **个人设置** ，然后选择 **密码设置** 并重置密码。

{{</ notice >}}

2. 登录控制台后，点击左上角的 **平台管理** 并选择 **访问控制** 。

   ![access-control](https://ap3.qingstor.com/kubesphere-website/docs/access-control.png)

在 **账户角色** 中有如下所示四个内置角色。接下来创建的账户会被分配为 **users-manager** 角色。

| 内置角色     | 描述                                                  |
| ------------------ | ------------------------------------------------------------ |
| workspaces-manager | 平台企业空间管理员，管理平台所有企业空间。 |
| users-manager      | 平台用户管理员，管理平台所有用户。          |
| platform-regular   | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |
| platform-admin     | 平台管理员，可以管理平台内的所有资源。 |

{{< notice 注意 >}}

内置角色由 KubeSphere 自动创建，无法编辑或删除。

{{</ notice >}} 

3. 选择 **账户管理** ，点击 **创建** 。在弹出窗口中提交所有必需信息（带有 * 标记），并选择角色为 `users-manager` 。参考下图示例。

![create-account](https://ap3.qingstor.com/kubesphere-website/docs/create-account.jpg)

完成后单击 **确定** 。新创建的账户会出现在 **账户管理** 页面的账户列表里面。

4. 登出控制台并使用 `user-manager` 账户登录，创建四个账户留待后续教程中使用。

{{< notice 提示 >}} 

点击右上角您的用户名并选择 **登出** 即可登出控制台。

{{</ notice >}}

有关您需要创建的四个帐户的详细信息，请参阅下表。

| 账户         | 角色               | 描述                                                  |
| --------------- | ------------------ | ------------------------------------------------------------ |
| ws-manager      | workspaces-manager | Create and manage all workspaces.                            |
| ws-admin        | platform-regular   | Manage all resources in a specified workspace (This account is used to invite new members to a workspace in this example). |
| project-admin   | platform-regular   | Create and manage projects and DevOps projects, and invite new members into the projects. |
| project-regular | platform-regular   | `project-regular` will be invited to a project or DevOps project by `project-admin`. This account will be used to create workloads, pipelines and other resources in a specified project. |

5. 检查已创建的四个账户。

![account-list](https://ap3.qingstor.com/kubesphere-website/docs/account-list.png)

### 任务 2: 创建企业空间

在这个任务中，您需要使用前面任务中创建的账户 `ws-manager` 来创建一个企业空间。
In this task, you need to create a workspace using the account `ws-manager` created in the previous task. As the basic logic unit for the management of projects, DevOps projects and organization members, workspaces underpin multi-tenant system of KubeSphere.

1. Log in KubeSphere as `ws-manager` which has the authorization to manage all workspaces on the platform. Click **Platform** in the top-left corner. In **Workspaces**, you can see there is only one default workspace **system-workspace** listed, where system-related components and services run. You are not allowed to delete this workspace.

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.jpg)

2. Click **Create** on the right, name the new workspace `demo-workspace` and set the user `ws-admin` as the workspace manager shown in the screenshot below:

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.png)

Click **Create** after you finish.

3. Log out of the console and log back in as `ws-admin`. In **Workspace Settings**, select **Workspace Members** and click **Invite Member**.

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827111048.png)

1. 邀请 `project-admin` 和 `project-regular` 这两个账户加入该企业空间。分别授权角色为 `workspace-self-provisioner` 和 `workspace-viewer` 。 

{{< notice 注意 >}} 

实际角色名遵循命名规范：`企业空间名-角色名` 。举个例子，在 `demo` 这个企业空间中，角色 `workspace-viewer` 实际的角色名为 `demo-workspace-viewer` 。

{{</ notice >}} 

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827113124.png)

1. After you add both `project-admin` and `project-regular` to the workspace, click **OK**. In **Workspace Members**, you can see three members listed.

| Account         | Role                       | Description                                                  |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| ws-admin        | workspace-admin            | Manage all resources under the workspace (We use this account to invite new members to the workspace). |
| project-admin   | workspace-self-provisioner | Create and manage projects and DevOps projects, and invite new members to join the projects. |
| project-regular | workspace-viewer           | `project-regular` will be invited by `project-admin` to join a project or DevOps project. The account can be used to create workloads, pipelines, etc. |

### 任务 3: 创建项目

在这个任务中，您需要使用前面任务中创建的账户`project-admin`来创建一个项目。KubeSphere 中的项目类似 Kubernetes 中的 namespace ，用于对资源做虚拟隔离。更多相关信息，请参考 [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) 。

1. 使用 `project-admin` 登入 KubeSphere 。在**项目**中，点击**创建**。

![kubesphere-projects](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-projects.png)

2. 输入项目名称 （例如：`demo-project`）并点击**确定**完成创建。您也可以为项目添加别名和描述信息。

![demo-project](https://ap3.qingstor.com/kubesphere-website/docs/demo-project.png)

3. 在**项目**中点击刚刚创建的项目可查看该项目的详细信息。

![click-demo-project](https://ap3.qingstor.com/kubesphere-website/docs/click-demo-project.png)

4. 在项目概览页面，可看到默认没有设置项目配额。您可以点击**设置**并根据您的需求设定资源预留和资源限制（例如：1核 CPU 和 1000Gi内存）

![project-overview](https://ap3.qingstor.com/kubesphere-website/docs/quota.png)

![set-quota](https://ap3.qingstor.com/kubesphere-website/docs/20200827134613.png)

5. 邀请`project-regular`账户加入该项目并授权为`operator`角色。具体步骤请参考下图。

![](https://ap3.qingstor.com/kubesphere-website/docs/20200827135424.png)

{{< notice info >}}

被授权为`operator`角色的用户会成为项目维护者，可以管理项目下除用户和角色之外的资源。

{{</ notice >}}

#### 设置网关

在创建路由之前，您需要先在项目中启用网关。网关是运行在项目中的一个 [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) 。

{{< notice info >}}

路由指的是 Kubernetes 的入口，是一个用于管理集群内部服务对外访问的 API 对象。通常为 HTTP 服务。

{{</ notice >}}

1. To set a gateway, go to **高级设置** in **项目设置** and click **设置网关**. The account `project-admin` is still used in this step.

![set-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200827141823.png)

7. Choose the access method **NodePort** and click **保存**.

![nodeport](https://ap3.qingstor.com/kubesphere-website/docs/20200827141958.png)

8. Under **外网访问**, it can be seen that the Gateway Address and the NodePort of http and https all display in the page.

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
