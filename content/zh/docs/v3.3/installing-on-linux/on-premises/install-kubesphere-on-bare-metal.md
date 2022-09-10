---
title: "在裸机上安装 KubeSphere"
keywords: 'Kubernetes, KubeSphere, 裸机'
description: '了解如何在裸机上部署一个单 master 的多节点 KubeSohere 集群。'
linkTitle: "在裸机上安装 KubeSphere"
weight: 3520
---

## 介绍

KubeSphere 除了可以在云上安装，还可以在裸机上安装。由于在裸机上没有虚拟层，基础设施的开销大大降低，从而可以给部署的应用提供更多的计算和存储资源，硬件效率得到提高。以下示例介绍如何在裸机上安装 KubeSphere。

## 准备工作

- 您需要了解如何在多节点集群中安装 KubeSphere。有关详情，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/)。
- 您的环境中需要有足够的服务器和网络冗余。
- 如果搭建生产环境，建议您提前准备持久化存储并创建 StorageClass。如果搭建开发测试环境，您可以直接使用集成的 OpenEBS 配置 LocalPV 存储服务。

## 准备 Linux 主机

本教程使用 3 台物理机，硬件配置为 **DELL 620 Intel (R) Xeon (R) CPU E5-2640 v2 @ 2.00GHz (32G memory)**。在这 3 台物理机上将安装 **CentOS Linux release 7.6.1810 (Core)** 操作系统，用于 KubeSphere 最小化安装。

### 安装 CentOS

