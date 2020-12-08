---
title: "直接连接"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云, 直接连接'
description: '介绍如何使用直接连接方式管理多集群'

weight: 5210
---

## 前提条件

已经安装了至少两个 KubeSphere 集群，如果尚未安装，请参阅[在 Linux 上安装](../../../installing-on-linux)或者[在 Kubernetes 上安装](../../../installing-on-kubernetes)。

{{< notice note >}}
多集群管理要求将 Kubesphere 安装在目标集群上，如果您已经有一个集群，则可以在上面部署 KubeSphere 最小安装，以便可以将其导入到多集群控制台。有关详细信息请参阅 [Kubernetes 上最小化安装 KubeSphere](../../../quick-start/minimal-kubesphere-on-k8s/)。
{{</ notice >}}

## 直接连接

如果成员集群（以下简称 **M** 集群）的 kube-apiserver 地址可以在主集群（以下简称 **H** 集群）的任何节点上访问，则可以采用 **直接连接**。此方法适用于当 M 集群的 kube-apiserver 地址可以暴露给外网，或者 H 集群和 M 集群在同一专网或子网中时。

### 准备主集群

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere，则可以通过编辑集群配置，将`clusterRole`的值设置为`host`。这个修改需要**等几分钟**以使更改生效。

- 选项 A - 使用 web 控制台：

  使用`admin`帐户登录控制台，然后进入**集群管理**页面上的 **CRDs**，输入关键字`ClusterConfiguration`，然后转到其详细信息页面，编辑`ks-installer`的 YAML，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

向下滚动并将`clusterRole`的值设置为`host`，然后点击**更新**（如果使用 web 控制台）以使其生效：

```yaml
multicluster:
  clusterRole: host
```

{{</ tab >}}

{{< tab "尚未安装 KubeSphere" >}}

安装主集群和安装一个普通的 KubeSphere 集群没有太大差别，唯一的区别是在配置文件`config-sample.yaml`中设置参数`clusterRole`如下：

```yaml
multicluster:
  clusterRole: host
```

{{</ tab >}}

{{</ tabs >}}

您可以使用 **kubectl** 来获取安装日志以验证状态。运行以下命令，稍等片刻，如果主集群已准备就绪，您将看到成功的日志返回。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

### 准备成员集群
  
为了管理**主集群**中的成员集群，需要使它们之间的`jwtSecret`相同。因此，您首先需要通过以下命令从**主集群**中获取它。

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```

命令的输出可能如下所示：

```yaml
jwtSecret: "gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU"
```

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere，则可以通过编辑集群配置，将`clusterRole`的值设置为`member`，这个修改需要**等几分钟**以使更改生效。

- 选项 A - 使用 web 控制台：

  使用`admin`帐户登录控制台，然后进入**集群管理**页面上的 **CRDs**，输入关键字`ClusterConfiguration`，然后进入其详细信息页面，编辑`ks-installer`的 YAML，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

输入上面相应地方显示的 `jwtSecret`：

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

向下滚动并将`clusterRole`的值设置为`member`，然后点击**更新**（如果使用 web 控制台）以使其生效：

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{< tab "尚未安装 KubeSphere" >}}

安装成员集群和安装一个普通的 KubeSphere 集群没有太大差别，唯一的区别在配置文件`config-sample.yaml`中设置参数`jwtSecret`和`clusterRole`如下：

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

向下滚动并将`clusterRole`的值设置为`member`：

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{</ tabs >}}

您可以使用 **kubectl** 来获取安装日志以验证状态。运行以下命令，稍等片刻，如果成员集群已准备就绪，您将看到成功的日志返回。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

### 导入集群

1. 打开 H 集群仪表板，然后点击**添加集群**.

    ![添加集群](https://ap3.qingstor.com/kubesphere-website/docs/20200827231611.png)

2. 输入要导入的集群的基本信息，然后点击**下一步**.

    ![导入集群](https://ap3.qingstor.com/kubesphere-website/docs/20200827211842.png)

3. 在**连接方法**中, 选择**直接连接到 Kubernetes 集群**.  

4. [获取 KubeConfig](../retrieve-kubeconfig)，复制成员集群的 KubeConfig 并将其粘贴到框中。

    ![导入集群 - 直接连接](/images/docs/direct_import_en.png)

5. 点击**导入**，然后等待集群初始化完成。

    ![Azure AKS](https://ap3.qingstor.com/kubesphere-website/docs/20200827231650.png)
