---
title: "概述"
keywords: 'Kubernetes, KubeSphere, Linux, Installation'
description: '介绍在 Linux 上安装 KubeSphere 的各种方式'

linkTitle: "概述"
weight: 3110
---

对于在 Linux 上的安装，KubeSphere 既可以安装在云中也可以安装在本地环境中，例如 AWS EC2，Azure VM 和裸机。用户可以在 Linux 主机上安装全新的 Kubernetes 和 KubeSphere 集群，安装过程简单而友好。同时，KubeSphere 不仅提供在线安装工具即 [KubeKey](https://github.com/kubesphere/kubekey)，而且还为无法访问 Internet 的环境提供了离线的安装解决方案。

作为 [GitHub](https://github.com/kubesphere) 上的开源项目，KubeSphere 是一个有成千上万的社区用户的聚集地，他们中的许多人已经把 KubeSphere 运行在生产环境中。

KubeSphere 有多种安装方式，请注意，这些安装方式不是互斥的。例如，您可以在离线环境中的多个节点上以最小化方式部署 KubeSphere。

- [All-in-One](../../../quick-start/all-in-one-on-linux/)：在单个节点上安装 KubeSphere，仅用于用户快速熟悉 KubeSphere。
- [多节点安装](../multioverview/)：在多个节点上安装单 master 的 KubeSphere，用于测试或开发。
- [离线安装](../air-gapped-installation/)：把 KubeSphere 的所有镜像打包用于没有互联网连接的离线环境下安装。
- [高可用安装](../../../installing-on-linux/high-availability-configurations/ha-configuration/)：多个节点上安装主节点高可用 KubeSphere，用于生产环境。
- 最小化安装：仅安装 KubeSphere 所需的最少系统组件。以下是最低资源要求:
  - 2 CPUs
  - 4GB RAM
  - 40GB Storage
- [全家桶安装](../../../pluggable-components/)：安装 KubeSphere 的所有可插拔系统组件，例如 DevOps，ServiceMesh 和告警等。

有关在 Kubernetes 上进行安装，请参阅[在 Kubernetes 上安装 KubeSphere 概述](../../../installing-on-kubernetes/introduction/overview/)。

## 安装前

- 由于需要从网络上下载镜像，因此您的环境必须可以访问 Internet。否则，需要改用离线方式安装。
- 对于 All-in-One 安装，唯一的节点既是主节点也是工作节点。
- 对于多节点安装，需要在安装之前在配置文件中指定节点角色。
- Linux 主机必须已安装 OpenSSH 服务。
- 在安装之前，请检查[端口要求](../port-firewall)。

## KubeKey

KubeKey 是用 Go 语言开发的，是一种全新的安装工具，可以替代以前使用的基于 ansible 的安装程序。KubeKey 为用户提供了灵活的安装选择，它既可以分别安装 KubeSphere 和 Kubernetes 也可以一次性同时安装它们，这既方便又高效。

KubeKey 的三种使用场景：

- 仅安装 Kubernetes;
- 在一个命令中同时安装 Kubernetes 和 KubeSphere;
- 先安装好 Kubernetes，然后使用 [ks-installer](https://github.com/kubesphere/ks-installer) 部署 KubeSphere。

## 快速安装用于开发和测试

自 v2.1.0 起，KubeSphere 升级为松耦合系统架构，默认情况下，KubeKey 仅安装必要的组件，这样安装速度既快而且资源消耗也最少。如果要启用增强的可插拔功能，请参阅[可插拔组件概述](../../../pluggable-components/)了解详细信息。

快速安装 KubeSphere 仅用于开发或测试，因为默认情况下它使用了 [openEBS](https://openebs.io/) 的[本地卷](https://kubernetes.io/docs/concepts/storage/volumes/#local)作为存储类型。如果需要在生产环境安装，请参阅[高可用配置安装](../../../installing-on-linux/high-availability-configurations/ha-configuration/)。

- **All-in-one**，只需一个命令即可进行单节点零配置安装。
- **多节点安装**，使用默认存储类（本地卷）在多个机器上安装 KubeSphere，并不需要单独安装存储服务（例如 Ceph 和 GlusterFS）。

## 可插拔组件概述

前面说过，自 v2.1.0 起，KubeSphere 变为松耦合系统架构。一些系统功能被设计为可插拔的组件，您可以在安装之前或之后启用它们。默认情况下，KubeKey 不安装这些可插拔组件，有关更多信息，请参见[启用可插拔组件](../../../pluggable-components/)。

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## 存储配置说明

KubeSphere 的存储既可以在安装之前配置也可以在安装之后添加，同时，KubeSphere 既支持一些开源的存储产品比如 Ceph, GlusterFS 等，也支持商业化的存储方案。有关如何在安装 KubeSphere 之前配置存储类的详细说明请看[配置持久化存储](../storage-configuration)。安装 KubeSphere 之后如何添加存储类型请参阅[添加新的存储类型](../../../cluster-administration/persistent-volume-and-storage-class/)。

## 集群运维

### 添加新节点

集群资源在使用过程通常因为负载的提高需要增加节点，尤其是在生产环境中，使用 KubeKey，可以方便地扩展节点的数量。有关更多信息，请参阅[添加新节点](../../../installing-on-linux/cluster-operation/add-new-nodes/)。

### 删除节点

同样，负载降低常常需要删除节点节省资源。首先需要清空该节点负载，然后再删除。有关更多信息，请参阅[删除节点](../../cluster-operation/remove-nodes)。

## 卸载

卸载 KubeSphere 和 Kubernetes 意味着删除整个集群，这是不可逆的，请谨慎操作。

有关更多信息，请参见[卸载 KubeSphere 和 Kubernetes](../../../installing-on-linux/uninstalling/uninstalling-kubesphere-and-kubernetes/)。
