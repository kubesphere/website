---
title: "在 Azure VM 实例上部署 KubeSphere"
keywords: "KubeSphere, Installation, HA, high availability, load balancer, Azure"
description: "了解如何在 Azure 虚拟机上创建高可用 KubeSphere 集群。"
linkTitle: "在 Azure VM 实例上部署 KubeSphere"
Weight: 3410

---

您可以使用 [Azure 云平台](https://azure.microsoft.com/zh-cn/overview/what-is-azure/)自行安装和管理 Kubernetes，或采用托管 Kubernetes 解决方案。如果要使用完全托管平台解决方案，请参阅 [在 AKS 上部署 KubeSphere](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-aks/)。

此外，您也可以在 Azure 实例上搭建高可用集群。本指南演示如何创建生产就绪的 Kubernetes 和 KubeSphere 集群。

## 简介

本教程使用 Azure 虚拟机的两个主要功能：

- [虚拟机规模集](https://docs.microsoft.com/zh-cn/azure/virtual-machine-scale-sets/overview)（Virtual Machine Scale Sets 简称 VMSS）：使用 Azure VMSS 可以创建和管理一组负载均衡的虚拟机。虚拟机实例的数量可以根据需求或者定义的计划自动增加或减少（支持 Kubernetes Autoscaler，本教程未介绍。更多信息请参考  [autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/azure)），非常适合工作节点。
- [可用性集](https://docs.microsoft.com/zh-cn/azure/virtual-machines/availability-set-overview)：可用性集是数据中心内自动分布在容错域中的虚拟机的逻辑分组。这种方法限制了潜在的硬件故障、网络中断或电源中断的影响。所有充当主节点和 etcd 节点的虚拟机将被置于一个可用性集中，以实现高可用性。

除这些虚拟机外，还将使用负载均衡器、虚拟网络和网络安全组等其他资源。

## 准备工作

- 需要一个 [Azure](https://portal.azure.com) 帐户来创建所有资源。
- 了解 [Azure 资源管理器](https://docs.microsoft.com/zh-cn/azure/azure-resource-manager/templates/)（Azure Resource Manager 简称 ARM）模板的基本知识，这些模板文件定义您项目的基础结构和配置。 
- 对于生产环境，建议准备持久化存储并创建 StorageClass。对于开发和测试环境，可以使用 [OpenEBS](https://openebs.io/)（由 KubeKey 默认安装）提供 LocalPV。

## 架构

六台 **Ubuntu 18.04** 的机器会被部署至 Azure 资源组中。其中三台机器会分至同一个可用性集，同时充当主节点和 etcd 节点。其他三个虚拟机会被定义为 VMSS，工作节点将在其中运行。

![Architecture](/images/docs/v3.3/aks/Azure-architecture.png)

这些虚拟机将连接至负载均衡器，其中两个包含预定义规则：

- **入站 NAT**：为每台机器映射 SSH 端口，以便管理虚拟机。
- **负载均衡**：默认情况下，http 和 https 端口将映射至节点池。后续可根据需求添加其他端口。

| 服务       | 协议 | 规则     | 后端端口 | 前端端口                         | 节点池           |
| ---------- | ---- | -------- | -------- | -------------------------------- | ---------------- |
| ssh        | TCP  | 入站 NAT | 22       | 50200, 50201, 50202, 50100~50199 | 主节点, 普通节点 |
| api 服务器 | TCP  | 负载均衡 | 6443     | 6443                             | 主节点           |
| ks 控制台  | TCP  | 负载均衡 | 30880    | 30880                            | 主节点           |
| http       | TCP  | 负载均衡 | 80       | 80                               | 普通节点         |
| https      | TCP  | 负载均衡 | 443      | 443                              | 普通节点         |

## 创建高可用集群基础设施

您不必逐个创建这些资源。基于在 Azure 上**基础设施即代码**的概念，在这个架构下所有资源已经被定义成 ARM 模板。

### 准备机器

1. 点击 **Deploy** 按钮，页面将会被重定向至 Azure 并被要求填写部署参数。 

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FRolandMa1986%2Fazurek8s%2Fmaster%2Fazuredeploy.json" rel="nofollow"><img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true" alt="Deploy to Azure" style="max-width:100%;"></a> <a href="http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FRolandMa1986%2Fazurek8s%2Fmaster%2Fazuredeploy.json" rel="nofollow"><img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true" alt="Visualize" style="max-width:100%;"></a>

2. 在显示页面上，只需更改几个参数。点击 **Resource group** 下方的 **Create new**，输入名称，例如：`KubeSphereVMRG`。

3. 在 **Admin Username** 中输入管理员用户名。

4. 复制您的 SSH 公钥至 **Admin Key** 中。或者，使用 `ssh-keygen` 创建一个新的密钥。

   ![azure-template-parameters](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-azure-vms/azure-template-parameters.png)

   {{< notice note >}}

Linux 只接受 SSH 验证，密码身份验证在其配置中受限。

{{</ notice >}}

5. 点击底部的 **Purchase** 继续。

### 查看门户中的 Azure 资源

创建成功后，所有资源会显示在 `KubeSphereVMRG` 资源组中。记录负载均衡器的公用 IP 和虚拟机的私有 IP 地址，以备后续使用。

![New Created Resources](/images/docs/v3.3/aks/azure-vm-all-resources.png)

## 部署 Kubernetes 和 KubeSphere

在设备上执行以下命令，或者通过 SSH 连接其中一台主节点虚拟机。在安装过程中，文件会被下载并分配到每个虚拟机中。

```bash
# copy your private ssh to master-0
scp -P 50200  ~/.ssh/id_rsa kubesphere@40.81.5.xx:/home/kubesphere/.ssh/

# ssh to the master-0
ssh -i .ssh/id_rsa2  -p50200 kubesphere@40.81.5.xx
```

### 下载 KubeKey

[Kubekey](../../../installing-on-linux/introduction/kubekey/) 是一个全新下载工具，提供简单、快速和灵活的方式来安装 Kubernetes 和 KubeSphere。

1. 下载 KubeKey，便于下一步生成配置文件。

   {{< tabs >}}

   {{< tab "如果您能正常访问 GitHub/Googleapis">}}

从 KubeKey 的 [Github 发布页面](https://github.com/kubesphere/kubekey/releases)下载，或执行以下命令：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

运行以下命令，确保从正确区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果在与 Googleapis 网络连接不良的新机器上，则必须再次运行 `export KKZONE=cn`，然后继续执行一下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

   {{< notice note >}}

上面的命令会下载 KubeKey 最新版本 (v2.3.0)。您可以在命令中更改版本号以下载特定版本。

{{</ notice >}} 

   给予 `kk` 执行权限:

   ```bash
   chmod +x kk
   ```



2. 使用默认配置创建示例配置文件，这里以 Kubernetes v1.22.10 为例。

   ```bash
   ./kk create config --with-kubesphere v3.3.1 --with-kubernetes v1.22.10
   ```

   {{< notice note >}}

- KubeSphere 3.3 对应 Kubernetes 版本推荐：v1.19.x、v1.20.x、v1.21.x、 v1.22.x 和 v1.23.x（实验性支持）。如果未指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关支持的 Kubernetes 版本请参阅[支持矩阵](../../../installing-on-linux/introduction/kubekey/#support-matrix)。
- 如果在此步骤中的命令中未添加标志 `--with-kubesphere`，则不会部署 KubeSphere，除非您使用配置文件中的 `addons` 字段进行安装，或稍后使用 `./kk create cluster` 时再次添加此标志。

- 如果在未指定 KubeSphere 版本的情况下添加标志 --with kubesphere`，将安装 KubeSphere 的最新版本。

{{</ notice >}}

### 配置文件示例

```yaml
spec:
  hosts:
  - {name: master-0, address: 40.81.5.xx, port: 50200, internalAddress: 10.0.1.4, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: master-1, address: 40.81.5.xx, port: 50201, internalAddress: 10.0.1.5, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: master-2, address: 40.81.5.xx, port: 50202, internalAddress: 10.0.1.6, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: node000000, address: 40.81.5.xx, port: 50100, internalAddress: 10.0.0.4, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: node000001, address: 40.81.5.xx, port: 50101, internalAddress: 10.0.0.5, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: node000002, address: 40.81.5.xx, port: 50102, internalAddress: 10.0.0.6, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  roleGroups:
    etcd:
    - master-0
    - master-1
    - master-2
    control-plane:
    - master-0
    - master-1
    - master-2
    worker:
    - node000000
    - node000001
    - node000002
```

有关更多信息，请参阅[文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)。

### 配置负载均衡器

除了节点信息外，还需要在同一 YAML 文件中配置负载均衡器。对于 IP 地址，您可以在 **Azure > KubeSphereVMRG > PublicLB** 中找到它。假设负载均衡器的 IP 地址和监听端口分别为 `40.81.5.xx` 和 `6443`，您可以参考以下示例。

```yaml
## Public LB config example
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "40.81.5.xx"
    port: 6443
```

{{< notice note >}}

由于 Azure [负载均衡器限制](https://docs.microsoft.com/zh-cn/azure/load-balancer/load-balancer-troubleshoot#cause-4-accessing-the-internal-load-balancer-frontend-from-the-participating-load-balancer-backend-pool-vm)，直接使用公有的负载均衡器而不是内置的负载均衡器。

{{</ notice >}}

### 持久化存储插件配置

有关详细信息，请参阅[持久化存储配置](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)。

### 配置网络插件

Azure 虚拟网络不支持 [Calico](https://docs.projectcalico.org/reference/public-cloud/azure#about-calico-on-azure) 使用 IPIP 模式，需要将网络插件更改为 `flannel`。

```yaml
  network:
    plugin: flannel
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
```

### 创建集群

1. 在完成配置之后，执行以下命令开始安装：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

2. 检查安装日志：

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

3. 当安装完成，会出现如下信息：

   ```bash
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   Console: http://10.128.0.44:30880
   Account: admin
   Password: P@88w0rd
   NOTES：
     1. After you log into the console, please check the
        monitoring status of service components in
        the "Cluster Management". If any service is not
        ready, please wait patiently until all components
        are up and running.
     2. Please change the default password after login.
   #####################################################
   https://kubesphere.io             2020-xx-xx xx:xx:xx
   ```

4. 使用 `<NodeIP>:30880` 和默认的帐户和密码 (`admin/p@88w0rd`) 访问 KubeShpere 控制台。


## 添加额外端口

由于 Kubernetes 集群直接搭建在 Azure 实例上，因此负载均衡器未与 [Kubernetes 服务](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)集成。但是，您仍然可以手动将 NodePort 映射到负载均衡器。这需要两个步骤：

1. 在负载均衡器中创建新的负载均衡规则。

   ![Load Balancer](/images/docs/v3.3/aks/azure-vm-loadbalancer-rule.png)

2. 在网络安全组中创建入站安全规则以允许外网访问。

   ![Firewall](/images/docs/v3.3/aks/azure-vm-firewall.png)

