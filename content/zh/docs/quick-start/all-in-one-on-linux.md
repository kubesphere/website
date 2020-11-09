---
title: "Linux 上的 All-in-one 安装"
keywords: 'KubeSphere, Kubernetes, All-in-one, Installation'
description: 'All-in-one Installation on Linux'

linkTitle: "kubeSphere 在 Linux 上的 All-in-one 安装"
weight: 3010
---

对于那些刚接触 kubeSphere 的并且想快速上手的用户, all-in-one 安装模式是最佳的选择。这种模式的特点就是能够快速部署且提供 kubeSphere 和 kubernetes 安装时的简便配置。

## 安装的前提条件

如果你的机器开启了防火墙，则需要按照文档打开[需要开放的端口](../../installing-on-linux/introduction/port-firewall/).

## Step 1: 准备 Linux 机器

请参考下面的对机器硬件和操作系统的要求。 要开始 all-in-one 安装，你需要根据以下要求准备一台主机。
### 建议的机器硬件配置

|  操作系统                                                |  最低要求                        |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

上面的系统要求和下面的说明适用于没有启用任何可选组件的默认最小安装。 如果你的计算机是 8C16G 及以上，则建议启用所有组件. 更多信息可以参考 [开启插件](../../pluggable-components/)。

{{</ notice >}}

### 节点的要求

- 节点必须能够通过 `SSH` 连接。
- 节点上可以使用 `sudo`/`curl`/`openssl` 命令。
- `docker` 已经通过 KubeKey 安装。

{{< notice note >}}

如果你想离线安装 kubeShpere，那么必须安装好 `docker`。

{{</ notice >}}

### 需要安装的依赖项

KubeKey 可以将 Kubernetes 和 KubeSphere 一起安装. 针对不同的 Kubernetes 版本，需要安装的依赖项可能有所不同。你 可以参考下面的列表，查看是否需要提前在节点上安装相关的依赖项。

|  依赖项 | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

{{< notice info >}}

KubeKey 是用 Go 语言开发的，是一种全新的安装工具，可以代替以前使用的基于ansible 的安装程序。 KubeKey 为用户提供了灵活的安装选择，因为他可以分别安装KubeSphere 和 Kubernetes 或二者同时安装，既方便又高效。

{{</ notice >}}

### 网络和 DNS 配置

- 必须确保 `/etc/resolv.conf` 中的 DNS 配置是可用的，不然集群中的 DNS 可能会有问题。
- 如果你的网络配置使用了防火墙或安全组，则必须确保基础组件可以通过特定端口相互通信。建议根据下面的指导将防火墙关闭[需要开发的端口](../../installing-on-linux/introduction/port-firewall/)。

{{< notice tip >}}

- 建议操作系统处于干净的状态（不安装任何其他软件），否则可能会发生冲突。
- 如果你无法从 dockerhub.io 下载容器镜像，建议提前准备好容器镜像或者配置镜像加速器。 参考 [加速安装的配置](../../installing-on-linux/faq/configure-booster/)。

{{</ notice >}}

## Step 2: 下载 KubeKey

请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "对于访问 GitHub 较快的用户" >}}

 从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases/tag/v1.0.0) 下载 kubekey 或者直接使用下面的命令。
```bash
wget https://github.com/kubesphere/kubekey/releases/download/v1.0.0/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

{{</ tab >}}

{{< tab "对于访问 GitHub 速度比较慢的用户" >}}

使用下面的命令下载 KubeKey:

```bash
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

{{</ tab >}}

{{</ tabs >}}

为 `kk` 命令添加可执行权限:

```bash
chmod +x kk
```

## Step 3: 开始安装

在本快速入门教程中，你只需执行一个命令即可进行安装，其模板如下所示:

```bash
./kk create cluster [--with-kubernetes version] [--with-kubesphere version]
```

创建安装了 KubeSphere 的 Kubernetes 集群。这是一个示例供你参考：

```bash
./kk create cluster --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

{{< notice note >}}

- 支持的 Kubernetes 版本: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.
- 一般来说，对于 all-in-one 安装，你无需更改任何配置。
- KubeKey 会默认安装 [OpenEBS](https://openebs.io/) 为开发和测试环境提供LocalPV， 这对用户来说是非常方便的. 对于其它的 storage classes, 参考 [持久化存储配置](../../installing-on-linux/introduction/storage-configuration/).

{{</ notice >}}

执行该命令后，将看到下面的表格，用于环境检查。

![environment-check](https://ap3.qingstor.com/kubesphere-website/docs/environment-check.png)

确保安装了上面标有 `y` 的组件，并输入 `yes` 继续。更多细节可以参考上面的[节点的要求](#节点的要求)和[需要安装的依赖项](#需要安装的依赖项)。

## Step 4: 验证安装结果

当你看到以下输出时，表明安装已经完成。

![installation-complete](https://ap3.qingstor.com/kubesphere-website/docs/Installation-complete.png)

输入以下命令以检查安装结果。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

输出会显示 Web 控制台的 IP 地址和端口号，默认的 NodePort 是 `30880`。 现在，你可以使用默认的帐户和密码（`admin /P@88w0rd`）通过 `EIP：30880` 访问控制台。

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

{{< notice note >}}

你可能需要在环境中绑定 `EIP` 并配置端口转发，以供外部用户访问控制台。此外，确保在安全组中打开了 `30880` 端口。

{{</ notice >}}

检查完上面的安装日志后，可以到 **Components** 中确认各个组件的安装状态。 如果要使用相关服务，可能需要等待某些组件启动并运行。 你也可以使用 `kubectl get pod --all-namespaces` 来检查 KubeSphere 相关组件的运行状况。

![components](/images/docs/quickstart/kubesphere-components.png)

## 开启插件 (可选)

上面的指南默认情况下仅用于最简单的安装。 需要在 KubeSphere 中开启插件， 可参考 [开启插件](../../pluggable-components/)。

## Demo

<script src="https://asciinema.org/a/362292.js" id="asciicast-362292" async></script>
