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

- **用户名和密码**：用户名和密码，可以作为单独的组件处理，或者作为用冒号分隔的字符串（格式为 `username:password`）处理，例如 GitHub 和 GitLab帐户。
- **SSH 密钥**：带有私钥的用户名，SSH 公钥/私钥对。
- **访问令牌**：具有访问权限的令牌。
- **kubeconfig**：用于配置跨集群认证。

本教程演示如何在 DevOps 项目中创建和管理凭证。有关如何使用凭证的更多信息，请参见[使用 Jenkinsfile 创建流水线](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/)和[使用图形编辑面板创建流水线](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/)。

## 准备工作

- 您已启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。
- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，并已邀请此帐户至 DevOps 项目中且授予 `operator` 角色。如果尚未准备好，请参见[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

## 创建凭证

1. 以 `project-regular` 身份登录 KubeSphere 控制台。

2. 进入您的 DevOps 项目，在左侧导航栏，选择**DevOps 项目设置 > 凭证**。

3. 在右侧的**凭证**区域，点击**创建**。

4. 在弹出的**创建凭证**对话框，输入凭证名称，并选择凭证类型。不同的凭证类型需要设置的参数不同，具体请参考以下内容。
### 创建用户名和密码凭证

以创建 GitHub 用户凭证为例，您需要设置以下参数：

- 名称：设置凭证名称，如 `github-id`。
- 类型：选择**用户名和密码**。
- 用户名：输入您的 GitHub 用户名。
- 密码/令牌：输入您的 GitHub 令牌。
- 描述：凭证的简介。

{{< notice note >}}

- 自 2021 年 8 月起，GitHub 要求使用基于令牌的身份验证，此处需要输入令牌，而非 GitHub 密码。关于如如何生成令牌，请参阅[创建个人访问令牌](https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)。

- 如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，您需要先在一些第三方网站（例如 [urlencoder](https://www.urlencoder.org/)）上对帐户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。

{{</ notice >}}

### 创建 SSH 密钥凭证

您需要设置以下参数：

- 名称：设置凭证名称。
- 类型：选择**SSH 密钥**。
- 用户名：输入您的用户名。
- 私钥：输入您的 SSH 密钥。
- 密码短语：输入密码短语。为了更好保护您的账户安全，建议设置该参数。
- 描述：凭证的简介。

### 创建访问令牌凭证

您需要设置以下参数：

- 名称：设置凭证名称。
- 类型：选择**访问令牌**。
- 令牌：输入您的令牌。
- 描述：凭证的简介。

### 创建 kubeconfig 凭证

您需要设置以下参数：

- 名称：设置凭证名称，例如 `demo-kubeconfig`。
- 类型：选择**kubeconfig**。
- 内容：系统自动获取当前 Kubernetes 集群的 kubeconfig 文件内容，并自动填充该字段，您无须做任何更改。但是访问其他集群时，您可能需要更改 kubeconfig。
- 描述：凭证的简介。

{{< notice info >}}

用于配置集群访问的文件称为 kubeconfig 文件。这是引用配置文件的通用方法。有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/)。

{{</ notice >}}

## 查看和管理凭证

1. 点击已创建的凭证，进入其详情页面，您可以查看帐户详情和与此凭证相关的所有事件。

2. 您也可以在此页面上编辑或删除凭证。请注意，编辑凭证时，KubeSphere 不会显示现有用户名或密码信息。如果输入新的用户名和密码，则前一个将被覆盖。
