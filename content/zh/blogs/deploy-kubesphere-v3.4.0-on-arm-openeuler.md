---
title: 'ARM 版 openEuler 22.03 部署 KubeSphere v3.4.0 不完全指南'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, openEuler, ARM '
description: '本文主要实战演示了在 ARM 版 openEuler 22.03 LTS SP2 服务器上，利用 KubeKey v3.0.10 自动化部署最小化 KubeSphere v3.4.0 和 Kubernetes v1.26.5 高可用集群的详细过程。'
createTime: '2023-10-26'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-on-openeuler-cover.png'
---

## 前言

### 知识点

- 定级：**入门级**
- KubeKey 安装部署 ARM 版 KubeSphere 和 Kubernetes
- ARM 版 KubeSphere 和 Kubernetes 常见问题

### 实战服务器配置 (个人云上测试服务器)

|   主机名    |      IP      | CPU | 内存 | 系统盘 | 数据盘 |         用途          |
| :---------: | :----------: | :-: | :--: | :----: | :----: | :-------------------: |
| ks-master-1 | 172.16.33.16 |  6  |  16  |   50   |  200   | KubeSphere/k8s-master |
| ks-master-2 | 172.16.33.22 |  6  |  16  |   50   |  200   | KubeSphere/k8s-master |
| ks-master-3 | 172.16.33.23 |  6  |  16  |   50   |  200   | KubeSphere/k8s-master |
|    合计     |      10      | 18  |  48  |  150   |  600+  |                       |

### 实战环境涉及软件版本信息

- 服务器芯片：**Kunpeng-920**

- 操作系统：**openEuler 22.03 LTS SP2 aarch64**

- KubeSphere：**v3.4.0**

- Kubernetes：**v1.26.5**

- Containerd：**1.6.4**

- KubeKey: **v3.0.10**

## 1. 本文简介

本文介绍了如何在 **openEuler 22.03 LTS SP2 aarch64** 架构服务器上部署 KubeSphere 和 Kubernetes 集群。我们将使用 KubeSphere 开发的 KubeKey 工具实现自动化部署，在三台服务器上实现高可用模式最小化部署 Kubernetes 集群和 KubeSphere。

KubeSphere 和 Kubernetes 在 ARM 架构 和 x86 架构的服务器上部署，最大的区别在于所有服务使用的**容器镜像架构类型**的不同，KubeSphere 开源版对于 ARM 架构的默认支持可以实现 KubeSphere-Core 功能，即可以实现最小化的 KubeSphere 和完整的 Kubernetes 集群的部署。当启用了 KubeSphere 可插拔组件时，会遇到个别组件部署失败的情况，需要我们手工替换官方或是第三方提供的 ARM 版镜像或是根据官方源码手工构建 ARM 版镜像。如果需要实现开箱即用及更多的技术支持，则需要购买企业版的 KubeSphere。

本文源自我在调研 KubeSphere 开源版对 ARM 架构服务器支持程度的实验过程文档。文中详细的记录了在完成最终部署的过程中，遇到的各种问题报错及相应的解决方案。由于能力有限，本文中所遇到的架构不兼容的问题，均采用了手工替换第三方仓库或是官方其他仓库相同或是相似 ARM 版本镜像的方案。建议计划在生产中使用的读者最好能具备使用官方源码及 DockerFile 构建与 X86 版本完全相同的 ARM 版容器镜像的能力，不要替换相近版本或是使用第三方镜像。也正是因为本文并没有涉及利用官方源码及 Dockerfile 构建 ARM 镜像的相关内容，所以才取名为**不完全指南**。

接下来我将提供详细的部署说明，以便读者轻松地完成 ARM 版 KubeSphere 和 Kubernetes 部署并解决部署过程中遇到的问题。

### 1.1 操作系统配置

在执行下文的任务之前，先确认操作系统相关配置。

- 操作系统类型

```bash
[root@ks-master-1 ~]# cat /etc/os-release
NAME="openEuler"
VERSION="22.03 (LTS-SP2)"
ID="openEuler"
VERSION_ID="22.03"
PRETTY_NAME="openEuler 22.03 (LTS-SP2)"
ANSI_COLOR="0;31"
```

- 操作系统内核

```bash
[root@ks-master-1 ~]# uname -a
Linux ks-master-1 5.10.0-153.12.0.92.oe2203sp2.aarch64 #1 SMP Wed Jun 28 23:18:48 CST 2023 aarch64 aarch64 aarch64 GNU/Linux
```

- 服务器 CPU 信息

```bash
[root@ks-master-1 ~]# lscpu
Architecture:           aarch64
  CPU op-mode(s):       64-bit
  Byte Order:           Little Endian
CPU(s):                 6
  On-line CPU(s) list:  0-5
Vendor ID:              HiSilicon
  BIOS Vendor ID:       QEMU
  Model name:           Kunpeng-920
    BIOS Model name:    virt-4.1
    Model:              0
    Thread(s) per core: 1
    Core(s) per socket: 1
    Socket(s):          6
    Stepping:           0x1
    Frequency boost:    disabled
    CPU max MHz:        2600.0000
    CPU min MHz:        2600.0000
    BogoMIPS:           200.00
    Flags:              fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma dcpop asimddp asimdfhm
Caches (sum of all):
  L1d:                  384 KiB (6 instances)
  L1i:                  384 KiB (6 instances)
  L2:                   3 MiB (6 instances)
  L3:                   192 MiB (6 instances)
```

