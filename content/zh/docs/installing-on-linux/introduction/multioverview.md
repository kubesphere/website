---
title: "多节点安装"
keywords: 'Multi-node, Installation, KubeSphere'
description: 'Multi-node Installation Overview'

linkTitle: "多节点安装"
weight: 2112
---

在生产环境中，单节点群集无法满足大多数需求，因为该群集的资源有限且计算能力不足。 因此，不建议将单节点群集用于大规模数据处理。 此外，此类群集只有一个节点，因此不具有高可用性。 另一方面，就应用程序部署和分发而言，多节点体系结构是最常见和首选的选择。

本节概述了多节点安装，包括概念，KubeKey 和步骤。 有关 HA 安装的信息，请参阅在公有云上安装和在本地环境中安装。

## 概念

多节点群集由至少一个主节点和一个工作节点组成。 您可以使用任何节点作为“任务箱”来执行安装任务。 您可以在安装之前和之后根据需要添加其他节点（例如，为了实现高可用性）。

- **Master**. 主节点通常托管控制面，控制和管理整个系统。
- **Worker**. 工作节点运行在其上部署的实际应用程序。

## 为什么选择 KubeKey

如果您不熟悉Kubernetes组件，则可能会发现很难建立功能强大的多节点 Kubernetes 集群。 从版本3.0.0开始， KubeSphere 使用一个名为 KubeKey 的全新安装程序来替换旧的基于 ansible 的安装程序。 用 Go 语言开发的 KubeKey 允许用户快速部署多节点体系结构。

对于不具有现有 Kubernetes 集群的用户，下载 KubeKey 之后，他们只需创建带有很少命令的配置文件并在其中添加节点信息（例如IP地址和节点角色）即可。 使用一个命令，即可安装，并且不需要其他操作。

### 优势

- 
  之前基于 ansible 的安装程序具有许多软件依赖性，例如 Python。 KubeKey 是使用 Go 语言开发的，可以消除各种环境中的问题，并确保安装成功。
- KubeKey 使用 Kubeadm 在节点上尽可能多地并行安装 Kubernetes 集群，以降低安装复杂性并提高效率。 与较早的安装程序相比，它将大大节省安装时间。
- 借助 KubeKey，用户可以将群集从多合一群集扩展到多节点群集，甚至是HA群集。
- KubeKey 旨在将群集安装为对象，即 CaaO。

## 步骤1：准备 Linux 主机

请参阅下面显示的对硬件和操作系统的要求。 要开始进行多节点安装，您需要根据以下要求准备至少三台主机。

### 系统要求

| 系统                                                   | 最低要求（每个节点）                        |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

`/var/lib/docker`路径主要用于存储容器数据，并且在使用和操作过程中会逐渐增加大小。 在生产环境中，建议`/var/lib/docker`应该分开安装驱动器。

{{</ notice >}}

### 节点要求

- 所有节点必须可以通过SSH访问。
- 所有节点配置时钟同步。
- 所有节点必须可以使用`sudo`/`curl`/`openssl` 。
- 所有节点必须安装`ebtables`/`socat`/`ipset`/`conntrack` 。
- Docker 可以自己安装或由`KubeKey`安装

### 网络和 DNS 要求

- 确保`/etc/resolv.conf`中的 DNS 地址可用。 否则，可能会导致群集中出现某些DNS问题。
- 如果您的网络配置使用防火墙或安全组，则必须确保基础结构组件可以通过特定端口相互通信。 建议您关闭防火墙或遵循指南[网络访问](https://github.com/kubesphere/kubekey/blob/master/docs/network-access.md)。

{{< notice tip >}}

- 建议您的操作系统是干净的（不安装任何其他软件）。 否则可能会发生冲突。
- 如果您在从 dockerhub.io 下载镜像时遇到问题，建议准备一个容器镜像（加速器）。 请参阅[Configure registry mirrors for the Docker daemon](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)。

{{</ notice >}}

本示例包括以下三个主机，其中主节点用作“任务箱”。

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## 步骤2：下载 KubeKey

请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "访问 Github 困难" >}}

使用以下命令下载 KubeKey:

```bash
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```
{{</ tab >}}

{{< tab "访问 Github 很轻松" >}}

