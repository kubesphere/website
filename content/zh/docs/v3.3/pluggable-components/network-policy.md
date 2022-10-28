---
title: "网络策略"
keywords: "Kubernetes, KubeSphere, NetworkPolicy"
description: "了解如何启用网络策略来控制 IP 地址或端口级别的流量。"
linkTitle: "网络策略"
weight: 6900
---

从 3.0.0 版本开始，用户可以在 KubeSphere 中配置原生 Kubernetes 的网络策略。网络策略是一种以应用为中心的结构，使您能够指定如何允许容器组通过网络与各种网络实体进行通信。通过网络策略，用户可以在同一集群内实现网络隔离，这意味着可以在某些实例（容器组）之间设置防火墙。

{{< notice note >}}

- 在启用之前，请确保集群使用的 CNI 网络插件支持网络策略。支持网络策略的 CNI 网络插件有很多，包括 Calico、Cilium、Kube-router、Romana 和 Weave Net 等。
- 建议您在启用网络策略之前，使用 [Calico](https://www.projectcalico.org/) 作为 CNI 插件。

{{</ notice >}}

有关更多信息，请参见[网络策略](https://kubernetes.io/zh/docs/concepts/services-networking/network-policies/)。

## 在安装前启用网络策略

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 在[在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在该模式下启用网络策略（例如用于测试），可以参考[下面的部分](#在安装后启用网络策略)，查看如何在安装后启用网络策略。
    {{</ notice >}}

2. 在该文件中，搜索 `network.networkpolicy`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    network:
      networkpolicy:
        enabled: true # 将“false”更改为“true”。
    ```

3. 使用配置文件创建一个集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用网络策略。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在该本地 `cluster-configuration.yaml` 文件中，搜索 `network.networkpolicy`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    network:
      networkpolicy:
        enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用网络策略

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/enable-pluggable-components/network-policies/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该 YAML 文件中，搜寻到 `network.networkpolicy`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**，保存配置。

    ```yaml
    network:
      networkpolicy:
        enabled: true # 将“false”更改为“true”。
    ```

5. 在 kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/network-policies/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

如果您能在**网络**中看到**网络策略**，说明安装成功。
