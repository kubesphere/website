---
title: "配置 S2I 和 B2I Webhooks"
keywords: 'KubeSphere, Kubernetes, S2I, Source-to-Image, B2I, Binary-to-Image, Webhook'
description: '学习如何配置 S2I 和 B2I webhooks。'
linkTitle: "配置 S2I 和 B2I  Webhooks"
weight: 10650

---

KubeSphere 提供 Source-to-Image (S2I) 和 Binary-to-Image (B2I) 功能，以自动化镜像构建、推送和应用程序部署。在 KubeSphere 3.3 中，您可以配置 S2I 和 B2I Webhook，以便当代码仓库中存在任何相关活动时，自动触发镜像构建器。

本教程演示如何配置 S2I 和 B2I webhooks。

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)，该系统已集成 S2I。
- 您需要创建一个创建企业空间，一个项目 (`demo-project`) 和一个用户 (`project-regular`)。`project-regular` 需要被邀请到项目中，并赋予 `operator` 角色。有关详细信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account)。
- 您需要创建一个 S2I 镜像构建器和 B2I 镜像构建器。有关更多信息，请参见 [Source to Image：无需 Dockerfile 发布应用](../source-to-image/)和[Binary to Image：发布制品到 Kubernetes](../binary-to-image/)。

## 配置 S2I Webhook

### 步骤 1: 暴露 S2I trigger 服务

1. 以 `admin` 身份登录 KubeSphere Web 控制台。在左上角点击**平台管理**，然后选择**集群管理**。

2. 前往**应用负载**下的**服务**，从下拉框中选择 **kubesphere-devops-system**，然后点击 **s2ioperator-trigger-service** 进入详情页面。

3. 点击**更多操作**，选择**编辑外部访问**。

4. 在弹出的对话框中，从**访问方式**的下拉菜单中选择 **NodePort**，然后点击**确定**。

   {{< notice note >}}

   本教程出于演示目的选择 **NodePort**。根据您的需要，您也可以选择 **LoadBalancer**。

   {{</ notice >}}

5. 在详情界面可以查看 **NodePort**。S2I webhook URL 中将包含此 NodePort。

### 步骤 2：配置 S2I webhook

1. 登出 KubeSphere 并以 `project-regular` 用户登回。然后转到 `demo-project`。

2. 在**镜像构建器**中，点击 S2I 镜像构建器，进入详情页面。

3. 您可以在**远程触发器**中看到自动生成的链接。复制 `/s2itrigger/v1alpha1/general/namespaces/demo-project/s2ibuilders/felixnoo-s2i-sample-latest-zhd/`，S2I webhook URL 中将包含这个链接。

4. 登录您的 GitHub 帐户，转到用于 S2I 镜像构建器的源代码仓库。转到 **Settings** 下的 **Webhooks**，然后点击 **Add webhook**。

5. 在 **Payload URL**，输入 `http://<IP>:<Service NodePort>/s2itrigger/v1alpha1/general/namespaces/demo-project/s2ibuilders/felixnoo-s2i-sample-latest-zhd/`。您可以按需选择触发事件，然后点击 **Add webhook**。本教程出于演示目的，选择 **Just the push event**。

   {{< notice note >}}

   `<IP>` 是您自己的 IP 地址，`<Service NodePort>` 是您在第一步中获得的 NodePort。`/s2itrigger/v1alpha1/general/namespaces/demo-project/s2ibuilders/felixnoo-s2i-sample-latest-zhd/` 来自 S2I 的远程触发器链接。确保您用的是您自己的 IP 地址、Service NodePort 和 S2I 远程触发器链接。根据您 Kubernetes 集群的部署位置，您可能还需要配置必要的端口转发规则并在安全组中打开端口。

   {{</ notice >}}

6. 添加 webhook 后，您可以点击 webhook 查看 **Recent Deliveries** 中的交付详细信息。如果有效负载 URL 有效，您可以看到绿色的勾号。

7. 完成上述所有操作后，如果源代码仓库中存在推送事件，则会自动触发 S2I 镜像构建器。

## 配置 B2I Webhook

您可以按照相同的步骤配置 B2I webhook。

1. 暴露 S2I 触发器服务。

2. 在 B2I 镜像构建器的详细信息页面中查看**远程触发器**。

3. 在源代码仓库中添加有效负载 URL。B2I 有效负载 URL 格式与 S2I 有效负载 URL 格式相同。

   {{< notice note >}}

   根据您 Kubernetes 集群的部署位置，您可能需要配置必要的端口转发规则并在安全组中打开端口。

   {{</ notice >}}

4. 如果源代码仓库发生相关事件，B2I 镜像构建器将自动触发。






