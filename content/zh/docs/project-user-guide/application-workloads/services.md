---
title: "服务"
keywords: 'KubeSphere, Kubernetes, 服务, 工作负载'
description: '创建 KubeSphere 服务'
linkTitle: "服务"
weight: 10240
---

服务是一种抽象方法，它将运行在一组 Pod 上的应用程序暴露为网络服务。也就是说，服务将这些 Pod 的 Endpoint 组成一个单一资源，可以通过不同的方式访问该资源。

有了 Kubernetes，您无需修改应用程序来使用不熟悉的服务发现机制。Kubernetes 为 Pod 提供 IP 地址，为一组 Pod 提供一个单一 DNS 名称，并且可以在 Pod 之间进行负载均衡。

有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/services-networking/service/)。

## 访问类型

- **虚拟 IP**：虚拟 IP 基于集群生成的唯一 IP。集群内部可以通过该 IP 访问服务。此访问类型适用于大多数服务。此外，集群外部也可以通过 NodePort 和 LoadBalancer 访问服务。

- **Headless**：集群不为服务生成 IP 地址，在集群内通过服务的后端 Pod IP 直接访问服务。此访问类型适用于后端异构服务，例如需要区分 master 和 slave 的服务。

{{< notice tip>}}

在 KubeSphere 中，创建有状态服务和无状态服务时会默认生成一个虚拟 IP。如果您想创建 Headless 服务，请使用 **YAML** 直接进行配置。

{{</ notice>}}

## 准备工作

您需要创建一个企业空间、一个项目和一个帐户 (`project-regular`)，务必邀请该帐户到项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 服务类型

如下图所示，KubeSphere 提供三种创建服务的基本方法：**无状态服务**、**有状态服务**和**外部服务**。另外，您还可以通过**自定义创建**下面的**指定工作负载**和**编辑 YAML** 来自定义服务。

![创建服务类型](/images/docs/zh-cn/project-user-guide/application-workloads/services/create-service-type.png)

- **无状态服务**

  无状态服务是容器服务中最常用的服务类型。无状态服务定义 Pod 模板来控制 Pod 状态，包括滚动更新和回滚。您创建无状态服务时会同时创建**部署**工作负载。有关无状态服务的更多信息，请参见[部署](../../../project-user-guide/application-workloads/deployments/)。

- **有状态服务**

  有状态服务用于管理有状态应用程序，确保有序且优雅的部署和扩缩，还提供稳定的持久化存储以及网络标识符。您创建有状态服务时会同时创建**有状态副本集**工作负载。有关有状态服务的更多信息，请参见[有状态副本集](../../../project-user-guide/application-workloads/statefulsets/)。

- **外部服务**

  与无状态服务和有状态服务不同，ExternalName 服务将一个服务映射到一个 DNS 名称，而不是映射到选择器。您需要在 **ExternalName** 字段中指定这些服务，该字段显示在 YAML 文件中的 `externalName`。

- **指定工作负载**

  使用现有 Pod 创建服务。

- **编辑 YAML**

  使用 YAML 直接创建服务。您可以将 YAML 配置文件上传至控制台，也可以从控制台下载 YAML 配置文件。

  {{< notice tip>}}

关键字 `annotations:kubesphere.io/serviceType` 的值可以定义为 `statelessservice`、`statefulservice`、`externalservice` 和 `None`。

  {{</ notice>}}

## 创建无状态服务

### 步骤 1：打开仪表板

1. 在项目页面转到**应用负载**下的**服务**，点击**创建**。

    ![服务列表](/images/docs/zh-cn/project-user-guide/application-workloads/services/services-lists.PNG)

2. 点击**无状态服务**。

    ![无状态服务](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-form.PNG)

    {{< notice note >}}

创建有状态服务的步骤和创建无状态服务的步骤基本相同。本示例仅使用创建无状态服务的过程来进行演示。

    {{</ notice >}} 

### 步骤 2：输入基本信息

