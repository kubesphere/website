---
title: "在 Google GKE 上部署 KubeSphere"
keywords: 'Kubernetes, KubeSphere, GKE, 安装'
description: '了解如何在 Google Kubernetes Engine 上部署 KubeSphere。'

weight: 4240
---

![KubeSphere+GKE](https://pek3b.qingstor.com/kubesphere-docs/png/20191123145223.png)

本指南将演示如何在 [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) 上部署 KubeSphere。

## 准备一个 GKE 集群

- 在 GKE 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件，转到导航菜单然后参考下图创建集群。

  ![create-cluster-gke](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/create-cluster-gke.png)

- 在**集群基本信息**中，选择一个主版本，指定 Kubernetes 静态版本。

  ![select-master](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/master-version.png)

- 在 **default-pool** 下的**节点池详情**中，在此集群中定义 3 个节点。

  ![node-number](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/node-number.png)

- 转到**节点数**，选择映像类型，然后设置如下机器配置。完成后，点击**创建**。

  ![machine-config](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/machine-configuration.png)

  {{< notice note >}}

- 如需在 Kubernetes 上安装 KubeSphere 3.3，您的 Kubernetes 版本必须为：v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 此示例中包括3个节点，可以根据自己的需求添加更多节点，尤其是在生产环境中。
- 最小安装的机器类型为 e2-medium（2 个 vCPU，4GB 内存）。如果要启用可插拔组件或将集群用于生产，请选择具有更高配置的机器类型。
- 对于其他设置，可以根据自己的需要进行更改，也可以使用默认值。

  {{</ notice >}}

- 当 GKE 集群准备就绪时，可以使用 Cloud Shell 连接到集群。

  ![cloud-shell-gke](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/cloud-shell.png)

## 在 GKE上安装 KubeSphere

- 使用 kubectl 安装 KubeSphere，以下命令仅用于默认的最小安装。

  ```bash
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml

  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
  ```

- 检查安装日志：

  ```bash
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
  ```

- 安装完成后，会看到以下消息：

  ```yaml
  #####################################################
  ###              Welcome to KubeSphere!           ###
  #####################################################
  Console: http://10.128.0.44:30880
  Account: admin
  Password: P@88w0rd
  NOTES：
    1. After logging into the console, please check the
      monitoring status of service components in
      the "Cluster Management". If any service is not
      ready, please wait patiently until all components
      are ready.
    2. Please modify the default password after login.
  #####################################################
  https://kubesphere.io             2020-xx-xx xx:xx:xx
  ```

## 访问 KubeSphere 控制台

现在已经安装了 KubeSphere，您可以按照以下步骤访问 KubeSphere 的 Web 控制台。

- 在 **Services 和 Ingress** 选项中, 选择 **ks-console** 服务.

  ![ks-console](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/console-service.png)

- 在**服务详细信息**中，单击**修改**，然后将服务类型从`NodePort`更改为`LoadBalancer`，完成后保存文件。

  ![lb-change](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/lb-change.png)

- 使用 GKE 生成的端点访问 KubeSphere 的 Web 控制台。

  ![access-console](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/access-console.png)

  {{< notice tip >}}

除了将服务类型更改为`LoadBalancer`，还可以通过`NodeIP:NodePort`（服务类型设置为 `NodePort`）访问 KubeSphere 控制台，注意需要在防火墙规则中打开 30880 端口。

  {{</ notice >}}

- 使用默认帐户和密码（`admin/P@88w0rd`）登录控制台。


## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程，要在KubeSphere中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)。
