---
title: "KubeSphere 审计日志"
keywords: "Kubernetes, auditing, KubeSphere, logs"
description: "如何启用 KubeSphere 审计日志"

linkTitle: "KubeSphere 审计日志"
weight: 3525
---

## 什么是 KubeSphere 审计日志

KubeSphere 审计日志系统提供了一套与安全相关的按时间顺序排列的记录，记录了与单个用户、管理人员或系统其他组件相关的活动顺序。对 KubeSphere 的每个请求都会产生一个事件，然后写入 Webhook，并根据一定的规则进行处理。

有关更多信息，请参阅[审计日志](../../toolbox/auditing/auditing-query)。

## 在安装前启用审计日志

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于在 [Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 的教程，创建了一个默认文件 **config-sample.yaml**，通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建`config-sample.yaml`文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚刚接触 KubeSphere 并希望熟悉系统的用户准备的，如果您想在这个模式下启用审计日志（比如出于测试的目的），可以参考[下面的部分](#在安装后启用审计日志)安装后如何启用审计模式。
    {{</ notice >}}

2. 在该文件中，搜寻到`auditing`，并将`enabled`的`false`改为`true`。完成后保存文件。

    ```bash
    auditing:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
默认情况下，如果启用了审计功能，KubeKey 将在内部安装 Elasticsearch。对于生产环境，如果您想启用审计，强烈建议在 **config-sample.yaml** 中设置以下值，尤其是`externalElasticsearchUrl`和`externalElasticsearchPort`。一旦在安装前提供以下信息，KubeKey 将直接整合您的外部 Elasticsearch，而不是安装一个内部 Elasticsearch。
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

3. 使用配置文件创建一个集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

在已有 Kubernetes 集群上安装 KubeSphere 时，需要部署 [ks-installer](https://github.com/kubesphere/ks-installer/) 的两个 yaml 文件，如下面所示。

1. 首先下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在这个本地`cluster-configuration.yaml`文件中，搜寻到`auditing`，并将`enabled`的`false`改为`true`。完成后保存文件。

    ```yaml
    auditing:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
默认情况下，如果启用了审计功能，ks-installer 会在内部安装 Elasticsearch。对于生产环境，如果您想启用审计，强烈建议在 **cluster-configuration.yaml** 中设置以下值，尤其是`externalElasticsearchUrl`和`externalElasticsearchPort`。当在安装前提供以下信息时，ks-installer 将直接整合您的外部 Elasticsearch，而不是安装内部 Elasticsearch。
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

## 在安装后启用审计日志

1. 以`admin`身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。

    ![集群管理](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. 点击 **自定义资源 CRD**，在搜索栏中输入`clusterconfiguration`，点击搜索结果查看其详细页面。

    {{< notice info >}}
自定义资源定义（CRD）允许用户在不增加额外的 API 服务器的情况下创建一种新的资源类型，用户可以像使用其它 Kubernetes 内置对象一样使用这些自定义资源。
    {{</ notice >}}

3. 在**资源列表**中，点击`ks-installer`右边的三个点，选择**编辑 YAML**。

    ![编辑 YAML](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. 在这个 YAML 文件中，搜寻到`auditing`，将`enabled`的`false`改为`true`。完成后，点击右下角的**更新**，保存配置。

    ```yaml
    auditing:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
默认情况下，如果启用了审计功能，Elasticsearch 将在内部安装。对于生产环境，如果您想启用审计，强烈建议在这个 YAML 文件中设置以下值，尤其是`externalElasticsearchUrl`和`externalElasticsearchPort`。一旦提供了以下信息，KubeSphere 将直接整合您的外部 Elasticsearch，而不是安装一个内部 Elasticsearch。
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

5. 可以通过执行以下命令，使用 Web Kubectl 工具来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
可以通过点击控制台右下角的锤子图标找到 Kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

如果同时启用了日志记录和审计日志，您可以在**服务组件**的 **Logging** 中查看审计状态，其结果如下图片所示：

![auditing](https://ap3.qingstor.com/kubesphere-website/docs/20200829121140.png)

如果只启用审计而不安装日志，则无法看到上面的图片，因为 **Logging** 按钮不会显示。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-logging-system
```

如果组件运行成功，输出结果如下：

```bash
NAME                                                              READY   STATUS      RESTARTS   AGE
elasticsearch-logging-curator-elasticsearch-curator-159872n9g9g   0/1     Completed   0          2d10h
elasticsearch-logging-curator-elasticsearch-curator-159880tzb7x   0/1     Completed   0          34h
elasticsearch-logging-curator-elasticsearch-curator-1598898q8w7   0/1     Completed   0          10h
elasticsearch-logging-data-0                                      1/1     Running     1          2d20h
elasticsearch-logging-data-1                                      1/1     Running     1          2d20h
elasticsearch-logging-discovery-0                                 1/1     Running     1          2d20h
fluent-bit-6v5fs                                                  1/1     Running     1          2d20h
fluentbit-operator-5bf7687b88-44mhq                               1/1     Running     1          2d20h
kube-auditing-operator-7574bd6f96-p4jvv                           1/1     Running     1          2d20h
kube-auditing-webhook-deploy-6dfb46bb6c-hkhmx                     1/1     Running     1          2d20h
kube-auditing-webhook-deploy-6dfb46bb6c-jp77q                     1/1     Running     1          2d20h
```

{{</ tab >}}

{{</ tabs >}}