从[GitHub Release Page](https://github.com/kubesphere/kubekey/releases/tag/v1.0.0)下载 KubeKey 或直接使用以下命令。

```bash
wget https://github.com/kubesphere/kubekey/releases/download/v1.0.0/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```
{{</ tab >}}

{{</ tabs >}}

将执行权授予`kk`:

```bash
chmod +x kk
```

## 步骤3：创建一个集群

对于多节点安装，您需要通过指定配置文件来创建集群。

### 1. 创建一个示例配置文件

命令:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

{{< notice info >}}

支持的 Kubernetes 版本: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.

{{</ notice >}}

以下是一些示例供您参考：

- 您可以使用默认配置创建示例配置文件。 您还可以使用其他文件名或其他文件夹指定文件。

```bash
./kk create config [-f ~/myfolder/abc.yaml]
```

- 您可以在`config-sample.yaml`中自定义持久性存储插件（例如NFS Client，Ceph RBD和GlusterFS）。

```bash
./kk create config --with-storage localVolume
```

{{< notice note >}}

默认情况下，KubeKey将安装 [OpenEBS](https://openebs.io/) 来为开发和测试环境配置 [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local)， 对新用户来说很方便。 在此多节点安装示例中，使用默认存储类（本地卷）。 对于生产，请使用NFS/Ceph/GlusterFS/CSI或商业产品作为持久性存储解决方案。 您需要在`config-sample.yaml`的`addons`下指定它们。 有关更多详细信息，请参见 [Persistent Storage Configuration](../storage-configuration)。

{{</ notice >}}

- 您可以指定要安装的 KubeSphere 版本（例如`--with-kubesphere v3.0.0`）。

```bash
./kk create config --with-kubesphere [version]
```

### 2. 编辑配置文件

如果不更改名称，将创建默认文件 **config-sample.yaml**。 编辑文件，这是具有一个主节点的多节点群集的配置文件示例。

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

#### Hosts

- 在`hosts`下列出您的所有计算机，并如上所述添加其详细信息。 在这种情况下，端口22是SSH的默认端口。 否则，您需要在IP地址后面添加端口号。 例如：

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
```

- 默认是root用户:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
```

- 使用SSH密钥的无密码登录：

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
```

#### roleGroups

- `etcd`: etcd节点名称
- `master`: Master节点名称
- `worker`: Worker节点名称

#### controlPlaneEndpoint (仅用于 HA 安装)

`controlPlaneEndpoint` 允许您为HA集群定义外部负载均衡器。 当且仅当您需要安装3个以上的主节点时，才需要准备和配置外部负载均衡器。 请注意，地址和端口应在 `config-sample.yaml`中以两个空格缩进，`address`应为VIP。 有关详细信息，请参见HA配置。

{{< notice tip >}}

- 您可以通过编辑配置文件来启用多集群功能。 有关更多信息，请参阅多集群管理。
- 您也可以选择要安装的组件。 有关更多信息，请参见[启用可插拔组件](../../../pluggable-components/)。 有关完整的config-sample.yaml文件的示例，请参见[此文件](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)。

{{</ notice >}}

完成编辑后，保存文件。

### 3. 使用配置文件创建集群

```bash
./kk create cluster -f config-sample.yaml
```

{{< notice note >}}

如果使用其他名称，则需要将上面的`config-sample.yaml`更改为您自己的文件。

{{</ notice >}}

整个安装过程可能需要10到20分钟，具体取决于您的计算机和网络。

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

现在，您可以使用帐户和密码`admin/P@88w0rd`访问位于`http://{IP}:30880`的KubeSphere Web控制台（例如，您可以使用EIP）。

{{< notice note >}}

要访问控制台，您可能需要将源端口转发到 Intranet IP 和端口，具体取决于您的云提供商的平台。 还请确保在安全组中打开了端口30880。

{{</ notice >}}

![kubesphere-login](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## 启用 kubectl 自动补全

KubeKey 不会启用 kubectl 自动补全功能。 请参阅下面的内容并将其打开：

**先决条件**：确保已安装 bash-autocompletion 并可以正常工作。

```bash
# Install bash-completion
apt-get install bash-completion

# Source the completion script in your ~/.bashrc file
echo 'source <(kubectl completion bash)' >>~/.bashrc

# Add the completion script to the /etc/bash_completion.d directory
kubectl completion bash >/etc/bash_completion.d/kubectl
```

详细信息[见此](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion)。