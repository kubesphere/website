---
title: "流量镜像"
keywords: 'KubeSphere, Kubernetes, 流量镜像, Istio'
description: '了解如何在 KubeSphere 中执行流量镜像任务。'
linkTitle: "流量镜像"
weight: 10540
version: "v3.3"
---

流量镜像 (Traffic Mirroring)，也称为流量影子 (Traffic Shadowing)，是一种强大的、无风险的测试应用版本的方法，它将实时流量的副本发送给被镜像的服务。采用这种方法，您可以搭建一个与原环境类似的环境以进行验收测试，从而提前发现问题。由于镜像流量存在于主服务关键请求路径带外，终端用户在测试全过程不会受到影响。

## 准备工作

- 您需要启用 [KubeSphere 服务网络](../../../pluggable-components/service-mesh/)。
- 您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要启用**应用治理**，并有可用的应用，以便为该应用进行流量镜像。本教程以 Bookinfo 为例。有关更多信息，请参阅[部署 Bookinfo 和管理流量](../../../quick-start/deploy-bookinfo-to-k8s/)。

## 创建流量镜像任务

1. 以 `project-regular` 用户登录 KubeSphere 并进入项目。前往**灰度发布**页面，在页面右侧点击**流量镜像**右侧的**创建**。

2. 设置发布任务的名称并点击**下一步**。

3. 在**服务设置**选项卡，从下拉列表中选择需要进行流量镜像的应用和对应的服务（本教程以 Bookinfo 应用的 reviews 服务为例），然后点击**下一步**。

4. 在**新版本设置**选项卡，为应用添加另一个版本（例如 `kubesphere/examples-bookinfo-reviews-v2:1.16.2`；将 `v1` 改为 `v2`），然后点击**下一步**。

5. 在**策略设置**选项卡，点击**创建**。

6. 新建的流量镜像任务显示在**任务状态**页面。点击该任务查看详情。

7. 在详情页面，您可以看到流量被镜像至 `v2` 版本，同时折线图中显示实时流量。

8. 新建的部署也显示在**工作负载**下的**部署**页面。

9. 您可以执行以下命令查看虚拟服务的 `mirror` 和 `weight` 字段。

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - 请将上述命令中的 `demo-project` 修改成实际的项目（即命名空间）名称。
   - 您需要以 `admin` 用户重新登录才能在 KubeSphere 控制台的 Web kubectl 页面执行上述命令。

   {{</ notice >}} 

10. 预期输出结果：

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
          weight: 100
        mirror:
          host: reviews
          port:
            number: 9080
          subset: v2
          ...
    ```

    此路由规则将 100% 流量发送至 `v1`。`mirror` 部分的字段指定将流量镜像至 `reviews v2` 服务。当流量被镜像时，发送至镜像服务的请求的 Host/Authority 头部会附带 `-shadow` 标识。例如， `cluster-1` 会变成 `cluster-1-shadow`。

    {{< notice note >}}

这些请求以 Fire and Forget 方式镜像，亦即请求的响应会被丢弃。您可以指定 `weight` 字段来只镜像一部分而不是全部流量。如果该字段缺失，为与旧版本兼容，所有流量都会被镜像。有关更多信息，请参阅 [Mirroring](https://istio.io/v1.5/pt-br/docs/tasks/traffic-management/mirroring/)。

{{</ notice >}}

## 下线任务

您可以点击**删除**移除流量镜像任务。此操作不会影响当前的应用版本。
