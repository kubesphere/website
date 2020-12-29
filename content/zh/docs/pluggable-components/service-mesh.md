---
title: "KubeSphere 服务网格"
keywords: "Kubernetes, istio, KubeSphere, service-mesh, microservices"
description: "如何启用 KubeSphere 服务网格"

linkTitle: "KubeSphere 服务网格"
weight: 6800
---

## 什么是 KubeSphere 服务网格

在 [Istio](https://istio.io/) 的基础上，KubeSphere 服务网格将微服务治理和流量管理可视化。它拥有强大的工具包，包括**断路、蓝绿部署、金丝雀发布、流量镜像、分布式跟踪、可观察性和流量控制**。开发者无需任何代码黑客，即可轻松上手服务网格，Istio 的学习曲线大大降低。KubeSphere 服务网格的所有功能都是为了满足用户的业务需求。

更多信息请参见项目管理与使用中的相关章节。

## 在安装前启用服务网格

### 在 Linux 上安装

当您在 Linux 上安装 KubeSphere 时，你需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](.../.../installing-on-linux/introduction/multioverview/) 的教程，您创建了一个默认文件 **config-sample.yaml**。通过执行以下命令修改该文件：

```bash
vi config-sample.yaml
```

{{< notice note >}}

如果采用 [All-in-one 安装](.../.../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚刚接触 KubeSphere 并希望熟悉系统的用户准备的。如果您想在这个模式下启用服务网格（比如出于测试的目的），可以参考下面的部分，看看安装后如何启用服务网格。

{{</ notice >}}

2. 在该文件中，搜寻到 `servicemesh`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

```bash
servicemesh:
    enabled: true # Change "false" to "true"
```

3. 使用配置文件创建一个集群：

```bash
./kk create cluster -f config-sample.yaml
```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 时，需要下载文件 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 进行集群设置。如果要安装网络策略，不要直接使用 `kubectl apply -f` 对这个文件进行设置。

1. 参照[在 Kubernetes 上安装 KubeSphere](.../.../installing-on-kubernetes/introduction/overview/) 的教程，先对文件 [kubesphere-installer.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml) 执行 `kubectl apply -f`。之后，为了启用服务网格，创建一个本地文件 `cluster-configuration.yaml`。

```bash
vi cluster-configuration.yaml
```

2. 将 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中的所有内容复制到刚才创建的本地文件中。
   
3. 在这个本地 `cluster-configuration.yaml` 文件中，搜寻到 `servicemesh`，并将  `enabled` 的 `false` 改为 `true`，启用它们。完成后保存文件。

```bash
servicemesh:
    enabled: true # Change "false" to "true"
```

4. 执行以下命令开始安装：

```bash
kubectl apply -f cluster-configuration.yaml
```

## 在安装后启用服务网格

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。

![集群管理](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. 点击 **自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

{{< notice info >}}

自定义资源定义（CRD）允许用户在不增加另一个 API 服务器的情况下创建一种新的资源类型。他们可以像其他任何本地 Kubernetes 对象一样使用这些资源。

{{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑 YAML**。

![编辑 YAML](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. 在这个 YAML 文件中，搜寻到 `servicemesh`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

```bash
servicemesh:
    enabled: true # Change "false" to "true"
```

5. 您可以通过执行以下命令，使用 Web Kubectl 工具来检查安装过程：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

您可以通过点击控制台右下角的锤子图标找到 Kubectl 工具。

{{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**服务组件**，检查 Logging 的状态。你可能会看到如下图片：

![Istio](https://ap3.qingstor.com/kubesphere-website/docs/20200829130918.png)

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n istio-system
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                     READY   STATUS      RESTARTS   AGE
istio-citadel-7f676f76d7-n2rsr           1/1     Running     0          1h29m
istio-galley-78688b475c-kvkbx            1/1     Running     0          1h29m
istio-ingressgateway-8569f8dcb-rmvl5     1/1     Running     0          1h29m
istio-init-crd-10-1.4.8-fpvwg            0/1     Completed   0          1h43m
istio-init-crd-11-1.4.8-5rc4g            0/1     Completed   0          1h43m
istio-init-crd-12-1.4.8-62zmp            0/1     Completed   0          1h43m
istio-init-crd-14-1.4.8-ngq4d            0/1     Completed   0          1h43m
istio-pilot-67fd55d974-g5bn2             2/2     Running     4          1h29m
istio-policy-668894cffc-8tpt4            2/2     Running     7          1h29m
istio-sidecar-injector-9c4d79658-g7fzf   1/1     Running     0          1h29m
istio-telemetry-57fc886bf8-kx5rj         2/2     Running     7          1h29m
jaeger-collector-76bf54b467-2fh2v        1/1     Running     0          1h17m
jaeger-operator-7559f9d455-k26xz         1/1     Running     0          1h29m
jaeger-query-b478c5655-s57k8             2/2     Running     0          1h17m
```

{{</ tab >}}

{{</ tabs >}}
