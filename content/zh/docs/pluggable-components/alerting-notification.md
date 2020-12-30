---
title: "KubeSphere 告警和通知系统"
keywords: "Kubernetes, alertmanager, KubeSphere, 告警, 通知"
description: "如何启用告警和通知系统"
linkTitle: "KubeSphere 告警和通知"
weight: 6600
---

## 什么是 KubeSphere 告警和通知系统

告警和通知是可观察性的两个重要构件，与监控和日志密切相关。KubeSphere 中的告警系统与故障主动通知系统相结合，使用户可以基于告警策略了解感兴趣的活动。当达到某个指标的预定义阈值时，会向预先配置的收件人发出告警，您可以自行设置通知方式，包括 Email、企业微信和 Slack 等。有了功能强大的告警和通知系统，您就可以迅速发现并提前解决潜在问题，避免您的业务受影响。

有关更多信息，请参见[告警策略](../../project-user-guide/alerting/alerting-policy/)和[告警信息](../../project-user-guide/alerting/alerting-message/)。

{{< notice note >}}

建议同时启用告警和通知功能，这样用户可以及时收到告警通知。

{{</ notice >}}

## 在安装前启用告警和通知系统

### 在 Linux 上安装

当您在 Linux 上多节点安装 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 的教程，创建一个默认文件 `config-sample.yaml`。通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在这个模式下启用告警和通知系统（例如用于测试），请参考[下面的部分](#在安装后启用告警和通知系统)，查看如何在安装后启用告警和通知系统。
    {{</ notice >}}

2. 在该文件中，搜寻到 `alerting` 和 `notification`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    alerting:
        enabled: true # Change "false" to "true"
    notification:
        enabled: true # Change "false" to "true"
    ```

3. 使用配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 的过程与教程[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 中的说明大致相同，不同之处是需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中启用告警和通知系统（可选组件）。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在这个本地 `cluster-configuration.yaml` 文件中，搜寻到 `alerting` 和 `notification`，并将  `enabled` 的 `false` 改为 `true`，启用它们。完成后保存文件。

    ```yaml
    alerting:
        enabled: true # Change "false" to "true"
    notification:
        enabled: true # Change "false" to "true"
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用告警和通知系统

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
    ![集群管理](/images/docs/zh-cn/enable-pluggable-components/kubesphere-alerting-and-notification/clusters-management.png)
    
2. 点击**自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

    {{< notice info >}}
自定义资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些自定义资源。
    {{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑配置文件**。

    ![编辑 YAML](/images/docs/zh-cn/enable-pluggable-components/kubesphere-alerting-and-notification/edit-yaml.PNG)

4. 在该 YAML 文件中，搜寻到 `alerting` 和 `notification`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

    ```yaml
    alerting:
        enabled: true # Change "false" to "true"
    notification:
        enabled: true # Change "false" to "true"
    ```

5. 您可以通过执行以下命令，使用 Web Kubectl 工具来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
您可以通过点击控制台右下角的锤子图标找到 Web Kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

如果您在下图所示界面中可以看到**告警消息**和**告警策略**，说明安装成功，因为安装组件之后才会显示这两部分。

![告警](/images/docs/zh-cn/enable-pluggable-components/kubesphere-alerting-and-notification/alerting.PNG)

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-alerting-system
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                       READY   STATUS      RESTARTS   AGE
alerting-client-744c794979-xvsbz           1/1     Running     2          36m
alerting-db-ctrl-job-jwdsh                 0/1     Completed   0          36m
alerting-db-init-job-sj2nv                 0/1     Completed   0          36m
alerting-executor-59ff88f484-2l57d         2/2     Running     0          36m
alerting-manager-5dc9d6cd46-jshkw          1/1     Running     0          36m
alerting-watcher-dcb87b665-sm87b           1/1     Running     0          36m
notification-db-ctrl-job-phxsx             0/1     Completed   3          36m
notification-db-init-job-8q5rf             0/1     Completed   0          36m
notification-deployment-748897cbdf-2djpr   1/1     Running     0          36m
```

{{</ tab >}}

{{</ tabs >}}