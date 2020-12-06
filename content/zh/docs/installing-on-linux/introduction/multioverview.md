---
title: "多节点安装"
keywords: 'Multi-node, Installation, KubeSphere'
description: 'Multi-node Installation Overview'

linkTitle: "多节点安装"
weight: 4120
---

[All-in-one](../../../quick-start/all-in-one-on-linux/) 是为新用户体验 KubeSphere 而提供的快速且简单的安装方式，在正式环境中，单节点集群因受限于资源和计算能力的不足而无法满足大多数需求，因此不建议将单节点集群用于大规模数据处理。多节点安装环境通常包括至少一个主节点和多个工作节点，如果是生产环境则需要安装主节点高可用的方式。

本节概述了多节点安装，包括概念，[KubeKey](https://github.com/kubesphere/kubekey/) 及安装步骤。有关主节点高可用安装的信息，请参阅[高可用安装配置](../ha-configuration/)或参阅在公有云上安装或在本地环境中安装，如[在阿里云 ECS 安装高可用 KubeSphere](../../public-cloud/install-kubesphere-on-ali-ecs/) 或 [在 VMware vSphere 部署高可用 KubeSphere](../../on-premises/install-kubesphere-on-vmware-vsphere/)。

## 概念

多节点集群由至少一个主节点和一个工作节点组成，可以使用任何节点作为**任务箱**来执行安装任务。您可以在安装之前或之后根据需要添加其他节点（例如，为了实现高可用性）。

- **Master**：主节点，通常托管控制面，控制和管理整个系统。
- **Worker**：工作节点，运行在其上部署实际应用程序。

## 为什么选择 KubeKey

如果您不熟悉 Kubernetes 组件，可能会发现部署多节点 Kubernetes 集群并不容易。从版本 3.0.0 开始，KubeSphere 使用了一个全新的安装工具 KubeKey，替换以前基于 ansible 的安装程序，更加方便用户快速部署多节点集群。具体来说，下载 KubeKey 之后，用户只需配置很少的信息如节点信息（IP 地址和节点角色），然后一条命令即可安装。

### 优势

- 之前基于 ansible 的安装程序具有许多软件依赖性，例如 Python。KubeKey 是使用 Go 语言开发的，可以消除各种环境中的问题，并确保安装成功。
- KubeKey 使用 Kubeadm 在节点上尽可能多地并行安装 Kubernetes 集群，以降低安装复杂性并提高效率。与较早的安装程序相比，它将大大节省安装时间。
- 借助 KubeKey 用户可以自由伸缩集群，包括将集群从单节点集群扩展到多节点集群，甚至是主节点高可用集群。
- KubeKey 未来计划将集群管理封装成一个对象，即 Cluster as an Object (CaaO)。

## 步骤1：准备 Linux 主机

安装之前请参阅下面对硬件和操作系统的要求准备至少三台主机，如果您只有两台主机的话请保证机器配置足够安装。

### 系统要求

| 系统                                                             | 最低要求（每个节点）                           |
| --------------------------------------------------------------- | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                                       | CPU：2 核，内存：4 G，硬盘：40 G |
| **Debian** *Buster, Stretch*                                    | CPU：2 核，内存：4 G，硬盘：40 G |
| **CentOS** *7.x*                                                | CPU：2 核，内存：4 G，硬盘：40 G |
| **Red Hat Enterprise Linux** *7*                                | CPU：2 核，内存：4 G，硬盘：40 G |
| **SUSE Linux Enterprise Server** *15* **/openSUSE Leap** *15.2* | CPU：2 核，内存：4 G，硬盘：40 G |

{{< notice note >}}

`/var/lib/docker`路径主要用于存储容器数据，通常在使用过程中数据量会逐渐增加，因此在生产环境中，建议将`/var/lib/docker`挂载在单独的数据盘上。

{{</ notice >}}

### 节点要求

- 所有节点必须可以通过 SSH 访问。
- 所有节点配置时钟同步。
- 所有节点必须可以使用`sudo`/`curl`/`openssl`。
- Docker 可以自己预先安装或由 `KubeKey` 统一安装。

{{< notice note >}}

如果您的环境不能访问外网，则必须预先安装`docker`，然后用离线方式安装。

{{</ notice >}}

### 软件依赖要求

不同版本的 Kubernetes 对系统软件要求有所不同，您需要根据自己的环境按照下面的要求预先安装依赖软件。

| 依赖         | Kubernetes 版本 ≥ 1.18 | Kubernetes 版本 < 1.18 |
| ----------- | ---------------------- | --------------------- |
| `socat`     | 必须                    | 可选但建议             |
| `conntrack` | 必须                    | 可选但建议             |
| `ebtables`  | 可选但建议               | 可选但建议             |
| `ipset`     | 可选但建议               | 可选但建议             |

### 网络和 DNS 要求

- 确保`/etc/resolv.conf`中的 DNS 地址可用，否则，可能会导致集群中出现某些 DNS 问题。
- 如果您的网络配置使用防火墙或安全组，则必须确保基础结构组件可以通过特定端口相互通信。建议您关闭防火墙或遵循指南[端口要求](../port-firewall/)。

{{< notice tip >}}

- 建议您的操作系统是干净的（不安装任何其他软件），否则可能会发生冲突。
- 如果您在从 dockerhub.io 下载镜像时遇到问题，建议准备一个容器镜像（加速器）。请参阅[配置镜像 mirror 加速安装](../../faq/configure-booster/) 或 [Configure registry mirrors for the Docker daemon](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)。

{{</ notice >}}

本示例包括以下三个主机，其中主节点用作**任务箱**。

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## 步骤2：下载 KubeKey

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

在您下载 KubeKey 后，如果您将其传至新的机器，且访问 GitHub 同样受限，在您执行以下步骤之前请务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v1.0.1)，您可以修改命令中的版本号下载指定版本。

