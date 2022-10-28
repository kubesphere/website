---
title: "创建企业空间、项目、用户和平台角色"
keywords: 'KubeSphere, Kubernetes, 多租户, 企业空间, 帐户, 平台角色, 项目'
description: '了解如何利用 KubeSphere 中的多租户功能在不同级别进行细粒度访问控制。'
linkTitle: "创建企业空间、项目、用户和平台角色"
weight: 2300
---

本快速入门演示如何创建企业空间、用户和平台角色。同时，您将学习如何在企业空间中创建项目和 DevOps 项目，用于运行工作负载。完成本教程后，您将熟悉 KubeSphere 的多租户管理系统，并使用本教程中创建的资源（例如企业空间和帐户等）完成其他教程中的操作。

## 准备工作

KubeSphere 需要安装在您的机器中。

## 架构

KubeSphere 的多租户系统分**三个**层级，即集群、企业空间和项目。KubeSphere 中的项目等同于 Kubernetes 的[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

您需要创建一个新的[企业空间](../../workspace-administration/what-is-workspace/)进行操作，而不是使用系统企业空间，系统企业空间中运行着系统资源，绝大部分仅供查看。出于安全考虑，强烈建议给不同的租户授予不同的权限在企业空间中进行协作。

您可以在一个 KubeSphere 集群中创建多个企业空间，每个企业空间下可以创建多个项目。KubeSphere 为每个级别默认设有多个内置角色。此外，您还可以创建拥有自定义权限的角色。KubeSphere 多层次结构适用于具有不同团队或组织以及每个团队中需要不同角色的企业用户。

## 动手实验

### 步骤 1：创建用户

安装 KubeSphere 之后，您需要向平台添加具有不同角色的用户，以便他们可以针对自己授权的资源在不同的层级进行工作。一开始，系统默认只有一个用户 `admin`，具有 `platform-admin` 角色。在本步骤中，您将创建一个示例用户 `ws-manager`。

1. 以 `admin` 身份使用默认帐户和密码 (`admin/P@88w0rd`) 登录 Web 控制台。

   {{< notice tip >}}
   出于安全考虑，强烈建议您在首次登录控制台时更改密码。若要更改密码，在右上角的下拉列表中选择**用户设置**，在**密码设置**中设置新密码，您也可以在**用户设置** > **基本信息**中修改控制台语言。
   {{</ notice >}}

2. 点击左上角的**平台管理**，然后选择**访问控制**。在左侧导航栏中，选择**平台角色**。内置角色的描述信息如下表所示。

   <table>
     <tbody>
       <tr>
         <th width='160'>内置角色</th>
         <th>描述</th>
       </tr>
       <tr>
         <td><code>platform-self-provisioner</code></td>
         <td>创建企业空间并成为所创建企业空间的管理员。</td>
       </tr>
       </tr>
       <tr>
         <td><code>platform-regular</code></td>
         <td>平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。</td>
       </tr>
   <tr>
         <td><code>platform-admin</code></td>
         <td>平台管理员，可以管理平台内的所有资源。</td>
       </tr>
     </tbody>
   </table>

   {{< notice note >}}
   内置角色由 KubeSphere 自动创建，无法编辑或删除。
   {{</ notice >}}

3. 在**用户**中，点击**创建**。在弹出的对话框中，提供所有必要信息（带有*标记）。在**平台角色**下拉列表，选择**platform-self-provisioner**。

   完成后，点击**确定**。新创建的用户将显示在**用户**页面。

   {{< notice note >}}
   如果您在此处未指定**平台角色**，该用户将无法执行任何操作。您需要在创建企业空间后，将该用户邀请至企业空间。
   {{</ notice >}}

4. 重复以上的步骤创建新用户，这些用户将在其他的教程中使用。

   {{< notice tip >}}
   - 帐户登出请点击右上角的用户名，然后选择**登出**。
   - 下面仅为示例用户名，请根据实际情况修改。
   {{</ notice >}}

   <table>
     <tbody>
       <tr>
         <th width='140'>用户</th>
         <th> 指定的平台角色</th>
         <th width='300'>用户权限</th>
       </tr>
       </tr>
       <tr>
         <td><code>ws-admin</code></td>
         <td><code>platform-regular</code></td>
         <td>被邀请到企业空间后，管理该企业空间中的所有资源（在此示例中，此用户用于邀请新成员加入该企业空间）。</td>
       </tr><tr>
         <td><code>project-admin</code></td>
         <td><code>platform-regular</code></td>
         <td>创建和管理项目以及 DevOps 项目，并邀请新成员加入项目。</td>
       </tr><tr>
         <td><code>project-regular</code></td>
         <td><code>platform-regular</code></td>
       <td><code>project-regular</code> 将由 <code>project-admin</code> 邀请至项目或 DevOps 项目。该用户将用于在指定项目中创建工作负载、流水线和其他资源。</td>
       </tr>
     </tbody>
   </table>

5. 在**用户**页面，查看创建的用户。

   {{< notice note >}}

   您可以点击用户名称后的 <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" /> 图标选择启用或禁用某个用户。您也可以勾选多个用户进行批量操作。

   {{</ notice >}} 
### 步骤 2：创建企业空间

作为管理项目、DevOps 项目和组织成员的基本逻辑单元，企业空间是 KubeSphere 多租户系统的基础。

1. 在左侧导航栏，选择**企业空间**。企业空间列表中已列出默认企业空间 **system-workspace**，该企业空间包含所有系统项目。其中运行着与系统相关的组件和服务，您无法删除该企业空间。

2. 在企业空间列表页面，点击**创建**，输入企业空间的名称（例如 **demo-workspace**），并将用户 `ws-admin` 设置为企业空间管理员。完成后，点击**创建**。

   {{< notice note >}}

   如果您已启用[多集群功能](../../multicluster-management/)，您需要为企业空间[分配一个或多个可用集群](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#在创建企业空间时选择可用集群)，以便项目可以在集群中创建。

   {{</ notice >}} 

3. 登出控制台，然后以 `ws-admin` 身份重新登录。在**企业空间设置**中，选择**企业空间成员**，然后点击**邀请**。

4. 邀请 `project-admin` 和 `project-regular` 进入企业空间，分别授予 `demo-workspace-self-provisioner` 和 `demo-workspace-viewer` 角色，点击**确定**。

   {{< notice note >}}
实际角色名称的格式：`<workspace name>-<role name>`。例如，在名为 `demo-workspace` 的企业空间中，角色 `viewer` 的实际角色名称为 `demo-workspace-viewer`。
   {{</ notice >}}

5. 将 `project-admin` 和 `project-regular` 都添加到企业空间后，点击**确定**。在**企业空间成员**中，您可以看到列出的三名成员。

   <table>
     <tbody>
       <tr>
         <th width='150'>用户</th>
         <th width='150'>分配的企业空间角色</th>
         <th>角色权限</th>
       </tr>
       <tr>
         <td><code>ws-admin</code></td>
         <td><code>demo-workspace-admin</code></td>
         <td>管理指定企业空间中的所有资源（在此示例中，此用户用于邀请新成员加入企业空间）。</td>
       </tr>
       <tr>
         <td><code>project-admin</code></td>
         <td><code>demo-workspace-self-provisioner</code></td>
         <td>创建和管理项目以及 DevOps 项目，并邀请新成员加入项目。</td>
       </tr><tr>
         <td><code>project-regular</code></td>
         <td><code>demo-workspace-viewer</code></td>
       <td><code>project-regular</code> 将由 <code>project-admin</code> 邀请至项目或 DevOps 项目。该用户将用于在指定项目中创建工作负载、流水线和其他资源。</td>
       </tr>
     </tbody>
   </table>

### 步骤 3：创建项目

在此步骤中，您需要使用在上一步骤中创建的帐户 `project-admin` 来创建项目。KubeSphere 中的项目与 Kubernetes 中的命名空间相同，为资源提供了虚拟隔离。有关更多信息，请参见[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

1. 以 `project-admin` 身份登录 KubeSphere Web 控制台，在**项目**中，点击**创建**。

2. 输入项目名称（例如 `demo-project`），点击**确定**。您还可以为项目添加别名和描述。

3. 在**项目**中，点击刚创建的项目查看其详情页面。

4. 在项目的**概览**页面，默认情况下未设置项目配额。您可以点击**编辑配额**并根据需要指定[资源请求和限制](../../workspace-administration/project-quotas/)（例如：CPU 和内存的限制分别设为 1 Core 和 1000 Gi）。

5. 在**项目设置** > **项目成员**中，邀请 `project-regular` 至该项目，并授予该用户 `operator` 角色。

   {{< notice info >}}
   具有 `operator` 角色的用户是项目维护者，可以管理项目中除用户和角色以外的资源。
   {{</ notice >}}
   
6. 在创建[应用路由](../../project-user-guide/application-workloads/routes/)（即 Kubernetes 中的 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)）之前，需要启用该项目的网关。网关是在项目中运行的 [NGINX Ingress 控制器](https://github.com/kubernetes/ingress-nginx)。若要设置网关，请转到**项目设置**中的**网关设置**，然后点击**设置网关**。此步骤中仍使用帐户 `project-admin`。

7. 选择访问方式 **NodePort**，然后点击**确定**。

8. 在**网关设置**下，可以在页面上看到网关地址以及 http/https 的端口。

   {{< notice note >}}
   如果要使用 `LoadBalancer` 暴露服务，则需要使用云厂商的 LoadBalancer 插件。如果您的 Kubernetes 集群在裸机环境中运行，建议使用 [OpenELB](https://github.com/kubesphere/openelb) 作为 LoadBalancer 插件。
   {{</ notice >}}

### 步骤 4：创建角色

完成上述步骤后，您已了解可以为不同级别的用户授予不同角色。先前步骤中使用的角色都是 KubeSphere 提供的内置角色。在此步骤中，您将学习如何创建自定义角色以满足工作需求。

1. 再次以 `admin` 身份登录 KubeSphere Web 控制台，转到**访问控制**。

2. 点击左侧导航栏中的**平台角色**，再点击右侧的**创建**。

   {{< notice note >}}

   **平台角色**页面的预设角色无法编辑或删除。

   {{</ notice >}}

3. 在**创建平台角色**对话框中，设置角色标识符（例如，`clusters-admin`）、角色名称和描述信息，然后点击**编辑权限**。

   {{< notice note >}}

   本示例演示如何创建负责集群管理的角色。

   {{</ notice >}}

4. 在**编辑权限**对话框中，设置角色权限（例如，选择**集群管理**）并点击**确定**。

   {{< notice note >}}

   * 在本示例中，角色 `clusters-admin` 包含**集群管理**和**集群查看**权限。
   * 一些权限依赖于其他权限，依赖项由每项权限下的**依赖于**字段指定。
   * 选择权限后，将自动选择它所依赖的权限。
   * 若要取消选择权限，则需要首先取消选择其从属权限。

   {{</ notice >}}

5. 在**平台角色**页面，可以点击所创建角色的名称查看角色详情，点击 <img src="/images/docs/v3.3/zh-cn/quickstart/create-workspaces-projects-accounts/操作按钮.png" width="20px" align="center" /> 以编辑角色、编辑角色权限或删除该角色。

6. 在**用户**页面，可以在创建帐户或编辑现有帐户时为帐户分配该角色。

### 步骤 5：创建 DevOps 项目（可选）

{{< notice note >}}

若要创建 DevOps 项目，需要预先启用 KubeSphere DevOps 系统，该系统是个可插拔的组件，提供 CI/CD 流水线、Binary-to-Image 和 Source-to-Image 等功能。有关如何启用 DevOps 的更多信息，请参见 [KubeSphere DevOps 系统](../../pluggable-components/devops/)。

{{</ notice >}}

1. 以 `project-admin` 身份登录控制台，在 **DevOps 项目**中，点击**创建**。

2. 输入 DevOps 项目名称（例如 `demo-devops`），然后点击**确定**，也可以为该项目添加别名和描述。

3. 点击刚创建的项目查看其详细页面。

4. 转到 **DevOps 项目设置**，然后选择 **DevOps 项目成员**。点击**邀请**授予 `project-regular` 用户 `operator` 的角色，允许其创建流水线和凭证。


至此，您已熟悉 KubeSphere 的多租户管理系统。在其他教程中，`project-regular` 帐户还将用于演示如何在项目或 DevOps 项目中创建应用程序和资源。
