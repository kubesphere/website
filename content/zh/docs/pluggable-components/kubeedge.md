---
title: "KubeEdge"
keywords: "Kubernetes, KubeSphere, Kubeedge"
description: "了解如何启用 KubeEdge 为您的集群添加边缘节点。"
linkTitle: "KubeEdge"
weight: 6930
---

## 什么是 KubeEdge

[KubeEdge](https://kubeedge.io/zh/) 是一个开源系统，用于将容器化应用程序编排功能扩展到边缘的主机。KubeEdge 支持多个边缘协议，并期望提供对云和边缘应用程序及资源的统一管理。

KubeEdge 的组件在两个单独的位置运行——云上和边缘节点上。在云上运行的组件统称为 CloudCore，包括 Controller 和 Cloud Hub。Cloud Hub 作为边缘节点发送请求的网关，Controller 则作为编排器。在边缘节点上运行的组件统称为 EdgeCore，包括 EdgeHub，EdgeMesh，MetadataManager 和 DeviceTwin。有关更多信息，请参见 [KubeEdge 网站](https://kubeedge.io/zh/)。

启用 KubeEdge 后，您可以[为集群添加边缘节点](../../installing-on-linux/cluster-operation/add-edge-nodes/)并在这些节点上部署工作负载。

![kubeedge_arch](/images/docs/zh-cn/enable-pluggable-components/kubeedge/kubeedge_arch.png)

## 安装前启用 KubeEdge

### 在 Linux 上安装

在 Linux 上多节点安装 KubeSphere 时，您需要创建一个配置文件，该文件会列出所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式针对那些刚接触 KubeSphere 并希望熟悉系统的用户。如果您想在这个模式下启用 KubeEdge（比如用于测试），请参考[下面的部分](#在安装后启用-kubeedge)，查看如何在安装后启用 KubeEdge。

   {{</ notice >}}

2. 在该文件中，搜寻到 `kubeedge.enabled`，然后将 `false` 更改为 `true`。

   ```yaml
   kubeedge:
     enabled: true # 将“false”更改为“true”。
   ```

3. 将 `kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为群集的公共 IP 地址或边缘节点可以访问的 IP 地址。编辑完成后保存文件。

4. 使用该配置文件创建一个集群：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### 在 Kubernetes 上安装

[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，您可以在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) 文件中首先启用 KubeEdge。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) 文件并进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在本地 `cluster-configuration.yaml` 文件中，搜寻到 `kubeedge.enabled`，将 `false` 更改为 `true` 以启用 KubeEdge。

    ```yaml
    kubeedge:
      enabled: true # 将“false”更改为“true”。
    ```

3. 将 `kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为群集的公共 IP 地址或边缘节点可以访问的 IP 地址。

4. 保存文件并执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用 KubeEdge

1. 使用 `admin` 用户登录控制台。点击左上角的**平台管理**，然后选择**集群管理**。
   
2. 点击**自定义资源 CRD**，然后在搜索栏中输入 `clusterconfiguration`。点击搜索结果查看其详情页。

    {{< notice info >}}
自定义资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些自定义资源。
    {{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右侧的三个点，然后选择**编辑配置文件**。
   
4. 在该配置文件中，搜寻到 `kubeedge.enabled`，将 `false` 更改为 `true` 以启用 KubeEdge。

    ```yaml
    kubeedge:
      enabled: true # 将“false”更改为“true”。
    ```

5. 将 `kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为群集的公共 IP 地址或边缘节点可以访问的 IP 地址。完成后，点击右下角的**更新**保存配置。

6. 您可以使用 Web Kubectl 执行以下命令查看安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
您可以通过点击控制台右下角的锤子图标来找到 Web kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

在**集群管理**页面，您可以看到**节点管理**下出现**边缘节点**板块。

![edge-nodes](/images/docs/zh-cn/enable-pluggable-components/kubeedge/edge-nodes.png)

{{</ tab >}}

{{< tab "通过 Kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

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

## 自定义配置

启用 KubeEdge 后，您可以手动创建一个 [ConfigMap](../../project-user-guide/configuration/configmaps/) 来自定义某些配置，比如 `keadm` 的下载 URL、KubeEdge 的版本等等。本地配置将基于该 ConfigMap 进行动态更新。

以下是 ConfigMap 的示例：

```yaml
apiVersion: v1
data:
  region: zh # 下载区域。
  version: v1.6.1 # KubeEdge 的默认安装版本。
kind: ConfigMap
metadata:
  name: edge-watcher-config
  namespace: kubeedge
```

{{< notice note >}}

对于 `region` 字段，您可以指定 `zh` 或 `en`。默认值为 `zh`，默认下载链接为 `https://kubeedge.pek3b.qingstor.com/bin/v1.6.1/$arch/keadm-v1.6.1-linux-$arch.tar.gz`。若将 `region` 设置为 `en`，下载链接将变为 `https://github.com/kubesphere/kubeedge/releases/download/v1.6.1-kubesphere/keadm-v1.6.1-linux-amd64.tar.gz`。

{{</ notice >}} 