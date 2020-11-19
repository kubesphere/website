---
title: "在Azure AKS 上部署KubeSphere"
keywords: "KubeSphere, Kubernetes, 安装, Azure, AKS"
description: "如何在AKS上部署KubeSphere"

weight: 2270
---

本文演示在 [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/) 上部署 KubeSphere 的步骤。

## 准备AKS集群

Azure可以通过提供资源部署自动化选项来帮助您将基础设施实现为代码。常用的工具包括[ARM templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview)和[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/what-is-azure-cli?view=azure-cli-latest)。在本指南中，我们将使用Azure CLI创建安装KubeSphere所需的所有资源。


### 使用Azure Cloud Shell

由于Azure提供了基于Web的终端，因此您不必在计算机上安装Azure CLI。单击Azure门户右上角菜单栏上的Cloud Shell按钮。

![Cloud Shell](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/aks-launch-icon.png)

选择 **Bash** Shell.

![Bash Shell](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/aks-choices-bash.png)
### 创建资源组

Azure资源组是在其中部署和管理Azure资源的逻辑组。以下示例在`westus`区域中创建一个名为`KubeSphereRG`的资源组。

```bash
az group create --name KubeSphereRG --location westus
```

### 创建一个AKS集群
使用`az aks create`命令创建AKS集群。以下示例创建一个名为`KuberSphereCluster`的集群，该集群具有三个节点。这将需要几分钟才能完成。

```bash
az aks create --resource-group KubeSphereRG --name KuberSphereCluster --node-count 3 --enable-addons monitoring --generate-ssh-keys
```
{{< notice note >}}

您可以使用`--node-vm-size`或`-s`选项来更改Kubernetes节点的大小。默认值：Standard_DS2_v2（2vCPU，7GB内存）。有关更多选项，请参见[az aks create](https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-create).

{{</ notice >}} 

### 连接到集群

要配置使用kubectl连接到Kubernetes集群，请执行`az aks get-credentials`命令。该命令下载凭据并配置Kubernetes CLI以使用它们。


```bash
az aks get-credentials --resource-group KubeSphereRG --name KuberSphereCluster
```

查看节点信息
```bash
kebesphere@Azure:~$ kubectl get nodes
NAME                                STATUS   ROLES   AGE   VERSION
aks-nodepool1-27194461-vmss000000   Ready    agent   77s   v1.17.13
aks-nodepool1-27194461-vmss000001   Ready    agent   63s   v1.17.13
aks-nodepool1-27194461-vmss000002   Ready    agent   65s   v1.17.13
```
### 在门户中检查Azure资源
执行完以上所有命令后，您可以看到在Azure Portal中创建了2个资源组。

![Resource groups](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/aks-create-command.png)

查看资源组详情
```bash
kebesphere@Azure:~$ az group show --resource-group KubeSphereRG
{
  "id": "/subscriptions/6017690f-c286-4a8f-123e-c53e2f3bc7b5/resourceGroups/KubeSphereRG",
  "location": "westus",
  "managedBy": null,
  "name": "KubeSphereRG",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

Azure Kubernetes Services本身将放置在KubeSphereRG中。

![Azure Kubernetes Services](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/aks-dashboard.png)

所有其他资源都将放置在MC_KubeSphereRG_KuberSphereCluster_westus中，例如VM，负载均衡器和虚拟网络。

![Azure Kubernetes Services](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/aks-all-resources.png)

## 在AKS上部署KubeSphere

要开始部署KubeSphere，请使用以下命令。

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```
```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```
您可以通过以下命令检查安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## 访问KubeSphere控制台

要从公共IP地址访问KubeSphere控制台，您需要将服务类型更改为`LoadBalancer`。

```bash
kubectl edit service ks-console -n kubesphere-system
```

找到以下部分，并将类型更改为`LoadBalancer`。

```bash
spec:
  clusterIP: 10.0.78.113
  externalTrafficPolicy: Cluster
  ports:
  - name: nginx
    nodePort: 30880
    port: 80
    protocol: TCP
    targetPort: 8000
  selector:
    app: ks-console
    tier: frontend
    version: v3.0.0
  sessionAffinity: None
  type: LoadBalancer # Change NodePort to LoadBalancer
status:
  loadBalancer: {}
```

保存ks-console服务的配置后，可以使用以下命令获取公共IP地址（在下方EXTERNAL-IP）。

```bash
kebesphere@Azure:~$ kubectl get svc/ks-console -n kubesphere-system
NAME         TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
ks-console   LoadBalancer   10.0.181.93   13.86.xxx.xxx   80:30194/TCP   13m       6379/TCP       10m
```

使用external-ip地址以默认帐户和密码（admin/P@88w0rd）访问控制台。在集群概述页面中，您可以看到如下图所示的仪表板。

![aks-cluster](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/aks-cluster.png)

## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程。对于可插拔组件，可以在安装之前或之后启用它们。有关详细信息，请参见 [启用可插拔组件](../../../pluggable-components/)。
