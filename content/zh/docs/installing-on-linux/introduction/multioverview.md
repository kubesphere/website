---
title: "多节点安装"
keywords: 'Multi-node, Installation, KubeSphere, 多节点, 安装'
description: '多节点安装概述'

linkTitle: "多节点安装"
weight: 2112
---

在生产环境中，单节点群集因其群集资源有限且计算能力不足而无法满足大多数需求。 因此，单节点集群并不适用于大规模数据处理。 此外，单节点集群只有一个节点因而不具有高可用性。 与之相对的，多节点集群结构是最常见和首选的应用程序部署和分发选择。

本节概述了多节点集群的安装，包括概念、KubeKey 和具体的步骤。 有关 HA 安装的信息，请参阅在公有云上安装和在本地环境中安装。

## 概念

多节点群集由至少一个主节点和一个工作节点组成。 您可以使用任何节点作为 **任务箱** 来执行安装任务。 您可以在安装之前和之后根据需要添加其他节点（例如，为了实现高可用性）。

- **主节点**： 主节点通常承载控制和管理整个系统的控制平台。
- **工作节点**： 工作节点运行部署在其上的实际应用程序。

## 为什么选择 KubeKey

如果您不熟悉 Kubernetes 组件，您可能会发现很难建立一个功能强大的多节点 Kubernetes 集群。 从 3.0.0 版本开始，KubeSphere 使用一个名为 KubeKey 的全新安装程序来替换基于 ansible 的旧安装程序。 KubeKey 用 Go 语言开发，允许用户快速部署多节点架构。

对于没有现有 Kubernetes 集群的用户，只需在 KubeKey 下载完成后使用少量命令创建一个配置文件，并在其中添加节点信息（如 IP 地址和节点角色）。只需一个命令，即可开始安装，无需进行其他操作。

### 优势
- 基于 Ansible 的安装程序具有大量软件依赖性，例如 Python。KubeKey 是使用 Go 语言开发的，可以消除在各种环境中出现的问题，从而提高安装成功率。
- KubeKey 使用 Kubeadm 在节点上尽可能多地并行安装 K8s 集群，以降低安装复杂性并提高效率。与较早的安装程序相比，它将大大节省安装时间。
- KubeKey 支持将群集从 all-in-one 扩展到多节点群集甚至 HA 集群。
- KubeKey 旨在将群集当作一个对象操作，即 CaaO。

## 步骤 1: 准备 Linux 主机

请参阅下面显示的硬件及操作系统要求。要开始进行多节点安装，您需要根据以下要求准备至少三台主机。

### 系统要求

| 操作系统                                                | 最小配置 (每个节点)            |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 核, 内存: 4 G, 磁盘空间: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 核, 内存: 4 G, 磁盘空间: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 核, 内存: 4 G, 磁盘空间: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 核, 内存: 4 G, 磁盘空间: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 核, 内存: 4 G, 磁盘空间: 40 G |

{{< notice note >}}

`/var/lib/docker` 主要用于存储容器数据，在使用和操作过程中会逐渐增大。对于生产环境，建议 `/var/lib/docker` 单独挂盘。

{{</ notice >}}

### 节点配置

- 所有节点必须可通过 `SSH` 访问。
- 所有节点的时间同步。
- `sudo`/`curl`/`openssl` 应可以在所有节点中使用。
- `ebtables`/`socat`/`ipset`/`conntrack` 应安装在所有节点上。
- `docker` 可以自己安装，也可以通过 KubeKey 安装。

### 网络和DNS要求

- 确保 `/etc/resolv.conf` 中的DNS地址可用。 否则可能会导致集群中出现某些DNS问题。
- 如果您的网络配置使用防火墙或安全组，则必须确保基础结构组件可以通过特定端口相互通信。 建议您关闭防火墙或遵循指南 [网络访问](https://github.com/kubesphere/kubekey/blob/master/docs/network-access.md)。

{{< notice tip >}}

- 建议您的操作系统环境足够干净 (不安装任何其他软件)，否则可能会发生冲突。
- 如果在从 dockerhub.io 下载镜像时遇到问题，建议准备一个容器镜像仓库（加速器）。 详见 [为Docker程序配置镜像仓库](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)。

{{</ notice >}}

本示例包括以下三个主机，其中主节点用作任务箱。

| 主机 IP     | 主机 Name | 角色         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## 步骤 2：下载 KubeKey

请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "对于难以连接至 GitHub 的用户" >}}

使用以下命令下载 KubeKey：

```bash
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```
{{</ tab >}}

