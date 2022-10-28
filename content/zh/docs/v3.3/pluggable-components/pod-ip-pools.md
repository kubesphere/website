---
title: "容器组 IP 池"
keywords: "Kubernetes, KubeSphere, 容器组, IP 池"
description: "了解如何启用容器组 IP 池，为您的容器组分配一个特定的容器组 IP 池。"
linkTitle: "容器组 IP 池"
weight: 6920
---

容器组 IP 池用于规划容器组网络地址空间，每个容器组 IP 池之间的地址空间不能重叠。创建工作负载时，可选择特定的容器组 IP 池，这样创建出的容器组将从该容器组 IP 池中分配 IP 地址。

## 安装前启用容器组 IP 池

### 在 Linux 上安装

在 Linux 上多节点安装 KubeSphere 时，您需要创建一个配置文件，该文件会列出所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式针对那些刚接触 KubeSphere 并希望熟悉系统的用户。如果您想在该模式下启用容器组 IP 池（比如用于测试），请参考[下面的部分](#在安装后启用容器组-ip-池)，查看如何在安装后启用容器组 IP 池。

   {{</ notice >}}

2. 在该文件中，搜索 `network.ippool.type`，然后将 `none` 更改为 `calico`。完成后保存文件。

   ```yaml
   network:
     ippool:
       type: calico # 将“none”更改为“calico”。
   ```

3. 使用该配置文件创建一个集群：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要现在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用容器组 IP 池。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件并进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在本地 `cluster-configuration.yaml` 文件中，搜索 `network.ippool.type`，将 `none` 更改为 `calico` 以启用容器组 IP 池。完成后保存文件。

    ```yaml
    network:
      ippool:
        type: calico # 将“none”更改为“calico”。
    ```

3. 执行以下命令开始安装。

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```


## 在安装后启用容器组 IP 池

1. 使用 `admin` 用户登录控制台。点击左上角的**平台管理**，然后选择**集群管理**。

2. 点击**定制资源定义**，然后在搜索栏中输入 `clusterconfiguration`。点击搜索结果查看其详情页。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/pod-ip-pools/three-dots.png" height="20px">，然后选择**编辑 YAML**。

4. 在该配置文件中，搜寻到 `network`，将 `network.ippool.type` 更改为 `calico`。完成后，点击右下角的**确定**保存配置。

    ```yaml
    network:
      ippool:
        type: calico # 将“none”更改为“calico”。
    ```

5. 在  kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/pod-ip-pools/hammer.png" height="20px"> 来找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

在**集群管理**页面，您可以在**网络**下看到**容器组 IP 池**。
