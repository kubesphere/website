---
title: "创建企业空间、项目、帐户和角色"
keywords: 'KubeSphere, Kubernetes, Multi-tenant, Workspace, Account, Role, Project'
description: '创建企业空间、项目、帐户和角色快速指南'

linkTitle: "创建企业空间、项目、帐户和角色"
weight: 2300
---


## 目标

本指南演示如何创建其它章节教程所需的角色和用户帐户，同时，您将学习如何在工作负载运行的企业空间中创建项目和 DevOps 工程。本教程之后，您将熟悉 KubeSphere 多租户管理系统。

## 先决条件

KubeSphere 需要安装在您的服务器中。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/docs-v3.0/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8_1_%E5%88%9B%E5%BB%BA%E4%BC%81%E4%B8%9A%E7%A9%BA%E9%97%B4%E9%A1%B9%E7%9B%AE%E8%B4%A6%E6%88%B7%E5%92%8C%E8%A7%92%E8%89%B2.mp4">
</video>

## 估计时间

大约 15 分钟。

## 架构

KubeSphere 的多租户系统分三个层级，即**群集**、**企业空间**和**项目**。KubeSphere 中的项目等同于 Kubernetes 命名空间。

您需要创建一个新的企业空间工作，而不是在系统空间里操作，因为系统空间是系统资源运行的地方，绝大部分资源只有查看权限。而且强烈建议别用平台管理员工作，这对系统是不安全的。

一个租户可以在一个 KubeSphere 集群中创建多个企业空间，在每个企业空间下，还可以创建多个项目。每个级别都有多个内置角色。此外，KubeSphere 还允许使用自定义授权创建角色。KubeSphere 多层次结构适用于具有不同团队或组织以及每个团队中需要不同角色的企业用户。

## 动手实验

### 任务 1：创建帐户

安装 KubeSphere 之后，需要向平台添加具有不同角色的用户，以便他们可以在自己授权的资源上工作。系统默认只有一个帐户`admin`，被授予角色`platform-admin`。在第一个任务中，您将创建一个帐户`user-manager`，然后用`user-manager`这个账号创建更多的新账户。

1. 使用默认帐户和密码（admin/P@88w0rd）以`admin`身份登录 Web 控制台。

   {{< notice tip >}}
为了帐户安全，强烈建议您在首次登录控制台时更改密码，请在右上角的下拉菜单中选择**用户设置**，在**密码设置**中输入新密码。您也可以在这个地方设置语言。
   {{</ notice >}}

