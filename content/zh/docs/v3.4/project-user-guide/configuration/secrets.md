---
title: "保密字典"
keywords: 'KubeSphere, Kubernetes, 保密字典'
description: '了解如何在 KubeSphere 中创建保密字典。'
linkTitle: "保密字典"
weight: 10410
version: "v3.4"
---

Kubernetes [保密字典 (Secret)](https://kubernetes.io/zh/docs/concepts/configuration/secret/) 可用于存储和管理密码、OAuth 令牌和 SSH 保密字典等敏感信息。容器组可以通过[三种方式](https://kubernetes.io/zh/docs/concepts/configuration/secret/#overview-of-secrets)使用保密字典：

- 作为挂载到容器组中容器化应用上的卷中的文件。
- 作为容器组中容器使用的环境变量。
- 作为 kubelet 为容器组拉取镜像时的镜像仓库凭证。

本教程演示如何在 KubeSphere 中创建保密字典。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建保密字典

### 步骤 1：进入保密字典页面

以 `project-regular` 用户登录控制台并进入项目，在左侧导航栏中选择**配置**下的**保密字典**，然后点击**创建**。

### 步骤 2：配置基本信息

设置保密字典的名称（例如 `demo-secret`），然后点击**下一步**。

{{< notice tip >}}

您可以在对话框右上角启用**编辑 YAML** 来查看保密字典的 YAML 清单文件，并通过直接编辑清单文件来创建保密字典。您也可以继续执行后续步骤在控制台上创建保密字典。

{{</ notice >}} 

### 步骤 3：设置保密字典

1. 在**数据设置**选项卡，从**类型**下拉列表中选择保密字典类型。您可以在 KubeSphere 中创建以下保密字典，类型对应 YAML 文件中的 `type` 字段。

   {{< notice note >}}

   对于所有的保密字典类型，配置在清单文件中 `data` 字段的所有键值对的值都必须是 base64 编码的字符串。KubeSphere 会自动将您在控制台上配置的值转换成 base64 编码并保存到 YAML 文件中。例如，保密字典类型为**默认**时，如果您在**添加数据**页面将**键**和**值**分别设置为 `password` 和 `hello123`，YAML 文件中显示的实际值为 `aGVsbG8xMjM=`（即 `hello123` 的 base64 编码，由 KubeSphere 自动转换）。

   {{</ notice >}} 

   - **默认**：对应 Kubernetes 的 [Opaque](https://kubernetes.io/zh/docs/concepts/configuration/secret/#opaque-secret) 保密字典类型，同时也是 Kubernetes 的默认保密字典类型。您可以用此类型保密字典创建任意自定义数据。点击**添加数据**为其添加键值对。

   - **TLS 信息**：对应 Kubernetes 的 [kubernetes.io/tls](https://kubernetes.io/zh/docs/concepts/configuration/secret/#tls-secret) 保密字典类型，用于存储证书及其相关保密字典。这类数据通常用于 TLS 场景，例如提供给应用路由 (Ingress) 资源用于终结 TLS 链接。使用此类型的保密字典时，您必须为其指定**凭证**和**私钥**，分别对应 YAML 文件中的 `tls.crt` 和 `tls.key` 字段。

   - **镜像服务信息**：对应 Kubernetes 的 [kubernetes.io/dockerconfigjson](https://kubernetes.io/zh/docs/concepts/configuration/secret/#docker-config-secrets) 保密字典类型，用于存储访问 Docker 镜像仓库所需的凭证。有关更多信息，请参阅[镜像仓库](../image-registry/)。

   - **用户名和密码**：对应 Kubernetes 的 [kubernetes.io/basic-auth](https://kubernetes.io/zh/docs/concepts/configuration/secret/#basic-authentication-secret) 保密字典类型，用于存储基本身份认证所需的凭证。使用此类型的保密字典时，您必须为其指定**用户名**和**密码**，分别对应 YAML 文件中的 `username` 和 `password` 字段。

2. 本教程以默认类型为例。点击**添加数据**，将**键**设置为 `MYSQL_ROOT_PASSWORD` 并将**值**设置为 `123456`，为 MySQL 设置保密字典。 

3.  点击对话框右下角的 **√** 以确认配置。您可以继续为保密字典添加键值对或点击**创建**完成操作。有关保密字典使用的更多信息，请参阅[创建并发布 WordPress](../../../quick-start/wordpress-deployment/#任务-3创建应用程序)。

## 查看保密字典详情

1. 保密字典创建后会显示在如图所示的列表中。您可以点击右边的 <img src="/images/docs/v3.x/zh-cn/project-user-guide/configurations/secrets/three-dots.png" width="20px" />，并从下拉菜单中选择操作来修改保密字典。

    - **编辑信息**：查看和编辑基本信息。
    - **编辑 YAML**：查看、上传、下载或更新 YAML 文件。
    - **编辑设置**：修改保密字典键值对。
    - **删除**：删除保密字典。

2. 点击保密字典名称打开保密字典详情页面。在**数据**选项卡，您可以查看保密字典的所有键值对。

    {{< notice note >}}

如上文所述，KubeSphere 自动将键值对的值转换成对应的 base64 编码。您可以点击右边的 <img src="/images/docs/v3.x/zh-cn/project-user-guide/configurations/secrets/eye-icon.png" width="20px" /> 查看解码后的值。

{{</ notice >}} 

3. 点击**更多操作**对保密字典进行其他操作。

    - **编辑 YAML**：查看、上传、下载或更新 YAML 文件。
    - **编辑保密字典**：修改保密字典键值对。
    - **删除**：删除保密字典并返回保密字典列表页面。


## 使用保密字典

通常情况下，在创建工作负载、[服务](../../../project-user-guide/application-workloads/services/)、[任务](../../../project-user-guide/application-workloads/jobs/)或[定时任务](../../../project-user-guide/application-workloads/cronjobs/)时，您需要使用保密字典。例如，您可以为代码仓库选择保密字典。有关更多信息，请参阅[镜像仓库](../image-registry/)。

此外，您还可以用保密字典为容器添加环境变量。您可以在**容器镜像**页面勾选**环境变量**，点击**引用配置文件或保密字典**，然后从下拉列表中选择一个保密字典。

## 创建常用保密字典

本节介绍如何为 Docker Hub 帐户和 GitHub 帐户创建保密字典。

### 创建 Docker Hub 保密字典

1. 以 `project-regular` 用户登录 KubeSphere 并进入您的项目。在左侧导航栏中选择**配置**下的**保密字典**，然后在页面右侧点击**创建**。

2. 设置保密字典名称（例如 `dockerhub-id`）并点击**下一步**。在**数据设置**页面，设置以下参数，然后点击**验证**以检查设置的信息是否有效。

   **类型**：选择**镜像服务信息**。

   **仓库地址**：输入您的 Docker Hub 仓库地址，例如 `docker.io`。

   **用户名**：输入您的 Docker ID。

   **密码**：输入您的 Docker Hub 密码。

3. 点击**创建**完成操作。

### 创建 GitHub 保密字典

1. 以 `project-regular` 用户登录 KubeSphere 并进入您的项目。在左侧导航栏中选择**配置**下的**保密字典**，然后在页面右侧点击**创建**。

2. 设置保密字典名称（例如 `github-id`）并点击**下一步**。在**数据设置**页面，设置以下参数。

   **类型**：选择**用户名和密码**。

   **用户名**：输入您的 GitHub 帐户。

   **密码**：输入您的 GitHub 密码。

3. 点击**创建**完成操作。