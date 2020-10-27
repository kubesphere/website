---
title: "创建企业空间，项目，账户和角色"
keywords: 'KubeSphere，Kubernetes，多租户，企业空间，账户，角色，项目'
description: '创建企业空间，项目，账户和角色'

linkTitle: "创建企业空间，项目，账户和角色"
weight: 3030
---


## 目标

本指南演示了如何创建后续教程需要的角色和用户帐户。同时，您将会学习如何在运行工作负载的企业空间中创建普通项目和 DevOps 项目。通过这个教程，您将会熟悉 KubeSphere 的多租户管理系统。

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
| ws-manager      | workspaces-manager | 创建和管理所有的企业空间。                            |
| ws-admin        | platform-regular   | 管理指定企业空间中的所有资源（本例中此账户用于邀请新成员加入企业空间）。|
| project-admin   | platform-regular   | 创建和管理普通项目及 DevOps 项目，并邀请新成员加入项目。|
| project-regular | platform-regular   | `project-regular` 将会被 `project-admin` 邀请加入到创建的项目或 DevOps 项目。此账户将会用于在指定项目中创建工作负载，流水线和其他资源。|

5. 检查已创建的四个账户。

![account-list](https://ap3.qingstor.com/kubesphere-website/docs/account-list.png)

### 任务 2: 创建企业空间

在这个任务中，您需要使用前面任务中创建的账户 `ws-manager` 来创建一个企业空间。企业空间作为管理项目，DevOps 项目及组织成员的基本逻辑单元，是 KubeSphere 多租户系统的基础。

1. 使用 `ws-manager` 账户登录 KubeSphere ，它拥有管理平台上所有企业空间的权限。点击页面左上角的 **平台管理** 。在 **企业空间** ，您可以看到仅列出一个默认的企业空间 **system-workspace** ，其中运行着系统相关组件和服务，您无法删除此企业空间。

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.jpg)

2. 点击右侧的 **创建** ，将新建的企业空间命名为 `demo-workspace` 并设置用户 `ws-admin` 为企业空间管理员，如下图所示：

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.png)

点击 **创建** 完成。

3. 登出控制台并使用 `ws-admin`账户重新登录。在 **企业空间设置** 中，选择 **企业成员** 并点击 **邀请成员** 。

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827111048.png)

4. 邀请 `project-admin` 和 `project-regular` 这两个账户加入该企业空间。分别设置授权角色为 `workspace-self-provisioner` 和 `workspace-viewer` 。 

{{< notice 注意 >}} 

企业空间中的实际角色名遵循命名规范：`企业空间名-角色名` 。举个例子，在 `demo` 这个企业空间中，角色 `workspace-viewer` 实际的角色名为 `demo-workspace-viewer` 。

{{</ notice >}} 

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827113124.png)

5. 将 `project-admin` 和 `project-regular` 添加到企业空间后，单击 **确定** 。在 **企业成员** 中，您可以看到列出的三个成员。

| 账户         | 角色                       | 描述                                                  |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| ws-admin        | workspace-admin            | 管理企业空间中的所有资源（我们使用这个账户来邀请新成员加入企业空间）。 |
| project-admin   | workspace-self-provisioner | 创建和管理项目及 DevOps 项目，并邀请新成员加入企业空间。 |
| project-regular | workspace-viewer           | `project-regular` 将由 `project-admin` 邀请加入项目或者 DevOps 项目。该账户可用来创建工作负载，流水线等等。 |

### 任务 3: 创建项目

在这个任务中，您需要使用前面任务中创建的账户 `project-admin` 来创建一个项目。KubeSphere 中的项目类似 Kubernetes 中的命名空间，用于对资源做虚拟隔离。更多相关信息，请参考 [Namespaces](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/) 。

1. 使用 `project-admin` 登入 KubeSphere 。在 **项目** 中，点击 **创建** 。

![kubesphere-projects](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-projects.png)

2. 输入项目名称 （例如：`demo-project`）并点击 **确定** 完成创建。您也可以为项目添加别名和描述信息。

