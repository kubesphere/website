---
title: "KubeSphere 事件系统"
keywords: "Kubernetes, 事件, KubeSphere, k8s-events"
description: "如何启用 KubeSphere 事件系统"
linkTitle: "KubeSphere 事件系统"
weight: 6500
---

## 什么是 KubeSphere 事件系统

KubeSphere 事件系统使用户能够跟踪集群内部发生的事件，例如节点调度状态和镜像拉取结果。这些事件会被准确记录下来，并在 Web 控制台中显示具体的原因、状态和信息。要查询事件，用户可以快速启动 Web 工具箱，在搜索栏中输入相关信息，并有不同的过滤器（如关键字和项目）可供选择。事件也可以归档到第三方工具，例如 Elasticsearch、Kafka 或 Fluentd。

有关更多信息，请参见[事件查询](../../toolbox/events-query)。

## 在安装前启用事件系统

### 在 Linux 上安装

当您在 Linux 上多节点安装 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 的教程，创建一个默认文件 `config-sample.yaml`。通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在这个模式下启用事件系统（例如用于测试），请参考[下面的部分](#在安装后启用事件系统)，查看[如何在安装后启用](#在安装后启用事件系统)事件系统。

{{</ notice >}}

2. 在该文件中，搜寻到 `events`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    events:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
默认情况下，如果启用了事件系统，KubeKey 将安装内置 Elasticsearch。对于生产环境，如果您想启用事件系统，强烈建议在 `config-sample.yaml` 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在安装前提供以下信息后，KubeKey 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
    {{</ notice >}}

    ```yaml
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

3. 使用配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 的过程与教程[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 中的说明大致相同，不同之处是需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中启用事件系统（可选组件）。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在该本地 `cluster-configuration.yaml` 文件中，搜寻到 `events`，并将 `enabled` 的 `false` 改为 `true`，启用事件系统。完成后保存文件。

    ```yaml
    events:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
对于生产环境，如果您想启用事件系统，强烈建议在 `cluster-configuration.yaml` 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在安装前提供以下信息后，ks-installer 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
    {{</ notice >}}

    ```yaml
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

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用事件系统

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
    ![集群管理](/images/docs/zh-cn/enable-pluggable-components/kubesphere-events/clusters-management.png)
    
2. 点击**自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

    {{< notice info >}}

自定义资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些自定义资源。

{{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑配置文件**。

     ![编辑 YAML](/images/docs/zh-cn/enable-pluggable-components/kubesphere-events/edit-yaml.PNG)

4. 在该 YAML 文件中，搜寻到 `events`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

    ```yaml
    events:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}

默认情况下，如果启用了事件系统，将会安装内置 Elasticsearch。对于生产环境，如果您想启用事件系统，强烈建议在该 YAML 文件中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在文件中提供以下信息后，KubeSphere 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
    {{</ notice >}}

    ```yaml
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

5. 您可以使用 Web Kubectl 工具执行以下命令来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}

您可以通过点击控制台右下角的锤子图标找到 Web Kubectl 工具。

{{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

如果您同时启用了日志系统和事件系统，可以在**服务组件**的 **Logging** 中查看事件系统状态。您可以看到如下图所示界面：

![事件系统](/images/docs/zh-cn/enable-pluggable-components/kubesphere-events/events.PNG)

如果只启用事件系统而不安装日志系统，则无法看到上图所示界面，因为不会显示 **Logging** 按钮。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-logging-system
```

如果组件运行成功，输出结果如下：

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