1. 在弹出的对话框中，您可以看到字段**版本**已经预先填写了 `v1`。您需要输入服务的名称，例如 `demo-service`。完成后，点击**下一步**继续。

    ![输入基本信息](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-form-1.PNG)

    - **名称**：服务和部署的名称，也是唯一标识符。
    - **别名**：服务的别名，使资源更容易识别。
    - **版本**：只能包含小写字母和数字，最长 16 个字符。

    {{< notice tip >}}

**名称**的值用于两个配置中，一个是部署，另一个是服务。您可以启用右上角的**编辑模式**查看部署的清单文件以及服务的清单文件。下方是一个示例文件，供您参考。

    {{</ notice>}}
    
    ``` yaml
    kind: Deployment
    metadata:
      labels:
        version: v1
        app: xxx
      name: xxx-v1
    spec:
      selector:
        matchLabels:
          version: v1
          app: xxx
      template:
        metadata:
          labels:
            version: v1
            app: xxx
    ---
    kind: Service
    metadata:
      labels:
        version: v1
        app: xxx
      name: xxx
    spec:
        metadata:
          labels:
            version: v1
            app: xxx
    ```

### 步骤 3：设置镜像

为服务添加容器镜像，详情请参见[设置镜像](../../../project-user-guide/application-workloads/deployments/#步骤-3设置镜像)。

![设置镜像](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-form-2.PNG)

{{< notice tip >}}

有关仪表板上各项属性的详细说明，请直接参见[容器镜像设置](../../../project-user-guide/application-workloads/container-image-settings/)。

{{</ notice >}}

### 步骤 4：挂载存储卷

要为服务挂载存储卷，详情请参见[挂载存储卷](../../../project-user-guide/application-workloads/deployments/#步骤-4挂载存储卷)。

![挂载存储卷](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-form-3.PNG)

### 步骤 5：配置高级设置

您可以设置节点调度策略并添加元数据，具体操作与[部署](../../../project-user-guide/application-workloads/deployments/#步骤-5配置高级设置)中的说明相同。对于服务，您可以看到两个额外选项可用，即**外网访问**和**开启会话保持**。

![高级设置](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-form-4.PNG)

- 外网访问

  您可以通过两种方法向外暴露服务，即 NodePort 和 LoadBalancer。

  - **NodePort**：在每个节点的 IP 地址上通过静态端口暴露服务。

  - **LoadBalancer**：客户端向负载均衡器的 IP 地址发送请求。

  {{< notice note >}}

该值由 `.spec.type` 字段指定。如果您选择 **LoadBalancer**，则需要同时为它添加注解。

  {{</ notice >}}

- 开启会话保持

  您可能想把从单个客户端会话发送的所有流量都路由到跨多个副本运行的应用的同一实例。这种做法降低了延迟，因此能更好地利用缓存。负载均衡的这种行为称为“会话保持 (Sticky Session)”。

  您可以在该字段设置最大会话保持时间，由清单文件中的 `.spec.sessionAffinityConfig.clientIP.timeoutSeconds` 指定，默认为 10800。

## 查看服务详情

### 详情页面

1. 创建服务后，您可以点击右侧的三个点进一步编辑它，例如元数据（**名称**无法编辑）、配置文件、端口以及外网访问。

    ![创建完成](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-finish.PNG)

    - **编辑**：查看和编辑基本信息。
    - **编辑配置文件**：查看、上传、下载或者更新 YAML 文件。
    - **编辑服务**：查看访问类型并设置选择器和端口。
    - **编辑外网访问**：编辑服务的外网访问方法。
    - **删除**：当您删除服务时，会在弹出对话框中显示关联资源。如果您勾选这些关联资源，则会与服务一同删除。

2. 点击服务名称可以转到它的详情页面。

    ![详情页面](/images/docs/zh-cn/project-user-guide/application-workloads/services/stateless-detail.PNG)

    - 点击**更多操作**展开下拉菜单，菜单内容与服务列表中的下拉菜单相同。
    - Pod 列表提供 Pod 的详细信息（运行状态、节点、Pod IP 以及资源使用情况）。
    - 您可以点击 Pod 条目查看容器信息。
    - 点击容器日志图标查看容器的输出日志。
    - 您可以点击 Pod 名称查看 Pod 详情页面。
