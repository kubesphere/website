---
title: "直接连接"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云, 直接连接'
description: '了解通过直接连接导入集群的一般步骤。'
linkTitle: "直接连接"
weight: 5210
---

如果主集群的任何节点都能访问的 kube-apiserver 地址，您可以采用**直接连接**。当成员集群的 kube-apiserver 地址可以暴露给外网，或者主集群和成员集群在同一私有网络或子网中时，此方法均适用。

要通过直接连接使用多集群功能，您必须拥有至少两个集群，分别用作主集群和成员集群。您可以在安装 KubeSphere 之前或者之后将一个集群指定为主集群或成员集群。有关安装 KubeSphere 的更多信息，请参考[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。

## 准备主集群

主集群为您提供中央控制平面，并且您只能指定一个主集群。

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere 集群，您可以编辑集群配置，将 `clusterRole` 的值设置为 `host`。

- 选项 A - 使用 Web 控制台：

  使用 `admin` 帐户登录控制台，然后进入**集群管理**页面上的 **CRD**，输入关键字 `ClusterConfiguration`，然后转到其详情页面。编辑 `ks-installer` 的 YAML 文件，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

在 `ks-installer` 的 YAML 文件中，搜寻到 `multicluster`，将 `clusterRole` 的值设置为 `host`，然后点击**确定**（如果使用 Web 控制台）使其生效：

```yaml
multicluster:
  clusterRole: host
```

要设置主集群名称，请在 `ks-installer` 的 YAML 文件中的 `multicluster.clusterRole` 下添加 `hostClusterName` 字段：

```yaml
multicluster:
  clusterRole: host
  hostClusterName: <主集群名称>
```

{{< notice note >}}

- 建议您在准备主集群的同时设置主集群名称。若您的主集群已在运行并且已经部署过资源，不建议您再去设置主集群名称。
- 主集群名称只能包含小写字母、数字、连字符（-）或者半角句号（.），必须以小写字母或数字开头和结尾。

{{</ notice >}}

您需要**稍等片刻**待该更改生效。

{{</ tab >}}

{{< tab "尚未安装 KubeSphere" >}}

在 Linux 上或者在现有 Kubernetes 集群上安装 KubeSphere 之前，您可以定义一个主集群。如果您想[在 Linux 上安装 KubeSphere](../../../installing-on-linux/introduction/multioverview/#1-创建示例配置文件)，需要使用 `config-sample.yaml` 文件。如果您想[在现有 Kubernetes 集群上安装 KubeSphere](../../../installing-on-kubernetes/introduction/overview/#部署-kubesphere)，需要使用两个 YAML 文件，其中一个是 `cluster-configuration.yaml`。

要设置一个主集群，请在安装 KubeSphere 之前，将 `config-sample.yaml` 或 `cluster-configuration.yaml` 文件中对应的 `clusterRole` 的值修改为 `host`。

```yaml
multicluster:
  clusterRole: host
```

要设置主集群名称，请在 `config-sample.yaml` 或 `cluster-configuration.yaml` 文件中的 `multicluster.clusterRole` 下添加 `hostClusterName` 字段：

```yaml
multicluster:
  clusterRole: host
  hostClusterName: <主集群名称>
```

{{< notice note >}}

- 主集群名称只能包含小写字母、数字、连字符（-）或者半角句号（.），必须以小写字母或数字开头和结尾。

{{</ notice >}}

{{< notice info >}}

如果您在单节点集群上安装 KubeSphere ([All-in-One](../../../quick-start/all-in-one-on-linux/))，则不需要创建 `config-sample.yaml` 文件。这种情况下，您可以在安装 KubeSphere 之后设置主集群。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

您可以使用 **kubectl** 来获取安装日志以验证状态。运行以下命令，稍等片刻，如果主集群已准备就绪，您将看到成功的日志返回。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## 准备成员集群

为了通过**主集群**管理，您需要使它们之间的 `jwtSecret` 相同。因此，您首先需要在**主集群**中执行以下命令来获取它。

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

  使用 `admin` 帐户登录控制台，然后进入**集群管理**页面上的 **CRD**，输入关键字 `ClusterConfiguration`，然后转到其详情页面。编辑 `ks-installer` 的 YAML 文件，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

在 `ks-installer` 的 YAML 文件中对应输入上面所示的 `jwtSecret`：

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

向下滚动并将 `clusterRole` 的值设置为 `member`，然后点击**确定**（如果使用 Web 控制台）使其生效：

```yaml
multicluster:
  clusterRole: member
```

您需要**稍等片刻**待该更改生效。

{{</ tab >}}

{{< tab "尚未安装 KubeSphere" >}}

在 Linux 上或者在现有 Kubernetes 集群上安装 KubeSphere 之前，您可以定义。如果您想[在 Linux 上安装 KubeSphere](../../../installing-on-linux/introduction/multioverview/#1-创建示例配置文件)，需要使用 `config-sample.yaml` 文件。如果您想[在现有 Kubernetes 集群上安装 KubeSphere](../../../installing-on-kubernetes/introduction/overview/#部署-kubesphere)，需要使用两个 YAML 文件，其中一个是 `cluster-configuration.yaml`。

要设置，请在安装 KubeSphere 之前，在 `config-sample.yaml` 或 `cluster-configuration.yaml` 文件中输入上方 `jwtSecret` 所对应的值，并将 `clusterRole` 的值修改为 `member`。

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

```yaml
multicluster:
  clusterRole: member
```

{{< notice note >}}

如果您在单节点集群上安装 KubeSphere ([All-in-One](../../../quick-start/all-in-one-on-linux/))，则不需要创建 `config-sample.yaml` 文件。这种情况下，您可以在安装 KubeSphere 之后设置。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

您可以使用 **kubectl** 来获取安装日志以验证状态。运行以下命令，稍等片刻，如果已准备就绪，您将看到成功的日志返回。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## 导入成员集群

1. 以 `admin` 身份登录 KubeSphere 控制台，转到**集群管理**页面点击**添加集群**。
   
2. 在**导入集群**页面，输入要导入的集群的基本信息。您也可以点击右上角的**编辑模式**以 YAML 格式查看并编辑基本信息。编辑完成后，点击**下一步**。

3. 在**连接方式**，选择**直接连接 Kubernetes 集群**，复制 kubeconfig 内容并粘贴至文本框。您也可以点击右上角的**编辑模式**以 YAML 格式编辑的 kubeconfig。

     {{< notice note >}}

请确保主集群的任何节点都能访问 kubeconfig 中的 `server` 地址。

     {{</ notice >}}

4. 点击**创建**，然后等待集群初始化完成。
   
