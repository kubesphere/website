---
title: "KubeSphere 服务网格"
keywords: "Kubernetes, Istio, KubeSphere, 服务网格, 微服务"
description: "了解如何启用服务网格，从而提供不同的流量管理策略进行微服务治理。"

linkTitle: "KubeSphere 服务网格"
weight: 6800
---

## 什么是 KubeSphere 服务网格

KubeSphere 服务网格基于 [Istio](https://istio.io/)，将微服务治理和流量管理可视化。它拥有强大的工具包，包括**熔断机制、蓝绿部署、金丝雀发布、流量镜像、分布式链路追踪、可观察性和流量控制**等。KubeSphere 服务网格支持代码无侵入的微服务治理，帮助开发者快速上手，Istio 的学习曲线也极大降低。KubeSphere 服务网格的所有功能都旨在满足用户的业务需求。

有关更多信息，请参见[灰度发布](../../project-user-guide/grayscale-release/overview/)。

## 在安装前启用服务网格

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 的教程，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在该模式下启用服务网格（例如用于测试），请参考[下面的部分](#在安装后启用服务网格)，查看如何在安装后启用服务网格。
    {{</ notice >}}

2. 在该文件中，搜寻到 `servicemesh`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    servicemesh:
        enabled: true # Change "false" to "true"
    ```

3. 使用配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 的过程和教程[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 中的说明大致相同，不同之处是需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中启用服务网格（可选组件）。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在该本地 `cluster-configuration.yaml` 文件中，搜寻到 `servicemesh`，并将  `enabled` 的 `false` 改为 `true`，启用该功能。完成后保存文件。

    ```yaml
    servicemesh:
        enabled: true # Change "false" to "true"
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用服务网格

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
    ![集群管理](/images/docs/zh-cn/enable-pluggable-components/kubesphere-service-mesh/clusters-management.png)
    
2. 点击**自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

    {{< notice info >}}
自定义资源定义 (CRD) 允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些自定义资源。
    {{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑配置文件**。
    ![编辑 YAML](/images/docs/zh-cn/enable-pluggable-components/kubesphere-service-mesh/edit-yaml.PNG)

4. 在该 YAML 文件中，搜寻到 `servicemesh`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

    ```yaml
    servicemesh:
        enabled: true # Change "false" to "true"
    ```

5. 您可以执行以下命令，使用 Web Kubectl 工具来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
您可以通过点击控制台右下角的锤子图标找到 Web Kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**服务组件**，查看 **Istio** 的状态。您可能会看到如下图所示的界面：

![Istio](/images/docs/zh-cn/enable-pluggable-components/kubesphere-service-mesh/Istio.PNG)

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
