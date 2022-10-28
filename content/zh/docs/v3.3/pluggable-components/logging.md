---
title: "KubeSphere 日志系统"
keywords: "Kubernetes, Elasticsearch, KubeSphere, 日志系统, 日志"
description: "了解如何启用日志，利用基于租户的系统进行日志收集、查询和管理。"
linkTitle: "KubeSphere 日志系统"
weight: 6400
---

KubeSphere 为日志收集、查询和管理提供了一个强大的、全面的、易于使用的日志系统。它涵盖了不同层级的日志，包括租户、基础设施资源和应用。用户可以从项目、工作负载、容器组和关键字等不同维度对日志进行搜索。与 Kibana 相比，KubeSphere 基于租户的日志系统中，每个租户只能查看自己的日志，从而可以在租户之间提供更好的隔离性和安全性。除了 KubeSphere 自身的日志系统，该容器平台还允许用户添加第三方日志收集器，如 Elasticsearch、Kafka 和 Fluentd。

有关更多信息，请参见[日志查询](../../toolbox/log-query/)。

## 在安装前启用日志系统

### 在 Linux 上安装

当您在 Linux 上安装 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

- 如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在这个模式下启用日志系统（比如用于测试），请参考[下面的部分](#在安装后启用日志系统)，查看如何在安装后启用日志系统。

- 如果您采用[多节点安装](../../installing-on-linux/introduction/multioverview/)，并且使用符号链接作为 Docker 根目录，请确保所有节点遵循完全相同的符号链接。日志代理在守护进程集中部署到节点上。容器日志路径的任何差异都可能导致该节点的收集失败。

{{</ notice >}}

2. 在该文件中，搜寻到 `logging`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    logging:
      enabled: true # 将“false”更改为“true”。
      containerruntime: docker
    ```

    {{< notice info >}}若使用 containerd 作为容器运行时，请将 `containerruntime` 字段的值更改为 `containerd`。如果您从低版本升级至 KubeSphere 3.3，则启用 KubeSphere 日志系统时必须在 `logging` 字段下手动添加 `containerruntime` 字段。

    {{</ notice >}}

    {{< notice note >}}默认情况下，如果启用了日志系统，KubeKey 将安装内置 Elasticsearch。对于生产环境，如果您想启用日志系统，强烈建议在 `config-sample.yaml` 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在安装前提供以下信息后，KubeKey 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
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

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用日志系统。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件中，搜索 `logging`，并将 `enabled` 的 `false` 改为 `true`，以启用日志系统。完成后保存文件。

    ```yaml
    logging:
      enabled: true # 将“false”更改为“true”。
      containerruntime: docker
    ```

    {{< notice info >}}若使用 containerd 作为容器运行时，请将 `.logging.containerruntime` 字段的值更改为 `containerd`。如果您从低版本升级至 KubeSphere 3.3，则启用 KubeSphere 日志系统时必须在 `logging` 字段下手动添加 `containerruntime` 字段。

    {{</ notice >}}

    {{< notice note >}}默认情况下，如果启用了日志系统，ks-installer 将安装内置 Elasticsearch。对于生产环境，如果您想启用日志系统，强烈建议在 `cluster-configuration.yaml` 中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在安装前提供以下信息后，ks-installer 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
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

## 在安装后启用日志系统

1. 以 `admin` 用户登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

    {{< notice info >}}

定制资源定义 (CRD) 允许用户在不增加额外 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。

{{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-logging-system/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该 YAML 文件中，搜索 `logging`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**以保存配置。

    ```yaml
    logging:
      enabled: true # 将“false”更改为“true”。
      containerruntime: docker
    ```

    {{< notice info >}}若使用 containerd 作为容器运行时，请将 `.logging.containerruntime` 字段的值更改为 `containerd`。如果您从低版本升级至 KubeSphere 3.3，则启用 KubeSphere 日志系统时必须在 `logging` 字段下手动添加 `containerruntime` 字段。

    {{</ notice >}}

    {{< notice note >}}默认情况下，如果启用了日志系统，将会安装内置 Elasticsearch。对于生产环境，如果您想启用日志系统，强烈建议在该 YAML 文件中设置以下值，尤其是 `externalElasticsearchUrl` 和 `externalElasticsearchPort`。在文件中提供以下信息后，KubeSphere 将直接对接您的外部 Elasticsearch，不再安装内置 Elasticsearch。
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

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-logging-system/hammer.png" height="20px"> 找到 kubectl 工具。

{{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**系统组件**，检查**日志**标签页中的所有组件都处于**健康**状态。如果是，组件安装成功。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查容器组的状态：

```bash
kubectl get pod -n kubesphere-logging-system
```

如果组件运行成功，输出结果如下：

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                  1/1     Running   0          87m
elasticsearch-logging-data-1                  1/1     Running   0          85m
elasticsearch-logging-discovery-0             1/1     Running   0          87m
fluent-bit-bsw6p                              1/1     Running   0          40m
fluent-bit-smb65                              1/1     Running   0          40m
fluent-bit-zdz8b                              1/1     Running   0          40m
fluentbit-operator-9b69495b-bbx54             1/1     Running   0          40m
logsidecar-injector-deploy-667c6c9579-cs4t6   2/2     Running   0          38m
logsidecar-injector-deploy-667c6c9579-klnmf   2/2     Running   0          38m
```

{{</ tab >}}

{{</ tabs >}}
