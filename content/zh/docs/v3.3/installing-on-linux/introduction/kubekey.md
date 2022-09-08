---
title: "KubeKey"
keywords: 'KubeKey，安装，KubeSphere'
description: '了解 KubeKey 概念以及 KubeKey 如何帮您创建、扩缩和升级 Kubernetes 集群。'
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

下载 KubeKey 之后，您可以使用可执行文件 `kk` 来进行不同的操作。无论您是使用它来创建，扩缩还是升级集群，都必须事先使用 `kk` 准备配置文件。此配置文件包含集群的基本参数，例如主机信息、网络配置（CNI 插件以及 Pod 和 Service CIDR）、仓库镜像、插件（YAML 或 Chart）和可插拔组件选项（如果您安装  KubeSphere）。有关更多信息，请参见[示例配置文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)。

准备好配置文件后，您需要使用 `./kk` 命令以及不同的标志来进行不同的操作。这之后，KubeKey 会自动安装 Docker，并拉取所有必要的镜像以进行安装。安装完成后，您还可以检查安装日志。

## 为什么选择 KubeKey

- 以前基于 ansible 的安装程序依赖于许多软件，例如 Python。KubeKey 由 Go 语言开发，可以消除在多种环境中出现的问题，确保成功安装。
- KubeKey 支持多种安装选项，例如 [All-in-One](../../../quick-start/all-in-one-on-linux/)、[多节点安装](../multioverview/)以及[离线安装](../air-gapped-installation/)。
- KubeKey 使用 Kubeadm 在节点上尽可能多地并行安装 Kubernetes 集群，使安装更简便，提高效率。与旧版的安装程序相比，它极大地节省了安装时间。
- KubeKey 提供[内置高可用模式](../../high-availability-configurations/internal-ha-configuration/)，支持一键安装高可用 Kubernetes 集群。
- KubeKey 旨在将集群作为对象来进行安装，即 CaaO。

## 下载 KubeKey

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接运行以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tabs >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令来下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果您将其转移到访问 Googleapis 受限的新机器上，请务必再次运行 `export KKZONE=cn`，然后继续执行以下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

通过以上的命令，可以下载 KubeKey 的最新版本 (v2.2.2)。您可以更改命令中的版本号来下载特定的版本。

{{</ notice >}}

## 支持矩阵

若需使用 KubeKey 来安装 Kubernetes 和 KubeSphere 3.3.0，请参见下表以查看所有受支持的 Kubernetes 版本。

| KubeSphere 版本 | 受支持的 Kubernetes 版本 | 
| ------------------ | ------------------------------------------------------------ |
| v3.3.0             | v1.19.x、v1.20.x、v1.21.x、v1.22.x、v1.23.x（实验性支持） |

{{< notice note >}} 

- 您也可以运行 `./kk version --show-supported-k8s`，查看能使用 KubeKey 安装的所有受支持的 Kubernetes 版本。
- 能使用 KubeKey 安装的 Kubernetes 版本与 KubeSphere v3.3.0 支持的 Kubernetes 版本不同。如需[在现有 Kubernetes 集群上安装 KubeSphere 3.3.0](../../../installing-on-kubernetes/introduction/overview/)，您的 Kubernetes 版本必须为 v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 如果您需要使用 KubeEdge，为了避免兼容性问题，建议安装 v1.21.x 及以下版本的 Kubernetes。
{{</ notice >}} 