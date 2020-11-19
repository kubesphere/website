---
title: "在Google GKE上部署KubeSphere"
keywords: 'Kubernetes, KubeSphere, GKE, 安装'
description: '介绍如何在Google GKE上部署 KubeSphere'

weight: 2265
---

![KubeSphere+GKE](https://pek3b.qingstor.com/kubesphere-docs/png/20191123145223.png)

本指南将引导您完成在[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/)上部署KubeSphere的步骤。

## 准备一个GKE集群

- 在 GKE 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件，转到导航菜单然后参考下图创建集群。

![create-cluster-gke](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/create-cluster-gke.png)

- 在“集群基本信息”中，选择一个主版本，指定Kubernetes静态版本。

![](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/master-version.png)

- 在“default-pool”下的“节点池详情”中，在此集群中定义3个节点。

![node-number](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/node-number.png)

- 转到“节点数”，选择镜像类型，然后设置如下机器配置。完成后，点击创建。

![machine-config](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/machine-configuration.png)

{{< notice note >}} 

- KubeSphere 3.0.0支持的Kubernetes版本：1.15.x，1.16.x，1.17.x，1.18.x。
- 这里以Ubuntu操作系统为例。有关支持的系统的更多信息，请参见概述。
- 此示例中包括3个节点。您可以根据自己的需求添加更多节点，尤其是在生产环境中。
- 最小安装的机器类型为e2-medium（2个vCPU，4GB内存）。如果要启用可插拔组件或将集群用于生产，请选择具有更多资源的机器类型。
- 对于其他设置，您也可以根据自己的需要进行更改，也可以使用默认值。

{{</ notice >}} 

- 当GKE群集准备就绪时，您可以使用Cloud Shell连接到群集。


![cloud-shell-gke](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/cloud-shell.png)

## 在GKE上安装KubeSphere

- 使用kubectl安装KubeSphere。以下命令仅用于默认的最小安装。

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

- 检查安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

- 安装完成后，您会看到以下消息：

```bash
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

## 访问KubeSphere控制台

现在已经安装了KubeSphere，您可以按照以下步骤访问KubeSphere的Web控制台。

- 在 **Services 和 Ingress** 选项中, 选择 **ks-console** 服务.

![ks-console](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/console-service.png)

- 在“服务详细信息”中，单击“修改”，然后将服务类型从NodePort更改为LoadBalancer。完成后保存文件。

![lb-change](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/lb-change.png)

- 使用GKE生成的端点访问KubeSphere的Web控制台。


![access-console](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/access-console.png)

{{< notice tip >}}

除了将服务类型更改为`LoadBalancer`，您还可以通过`NodeIP:NodePort`（服务类型设置为NodePort）访问KubeSphere控制台。您可能需要在防火墙规则中打开30880端口。

{{</ notice >}}

- 使用默认帐户和密码（admin/P@88w0rd）登录控制台。在集群概述页面中，您可以看到如下图所示的仪表板。

![gke-cluster](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/gke-cluster.png)

## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程。要在KubeSphere中启用其他组件，请参阅[启用可插拔组件 ](../../../pluggable-components/)以获取更多详细信息。