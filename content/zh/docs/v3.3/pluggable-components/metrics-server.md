---
title: "Metrics Server"
keywords: "Kubernetes, KubeSphere, Metrics Server"
description: "了解如何启用 Metrics Server 以使用 HPA 对部署进行自动伸缩。"
linkTitle: "Metrics Server"
weight: 6910
---

KubeSphere 支持用于[部署](../../project-user-guide/application-workloads/deployments/)的容器组（Pod）弹性伸缩程序 (HPA)。在 KubeSphere 中，Metrics Server 控制着 HPA 是否启用。您可以根据不同类型的指标（例如 CPU 和内存使用率，以及最小和最大副本数），使用 HPA 对象对部署 (Deployment) 自动伸缩。通过这种方式，HPA 可以帮助确保您的应用程序在不同情况下都能平稳、一致地运行。

## 在安装前启用 Metrics Server

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`，通过执行以下命令修改该文件：

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在这个模式下启用 Metrics Server（比如用于测试），请参考[下面的部分](#在安装后启用应用商店)，查看如何在安装后启用 Metrics Server。
   {{</ notice >}}

2. 在该文件中，搜寻到 `metrics_server`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

   ```yaml
   metrics_server:
     enabled: true # 将“false”更改为“true”。
   ```

3. 使用该配置文件创建集群：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中先启用 Metrics Server组件。

1. 下载文件 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml)，并打开文件进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 中，搜索 `metrics_server`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    metrics_server:
      enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令以开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```
    
    {{< notice note >}}

如果您在某些云托管的 Kubernetes 引擎上安装 KubeSphere，那么很可能您的环境中已经安装了 Metrics Server。在这种情况下，不建议您在 `cluster-configuration.yaml` 中启用 Metrics Server，因为这可能会在安装过程中引起冲突。    {{</ notice >}} 

## 在安装后启用 Metrics Server

1. 以 `admin` 用户登录控制台。点击左上角**平台管理**，选择**集群管理**。
   
2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`。点击搜索结果查看详情页。

    {{< notice info >}}

定制资源定义（CRD）允许用户在不增加额外 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。

    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/metrics-server/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该 YAML 文件中，搜索 `metrics_server`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**以保存配置。

    ```yaml
    metrics_server:
      enabled: true # 将“false”更改为“true”。
    ```

5. 在 kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/metrics-server/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

执行以下命令以验证 Metrics Server 的容器组是否正常运行：

```bash
kubectl get pod -n kube-system
```

如果 Metrics Server 安装成功，那么集群可能会返回以下输出（不包括无关容器组）：

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
metrics-server-6c767c9f94-hfsb7             1/1     Running   0          9m38s
```