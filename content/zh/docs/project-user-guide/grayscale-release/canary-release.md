---
title: "金丝雀发布"
keywords: 'KubeSphere, Kubernetes, 金丝雀发布, istio, 服务网格'
description: '了解如何在 KubeSphere 中部署金丝雀服务。'
linkTitle: "金丝雀发布"
weight: 10530
---

KubeSphere 基于 [Istio](https://istio.io/) 向用户提供部署金丝雀服务所需的控制功能。在金丝雀发布中，您可以引入服务的新版本，并向其发送一小部分流量来进行测试。同时，旧版本负责处理其余的流量。如果一切顺利，您就可以逐渐增加向新版本发送的流量，同时逐步停用旧版本。如果出现任何问题，您可以用 KubeSphere 更改流量比例来回滚至先前版本。

该方法能够高效地测试服务性能和可靠性，有助于在实际环境中发现潜在问题，同时不影响系统整体稳定性。

![canary-release-0](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-0.png)

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P005C202109_%E9%87%91%E4%B8%9D%E9%9B%80%E5%8F%91%E5%B8%83%E5%AE%9E%E8%B7%B5.mp4">
</video>

## 准备工作

- 您需要启用 [KubeSphere 服务网格](../../../pluggable-components/service-mesh/)。
- 您需要启用 [KubeSphere 日志系统](../../../pluggable-components/logging/)以使用 Tracing 功能。
- 您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)。请务必邀请该用户至项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要开启**应用治理**并有一个可用应用，以便实现该应用的金丝雀发布。本教程中使用的示例应用是 Bookinfo。有关更多信息，请参见[部署 Bookinfo 和管理流量](../../../quick-start/deploy-bookinfo-to-k8s/)。

## 步骤 1：创建金丝雀发布任务

1. 以 `project-regular` 身份登录 KubeSphere 控制台，转到**灰度发布**页面，在**发布模式**选项卡下，点击**金丝雀发布**右侧的**创建**。

2. 设置任务名称，点击**下一步**。

3. 在**服务设置**选项卡，从下拉列表中选择您的应用和要实现金丝雀发布的服务。如果您同样使用示例应用 Bookinfo，请选择 **reviews** 并点击**下一步**。

4. 在**新版本设置**选项卡，添加另一个版本（例如 `kubesphere/examples-bookinfo-reviews-v2:1.16.2`；将 `v1` 改为 `v2`）并点击**下一步**。

5. 您可以使用具体比例或者使用请求内容（例如 `Http Header`、`Cookie` 和 `URI`）分别向这两个版本（`v1` 和 `v2`）发送流量。选择**指定流量分配**，并拖动中间的滑块来更改向这两个版本分别发送的流量比例（例如设置为各 50%）。操作完成后，点击**创建**。

## 步骤 2：验证金丝雀发布

现在您有两个可用的应用版本，请访问该应用以验证金丝雀发布。

1. 访问 Bookinfo 网站，重复刷新浏览器。您会看到 **Book Reviews** 板块以 50% 的比例在 v1 版本和 v2 版本之间切换。

2. 金丝雀发布任务创建后会显示在**任务状态**选项卡下。点击该任务查看详情。

3. 您可以看到每个版本分别收到一半流量。

4. 新的部署也已创建。

5. 您可以执行以下命令直接获取虚拟服务来识别权重：

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

- 当您执行上述命令时，请将 `demo-project` 替换为您自己项目（即命名空间）的名称。
- 如果您想在 KubeSphere 控制台使用 Web kubectl 执行命令，则需要使用 `admin` 帐户登录。

{{</ notice >}} 

6. 预期输出：

   ```bash
   ...
   spec:
     hosts:
     - reviews
     http:
     - route:
       - destination:
           host: reviews
           port:
             number: 9080
           subset: v1
         weight: 50
       - destination:
           host: reviews
           port:
             number: 9080
           subset: v2
         weight: 50
         ...
   ```

## 步骤 3：查看网络拓扑

1. 在运行 KubeSphere 的机器上执行以下命令引入真实流量，每 0.5 秒模拟访问一次 Bookinfo。

   ```bash
   watch -n 0.5 "curl http://productpage.demo-project.192.168.0.2.nip.io:32277/productpage?u=normal"
   ```

   {{< notice note >}}
   请确保将以上命令中的主机名和端口号替换成您自己环境的。
   {{</ notice >}}

2. 在**流量监控**中，您可以看到不同服务之间的通信、依赖关系、运行状态及性能。

3. 点击组件（例如 **reviews**），在右侧可以看到流量监控信息，显示**流量**、**成功率**和**持续时间**的实时数据。

## 步骤 4：查看 Tracing 详情

KubeSphere 提供基于 [Jaeger](https://www.jaegertracing.io/) 的分布式追踪功能，用来对基于微服务的分布式应用程序进行监控及故障排查。

1. 在 **Tracing** 选项卡中，可以清楚地看到请求的所有阶段及内部调用，以及每个阶段的调用耗时。

2. 点击任意条目，可以深入查看请求的详细信息及该请求被处理的位置（在哪个机器或者容器）。

## 步骤 5：接管所有流量

如果一切运行顺利，则可以将所有流量引入新版本。

1. 在**任务状态**中，点击金丝雀发布任务。

2. 在弹出的对话框中，点击 **reviews v2** 右侧的 <img src="/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/three-dots.png" width="20px" />，选择**接管**。这代表 100% 的流量将会被发送到新版本 (v2)。

   {{< notice note >}}
   如果新版本出现任何问题，可以随时回滚到之前的 v1 版本。
   {{</ notice >}}

3. 再次访问 Bookinfo，多刷新几次浏览器，您会发现页面只会显示 **reviews v2** 的结果（即带有黑色星标的评级）。


