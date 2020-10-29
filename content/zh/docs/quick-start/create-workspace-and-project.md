---
title: "创建企业空间，项目，账户和角色"
keywords: 'KubeSphere，Kubernetes，多租户，企业空间，账户，角色，项目'
description: '创建企业空间，项目，账户和角色'

linkTitle: "创建企业空间，项目，账户和角色"
weight: 3030
---


## 目标

本指南演示了如何创建后续教程需要的角色和用户帐户。同时，您将会学习如何在企业空间中创建项目和 DevOps 工程。通过这个教程，您将会熟悉 KubeSphere 的多租户管理系统。

## 前置条件

已经完成 KubeSphere 安装。

## 预计时间

15 分钟左右。

## 层级结构

KubeSphere 的多租户系统包含集群、企业空间和项目三个层级结构。KubeSphere 中的项目即为 Kubernetes 中的命名空间。

您可在一个 Kubernetes 集群中创建多个企业空间。在每个企业空间中，同样可以创建多个项目。

每个层级都拥有多个内置角色。此外，KubeSphere 还允许您创建具有自定义授权的角色。KubeSphere 的层级结构非常适用于具有不同团队或小组并且每个团队中拥有不同角色的企业用户。

## 动手实验

### 任务 1: 创建账户

完成 KubeSphere 安装后，您需要向平台添加具有不同角色的不同用户，以便他们可以在不同的层级管理不同的资源。最开始您只拥有一个默认账户，即 admin ，其角色授权为 `platform-admin` 。在第一个任务中，您将会创建一个角色为 `user-manager` 的账户，并进一步创建更多角色为 `user-manager` 的账户。

1. 使用默认账户和密码 （`admin/P@88w0rd`）以 admin 身份登录 web 控制台。

{{< notice 提示 >}}

为保证账户安全，强烈建议您在首次登录控制台后更改密码。您可在页面右上角的下拉菜单中选择 **个人设置** ，然后选择 **密码设置** 并重置密码。

{{</ notice >}}

