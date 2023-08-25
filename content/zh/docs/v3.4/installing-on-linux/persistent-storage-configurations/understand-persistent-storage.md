---
title: "安装持久化存储"
keywords: 'KubeSphere, Kubernetes, 存储, 安装, 配置'
description: '理解持久化存储。'
linkTitle: "安装持久化存储"
weight: 3310
---

持久化存储是安装 KubeSphere 的**必备条件**。使用 [KubeKey](../../../installing-on-linux/introduction/kubekey/) 搭建 KubeSphere 集群时，可以安装不同的存储系统作为[插件](https://github.com/kubesphere/kubekey/blob/master/docs/addons.md)。在 Linux 上通过 KubeKey 安装 KubeSphere 的一般步骤如下：

1. 安装 Kubernetes。
2. 安装所提供的任何插件。
3. 通过 [ks-installer](https://github.com/kubesphere/ks-installer) 安装 KubeSphere。

在第 2 步中，**必须**安装可用的 StorageClass，包括：

- StorageClass 本身
- 必要情况下，还需为 StorageClass 安装存储插件

{{< notice note >}}

某些存储系统需要您预先准备存储服务器，以提供外部存储服务。

{{</ notice >}} 

## KubeKey 如何安装不同的存储系统

KubeKey 会为集群创建[一个配置文件](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)（默认为 `config-sample.yaml`），其中包含定义不同资源（包括各种插件）的全部必要参数。QingCloud CSI 等不同的存储系统也能通过 Helm Chart 或 YAML 作为插件进行安装。若要让 KubeKey 以预期的方式来安装这些存储系统，就必须为 KubeKey 提供这些存储系统的必要配置。

通常，有两种方法能使 KubeKey 应用即将安装的存储系统的配置。

1. 直接在 `config-sample.yaml` 中的 `addons` 字段下输入必要的参数。
2. 为插件创建一个单独的配置文件，列出所有必要的参数，并在 `config-sample.yaml` 中提供文件的路径，以便 KubeKey 在安装过程中引用该路径。

有关更多信息，请参见[插件](https://github.com/kubesphere/kubekey/blob/master/docs/addons.md)。

## 默认存储类型

KubeKey 支持安装不同的存储插件和存储类型。无论您要安装哪种存储系统，都可以在其配置文件中指定是否设为默认存储类型。如果 KubeKey 检测到未指定默认存储类型，则将默认安装 [OpenEBS](https://github.com/openebs/openebs)。

OpenEBS 本地 PV 动态供应器可以使用节点上的唯一 HostPath（目录）来创建 Kubernetes 本地持久卷，以持久化数据。用户没有特定的存储系统时，可以通过默认的 OpenEBS 快速上手。

## 多存储解决方案

如果打算安装多个存储插件，那么只能将其中一个设置为默认存储类型。否则，KubeKey 将无法识别使用哪种存储类型。

## 支持的 CSI 插件

{{< content "common/csi-plugins.md" >}}