## 2. 操作系统基础配置

请注意，以下操作无特殊说明时需在所有服务器上执行。本文只选取 Master-1 节点作为演示，并假定其余服务器都已按照相同的方式进行配置和设置。

### 2.1 配置主机名

```shell
hostnamectl hostname ks-master-1
```

### 2.2 配置 DNS

```shell
echo "nameserver 114.114.114.114" > /etc/resolv.conf
```

### 2.3 配置服务器时区

配置服务器时区为 **Asia/Shanghai**。

```shell
timedatectl set-timezone Asia/Shanghai
```

### 2.4 配置时间同步

安装 chrony 作为时间同步软件。

```shell
yum install chrony
```

修改配置文件 /etc/chrony.conf，修改 ntp 服务器配置。

```shell
vi /etc/chrony.conf

# 删除所有的 pool 配置
pool pool.ntp.org iburst

# 增加国内的 ntp 服务器，或是指定其他常用的时间服务器
pool cn.pool.ntp.org iburst

# 上面的手工操作，也可以使用 sed 自动替换
sed -i 's/^pool pool.*/pool cn.pool.ntp.org iburst/g' /etc/chrony.conf
```

重启并设置 chrony 服务开机自启动。

```shell
systemctl enable chronyd --now
```

验证 chrony 同步状态。

```shell
# 执行查看命令
chronyc sourcestats -v
```

### 2.5 关闭系统防火墙

```shell
systemctl stop firewalld && systemctl disable firewalld
```

### 2.6 禁用 SELinux

openEuler 22.03 SP2 最小化安装的系统默认启用了 SELinux，为了减少麻烦，我们所有的节点都禁用 SELinux。

```shell
# 使用 sed 修改配置文件，实现彻底的禁用
sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

# 使用命令，实现临时禁用，这一步其实不做也行，KubeKey 会自动配置
setenforce 0
```

### 2.7 安装系统依赖

在所有节点上，以 **root** 用户登陆系统，执行下面的命令为 Kubernetes 安装系统基本依赖包。

```shell
# 安装 Kubernetes 系统依赖包
yum install curl socat conntrack ebtables ipset ipvsadm

# 安装其他必备包，openEuler 也是奇葩了，默认居然都不安装 tar，不装的话后面会报错
yum install tar
```

## 3. 操作系统磁盘配置

服务器新增一块数据盘 **/dev/sdb**，用于 **Containerd** 和 **Kubernetes Pod** 的持久化存储。

请注意，以下操作无特殊说明时需在集群所有节点上执行。本文只选取 **Master-1** 节点作为演示，并假定其余服务器都已按照相同的方式进行配置和设置。

### 3.1 使用 LVM 配置磁盘

为了满足部分用户希望在生产上线后，磁盘容量不足时可以实现动态扩容。本文采用了 LVM 的方式配置磁盘（**实际上，本人维护的生产环境，几乎不用 LVM**）。

- 创建 PV

```bash
 pvcreate /dev/sdb
```

- 创建 VG

```bash
vgcreate data /dev/sdb
```

- 创建 LV

```bash
# 使用所有空间，VG 名字为 data，LV 名字为 lvdata
lvcreate -l 100%VG data -n lvdata
```

### 3.2 格式化磁盘

```shell
mkfs.xfs /dev/mapper/data-lvdata
```

### 3.3 磁盘挂载

- 手工挂载

```bash
mkdir /data
mount /dev/mapper/data-lvdata /data/
```

- 开机自动挂载

```bash
tail -1 /etc/mtab >> /etc/fstab
```

### 3.4 创建数据目录

- 创建 **Containerd** 数据目录

```bash
mkdir -p /data/containerd
```

- 创建 Containerd 数据目录软连接

```bash
ln -s /data/containerd /var/lib/containerd
```

> **说明：** KubeKey 到 v3.0.10 版为止，一直不支持在部署的时候更改 Containerd 的数据目录，只能用这种目录软链接到变通方式来增加存储空间（**也可以提前手工安装 Containerd，建议**）。

### 3.5 磁盘配置自动化 Shell 脚本

上述所有操作，都可以整理成自动化配置脚本。

```shell
pvcreate /dev/sdb
vgcreate data /dev/sdb
lvcreate -l 100%VG data -n lvdata
mkfs.xfs /dev/mapper/data-lvdata
mkdir /data
mount /dev/mapper/data-lvdata /data/
tail -1 /etc/mtab >> /etc/fstab
mkdir -p /data/containerd
ln -s /data/containerd /var/lib/containerd
```

## 4. 安装部署 KubeSphere 和 Kubernetes

### 4.1 下载 KubeKey

