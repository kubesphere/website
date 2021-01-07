---
title: "直接连接"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云, 直接连接'
description: '如何使用直接连接方式管理多集群'
linkTitle: "直接连接"
weight: 5210
---

如果 Host 集群（简称 H 集群）的任何节点都能访问 Member 集群（简称 M 集群）的 kube-apiserver 地址，您可以采用**直接连接**。当 M 集群的 kube-apiserver 地址可以暴露给外网，或者 H 集群和 M 集群在同一私有网络或子网中时，此方法均适用。

要通过直接连接使用多集群功能，您必须拥有至少两个集群，分别用作 H 集群和 M 集群。您可以在安装 KubeSphere 之前或者之后将一个集群指定为 H 集群或 M 集群。有关安装 KubeSphere 的更多信息，请参考[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。

## 准备 Host 集群

Host 集群为您提供中央控制平面，并且您只能指定一个 Host 集群。

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere 集群，您可以编辑集群配置，将 `clusterRole` 的值设置为 `host`。

- 选项 A - 使用 Web 控制台：

  使用 `admin` 帐户登录控制台，然后进入**集群管理**页面上的**自定义资源 CRD**，输入关键字 `ClusterConfiguration`，然后转到其详情页面。编辑 `ks-installer` 的 YAML 文件，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

在 `ks-installer` 的 YAML 文件中，搜寻到 `multicluster`，将 `clusterRole` 的值设置为 `host`，然后点击**更新**（如果使用 Web 控制台）使其生效：

```yaml
multicluster:
  clusterRole: host
```

您需要**稍等片刻**待该更改生效。

{{</ tab >}}

{{< tab "尚未安装 KubeSphere" >}}

在 Linux 上或者在现有 Kubernetes 集群上安装 KubeSphere 之前，您可以定义一个 Host 集群。如果您想[在 Linux 上安装 KubeSphere](../../../installing-on-linux/introduction/multioverview/#1-创建示例配置文件)，需要使用 `config-sample.yaml` 文件。如果您想[在现有 Kubernetes 集群上安装 KubeSphere](../../../installing-on-kubernetes/introduction/overview/#部署-kubesphere)，需要使用两个 YAML 文件，其中一个是 `cluster-configuration.yaml`。要设置一个 Host 集群，请在安装 KubeSphere 之前，将 `config-sample.yaml` 或 `cluster-configuration.yaml` 文件中对应的 `clusterRole` 的值修改为 `host`。

```yaml
multicluster:
  clusterRole: host
```

{{< notice note >}}

如果您在单节点集群上安装 KubeSphere ([All-in-One](../../../quick-start/all-in-one-on-linux/))，则不需要创建 `config-sample.yaml` 文件。这种情况下，您可以在安装 KubeSphere 之后设置 Host 集群。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

您可以使用 **kubectl** 来获取安装日志以验证状态。运行以下命令，稍等片刻，如果 Host 集群已准备就绪，您将看到成功的日志返回。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## 准备 Member 集群

为了通过 **Host 集群**管理 Member 集群，您需要使它们之间的 `jwtSecret` 相同。因此，您首先需要在 **Host 集群**中执行以下命令来获取它。

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```

命令输出结果可能如下所示：

```yaml
jwtSecret: "gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU"
```

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere 集群，您可以编辑集群配置，将 `clusterRole` 的值设置为 `member`。

- 选项 A - 使用 Web 控制台：

  使用 `admin` 帐户登录控制台，然后进入**集群管理**页面上的**自定义资源 CRD**，输入关键字 `ClusterConfiguration`，然后转到其详情页面。编辑 `ks-installer` 的 YAML 文件，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

在 `ks-installer` 的 YAML 文件中对应输入上面所示的 `jwtSecret`：

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

向下滚动并将 `clusterRole` 的值设置为 `member`，然后点击**更新**（如果使用 Web 控制台）使其生效：

```yaml
multicluster:
  clusterRole: member
```

您需要**稍等片刻**待该更改生效。

{{</ tab >}}

{{< tab "尚未安装 KubeSphere" >}}

在 Linux 上或者在现有 Kubernetes 集群上安装 KubeSphere 之前，您可以定义 Member 集群。如果您想[在 Linux 上安装 KubeSphere](../../../installing-on-linux/introduction/multioverview/#1-创建示例配置文件)，需要使用 `config-sample.yaml` 文件。如果您想[在现有 Kubernetes 集群上安装 KubeSphere](../../../installing-on-kubernetes/introduction/overview/#部署-kubesphere)，需要使用两个 YAML 文件，其中一个是 `cluster-configuration.yaml`。要设置 Member 集群，请在安装 KubeSphere 之前，在 `config-sample.yaml` 或 `cluster-configuration.yaml` 文件中输入上方 `jwtSecret` 所对应的值，并将 `clusterRole` 的值修改为 `member`。

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

```yaml
multicluster:
  clusterRole: member
```

{{< notice note >}}

如果您在单节点集群上安装 KubeSphere ([All-in-One](../../../quick-start/all-in-one-on-linux/))，则不需要创建 `config-sample.yaml` 文件。这种情况下，您可以在安装 KubeSphere 之后设置 Member 集群。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

您可以使用 **kubectl** 来获取安装日志以验证状态。运行以下命令，稍等片刻，如果 Member 集群已准备就绪，您将看到成功的日志返回。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## 导入 Member 集群

1. 以 `admin` 身份登录 KubeSphere 控制台，转到**集群管理**页面点击**添加集群**。
   
   ![添加集群](/images/docs/zh-cn/multicluster-management/enable-multicluster-management-in-kubesphere/direct-connection/add-cluster.PNG)

2. 输入要导入的集群的基本信息，然后点击**下一步**。

     ![集群信息](/images/docs/zh-cn/multicluster-management/enable-multicluster-management-in-kubesphere/direct-connection/cluster-info.PNG)

3. 在**连接方式**，选择**直接连接 Kubernetes 集群**，复制 Member 集群的 KubeConfig 内容并粘贴至文本框。

     {{< notice note >}}

请确保 Host 集群的任何节点都能访问 KubeConfig 中的 `server` 地址。

     {{</ notice >}}
    
     ![kubeconfig](/images/docs/zh-cn/multicluster-management/enable-multicluster-management-in-kubesphere/direct-connection/kubeconfig.PNG)

4. 点击**导入**，然后等待集群初始化完成。
   
     ![已导入的集群](/images/docs/zh-cn/multicluster-management/enable-multicluster-management-in-kubesphere/direct-connection/cluster-imported.PNG)
