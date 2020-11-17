---
title: "KubeSphere 事件系统"
keywords: "Kubernetes, events, KubeSphere, k8s-events"
description: "如何启用 KubeSphere 事件"

linkTitle: "KubeSphere 事件系统"
weight: 3530
---

## 什么是 KubeSphere 事件系统

KubeSphere 事件系统允许用户跟踪集群内部发生的事情，如节点调度状态和镜像拉取结果。它们将被准确地记录下来，并在Web 控制台中显示具体的原因、状态和信息。要查询事件，用户可以快速启动 Web 工具箱，在搜索栏中输入相关信息，并有不同的过滤器（如关键字和项目）可供选择。事件也可以归档到第三方工具，如 Elasticsearch、Kafka 或 Fluentd。

有关更多信息，请参见日志记录、事件和审计系统。

## 在安装前启用事件系统

### 在 Linux 上安装

当您在 Linux 上安装 KubeSphere 时，你需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](.../.../installing-on-linux/introduction/multioverview/) 的教程，您创建了一个默认文件 **config-sample.yaml**。通过执行以下命令修改该文件：

```bash
vi config-sample.yaml
```

{{< notice note >}}

如果采用 [All-in-one 安装](.../.../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚刚接触 KubeSphere 并希望熟悉系统的用户准备的。如果您想在这个模式下启用事件（比如出于测试的目的），可以参考下面的部分，看看安装后如何启用事件系统。

{{</ notice >}}

2. 在该文件中，搜寻到 `events`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

```bash
events:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

默认情况下，如果启用了审计功能，KubeKey 将在内部安装 Elasticsearch。对于生产环境，如果你想启用事件，强烈建议你在 **config-sample.yaml** 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。一旦你在安装前提供以下信息，KubeKey 将直接整合你的外部 Elasticsearch，而不是安装一个内部 Elasticsearch。

{{</ notice >}}

```bash
es:  # Storage backend for logging, tracing, events and auditing.
  elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
  elasticsearchDataReplicas: 1     # total number of data nodes
  elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
  elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
  logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
  elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
  externalElasticsearchUrl: # The URL of external Elasticsearch
  externalElasticsearchPort: # The port of external Elasticsearch
```

3. 使用配置文件创建一个集群：

```bash
./kk create cluster -f config-sample.yaml
```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 时，需要下载文件 [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) 进行集群设置。如果要安装事件系统，不要直接使用 `kubectl apply -f` 对这个文件进行设置。

1. 参照[在 Kubernetes 上安装 KubeSphere](.../.../installing-on-kubernetes/introduction/overview/) 的教程，先对文件 [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml) 执行 `kubectl apply -f`。之后，为了启用事件，创建一个本地文件 `cluster-configuration.yaml`。

```bash
vi cluster-configuration.yaml
```

2. 将 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中的所有内容复制到刚才创建的本地文件中。
   
3. 在这个本地 `cluster-configuration.yaml` 文件中，搜寻到 `events`，并将  `enabled` 的 `false` 改为 `true`，启用它们。完成后保存文件。

```bash
events:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

默认情况下，如果启用了事件功能，ks-installer 会在内部安装 Elasticsearch。对于生产环境，如果你想启用事件，强烈建议你在 **cluster-configuration.yaml** 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。当你在安装前提供以下信息时，ks-installer 将直接整合你的外部 Elasticsearch，而不是安装内部 Elasticsearch。

{{</ notice >}}

```bash
es:  # Storage backend for logging, tracing, events and auditing.
  elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
  elasticsearchDataReplicas: 1     # total number of data nodes
  elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
  elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
  logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
  elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
  externalElasticsearchUrl: # The URL of external Elasticsearch
  externalElasticsearchPort: # The port of external Elasticsearch
```

4. 执行以下命令开始安装：

```bash
kubectl apply -f cluster-configuration.yaml
```

## 在安装后启用事件

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。

![集群管理](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. 点击 **自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

{{< notice info >}}

自定义资源定义（CRD）允许用户在不增加另一个 API 服务器的情况下创建一种新的资源类型。他们可以像其他任何本地 Kubernetes 对象一样使用这些资源。

{{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑 YAML**。

![编辑 YAML](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. 在这个 YAML 文件中，搜寻到 `events`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

```bash
events:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

默认情况下，如果启用了事件，Elasticsearch 将在内部安装。对于生产环境，如果你想启用审计，强烈建议你在这个 YAML 文件中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。一旦你提供了以下信息，KubeSphere 将直接整合你的外部 Elasticsearch，而不是安装一个内部 Elasticsearch。

{{</ notice >}}

```bash
es:  # Storage backend for logging, tracing, events and auditing.
  elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
  elasticsearchDataReplicas: 1     # total number of data nodes
  elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
  elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
  logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
  elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
  externalElasticsearchUrl: # The URL of external Elasticsearch
  externalElasticsearchPort: # The port of external Elasticsearch
```

5. 您可以通过执行以下命令，使用 Web Kubectl 工具来检查安装过程：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

您可以通过点击控制台右下角的锤子图标找到 Kubectl 工具。

{{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

如果您同时启用了日志和事件，您可以在**服务组件**的 **Logging** 中查看事件服务状态。您可能会看到如下图片：

![events](https://ap3.qingstor.com/kubesphere-website/docs/events.png)

如果只启用事件而不安装日志，则无法看到上面的图片，因为 **Loggiing** 按钮不会显示。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-logging-system
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                  READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0          1/1     Running   0          11m
elasticsearch-logging-data-1          1/1     Running   0          6m48s
elasticsearch-logging-discovery-0     1/1     Running   0          11m
fluent-bit-ljlsl                      1/1     Running   0          6m30s
fluentbit-operator-5bf7687b88-85vxv   1/1     Running   0          11m
ks-events-exporter-5cb959c74b-rc4lm   2/2     Running   0          7m1s
ks-events-operator-7d46fcccc9-8vvsh   1/1     Running   0          10m
ks-events-ruler-97f756879-lg65t       2/2     Running   0          7m1s
ks-events-ruler-97f756879-ptbkr       2/2     Running   0          7m1s
```

{{</ tab >}}

{{</ tabs >}}

