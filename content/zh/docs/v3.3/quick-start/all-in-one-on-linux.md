---
title: "在 Linux 上以 All-in-One 模式安装 KubeSphere"
keywords: 'KubeSphere, Kubernetes, All-in-One, 安装'
description: '了解在 Linux 上如何使用最小安装包安装 KubeSphere。本教程为您理解容器平台提供了基础入门知识，为学习以下指南奠定基础。'
linkTitle: "在 Linux 上以 All-in-One 模式安装 KubeSphere"
weight: 2100
---

对于刚接触 KubeSphere 并想快速上手该[容器平台](https://kubesphere.io/)的用户，All-in-One 安装模式是最佳的选择，它能够帮助您零配置快速部署 KubeSphere 和 Kubernetes。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/docs-v3.0/KS3.0%E5%AE%89%E8%A3%85%E4%B8%8E%E9%83%A8%E7%BD%B2_1_All-in-one%20Installation%20on%20Linux.mp4">
</video>

## 步骤 1：准备 Linux 机器

若要以 All-in-One 模式进行安装，您仅需参考以下对机器硬件和操作系统的要求准备一台主机。

### 硬件推荐配置

<table>
  <tbody>
    <tr>
    <th width='320'>操作系统</th>
    <th>最低配置</th>
    </tr>
    <tr>
      <td><b>Ubuntu</b> <i>16.04</i>, <i>18.04</i></td>
      <td>2 核 CPU，4 GB 内存，40 GB 磁盘空间</td>
    </tr>
    <tr>
      <td><b>Debian</b> <i>Buster</i>, <i>Stretch</i></td>
      <td>2 核 CPU，4 GB 内存，40 GB 磁盘空间</td>
    </tr><tr>
    <td><b>CentOS</b> <i>7.x</i></td>
      <td>2 核 CPU，4 GB 内存，40 GB 磁盘空间</td>
    </tr><tr>
    <td><b>Red Hat Enterprise Linux 7</b></td>
      <td>2 核 CPU，4 GB 内存，40 GB 磁盘空间</td>
    </tr><tr>
    <td><b>SUSE Linux Enterprise Server 15/openSUSE Leap 15.2</b></td>
      <td>2 核 CPU，4 GB 内存，40 GB 磁盘空间</td>
    </tr>
  </tbody>
</table>

{{< notice note >}}

以上的系统要求和以下的教程适用于没有启用任何可选组件的默认最小化安装。如果您的机器至少有 8 核 CPU 和 16 GB 内存，则建议启用所有组件。有关更多信息，请参见[启用可插拔组件](../../pluggable-components/)。

{{</ notice >}}

### 节点要求

- 节点必须能够通过 `SSH` 连接。
- 节点上可以使用 `sudo`/`curl`/`openssl`/`tar` 命令。

### 容器运行时

您的集群必须有一个可用的容器运行时。如果您使用 KubeKey 搭建集群，KubeKey 会默认安装最新版本的 Docker。或者，您也可以在创建集群前手动安装 Docker 或其他容器运行时。

<table>
  <tbody>
    <tr>
      <th width='500'>支持的容器运行时</th>
      <th>版本</th>
    </tr>
    <tr>
      <td>Docker</td>
      <td>19.3.8 +</td>
    </tr>
    <tr>
      <td>containerd</td>
      <td>最新版</td>
    </tr><tr>
      <td>CRI-O（试验版，未经充分测试）</td>
      <td>最新版</td>
    </tr><tr>
      <td>iSula（试验版，未经充分测试）</td>
      <td>最新版</td>
    </tr>
  </tbody>
</table>


### 依赖项要求

KubeKey 可以将 Kubernetes 和 KubeSphere 一同安装。针对不同的 Kubernetes 版本，需要安装的依赖项可能有所不同。您可以参考以下列表，查看是否需要提前在节点上安装相关的依赖项。

<table>
  <tbody>
    <tr>
      <th>依赖项</th>
     <th>Kubernetes 版本 ≥ 1.18</th>
      <th>Kubernetes 版本 < 1.18</th>
    </tr>
    <tr>
      <td><code>socat</code></td>
     <td>必须</td> 
      <td>可选但建议</td> 
     </tr>
    <tr>
      <td><code>conntrack</code></td>
     <td>必须</td> 
      <td>可选但建议</td> 
    </tr><tr>
    <td><code>ebtables</code></td>
     <td>可选但建议</td> 
    <td>可选但建议</td> 
    </tr><tr>
    <td><code>ipset</code></td>
    <td>可选但建议</td> 
     <td>可选但建议</td> 
    </tr>
  </tbody>
</table>

{{< notice info >}}

KubeKey 是用 Go 语言开发的一款全新的安装工具，代替了以前基于 ansible 的安装程序。KubeKey 为用户提供了灵活的安装选择，可以分别安装 KubeSphere 和 Kubernetes 或二者同时安装，既方便又高效。

{{</ notice >}}

### 网络和 DNS 要求

{{< content "common/network-requirements.md" >}}

{{< notice tip >}}

- 建议您的操作系统处于干净状态（不安装任何其他软件），否则可能会发生冲突。
- 如果您无法从 `dockerhub.io` 下载容器镜像，建议提前准备仓库的镜像地址（即加速器）。有关更多信息，请参见[为安装配置加速器](../../faq/installation/configure-booster/)。

{{</ notice >}}

## 步骤 2：下载 KubeKey

请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

在您下载 KubeKey 后，如果您将其传至新的机器，且访问 Googleapis 同样受限，在您执行以下步骤之前请务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v2.3.0)，您可以修改命令中的版本号下载指定版本。

