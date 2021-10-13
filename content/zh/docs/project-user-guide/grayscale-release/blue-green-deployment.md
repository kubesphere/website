---
title: "蓝绿部署"
keywords: 'KubeSphere, Kubernetes, 服务网格, istio, 发布, 蓝绿部署'
description: '了解如何在 KubeSphere 中发布蓝绿部署。'

linkTitle: "蓝绿部署"
weight: 10520
---


蓝绿发布提供零宕机部署，即在保留旧版本的同时部署新版本。在任何时候，只有其中一个版本处于活跃状态，接收所有流量，另一个版本保持空闲状态。如果运行出现问题，您可以快速回滚到旧版本。

![blue-green-0](/images/docs/zh-cn/project-user-guide/grayscale-release/blue-green-deployment/blue-green-0.PNG)


## 准备工作

- 您需要启用 [KubeSphere 服务网格](../../../pluggable-components/service-mesh/)。
- 您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)，务必邀请该帐户到项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要启用**应用治理**并有一个可用应用，以便您可以实现该应用的蓝绿部署。本教程使用示例应用 Bookinfo。有关更多信息，请参见[部署 Bookinfo 和管理流量](../../../quick-start/deploy-bookinfo-to-k8s/)。

## 创建蓝绿部署任务

1. 以 `project-regular` 身份登录 KubeSphere，前往**灰度发布**页面，在**灰度策略**选项卡下，点击**蓝绿部署**右侧的**发布任务**。

2. 输入名称然后点击**下一步**。

3. 在**灰度组件**选项卡，从下拉列表选择您的应用以及想实现蓝绿部署的服务。如果您也使用示例应用 Bookinfo，请选择 **reviews** 并点击**下一步**。

4. 如下图所示，在**灰度版本**选项卡，添加另一个版本（例如 `v2`），然后点击**下一步**：

   ![blue-green-4](/images/docs/zh-cn/project-user-guide/grayscale-release/blue-green-deployment/blue-green-4.PNG)

   {{< notice note >}}

   截图中的镜像版本为 `v2`。

   {{</ notice >}} 

5. 在**策略配置**选项卡，要让应用版本 `v2` 接管所有流量，请选择**接管所有流量**，然后点击**创建**。

6. 蓝绿部署任务创建后，会显示在**任务状态**选项卡下。点击可查看详情。

   ![blue-green-任务列表](/images/docs/zh-cn/project-user-guide/grayscale-release/blue-green-deployment/blue-green-job-list.PNG)

7. 稍等片刻后，您可以看到所有流量都流向 `v2` 版本：

   ![blue-green-6](/images/docs/zh-cn/project-user-guide/grayscale-release/blue-green-deployment/blue-green-6.PNG)

8. 新的**部署**也已创建。

   ![版本2-部署](/images/docs/zh-cn/project-user-guide/grayscale-release/blue-green-deployment/version2-deployment.PNG)

9. 您可以执行以下命令直接获取虚拟服务来查看权重：

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - 当您执行上述命令时，请将 `demo-project` 替换成您自己的项目（即命名空间）名称。
   - 如果您想使用 KubeSphere 控制台上的 Web Kubectl 来执行命令，则需要使用 `admin` 帐户。

   {{</ notice >}}

10. 预期输出结果：

    ```yaml
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
              subset: v2
            weight: 100
            ...
    ```

## 下线任务

待您实现蓝绿部署并且结果满足您的预期，您可以点击**任务下线**来移除 `v1` 版本，从而下线任务。

![blue-green-7](/images/docs/zh-cn/project-user-guide/grayscale-release/blue-green-deployment/blue-green-7.PNG)

