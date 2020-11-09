---
title: "启用可插拔功能组件"
keywords: 'KubeSphere, Kubernetes, 可插拔, 功能组件'
description: '启用可插拔功能组件'

linkTitle: "Enable Pluggable Components"
weight: 3060
---

本教程演示如何在安装前或安装后启用 KubeSphere 的可插拔组件。KubeSphere 具有以下列出的十个可插拔组件。

| 配置项 | 功能组件               | 描述                                                  |
| ------------------ | ------------------------------------- | ------------------------------------------------------------ |
| alerting           | KubeSphere 告警通知系统            | 使用户能够自定义警报策略，以不同的时间间隔和警报级别及时向接收者发送消息。 |
| auditing           | KubeSphere 审计日志系统           | 按时间顺序记录不同租户在平台中的操作活动。 |
| devops             | KubeSphere DevOps 系统              | 一站式 DevOps 方案，内置 Jenkins 流水线与 B2I & S2I。 |
| events             | KubeSphere 事件系统              | 提供一个图形化的web控制台，用于导出、过滤和警告多租户 Kubernetes 集群中的 Kubernetes 事件。 |
| logging            | KubeSphere 日志系统             | 在统一的控制台中提供灵活的日志查询、收集和管理日志功能。可以添加其他日志收集器，例如Elasticsearch、Kafka 和 Fluentd。 |
| metrics_server     | HPA                                   | 能够根据 pod 数量进行动态伸缩，使运行在上面的服务对指标的变化有一定的自适应能力。 |
| networkpolicy      | 网络策略                        | 可以在同一个集群内部之间设置网络策略（比如限制或阻止某些实例 pod 之间的网络请求）。 |
| notification       | KubeSphere 通知系统        | 允许用户将 AlertManager 设置为发件人并发送告警邮件。可以使用的方式有：电子邮件、微信和 Slack。 |
| openpitrix         | KubeSphere 应用商店                  | 基于 Helm 的应用程序商店，允许用户在整个生命周期中管理应用程序。 |
| servicemesh        | KubeSphere 服务网格 (基于 Istio) | 支持灰度发布、流量拓扑、流量治理、Tracing。 |

有关每个组件的更多信息，请参见启用可插拔组件概述。

{{< notice note >}}

- 如果您使用 KubeKey 在 Linux 上安装 KubeSphere，默认情况下，除了 `metrics_server` 之外，不会启用上述组件。但是，如果在现有的 Kubernetes 集群上安装 KubeSphere，则安装程序中 `metrics_server` 仍处于禁用状态。这是因为组件可能已经安装在您的环境中，特别是对于云托管的 Kubernetes 集群。
- `multicluster` 不在本教程中介绍。如果要启用此功能，则需要为 `clusterRole` 设置相应的值。有关详细信息，请参见[多群集管理](../../multicluster-management/).
- 在安装前，请确保您的机器符合硬件要求。如果您想启用所有的可拔插组件，建议您的机器配置如下: CPU ≥ 8 Cores, 内存 ≥ 16 G, 磁盘空间 ≥ 100 G。

{{</ notice >}}

## 安装前启用可插拔组件

### **在 Linux 上安装**

在 Linux 上安装 KubeSphere 时，需要创建一个配置文件，该文件列出所有 KubeSphere 组件。

1. 在教程 [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/), 你可以创建一个默认配置文件： **config-sample.yaml**。通过执行以下命令来修改文件：

```bash
vi config-sample.yaml
```

{{< notice note >}}

如果您采用 [All-in-one 模式安装](../../quick-start/all-in-one-on-linux/), 您无需创建 config-sample.yaml 文件，因为 all-in-one 模式可以直接创建集群。 通常，all-in-one 模式适用于刚接触 KubeSphere 并希望熟悉该系统的用户。 如果要在此模式下启用可插拔组件（例如，出于测试目的），请参阅以下部分，了解如何在安装后安装可插拔组件。

{{</ notice >}}

2. 在此文件中, 将 `enabled` 的值 `false` 改为 `true`。 这是 [示例文件](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) 供您参考。修改完成后保存文件。
3. 使用配置文件创建集群：

```bash
./kk create cluster -f config-sample.yaml
```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 时, 需要下载文件 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 用于群集设置。如果要安装可插拔组件, 请不要直接使用 `kubectl apply -f` 来应用配置。

1. [在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 教程中, 您首先通过命令 `kubectl apply -f` 应用配置文件 [kubesphere-installer.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml)。 之后，要启用可插拔组件，请创建本地文件cluster-configuration.yaml。
```bash
vi cluster-configuration.yaml
```

2. 复制文件 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 中所有的内容并将其粘贴到刚创建的本地文件中。
3. 在这个本地文件 cluster-configuration.yaml 中,  将 `enabled` 的值 `false` 改为 `true` 。  [示例文件](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml) 供您参考。 编辑完成后请保存文件。
4. 执行以下命令开始安装：

```bash
kubectl apply -f cluster-configuration.yaml
```

无论是在Linux上还是在Kubernetes上安装KubeSphere，安装后都可以在KubeSphere的Web控制台中检查已启用组件的状态。转到 **服务组件**, 您可以看到以下图片：

![KubeSphere-components](/images/docs/quickstart/kubesphere-components-zh.png)

## 安装后启用可插拔组件

KubeSphere Web 控制台使用户更方便来查看和使用不同的资源。 要在安装后启用可插拔组件，只需要在控制台中直接进行一些调整。 对于那些习惯使用 Kubernete s命令行工具 kubectl 的人来说，由于该工具已集成到控制台中，因此使用 KubeSphere 将毫无困难。

1. 以 `admin` 身份登录控制台。 点击左上角的 **平台管理** ，然后选择 **集群管理**。

![clusters-management](/images/docs/quickstart/clusters-management-zh.png)

2. 点击 **自定义资源 CRD** 然后在搜索栏中输入 `clusterconfiguration` 单击结果以查看其详细页面。

![crds](/images/docs/quickstart/crds-zh.png)

{{< notice info >}}

自定义资源定义（CRD）允许用户在不添加其他 API 服务器的情况下创建新类型的资源。它们可以像其他本地 Kubernetes 对象一样使用这些资源。

{{</ notice >}}

3. 在 **资源列表** 中, 点击 `ks-installer` 右侧的三个点，然后选择右侧的 **编辑配置文件**。

![edit-ks-installer](/images/docs/quickstart/edit-ks-installer-zh.png)

4. 在配置文件中, 将 `enabled` 的 `false` 更改为 `true` ，以启用要安装的可插拔组件。 完成后，单击 **更新** 以保存配置。

![enable-components](/images/docs/quickstart/enable-components-zh.png)

5. 您可以通过执行以下命令，使用 Web kubectl 来检查安装过程：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

您可以通过单击控制台右下角的锤子图标来找到 web kubectl 工具。

{{</ notice >}}

6. 如果组件安装成功，输出将显示以下消息。

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.2:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are ready.
  2. Please modify the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

7. 在  **服务组件** 中, 您可以查看不同组件的状态。

![components](/images/docs/quickstart/kubesphere-components-zh.png)

{{< notice tip >}}

如果您在上图中看不到相关组件，可能是一些 pod 尚未准备好。 您可以通过 kubectl 执行 `kubectl get pod --all-namespaces` 来查看 pod 的状态。

{{</ notice >}}
