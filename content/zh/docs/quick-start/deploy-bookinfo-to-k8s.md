---
title: "部署并访问 Bookinfo"
keywords: 'KubeSphere, Kubernetes, Bookinfo, Istio'
description: '通过部署示例应用程序 Bookinfo 来探索 KubeSphere 服务网格的基本功能。'
linkTitle: "部署并访问 Bookinfo"
weight: 2400
---

作为开源的服务网格解决方案，[Istio](https://istio.io/) 为微服务提供了强大的流量管理功能。以下是 [Istio](https://istio.io/latest/zh/docs/concepts/traffic-management/) 官方网站上关于流量管理的简介：

*Istio 的流量路由规则可以让您很容易地控制服务之间的流量和 API 调用。Istio 简化了服务级别属性的配置，比如熔断器、超时、重试等，并且能轻松地设置重要的任务，如 A/B 测试、金丝雀发布、基于流量百分比切分的概率发布等。它还提供了开箱即用的故障恢复特性，有助于增强应用的健壮性，从而更好地应对被依赖的服务或网络发生故障的情况。*

为了给用户提供管理微服务的一致体验，KubeSphere 在容器平台上集成了 Istio。本教程演示了如何部署由四个独立的微服务组成的示例应用程序 Bookinfo，以及如何通过 NodePort 访问该应用。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P004C202109_%E9%83%A8%E7%BD%B2%E5%B9%B6%E8%AE%BF%E9%97%AE%20Bookinfo.mp4">
</video>

## 准备工作

- 您需要启用 [KubeSphere 服务网格](../../pluggable-components/service-mesh/)。

- 您需要完成[创建企业空间、项目、用户和角色](../create-workspace-and-project/)中的所有任务。

- 您需要启用**链路追踪**。有关更多信息，请参见[设置网关](../../project-administration/project-gateway/#设置网关)。

    {{< notice note >}}
  您需要启用**链路追踪**以使用追踪功能。启用后若无法访问路由 (Ingress)，请检查您的路由是否已经添加注释（例如：`nginx.ingress.kubernetes.io/service-upstream: true`）。
    {{</ notice >}}

## 什么是 Bookinfo 应用

Bookinfo 应用由以下四个独立的微服务组成，其中 **reviews** 微服务有三个版本。

- **productpage** 微服务会调用 **details** 和 **reviews** 用来生成页面。
- **details** 微服务中包含了书籍的信息。
- **reviews** 微服务中包含了书籍相关的评论，它还会调用 **ratings** 微服务。
- **ratings** 微服务中包含了由书籍评价组成的评级信息。

这个应用的端到端架构如下所示。有关更多详细信息，请参见 [Bookinfo 应用](https://istio.io/latest/zh/docs/examples/bookinfo/)。

![bookinfo](/images/docs/zh-cn/quickstart/deploy-bookinfo-to-k8s/bookinfo.png)

## 动手实验

### 步骤 1：部署 Bookinfo

1. 使用帐户 `project-regular` 登录控制台并访问项目 (`demo-project`)。前往**应用负载**下的**应用**，点击右侧的**部署示例应用**。

2. 在出现的对话框中点击**下一步**，其中必填字段已经预先填好，相关组件也已经设置完成。您无需修改设置，只需在最后一页（**路由设置**）点击**创建**。

    {{< notice note >}}

KubeSphere 会自动创建主机名。若要更改主机名，请将鼠标悬停在默认路由规则上，然后点击 <img src="/images/docs/zh-cn/quickstart/deploy-bookinfo-to-k8s/edit-icon.png" width='20px' /> 进行编辑。有关更多信息，请参见[创建基于微服务的应用](../../project-user-guide/application/compose-app/)。

    {{</ notice >}}

3. 在**工作负载**中，确保这四个部署都处于`运行中`状态，这意味着该应用已经成功创建。

    {{< notice note >}}可能需要等几分钟才能看到部署正常运行。
{{</ notice >}}

### 步骤 2：访问 Bookinfo

1. 在**应用**中，访问**自制应用**，点击应用 `bookinfo` 查看其详情页面。

    {{< notice note >}}如果您没有在列表中看到该应用，请刷新页面。
    {{</ notice >}}
    
2. 详情页面中显示了用于访问 Bookinfo 应用的主机名和端口号。

3. 由于将通过 NodePort 在集群外访问该应用，因此您需要在安全组中为出站流量开放上图中的端口，并按需设置端口转发规则。

4. 在本地 hosts 文件 (`/etc/hosts`) 中添加一个条目将主机名映射到对应的 IP 地址，例如：

    ```bash
    139.198.178.20 productpage.demo-project.192.168.0.2.nip.io
    ```
    
    {{< notice warning >}}

请勿直接复制上述内容到本地 hosts 文件，请将其替换成您自己的 IP 地址与主机名。
{{</ notice >}}


5. 完成后，点击**访问服务**访问该应用。

6. 在应用详情页面，点击左下角的 **Normal user**。

    ![normal-user](/images/docs/zh-cn/quickstart/deploy-bookinfo-to-k8s/normal-user.png)

7. 在下图中，您可以注意到 **Book Reviews** 板块仅出现 **Reviewer1** 和 **Reviewer2**，并且没有任何评级内容，因为这是当前应用版本的状态。若想探索更多流量管理相关的功能，您可以为该应用执行[金丝雀发布](../../project-user-guide/grayscale-release/canary-release/)。

    ![ratings-page](/images/docs/zh-cn/quickstart/deploy-bookinfo-to-k8s/ratings-page.png)

    {{< notice note >}}

KubeSphere 基于 Istio 提供了三种灰度策略，包括[蓝绿部署](../../project-user-guide/grayscale-release/blue-green-deployment/)，[金丝雀发布](../../project-user-guide/grayscale-release/canary-release/)和[流量镜像](../../project-user-guide/grayscale-release/traffic-mirroring/)。
    {{</ notice >}}