{{</ notice >}} 

为 `kk` 添加可执行权限：

```bash
chmod +x kk
```

## 步骤3：创建一个集群

对于多节点安装，需要通过指定配置文件来创建集群。

### 1. 创建一个示例配置文件

命令:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

{{< notice info >}}

支持的 Kubernetes 版本：*v1.15.12*, *v1.16.13*, *v1.17.9* (默认), *v1.18.6*.

{{</ notice >}}

以下是一些示例供您参考：

- 可以使用默认配置创建示例配置文件，还可以使用其他文件名或其他文件夹指定待创建文件。

  ```bash
  ./kk create config [-f ~/myfolder/abc.yaml]
  ```

- 可以在`config-sample.yaml`中自定义持久性存储插件（例如 NFS Client，Ceph RBD 和 GlusterFS）。

  ```bash
  ./kk create config --with-storage localVolume
  ```

  {{< notice note >}}

默认情况下，KubeKey 将安装 [OpenEBS](https://openebs.io/) 并配置 [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local) 为默认存储类，方便用户部署开发或测试环境。本示例也采取这种默认安装方式。对于生产环境，请使用 NFS/Ceph/GlusterFS/CSI 或商业产品作为持久性存储解决方案，则需要在 `config-sample.yaml` 的 `addons` 下配置存储信息。有关更多详细信息，请参见 [持久化存储配置](../storage-configuration/)。

  {{</ notice >}}

- 可以指定要安装的 KubeSphere 版本（例如`--with-kubesphere v3.0.0`）。

  ```bash
  ./kk create config --with-kubesphere [version]
  ```

### 2. 编辑配置文件

如果不更改名称，将创建默认文件 **config-sample.yaml**。编辑文件，这是具有一个主节点的多节点集群的配置文件示例。

{{< notice note >}}

Kubernetes 相关的参数配置参见 [Kubernetes 集群配置](../vars/)。

{{</ notice >}}

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

#### hosts

- 在`hosts`下列出所有计算机，并如上所述添加其详细信息。在这种情况下，端口 22 是 SSH 的默认端口。否则，您需要在 IP 地址后面添加端口号，例如：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```

- 默认是 root 用户示例:

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
  ```

- 使用 SSH 密钥的无密码登录示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
  ```

#### roleGroups

- `etcd`：etcd 节点名称
- `master`：Master 节点名称
- `worker`：Worker 节点名称

#### controlPlaneEndpoint (仅用于 HA 安装)

`controlPlaneEndpoint`允许您为 HA 集群定义外部负载均衡器。当且仅当安装多个主节点时，才需要配置外部负载均衡器。请注意，地址和端口应在`config-sample.yaml`中以两个空格缩进，`address`应为 VIP。有关详细信息，请参见 [HA 配置](../ha-configuration/)。

#### addons

您可以在此配置文件`config-sample.yaml`里设置持久化存储，比如 NFS 客户端、Ceph RBD、GlusterFS 等，信息添加在`addons`下，详细说明请参阅[持久化存储配置](../storage-configuration)。

{{< notice note >}}

KubeSphere 默认情况下安装 [openEBS](https://openebs.io/) 的[本地卷](https://kubernetes.io/docs/concepts/storage/volumes/#local)作为存储类型，方便在开发或测试环境下快速安装。如果需要在生产环境安装，请使用 NFS/Ceph/GlusterFS/CSI 或者商业化存储。

{{</ notice >}}

{{< notice tip >}}

- 可以通过编辑配置文件的方式启用多集群功能。有关更多信息，请参阅[多集群管理](../../../multicluster-management/)。
- 也可以选择要安装的组件。有关更多信息，请参见[启用可插拔组件](../../../pluggable-components/)。有关完整的 config-sample.yaml 文件的示例，请参见[此文件](https://github.com/kubesphere/kubekey/blob/release-1.0/docs/config-example.md)。

{{</ notice >}}

完成编辑后，保存文件。

### 3. 使用配置文件创建集群

```bash
./kk create cluster -f config-sample.yaml
```

{{< notice note >}}

如果使用其他名称，则需要将上面的`config-sample.yaml`更改为您自己的文件。

{{</ notice >}}

整个安装过程可能需要 10 到 20 分钟，具体取决于您的计算机和网络环境。

### 4. 验证安装

安装完成后，可以看到类似于如下内容：

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

现在可以使用帐户和密码`admin/P@88w0rd`访问`http://{IP}:30880`KubeSphere Web 控制台。

{{< notice note >}}

如果公网要访问控制台，您可能需要将源端口转发到 Intranet IP 和端口，具体取决于您的云提供商的平台，还请确保在安全组中打开了端口 30880。

{{</ notice >}}

![kubesphere-login](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## 启用 kubectl 自动补全

KubeKey 不会启用 kubectl 自动补全功能，请参阅下面的内容并将其打开：

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

## 示例

<script src="https://asciinema.org/a/364501.js" id="asciicast-364501" async></script>
