---
title: "概述"
keywords: 'Kubernetes, KubeSphere, Linux, Installation'
description: 'Overview of Installing KubeSphere on Linux'

linkTitle: "概述"
weight: 2110
---

对于在 Linux 上的安装，KubeSphere 既可以安装在云中也可以安装在本地环境中，例如 AWS EC2，Azure VM 和裸机。 用户可以在配置新的 Kubernetes 集群时在 Linux 主机上安装 KubeSphere。 安装过程简单而友好。 同时，KubeSphere不仅提供在线安装程序或 [KubeKey](https://github.com/kubesphere/kubekey) ，而且还为无法访问 Internet 的环境提供了离线的安装解决方案。

作为 [GitHub](https://github.com/kubesphere) 上的开源项目， KubeSphere 是一个有成千上万的社区用户的聚集地。 他们中的许多人把KubeSphere 运行在生产环境中。

为用户提供了多个安装选项。 请注意，并非所有选项都是互斥的。 例如，您可以在离线环境中的多个节点上以最小化部署 KubeSphere。

- [All-in-One](../../../quick-start/all-in-one-on-linux/): 在单个节点上安装 KubeSphere  。 仅用于用户快速熟悉 KubeSphere。
- [Multi-Node](../multioverview/): 在多个节点上安装 KubeSphere  。 用于测试或开发。
- [Install KubeSphere on Air-gapped Linux](../air-gapped-installation): 把 KubeSphere 的所有镜像打包，方便再 Linux 上离线安装。
- High Availability Installation: 在用于生产环境的多个节点上安装高可用性 KubeSphere。
- Minimal Packages: 仅安装 KubeSphere 所需的最少系统组件。 以下是最低资源要求:
  - 2vCPUs
  - 4GB RAM
  - 40GB Storage
- [Full Packages](../complete-installation): 安装 KubeSphere 的所有可用系统组件，例如 DevOps，ServiceMesh 和告警。


有关在 Kubernetes 上进行安装，请参阅在 Kubernetes 上进行安装概述。

## 安装前

- 由于镜像和操作系统将从网络上下载，因此您的环境必须可以访问 Internet。 否则，您需要改用离线式安装程序。
- 对于 All-in-One 安装，唯一的节点是主节点和工作节点。
- 对于多节点安装，需要在安装之前在配置文件中指定节点角色。
- 您的 Linux 主机必须已安装 OpenSSH 服务。
- 在安装之前，请检查[端口要求](../port-firewall) 。

## KubeKey

KubeKey 是用 Go 语言开发的，代表了一种全新的安装工具，可以替代以前使用的基于ansible的安装程序。 KubeKey 为用户提供了灵活的安装选择，因为他们可以分别安装KubeSphere和Kubernetes或一次安装它们，这既方便又高效。

使用 KubeKey 的三种方案：

- 仅安装Kubernetes;
- 在一个命令中一起安装 Kubernetes 和 KubeSphere;
- 首先安装Kubernetes，然后使用 [ks-installer](https://github.com/kubesphere/ks-installer) 在 Kubernetes 上部署 KubeSphere。

{{< notice note >}}

如果您已有 Kubernetes 集群，请参考[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。

{{</ notice >}} 

## 快速安装用于开发和测试

自v2.1.0起，KubeSphere 已取消了某些组件的耦合。 默认情况下，KubeKey 仅安装必要的组件，因为这种方法具有安装速度快和资源消耗最少的特点。 如果要启用增强的可插拔功能，请参阅[可插拔组件概述](../../../pluggable-components/)了解详细信息。

快速安装KubeSphere仅用于开发或测试，因为默认情况下它使用本地卷进行存储。 如果要进行生产安装，请参阅“ HA群集配置”。

- **All-in-one**. 这意味着只需一个命令即可进行单节点无忧安装。
- **Multi-node**. 它允许您使用默认存储类（本地卷）在多个实例上安装 KubeSphere，这意味着不需要安装存储服务器（例如 Ceph 和 GlusterFS）。

{{< notice note >}}

关于离线安装，请参考[在 Linux 上离线安装 KubeSphere](../air-gapped-installation/)。

{{</ notice >}} 

## 在 Linux 上安装HA KubeSphere

KubeKey 允许用户安装高度可用的群集进行生产。用户需要预先配置负载均衡器和持久性存储服务。

- [持久卷配置](../storage-configuration)：默认情况下，KubeKey 使用基于 [openEBS](https://openebs.io/) 的[本地卷](https://kubernetes.io/docs/concepts/storage/volumes/#local)在 Kubernetes 集群中为存储服务提供动态配置。这对于快速安装测试环境非常方便。在生产环境中，必须设置存储服务器。有关详细信息，请参阅[Persistent Storage Configuration](../storage-configuration)。
- [用于HA安装的负载均衡器配置](../master-ha)：在生产环境中开始进行多节点安装之前，需要配置负载均衡器。云负载均衡器，Nginx 和 `HAproxy + Keepalived`  均可用于安装。

有关更多信息，请参见HA群集配置。您还可以在“在公共云上安装”中看到跨主要云提供商进行HA安装的特定步骤。

## 可插拔组件概述

自v2.1.0起，KubeSphere 已取消了一些核心功能组件的耦合。 这些组件被设计为可插拔的，这意味着您可以在安装之前和之后都启用它们。 默认情况下，KubeKey 不安装这些可插入组件。 有关更多信息，请参见[启用可插拔组件](../../../pluggable-components/)。

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## 存储配置说明

以下链接说明了如何配置不同类型的持久性存储服务。 有关如何在 KubeSphere 中配置存储类的详细说明，请参考[Storage Configuration Instruction](../ storage-configuration)。

- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/)
- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)

## 集群运维

### 添加新节点

使用 KubeKey，您可以扩展节点的数量，以在安装后满足更高的资源需求，尤其是在生产环境中。 有关更多信息，请参阅[添加新节点](../../../installing-on-linux/cluster-operation/add-new-nodes/)。

### 删除节点

您需要先清空节点，然后再删除。 有关更多信息，请参阅[删除节点](../../cluster-operation/remove-nodes)。

### 添加新的存储类

KubeKey 允许您在安装后设置新的存储类。 您可以为 KubeSphere 本身和工作负载设置不同的存储类。

有关更多信息，请参见添加新的存储类。

## 卸载

卸载 KubeSphere 意味着将其从计算机中删除，这是不可逆的。 请谨慎操作。

有关更多信息，请参见[卸载](../../../installing-on-linux/uninstalling/uninstalling-kubesphere-and-kubernetes/)。
