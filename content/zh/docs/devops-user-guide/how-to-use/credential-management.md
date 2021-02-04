---
title: "凭证管理"
keywords: 'Kubernetes, docker, credential, KubeSphere, devops'
description: '本教程演示了如何在 DevOps 项目中管理凭证。'
linkTitle: "凭证管理"
weight: 11230
---

凭证是包含了敏感数据的对象，例如用户名密码、SSH 密钥和一些 Token 等。 当 KubeSphere 流水线运行时，会与很多外部环境交互，如拉取代码，push/pull 镜像，SSH 连接至相关环境中执行脚本等，此过程中需提供一系列凭证，而这些凭证不应明文出现在流水线中。</br>
具有必要权限的 DevOps 项目用户可以为 Jenkins 管道配置凭证。一旦用户在 DevOps 项目中添加或配置了这些凭证，就可以在 DevOps 项目中使用它们与第三方应用程序进行交互。</br>
目前，您可以在 DevOps 项目中存储以下4种类型的凭证：

![create-credential-page](/images/docs/devops-user-guide-zh/credential-management-zh/create-credential-page.png)

- **账户凭证**: 可以作为单独的组件或以 `username：password` 格式用冒号分隔的字符串处理的用户名和密码，例如 GitHub，GitLab 和 Docker Hub 的帐户。
- **SSH**: 带有私钥的用户名，SSH 公/私钥对。
- **秘密文本**: 密钥存放于文本文件中。
- **kubeconfig**: 常用于配置跨集群认证， 如果选择此类型，将自动获取当前 Kubernetes 集群的 kubeconfig 文件内容，并自动填充在当前页面对话框中。

本教程演示了如何在 DevOps 项目中创建和管理凭证。

## 前提条件

- 您已启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

- 您有一个企业空间，一个 DevOps 项目和一个被邀请具有 DevOps 项目操作员角色的普通帐户（`企业空间普通成员`）。 如果尚未准备好，请参阅创[建企业空间，项目，帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建凭证

以`企业空间普通成员`身份登录 KubeSphere 控制台。 导航到您的 DevOps 项目，选择**凭证**，然后单击**创建**。

![create-credential-step1](/images/docs/devops-user-guide-zh/credential-management-zh/create-credential-step1.png)

### 创建 Docker Hub 凭证

1. 在出现的对话框中，提供以下信息。

![dockerhub-credentials](/images/docs/devops-user-guide-zh/credential-management-zh/dockerhub-credentials.png)

- **凭证 ID**：设置可以在流水线中使用的 ID，例如 `dockerhub-id`。
- **类型**： 选择 **账户凭证**。
- **用户名**：您的 Docker Hub 帐户（即 Docker ID）。
- **token/密码**：您的 Docker Hub 密码。
- **描述信息**：凭证的简介。

2. 完成后，单击**确定**。


### 创建 GitHub 凭证

同样，按照上述相同步骤创建 GitHub 凭证。 设置一个**凭证 ID**（例如 github-id），然后**类型**选择**账户凭证**。 分别输入 GitHub 用户名和密码作为**用户名**和**token/密码**。

{{< notice note >}}

如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，它们可能会在流水线运行时导致错误，因为它们可能无法识别。 在这种情况下，您需要先在某些第三方网站（例如 [urlencoder](https://www.urlencoder.org/) ）上对帐户或密码进行编码。 之后，复制并粘贴输出以获取您的凭证信息。

{{</ notice >}}

### 创建 Kubeconfig 凭证

同样，按照上述相同步骤创建 kubeconfig 凭证。 设置其凭证 ID（例如：`demo-kubeconfig`）并选择 **kubeconfig**。

{{< notice info >}}

用于配置对群集的访问的文件称为 kubeconfig 文件。 这是引用配置文件的通用方法。 有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)。 您可以创建 kubeconfig 凭证来访问当前的 Kubernetes 集群，该凭证将在流水线中使用，您不需要更改文件，因为 KubeSphere 会自动使用当前 Kubernetes 集群的 kubeconfig 填充该字段。访问其他集群时，可能需要更改 kubeconfig。

{{</ notice >}}

## 查看和管理凭证

1. 创建的凭据显示在列表中，如下所示。

![credentials-list](/images/docs/devops-user-guide-zh/credential-management-zh/credentials-list.png)

2. 单击任何一个都可以转到其详细信息页面，您可以在其中查看帐户详细信息以及与凭据有关的所有事件。

![credential-detail-page](/images/docs/devops-user-guide-zh/credential-management-zh/credential-detail-page.png)

3. 您也可以在此页面上编辑或删除凭据。 请注意，在编辑凭据时，KubeSphere 不会显示现有的用户名或密码信息。 如果输入新的用户名和密码，则前一个将被覆盖。

![edit-credentials](/images/docs/devops-user-guide-zh/credential-management-zh/edit-credentials.png)

有关如何使用凭据的更多信息，请参见[使用 Jenkinsfile 创建管道](../create-a-pipeline-using-jenkinsfile/)和[使用图形编辑面板创建管道](../create-a-pipeline-using-graphical-editing-panel)。