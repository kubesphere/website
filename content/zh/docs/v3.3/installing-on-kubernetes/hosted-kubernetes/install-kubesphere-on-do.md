---
title: "在 DigitalOcean 上部署 KubeSphere"
keywords: 'Kubernetes, KubeSphere, DigitalOcean, 安装'
description: '了解如何在 DigitalOcean 上部署 KubeSphere。'

weight: 4230
---

![KubeSphere+DOKS](/images/docs/v3.3/do/KubeSphere-DOKS.png)

本指南将介绍在 [DigitalOcean Kubernetes](https://www.digitalocean.com/products/kubernetes/) 上部署 KubeSphere 的步骤。

## 准备一个 DOKS 集群

在 DO 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件。登录您的 [DO account](https://cloud.digitalocean.com/) 帐户，然后在导航菜单中，参考下图创建集群。

![create-cluster-do](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/create-cluster-do.png)

您需要选择：

1. Kubernetes 版本（例如 1.18.6-do.0）
2. 数据中心区域（例如 `Frankfurt`）
3. VPC 网络（例如 default-fra1）
4. 集群规模（例如 2 个标准节点，每个节点具有 2 个 vCPU 和 4GB 内存）
5. 集群名称（例如 kubesphere-3）

![config-cluster-do-1](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/config-cluster-do-1.png)

![config-cluster-do-2](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/config-cluster-do-2.png)

{{< notice note >}}

- 如需在 Kubernetes 上安装 KubeSphere 3.3，您的 Kubernetes 版本必须为：v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 此示例中包括 3 个节点。您可以根据自己的需求添加更多节点，尤其是在生产环境中。
- 机器类型 Standard/4 GB/2 vCPU 仅用于最小化安装的，如果您计划启用多个可插拔组件或将集群用于生产，建议将节点升级到规格更大的类型（例如，CPU-Optimized /8 GB /4 vCPUs）。DigitalOcean 是基于工作节点类型来配置主节点，而对于标准节点，API server 可能会很快会变得无响应。

{{</ notice >}}

集群准备就绪后，您可以下载 kubectl 的配置文件。

![download-config-file](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/download-config-file.png)

## 在 DOKS 上安装 KubeSphere

现在集群已准备就绪，您可以按照以下步骤安装 KubeSphere：

- 使用 kubectl 安装 KubeSphere，以下命令仅用于默认的最小安装。

  ```bash
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
  
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
  ```

- 检查安装日志：

  ```bash
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
  ```

安装完成后，您会看到以下消息：

```yaml
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.XXX.XXX.XXX:30880
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

现在已经安装了 KubeSphere，可以按照以下步骤访问 KubeSphere 的 Web 控制台。

- 转到 DigitalOcean 提供的 Kubernetes 仪表板。

  ![kubernetes-dashboard-access](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/kubernetes-dashboard-access.png)

- 下拉选择 **kubesphere-system** 命名空间

  ![kubernetes-dashboard-namespace](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/kubernetes-dashboard-namespace.png)

- 在 **Service** -> **Services** 中，编辑 **ks-console** 服务。

  ![kubernetes-dashboard-edit](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/kubernetes-dashboard-edit.png)

- 将类型从`NodePort`更改为`LoadBalancer`，完成后更新文件。

  ![lb-change](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/lb-change.png)

- 使用 DO 生成的端点访问 KubeSphere 的 Web 控制台。

  ![access-console](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/access-console.png)

  {{< notice tip >}}

 除了将服务类型更改为`LoadBalancer`，您还可以通过`NodeIP:NodePort`（服务类型设置为`NodePort`）访问 KubeSphere 控制台，这种方式需要获取任意节点的公共 IP。

  {{</ notice >}}

- 使用默认帐户和密码（`admin/P@88w0rd`）登录控制台。


## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程，要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)。
