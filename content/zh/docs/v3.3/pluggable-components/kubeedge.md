---
title: "KubeEdge"
keywords: "Kubernetes, KubeSphere, KubeEdge"
description: "了解如何启用 KubeEdge 为您的集群添加边缘节点。"
linkTitle: "KubeEdge"
weight: 6930
---

[KubeEdge](https://kubeedge.io/zh/) 是一个开源系统，用于将容器化应用程序编排功能扩展到边缘的主机。KubeEdge 支持多个边缘协议，旨在对部署于云端和边端的应用程序与资源等进行统一管理。

KubeEdge 的组件在两个单独的位置运行——云上和边缘节点上。在云上运行的组件统称为 CloudCore，包括 Controller 和 Cloud Hub。Cloud Hub 作为接收边缘节点发送请求的网关，Controller 则作为编排器。在边缘节点上运行的组件统称为 EdgeCore，包括 EdgeHub，EdgeMesh，MetadataManager 和 DeviceTwin。有关更多信息，请参见 [KubeEdge 网站](https://kubeedge.io/zh/)。

启用 KubeEdge 后，您可以[为集群添加边缘节点](../../installing-on-linux/cluster-operation/add-edge-nodes/)并在这些节点上部署工作负载。

![kubeedge_arch](/images/docs/v3.3/zh-cn/enable-pluggable-components/kubeedge/kubeedge_arch.png)

## 安装前启用 KubeEdge

### 在 Linux 上安装

在 Linux 上多节点安装 KubeSphere 时，您需要创建一个配置文件，该文件会列出所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式针对那些刚接触 KubeSphere 并希望熟悉系统的用户。如果您想在该模式下启用 KubeEdge（比如用于测试），请参考[下面的部分](#在安装后启用-kubeedge)，查看如何在安装后启用 KubeEdge。

   {{</ notice >}}

2. 在该文件中，搜索 `edgeruntime` 和 `kubeedge`，然后将它们 `enabled` 值从 `false` 更改为 `true` 以便开启所有 KubeEdge 组件。完成后保存文件。

   ```yaml
   edgeruntime:          # Add edge nodes to your cluster and deploy workloads on edge nodes.
     enabled: false
     kubeedge:        # kubeedge configurations
       enabled: false
       cloudCore:
         cloudHub:
           advertiseAddress: # At least a public IP address or an IP address which can be accessed by edge nodes must be provided.
            - ""            # Note that once KubeEdge is enabled, CloudCore will malfunction if the address is not provided.
         service:
           cloudhubNodePort: "30000"
           cloudhubQuicNodePort: "30001"
           cloudhubHttpsNodePort: "30002"
           cloudstreamNodePort: "30003"
           tunnelNodePort: "30004"
         # resources: {}
         # hostNetWork: false
   ```

3. 将 `kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为集群的公共 IP 地址或边缘节点可以访问的 IP 地址。编辑完成后保存文件。

4. 使用该配置文件创建一个集群：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.0/cluster-configuration.yaml) 文件中启用 KubeEdge。

{{< notice note >}}
为了避免兼容性问题，建议安装 Kubernetes v1.21.x 及其以下版本。
{{</ notice >}}

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.0/cluster-configuration.yaml) 文件并进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在本地 `cluster-configuration.yaml` 文件中，搜索 `edgeruntime` 和 `kubeedge`，然后将它们 `enabled` 值从 `false` 更改为 `true` 以便开启所有 KubeEdge 组件。完成后保存文件。

   ```yaml
   edgeruntime:          # Add edge nodes to your cluster and deploy workloads on edge nodes.
     enabled: false
     kubeedge:        # kubeedge configurations
       enabled: false
       cloudCore:
         cloudHub:
           advertiseAddress: # At least a public IP address or an IP address which can be accessed by edge nodes must be provided.
            - ""            # Note that once KubeEdge is enabled, CloudCore will malfunction if the address is not provided.
         service:
           cloudhubNodePort: "30000"
           cloudhubQuicNodePort: "30001"
           cloudhubHttpsNodePort: "30002"
           cloudstreamNodePort: "30003"
           tunnelNodePort: "30004"
         # resources: {}
         # hostNetWork: false
   ```

3. 将 `kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为集群的公共 IP 地址或边缘节点可以访问的 IP 地址。

4. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.0/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用 KubeEdge

1. 使用 `admin` 用户登录控制台。点击左上角的**平台管理**，然后选择**集群管理**。
   
2. 点击**定制资源定义**，然后在搜索栏中输入 `clusterconfiguration`。点击搜索结果查看其详情页。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubeedge/three-dots.png" height="20px">，然后选择**编辑 YAML**。
   
4. 在该配置文件中，搜索 `edgeruntime` 和 `kubeedge`，然后将它们 `enabled` 值从 `false` 更改为 `true` 以便开启所有 KubeEdge 组件。完成后保存文件。

   ```yaml
   edgeruntime:          # Add edge nodes to your cluster and deploy workloads on edge nodes.
     enabled: false
     kubeedge:        # kubeedge configurations
       enabled: false
       cloudCore:
         cloudHub:
           advertiseAddress: # At least a public IP address or an IP address which can be accessed by edge nodes must be provided.
            - ""            # Note that once KubeEdge is enabled, CloudCore will malfunction if the address is not provided.
         service:
           cloudhubNodePort: "30000"
           cloudhubQuicNodePort: "30001"
           cloudhubHttpsNodePort: "30002"
           cloudstreamNodePort: "30003"
           tunnelNodePort: "30004"
         # resources: {}
         # hostNetWork: false
   ```

5. 将 `kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为集群的公共 IP 地址或边缘节点可以访问的 IP 地址。完成后，点击右下角的**确定**保存配置。

6. 在 kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubeedge/hammer.png" height="20px"> 来找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

在**集群管理**页面，您可以看到**节点**下出现**边缘节点**板块。

{{</ tab >}}

{{< tab "通过 Kubectl 验证组件的安装" >}}

执行以下命令来检查容器组的状态：

```bash
kubectl get pod -n kubeedge
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                              READY   STATUS    RESTARTS   AGE
cloudcore-5f994c9dfd-r4gpq                        1/1     Running   0          5h13m
edge-watcher-controller-manager-bdfb8bdb5-xqfbk   2/2     Running   0          5h13m
iptables-hphgf                                    1/1     Running   0          5h13m
```

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

如果您在启用 KubeEdge 时未设置 `kubeedge.cloudCore.cloudHub.advertiseAddress`，则 CloudCore 无法正常运行 (`CrashLoopBackOff`)。在这种情况下，请运行 `kubectl -n kubeedge edit cm cloudcore` 添加集群的公共 IP 地址或边缘节点可以访问的 IP 地址。

{{</ notice >}}
