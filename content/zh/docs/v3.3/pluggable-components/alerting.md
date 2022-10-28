---
title: "KubeSphere 告警系统"
keywords: "Kubernetes, alertmanager, KubeSphere, 告警"
description: "了解如何启用告警功能，以便在潜在问题对您的业务造成影响之前提前识别这些问题。"
linkTitle: "KubeSphere 告警系统"
weight: 6600
---

告警是可观测性的重要组成部分，与监控和日志密切相关。KubeSphere 中的告警系统与其主动式故障通知 (Proactive Failure Notification) 系统相结合，使用户可以基于告警策略了解感兴趣的活动。当达到某个指标的预定义阈值时，会向预先配置的收件人发出告警。因此，您需要预先配置通知方式，包括邮件、Slack、钉钉、企业微信和 Webhook。有了功能强大的告警和通知系统，您就可以迅速发现并提前解决潜在问题，避免您的业务受影响。

## 在安装前启用告警系统

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式针对那些刚接触 KubeSphere 并希望熟悉系统的用户。如果您想在该模式下启用告警系统（例如用于测试），请参考[下面的部分](#在安装后启用告警系统)，查看如何在安装后启用告警系统。
    {{</ notice >}}

2. 在该文件中，搜索 `alerting` 并将 `enabled` 的 `false` 更改为 `true`。完成后保存文件。

    ```yaml
    alerting:
      enabled: true # 将“false”更改为“true”。
    ```
    
3. 执行以下命令使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用告警系统。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件并进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件中，搜索 `alerting`，将 `enabled` 的 `false` 更改为 `true` 以启用告警系统。完成后保存文件。

    ```yaml
    alerting:
      enabled: true # 将“false”更改为“true”。
    ```
    
3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用告警系统

1. 使用 `admin` 用户登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

    {{< notice info >}}
定制资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-alerting/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该 YAML 文件中，搜寻到 `alerting`，将 `enabled` 的 `false` 更改为 `true`。完成后，点击右下角的**确定**，保存配置。

    ```yaml
    alerting:
      enabled: true # 将“false”更改为“true”。
    ```
    
5. 在  kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-alerting/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

如果您可以在**集群管理**页面看到**告警消息**和**告警策略**，则说明安装成功。