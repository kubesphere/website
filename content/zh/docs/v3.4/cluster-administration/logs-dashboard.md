---
title: "KubeSphere 日志图表"
keywords: "Kubernetes, KubeSphere, OpenSearch, Dashboard"
description: "了解如何启用日志图表，一个类似于 ElasticSearch Kibana 的图形界面工具。"
linkTitle: "KubeSphere 日志图表"
weight: 6200
---

作为一个开源的、以应用为中心的容器平台，KubeSphere 在 3.4.0 版本默认用 [OpenSearch](https://opensearch.org/) 作为日志，事件，审计存储后端。用以代替 ElasticSearch，默认我们可以使用 KubeSphere 页面右下角自带的查询工具来检索日志，查询事件和审计记录。 

如果您想获得类似 Kibana 页面的体验，如日志图表绘制等，我们可以启用该功能。也就是OpenSearch Dashboard


## 在安装前启用日志图表

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`，通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

2. 启用 OpenSearch Dashboard 前，您需要启用组件 `logging`、`opensearch`、`events` 或 `auditing`。本示例启用`events`, 如下：
    ```yaml
    opensearch:
      basicAuth:
        enabled: true
        password: admin
        username: admin
      dashboard:
        enabled: true       # 将“false”更改为“true”。
      enabled: true         # 将“false”更改为“true”。
      externalOpensearchHost: ""
      externalOpensearchPort: ""
      logMaxAge: 7
      opensearchPrefix: whizard 
    ```
    ```yaml
    logging:
      enabled: true   # 将“false”更改为“true”。
      logsidecar:
        enabled: true
        replicas: 2
    ```
    ```yaml
      events:
        enabled: true  # 将“false”更改为“true”。
        ruler:
          enabled: true
          replicas: 2
    ```
    
3. 执行以下命令使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.2/cluster-configuration.yaml) 文件中启用相关组件。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.4.0/cluster-configuration.yaml) 文件，执行以下命令打开并编辑该文件。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 启用 OpenSearch Dashboard 前，您需要启用组件 `logging`、`opensearch`、`events` 或 `auditing`。本示例启用`events`, 如下：
    ```yaml
    opensearch:
      basicAuth:
        enabled: true
        password: admin
        username: admin
      dashboard:
        enabled: true       # 将“false”更改为“true”。
      enabled: true         # 将“false”更改为“true”。
      externalOpensearchHost: ""
      externalOpensearchPort: ""
      logMaxAge: 7
      opensearchPrefix: whizard 
    ```
    ```yaml
    logging:
      enabled: true   # 将“false”更改为“true”。
      logsidecar:
        enabled: true
        replicas: 2
    ```
    ```yaml
      events:
        enabled: true  # 将“false”更改为“true”。
        ruler:
          enabled: true
          replicas: 2
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.4.0/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用日志图表

1. 使用 `admin` 用户登录控制台，点击左上角的**平台管理**，选择**集群管理**。

2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`，点击结果查看其详细页面。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不增加额外 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的<img src="/images/docs/v3.x/logs-ds1.png"/>
，选择**编辑 YAML**。

4. 在该 YAML 文件中，编辑如下，点击右下角的**确定**，保存配置。

    ```yaml
    opensearch:
      basicAuth:
        enabled: true
        password: admin
        username: admin
      dashboard:
        enabled: true       # 将“false”更改为“true”。
      enabled: true         # 将“false”更改为“true”。
      externalOpensearchHost: ""
      externalOpensearchPort: ""
      logMaxAge: 7
      opensearchPrefix: whizard 
    ```
    ```yaml
    logging:
      enabled: true   # 将“false”更改为“true”。
      logsidecar:
        enabled: true
        replicas: 2
    ```
    ```yaml
      events:
        enabled: true  # 将“false”更改为“true”。
        ruler:
          enabled: true
          replicas: 2
    ```


5. 在  kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.x/logs-ds2.png"/>
 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

在您登录控制台后，我们通过查看 <img src="/images/docs/v3.x/logs-ds3.png"/>
将其 5601 端口通过 NodePort 或者 Ingress 等其他形式暴露到我们可以访问到的网络中即可。





