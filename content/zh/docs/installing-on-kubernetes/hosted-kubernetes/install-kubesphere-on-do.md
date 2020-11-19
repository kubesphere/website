---
title: "在DigitalOcean上部署KubeSphere"
keywords: 'Kubernetes, KubeSphere, DigitalOcean, 安装'
description: '介绍如何在DigitalOcean上部署 KubeSphere'

weight: 2265
---

![KubeSphere+DOKS](/images/docs/do/KubeSphere-DOKS.png)

本指南将引导您完成在[ DigitalOcean Kubernetes](https://www.digitalocean.com/products/kubernetes/)上部署KubeSphere的步骤。

## 准备一个DOKS集群

在 DO 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件。转到您的[DO account](https://cloud.digitalocean.com/)帐户，然后在导航菜单中，参考下图创建群集。

![create-cluster-do](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/create-cluster-do.png)

您需要选择：
1. Kubernetes版本（例如1.18.6-do.0）
2. 数据中心区域（例如`Frankfurt`）
3. VPC网络（例如default-fra1）
4. 群集容量（例如2个标准节点，每个节点具有2个vCPU和4GB RAM）
5. 集群的名称（例如kubesphere-3）

![config-cluster-do-1](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/config-cluster-do-1.png)

![config-cluster-do-2](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/config-cluster-do-2.png)


{{< notice note >}} 

- KubeSphere 3.0.0支持的Kubernetes版本：1.15.x，1.16.x，1.17.x，1.18.x。
- 此示例中包括3个节点。您可以根据自己的需求添加更多节点，尤其是在生产环境中。
- 用于最小化安装的机器类型Standard/4 GB/2 vCPU。如果计划启用多个可插拔组件或将群集用于生产，建议您将节点升级到规格更大的类型（例如，CPU优化的/ 8 GB / 4个vCPU）。DigitalOcean是基于工作节点的类型来配置主节点的，而对于标准节点，APIserver可能会很快会变得无响应。

{{</ notice >}} 

集群准备就绪后，您可以下载kubectl的配置文件。

![download-config-file](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/download-config-file.png)

## 在DOKS上安装KubeSphere

现在集群已准备就绪，您可以按照以下步骤安装KubeSphere：

- 使用kubectl安装KubeSphere。以下命令仅用于默认的最小安装。

  ```bash
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
  ```

- 创建一个本地cluster-configuration.yaml。
  ```
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
  ```

- 检查安装日志：

  ```bash
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
  ```

安装完成后，您会看到以下消息：

```bash
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

## 访问KubeSphere控制台

现在已经安装了KubeSphere，您可以按照以下步骤访问KubeSphere的Web控制台。

- 转到DigitalOcean提供的Kubernetes仪表板。

  ![kubernetes-dashboard-access](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/kubernetes-dashboard-access.png)

- 下拉选择kubesphere-system命名空间

  ![kubernetes-dashboard-namespace](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/kubernetes-dashboard-namespace.png)

- 在Service-> Service中，编辑ks-console服务。

  ![kubernetes-dashboard-edit](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/kubernetes-dashboard-edit.png)

- 将类型从NodePort更改为LoadBalancer。完成后更新文件。

  ![lb-change](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/lb-change.png)

- 使用DO生成的端点访问KubeSphere的Web控制台。

  ![access-console](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/access-console.png)

  {{< notice tip >}}

 除了将服务类型更改为LoadBalancer，您还可以通过NodeIP:NodePort（服务类型设置为NodePort）访问KubeSphere控制台。您需要获取任意节点的公共IP。

  {{</ notice >}}

- 使用默认帐户和密码（admin/P@88w0rd）登录控制台。在集群概述页面中，您可以看到如下图所示的仪表板。

  ![doks-cluster](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-do/doks-cluster.png)

## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程。要在KubeSphere中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)以获取更多详细信息。

