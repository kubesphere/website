---
title: "Metrics Server"
keywords: "Kubernetes, KubeSphere, Metrics Server"
description: "了解如何启用 Metrics Server 以使用 HPA 对部署进行自动伸缩。"
linkTitle: "Metrics Server"
weight: 6910
---

KubeSphere 支持用于[部署](../../project-user-guide/application-workloads/deployments/)的 Pod 弹性伸缩程序 (HPA)。在 KubeSphere 中，Metrics Server 控制着 HPA 是否启用。您可以根据不同类型的指标（例如 CPU 和内存使用率，以及最小和最大副本数），使用 HPA 对象对部署 (Deployment) 自动伸缩。通过这种方式，HPA 可以帮助确保您的应用程序在不同情况下都能平稳、一致地运行。

## 在安装前启用 Metrics Server

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 的教程，您需要创建一个默认文件 `config-sample.yaml`，通过执行以下命令修改该文件：

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在这个模式下启用 Metrics Server（比如用于测试），请参考[下面的部分](#在安装后启用应用商店)，查看如何在安装后启用 Metrics Server。
   {{</ notice >}}

2. 在该文件中，搜寻到 `metrics_server`，并将 `enabled` 的 `false` 改为 `true`，完成后保存文件。

   ```yaml
   metrics_server:
     enabled: true # 将“false”更改为“true”。
   ```

3. 使用该配置文件创建集群：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### 在 Kubernetes 上安装

[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 教程中演示了在 Kubernetes 上安装 KubeSphere 的流程。若想安装可选组件 Metrics Server，您可以先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) 文件中先启用该组件。

1. 下载文件 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml)，并打开文件进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在本地文件 `cluster-configuration.yaml` 中，导航到 `metrics_server`，并在 `enabled` 一行将 `false` 更改为 `true`。完成之后，请保存文件。

    ```yaml
    metrics_server:
      enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令以开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```
    
    {{< notice note >}}

如果您在某些云托管的 Kubernetes 引擎上安装 KubeSphere，那么很可能您的环境中已经安装了 Metrics Server。在这种情况下，不建议您在 `cluster-configuration.yaml` 中启用 Metrics Server，因为这可能会在安装过程中引起冲突。    {{</ notice >}} 

## 在安装后启用 Metrics Server

1. 以 `admin` 身份登录控制台。点击左上角**平台管理**，选择**集群管理**。
   
2. 点击**自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击搜索结果查看详情页。

    {{< notice info >}}

自定义资源 (CRD) 能让用户创建新的资源类型，而无需添加其他 API 服务器。用户可以像其他原生 Kubernetes 对象一样使用这些资源。

    {{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右侧的 <img src="/images/docs/zh-cn/enable-pluggable-components/metrics-server/three-dots.png" height="20px">，选择**编辑配置文件**。

4. 在该 YAML 文件中，导航到 `metrics_server`，在 `enabled` 一行将 `false` 更改为 `true`。完成后，点击右下角的**更新**以保存配置。

    ```yaml
    metrics_server:
      enabled: true # 将“false”更改为“true”。
    ```

5. 您可以通过执行以下命令，使用 kubectl 来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

可以通过点击控制台右下角的 <img src="/images/docs/zh-cn/enable-pluggable-components/metrics-server/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

执行以下命令以验证 Metrics Server 的 Pod 在正常运行。

```bash
kubectl get pod -n kube-system
```

如果 Metrics Server 安装成功，那么集群可能会返回以下输出（不包括无关 Pod）：

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
metrics-server-6c767c9f94-hfsb7             1/1     Running   0          9m38s
```