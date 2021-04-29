---
title: "服务拓扑图"
keywords: "Kubernetes, KubeSphere, 服务, 拓扑图"
description: "了解如何启用服务拓扑图，以基于 Weave Scope 查看 Pod 的上下文详情。"
linkTitle: "服务拓扑图"
weight: 6915
---

## 什么是服务拓扑图

您可以启用服务拓扑图以集成 [Weave Scope](https://www.weave.works/oss/scope/)（Docker 和 Kubernetes 的可视化和监控工具）。Weave Scope 使用既定的 API 收集信息，为应用和容器构建拓扑图。服务拓扑图显示在您的项目中，将服务之间的连接关系可视化。

## 安装前启用服务拓扑图

### 在 Linux 上安装

在 Linux 上多节点安装 KubeSphere 时，您需要创建一个配置文件，该文件会列出所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式针对那些刚接触 KubeSphere 并希望熟悉系统的用户。如果您想在该模式下启用服务拓扑图（比如用于测试），请参考[下面的部分](#在安装后启用服务拓扑图)，查看如何在安装后启用服务拓扑图。

   {{</ notice >}}

2. 在该文件中，搜寻到 `network.topology.type`，然后将 `none` 改为 `weave-scope`。完成后保存文件。

   ```yaml
   network:
     topology:
       type: weave-scope # 将“none”更改为“weave-scope”。
   ```

3. 使用该配置文件创建一个集群：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### **在 Kubernetes 上安装**

[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，您可以在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) 文件中首先启用服务拓扑图。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) 文件并进行编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在本地 `cluster-configuration.yaml` 文件中，搜寻到 `network.topology.type`，将 `none` 更改为 `weave-scope` 以启用服务拓扑图。完成后保存文件。

    ```yaml
    network:
      topology:
        type: weave-scope # 将“none”更改为“weave-scope”。
    ```

3. 执行以下命令开始安装。

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/kubesphere-installer.yaml
    kubectl apply -f cluster-configuration.yaml
    ```


## 在安装后启用服务拓扑图

1. 使用 `admin` 用户登录控制台。点击左上角的**平台管理**，然后选择**集群管理**。

2. 点击**自定义资源 CRD**，然后在搜索栏中输入 `clusterconfiguration`。点击搜索结果查看其详情页。

    {{< notice info >}}
自定义资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些自定义资源。
    {{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右侧的三个点，然后选择**编辑配置文件**。

4. 在该配置文件中，搜寻到 `network`，将 `network.topology.type` 更改为 `weave-scope`。完成后，点击右下角的**更新**保存配置。

    ```yaml
    network:
      topology:
        type: weave-scope # 将“none”更改为“weave-scope”。
    ```

5. 您可以使用 Web Kubectl 执行以下命令查看安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
您可以通过点击控制台右下角的锤子图标来找到 Web kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入一个项目中，导航到**应用负载**下的**服务**，即可看到**拓扑图**选项卡下**服务**的拓扑图。

![topology1](/images/docs/zh-cn/enable-pluggable-components/service-topology/topology1.png)

{{</ tab >}}

{{< tab "通过 Kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n weave
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
weave-scope-agent-48cjp                     1/1     Running   0          3m1s
weave-scope-agent-9jb4g                     1/1     Running   0          3m1s
weave-scope-agent-ql5cf                     1/1     Running   0          3m1s
weave-scope-app-5b76897b6f-8bsls            1/1     Running   0          3m1s
weave-scope-cluster-agent-8d9b8c464-5zlpp   1/1     Running   0          3m1s
```

{{</ tab >}}

{{</ tabs >}}