本文将 master-1 节点作为部署节点，把 KubeKey (下文简称 kk) 最新版 (**v3.0.10**) 二进制文件下载到该服务器。具体 kk 版本号可以在 [kk 发行页面](https://github.com/kubesphere/kubekey/releases "kk 发行页面") 查看。

- 下载最新版的 KubeKey

```shell
cd ~
mkdir kubekey
cd kubekey/

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn
curl -sfL https://get-kk.kubesphere.io | sh -

# 也可以使用下面的命令指定具体版本
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.10 sh -

# 正确的执行效果如下
[root@ks-master-1 ~]# cd ~
[root@ks-master-1 ~]# mkdir kubekey
[root@ks-master-1 ~]# cd kubekey/
[root@ks-master-1 kubekey]# export KKZONE=cn
[root@ks-master-1 kubekey]# curl -sfL https://get-kk.kubesphere.io | sh -

Downloading kubekey v3.0.10 from https://kubernetes.pek3b.qingstor.com/kubekey/releases/download/v3.0.10/kubekey-v3.0.10-linux-arm64.tar.gz ...


Kubekey v3.0.10 Download Complete!

[root@ks-master-1 kubekey]# ll
total 107040
-rwxr-xr-x. 1 root root 76376640 Jul 28 14:13 kk
-rw-r--r--. 1 root root 33229133 Oct 12 09:03 kubekey-v3.0.10-linux-arm64.tar.gz
```

> **注意：** ARM 版的安装包名称为 **kubekey-v3.0.10-linux-arm64.tar.gz**。

### 4.2 创建 Kubernetes 和 KubeSphere 部署配置文件

创建集群配置文件，本示例中，选择 KubeSphere v3.4.0 和 Kubernetes v1.26.5。因此，指定配置文件名称为 **kubesphere-v340-v1265.yaml**，如果不指定，默认的文件名为 **config-sample.yaml**。

```shell
./kk create config -f kubesphere-v340-v1265.yaml --with-kubernetes v1.26.5 --with-kubesphere v3.4.0
```

命令执行成功后，在当前目录会生成文件名为 **kubesphere-v340-v1265.yaml** 的配置文件。

> **注意：** 生成的默认配置文件内容较多，这里就不做过多展示了，更多详细的配置参数请参考 [官方配置示例](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md "官方配置示例")。

本文示例采用 3 个节点同时作为 control-plane、Etcd 节点和 worker 节点。

编辑配置文件 `kubesphere-v340-v1265.yaml`，主要修改 **kind: Cluster** 和 **kind: ClusterConfiguration** 两小节的相关配置

修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下。

- hosts：指定节点的 IP、ssh 用户、ssh 密码、ssh 端口。**特别注意：** 一定要手工指定 **arch: arm64**，否则部署的时候会安装 X86 架构的软件包。
- roleGroups：指定 3 个 Etcd、control-plane 节点，复用相同的机器作为 3 个 worker 节点，。
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- domain：自定义了一个 opsman.top
- containerManager：使用了 containerd

修改后的示例如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: ks-master-1, address: 172.16.33.16, internalAddress: 172.16.33.16, user: root, password: "P@88w0rd", arch: arm64}
  - {name: ks-master-2, address: 172.16.33.22, internalAddress: 172.16.33.22, user: root, password: "P@88w0rd", arch: arm64}
  - {name: ks-master-3, address: 172.16.33.23, internalAddress: 172.16.33.23, user: root, password: "P@88w0rd", arch: arm64}
  roleGroups:
    Etcd:
    - ks-master-1
    - ks-master-2
    - ks-master-3
    control-plane:
    - ks-master-1
    - ks-master-2
    - ks-master-3
    worker:
    - ks-master-1
    - ks-master-2
    - ks-master-3
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers
    internalLoadbalancer: haproxy

    domain: lb.opsman.top
    address: ""
    port: 6443
  kubernetes:
    version: v1.26.5
    clusterName: opsman.top
    autoRenewCerts: true
    containerManager: containerd
  Etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  registry:
    privateRegistry: ""
    namespaceOverride: ""
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

修改 **kind: ClusterConfiguration** 启用可插拔组件，修改说明如下。

- 启用 Etcd 监控

```yaml
Etcd:
    monitoring: true # 将 "false" 更改为 "true"
    endpointIps: localhost
    port: 2379
    tlsEnable: true
```

- 启用应用商店

```yaml
openpitrix:
  store:
    enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere DevOps 系统

```yaml
devops:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 日志系统

```shell
logging:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 事件系统

```yaml
events:
  enabled: true # 将 "false" 更改为 "true"
```

> **注意：** 默认情况下，如果启用了事件系统功能，KubeKey 将安装内置 Elasticsearch。对于生产环境，不建议在部署集群时启用事件系统。请在部署完成后，参考 [可插拔组件官方文档](https://www.kubesphere.io/zh/docs/v3.3/pluggable-components/events/ "可插拔组件官方文档") 手工配置。

- 启用 KubeSphere 告警系统

```yaml
alerting:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 审计日志

```yaml
auditing:
  enabled: true # 将 "false" 更改为 "true"
```

