---
title: "多节点安装"
keywords: '多节点, 安装, KubeSphere'
description: '了解在多节点集群上安装 KubeSphere 和 Kubernetes 的一般步骤。'
linkTitle: "多节点安装"
weight: 3120
---

在生产环境中，由于单节点集群资源有限、计算能力不足，无法满足大部分需求，因此不建议在处理大规模数据时使用单节点集群。此外，单节点集群只有一个节点，因此也不具有高可用性。相比之下，在应用程序部署和分发方面，多节点架构是最常见的首选架构。

本节概述了多节点安装，包括概念、[KubeKey](https://github.com/kubesphere/kubekey/) 和操作步骤。有关高可用安装的信息，请参考[高可用配置](../../../installing-on-linux/high-availability-configurations/ha-configuration/)、[在公有云上安装](../../../installing-on-linux/public-cloud/install-kubesphere-on-azure-vms/)和[在本地环境中安装](../../../installing-on-linux/on-premises/install-kubesphere-on-bare-metal/)。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/docs-v3.0/KS3.0%E5%AE%89%E8%A3%85%E4%B8%8E%E9%83%A8%E7%BD%B2_2_Multi-Node%20Deployment%20on%20Linux.mp4">
</video>

## 概念

多节点集群由至少一个主节点和一个工作节点组成。您可以使用任何节点作为**任务机**来执行安装任务，也可以在安装之前或之后根据需要新增节点（例如，为了实现高可用性）。

- **Control plane node**：主节点，通常托管控制平面，控制和管理整个系统。

- **Worker node**：工作节点，运行部署在工作节点上的实际应用程序。

## 步骤 1：准备 Linux 主机

请参见下表列出的硬件和操作系统要求。在本教程所演示多节点安装示例中，您需要按照下列要求准备至少三台主机。如果您节点的资源充足，也可以将 [KubeSphere 容器平台](https://kubesphere.com.cn/)安装在两个节点上。

### 系统要求

| 系统                                                         | 最低要求（每个节点）             |
| ------------------------------------------------------------ | -------------------------------- |
| **Ubuntu** *16.04，18.04，20.04， 22.04*                     | CPU：2 核，内存：4 G，硬盘：40 G |
| **Debian** *Buster，Stretch*                                 | CPU：2 核，内存：4 G，硬盘：40 G |
| **CentOS** *7*.x                                             | CPU：2 核，内存：4 G，硬盘：40 G |
| **Red Hat Enterprise Linux** *7*                             | CPU：2 核，内存：4 G，硬盘：40 G |
| **SUSE Linux Enterprise Server** *15* **/openSUSE Leap** *15.2* | CPU：2 核，内存：4 G，硬盘：40 G |

{{< notice note >}}

- `/var/lib/docker` 路径主要用于存储容器数据，在使用和操作过程中数据量会逐渐增加。因此，在生产环境中，建议为 `/var/lib/docker` 单独挂载一个硬盘。


- CPU 必须为 x86_64，暂时不支持 Arm 架构的 CPU。

{{</ notice >}}

### 节点要求

- 所有节点必须都能通过 `SSH` 访问。
- 所有节点时间同步。
- 所有节点都应使用 `sudo`/`curl`/`openssl`/`tar`。

### 容器运行时

您的集群必须有一个可用的容器运行时。如果您使用 KubeKey 搭建集群，KubeKey 会默认安装最新版本的 Docker。或者，您也可以在创建集群前手动安装 Docker 或其他容器运行时。

{{< content "common/container-runtime-requirements.md" >}}


### 依赖项要求

KubeKey 可以一同安装 Kubernetes 和 KubeSphere。根据要安装的 Kubernetes 版本，需要安装的依赖项可能会不同。您可以参考下表，查看是否需要提前在节点上安装相关依赖项。

| 依赖项      | Kubernetes 版本 ≥ 1.18 | Kubernetes 版本 < 1.18 |
| ----------- | ---------------------- | ---------------------- |
| `socat`     | 必须                   | 可选，但建议安装       |
| `conntrack` | 必须                   | 可选，但建议安装       |
| `ebtables`  | 可选，但建议安装       | 可选，但建议安装       |
| `ipset`     | 可选，但建议安装       | 可选，但建议安装       |

### 网络和 DNS 要求

{{< content "common/network-requirements.md" >}}

{{< notice tip >}}

- 建议您使用干净的操作系统（即不安装任何其他软件）。否则，可能会产生冲突。
- 如果您从 `dockerhub.io` 下载镜像时遇到问题，建议提前准备仓库的镜像地址（即加速器）。请参见[为安装配置加速器](../../../faq/installation/configure-booster/)或[为 Docker Daemon 配置仓库镜像](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)。

{{</ notice >}}

本示例包括以下三台主机，其中主节点充当任务机。

| 主机 IP     | 主机名 | 角色         |
| ----------- | ------ | ------------ |
| 192.168.0.2 | control plane | control plane, etcd |
| 192.168.0.3 | node1  | worker       |
| 192.168.0.4 | node2  | worker       |

## 步骤 2：下载 KubeKey

请按照以下步骤下载 [KubeKey](../kubekey)。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub 发布页面](https://github.com/kubesphere/kubekey/releases)下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

下载 KubeKey 后，如果您将其传输至访问 Googleapis 同样受限的新机器，请您在执行以下步骤之前务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v2.2.2)，您可以修改命令中的版本号下载指定版本。

{{</ notice >}}

为 `kk` 添加可执行权限：

```bash
chmod +x kk
```

## 步骤 3：创建集群

对于多节点安装，您需要通过指定配置文件来创建集群。

### 1. 创建示例配置文件

命令如下：

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

{{< notice note >}}

- 安装 KubeSphere 3.3.0 的建议 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../../installing-on-linux/introduction/kubekey/#支持矩阵)。


- 如果您在此步骤的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，只能使用配置文件中的 `addons` 字段安装，或者在您后续使用 `./kk create cluster` 命令时再次添加这个标志。
- 如果您添加标志 `--with-kubesphere` 时不指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。

{{</ notice >}}

以下是一些示例，供您参考：

- 您可以使用默认配置创建示例配置文件，也可以为该文件指定其他文件名或其他文件夹。

  ```bash
  ./kk create config [-f ~/myfolder/abc.yaml]
  ```

- 您可以指定要安装的 KubeSphere 版本（例如 `--with-kubesphere v3.3.0`）。

  ```bash
  ./kk create config --with-kubesphere [version]
  ```

### 2. 编辑配置文件

如果您不更改名称，那么将创建默认文件 `config-sample.yaml`。编辑文件，以下是多节点集群（具有一个主节点）配置文件的示例。

{{< notice note >}}

若要自定义 Kubernetes 相关参数，请参考 [Kubernetes 集群配置](../../../installing-on-linux/introduction/vars/)。

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
    control-plane:
    - master
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
```

#### 主机

请参照上方示例在 `hosts` 下列出您的所有机器并添加详细信息。

`name`：实例的主机名。

`address`：任务机和其他实例通过 SSH 相互连接所使用的 IP 地址。根据您的环境，可以是公有 IP 地址或私有 IP 地址。例如，一些云平台为每个实例提供一个公有 IP 地址，用于通过 SSH 访问。在这种情况下，您可以在该字段填入这个公有 IP 地址。

`internalAddress`：实例的私有 IP 地址。

此外，您必须提供用于连接至每台实例的登录信息，以下示例供您参考：

- 使用密码登录示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```

  {{< notice note >}}

  在本教程中，端口 `22` 是 SSH 的默认端口，因此您无需将它添加至该 YAML 文件中。否则，您需要在 IP 地址后添加对应端口号，如上所示。

  {{</ notice >}} 

- 默认 root 用户示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
  ```

- 使用 SSH 密钥的无密码登录示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
  ```
  
- 在 ARM 设备上安装的示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123, arch: arm64}
  ```

{{< notice tip >}} 

- 在安装 KubeSphere 之前，您可以使用 `hosts` 下提供的信息（例如 IP 地址和密码）通过 SSH 的方式测试任务机和其他实例之间的网络连接。
- 在安装前，请确保端口 `6443` 没有被其他服务占用，否则在安装时会产生冲突（`6443` 为 API 服务器的默认端口）。

{{</ notice >}}

#### roleGroups

- `etcd`：etcd 节点名称
- `control-plane`：主节点名称
- `worker`：工作节点名称

#### controlPlaneEndpoint（仅适用于高可用安装）

您需要在 `controlPlaneEndpoint` 部分为高可用集群提供外部负载均衡器信息。当且仅当您安装多个主节点时，才需要准备和配置外部负载均衡器。请注意，`config-sample.yaml` 中的地址和端口应缩进两个空格，`address` 应为您的负载均衡器地址。有关详细信息，请参见[高可用配置](../../../installing-on-linux/high-availability-configurations/ha-configuration/)。

#### addons

您可以在 `config-sample.yaml` 的 `addons` 字段下指定存储，从而自定义持久化存储插件，例如 NFS 客户端、Ceph RBD、GlusterFS 等。有关更多信息，请参见[持久化存储配置](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)。

KubeSphere 会默认安装 [OpenEBS](https://openebs.io/)，为开发和测试环境配置 [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local)，方便新用户使用。在本多节点安装示例中，使用了默认存储类型（本地存储卷）。对于生产环境，您可以使用 Ceph/GlusterFS/CSI 或者商业存储产品作为持久化存储解决方案。

{{< notice tip >}}

- 您可以编辑配置文件，启用多集群功能。有关更多信息，请参见[多集群管理](../../../multicluster-management/)。
- 您也可以选择要安装的组件。有关更多信息，请参见[启用可插拔组件](../../../pluggable-components/)。有关完整的 `config-sample.yaml` 文件的示例，请参见[此文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)。

{{</ notice >}}

完成编辑后，请保存文件。

### 3. 使用配置文件创建集群

```bash
./kk create cluster -f config-sample.yaml
```

{{< notice note >}}

如果使用其他名称，则需要将上面的 `config-sample.yaml` 更改为您自己的文件。

{{</ notice >}}

整个安装过程可能需要 10 到 20 分钟，具体取决于您的计算机和网络环境。

### 4. 验证安装

安装完成后，您会看到如下内容：

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.2:30880
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
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

现在，您可以通过 `<NodeIP:30880` 使用默认帐户和密码 (`admin/P@88w0rd`) 访问 KubeSphere 的 Web 控制台。

{{< notice note >}}

若要访问控制台，您可能需要根据您的环境配置端口转发规则。还请确保在您的安全组中打开了端口 `30880`。

{{</ notice >}}

## 启用 kubectl 自动补全

KubeKey 不会启用 kubectl 自动补全功能，请参见以下内容并将其打开：

{{< notice note >}}

请确保已安装 bash-autocompletion 并可以正常工作。

{{</ notice >}}

```bash
# Install bash-completion
apt-get install bash-completion

# Source the completion script in your ~/.bashrc file
echo 'source <(kubectl completion bash)' >>~/.bashrc

# Add the completion script to the /etc/bash_completion.d directory
kubectl completion bash >/etc/bash_completion.d/kubectl
```

详细信息[见此](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion)。

## 代码演示
<script src="https://asciinema.org/a/364501.js" id="asciicast-364501" async></script>