![demo-project](https://ap3.qingstor.com/kubesphere-website/docs/demo-project.png)

3. 在 **项目** 中点击刚刚创建的项目可查看该项目的详细信息。

![click-demo-project](https://ap3.qingstor.com/kubesphere-website/docs/click-demo-project.png)

4. 在项目概览页面，可看到默认没有设置项目配额。您可以点击 **设置** 并根据您的需求设定资源预留和资源限制（例如：1核 CPU 和 1000Gi内存）

![project-overview](https://ap3.qingstor.com/kubesphere-website/docs/quota.png)

![set-quota](https://ap3.qingstor.com/kubesphere-website/docs/20200827134613.png)

5. 邀请 `project-regular` 账户加入该项目并授权为 `operator` 角色。具体步骤请参考下图。

![](https://ap3.qingstor.com/kubesphere-website/docs/20200827135424.png)

{{< notice info >}}

被授权为 `operator` 角色的用户会成为项目维护者，可以管理项目下除用户和角色之外的资源。

{{</ notice >}}

#### 设置网关

在创建路由之前，您需要先在项目中启用网关。网关是运行在项目中的一个 [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) 。

{{< notice 信息 >}}

路由指的是 Kubernetes 中的 Ingress ，它是一个 API 对象，用于管理对集群中服务（通常为 HTTP ）的外部访问。

{{</ notice >}}

6. 需要设置网关，请转到 **项目设置** 中的 **高级设置** 并点击 **设置网关** 。在此步骤中仍然使用 `project-admin` 账户。

![set-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200827141823.png)

7. 选择访问方式 **NodePort** 并点击 **保存** 。

![nodeport](https://ap3.qingstor.com/kubesphere-website/docs/20200827141958.png)

8. 在 **外网访问** 下，可看到页面显示了网关地址以及 http 和 https 的节点端口。

{{< notice 注意 >}}

如果您想使用 `LoadBalancer` 来暴露服务，则需要使用 [云供应商的 LoadBalancer 插件](https://kubernetes.io/zh/docs/concepts/services-networking/service/#loadbalancer) 。如果您的 Kubernetes 集群运行在裸机环境中，建议您使用 [Porter](https://github.com/kubesphere/porter) 作为 LoadBalancer 插件。

{{</ notice >}} 

![NodePort-setting-done](https://ap3.qingstor.com/kubesphere-website/docs/20200827142411.png)

### 任务 4: 创建角色

完成上述任务后，您知道了可以为用户授予不同级别的不同角色。先前任务中使用的角色都是 Ku​​beSphere 本身创建的内置角色。在此任务中，您将学习如何自定义角色以满足工作需求。

1. 再次以`admin`账户登录控制台并转到 **访问控制** 。
2. 在 **账户角色** 中，列出了四个无法被删除和修改的系统角色。点击 **创建** 然后设置 **角色标识符**。在此示例中，您将创建名为 `roles-manager` 的角色。

![create-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827153339.png)

{{< notice 注意 >}}

建议您输入角色说明来声明角色的用途。此处创建的角色将仅负责角色管理，包括添加和删除角色。

{{</ notice >}} 

点击 **编辑权限** 继续。

3. 在 **访问控制** 中，选择您希望被授予了该角色的用户所拥有的权限。例如，为此角色选择 **账户查看**，**角色管理**，**角色查看**。点击 **确定** 完成创建。

![edit-authorization](https://ap3.qingstor.com/kubesphere-website/docs/20200827153651.png)

{{< notice 注意 >}} 

**依赖于** 指需要先选择主要授权（**依赖于** 之后列出的授权）以便可以分配关联授权。

{{</ notice >}} 

4. 新创建的角色将出现在 **账户角色** 中。您可点击角色右侧的三个点来编辑它。

![roles-manager](https://ap3.qingstor.com/kubesphere-website/docs/20200827154723.png)

5. 在 **账户管理** 中，您可以添加一个新的账户并授予角色 `roles-manager` ，或者通过编辑将现有账户的角色更改为 `roles-manager` 。

![edit-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827155205.png)

{{< notice 注意 >}} 

角色 `roles-manager` 与 `users-manager` 存在权限重叠，后者也可以进行用户管理，本示例仅用于演示目的。您可根据您的实际需求创建自定义角色。

{{</ notice >}} 

### Task 5: 创建 DevOps 项目 (可选)

{{< notice 注意 >}}

要创建 DevOps 项目，您需要预先安装 KubeSphere Devops 系统，该系统是一个用于提供 CI/CD 流水线，二进制打包镜像，源代码打包镜像等功能的可插拔组件。有关如何启用 DevOps 组件的更多信息，请参阅 [KubeSphere DevOps System](../../pluggable-components/devops/).

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