2. 登录控制台后，单击左上角的**平台管理**，然后选择**访问控制**。

   ![access-control](https://ap3.qingstor.com/kubesphere-website/docs/access-control.png)

   在**帐户角色**中，有如下所示四个可用的内置角色。接下来要创建的第一个帐户将被分配为`users-manager`角色。

   | 内置角色           | 描述                                                         |
   | ------------------ | ------------------------------------------------------------ |
   | workspaces-manager | 企业空间管理员，管理平台所有企业空间。                    |
   | users-manager      | 用户管理员，管理平台所有用户。                           |
   | platform-regular   | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。|
   | platform-admin     | 平台管理员，可以管理平台内的所有资源。                       |

   {{< notice note >}}
内置角色由 KubeSphere 自动创建，无法编辑或删除。
   {{</ notice >}}

3. 在**账户管理**中，点击**创建**。在弹出窗口中，提供所有必需的信息（带有*标记），然后为**角色**选择 `users-manager`。请参考下图示例。

   ![create-account](https://ap3.qingstor.com/kubesphere-website/docs/create-account.jpg)

   完成后，单击**确定**。新创建的帐户将显示在**帐户管理**中的帐户列表中。

4. 切换账号使用`user-manager`重新登录，创建如下四个新帐户，这些帐户将在今后的教程中使用到。

   {{< notice tip >}}
账号登出请单击右上角的用户名，然后选择**登出**。
   {{</ notice >}}

   | 账户名          | 角色               | 描述信息                                                     |
   | --------------- | ------------------ | ------------------------------------------------------------ |
   | ws-manager      | workspaces-manager | 创建和管理所有企业空间。                                     |
   | ws-admin        | platform-regular   | 管理指定企业空间中的所有资源（在此示例中，此帐户用于邀请新成员加入该企业空间）。 |
   | project-admin   | platform-regular   | 创建和管理项目以及 DevOps 项目，并邀请新成员加入项目。       |
   | project-regular | platform-regular   | `project-regular`将被`project-admin`邀请到一个项目或 DevOps 项目。该帐户将用于在指定项目中创建工作负载，流水线和其他资源。|

5. 查看创建的四个帐户。

   ![account-list](https://ap3.qingstor.com/kubesphere-website/docs/account-list.png)

### 任务2：创建企业空间

在此任务中，您需要使用上一个任务中创建的帐户`ws-manager`创建一个企业空间。作为项目，DevOps 项目和组织成员的基本管理逻辑单元，企业空间是 KubeSphere 多租户系统的基础。

1. 以`ws-manager`身份登录 KubeSphere，它具有管理平台上所有企业空间的权限。点击左上角的**平台管理**，选择**访问控制**。在**企业空间**中，可以看到仅列出了一个默认企业空间**system-workspace**，这是一个系统空间，其中运行与系统相关的组件和服务，您不允许删除该企业空间。

   ![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.jpg)

2. 单击右侧的**创建**，将新企业空间命名为`demo-workspace`，并将用户`ws-admin`设置为企业空间管理员，如下图所示：

   ![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/create-workspace.png)

   完成后，单击**创建**。

3. 登出控制台，然后以`ws-admin`身份重新登录。在**企业空间设置**中，选择**企业成员**，然后单击**邀请成员**。

   ![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827111048.png)

4. 邀请`project-admin`和`project-regular`进入企业空间，分别授予他们`self-provisioner`和`workspace-viewer`角色。

   {{< notice note >}}
实际角色名称的格式：`<workspace name>-<role name>`。例如，在名为 `demo-workspace` 的企业空间中，角色 `viewer` 的实际角色名称是 `demo-workspace-viewer`。
   {{</ notice >}}

   ![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827113124.png)

5. 将`project-admin`和`project-regular`都添加到企业空间后，单击**确定**。在**企业成员**中，您可以看到列出的三个成员。

   | 账户名          | 角色                       | 描述信息                                                     |
   | --------------- | -------------------------- | ------------------------------------------------------------ |
   | ws-admin        | workspace-admin            | 管理指定企业空间中的所有资源（在此示例中，此帐户用于邀请新成员加入企业空间）。 |
   | project-admin   | workspace-self-provisioner | 创建和管理项目以及 DevOps 工程，并邀请新成员加入项目。       |
   | project-regular | workspace-viewer           | `project-regular`将被`project-admin`邀请到一个项目或 DevOps 工程。该帐户将用于在指定项目中创建工作负载，流水线和其他资源。|

### 任务3：创建一个项目

在此任务中，您需要使用在上一个任务中创建的帐户`project-admin`来创建项目。KubeSphere 中的项目与 Kubernetes 中的命名空间相同，后者为资源提供了虚拟隔离。有关更多信息，请参见[命名空间](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)。

1. 以`project-admin`身份登录 KubeSphere，在**项目管理**中，单击**创建**。

   ![kubesphere-projects](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-projects.png)

2. 输入项目名称（例如`demo-project`），然后点击**确定**以完成，您还可以为项目添加别名和描述。

   ![demo-project](https://ap3.qingstor.com/kubesphere-website/docs/demo-project.png)

3. 在**项目管理**中，单击刚刚创建的项目查看其详细信息。

   ![click-demo-project](https://ap3.qingstor.com/kubesphere-website/docs/click-demo-project.png)

4. 在项目的概述页面中，默认情况下未设置项目配额。您可以单击**设置**并根据需要指定资源请求和限制（例如：1 个 CPU 内核和 1000Gi 内存）。

   ![project-overview](https://ap3.qingstor.com/kubesphere-website/docs/quota.png)

   ![set-quota](https://ap3.qingstor.com/kubesphere-website/docs/20200827134613.png)

5. 邀请`project-regular`参与该项目，并授予该用户`operator`角色。请参考下图以了解具体步骤。

   ![invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827135424.png)

   {{< notice info >}}
被授予角色`operator`的用户将是项目维护者，他可以管理项目中用户和角色以外的资源。
   {{</ notice >}}

6. 在创建路由即 [Ingress](../../project-user-guide/application-workloads/ingress/) 之前，需要启用该项目的网关。网关是在项目中运行的 [NGNIX Ingress 控制器](https://github.com/kubernetes/ingress-nginx)。要设置网关，请转到**项目设置**中的**高级设置**，然后单击**设置网关**。此步骤中仍使用帐户`project-admin`。

   ![set-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200827141823.png)

7. 选择访问方式 **NodePort** ，然后单击**保存**。

   ![nodeport](https://ap3.qingstor.com/kubesphere-website/docs/20200827141958.png)

8. 在**外网访问**下，可以在页面上看到网关地址和 http/https 的端口。

   {{< notice note >}}
如果要使用`LoadBalancer`暴露服务，则需要使用云提供商的 LoadBalancer 插件。如果您的 Kubernetes 集群在裸机环境中运行，建议使用 [Porter](https://github.com/kubesphere/porter) 作为 LoadBalancer 插件。
   {{</ notice >}}

   ![NodePort-setting-done](https://ap3.qingstor.com/kubesphere-website/docs/20200827142411.png)

### 任务4：创建角色

完成上述任务后，您将知道可以为不同级别的用户授予不同角色。先前任务中使用的角色都是 KubeSphere 提供的内置角色。在此任务中，您将学习如何自己定义角色以满足工作需求。

1. 再次以`admin`身份登录控制台，然后转到**访问控制**。
2. 在**帐户角色**中，列出了四个无法删除或编辑的系统角色。点击**创建**并设置**角色标识符**。在这个例子中，将创建一个名为`roles-manager`的角色。

   ![create-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827153339.png)

   {{< notice note >}}
建议您输入角色说明解释此角色的用途。此处创建的角色将仅负责角色管理，包括添加和删除角色。
   {{</ notice >}}

   点击**编辑权限**。

3. 在**访问控制**中，选择您希望授予该角色的用户所拥有的授权。例如，为此角色选择了**用户查看**，**角色管理**和**角色查看**。单击**确定**完成。

   ![edit-authorization](https://ap3.qingstor.com/kubesphere-website/docs/20200827153651.png)

   {{< notice note >}}
**依赖于**意味着当前授权项依赖列出的授权项，系统会自动选上该依赖项。
   {{</ notice >}}

4. 新创建的角色将列在**帐户角色**中，可以单击右侧的三个点对其进行编辑。

   ![roles-manager](https://ap3.qingstor.com/kubesphere-website/docs/20200827154723.png)

5. 在**账户管理**中，添加一个新帐户并将其授予角色`roles-manager`，也可以通过编辑将现有帐户的角色更改为`roles-manager`。

   ![edit-role](https://ap3.qingstor.com/kubesphere-website/docs/20200827155205.png)

   {{< notice note >}}
`roles-manager`的角色与`users-manager`重叠，而后者还可以进行用户管理。本示例仅用于演示目的，您可以根据需要创建自定义角色。
   {{</ notice >}}

### 任务5：创建一个 DevOps 工程（可选）

{{< notice note >}}

要创建 DevOps 工程，需要预先安装 KubeSphere DevOps 系统，该系统是个可插拔的组件，提供 CI/CD 流水线，二进制到镜像，源码到镜像功能等。有关如何启用 DevOps 的更多信息，请参见 [KubeSphere DevOps System](../../pluggable-components/devops/)。

{{</ notice >}}

1. 以`project-admin`身份登录控制台，在 **DevOps 工程**中，单击**创建**。

   ![devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827145521.png)

2. 输入 DevOps 工程名称（例如`demo-devops`），然后点击**确定**，也可以为项目添加别名和描述。

   ![devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827145755.png)

3. 在 **DevOps 工程**中，单击刚创建的工程查看其详细信息。

   ![new-devops-project](https://ap3.qingstor.com/kubesphere-website/docs/20200827150523.png)

4. 转到**工程管理**，然后选择**工程成员**。单击**邀请成员**授予`project-regular`用户`operator`的角色，该操作员可以创建流水线和凭证。

   ![devops-invite-member](https://ap3.qingstor.com/kubesphere-website/docs/20200827150704.png)

恭喜您！您现在已经熟悉 KubeSphere 的多租户管理系统。在接下来的几篇教程中，`project-regular`帐户还将用于演示如何在项目或 DevOps 工程中创建应用程序和资源。