{{< tab "对于与 GitHub 具有良好网络连接的用户" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases/tag/v1.0.0) 下载KubeKey或直接使用以下命令。

```bash
wget https://github.com/kubesphere/kubekey/releases/download/v1.0.0/kubekey-v1.0.0-linux-amd64.tar.gz
```
{{</ tab >}}

{{</ tabs >}}

授予 `kk` 可执行权限：

```bash
chmod +x kk
```

## 步骤 3： 创建集群

对于多节点安装，您需要通过指定配置文件来创建集群。

### 1. 创建一个示例配置文件

执行命令：

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

{{< notice info >}}

支持的 Kubernetes 版本： *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.

{{</ notice >}}

以下是一些示例可供参考：

- 您可以使用默认配置创建示例配置文件。也可以指定配置文件的生成路径与文件名。

```bash
./kk create config [-f ~/myfolder/abc.yaml]
```

- 您可以在 `sample-config.yaml` 中自定义持久化存储插件（例如 NFS Client，Ceph RBD 和 GlusterFS）。

```bash
./kk create config --with-storage localVolume
```

{{< notice note >}}

默认情况下，KubeKey 将安装 [OpenEBS](https://openebs.io/) 来为开发和测试环境配置 [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local) ，这对新用户来说很方便。 对于此多节点安装示例，我们将使用默认存储类（本地卷）。 对于生产环境，请使用 NFS / Ceph / GlusterFS / CSI 或其他商业产品作为持久化存储解决方案，您需要在 `sample-config.yaml` 的 `addons` 中指定它们，详见 [持久化存储配置](../storage-configuration)。

{{</ notice >}}

- 您可以指定要安装的 KubeSphere 版本 (例如 `--with-kubesphere v3.0.0`)。

```bash
./kk create config --with-kubesphere [version]
```

### 2. 编辑配置文件

如果不指定名称，将创建默认配置文件 **config-sample.yaml** 。 以下是具有一个主节点的多节点集群的配置文件示例。

```yaml
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
  roleGroups:
    etcd:
    - master
    master:
    - master
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: "6443"
```

#### 主机 (hosts)

- 在 `hosts` 下列出您的所有主机，并如上所述填写详细信息。 在默认情况下，SSH 将使用 22 端口进行连接。 如需使用其他端口，您可以在IP地址后面添加制定的端口号。 例如：

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
```

- 对于 root 用户：

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
```

- 使用 SSH 密钥进行无密码登录：

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
```

#### 规则组 (roleGroups)

- `etcd`: etcd 节点名
- `master`: 主节点名
- `worker`: 工作节点名

#### ControlPlaneEndpoint （仅适用于HA安装）

`controlPlaneEndpoint` 允许您为HA集群定义外部负载均衡器。 当且仅当需要安装3个以上主节点时才需要准备和配置外部负载均衡器。 请注意，在 `config-sample.yaml` 中`address` 和 `port` 应该向后缩进两个空格，`address` 应为虚拟 IP。有关详细信息，请参见 HA 配置。

{{< notice tip >}}

- 您可以通过编辑配置文件来启用多集群功能。 有关更多信息，请参阅多集群管理。
- 您也可以选择要安装的组件。 想要查询更多的信息,详见 [安装可插拔的功能组件](../../../pluggable-components/)。 有关完整的 `config-sample.yaml` 文件的示例,详见 [这里](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)。

{{</ notice >}}

完成编辑后，保存文件。

### 3. 使用配置文件创建集群

```bash
./kk create cluster -f config-sample.yaml
```

{{< notice note >}}

如果您使用其他名称，则需要将上面的 `config-sample.yaml` 更改为您自己的文件。

{{</ notice >}}

根据您的机器和网络，整个安装过程可能需要10-20分钟。

### 4. 验证安装

安装完成后，您可以看到如下内容：

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.2:30880
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
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

现在，您可以使用帐户和密码 `admin/P@88w0rd` 访问位于 `http://{IP}:30880` 的 KubeSphere Web 控制台（举例：你可以使用弹性 IP(EIP) 进行连接）。

{{< notice note >}}

要访问控制台，您可能需要将源端口转发到互联网 IP 的端口，具体取决于您的云提供商的平台。 另请确保在安全策略中打开了端口30880。

{{</ notice >}}

![kubesphere-login](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## 启用 kubectl 自动补全

KubeKey 不会默认启用 kubectl 自动补全功能。 请参阅下面的指南并将其打开：

**先决条件**： 确保已安装 `bash-autocompletion` 并可以正常工作。

```bash
# 安装 bash-completion
apt-get install bash-completion

# 将 completion 脚本添加到你的 ~/.bashrc 文件
echo 'source <(kubectl completion bash)' >>~/.bashrc

# 将 completion 脚本添加到 /etc/bash_completion.d 目录
kubectl completion bash >/etc/bash_completion.d/kubectl
```

更详细的参考可以在[这里](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion)找到。

