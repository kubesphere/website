---
title: "代理连接"
keywords: 'Kubernetes, KubeSphere, 多集群, 代理连接'
description: 'Overview'

weight: 3013
---

## 前提条件

已经安装了至少两个 KubeSphere 集群，如果尚未安装，请参阅[在 Linux 上安装](../../../installing-on-linux)或者[在 Kubernetes 上安装](../../../installing-on-kubernetes)。

{{< notice note >}}
多集群管理要求将 Kubesphere 安装在目标集群上，如果您已经有一个集群，则可以在上面部署 KubeSphere 最小安装，以便可以将其导入到多集群控制台。有关详细信息，请参见 [Kubernetes 上的最小 KubeSphere](../../../quick-start/minimal-kubesphere-on-k8s/)。
{{</ notice >}}

## 代理连接

KubeSphere 的 [Tower](https://github.com/kubesphere/tower) 组件用于代理连接，它是通过代理在集群之间进行网络连接的工具。具体来说，如果主集群（以下简称 **H** 集群）无法直接访问成员集群（以下简称 **M** 集群），则可以暴露 H 集群的代理服务地址，M 集群可以通过这个代理服务地址连接到 H 集群。此方法适用于当 M 集群处于私有环境（例如 IDC）并且 H 集群能够暴露代理服务时，或者当集群分布在不同的云服务提供商之上时。

### 准备主集群

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere，则可以通过编辑集群配置，将`clusterRole`的值设置为`host`。您需要**稍等几分钟**，以使更改生效。

- 选项 A - 使用 web 控制台：

  使用`admin`帐户登录控制台，然后转到**集群管理**页面上的 **CRDs**，输入关键字`ClusterConfiguration`，然后转到其详细信息页面，编辑`ks-installer`的 YAML，方法类似于[启用可插拔组件](../../../pluggable-components/)。

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

### 设置代理服务地址

安装主集群后，将在`kubesphere-system`中创建一个名为 tower 的代理服务，其类型为`LoadBalancer`。

{{< tabs >}}

{{< tab "集群中有可用的 LoadBalancer" >}}

如果集群中有可用的 LoadBalancer 插件，则可以看到 tower 服务有相应的`EXTERNAL-IP`地址，该地址将由 KubeSphere 自动获取并配置代理服务地址，这意味着您可以跳过设置代理服务地址这一步。执行以下命令确认是否有 LoadBalancer 插件。

```bash
kubectl -n kubesphere-system get svc
```

命令的输出可能如下所示：

```shell
NAME       TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)              AGE
tower      LoadBalancer    10.233.63.191   139.198.110.23  8080:30721/TCP       16h
```

{{< notice note >}}

通常情况主流公有云厂商会提供负载均衡器解决方案，并且负载均衡器可以自动分配外部 IP。如果您的集群运行在本地环境中，尤其是在**裸金属环境**中，可以使用 [Porter](https://github.com/kubesphere/porter) 作为负载均衡器解决方案。

{{</ notice >}}

{{</ tab >}}

{{< tab "集群中没有可用的 LoadBalancer" >}}

1. 如果在 tower 服务下看不到相应的地址显示出来（EXTERNAL-IP 处于 pending 状态），则需要手动设置代理地址。例如，您有一个可用的公有 IP 地址`139.198.120.120`，并且此 IP 地址的端口`8080`被转发到集群的端口`30721`。执行以下命令来检查服务。

    ```bash
    $ kubectl -n kubesphere-system get svc
    NAME       TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)              AGE
    tower      LoadBalancer    10.233.63.191   <pending>  8080:30721/TCP            16h
    ```

2. 将`proxyPublishAddress`的值添加到 ks-installer 的配置文件中，并按如下所示输入公有 IP 地址（此处示例`139.198.120.120`）和端口号。

    - 选项 A - 使用 web 控制台：

      使用`admin`帐户登录控制台，然后进入**集群管理**页面上的 **CRDs**，输入关键字`ClusterConfiguration`，然后进入其详细信息页面，编辑`ks-installer`的 YAML，方法类似于[启用可插拔组件](../../../pluggable-components/)。

    - 选项 B - 使用 Kubectl：

      ```bash
      kubectl -n kubesphere-system edit clusterconfiguration ks-installer
      ```

    定位到`multicluster`并为`proxyPublishAddress`添加新行来定义 IP 地址，以便访问 tower。

    ```yaml
    multicluster:
        clusterRole: host
        proxyPublishAddress: http://139.198.120.120:8080 # Add this line to set the address to access tower
    ```

3. 保存配置并重启`ks-apiserver`。

    ```shell
    kubectl -n kubesphere-system rollout restart deployment ks-apiserver
    ```

{{</ tab >}}

{{</ tabs >}}

### 准备成员集群

为了在**主集群**管理成员集群，需要使它们之间的`jwtSecret`相同。因此，首先需要通过以下命令从**主集群**中获取它。

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```

命令输出可能如下所示：

```yaml
jwtSecret: "gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU"
```

{{< tabs >}}

{{< tab "已经安装 KubeSphere" >}}

如果已经安装了独立的 KubeSphere，则可以通过编辑集群配置，将`clusterRole`的值设置为`member`。您需要**稍等几分钟**，以使更改生效。

- 选项 A - 使用 web 控制台：

  使用`admin`帐户登录控制台，然后进入**集群管理**页面上的 **CRDs**，输入关键字 **ClusterConfiguration**，然后进入其详细信息页面，编辑`ks-installer`的 YAML，方法类似于[启用可插拔组件](../../../pluggable-components/)。

- 选项 B - 使用 Kubectl：

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

输入上面相应地方显示的`jwtSecret`：

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

向下滚动并将 `clusterRole` 的值设置为 `member`：

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{</ tabs >}}

### 导入集群

1. 打开 H 集群仪表板，然后点击**添加集群**。

    ![添加集群](https://ap3.qingstor.com/kubesphere-website/docs/20200827231611.png)

2. 输入要导入的集群的基本信息，然后单击**下一步**。

    ![导入集群](https://ap3.qingstor.com/kubesphere-website/docs/20200827211842.png)

3. 在**连接方法**中，选择**集群连接代理**，然后点击**导入**。

    ![代理](/images/docs/agent-en.png)

4. 根据指示在 M 集群中创建一个`agent.yaml`文件，然后将 deployment 复制并粘贴到该文件中，执行`kubectl create -f agent.yaml`然后等待代理启动并运行。请确保 M 集群可以访问代理地址。

5. 当集群代理启动并运行时，您可以在 H 集群中看到已导入的集群。

    ![Azure AKS](https://ap3.qingstor.com/kubesphere-website/docs/20200827231650.png)
