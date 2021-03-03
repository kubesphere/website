---
title: "概述"
keywords: 'Kubernetes, KubeSphere, Linux, Installation'
description: '介绍在 Linux 上安装 KubeSphere 的各种方式'

linkTitle: "概述"
weight: 3110
---

KubeSphere 是[GitHub](https://github.com/kubesphere)上的一个开源项目，可供成千上万名社区用户使用。很多社区用户都在使用 KubeSphere 来运行生产工作负载。对于在 Linux 上的安装，KubeSphere 既可以部署在云端，也可以部署在本地环境中，例如 **AWS EC2**，**Azure VM** 和裸机。

由于 KubeSphere 为用户提供轻量级安装程序[KubeKey](https://github.com/kubesphere/kubekey)，该程序支持 Kubernetes，KubeSphere 和相关插件的安装，因此安装过程简单而友好。KubeKey 不仅可以帮助用户在线创建集群，而且可以作为无网络连接环境中的离线安装解决方案。

下列是可行的安装选项：

- [All-in-One](../../../quick-start/all-in-one-on-linux/)：在单个节点上安装 KubeSphere（仅为让用户快速熟悉 KubeSphere）。
- [多节点安装](../multioverview/)：在多个节点上安装 KubeSphere（用于测试或开发）。
- [在 Linux 上离线安装](../air-gapped-installation/)：将 KubeSphere 的所有镜像打包（便于在 Linux 上进行离线安装）。
- [高可用安装](../../../installing-on-linux/high-availability-configurations/ha-configuration/)：安装具有多个节点的高可用 KubeSphere 集群，该集群用于生产环境。
- 最小化安装：仅安装 KubeSphere 所需的最少系统组件。以下是最低资源要求：
  - 2 个 CPU
  - 4GB 运行内存
  - 40GB 储存空间
- [全家桶安装](../../../pluggable-components/)：安装 KubeSphere 的所有可用系统组件，例如 DevOps，ServiceMesh 和告警。

如果您已有 Kubernetes 集群，请参阅[在 Kubernetes 上安装 KubeSphere 概述](../../../installing-on-kubernetes/introduction/overview/)。

## 安装前

- 由于需要从网络上拉取镜像，因此您的环境必须可以访问 Internet。否则，需要改用[离线环境安装 KubeSphere](../../installing-on-linux/introduction/air-gapped-installation/)。
- 对于 All-in-One，唯一的节点既是主节点，也是工作节点。
- 对于多节点安装，需要在配置文件中提供主机信息。
- Linux 主机必须已安装 OpenSSH Server。
- 在安装之前，请参见[端口要求](../port-firewall)。

## KubeKey

[KubeKey](https://github.com/kubesphere/kubekey)为群集的安装和配置提供了一种有效的方法。您可以使用它来创建，扩缩和升级 Kubernetes 集群。它也允许您在设置集群时安装云原生组件（YAML 或 Chart）。更多信息，请参见 [KubeKey](../../installing-on-linux/introduction/kubekey/)。

## 快速安装以用于开发和测试

自 v2.1.0 以来，KubeSphere 已经解耦了一些组件。默认情况下，KubeKey 仅安装必要的组件，这样安装速度快，资源消耗也最少。如果要启用增强的可插拔功能，请参阅[启用可插拔组件](../../../pluggable-components/)了解详细信息。

快速安装 KubeSphere 仅用于开发或测试，因为默认情况下它使用了基于 [openEBS](https://openebs.io/) 的[本地卷](https://kubernetes.io/docs/concepts/storage/volumes/#local)提供储存服务。如果需要在生产环境安装，请参见[高可用配置安装](../../../installing-on-linux/high-availability-configurations/ha-configuration/)。

## 可插拔组件概述

前文提到，自 v2.1.0 起，KubeSphere 解耦了一些核心组件。这些组件被设计为可插拔组件，您可以在安装之前或之后启用任意组件。默认情况下，KubeKey 不安装这些可插拔组件，更多信息，请参见[启用可插拔组件](../../../pluggable-components/)。

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## 存储配置说明

KubeSphere 的持久性储存服务既可以在安装之前也可以在安装之后进行配置，同时，KubeSphere 既支持一些开源的存储产品比如 Ceph, GlusterFS 等，也支持商业化的存储方案。有关如何在安装 KubeSphere 之前配置存储类的详细说明请看[配置持久化存储](../storage-configuration)。安装 KubeSphere 之后如何添加存储类型请参阅[添加新的存储类型](../../../cluster-administration/persistent-volume-and-storage-class/)。

## 集群运维

### 添加新节点

集群资源在使用过程通常因为负载的提高需要增加节点，尤其是在生产环境中，使用 KubeKey，可以方便地扩展节点的数量。有关更多信息，请参阅[添加新节点](../../../installing-on-linux/cluster-operation/add-new-nodes/)。

### 删除节点

同样，负载降低常常需要删除节点节省资源。首先需要清空该节点负载，然后再删除。有关更多信息，请参阅[删除节点](../../cluster-operation/remove-nodes)。

## 卸载

卸载 KubeSphere 和 Kubernetes 意味着删除整个集群，这是不可逆的，请谨慎操作。

有关更多信息，请参见[卸载 KubeSphere 和 Kubernetes](../../../installing-on-linux/uninstalling/uninstalling-kubesphere-and-kubernetes/)。
