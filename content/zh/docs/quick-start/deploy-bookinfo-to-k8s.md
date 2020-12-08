---
title: "部署 Bookinfo 和管理流量"
keywords: 'kubesphere, kubernetes, docker, 多租户'
description: '部署一个 Bookinfo 应用'

linkTitle: "部署 Bookinfo 和管理流量"
weight: 2400
---

[Istio](https://istio.io/)，作为一种开源服务网格解决方案，为微服务提供了强大的流量管理功能。以下是 [Istio](https://istio.io/latest/zh/docs/concepts/traffic-management/) 官方网站上关于流量管理的简介：

*Istio 的流量路由规则可以让您很容易的控制服务之间的流量和 API 调用。Istio 简化了服务级别属性的配置，比如熔断器、超时和重试，并且能轻松的设置重要的任务，如 A/B 测试、金丝雀发布、基于流量百分比切分的概率发布等。它还提供了开箱即用的故障恢复特性，有助于增强应用的健壮性，从而更好地应对被依赖的服务或网络发生故障的情况。*

KubeSphere 基于 Istio 提供了三种灰度策略，包括蓝绿部署，金丝雀发布和流量镜像。其中，金丝雀发布代表了一种有效的软件开发策略，在这种策略中，新版本被部署用于测试，基线版本留存在生产环境中。此策略为正在测试的新版本引入一部分流量，而生产版本将接收其余的流量。

## 目标

在本教程中，您将学习如何部署由四个独立的微服务组成的示例应用程序 Bookinfo，以及如何使用 KubeSphere 的流量管理功能来发布新版本。

## 前置条件

- 您需要启用 [KubeSphere 服务网格](../../pluggable-components/service-mesh/)。

- 您需要完成 [创建企业空间、项目、帐户和角色](../create-workspace-and-project/) 中的所有任务。

- 您需要启用**应用治理**。为此，请按照以下步骤操作:

  使用`project-admin`登录控制台并转到您的项目。找到**项目设置**下的**高级设置**，点击**编辑**，然后选择**编辑网关**。在出现的对话框中，打开**应用治理**旁边的开关。

    ![edit-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200908145220.png)

    ![switch-application-governance](https://ap3.qingstor.com/kubesphere-website/docs/20200908150358.png)

    {{< notice note >}}
您需要启用**应用治理**以使用追踪功能。启用后若无法访问路由，请检查您的路由（Ingress）是否已经添加注释（例如：`nginx.ingress.kubernetes.io/service-upstream: true`）。
    {{</ notice >}}

## 预计时间

20分钟左右。

## 什么是 Bookinfo 应用

Bookinfo 应用由如下四个独立的微服务组成，其中 **reviews** 微服务有三个版本。

- **productpage** 微服务会调用 **details** 和 **reviews** 用来生成页面。
- **details** 这个微服务中包含了书籍的信息。
- **reviews** 这个微服务中包含了书籍相关的评论，它还会调用 **ratings** 微服务。
- **ratings** 这个微服务中包含了由书籍评价组成的评级信息。

这个应用的端到端架构如下所示。更多详细信息，请参考 [Bookinfo 应用](https://istio.io/latest/zh/docs/examples/bookinfo/)。

![Bookinfo 应用](https://pek3b.qingstor.com/kubesphere-docs/png/20190718152533.png#align=left&display=inline&height=1030&originHeight=1030&originWidth=1712&search=&status=done&width=1712)

## 动手实验

### 任务 1: 部署 Bookinfo

1. 使用账户`project-regular`登录控制台并进入项目，转到**应用负载**下的**应用**，点击右侧的**部署示例应用**。

    ![sample-bookinfo](https://ap3.qingstor.com/kubesphere-website/docs/20200908100219.png)

2. 在出现的对话框中点击**下一步**，其中必填字段已经预先填充了，同时也已经设置了相关组件。您无需修改设置，只需在最后一页（**外网访问**）点击**创建**。

    ![create-bookinfo](https://ap3.qingstor.com/kubesphere-website/docs/20200908101041.png)

3. 在**工作负载**中，确保这四个部署都显示`running`，代表该应用已经成功创建。

    ![running](https://ap3.qingstor.com/kubesphere-website/docs/20200908101328.png)

    {{< notice note >}}
应用部署后运行起来可能需要几分钟完成。
    {{</ notice >}}

### 任务 2: 访问 Bookinfo

1. 在**应用**中，点击应用`bookinfo`查看详细信息。

    ![click-bookinfo](https://ap3.qingstor.com/kubesphere-website/docs/20200908102119.png)

    {{< notice note >}}
如果您无法在列表中看到该应用，请刷新页面。
    {{</ notice >}}

2. 在详细信息页面中显示了用于访问 Bookinfo 应用的主机名和端口号。

    ![detail-page](https://ap3.qingstor.com/kubesphere-website/docs/20200908102821.png)

3. 由于将通过 NodePort 在集群外访问该应用，因此您需要在安全组中为出站流量开放上图中的端口（在本例中，端口号为32277），并根据需要设置任意端口转发规则。

4. 编辑您的本地主机文件（`/etc/hosts`），添加一条配置将主机名映射到对应的公网 IP。例如：

    ```bash
    # {Public IP} {hostname}
    139.198.19.38 productpage.demo-project.192.168.0.2.nip.io
    ```

    {{< notice warning >}}
不要直接复制上述内容到本地主机文件，请将其替换成您自己环境的公网 IP 与主机名。
    {{</ notice >}}

5. 完成后，点击**点击访问**按钮访问该应用。

    ![click-to-visit](https://ap3.qingstor.com/kubesphere-website/docs/20200908105527.png)

6. 在应用详情页面，点击左下角的 **Normal user**。

    ![normal-user](https://ap3.qingstor.com/kubesphere-website/docs/20200908105756.png)

7. 在下图中，您可以注意到 **Book Reviews** 仅出现 **Reviewer1** 和 **Reviewer2** 并且没有任何星星，这是当前应用程序版本的状态。在下面的任务中，您可以通过金丝雀发布看到不同的 UI 展现。

    ![book-review](https://ap3.qingstor.com/kubesphere-website/docs/20200908110106.png)

### Task 3: 创建金丝雀发布

1. 回到 KubeSphere 控制台并选择**灰度发布**，点击**发布灰度任务**跳转到项目的**灰度发布**部分，然后选择**金丝雀发布**并且点击**发布任务**。

    ![create-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908110903.png)

    ![create-job](https://ap3.qingstor.com/kubesphere-website/docs/20200908111003.png)

2. 添加一个任务名称（例如：`canary-release`）然后点击**下一步**，选择 **reviews** 作为需要更改的组件并点击**下一步**。

    ![canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908111359.png)

3. 在下一个对话框中，输入`v2`作为**灰度版本号**并修改镜像为`kubesphere/examples-bookinfo-reviews-v2:1.13.0`（`v1`更改为`v2`），点击**下一步**继续。

    ![release-version](https://ap3.qingstor.com/kubesphere-website/docs/20200908111958.png)

4. 金丝雀发布支持两种发布策略：**按流量比例下发**和**按请求内容下发**。在本教程中，请选择**按流量比例下发**并为 v1 和 v2 设置相同的流量比例（各50%）。你可以点击中间的图标，然后向左或向右移动以更改流量比例，点击**创建**完成设置。

    ![create-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908113031.png)

5. 创建的任务将会显示在**任务状态**里。

    ![canary-release-test](https://ap3.qingstor.com/kubesphere-website/docs/20200908113728.png)

### Task 4: 验证金丝雀发布

再次访问 Bookinfo 网站，然后反复刷新浏览器，可以看到 **Book Reviews** 部分以 50% 的比率在 v1 和 v2 版本之间切换。

![verify-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/canary.gif)

### Task 5: 查看网络拓扑

1. 在运行 KubeSphere 的机器上执行以下命令来引入真实流量，每 0.5 秒模拟访问一次 Bookinfo。

    ```bash
    watch -n 0.5 "curl http://productpage.demo-project.192.168.0.2.nip.io:32277/productpage?u=normal"
    ```

    {{< notice note >}}
请确保将上述命令行中的项目名称，IP 地址和端口号替换成您自己环境的。
    {{</ notice >}}

2. 在 **Traffic Management** 中，可以看到不同微服务之间的通信、依赖关系、运行状态及性能。

    ![traffic-management](https://ap3.qingstor.com/kubesphere-website/docs/20200908133652.png)

3. 点击组件（例如：**reviews**）在右侧可以看到流量监控信息，显示 **Traffic**，**Success rate** 和 **Duration** 的实时数据。

    ![real-time-data](https://ap3.qingstor.com/kubesphere-website/docs/20200908134454.png)

### Task 6: 查看 Tracing 详情

KubeSphere 提供基于 [Jaeger](https://www.jaegertracing.io/) 的分布式追踪功能，用来对基于微服务的分布式应用程序进行监控及故障排查。

1. 在 **Tracing** 选项卡中，可以清楚地看到请求的所有阶段及内部调用，以及每个阶段的调用耗时。

    ![tracing](https://ap3.qingstor.com/kubesphere-website/docs/20200908135108.png)

2. 点击任意条目，可以深入查看请求的详细信息及该请求被处理的位置（在哪个机器或者容器）。

    ![tracing-kubesphere](https://ap3.qingstor.com/kubesphere-website/docs/20200908135252.png)

### Task 7: 接管所有流量

通过金丝雀发布，您可以通过引入部分实际流量并收集用户反馈来在线测试新版本。如果一切运行顺利，则可以将所有流量引入新版本。

1. 在**灰度发布**中，点击金丝雀发布任务。

    ![open-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908140138.png)

2. 在弹出的对话框中，点击 **reviews v2** 的三个点并选择**接管所有流量**。这代表 100% 的流量将会被发送到新版本（v2）。

    ![take-over-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908140314.png)

    {{< notice note >}}
如果新版本出现什么问题，可以随时回滚到之前的 v1 版本。
    {{</ notice >}}

3. 重新打开 Bookinfo 页面多刷新几次浏览器，您会发现页面只会显示 **reviews v2** 的结果（即带有黑色星标的评级）。

    ![finish-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908140921.png)

### Task 8: 移除旧版本

现在新版本 v2 成功接管了所有流量，您可以根据需要删除旧版本并释放 v1 的资源。

{{< notice warning >}}

删除某个版本后，相关的工作负载和基于 Istio 的配置资源也将被删除。

{{</ notice >}}

1. 在**灰度发布**中，点击金丝雀发布任务。

    ![open-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908140138.png)

2. 在弹出的对话框中，点击**任务下线**以移除旧版本。

    ![job-offline](https://ap3.qingstor.com/kubesphere-website/docs/20200908142246.png)

以上任务是使用金丝雀发布来控制流量和发布应用程序新版本的示例。您也可以尝试使用**灰度发布**中的其他不同发布策略，或者查看[项目用户指南](../../project-user-guide/grayscale-release/overview/)的相关章节。
