---
title: "金丝雀发布"
keywords: 'KubeSphere, Kubernetes, 金丝雀发布, istio, 服务网格'
description: '如何实现应用的金丝雀发布。'
linkTitle: "金丝雀发布"
weight: 10530
---

KubeSphere 基于 [Istio](https://istio.io/) 向用户提供部署金丝雀服务所需的控制功能。在金丝雀发布中，您可以引入服务的新版本，并向其发送一小部分流量来进行测试。同时，旧版本负责处理其余的流量。如果一切顺利，您可以逐渐增加向新版本发送的流量，并同时逐步停用旧版本。如果出现任何问题，您可以用 KubeSphere 更改流量比例来回滚至先前版本。

该方法能够高效地测试服务性能和可靠性，有助于在实际环境中发现潜在问题，同时不影响系统整体稳定性。

![canary-release-0](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-0.png)

## 准备工作

- 您需要启用 [KubeSphere 服务网格](../../../pluggable-components/service-mesh/)。
- 您需要创建一个企业空间、一个项目和一个帐号 (`project-regular`)。请务必邀请该帐号至项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project)。
- 您需要开启**应用治理**并有一个可用应用，以便实现该应用的金丝雀发布。本教程中使用的示例应用是 Bookinfo。有关更多信息，请参见[部署 Bookinfo 和管理流量](../../../quick-start/deploy-bookinfo-to-k8s/)。

## 创建金丝雀发布任务 (Job)

1. 以 `project-regular` 身份登录 KubeSphere 控制台，在**灰度策略**选项卡下，点击**金丝雀发布**右侧的**发布任务**。

   ![创建金丝雀发布](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/create-canary-release.PNG)

2. 设置名称，点击**下一步**。

   ![设置名称](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/set-task-name.PNG)

3. 从下拉列表中选择您的应用和要实现金丝雀发布的服务。如果您同样使用实例应用 Bookinfo，请选择 **reviews** 并点击**下一步**。

   ![cabary-release-3](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-3.PNG)

4. 在**灰度版本**页面，添加另一个版本（例如 `v2`）并点击下一步，如下图所示：

   ![canary-release-4](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-4.PNG)

   {{< notice note >}}

   截图中的镜像版本是 `v2`。

   {{</ notice >}} 

5. 您可以使用具体比例或者使用请求内容（例如 `Http Header`、`Cookie` 和 `URI`）分别向这两个版本（`v1` 和 `v2`）发送流量。选择**按流量比例下发**，并拖动滑块至中间来更改向这两个版本分别发送的流量比例（即设置为每个 50%）。操作完成后，点击**创建**。

   ![canary-release-5](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-5.gif)

6. 金丝雀发布任务创建后会显示在**任务状态**选项卡下。点击该任务查看详情。

   ![canary-release-job](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-job.PNG)

7. 稍等片刻，您可以看到每个版本分别收到一半流量：

   ![canary-release-6](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/canary-release-6.PNG)

8. 新的**部署**也已创建。

   ![deployment-list-1](/images/docs/project-user-guide/grayscale-release/canary-release/deployment-list-1.jpg)

9. 您可以执行以下命令直接获取虚拟服务来识别权重：

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - 当您执行上述命令时，请将 `demo-project` 替换为您自己项目（即命名空间）的名称。
   - 如果您想在 KubeSphere 控制台使用 Web kubectl 执行命令，则需要使用 `admin` 帐户登录。

   {{</ notice >}} 

10. 预期输出：

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

## 下线任务

1. 您实现金丝雀发布并且结果达到预期后，可以在菜单中选择**接管所有流量**，将所有流量发送至新版本。

   ![接管所有流量](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/take-over-traffic.PNG)

2. 待所有流量由新版本进行处理并要下架旧版本时，请点击**任务下线**。

   ![任务下线](/images/docs/zh-cn/project-user-guide/grayscale-release/canary-release/job-offline.PNG)