2. 登录控制台后，点击左上角的 **平台管理** 并选择 **访问控制** 。

   ![access-control](https://ap3.qingstor.com/kubesphere-website/docs/access-control.png)

在 **账户角色** 中会显示如下所示四个内置角色。接下来创建的账户会被分配为 **users-manager** 角色。

| 内置角色     | 描述                                                  |
| ------------------ | ------------------------------------------------------------ |
| workspaces-manager | 平台企业空间管理员，管理平台所有企业空间。 |
| users-manager      | 平台用户管理员，管理平台所有用户。          |
| platform-regular   | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源的操作权限。 |
| platform-admin     | 平台管理员，可以管理平台内的所有资源。 |

{{< notice 注意 >}}

内置角色由 KubeSphere 自动创建，无法被编辑或删除。

{{</ notice >}} 

3. 选择 **账户管理** ，点击 **创建** 。在弹出窗口中提交所有必需信息（带有 * 标记），并选择角色为 `users-manager` 。参考下图示例。

![create-account](https://ap3.qingstor.com/kubesphere-website/docs/create-account.jpg)

完成后单击 **确定** 。新创建的账户会出现在 **账户管理** 页面的账户列表里面。

1. 登出控制台并使用 `user-manager` 账户登录，然后创建后续教程中将要使用的四个账户。

{{< notice 提示 >}} 

点击右上角您的用户名并选择 **登出** 即可登出控制台。

{{</ notice >}}

有关您需要创建的四个帐户的详细信息，请参阅下表。

| 账户         | 角色               | 描述                                                  |
| --------------- | ------------------ | ------------------------------------------------------------ |
| ws-manager      | workspaces-manager | 创建和管理所有的企业空间。                            |
| ws-admin        | platform-regular   | 管理指定企业空间中的所有资源（本例中此账户用于邀请新成员加入企业空间）。|
| project-admin   | platform-regular   | 创建和管理项目及 DevOps 工程，并邀请新成员加入项目。|
| project-regular | platform-regular   | `project-regular` 将会被 `project-admin` 邀请加入到创建的项目或 DevOps 工程。此账户将会用于在指定项目中创建工作负载，流水线和其他资源。|

5. 检查已创建的四个账户。

![account-list](https://ap3.qingstor.com/kubesphere-website/docs/account-list.png)

### 任务 2: 创建企业空间

在这个任务中，您需要使用前面任务中创建的账户 `ws-manager` 来创建一个企业空间。企业空间作为管理项目，DevOps 工程及组织成员的基本逻辑单元，是 KubeSphere 多租户系统的基础。

1. 使用 `ws-manager` 账户登录 KubeSphere ，它拥有管理平台上所有企业空间的权限。点击页面左上角的 **平台管理** ，在 **企业空间** ，您可以看到列表中仅有一个默认的企业空间 **system-workspace** ，其中运行着系统相关组件和服务，您无法删除此企业空间。

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.jpg)

2. 点击右侧的 **创建** ，将新建的企业空间命名为 `demo-workspace` 并设置用户 `ws-admin` 为企业空间管理员，如下图所示：

![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.png)

完成后点击 **创建** 。

3. 登出控制台并使用 `ws-admin`账户重新登录。在 **企业空间设置** 中，选择 **企业成员** 并点击 **邀请成员** 。

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827111048.png)

4. 邀请 `project-admin` 和 `project-regular` 这两个账户加入该企业空间。分别设置授权角色为 `workspace-self-provisioner` 和 `workspace-viewer` 。 

{{< notice 注意 >}} 

企业空间中的实际角色名遵循命名规范：`企业空间名-角色名` 。举个例子，在 `demo` 这个企业空间中，角色 `workspace-viewer` 实际的角色名为 `demo-workspace-viewer` 。

{{</ notice >}} 

![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827113124.png)

5. 将 `project-admin` 和 `project-regular` 添加到企业空间后，单击 **确定** 。在 **企业成员** 中，您可以看到列表中出现三个企业成员。

| 账户         | 角色                       | 描述                                                  |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| ws-admin        | workspace-admin            | 管理企业空间中的所有资源（我们使用这个账户来邀请新成员加入企业空间）。 |
| project-admin   | workspace-self-provisioner | 创建和管理项目及 DevOps 工程，和邀请新成员加入企业空间。 |
| project-regular | workspace-viewer           | `project-regular` 将会由 `project-admin` 邀请加入项目或者 DevOps 工程。该账户可用来创建工作负载，流水线等等。 |

### 任务 3: 创建项目

在这个任务中，您需要使用前面任务中创建的账户 `project-admin` 来创建一个项目。KubeSphere 中的项目类似 Kubernetes 中的命名空间，用于对资源做虚拟隔离。更多相关信息，请参考 [Namespaces](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/) 。

1. 使用 `project-admin` 登入 KubeSphere 。在 **项目** 中，点击 **创建** 。

![kubesphere-projects](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-projects.png)

2. 输入项目名称 （例如：`demo-project`）并点击 **确定** 完成创建。您也可以为项目添加别名和描述信息。

![demo-project](https://ap3.qingstor.com/kubesphere-website/docs/demo-project.png)

3. 在 **项目** 中点击刚刚创建的项目可查看该项目的详细信息。

![click-demo-project](https://ap3.qingstor.com/kubesphere-website/docs/click-demo-project.png)

4. 在项目概览页面，可看到该项目默认没有设置项目配额。您可以点击 **设置** 并根据您的需求设定资源预留和资源限制（例如：1核 CPU 和 1000Gi内存）

![project-overview](https://ap3.qingstor.com/kubesphere-website/docs/quota.png)

![set-quota](https://ap3.qingstor.com/kubesphere-website/docs/20200827134613.png)

5. 邀请 `project-regular` 账户加入该项目并授权为 `operator` 角色。具体步骤请参考下图。

![](https://ap3.qingstor.com/kubesphere-website/docs/20200827135424.png)

{{< notice info >}}

被授权为 `operator` 角色的用户会成为项目维护者，可以管理项目下除用户和角色之外的资源。

{{</ notice >}}

#### 设置网关

在创建路由之前，您需要先为项目启用网关。网关是运行在项目中的一个 [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) 。

{{< notice 信息 >}}

路由指的是 Kubernetes 中的 Ingress ，它是一个 API 对象，用于管理对集群中服务（通常为 HTTP ）的外部访问。

{{</ notice >}}

6. 需要设置网关，请转到 **项目设置** 中的 **高级设置** 并点击 **设置网关** 。在此步骤中仍然使用 `project-admin` 账户。

![set-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200827141823.png)

7. 选择访问方式 **NodePort** 并点击 **保存** 。

![nodeport](https://ap3.qingstor.com/kubesphere-website/docs/20200827141958.png)

8. 在 **外网访问** 下，可看到页面显示了网关地址以及 http 和 https 的节点端口。

{{< notice 注意 >}}

如果您想使用 `LoadBalancer` 来暴露服务，则需要使用云供应商的 LoadBalancer 插件。如果您的 Kubernetes 集群运行在裸机环境中，建议您使用 [Porter](https://github.com/kubesphere/porter) 作为 LoadBalancer 插件。

{{</ notice >}} 

![NodePort-setting-done](https://ap3.qingstor.com/kubesphere-website/docs/20200827142411.png)

### 任务 4: 创建角色

完成上述任务后，您知道了用户在不同层级可以被授予不同的角色。先前任务中使用的角色都是 Ku​​beSphere 本身创建的内置角色。在此任务中，您将学习如何自定义角色以满足工作需求。

1. 再次以`admin`账户登录控制台并转到 **访问控制** 。
2. 在 **账户角色** 中，列出了四个无法被删除和修改的系统角色。点击 **创建** 然后设置 **角色标识符**。在此示例中，您将创建名为 `roles-manager` 的角色。

![create-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827153339.png)

{{< notice 注意 >}}

建议您输入角色说明来声明角色的用途。此处创建的角色将仅负责角色管理，包括添加和删除角色。

{{</ notice >}} 

点击 **编辑权限** 继续。

3. 在 **访问控制** 中，选择您希望被授予了该角色用户将会拥有的权限。例如，为此角色选择 **账户查看**，**角色管理**，**角色查看**。点击 **确定** 完成创建。

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

### Task 5: 创建 DevOps 工程 (可选)

{{< notice 注意 >}}

要创建 DevOps 工程，您需要预先安装 KubeSphere Devops 系统，该系统是一个用于提供 CI/CD 流水线，二进制打包镜像，源代码打包镜像等功能的可插拔组件。有关如何启用 DevOps 组件的更多信息，请参阅 [KubeSphere DevOps System](../../pluggable-components/devops/).

{{</ notice >}} 

1. 使用 `project-admin` 登录控制台，在 **DevOps 工程** 中点击 **创建** 。

![devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827145521.png)

2. 输入 DevOps 工程的名字（例如：`demo-devops`）然后点击 **确定** 。您也可以为创建的项目添加别名或者描述。

![devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827145755.png)

3. 在 **DevOps 工程** 中，点击刚刚创建的项目查看详细信息。

![new-devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827150523.png)

4. 转到 **工程管理** 然后选择 **工程成员** 。点击 **邀请成员** 为 `project-regular` 授权 `operator` 角色，以允许其创建流水线和凭证。

![devops-invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827150704.png)

恭喜！您现在已经熟悉 KubeSphere 的多租户系统了。在接下来的几个教程中，账户 `project-regular` 还将用于演示如何在项目或者 DevOps 工程中创建应用和资源。