> **注意：** 默认情况下，如果启用了审计日志功能，KubeKey 将安装内置 Elasticsearch。对于生产环境，不建议在部署集群时启用审计功能。请在部署完成后，参考 [可插拔组件官方文档](https://www.kubesphere.io/zh/docs/v3.3/pluggable-components/events/ "可插拔组件官方文档") 手工配置。

- 启用 KubeSphere 服务网格

```yaml
servicemesh:
enabled: true # 将 "false" 更改为 "true"
istio:
  components:
    ingressGateways:
    - name: istio-ingressgateway # 将服务暴露至服务网格之外。默认不开启。
      enabled: false
    cni:
      enabled: false # 启用后，会在 Kubernetes pod 生命周期的网络设置阶段完成 Istio 网格的 pod 流量转发设置工作。
```

- 启用 Metrics Server

```shell
metrics_server:
  enabled: true # 将 "false" 更改为 "true"
```

> **说明：**KubeSphere 支持用于 [部署](https://www.kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/deployments/ "部署") 的容器组（Pod）弹性伸缩程序 (HPA)。在 KubeSphere 中，Metrics Server 控制着 HPA 是否启用。

- 启用网络策略、容器组 IP 池、服务拓扑图（名字排序，对应配置参数排序）

```yaml
network:
  networkpolicy:
    enabled: true # 将 "false" 更改为 "true"
  ippool:
    type: calico # 将 "none" 更改为 "calico"
  topology:
    type: none # 将 "none" 更改为 "weave-scope"
```

> **说明：**
>
> - 从 3.0.0 版本开始，用户可以在 KubeSphere 中配置原生 Kubernetes 的网络策略。
> - 容器组 IP 池用于规划容器组网络地址空间，每个容器组 IP 池之间的地址空间不能重叠。
> - 启用服务拓扑图以集成 [Weave Scope](https://www.weave.works/oss/scope/ "Weave Scope") (Docker 和 Kubernetes 的可视化和监控工具)，服务拓扑图显示在您的项目中，将服务之间的连接关系可视化。
> - **因为对应版本 weave-scope 的 arm64 架构的镜像不好找，需要自己构建，但是该功能实际上用处不大了，该项目都已经停止维护了，所以本文最后放弃了启用该功能。**

### 4.3 部署 KubeSphere 和 Kubernetes

接下来我们执行下面的命令，使用上面生成的配置文件部署 KubeSphere 和 Kubernetes。

```shell
export KKZONE=cn
./kk create cluster -f kubesphere-v340-v1265.yaml
```

上面的命令执行后，首先 kk 会检查部署 Kubernetes 的依赖及其他详细要求。检查合格后，系统将提示您确认安装。输入 **yes** 并按 ENTER 继续部署。

```shell
[root@ks-master-1 kubekey]# export KKZONE=cn
[root@ks-master-1 kubekey]# ./kk create cluster -f kubesphere-v340-v1265.yaml


 _   __      _          _   __
| | / /     | |        | | / /
| |/ / _   _| |__   ___| |/ /  ___ _   _
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

09:58:12 CST [GreetingsModule] Greetings
09:58:12 CST message: [ks-master-3]
Greetings, KubeKey!
09:58:13 CST message: [ks-master-1]
Greetings, KubeKey!
09:58:13 CST message: [ks-master-2]
Greetings, KubeKey!
09:58:13 CST success: [ks-master-3]
09:58:13 CST success: [ks-master-1]
09:58:13 CST success: [ks-master-2]
09:58:13 CST [NodePreCheckModule] A pre-check on nodes
09:58:16 CST success: [ks-master-3]
09:58:16 CST success: [ks-master-1]
09:58:16 CST success: [ks-master-2]
09:58:16 CST [ConfirmModule] Display confirmation form
+-------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name        | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+-------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| ks-master-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 09:58:15 |
| ks-master-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 09:58:16 |
| ks-master-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 09:58:15 |
+-------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

This is a simple check of your environment.
Before installation, ensure that your machines meet all requirements specified at
https://github.com/kubesphere/kubekey#requirements-and-recommendations

Continue this installation? [yes/no]:
```

安装过程日志输出比较多，本文只展示重要的一点，一定要观察下载二进制包的时候，格式为 **arm64**，其它的日志输出，为了节省篇幅这里就不展示了。

```bash
Continue this installation? [yes/no]: yes
10:49:21 CST success: [LocalHost]
10:49:21 CST [NodeBinariesModule] Download installation binaries
10:49:21 CST message: [localhost]
downloading arm64 kubeadm v1.26.5 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 43.3M  100 43.3M    0     0  1035k      0  0:00:42  0:00:42 --:--:-- 1212k
```

部署完成需要大约 10-30 分钟左右，具体看网速和机器配置，本次部署完成耗时 32 分钟。

部署完成后，您应该会在终端上看到类似于下面的输出。提示部署完成的同时，输出中还会显示用户登陆 KubeSphere 的默认管理员用户和密码。

```yaml
clusterconfiguration.installer.kubesphere.io/ks-installer created
11:35:03 CST skipped: [ks-master-3]
11:35:03 CST skipped: [ks-master-2]
11:35:03 CST success: [ks-master-1]
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://172.16.33.16:30880
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
https://kubesphere.io             2023-10-12 11:43:50
#####################################################
11:43:53 CST skipped: [ks-master-3]
11:43:53 CST skipped: [ks-master-2]
11:43:53 CST success: [ks-master-1]
11:43:53 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

> **注意：** 当显示上面的部署完成信息后，也不代表所有组件和服务都能正常部署且能提供服务，请查看本文续集中的**「异常组件解决方案」** 排查解决创建和启动异常的组件。

## 5. 部署验证

上面的部署任务完成以后，只能说明基于 ARM 架构的 KubeSphere 和 Kubernetes 集群部署完成了。 但是整体功能是否可用，还需要做一个验证。

本文只做基本验证，不做详细全功能验证，有需要的朋友请自行验证测试。

### 5.1 KubeSphere 管理控制台验证集群状态

我们打开浏览器访问 master-1 节点的 IP 地址和端口 **30880**，可以看到 KubeSphere 管理控制台的登录页面。

输入默认用户 **admin** 和默认密码 **P@88w0rd**，然后点击「登录」。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-login.png)

登录后，系统会要求您更改 KubeSphere 默认用户 admin 的默认密码，输入新的密码并点击「提交」。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-chgpass.png)

提交完成后，系统会跳转到 KubeSphere admin 用户工作台页面，该页面显示了当前 KubeSphere 版本为 **v3.4.0**，可用的 Kubernetes 集群数量为 1。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-dashboard-v340-arm.png)

接下来，单击左上角的「平台管理」菜单，选择「集群管理」。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-v340-v126-arm.png)

进入集群管理界面，在该页面可以查看集群的基本信息，包括集群资源用量、Kubernetes 状态、节点资源用量 Top、系统组件、工具箱等内容。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-overview-v340-v126-arm.png)

单击左侧「节点」菜单，点击「集群节点」可以查看 Kubernetes 集群可用节点的详细信息。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-nodes-v340-v126-arm.png)

单击左侧「系统组件」菜单，可以查看已安装组件的详细信息。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-components-v340-v124-arm.png)

接下来我们粗略的看一下我们部署集群时启用的可插拔插件的状态。

- Etcd 监控

![](https://pek3b.qingstor.com/kubesphere-community/images/ksp-monitor-cluster-etcd-v340-v126-arm.png)

- 应用商店

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-apps-v340-v126-arm.png)

- KubeSphere DevOps 系统（**所有组件状态正常，实际测试中流水线也能正常创建，但是在构建任务时异常无法启动 maven 容器，仅做记录，后续专题解决**）

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-components-devops-v340-v126-arm.png)

- KubeSphere 日志系统

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-logging-container-v340-v126-arm.png)

- KubeSphere 事件系统

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-logging-events-v340-v126-arm.png)

- KubeSphere 审计日志

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-logging-auditing-v340-v126-arm.png)

- KubeSphere 告警系统

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-alerts-v340-v126-arm.png)

- KubeSphere 服务网格（**实际功能未验证测试**）

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-istio-v340-v126-arm.png)

- Metrics Server（**页面没有，需要启用 HPA 时验证**）
- 网络策略、容器组 IP 池

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-network-policies-v340-v126-arm.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-ippools-v340-v126-arm.png)

最后看一组监控图表来结束我们的图形验证（**Etcd 监控在上文已展示**）。

- 概览

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-monitor-cluster-overview-v340-v126-arm.png)

- 物理资源监控

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-monitor-cluster-resource-v340-v126-arm.png)

- API Server 监控

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-monitor-cluster-api-server-v340-v126-arm.png)

- 调度器监控

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-monitor-cluster-scheduler-v340-v126-arm.png)

- 资源用量排行

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-monitor-cluster-ranking-v340-v126-arm.png)

- Pod 监控

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-monitor-pod-v340-v126-arm.png)

### 5.2 Kubectl 命令行验证集群状态

**本小节只是简单的看了一下基本状态，并不全面，更多的细节大家自己体验探索吧。**

- 查看集群节点信息

在 master-1 节点运行 kubectl 命令获取 Kubernetes 集群上的可用节点列表。

```shell
kubectl get nodes -o wide
```

在输出结果中可以看到，当前的 Kubernetes 集群有三个可用节点、节点的内部 IP、节点角色、节点的 Kubernetes 版本号、容器运行时及版本号、操作系统类型及内核版本等信息。

```shell
[root@ks-master-1 ~]# kubectl get nodes -o wide
NAME          STATUS   ROLES                  AGE    VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION                         CONTAINER-RUNTIME
ks-master-1   Ready    control-plane,worker   4d4h   v1.26.5   172.16.33.16   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.aarch64   containerd://1.6.4
ks-master-2   Ready    control-plane,worker   4d4h   v1.26.5   172.16.33.22   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.aarch64   containerd://1.6.4
ks-master-3   Ready    control-plane,worker   4d4h   v1.26.5   172.16.33.23   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.aarch64   containerd://1.6.4
```

- 查看 Pod 列表

输入以下命令获取在 Kubernetes 集群上运行的 Pod 列表，按工作负载在 NODE 上的分布排序。

```shell
kubectl get pods -o wide -A
```

在输出结果中可以看到， Kubernetes 集群上有多个可用的命名空间 kube-system、kubesphere-control-system、kubesphere-monitoring-system、kubesphere-system、argocd 和 istio-system 等，所有 pod 都在运行。

```shell
[root@ks-master-1 ~]# kubectl get pods -o wide -A | grep -v Completed | grep -v weave
NAMESPACE                      NAME                                                           READY   STATUS             RESTARTS           AGE     IP               NODE          NOMINATED NODE   READINESS GATES
argocd                         devops-argocd-application-controller-0                         1/1     Running            1 (29m ago)        4d      10.233.103.140   ks-master-1   <none>           <none>
argocd                         devops-argocd-applicationset-controller-864f464855-64zvf       1/1     Running            1 (29m ago)        99m     10.233.103.129   ks-master-1   <none>           <none>
argocd                         devops-argocd-dex-server-65f7bc75c9-872sh                      1/1     Running            1 (30m ago)        4d      10.233.93.39     ks-master-3   <none>           <none>
argocd                         devops-argocd-notifications-controller-68f699d6fb-xd2j4        1/1     Running            1 (30m ago)        4d      10.233.93.40     ks-master-3   <none>           <none>
argocd                         devops-argocd-redis-84f4c697ff-l96m5                           1/1     Running            1 (29m ago)        4d      10.233.103.146   ks-master-1   <none>           <none>
argocd                         devops-argocd-repo-server-b6896f6d5-sdfxz                      1/1     Running            1 (30m ago)        4d      10.233.93.36     ks-master-3   <none>           <none>
argocd                         devops-argocd-server-7f76f4fccb-v82f4                          1/1     Running            1 (31m ago)        4d      10.233.93.44     ks-master-3   <none>           <none>
istio-system                   istiod-1-14-6-6d4dbc56df-n5z9g                                 1/1     Running            0                  11m     10.233.102.149   ks-master-2   <none>           <none>
istio-system                   jaeger-operator-654c67b7cc-f62zp                               1/1     Running            1 (8m20s ago)      11m     10.233.103.147   ks-master-1   <none>           <none>
istio-system                   kiali-5d6dc84c75-v4v7n                                         1/1     Running            1 (30m ago)        4d      10.233.102.127   ks-master-2   <none>           <none>
istio-system                   kiali-operator-7946dd765f-zbhng                                1/1     Running            1 (30m ago)        4d      10.233.102.132   ks-master-2   <none>           <none>
kube-system                    calico-kube-controllers-7f576895dd-zfm25                       1/1     Running            1 (30m ago)        4d5h    10.233.102.141   ks-master-2   <none>           <none>
kube-system                    calico-node-jq4rm                                              1/1     Running            1 (30m ago)        4d5h    172.16.33.22     ks-master-2   <none>           <none>
kube-system                    calico-node-wdrmh                                              1/1     Running            1 (30m ago)        4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    calico-node-xbmzq                                              1/1     Running            1 (29m ago)        4d5h    172.16.33.16     ks-master-1   <none>           <none>
kube-system                    coredns-d9d84b5bf-9zp82                                        1/1     Running            1 (30m ago)        4d5h    10.233.102.142   ks-master-2   <none>           <none>
kube-system                    coredns-d9d84b5bf-pndfd                                        1/1     Running            1 (30m ago)        4d5h    10.233.102.140   ks-master-2   <none>           <none>
kube-system                    kube-apiserver-ks-master-1                                     1/1     Running            1 (29m ago)        4d5h    172.16.33.16     ks-master-1   <none>           <none>
kube-system                    kube-apiserver-ks-master-2                                     1/1     Running            1 (30m ago)        4d5h    172.16.33.22     ks-master-2   <none>           <none>
kube-system                    kube-apiserver-ks-master-3                                     1/1     Running            1 (30m ago)        4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    kube-controller-manager-ks-master-1                            1/1     Running            1 (29m ago)        4d5h    172.16.33.16     ks-master-1   <none>           <none>
kube-system                    kube-controller-manager-ks-master-2                            1/1     Running            1 (30m ago)        4d5h    172.16.33.22     ks-master-2   <none>           <none>
kube-system                    kube-controller-manager-ks-master-3                            1/1     Running            1 (31m ago)        4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    kube-proxy-66v8m                                               1/1     Running            1 (31m ago)        4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    kube-proxy-6gq2q                                               1/1     Running            1 (29m ago)        4d5h    172.16.33.16     ks-master-1   <none>           <none>
kube-system                    kube-proxy-9zppd                                               1/1     Running            1 (30m ago)        4d5h    172.16.33.22     ks-master-2   <none>           <none>
kube-system                    kube-scheduler-ks-master-1                                     1/1     Running            1 (29m ago)        4d5h    172.16.33.16     ks-master-1   <none>           <none>
kube-system                    kube-scheduler-ks-master-2                                     1/1     Running            1 (30m ago)        4d5h    172.16.33.22     ks-master-2   <none>           <none>
kube-system                    kube-scheduler-ks-master-3                                     1/1     Running            2 (31m ago)        4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    metrics-server-66b6cfb784-85l94                                1/1     Running            47 (31m ago)       4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    nodelocaldns-8mgpl                                             1/1     Running            1 (29m ago)        4d5h    172.16.33.16     ks-master-1   <none>           <none>
kube-system                    nodelocaldns-ggg45                                             1/1     Running            1 (30m ago)        4d5h    172.16.33.22     ks-master-2   <none>           <none>
kube-system                    nodelocaldns-z77x2                                             1/1     Running            1 (31m ago)        4d5h    172.16.33.23     ks-master-3   <none>           <none>
kube-system                    openebs-localpv-provisioner-589cc46f59-k6fvq                   1/1     Running            1 (29m ago)        4d5h    10.233.103.139   ks-master-1   <none>           <none>
kube-system                    snapshot-controller-0                                          1/1     Running            1 (31m ago)        4d1h    10.233.93.46     ks-master-3   <none>           <none>
kubesphere-controls-system     default-http-backend-7b44d89cb8-lnj9c                          1/1     Running            0                  21s     10.233.102.151   ks-master-2   <none>           <none>
kubesphere-controls-system     kubectl-admin-5656cd6dfc-n5k4c                                 1/1     Running            1 (30m ago)        4d      10.233.102.124   ks-master-2   <none>           <none>
kubesphere-devops-system       devops-apiserver-5554d4c946-9hk2d                              1/1     Running            1 (29m ago)        4d      10.233.103.137   ks-master-1   <none>           <none>
kubesphere-devops-system       devops-controller-76f8c5bf57-tpvlb                             1/1     Running            1 (29m ago)        4d      10.233.103.136   ks-master-1   <none>           <none>
kubesphere-devops-system       devops-jenkins-865b94d8c6-nv6nw                                1/1     Running            1 (31m ago)        3d1h    10.233.93.41     ks-master-3   <none>           <none>
kubesphere-devops-system       s2ioperator-0                                                  1/1     Running            1 (29m ago)        4d      10.233.103.135   ks-master-1   <none>           <none>
kubesphere-logging-system      fluent-bit-6wd7l                                               1/1     Running            1 (29m ago)        4d      10.233.103.143   ks-master-1   <none>           <none>
kubesphere-logging-system      fluent-bit-hl56h                                               1/1     Running            1 (31m ago)        4d      10.233.93.48     ks-master-3   <none>           <none>
kubesphere-logging-system      fluent-bit-q2t7x                                               1/1     Running            1 (30m ago)        4d      10.233.102.133   ks-master-2   <none>           <none>
kubesphere-logging-system      fluentbit-operator-5f6598c96c-s7vzg                            1/1     Running            1 (31m ago)        4d1h    10.233.93.50     ks-master-3   <none>           <none>
kubesphere-logging-system      ks-events-exporter-7cffc5bdcb-8cz5z                            2/2     Running            2 (29m ago)        4d      10.233.103.138   ks-master-1   <none>           <none>
kubesphere-logging-system      ks-events-operator-c7cbd9495-vl8gf                             1/1     Running            1 (29m ago)        4d      10.233.103.134   ks-master-1   <none>           <none>
kubesphere-logging-system      ks-events-ruler-85697c5545-6s5z6                               2/2     Running            2 (30m ago)        4d      10.233.102.139   ks-master-2   <none>           <none>
kubesphere-logging-system      ks-events-ruler-85697c5545-fksnk                               2/2     Running            2 (29m ago)        4d      10.233.103.130   ks-master-1   <none>           <none>
kubesphere-logging-system      kube-auditing-operator-6d494f5965-55fr6                        1/1     Running            2 (28m ago)        4d      10.233.93.33     ks-master-3   <none>           <none>
kubesphere-logging-system      kube-auditing-webhook-deploy-79c7d464fd-mfrb8                  1/1     Running            1 (31m ago)        4d      10.233.93.34     ks-master-3   <none>           <none>
kubesphere-logging-system      kube-auditing-webhook-deploy-79c7d464fd-thtg7                  1/1     Running            1 (30m ago)        4d      10.233.102.143   ks-master-2   <none>           <none>
kubesphere-logging-system      logsidecar-injector-deploy-88fc46d66-lttls                     2/2     Running            2 (29m ago)        4d      10.233.103.141   ks-master-1   <none>           <none>
kubesphere-logging-system      logsidecar-injector-deploy-88fc46d66-mlhf8                     2/2     Running            2 (30m ago)        4d      10.233.93.38     ks-master-3   <none>           <none>
kubesphere-logging-system      opensearch-cluster-data-0                                      1/1     Running            1 (30m ago)        4d1h    10.233.102.136   ks-master-2   <none>           <none>
kubesphere-logging-system      opensearch-cluster-data-1                                      1/1     Running            1 (29m ago)        4d1h    10.233.103.128   ks-master-1   <none>           <none>
kubesphere-logging-system      opensearch-cluster-master-0                                    1/1     Running            1 (30m ago)        4d1h    10.233.93.37     ks-master-3   <none>           <none>
kubesphere-monitoring-system   alertmanager-main-0                                            2/2     Running            2 (31m ago)        4d      10.233.93.42     ks-master-3   <none>           <none>
kubesphere-monitoring-system   alertmanager-main-1                                            2/2     Running            2 (29m ago)        4d      10.233.103.133   ks-master-1   <none>           <none>
kubesphere-monitoring-system   alertmanager-main-2                                            2/2     Running            2 (30m ago)        4d      10.233.102.131   ks-master-2   <none>           <none>
kubesphere-monitoring-system   kube-state-metrics-7f4df45cc5-j6rmm                            3/3     Running            3 (30m ago)        4d      10.233.102.128   ks-master-2   <none>           <none>
kubesphere-monitoring-system   node-exporter-6z75x                                            2/2     Running            2 (30m ago)        4d      172.16.33.23     ks-master-3   <none>           <none>
kubesphere-monitoring-system   node-exporter-c6vhv                                            2/2     Running            2 (29m ago)        4d      172.16.33.16     ks-master-1   <none>           <none>
kubesphere-monitoring-system   node-exporter-gj7qq                                            2/2     Running            2 (30m ago)        4d      172.16.33.22     ks-master-2   <none>           <none>
kubesphere-monitoring-system   notification-manager-deployment-6bd69dcc66-2bl84               2/2     Running            2 (29m ago)        4d      10.233.103.145   ks-master-1   <none>           <none>
kubesphere-monitoring-system   notification-manager-deployment-6bd69dcc66-tcmg5               2/2     Running            3 (29m ago)        4d      10.233.93.45     ks-master-3   <none>           <none>
kubesphere-monitoring-system   notification-manager-operator-69b55cdd9-c2f7q                  2/2     Running            2 (30m ago)        4d      10.233.102.135   ks-master-2   <none>           <none>
kubesphere-monitoring-system   prometheus-k8s-0                                               2/2     Running            2 (29m ago)        4d      10.233.103.132   ks-master-1   <none>           <none>
kubesphere-monitoring-system   prometheus-k8s-1                                               2/2     Running            2 (30m ago)        4d      10.233.93.43     ks-master-3   <none>           <none>
kubesphere-monitoring-system   prometheus-operator-6fb9967754-lqczb                           2/2     Running            2 (29m ago)        4d      10.233.103.142   ks-master-1   <none>           <none>
kubesphere-monitoring-system   thanos-ruler-kubesphere-0                                      2/2     Running            5 (28m ago)        4d      10.233.93.49     ks-master-3   <none>           <none>
kubesphere-monitoring-system   thanos-ruler-kubesphere-1                                      2/2     Running            4 (28m ago)        4d      10.233.102.129   ks-master-2   <none>           <none>
kubesphere-system              ks-apiserver-6485fd9665-q2zht                                  1/1     Running            1 (30m ago)        4d1h    10.233.102.126   ks-master-2   <none>           <none>
kubesphere-system              ks-console-6f77f6f49d-kdvl6                                    1/1     Running            1 (30m ago)        4d1h    10.233.102.144   ks-master-2   <none>           <none>
kubesphere-system              ks-controller-manager-85ccdf5f67-l2x86                         1/1     Running            3 (28m ago)        4d1h    10.233.102.134   ks-master-2   <none>           <none>
kubesphere-system              ks-installer-6674579f54-r9dxz                                  1/1     Running            1 (29m ago)        4d1h    10.233.103.131   ks-master-1   <none>           <none>
kubesphere-system              minio-757c8bc7f-8j9gx                                          1/1     Running            1 (29m ago)        4d1h    10.233.103.144   ks-master-1   <none>           <none>
kubesphere-system              openldap-0                                                     1/1     Running            2 (30m ago)        4d1h    10.233.93.47     ks-master-3   <none>           <none>
```

> **注意：** 如果 Pod 状态不是 Running 请根据本文的续集「异常组件及解决方案」中的内容进行比对处理，文中未涉及的问题可以参考本文的解决思路自行解决。

- 查看 Image 列表

输入以下命令获取在 Kubernetes 集群节点上已经下载的 Image 列表。

```shell
crictl images ls
# 篇幅受限，输出结果略，完整的请看续集
```

至此，我们已经完成了部署 3 台 服务器，复用为 Master 节点 和 Worker 节点的最小化的 Kubernetes 集群和 KubeSphere。我们还通过 KubeSphere 管理控制台和命令行界面查看了集群的状态。

## 6. 总结

本文主要实战演示了在 ARM 版 openEuler 22.03 LTS SP2 服务器上，利用 KubeKey v3.0.10 自动化部署最小化 KubeSphere v3.4.0 和 Kubernetes v1.26.5 高可用集群的详细过程。

部署完成后，我们还利用 KubeSphere 管理控制台和 Kubectl 命令行，查看并验证了 KubeSphere 和 Kubernetes 集群的状态。

概括总结全文主要涉及以下内容：

- openEuler 22.03 LTS SP2 aarch64 操作系统基础配置；
- 操作系统数据盘 LVM 配置、磁盘挂载、数据目录创建；
- KubeKey 下载及创建集群配置文件；
- 利用 KubeKey 自动化部署 KubeSphere 和 Kubernetes 集群；
- 部署完成后的 KubeSphere 和 Kubernetes 集群状态验证。

本文部署环境虽然是基于 **Kunpeng-920** 芯片的 aarch64 版 openEuler 22.03 LTS SP2 ，但是对于 CentOS、麒麟 V10 SP2 等 ARM 版操作系统以及飞腾（FT-2500）等芯片也有一定的借鉴意义。

本文介绍的内容可直接用于研发、测试环境，对于生产环境有一定的参考意义，**绝对不能**直接用于生产环境。

**本文的不完全测试结论：** KubeSphere 和 Kubernetes 基本功能可用，DevOps 功能部分可用，主要问题在构建镜像时 Maven 容器启动异常，**其他插件功能未做验证**。

> **特别说明：** 由于篇幅限制，部署完成后资源开通测试以及本文的核心价值「**解决 ARM 版 KubeSphere 和 Kubernetes 服务组件异常的问题**」小节的内容放到了本文的续集中，请持续关注。
