---
title: "KubeKey"
keywords: 'KubeKey，安装，KubeSphere'
description: '了解 KubeKey'
linkTitle: "KubeKey"
weight: 3120
---

[KubeKey](https://github.com/kubesphere/kubekey)（由 Go 语言开发）是一种全新的安装工具，替代了以前使用的基于 ansible 的安装程序。KubeKey 为您提供灵活的安装选择，您可以仅安装 Kubernetes，也可以同时安装 Kubernetes 和 KubeSphere。

KubeKey 的几种使用场景：

- 仅安装 Kubernetes；
- 使用一个命令同时安装 Kubernetes 和 KubeSphere；
- 扩缩集群；
- 升级集群；
- 安装 Kubernetes 相关的插件（Chart 或 YAML）。

## KubeKey 如何运作

下载 KubeKey 之后，您可以使用可执行文件 `kk` 来进行不同的操作。无论您是使用它来创建，扩缩还是升级集群，都必须事先使用 `kk` 准备配置文件。此配置文件包含集群的基本参数，例如主机信息、网络配置（CNI 插件以及 Pod 和 Service CIDR）、仓库镜像、插件（YAML 或 Chart）和可插拔组件选项（如果您安装  KubeSphere）。有关更多信息，请参见[示例配置文件](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)。

准备好配置文件后，您需要使用 `./kk` 命令以及不同的标志来进行不同的操作。这之后，KubeKey 会自动安装 Docker，并拉取所有必要的镜像以进行安装。安装完成后，您还可以检查安装日志。

## 为什么选择 KubeKey

- 以前基于 ansible 的安装程序依赖于许多软件，例如 Python。KubeKey 由 Go 语言开发，可以消除在多种环境中出现的问题，确保成功安装。
- KubeKey 支持多种安装选项，例如 [All-in-One](../../../quick-start/all-in-one-on-linux/)、[多节点安装](../multioverview/)以及[离线安装](../air-gapped-installation/)。
- KubeKey 使用 Kubeadm 在节点上尽可能多地并行安装 Kubernetes 集群，使安装更简便，提高效率。与旧版的安装程序相比，它极大地节省了安装时间。
- KubeKey 旨在将群集作为对象来进行安装，即 CaaO。

## 下载 KubeKey

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接运行以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tabs >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令来下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果您将其转移到访问 Googleapis 受限的新机器上，请务必再次运行 `export KKZONE=cn`，然后继续执行以下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

通过以上的命令，可以下载 KubeKey 的最新版本 (v1.0.1)。您可以更改命令中的版本号来下载特定的版本。

{{</ notice >}}