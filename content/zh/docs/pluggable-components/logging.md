---
title: "KubeSphere 日志系统"
keywords: "Kubernetes, Elasticsearch, KubeSphere, Logging, logs"
description: "如何启用 KubeSphere 日志系统"

linkTitle: "KubeSphere 日志系统"
weight: 6400
---

## 什么是 KubeSphere 日志系统

KubeSphere 为日志收集、查询和管理提供了一个强大的、整体的、易于使用的日志系统。它涵盖了不同层次的日志，包括租户、基础设施资源和应用。用户可以从项目、工作量、Pod 和关键字等不同维度对日志进行搜索。与 Kibana 相比，KubeSphere 基于租户的日志系统具有更好的隔离性和租户之间的安全性，因为每个租户只能查看自己的日志。除了 KubeSphere 自身的日志系统，容器平台还允许用户添加第三方日志收集器，如 Elasticsearch、Kafka 和 Fluentd。

有关更多信息，请参阅日志、事件和审计系统。

## 在安装前启用日志系统

### 在 Linux 上安装

当您在 Linux 上安装 KubeSphere 时，你需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](.../.../installing-on-linux/introduction/multioverview/) 的教程，您创建了一个默认文件 **config-sample.yaml**。通过执行以下命令修改该文件：

```bash
vi config-sample.yaml
```

{{< notice note >}}

如果采用 [All-in-one 安装](.../.../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚刚接触 KubeSphere 并希望熟悉系统的用户准备的。如果您想在这个模式下启用日志系统（比如出于测试的目的），可以参考下面的部分，看看安装后如何启用日志系统。

{{</ notice >}}

{{< notice warning >}}

如果你采用[多节点安装](.../.../install-on-linux/introduction/multioverview/)，并且使用符号链接作为 Docker 根目录，请确保所有节点遵循完全相同的符号链接。日志代理在 DaemonSet 中部署到节点上。容器日志路径的任何差异都可能导致该节点的收集失败。

{{</ notice >}}

2. 在该文件中，搜寻到 `logging`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

```bash
logging:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

默认情况下，如果启用了审计功能，KubeKey 将在内部安装 Elasticsearch。对于生产环境，如果你想启用日志系统，强烈建议你在 **config-sample.yaml** 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。一旦你在安装前提供以下信息，KubeKey 将直接整合你的外部 Elasticsearch，而不是安装一个内部 Elasticsearch。

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

在 Kubernetes 上安装 KubeSphere 时，需要下载文件 [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) 进行集群设置。如果要安装日志系统，不要直接使用 `kubectl apply -f` 对这个文件进行设置。

1. 参照[在 Kubernetes 上安装 KubeSphere](.../.../installing-on-kubernetes/introduction/overview/) 的教程，先对文件 [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml) 执行 `kubectl apply -f`。之后，为了启用日志，创建一个本地文件 `cluster-configuration.yaml`。

```bash
vi cluster-configuration.yaml
```

2. 将 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中的所有内容复制到刚才创建的本地文件中。
   
3. 在这个本地 `cluster-configuration.yaml` 文件中，搜寻到 `logging`，并将  `enabled` 的 `false` 改为 `true`，启用它们。完成后保存文件。

```bash
logging:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

默认情况下，如果启用了日志功能，ks-installer 会在内部安装 Elasticsearch。对于生产环境，如果你想启用日志系统，强烈建议你在 **cluster-configuration.yaml** 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。当你在安装前提供以下信息时，ks-installer 将直接整合你的外部 Elasticsearch，而不是安装内部 Elasticsearch。

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

4. 在这个 YAML 文件中，搜寻到 `logging`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

```bash
logging:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

默认情况下，如果启用了日志系统，Elasticsearch 将在内部安装。对于生产环境，如果你想启用日志，强烈建议你在这个 YAML 文件中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。一旦你提供了以下信息，KubeSphere 将直接整合你的外部 Elasticsearch，而不是安装一个内部 Elasticsearch。

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

进入**服务组件**，检查 Logging 的状态。你可能会看到如下图片：

![logging](https://ap3.qingstor.com/kubesphere-website/docs/20200829104152.png)

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-logging-system
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                  1/1     Running   0          9m33s
elasticsearch-logging-data-1                  1/1     Running   0          5m12s
elasticsearch-logging-discovery-0             1/1     Running   0          9m33s
fluent-bit-qpvrf                              1/1     Running   0          4m56s
fluentbit-operator-5bf7687b88-z7bgg           1/1     Running   0          9m26s
logsidecar-injector-deploy-667c6c9579-662pm   2/2     Running   0          8m56s
logsidecar-injector-deploy-667c6c9579-tjckn   2/2     Running   0          8m56s
```

{{</ tab >}}

{{</ tabs >}}
