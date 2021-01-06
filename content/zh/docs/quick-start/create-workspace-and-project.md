---
title: "创建企业空间、项目、帐户和角色"
keywords: 'KubeSphere, Kubernetes, 多租户, 企业空间, 帐户, 角色, 项目'
description: '创建企业空间、项目、帐户和角色快速指南'
linkTitle: "创建企业空间、项目、帐户和角色"
weight: 2300
---

本快速入门演示如何创建企业空间、角色和用户帐户。同时，您将学习如何在企业空间中创建项目和 DevOps 工程，用于运行工作负载。完成本教程后，您将熟悉 KubeSphere 的多租户管理系统，并使用本教程中创建的资源（例如企业空间和帐户等）完成其他教程中的操作。

## 准备工作

KubeSphere 需要安装在您的机器中。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/docs-v3.0/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8_1_%E5%88%9B%E5%BB%BA%E4%BC%81%E4%B8%9A%E7%A9%BA%E9%97%B4%E9%A1%B9%E7%9B%AE%E8%B4%A6%E6%88%B7%E5%92%8C%E8%A7%92%E8%89%B2.mp4">
</video>

## 预计时间

大约 15 分钟。

## 架构

KubeSphere 的多租户系统分三个层级，即**群集**、**企业空间**和**项目**。KubeSphere 中的项目等同于 Kubernetes 的[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

您需要创建一个新的企业空间进行操作，而不是使用系统企业空间，该企业空间中运行着系统资源，绝大部分仅供查看。出于安全考虑，强烈建议给不同的租户授予不同的权限在企业空间中进行协作。

您可以在一个 KubeSphere 集群中创建多个企业空间，每个企业空间下可以创建多个项目。KubeSphere 为每个级别默认设有多个内置角色。此外，您还可以创建拥有自定义权限的角色。KubeSphere 多层次结构适用于具有不同团队或组织以及每个团队中需要不同角色的企业用户。

## 动手实验

### 步骤 1：创建帐户

安装 KubeSphere 之后，您需要向平台添加具有不同角色的用户，以便他们可以针对自己授权的资源在不同的层级进行工作。一开始，系统默认只有一个帐户 `admin`，具有 `platform-admin` 角色。在本步骤中，您将创建一个帐户 `user-manager`，然后使用 `user-manager` 创建新帐户。

1. 使用默认帐户和密码 (`admin/P@88w0rd`) 以 `admin` 身份登录 Web 控制台。

   {{< notice tip >}}
   出于安全考虑，强烈建议您在首次登录控制台时更改密码。若要更改密码，在右上角的下拉菜单中选择**个人设置**，在**密码设置**中设置新密码，您也可以在**个人设置**中修改控制台语言。
   {{</ notice >}}

   ![设置密码](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/设置密码.jpg)

2. 登录控制台后，点击左上角的**平台管理**，然后选择**访问控制**。

   ![访问控制](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/访问控制.jpg)

   在**帐户角色**中，有如下所示四个可用的内置角色。接下来要创建的第一个帐户将被分配 `users-manager` 角色。

   | 内置角色             | 描述                                                         |
   | -------------------- | ------------------------------------------------------------ |
   | `workspaces-manager` | 企业空间管理员，管理平台所有企业空间。                       |
   | `users-manager`      | 用户管理员，管理平台所有用户。                               |
   | `platform-regular`   | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |
   | `platform-admin`     | 平台管理员，可以管理平台内的所有资源。                       |

   {{< notice note >}}
内置角色由 KubeSphere 自动创建，无法编辑或删除。
   {{</ notice >}}

3. 在**帐户管理**中，点击**创建**。在弹出窗口中，提供所有必要信息（带有*标记），然后在**角色**字段选择 `users-manager`。请参考下图示例。

   ![创建帐户](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/创建帐户.jpg)

   完成后，点击**确定**。新创建的帐户将显示在**帐户管理**中的帐户列表中。

4. 切换帐户使用 `user-manager` 重新登录，创建如下四个新帐户，这些帐户将在其他的教程中使用。

   {{< notice tip >}}
帐户登出请点击右上角的用户名，然后选择**登出**。
   {{</ notice >}}

   | 帐户              | 角色                 | 描述                                                         |
   | ----------------- | -------------------- | ------------------------------------------------------------ |
   | `ws-manager`      | `workspaces-manager` | 创建和管理所有企业空间。                                     |
   | `ws-admin`        | `platform-regular`   | 管理指定企业空间中的所有资源（在此示例中，此帐户用于邀请新成员加入该企业空间）。 |
   | `project-admin`   | `platform-regular`   | 创建和管理项目以及 DevOps 工程，并邀请新成员加入项目。       |
   | `project-regular` | `platform-regular`   | `project-regular` 将由 `project-admin` 邀请至项目或 DevOps 工程。该帐户将用于在指定项目中创建工作负载、流水线和其他资源。 |

5. 查看创建的四个帐户。

   ![帐户列表](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/帐户列表.jpg)

### 步骤 2：创建企业空间

在此步骤中，您需要使用上一个步骤中创建的帐户 `ws-manager` 创建一个企业空间。作为管理项目、DevOps 工程和组织成员的基本逻辑单元，企业空间是 KubeSphere 多租户系统的基础。

1. 以 `ws-manager` 身份登录 KubeSphere，它具有管理平台上所有企业空间的权限。点击左上角的**平台管理**，选择**访问控制**。在**企业空间**中，可以看到仅列出了一个默认企业空间 `system-workspace`，即系统企业空间，其中运行着与系统相关的组件和服务，您无法删除该企业空间。

   ![创建企业空间](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/创建企业空间.jpg)

2. 点击右侧的**创建**，将新企业空间命名为 `demo-workspace`，并将用户 `ws-admin` 设置为企业空间管理员，如下图所示：

   ![完成创建企业空间](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/完成创建企业空间.jpg)

   完成后，点击**创建**。

3. 登出控制台，然后以 `ws-admin` 身份重新登录。在**企业空间设置**中，选择**企业成员**，然后点击**邀请成员**。

   ![邀请成员](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/邀请成员.jpg)

4. 邀请 `project-admin` 和 `project-regular` 进入企业空间，分别授予他们 `workspace-self-provisioner` 和 `workspace-viewer` 角色。

   {{< notice note >}}
实际角色名称的格式：`<workspace name>-<role name>`。例如，在名为 `demo-workspace` 的企业空间中，角色 `viewer` 的实际角色名称为 `demo-workspace-viewer`。
   {{</ notice >}}

   ![邀请列表](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/邀请列表.jpg)

5. 将 `project-admin` 和 `project-regular` 都添加到企业空间后，点击**确定**。在**企业成员**中，您可以看到列出的三名成员。

   | 帐户              | 角色                         | 描述                                                         |
   | ----------------- | ---------------------------- | ------------------------------------------------------------ |
   | `ws-admin`        | `workspace-admin`            | 管理指定企业空间中的所有资源（在此示例中，此帐户用于邀请新成员加入企业空间）。 |
   | `project-admin`   | `workspace-self-provisioner` | 创建和管理项目以及 DevOps 工程，并邀请新成员加入项目。       |
   | `project-regular` | `workspace-viewer`           | `project-regular` 将由 `project-admin` 邀请至项目或 DevOps 工程。该帐户将用于在指定项目中创建工作负载、流水线和其他资源。 |

### 步骤 3：创建项目

在此步骤中，您需要使用在上一步骤中创建的帐户 `project-admin` 来创建项目。KubeSphere 中的项目与 Kubernetes 中的命名空间相同，为资源提供了虚拟隔离。有关更多信息，请参见[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

1. 以 `project-admin` 身份登录 KubeSphere，在**项目管理**中，点击**创建**。

   ![项目](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/项目.jpg)

2. 输入项目名称（例如 `demo-project`），然后点击**确定**完成，您还可以为项目添加别名和描述。

   ![创建项目](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/创建项目.jpg)

3. 在**项目管理**中，点击刚创建的项目查看其详细信息。

   ![查看项目](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/查看项目.jpg)

4. 在项目的**概览**页面，默认情况下未设置项目配额。您可以点击**设置**并根据需要指定资源请求和限制（例如：CPU 和内存的限制分别设为 1 Core 和 1000 Gi）。

   ![项目概览](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/项目概览.jpg)

   ![设置配额](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/设置配额.jpg)

5. 邀请 `project-regular` 至该项目，并授予该用户 `operator` 角色。请参考下图以了解具体步骤。

   ![邀请成员至项目](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/邀请成员至项目.jpg)

   {{< notice info >}}
具有 `operator` 角色的用户是项目维护者，可以管理项目中除用户和角色以外的资源。
   {{</ notice >}}

6. 在创建[路由](../../project-user-guide/application-workloads/ingress/)（即 Kubernetes 中的 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)）之前，需要启用该项目的网关。网关是在项目中运行的 [NGINX Ingress 控制器](https://github.com/kubernetes/ingress-nginx)。若要设置网关，请转到**项目设置**中的**高级设置**，然后点击**设置网关**。此步骤中仍使用帐户 `project-admin`。

   ![设置网关](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/设置网关.jpg)

7. 选择访问方式 **NodePort**，然后点击**保存**。

   ![nodeport](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/nodeport.jpg)

8. 在**外网访问**下，可以在页面上看到网关地址以及 http/https 的端口。

   {{< notice note >}}
如果要使用 `LoadBalancer` 暴露服务，则需要使用云厂商的 LoadBalancer 插件。如果您的 Kubernetes 集群在裸机环境中运行，建议使用 [Porter](https://github.com/kubesphere/porter) 作为 LoadBalancer 插件。
   {{</ notice >}}

   ![完成网关设置](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/完成网关设置.jpg)

### 步骤 4：创建角色

完成上述步骤后，您已了解可以为不同级别的用户授予不同角色。先前步骤中使用的角色都是 KubeSphere 提供的内置角色。在此步骤中，您将学习如何创建自定义角色以满足工作需求。

1. 再次以 `admin` 身份登录控制台，然后转到**访问控制**。
2. **帐户角色**中列出了四个系统角色，无法删除或编辑。点击**创建**并设置**角色标识符**。在本示例将创建一个名为 `roles-manager` 的角色。

   ![创建角色](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/创建角色.jpg)

   {{< notice note >}}
建议您输入角色说明解释此角色的用途。此处创建的角色将仅负责角色管理，包括添加和删除角色。
   {{</ notice >}}

   点击**编辑权限**继续。

3. 在**访问控制**中，选择该角色所拥有的权限。例如，本示例选择**帐户查看**、**角色管理**和**角色查看**。点击**确定**完成创建。

   ![编辑权限](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/编辑权限.jpg)

   {{< notice note >}}
某些权限**依赖于**其他权限。要选择从属的权限，必须选择其依赖的权限。
   {{</ notice >}}

4. 新创建的角色将列于**帐户角色**中，可以点击右侧的三个点对其进行编辑。

   ![编辑角色](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/编辑角色.jpg)

5. 在**帐户管理**中，添加一个新帐户并授予其 `roles-manager` 角色，您也可以通过编辑将现有帐户的角色更改为 `roles-manager`。

   ![编辑帐户角色](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/编辑帐户角色.jpg)

   {{< notice note >}}
`roles-manager` 的角色与 `users-manager` 重叠，而后者还可以进行用户管理。本示例仅用于演示目的，您可以根据需要创建自定义角色。
   {{</ notice >}}

### 步骤 5：创建 DevOps 工程（可选）

{{< notice note >}}

若要创建 DevOps 工程，需要预先安装 KubeSphere DevOps 系统，该系统是个可插拔的组件，提供 CI/CD 流水线、Binary-to-Image 和 Source-to-Image 等功能。有关如何启用 DevOps 的更多信息，请参见 [KubeSphere DevOps 系统](../../pluggable-components/devops/)。

{{</ notice >}}

1. 以 `project-admin` 身份登录控制台，在 **DevOps 工程**中，点击**创建**。

   ![devops-工程](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/devops-工程.jpg)

2. 输入 DevOps 工程名称（例如 `demo-devops`），然后点击**确定**，也可以为该工程添加别名和描述。

   ![创建-devops-工程](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/创建-devops-工程.jpg)

3. 在 **DevOps 工程**中，点击刚创建的工程查看其详细信息。

   ![工程列表](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/工程列表.jpg)

4. 转到**工程管理**，然后选择**工程成员**。点击**邀请成员**授予 `project-regular` 用户 `operator` 的角色，允许其创建流水线和凭证。

   ![邀请-devops-成员](/images/docs/zh-cn/quickstart/create-workspaces-projects-accounts/邀请-devops-成员.jpg)

至此，您已熟悉 KubeSphere 的多租户管理系统。在其他教程中，`project-regular` 帐户还将用于演示如何在项目或 DevOps 工程中创建应用程序和资源。