{{</ notice >}} 

为 `kk` 添加可执行权限：

```bash
chmod +x kk
```

## 步骤 3：开始安装

在本快速入门教程中，您只需执行一个命令即可进行安装，其模板如下所示：

```bash
./kk create cluster [--with-kubernetes version] [--with-kubesphere version]
```

若要同时安装 Kubernetes 和 KubeSphere，可参考以下示例命令：

```bash
./kk create cluster --with-kubernetes v1.22.10 --with-kubesphere v3.3.1
```

{{< notice note >}}

- 安装 KubeSphere 3.3 的建议 Kubernetes 版本：1.19.x、1.20.x、1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../installing-on-linux/introduction/kubekey/#支持矩阵)。

- 一般来说，对于 All-in-One 安装，您无需更改任何配置。
- 如果您在这一步的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，KubeKey 将只安装 Kubernetes。如果您添加标志 `--with-kubesphere` 时不指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。
- KubeKey 会默认安装 [OpenEBS](https://openebs.io/) 为开发和测试环境提供 LocalPV 以方便新用户。对于其他存储类型，请参见[持久化存储配置](../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)。

{{</ notice >}}

执行该命令后，KubeKey 将检查您的安装环境，结果显示在一张表格中。有关详细信息，请参见[节点要求](#节点要求)和[依赖项要求](#依赖项要求)。输入 `yes` 继续安装流程。

## 步骤 4：验证安装结果

输入以下命令以检查安装结果。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

输出信息会显示 Web 控制台的 IP 地址和端口号，默认的 NodePort 是 `30880`。现在，您可以使用默认的帐户和密码 (`admin/P@88w0rd`) 通过 `<NodeIP>:30880` 访问控制台。

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
     "Cluster Management". If any service is not
     ready, please wait patiently until all components 
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

{{< notice note >}}

您可能需要配置端口转发规则并在安全组中开放端口，以便外部用户访问控制台。

{{</ notice >}}

登录至控制台后，您可以在**系统组件**中查看各个组件的状态。如果要使用相关服务，您可能需要等待部分组件启动并运行。您也可以使用 `kubectl get pod --all-namespaces` 来检查 KubeSphere 相关组件的运行状况。

## 启用可插拔组件（可选）

本指南仅适用于默认的最小化安装。若要在 KubeSphere 中启用其他组件，请参见[启用可插拔组件](../../pluggable-components/)。

## 代码演示

<script src="https://asciinema.org/a/362292.js" id="asciicast-362292" async></script>
