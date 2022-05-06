---
title: "凭证管理"
keywords: 'Kubernetes, Docker, 凭证, KubeSphere, DevOps'
description: '创建凭证以便您的流水线可以与第三方应用程序或网站进行交互。'
linkTitle: "凭证管理"
weight: 11241
---

凭证是包含敏感信息的对象，例如用户名和密码、SSH 密钥和令牌 (Token)。当 KubeSphere DevOps 流水线运行时，会与外部环境中的对象进行交互，以执行一系列任务，包括拉取代码、推送和拉取镜像以及运行脚本等。此过程中需要提供相应的凭证，而这些凭证不会明文出现在流水线中。

具有必要权限的 DevOps 项目用户可以为 Jenkins 流水线配置凭证。用户在 DevOps 项目中添加或配置这些凭证后，便可以在 DevOps 项目中使用这些凭证与第三方应用程序进行交互。

目前，您可以在 DevOps 项目中创建以下 4 种类型的凭证：

- **用户名和密码**：用户名和密码，可以作为单独的组件处理，或者作为用冒号分隔的字符串（格式为 `username:password`）处理，例如 GitHub、GitLab 和 Docker Hub 的帐户。
- **SSH 密钥**：带有私钥的用户名，SSH 公钥/私钥对。
- **访问令牌**：具有访问权限的令牌。
- **kubeconfig**：用于配置跨集群认证。如果选择此类型，将自动获取当前 Kubernetes 集群的 kubeconfig 文件内容，并自动填充在当前页面对话框中。

本教程演示如何在 DevOps 项目中创建和管理凭证。有关如何使用凭证的更多信息，请参见[使用 Jenkinsfile 创建流水线](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/)和[使用图形编辑面板创建流水线](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/)。

## 准备工作

- 您已启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。
- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，并已邀请此帐户至 DevOps 项目中且授予 `operator` 角色。如果尚未准备好，请参见[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

## 创建凭证

以 `project-regular` 身份登录 KubeSphere 控制台。进入您的 DevOps 项目，选择**凭证**，然后点击**创建**。

### 创建 GitHub 凭证

同样地，按照上述相同步骤创建 GitHub 凭证。设置不同的**名称**（例如 `github-id`），**类型**同样选择**用户名和密码**。分别在**用户名**和 **密码/令牌**中输入您的 GitHub 用户名和令牌。

{{< notice note >}}

如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，您需要先在一些第三方网站（例如 [urlencoder](https://www.urlencoder.org/)）上对帐户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。

{{</ notice >}}

### 创建 kubeconfig 凭证

同样地，按照上述相同步骤创建 kubeconfig 凭证。设置不同的凭证 ID（例如 `demo-kubeconfig`）并选择 **kubeconfig**。

{{< notice info >}}

用于配置集群访问的文件称为 kubeconfig 文件。这是引用配置文件的通用方法。有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/)。您可以创建 kubeconfig 凭证来访问当前 Kubernetes 集群，该凭证将在流水线中使用。您不需要更改该文件，因为 KubeSphere 会自动使用当前 Kubernetes 集群的 kubeconfig 填充该字段。访问其他集群时，您可能需要更改 kubeconfig。

{{</ notice >}}

## 查看和管理凭证

1. 凭证创建后，会在列表中显示。

2. 点击任意一个凭证，进入其详情页面，您可以查看帐户详情和与此凭证相关的所有事件。

3. 您也可以在此页面上编辑或删除凭证。请注意，编辑凭证时，KubeSphere 不会显示现有用户名或密码信息。如果输入新的用户名和密码，则前一个将被覆盖。