请提前下载并安装[ CentOS 镜像](https://www.centos.org/download/)，推荐版本为 CentOS Linux release 7.6.1810 (Core)。请确保根目录已至少分配 200 GB 空间用于存储 Docker 镜像（如果 KubeSphere 仅用于测试，您可以跳过这一步）。

有关系统要求的更多信息，请参见[系统要求](../../../installing-on-linux/introduction/multioverview/)。

三台主机的角色分配如下，供参考。


| 主机 IP 地址 | 主机名 | 角色 |
| --- | --- | --- |
|192.168.60.152|master1|master1, etcd|
|192.168.60.153|worker1|worker|
|192.168.60.154|worker2|worker|

### 设置网卡

1. 清空网卡配置。

   ```bash
   ifdown em1
   ```
   
   ```bash
   ifdown em2
   ```
   
   ```bash
   rm -rf /etc/sysconfig/network-scripts/ifcfg-em1
   ```
   
   ```bash
   rm -rf /etc/sysconfig/network-scripts/ifcfg-em2
   ```

2. 创建 bond 网卡。

   ```bash
   nmcli con add type bond con-name bond0 ifname bond0 mode 802.3ad ip4 192.168.60.152/24 gw4 192.168.60.254
   ```

3. 设置 bond 模式。

   ```bash
   nmcli con mod id bond0 bond.options mode=802.3ad,miimon=100,lacp_rate=fast,xmit_hash_policy=layer2+3
   ```

4. 将物理网卡绑定至 bond。

   ```bash
   nmcli con add type bond-slave ifname em1 con-name em1 master bond0
   ```

   ```bash
   nmcli con add type bond-slave ifname em2 con-name em2 master bond0
   ```

5. 修改网卡模式。

   ```bash
   vi /etc/sysconfig/network-scripts/ifcfg-bond0
   BOOTPROTO=static
   ```

6. 重启 Network Manager。

   ```bash
   systemctl restart NetworkManager
   ```

   ```bash
   nmcli con # Display NIC information
   ```

7. 修改主机名和 DNS。

   ```bash
   hostnamectl set-hostname worker-1
   ```

   ```bash
   vim /etc/resolv.conf
   ```

### 设置时间

1. 开启时间同步。

   ```bash
   yum install -y chrony
   ```
   
   ```bash
   systemctl enable chronyd
   ```
   
   ```bash
   systemctl start chronyd
   ```
   
   ```bash
   timedatectl set-ntp true
   ```

2. 设置时区。

   ```bash
   timedatectl set-timezone Asia/Shanghai
   ```

3. 检查 ntp-server 是否可用。

   ```bash
   chronyc activity -v
   ```

### 设置防火墙

执行以下命令停止并禁用 firewalld 服务：

```bash
iptables -F
```

```bash
systemctl status firewalld
```

```bash
systemctl stop firewalld
```

```bash
systemctl disable firewalld
```

### 更新系统包和依赖项

执行以下命令更新系统包并安装依赖项：

```bash
yum update
```

```bash
yum install openssl openssl-devel
```

```bash
yum install socat
```

```bash
yum install epel-release
```

```bash
yum install conntrack-tools
```


{{< notice note >}} 

取决于将要安装的 Kubernetes 版本，您可能不需要安装所有依赖项。有关更多信息，请参见[依赖项要求](../../../installing-on-linux/introduction/multioverview/)。

{{</ notice >}} 

## 下载 KubeKey

[KubeKey](https://github.com/kubesphere/kubekey) 是新一代 Kubernetes 和 KubeSphere 安装器，可帮助您以简单、快速、灵活的方式安装 Kubernetes 和 KubeSphere。

请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或使用以下命令：

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

## 创建多节点集群

您可用使用 KubeKey 同时安装 Kubernetes 和 KubeSphere，通过自定义配置文件中的参数创建多节点集群。

创建安装有 KubeSphere 的 Kubernetes 集群（例如使用 `--with-kubesphere v3.3.0`）：

```bash
./kk create config --with-kubernetes v1.22.10 --with-kubesphere v3.3.0
```

{{< notice note >}} 

- 安装 KubeSphere 3.3.0 的建议 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../../installing-on-linux/introduction/kubekey/#支持矩阵)。

- 如果您在这一步的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，只能使用配置文件中的 `addons` 字段安装 KubeSphere，或者在您后续使用 `./kk create cluster` 命令时再次添加该标志。
- 如果您添加标志 `--with-kubesphere` 时不指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。

{{</ notice >}} 

系统将创建默认的 `config-sample.yaml` 文件。您可以根据您的环境修改此文件。

```bash
vi config-sample.yaml
```

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: config-sample
spec:
  hosts:
  - {name: master1, address: 192.168.60.152, internalAddress: 192.168.60.152, user: root, password: P@ssw0rd}
  - {name: worker1, address: 192.168.60.153, internalAddress: 192.168.60.153, user: root, password: P@ssw0rd}
  - {name: worker2, address: 192.168.60.154, internalAddress: 192.168.60.154, user: root, password: P@ssw0rd}
  roleGroups:
    etcd:
    - master1
    control-plane:
    - master1
    worker:
    - worker1
    - worker2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""                    
    port: 6443
```
执行以下命令使用自定义的配置文件创建集群：

```bash
./kk create cluster -f config-sample.yaml
```

#### 验证安装

安装结束后，您可以执行以下命令查看安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

如果返回欢迎日志，则安装成功。

```bash
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://192.168.60.152:30880
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

#### 登录控制台

您可以使用默认的帐户和密码 `admin/P@88w0rd` 登录 KubeSphere 控制台并开始使用 KubeSphere。请在登录后修改默认密码。

#### 启用可插拔组件（可选）
以上示例演示了默认的最小化安装流程。如需启用 KubeSphere 的其他组件，请参考[启用可插拔组件](../../../pluggable-components/)。

## 优化系统

- 更新系统。

   ```bash
   yum update
   ```

- 添加所需的内核引导参数。

   ```bash
   sudo /sbin/grubby --update-kernel=ALL --args='cgroup_enable=memory cgroup.memory=nokmem swapaccount=1'
   ```

- 启用 `overlay2` 内核模块。

   ```bash
   echo "overlay2" | sudo tee -a /etc/modules-load.d/overlay.conf
   ```

- 刷新动态生成的 grub2 配置。

   ```bash
   sudo grub2-set-default 0
   ```

- 调整内核参数并使修改生效。

   ```bash
   cat <<EOF | sudo tee -a /etc/sysctl.conf
   vm.max_map_count = 262144
   fs.may_detach_mounts = 1
   net.ipv4.ip_forward = 1
   vm.swappiness=1
   kernel.pid_max =1000000
   fs.inotify.max_user_instances=524288
   EOF
   sudo sysctl -p
   ```

- 调整系统限制。

   ```bash
   vim /etc/security/limits.conf
   *                soft    nofile         1024000
   *                hard    nofile         1024000
   *                soft    memlock        unlimited
   *                hard    memlock        unlimited
   root             soft    nofile         1024000
   root             hard    nofile         1024000
   root             soft    memlock        unlimited
   ```

- 删除旧的限制配置。

   ```bash
   sudo rm /etc/security/limits.d/20-nproc.conf
   ```

- 重启系统。

   ```bash
   reboot
   ```
