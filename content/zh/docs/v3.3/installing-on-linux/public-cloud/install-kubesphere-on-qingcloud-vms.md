---
title: "在青云QingCloud 主机上部署 KubeSphere"
keywords: "KubeSphere, 安装, HA, 高可用性, LoadBalancer"
description: "了解如何在青云QingCloud 平台上创建高可用 KubeSphere 集群。"
linkTitle: "在青云QingCloud 主机上部署 KubeSphere"
Weight: 3420
---

## 介绍

对于生产环境，需要考虑集群的高可用性。如果关键组件（例如 kube-apiserver、kube-scheduler 和 kube-controller-manager）在相同的主节点上运行，一旦主节点出现故障，Kubernetes 和 KubeSphere 将不可用。因此，您需要为多个主节点配置负载均衡器，以搭建高可用集群。您可以使用任何云负载均衡器或任何硬件负载均衡器（例如 F5）。此外，您也可以使用 Keepalived+[HAproxy](https://www.haproxy.com/) 或 NGINX 搭建高可用集群。

本教程演示如何创建两个[青云QingCloud 负载均衡器](https://docs.qingcloud.com/product/network/loadbalancer)，分别用于内部和外部负载均衡，以及如何使用负载均衡器实现主节点和 etcd 节点的高可用性。

## 准备工作

- 您需要了解如何在多节点集群上安装 KubeSphere（请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/)）。有关安装中用到的配置文件的详细信息，请参见[编辑配置文件](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)。本教程主要介绍如何配置负载均衡器。
- 您需要注册一个[青云QingCloud ](https://console.qingcloud.com/login)帐户才能在青云QingCloud 创建负载均衡器。如在其他云平台上创建负载均衡器，请参考对应云厂商提供的指南。
- 如果搭建生产环境，建议您提前准备持久化存储并创建 StorageClass。如果搭建开发测试环境，您可以直接使用集成的 OpenEBS 配置 LocalPV 存储服务。

## 集群架构

本教程使用六台 **Ubuntu 16.04.6** 机器。您需要创建两个负载均衡器，并在其中的三台机器上部署三个主节点和 etcd 节点。您可以在 KubeKey 创建的 `config-sample.yaml` 文件中配置上述节点（`config-sample.yaml` 为文件的默认名称，可以手动更改）。

![ha-architecture](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/ha-architecture.png)

{{< notice note >}}

根据 Kubernetes 官方文档[高可用拓扑选项](https://kubernetes.io/zh/docs/setup/production-environment/tools/kubeadm/ha-topology/)，Kubernetes 高可用集群有两种拓扑配置形式，即堆叠 etcd 拓扑和外部 etcd 拓扑。在搭建高可用集群前，您需要根据该文档仔细权衡两种拓扑的利弊。本教程采用堆叠 etcd 拓扑搭建高可用集群作为示例。

{{</ notice >}}

## 安装高可用集群

### 步骤 1：创建负载均衡器

本步骤演示如何在青云QingCloud 平台上创建负载均衡器。

#### 创建内部负载均衡器

1. 登录[青云QingCloud 控制台](https://console.qingcloud.com/login)。在左侧导航栏选择**网络与 CDN** 下的**负载均衡器**，然后点击**创建**。

   ![create-lb](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/create-lb.png)

2. 在弹出的对话框中，设置负载均衡器的名称，在**网络**下拉列表中选择机器所在的私有网络（在本例中为 `pn`），其他参数可以保持默认，然后点击**提交**。

   ![qingcloud-lb](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/qingcloud-lb.png)

4. 点击上一步创建的负载均衡器。在其详情页面创建监听器，将**监听协议**设置为 `TCP`，将**端口**设置为 `6443`。

   ![listener](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/listener.png)

   - **名称**：监听器的名称
   - **监听协议**：`TCP`
   - **端口**：`6443`
   - **负载方式**：`轮询`

   设置完成后点击**提交**。

   {{< notice note >}}

   在创建监听器后需要检查负载均衡器的防火墙规则。请确保 `6443` 端口已添加到防火墙规则中并且外部流量可以通过 `6443` 端口，否则安装将会失败。在青云QingCloud 平台上，您可以在**安全**下的**安全组**页面查看相关信息。

   {{</ notice >}}

5. 点击**添加后端**，选择之前选择的私有网络（在本例中为 `pn`），点击**高级搜索**，选择三个主节点，并将**端口**设置为 `6443`（api-server 的默认安全端口）。

   ![3-master](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/3-master.png)

   设置完成后点击**提交**。

5. 点击**应用修改**。页面上显示三个主节点已添加为内部负载均衡器后端监听器的后端服务器。

   {{< notice note >}}

   将三个主节点添加为后端后，页面上可能会显示三个主节点的状态为**不可用**。这属于正常现象。这是由于 api-server 的 `6443` 端口尚未在主节点上启用。安装完成后，主节点的状态将自动变为**活跃**，同时 api-server 的端口将暴露，从而内部负载均衡器将正常工作。

   {{</ notice >}}

   ![apply-change](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/apply-change.png)

   记录**网络**区域显示的内网 VIP 地址。该地址将在后续步骤中添加至配置文件。

#### 创建外部负载均衡器

您需要提前在**网络与 CDN** 下的**公网 IP** 页面申请公网 IP 地址。

{{< notice note >}}

本教程需要用到两个公网 IP 地址。其中一个用于 VPC 网络，另一个用于本步骤创建的外部负载均衡器。同一个公网 IP 地址不能同时与 VPC 网络和负载均衡器绑定。

{{</ notice >}}

1. 创建外部负载均衡器时，点击**添加公网 IPv4** 将您申请到的公网 IP 地址与负载均衡器绑定，将**网络**设置为**不加入私有网络**。其他步骤与创建内部负载均衡器相同。

   ![bind-eip](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/bind-eip.png)

2. 在负载均衡器详情页面，创建一个监听器用于监听 `30880` 端口（KubeSphere 控制台 NodePort 端口），将**监听协议**设置为 `HTTP`。

   {{< notice note >}}

   在创建监听器后需要检查负载均衡器的防火墙规则。请确保 `30880` 端口已添加到防火墙规则中并且外部流量可以通过 `30880` 端口，否则安装将会失败。在青云QingCloud 平台上，您可以在**安全**下的**安全组**页面查看相关信息。

   {{</ notice >}}

   ![listener2](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/listener2.png)

3. 点击**添加后端**。在弹出的对话框中选择私有网络 `pn`，点击**高级搜索**，选择私有网络 `pn` 中的六台机器用于安装 KubeSphere，并将**端口**设置为 `30880`。

   ![six-instances](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/six-instances.png)

   设置完成后点击**提交**。

4. 点击**应用修改**。页面上显示六台机器已添加为外部负载均衡器后端监听器的后端服务器。

### 步骤 2：下载 KubeKey

[KubeKey](https://github.com/kubesphere/kubekey) 是新一代 Kubernetes 和 KubeSphere 安装器，可帮助您以简单、快速、灵活的方式安装 Kubernetes 和 KubeSphere。

请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub 发布页面](https://github.com/kubesphere/kubekey/releases)下载 KubeKey 或直接使用以下命令：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey：

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

在您下载 KubeKey 后，如果您将其传至新的机器，且访问 Googleapis 同样受限，在您执行以下步骤之前请务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v2.2.2)，您可以修改命令中的版本号下载指定版本。

{{</ notice >}} 

为 `kk` 文件添加可执行权限。

```bash
chmod +x kk
```

创建包含默认配置的示例配置文件。以下以 Kubernetes v1.22.10 为例。

```bash
./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10
```

{{< notice note >}}

- 安装 KubeSphere 3.3.0 的建议 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../../installing-on-linux/introduction/kubekey/#支持矩阵)。

- 如果您在这一步的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，只能使用配置文件中的 `addons` 字段安装，或者在您后续使用 `./kk create cluster` 命令时再次添加这个标志。

- 如果您添加标志 `--with-kubesphere` 时不指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。

{{</ notice >}}

### 步骤 3：设置集群节点

当您采用包含堆叠控制平面节点的高可用拓扑时，主节点和 etcd 节点在相同的三台机器上。

| **参数** | **描述**           |
| :------- | :----------------- |
| `hosts`  | 所有节点的详细信息 |
| `etcd`   | etcd 节点名称      |
| `master` | 主节点名称         |
| `worker` | 工作节点名称       |

在 `etcd` 和 `master` 参数下分别设置主节点的名称（`master1`、`master2` 和 `master3`）使得三台机器同时作为主节点和 etcd 节点。etcd 节点的数量必须是奇数。此外，由于 etcd 内存占用较高，不建议将 etcd 安装在工作节点上。

#### config-sample.yaml 文件示例

```yaml
spec:
  hosts:
  - {name: master1, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: master2, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: master3, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.5, internalAddress: 192.168.0.5, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.6, internalAddress: 192.168.0.6, user: ubuntu, password: Testing123}
  - {name: node3, address: 192.168.0.7, internalAddress: 192.168.0.7, user: ubuntu, password: Testing123}
  roleGroups:
    etcd:
    - master1
    - master2
    - master3
    control-plane:
    - master1
    - master2
    - master3
    worker:
    - node1
    - node2
    - node3
```

有关完整的配置示例说明，请参见[此文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)。

### 步骤 4：配置负载均衡器

在前述 YAML 文件中除了需要配置节点信息外，还需要配置负载均衡器信息。本步骤需要用到[创建内部负载均衡器](#创建内部负载均衡器)时记录的内网 VIP 地址。在本示例中，**内部负载均衡器**的 VIP 地址和监听端口分别为 `192.168.0.253` 和 `6443`。您可以参考如下 YAML 文件配置。

#### config-sample.yaml 文件示例

```yaml
## Internal LB config example
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.0.253"
    port: 6443
```

{{< notice note >}}

- 在 `config-sample.yaml` 文件中，`address` 和 `port` 字段应缩进两个空格，同时 `address` 字段的值应为 VIP 地址。
- 负载均衡器的默认域名为 `lb.kubesphere.local`，用于内部访问。您可以在 `domain` 字段修改域名。

{{</ notice >}}

### 步骤 5：配置 Kubernetes 集群（可选）

集群管理员可修改 KubeKey 提供的一些字段来自定义 Kubernetes 安装参数，包括 Kubernetes 版本、网络插件和镜像仓库。`config-sample.yaml` 文件中的一些字段有默认值。您可以根据需要修改文件中 Kubernetes 相关的字段。有关更多信息，请参考[ Kubernetes 集群配置](../../../installing-on-linux/introduction/vars/)。

### 步骤 6：配置持久化存储插件

考虑到生产环境需要数据持久化，您需要准备持久化存储并在 `config-sample.yaml` 文件中配置所需的存储插件（例如 CSI）。

{{< notice note >}}

如搭建测试开发环境，您可以跳过这一步。KubeKey 将直接使用集成的 OpenEBS 配置 LocalPV 存储服务。

{{</ notice >}}

**可用的存储插件和客户端**

- Ceph RBD & CephFS
- GlusterFS
- QingCloud CSI
- QingStor CSI
- 未来版本将支持更多插件

请确保在安装前配置了存储插件。在安装过程中，KubeKey 将为相关的工作负载创建 StorageClass 和持久卷。有关更多信息，请参见[持久化存储配置](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)。

### 步骤 7：启用可插拔组件（可选）

从 v2.1.0 版本开始，一些核心功能组件从 KubeSphere 中解耦出来。这些组件被设计成可插拔的形式，您可以在安装前或安装后启用它们。默认情况下，如果您没有启用这些组件，KubeSphere 将以最小化形式安装。

您可以根据需要启用任何可插拔组件。强烈建议您安装这些组件以充分发掘 KubeSphere 的全栈特性。如果您启用这些组件，请确保您机器有足够的 CPU 和内存资源。有关详情，请参见[启用可插拔组件](../../../pluggable-components/)。

### 步骤 8：搭建集群

完成以上配置后，执行以下命令开始安装：

```bash
./kk create cluster -f config-sample.yaml
```

### 步骤 9：验证安装结果

检查安装日志。如果显示如下日志，KubeSphere 安装成功。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.3:30880
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
https://kubesphere.io             2020-08-13 10:50:24
#####################################################
```

### 步骤 10：验证高可用集群

安装完成后，打开内部和外部负载均衡器的详情页面查看节点状态。

![active](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/active.png)

如果两个监听器中的节点状态都是**活跃**，表明所有节点已启动并运行正常。

![active-listener](/images/docs/v3.3/zh-cn/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/active-listener.png)

进入 KubeSphere 的 Web 控制台，您也可以看到所有节点运行正常。

为验证集群的高可用性，可关闭一台主机进行测试。例如，上面的控制台可通过 `IP:30880` 地址访问（此处 IP 地址为绑定到外部负载均衡器的 EIP 地址）。如果集群的高可用性正常，在您关闭一台主节点后，控制台应该仍能正常工作。

## 另请参见

[多节点安装](../../../installing-on-linux/introduction/multioverview/)

[Kubernetes 集群配置](../../../installing-on-linux/introduction/vars/)

[持久化存储配置](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)

[启用可插拔组件](../../../pluggable-components/)