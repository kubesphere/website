---
title: "密钥"
keywords: 'KubeSphere, Kubernetes, 密钥'
description: '了解如何在 KubeSphere 中创建密钥。'
linkTitle: "密钥"
weight: 10410
---

Kubernetes [密钥 (Secret)](https://kubernetes.io/zh/docs/concepts/configuration/secret/) 可用于存储和管理密码、OAuth 令牌和 SSH 密钥等敏感信息。Pod 可以通过[三种方式](https://kubernetes.io/zh/docs/concepts/configuration/secret/#overview-of-secrets)使用密钥：

- 作为挂载到 Pod 中容器化应用上的卷中的文件。
- 作为 Pod 中容器使用的环境变量。
- 作为 kubelet 为 Pod 拉取镜像时的镜像仓库凭证。

本教程演示如何在 KubeSphere 中创建密钥。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建密钥

### 步骤 1：进入密钥页面

以 `project-regular` 用户登录控制台并进入项目，在左侧导航栏中选择**配置中心**下的**密钥**，然后点击**创建**。

![create-secrets](/images/docs/zh-cn/project-user-guide/configurations/secrets/create-secrets.png)

### 步骤 2：配置基本信息

设置密钥的名称（例如 `demo-secret`），然后点击**下一步**。

{{< notice tip >}}

您可以在对话框右上角启用**编辑模式**来查看密钥的 YAML 清单文件，并通过直接编辑清单文件来创建密钥。您也可以继续执行后续步骤在控制台上创建密钥。

{{</ notice >}} 

![set-secret](/images/docs/zh-cn/project-user-guide/configurations/secrets/set-secret.png)

### 步骤 3：设置密钥

1. 在**密钥设置**选项卡，从**类型**下拉列表中选择密钥类型。您可以在 KubeSphere 中创建以下密钥，类型对应 YAML 文件中的 `type` 字段。

   ![secret-type](/images/docs/zh-cn/project-user-guide/configurations/secrets/secret-type.png)

   {{< notice note >}}

   对于所有的密钥类型，配置在清单文件中 `data` 字段的所有键值对的值都必须是 base64 编码的字符串。KubeSphere 会自动将您在控制台上配置的值转换成 base64 编码并保存到 YAML 文件中。例如，密钥类型为**默认**时，如果您在**添加数据**页面将**键**和**值**分别设置为 `password` 和 `hello123`，YAML 文件中显示的实际值为 `aGVsbG8xMjM=`（即 `hello123` 的 base64 编码，由 KubeSphere 自动转换）。

   {{</ notice >}} 

   - **Opaque（默认）**：对应 Kubernetes 的 [Opaque](https://kubernetes.io/zh/docs/concepts/configuration/secret/#opaque-secret) 密钥类型，同时也是 Kubernetes 的默认密钥类型。您可以用此类型密钥创建任意自定义数据。点击**添加数据**为其添加键值对。

     ![default-secret](/images/docs/zh-cn/project-user-guide/configurations/secrets/default-secret.png)

   - **kubernetes.io/tls (TLS)**：对应 Kubernetes 的 [kubernetes.io/tls](https://kubernetes.io/zh/docs/concepts/configuration/secret/#tls-secret) 密钥类型，用于存储证书及其相关密钥。这类数据通常用于 TLS 场景，例如提供给应用路由 (Ingress) 资源用于终结 TLS 链接。使用此类型的密钥时，您必须为其指定**凭证**和**私钥**，分别对应 YAML 文件中的 `tls.crt` 和 `tls.key` 字段。

     ![tls](/images/docs/zh-cn/project-user-guide/configurations/secrets/tls.png)

   - **kubernetes.io/dockerconfigjson（镜像仓库密钥）**：对应 Kubernetes 的 [kubernetes.io/dockerconfigjson](https://kubernetes.io/zh/docs/concepts/configuration/secret/#docker-config-secrets) 密钥类型，用于存储访问 Docker 镜像仓库所需的凭证。有关更多信息，请参阅[镜像仓库](../image-registry/)。

     ![image-registry-secret](/images/docs/zh-cn/project-user-guide/configurations/secrets/image-registry-secret.png)

   - **kubernetes.io/basic-auth（帐户密码密钥）**：对应 Kubernetes 的 [kubernetes.io/basic-auth](https://kubernetes.io/zh/docs/concepts/configuration/secret/#basic-authentication-secret) 密钥类型，用于存储基本身份认证所需的凭证。使用此类型的密钥时，您必须为其指定**用户名**和**密码**，分别对应 YAML 文件中的 `username` 和 `password` 字段。

     ![account-password-secret](/images/docs/zh-cn/project-user-guide/configurations/secrets/account-password-secret.png)

2. 本教程以默认类型为例。点击**添加数据**，将**键 (Key)** 设置为 `MYSQL_ROOT_PASSWORD` 并将**值 (Value)** 设置为 `123456`，为 MySQL 设置密钥。 

   ![enter-key](/images/docs/zh-cn/project-user-guide/configurations/secrets/enter-key.png)

3.  点击对话框右下角的 **√** 以确认配置。您可以继续为密钥添加键值对或点击**创建**完成操作。有关密钥使用的更多信息，请参阅[创建并发布 WordPress](../../../quick-start/wordpress-deployment/#任务-3创建应用程序)。

## 查看密钥详情

1. 密钥创建后会显示在如图所示的列表中。您可以点击右边的 <img src="/images/docs/zh-cn/project-user-guide/configurations/secrets/three-dots.png" width="20px" />，并从下拉菜单中选择操作来修改密钥。

    ![secret-list](/images/docs/zh-cn/project-user-guide/configurations/secrets/secret-list.png)

    - **编辑**：查看和编辑基本信息。
    - **编辑配置文件**：查看、上传、下载或更新 YAML 文件。
    - **编辑密钥**：修改密钥键值对。
    - **删除**：删除密钥。

2. 点击密钥名称打开密钥详情页面。在**详情**选项卡，您可以查看密钥的所有键值对。

    ![secret-detail-page](/images/docs/zh-cn/project-user-guide/configurations/secrets/secret-detail-page.png)

    {{< notice note >}}

如上文所述，KubeSphere 自动将键值对的值转换成对应的 base64 编码。您可以点击右边的 <img src="/images/docs/zh-cn/project-user-guide/configurations/secrets/eye-icon.png" width="20px" /> 查看解码后的值。

{{</ notice >}} 

3. 点击**更多操作**对密钥进行其他操作。

    ![secret-dropdown-menu](/images/docs/zh-cn/project-user-guide/configurations/secrets/secret-dropdown-menu.png)

    - **编辑配置文件**：查看、上传、下载或更新 YAML 文件。
    - **编辑密钥**：修改密钥键值对。
    - **删除**：删除密钥并返回密钥列表页面。


## 使用密钥

通常情况下，在创建工作负载、[服务](../../../project-user-guide/application-workloads/services/)、[任务](../../../project-user-guide/application-workloads/jobs/)或[定时任务](../../../project-user-guide/application-workloads/cronjobs/)时，您需要使用密钥。例如，您可以为代码仓库选择密钥。有关更多信息，请参阅[镜像仓库](../image-registry/)。

![use-secret-repository](/images/docs/zh-cn/project-user-guide/configurations/secrets/use-secret-repository.png)

此外，您还可以用密钥为容器添加环境变量。您可以在**容器镜像**页面勾选**环境变量**，点击**引用配置文件或密钥**，然后从下拉列表中选择一个密钥。

![use-secret-image](/images/docs/zh-cn/project-user-guide/configurations/secrets/use-secret-image.png)

## 创建常用密钥

本节介绍如何为 Docker Hub 帐户和 GitHub 帐户创建密钥。

### 创建 Docker Hub 密钥

1. 以 `project-regular` 用户登录 KubeSphere 并进入您的项目。在左侧导航栏中选择**配置中心**下的**密钥**，然后在页面右侧点击**创建**。

2. 设置密钥名称（例如 `dockerhub-id`）并点击**下一步**。在**密钥设置**页面，设置以下参数，然后点击**验证**以检查设置的信息是否有效。

   **类型**：选择**kubernetes.io/dockerconfigjson（镜像仓库密钥）**。

   **仓库地址**：输入您的 Docker Hub 仓库地址，例如 `docker.io`。

   **用户名**：输入您的 Docker ID。

   **密码**：输入您的 Docker Hub 密码。

   ![docker-hub-secret](/images/docs/zh-cn/project-user-guide/configurations/secrets/docker-hub-secret.png)

3. 点击**创建**完成操作。

### 创建 GitHub 密钥

1. 以 `project-regular` 用户登录 KubeSphere 并进入您的项目。在左侧导航栏中选择**配置中心**下的**密钥**，然后在页面右侧点击**创建**。

2. 设置密钥名称（例如 `github-id`）并点击**下一步**。在**密钥设置**页面，设置以下参数。

   **类型**：选择**kubernetes.io/basic-auth（帐户密码密钥）**。

   **用户名**：输入您的 GitHub 帐户。

   **密码**：输入您的 GitHub 密码。

   ![github-secret](/images/docs/zh-cn/project-user-guide/configurations/secrets/github-secret.png)

3. 点击**创建**完成操作。