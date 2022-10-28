---
title: "KubeSphere 服务网格"
keywords: "Kubernetes, Istio, KubeSphere, 服务网格, 微服务"
description: "了解如何启用服务网格，从而提供不同的流量管理策略进行微服务治理。"
linkTitle: "KubeSphere 服务网格"
weight: 6800
---

KubeSphere 服务网格基于 [Istio](https://istio.io/)，将微服务治理和流量管理可视化。它拥有强大的工具包，包括**熔断机制、蓝绿部署、金丝雀发布、流量镜像、链路追踪、可观测性和流量控制**等。KubeSphere 服务网格支持代码无侵入的微服务治理，帮助开发者快速上手，Istio 的学习曲线也极大降低。KubeSphere 服务网格的所有功能都旨在满足用户的业务需求。

有关更多信息，请参见[灰度发布](../../project-user-guide/grayscale-release/overview/)。

## 在安装前启用服务网格

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`。执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在该模式下启用服务网格（例如用于测试），请参考[下面的部分](#在安装后启用服务网格)，查看如何在安装后启用服务网格。
    {{</ notice >}}

2. 在该文件中，搜索 `servicemesh`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    servicemesh:
    enabled: true # 将“false”更改为“true”。
    istio: # Customizing the istio installation configuration, refer to https://istio.io/latest/docs/setup/additional-setup/customize-installation/
      components:
        ingressGateways:
        - name: istio-ingressgateway # 将服务暴露至服务网格之外。默认不开启。
          enabled: false
        cni:
          enabled: false # 启用后，会在 Kubernetes pod 生命周期的网络设置阶段完成 Istio 网格的 pod 流量转发设置工作。
    ```
   
   {{< notice note >}}
   - 关于开启 Ingress Gateway 后如何访问服务，请参阅 [Ingress Gateway](https://istio.io/latest/zh/docs/tasks/traffic-management/ingress/ingress-control/)。
   - 更多关于 Istio CNI 插件的信息，请参阅[安装 Istio CNI 插件](https://istio.io/latest/zh/docs/setup/additional-setup/cni/)。
   {{</ notice >}}

3. 执行以下命令使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用服务网格。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，执行以下命令打开并编辑该文件：

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件中，搜索 `servicemesh`，并将  `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    servicemesh:
    enabled: true # 将“false”更改为“true”。
    istio: # Customizing the istio installation configuration, refer to https://istio.io/latest/docs/setup/additional-setup/customize-installation/
      components:
        ingressGateways:
        - name: istio-ingressgateway # 将服务暴露至服务网格之外。默认不开启。
          enabled: false
        cni:
          enabled: false # 启用后，会在 Kubernetes pod 生命周期的网络设置阶段完成 Istio 网格的 pod 流量转发设置工作。
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用服务网格

1. 以 `admin` 用户登录控制台。点击左上角的**平台管理**，选择**集群管理**。
   
2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详情页。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-service-mesh/three-dots.png" height="20px">，选择**编辑 YAML**。
   
4. 在该配置文件中，搜索 `servicemesh`，并将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**，保存配置。

    ```yaml
    servicemesh:
    enabled: true # 将“false”更改为“true”。
    istio: # Customizing the istio installation configuration, refer to https://istio.io/latest/docs/setup/additional-setup/customize-installation/
      components:
        ingressGateways:
        - name: istio-ingressgateway # 将服务暴露至服务网格之外。默认不开启。
          enabled: false
        cni:
          enabled: false # 启用后，会在 Kubernetes pod 生命周期的网络设置阶段完成 Istio 网格的 pod 流量转发设置工作。
    ```

5. 在 kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}
    

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-service-mesh/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**系统组件**，检查 **Istio** 标签页中的所有组件是否都处于**健康**状态。如果是，组件安装成功。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令检查容器组的状态：

```bash
kubectl get pod -n istio-system
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                    READY   STATUS    RESTARTS   AGE
istio-ingressgateway-78dbc5fbfd-f4cwt   1/1     Running   0          9m5s
istiod-1-6-10-7db56f875b-mbj5p          1/1     Running   0          10m
jaeger-collector-76bf54b467-k8blr       1/1     Running   0          6m48s
jaeger-operator-7559f9d455-89hqm        1/1     Running   0          7m
jaeger-query-b478c5655-4lzrn            2/2     Running   0          6m48s
kiali-f9f7d6f9f-gfsfl                   1/1     Running   0          4m1s
kiali-operator-7d5dc9d766-qpkb6         1/1     Running   0          6m53s
```

{{</ tab >}}

{{</ tabs >}}
