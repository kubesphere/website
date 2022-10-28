---
title: "KubeSphere 事件系统"
keywords: "Kubernetes, 事件, KubeSphere, k8s-events"
description: "了解如何启用 KubeSphere 事件模块来跟踪平台上发生的所有事件。"
linkTitle: "KubeSphere 事件系统"
weight: 6500
---

KubeSphere 事件系统使用户能够跟踪集群内部发生的事件，例如节点调度状态和镜像拉取结果。这些事件会被准确记录下来，并在 Web 控制台中显示具体的原因、状态和信息。要查询事件，用户可以快速启动 Web 工具箱，在搜索栏中输入相关信息，并有不同的过滤器（如关键字和项目）可供选择。事件也可以归档到第三方工具，例如 Elasticsearch、Kafka 或 Fluentd。

有关更多信息，请参见[事件查询](../../toolbox/events-query/)。

## 在安装前启用事件系统

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在该模式下启用事件系统（例如用于测试），请参考[下面的部分](#在安装后启用事件系统)，查看[如何在安装后启用](#在安装后启用事件系统)事件系统。

{{</ notice >}}

2. 在该文件中，搜寻到 `events`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    events:
      enabled: true # 将“false”更改为“true”。
    ```

    {{< notice note >}}
默认情况下，如果启用了事件系统，KubeKey 将安装内置 Elasticsearch。对于生产环境，如果您想启用事件系统，强烈建议在 `config-sample.yaml` 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在安装前提供以下信息后，KubeKey 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # The total number of master nodes. Even numbers are not allowed.
      elasticsearchDataReplicas: 1     # The total number of data nodes.
      elasticsearchMasterVolumeSize: 4Gi   # The volume size of Elasticsearch master nodes.
      elasticsearchDataVolumeSize: 20Gi    # The volume size of Elasticsearch data nodes.
      logMaxAge: 7                     # Log retention day in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      externalElasticsearchUrl: # The Host of external Elasticsearch.
      externalElasticsearchPort: # The port of external Elasticsearch.
    ```

3. 使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用事件系统。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件中，搜索 `events`，并将 `enabled` 的 `false` 改为 `true`以启用事件系统。完成后保存文件。

    ```yaml
    events:
      enabled: true # 将“false”更改为“true”。
    ```

    {{< notice note >}}
对于生产环境，如果您想启用事件系统，强烈建议在 `cluster-configuration.yaml` 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在安装前提供以下信息后，ks-installer 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # The total number of master nodes. Even numbers are not allowed.
      elasticsearchDataReplicas: 1     # The total number of data nodes.
      elasticsearchMasterVolumeSize: 4Gi   # The volume size of Elasticsearch master nodes.
      elasticsearchDataVolumeSize: 20Gi    # The volume size of Elasticsearch data nodes.
      logMaxAge: 7                     # Log retention day in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      externalElasticsearchUrl: # The Host of external Elasticsearch.
      externalElasticsearchPort: # The port of external Elasticsearch.
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用事件系统

1. 使用 `admin` 用户登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详情页。

    {{< notice info >}}

定制资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。

{{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-events/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该配置文件中，搜索 `events`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**，保存配置。

    ```yaml
    events:
      enabled: true # 将“false”更改为“true”。
    ```

    {{< notice note >}}

默认情况下，如果启用了事件系统，将会安装内置 Elasticsearch。对于生产环境，如果您想启用事件系统，强烈建议在该 YAML 文件中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在文件中提供以下信息后，KubeSphere 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # The total number of master nodes. Even numbers are not allowed.
      elasticsearchDataReplicas: 1     # The total number of data nodes.
      elasticsearchMasterVolumeSize: 4Gi   # The volume size of Elasticsearch master nodes.
      elasticsearchDataVolumeSize: 20Gi    # The volume size of Elasticsearch data nodes.
      logMaxAge: 7                     # Log retention day in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      externalElasticsearchUrl: # The Host of external Elasticsearch.
      externalElasticsearchPort: # The port of external Elasticsearch.
    ```

5. 在 kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-events/hammer.png" height="20px"> 找到 kubectl 工具。

{{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

验证您可以使用右下角**工具箱**中的**资源事件查询**功能。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查容器组的状态：

```bash
kubectl get pod -n kubesphere-logging-system
```

如果组件运行成功，输出结果如下：

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                  1/1     Running   0          155m
elasticsearch-logging-data-1                  1/1     Running   0          154m
elasticsearch-logging-discovery-0             1/1     Running   0          155m
fluent-bit-bsw6p                              1/1     Running   0          108m
fluent-bit-smb65                              1/1     Running   0          108m
fluent-bit-zdz8b                              1/1     Running   0          108m
fluentbit-operator-9b69495b-bbx54             1/1     Running   0          109m
ks-events-exporter-5cb959c74b-gx4hw           2/2     Running   0          7m55s
ks-events-operator-7d46fcccc9-4mdzv           1/1     Running   0          8m
ks-events-ruler-8445457946-cl529              2/2     Running   0          7m55s
ks-events-ruler-8445457946-gzlm9              2/2     Running   0          7m55s
logsidecar-injector-deploy-667c6c9579-cs4t6   2/2     Running   0          106m
logsidecar-injector-deploy-667c6c9579-klnmf   2/2     Running   0          106m
```

{{</ tab >}}

{{</ tabs >}}

