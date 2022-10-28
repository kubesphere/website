---
title: "启用可插拔组件"
keywords: 'KubeSphere，Kubernetes，可插拔，组件'
description: '了解如何在 KubeSphere 上启用可插拔组件，以便您全方位地探索 KubeSphere。安装前和安装后均可启用可插拔组件。'
linkTitle: "启用可插拔组件"
weight: 2600
---

本教程演示如何在安装前或安装后启用 KubeSphere 的可插拔组件。请参照下表了解 KubeSphere 的全部可插拔组件。

| 配置项 | 功能组件               | 描述                                                  |
| ------------------ | ------------------------------------- | ------------------------------------------------------------ |
| `alerting`         | KubeSphere 告警系统          | 可以为工作负载和节点自定义告警策略。告警策略被触发后，告警消息会通过不同的渠道（例如，邮件和 Slack）发送至接收人。 |
| `auditing`         | KubeSphere 审计日志系统           | 提供一套与安全相关并按时间顺序排列的记录，记录平台上不同租户的活动。 |
| `devops`           | KubeSphere DevOps 系统              | 基于 Jenkins 提供开箱即用的 CI/CD 功能，提供一站式 DevOps 方案、内置 Jenkins 流水线与 B2I & S2I。 |
| `events`           | KubeSphere 事件系统              | 提供一个图形化的 Web 控制台，用于导出、过滤和警告多租户 Kubernetes 集群中的 Kubernetes 事件。|
| `logging`          | KubeSphere 日志系统             | 在统一的控制台中提供灵活的日志查询、收集和管理功能。可以添加第三方日志收集器，例如 Elasticsearch、Kafka 和 Fluentd。 |
| `metrics_server`  | HPA                                   | 根据设定指标对 Pod 数量进行动态伸缩，使运行在上面的服务对指标的变化有一定的自适应能力。|
| `networkpolicy`    | 网络策略                        | 可以在同一个集群内部之间设置网络策略（比如限制或阻止某些实例 Pod 之间的网络请求）。|
| `kubeedge` | KubeEdge | 为集群添加边缘节点并在这些节点上运行工作负载。 |
| `openpitrix`       | KubeSphere 应用商店                  | 基于 Helm 的应用程序商店，允许用户管理应用的整个生命周期。|
| `servicemesh`      | KubeSphere 服务网格 (基于 Istio) | 提供细粒度的流量治理、可观测性、流量追踪以及可视化流量拓扑图。 |
| `ippool` | 容器组 IP 池 | 创建容器组 IP 池并从 IP 池中分配 IP 地址到 Pod。 |
| `topology` | 服务拓扑图 | 集成 [Weave Scope](https://www.weave.works/oss/scope/) 以查看应用和容器的服务间通信（拓扑图）。 |

有关每个组件的更多信息，请参见[启用可插拔组件概述](../../pluggable-components/overview/)。

{{< notice note >}}

- `multicluster` 不在本教程中介绍。如果要启用此功能，则需要为 `clusterRole` 设置相应的值。有关详细信息，请参见[多集群管理](../../multicluster-management/)。
- 在安装前，请确保您的机器符合硬件要求。如果想启用所有的可插拔组件，请参考推荐机器配置：CPU ≥ 8 Core，内存 ≥ 16 G，磁盘空间 ≥ 100 G。

{{</ notice >}}

## 在安装前启用可插拔组件

对于大多数可插拔组件，您可以按照以下步骤来启用。如需启用 [KubeEdge](../../pluggable-components/kubeedge/)、[容器组 IP 池](../../pluggable-components/pod-ip-pools/)以及[服务拓扑图](../../pluggable-components/service-topology/)，请直接参照相应的教程。

### **在 Linux 上安装**

在 Linux 上安装 KubeSphere 时，需要创建一个配置文件，该文件列出所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件名为 `config-sample.yaml` 的配置文件。通过执行以下命令来修改文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果采用 [All-in-one 模式安装](../../quick-start/all-in-one-on-linux/)，您无需创建 `config-sample.yaml` 文件，因为 all-in-one 模式可以通过一条命令直接创建集群。通常，all-in-one 模式适用于刚接触 KubeSphere 并希望快速上手该系统的用户。如果要在此模式下启用可插拔组件（例如，出于测试目的），请参考[在安装后启用可插拔组件](#在安装后启用可插拔组件)。
    {{</ notice >}}

2. 在此文件中，将 `enabled` 的值从 `false` 改为 `true`。这是[完整文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)供您参考，修改完成后保存文件。

3. 使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

在已有 Kubernetes 集群上安装 KubeSphere 时，需要部署 [ks-installer](https://github.com/kubesphere/ks-installer/) 的两个 YAML 文件。

1. 首先下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，然后打开编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在该本地文件 `cluster-configuration.yaml` 中，将对应组件 `enabled` 的值从 `false` 改为 `true`。

3. 编辑完成后保存文件，执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

无论是在 Linux 上还是在 Kubernetes 上安装 KubeSphere，安装后都可以在 KubeSphere 的 Web 控制台中检查已启用组件的状态。

## 在安装后启用可插拔组件

用户可以使用 KubeSphere Web 控制台查看和操作不同的资源。要在安装后启用可插拔组件，只需要在控制台中进行略微调整。对于那些习惯使用 Kubernetes 命令行工具 kubectl 的人来说，由于该工具已集成到控制台中，因此使用 KubeSphere 将毫无困难。

{{< notice note >}}

如需启用 [KubeEdge](../../pluggable-components/kubeedge/)、[容器组 IP 池](../../pluggable-components/pod-ip-pools/)以及[服务拓扑图](../../pluggable-components/service-topology/)，请直接参照相应的教程。

{{</ notice >}} 

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理** ，然后选择**集群管理**。

2. 点击**定制资源定义**，然后在搜索栏中输入 `clusterconfiguration`，点击搜索结果进入其详情页面。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不增加额外 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的三个点，然后选择**编辑 YAML**。

4. 在该配置文件中，将对应组件 `enabled` 的 `false` 更改为 `true`，以启用要安装的组件。完成后，点击**确定**以保存配置。

    ![启用组件](/images/docs/v3.3/zh-cn/quickstart/enable-pluggable-components/启用组件.png)

5. 执行以下命令，使用 Web kubectl 来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
您可以通过点击控制台右下角的锤子图标来找到 Web kubectl 工具。
    {{</ notice >}}

6. 如果组件安装成功，输出将显示以下消息。

    ```yaml
    #####################################################
    ###              Welcome to KubeSphere!           ###
    #####################################################

    Console: http://192.168.0.2:30880
    Account: admin
    Password: P@88w0rd

    NOTES：
      1. After you log into the console, please check the
         monitoring status of service components in
         "Cluster Management". If any service is not
         ready, please wait patiently until all components 
         are up and running.
      2. Please change the default password after login.

    #####################################################
    https://kubesphere.io             20xx-xx-xx xx:xx:xx
    #####################################################
    ```

7. 登录 KubeSphere 控制台，在**系统组件**中可以查看不同组件的状态。

    {{< notice tip >}}

如果在上图中看不到相关组件，可能是一些 Pod 尚未启动完成，可以通过 kubectl 执行 `kubectl get pod --all-namespaces` 来查看 Pod 的状态。
    {{</ notice >}}