---
title: 'KubeKey 部署 K8s v1.28.8 实战'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, KubeKey '
description: '本文为大家实战演示如何在 openEuler 22.03 LTS SP3 上，利用 KubeKey 部署一套纯粹的 K8s 集群'
createTime: '2024-05-09'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-deploy-k8s-cover.png'
---

在某些生产环境下，我们仅需要一个原生的 K8s 集群，无需部署 **KubeSphere** 这样的图形化管理控制台。在我们已有的技术栈里，已经习惯了利用 **KubeKey** 部署 KubeSphere 和 K8s 集群。今天，我将为大家实战演示如何在 **openEuler 22.03 LTS SP3** 上，利用 KubeKey 部署一套纯粹的 K8s 集群。

> **实战服务器配置 (架构 1:1 复刻小规模生产环境，配置略有不同)**

|    主机名    |      IP       | CPU  | 内存 | 系统盘 | 数据盘 |    用途    |
| :----------: | :-----------: | :--: | :--: | :----: | :----: | :--------: |
| ksp-master-1 | 192.168.9.131 |  8   |  16  |   40   |  100   | k8s-master |
| ksp-master-2 | 192.168.9.132 |  8   |  16  |   40   |  100   | k8s-master |
| ksp-master-3 | 192.168.9.133 |  8   |  16  |   40   |  100   | k8s-master |
|     合计     |       3       |  24  |  48  |  120   |  300   |            |

> **实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3 x64**

- K8s：**v1.28.8**

- Containerd：**1.7.13**

- KubeKey: **v3.1.1**

## 1. 操作系统基础配置

请注意，以下操作无特殊说明时需在所有服务器上执行。本文只选取 Master-1 节点作为演示，并假定其余服务器都已按照相同的方式进行配置和设置。

### 1.1 配置主机名

```shell
hostnamectl hostname ksp-master-1
```

### 1.2 配置 DNS

```shell
echo "nameserver 114.114.114.114" > /etc/resolv.conf
```

### 1.3 配置服务器时区

- 配置服务器时区为 **Asia/Shanghai**。

```shell
timedatectl set-timezone Asia/Shanghai
```

### 1.4 配置时间同步

- 安装 chrony 作为时间同步软件

```shell
yum install chrony 
```

- 编辑配置文件 `/etc/chrony.conf`，修改 ntp 服务器配置

```shell
vi /etc/chrony.conf

# 删除所有的 pool 配置
pool pool.ntp.org iburst

# 增加国内的 ntp 服务器，或是指定其他常用的时间服务器
pool cn.pool.ntp.org iburst

# 上面的手工操作，也可以使用 sed 自动替换
sed -i 's/^pool pool.*/pool cn.pool.ntp.org iburst/g' /etc/chrony.conf
```

- 重启并设置 chrony 服务开机自启动

```shell
systemctl enable chronyd --now
```

- 验证 chrony 同步状态

```shell
# 执行查看命令
chronyc sourcestats -v

# 正常的输出结果如下
[root@ksp-master-1 ~]# chronyc sourcestats -v
                             .- Number of sample points in measurement set.
                            /    .- Number of residual runs with same sign.
                           |    /    .- Length of measurement set (time).
                           |   |    /      .- Est. clock freq error (ppm).
                           |   |   |      /           .- Est. error in freq.
                           |   |   |     |           /         .- Est. offset.
                           |   |   |     |          |          |   On the -.
                           |   |   |     |          |          |   samples. \
                           |   |   |     |          |          |             |
Name/IP Address            NP  NR  Span  Frequency  Freq Skew  Offset  Std Dev
==============================================================================
111.230.189.174            18  11   977     -0.693      6.795  -1201us  2207us
electrode.felixc.at        18  10   917     +2.884      8.258    -31ms  2532us
tick.ntp.infomaniak.ch     14   7   720     +2.538     23.906  +6176us  4711us
time.cloudflare.com        18   7   913     +0.633      9.026  -2543us  3142us
```

### 1.5 关闭系统防火墙

```shell
systemctl stop firewalld && systemctl disable firewalld
```

### 1.6 禁用 SELinux

openEuler 22.03 SP3 最小化安装的系统默认启用了 SELinux，为了减少麻烦，我们所有的节点都禁用 SELinux。

```bash
# 使用 sed 修改配置文件，实现彻底的禁用
sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

# 使用命令，实现临时禁用，这一步其实不做也行，KubeKey 会自动配置
setenforce 0
```

### 1.7 安装系统依赖

在所有节点，执行下面的命令为 Kubernetes 安装系统基本依赖包。

```shell
# 安装 Kubernetes 系统依赖包
yum install curl socat conntrack ebtables ipset ipvsadm

# 安装 tar 包，不装的话后面会报错。openEuler 也是个奇葩，迭代这么多版本了，默认居然还不安装 tar
yum install tar
```

## 2. 操作系统磁盘配置

服务器新增一块数据盘 **/dev/sdb**，用于 **Containerd** 和 **K8s Pod** 的持久化存储。

为了满足部分用户希望在生产上线后，磁盘容量不足时可以实现动态扩容。本文采用了 LVM 的方式配置磁盘（**实际上，本人维护的生产环境，几乎不用 LVM**）。

请注意，以下操作无特殊说明时需在集群所有节点上执行。本文只选取 **Master-1** 节点作为演示，并假定其余服务器都已按照相同的方式进行配置和设置。

### 2.1 使用 LVM 配置磁盘

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

### 2.2 格式化磁盘

```shell
mkfs.xfs /dev/mapper/data-lvdata
```

### 2.3 磁盘挂载

- 手工挂载

```bash
mkdir /data
mount /dev/mapper/data-lvdata /data/
```

- 开机自动挂载

```bash
tail -1 /etc/mtab >> /etc/fstab
```

### 2.4 创建数据目录

- 创建 **OpenEBS** 本地数据根目录

```bash
mkdir -p /data/openebs/local
```

- 创建 **Containerd** 数据目录

```bash
mkdir -p /data/containerd
```

- 创建 Containerd 数据目录软连接

```bash
ln -s /data/containerd /var/lib/containerd
```

> **说明：** KubeKey 到 v3.1.1 版为止，一直不支持在部署的时候更改 Containerd 的数据目录，只能用这种目录软链接到变通方式来增加存储空间（**也可以提前手工安装 Containerd**）。

## 3. 安装部署 K8s

### 3.1 下载 KubeKey

本文将 **master-1** 节点作为部署节点，把 KubeKey 最新版 (**v3.1.1**) 二进制文件下载到该服务器。具体 KubeKey 版本号可以在 [KubeKey release 页面](https://github.com/kubesphere/kubekey/releases)查看。

- 下载最新版的 KubeKey

```shell
mkdir ~/kubekey
cd ~/kubekey/

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn
curl -sfL https://get-kk.kubesphere.io | sh -
```

- 正确的执行结果如下

```bash
[root@ksp-master-1 ~]# mkdir ~/kubekey
[root@ksp-master-1 ~]# cd ~/kubekey/
[root@ksp-master-1 kubekey]# export KKZONE=cn
[root@ksp-master-1 kubekey]# curl -sfL https://get-kk.kubesphere.io | sh -

Downloading kubekey v3.1.1 from https://kubernetes.pek3b.qingstor.com/kubekey/releases/download/v3.1.1/kubekey-v3.1.1-linux-amd64.tar.gz ...


Kubekey v3.1.1 Download Complete!

[root@ksp-master-1 kubekey]# ll -h
total 114M
-rwxr-xr-x. 1 root root 79M Apr 16 12:30 kk
-rw-r--r--. 1 root root 36M Apr 25 09:37 kubekey-v3.1.1-linux-amd64.tar.gz
```

- 查看 KubeKey 支持的 Kubernetes 版本列表 **`./kk version --show-supported-k8s`**

```shell
[root@ksp-master-1 kubekey]# ./kk version --show-supported-k8s
v1.19.0
......(受限于篇幅，中间的不展示，请读者根据需求查看)
v1.28.0
v1.28.1
v1.28.2
v1.28.3
v1.28.4
v1.28.5
v1.28.6
v1.28.7
v1.28.8
v1.29.0
v1.29.1
v1.29.2
v1.29.3
```

> **说明：** 输出结果为 KubeKey 支持的结果，但不代表 KubeSphere 和其他 K8s 也能完美支持。本文仅用 KubeKey 部署 K8s，所以不用特别考虑版本的兼容性。

KubeKey 支持的 K8s 版本还是比较新的。本文选择 **v1.28.8**，生产环境可以选择 **v1.26.15** 或是其他次要版本是**双数**，补丁版本数超过 **5** 的版本。不建议选择太老的版本了，毕竟 v1.30 都已经发布了。

### 3.2 创建 K8s 集群部署配置文件

1. 创建集群配置文件

本文选择了 K8s **v1.28.8**。因此，指定配置文件名称为 **k8s-v1288.yaml**，如果不指定，默认的文件名为 **config-sample.yaml**。

```bash
./kk create config -f k8s-v1288.yaml --with-kubernetes v1.28.8
```

> **注意：** 生成的默认配置文件内容较多，这里就不做过多展示了，更多详细的配置参数请参考 [官方配置示例](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)。

2. 修改配置文件

本文示例采用 3 个节点同时作为 control-plane、etcd 和 worker 节点。

编辑配置文件 `k8s-v1288.yaml`，主要修改 **kind: Cluster** 小节的相关配置。

修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下。

- hosts：指定节点的 IP、ssh 用户、ssh 密码、ssh 端口
- roleGroups：指定 3 个 etcd、control-plane 节点，复用相同的机器作为 3 个 worker 节点
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- domain：自定义域名 **lb.opsxlab.cn**，没特殊需求可使用默认值 **lb.kubesphere.local**
- clusterName：自定义 **opsxlab.cn**，没特殊需求可使用默认值 **cluster.local**
- autoRenewCerts：该参数可以实现证书到期自动续期，默认为 **true**
- containerManager：使用 **containerd**

修改后的完整示例如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: ksp-master-1, address: 192.168.9.131, internalAddress: 192.168.9.131, user: root, password: "OpsXlab@2024"}
  - {name: ksp-master-2, address: 192.168.9.132, internalAddress: 192.168.9.132, user: root, password: "OpsXlab@2024"}
  - {name: ksp-master-3, address: 192.168.9.133, internalAddress: 192.168.9.133, user: root, password: "OpsXlab@2024"}
  roleGroups:
    etcd:
    - ksp-master-1
    - ksp-master-2
    - ksp-master-3
    control-plane:
    - ksp-master-1
    - ksp-master-2
    - ksp-master-3
    worker:
    - ksp-master-1
    - ksp-master-2
    - ksp-master-3
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers
    internalLoadbalancer: haproxy

    domain: lb.opsxlab.cn
    address: ""
    port: 6443
  kubernetes:
    version: v1.28.8
    clusterName: opsxlab.cn
    autoRenewCerts: true
    containerManager: containerd
  etcd:
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

### 3.3 部署 K8s

接下来我们执行下面的命令，使用上面生成的配置文件部署 K8s。

```shell
export KKZONE=cn
./kk create cluster -f k8s-v1288.yaml
```

上面的命令执行后，首先 KubeKey 会检查部署 K8s 的依赖及其他详细要求。通过检查后，系统将提示您确认安装。输入 **yes** 并按 ENTER 继续部署。

```bash
[root@ksp-master-1 kubekey]# ./kk create cluster -f k8s-v1288.yaml


 _   __      _          _   __
| | / /     | |        | | / /
| |/ / _   _| |__   ___| |/ /  ___ _   _
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

10:45:28 CST [GreetingsModule] Greetings
10:45:28 CST message: [ksp-master-3]
Greetings, KubeKey!
10:45:28 CST message: [ksp-master-1]
Greetings, KubeKey!
10:45:28 CST message: [ksp-master-2]
Greetings, KubeKey!
10:45:28 CST success: [ksp-master-3]
10:45:28 CST success: [ksp-master-1]
10:45:28 CST success: [ksp-master-2]
10:45:28 CST [NodePreCheckModule] A pre-check on nodes
10:45:31 CST success: [ksp-master-3]
10:45:31 CST success: [ksp-master-1]
10:45:31 CST success: [ksp-master-2]
10:45:31 CST [ConfirmModule] Display confirmation form
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name         | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| ksp-master-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 10:45:31 |
| ksp-master-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 10:45:31 |
| ksp-master-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 10:45:31 |
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

This is a simple check of your environment.
Before installation, ensure that your machines meet all requirements specified at
https://github.com/kubesphere/kubekey#requirements-and-recommendations

Continue this installation? [yes/no]:
```

> **注意：** 
>
> -  nfs client、ceph client、glusterfs client 3 个与存储有关的 client 显示没有安装，这个我们后期会在对接存储的实战中单独安装。
> - docker、containerd 会根据配置文件选择的 **containerManager** 类型自动安装。

部署完成需要大约 10-20 分钟左右，具体看网速和机器配置，本次部署完成耗时 20 分钟。

部署完成后，您应该会在终端上看到类似于下面的输出。

```yaml
10:59:25 CST [ConfigureKubernetesModule] Configure kubernetes
10:59:25 CST success: [ksp-master-1]
10:59:25 CST skipped: [ksp-master-2]
10:59:25 CST skipped: [ksp-master-3]
10:59:25 CST [ChownModule] Chown user $HOME/.kube dir
10:59:26 CST success: [ksp-master-3]
10:59:26 CST success: [ksp-master-2]
10:59:26 CST success: [ksp-master-1]
10:59:26 CST [AutoRenewCertsModule] Generate k8s certs renew script
10:59:27 CST success: [ksp-master-2]
10:59:27 CST success: [ksp-master-3]
10:59:27 CST success: [ksp-master-1]
10:59:27 CST [AutoRenewCertsModule] Generate k8s certs renew service
10:59:28 CST success: [ksp-master-3]
10:59:28 CST success: [ksp-master-2]
10:59:28 CST success: [ksp-master-1]
10:59:28 CST [AutoRenewCertsModule] Generate k8s certs renew timer
10:59:29 CST success: [ksp-master-2]
10:59:29 CST success: [ksp-master-3]
10:59:29 CST success: [ksp-master-1]
10:59:29 CST [AutoRenewCertsModule] Enable k8s certs renew service
10:59:29 CST success: [ksp-master-3]
10:59:29 CST success: [ksp-master-2]
10:59:29 CST success: [ksp-master-1]
10:59:29 CST [SaveKubeConfigModule] Save kube config as a configmap
10:59:29 CST success: [LocalHost]
10:59:29 CST [AddonsModule] Install addons
10:59:29 CST success: [LocalHost]
10:59:29 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl get pod -A
```

## 4. 验证 K8s 集群

### 4.1 kubectl 命令行验证集群状态

**本小节只是简单的看了一下基本状态，并不全面，更多的细节大家自己体验探索吧。**

- 查看集群节点信息

在 master-1 节点运行 kubectl 命令获取 K8s 集群上的可用节点列表。

```shell
kubectl get nodes -o wide
```

在输出结果中可以看到，当前的 K8s 集群有三个可用节点、节点的内部 IP、节点角色、节点的 K8s 版本号、容器运行时及版本号、操作系统类型及内核版本等信息。

```shell
[root@ksp-master-1 kubekey]# kubectl get nodes -o wide
NAME           STATUS   ROLES                  AGE     VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION                       CONTAINER-RUNTIME
ksp-master-1   Ready    control-plane,worker   9m43s   v1.28.8   192.168.9.131   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
ksp-master-2   Ready    control-plane,worker   8m8s    v1.28.8   192.168.9.132   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
ksp-master-3   Ready    control-plane,worker   8m9s    v1.28.8   192.168.9.133   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
```

- 查看 Pod 列表

输入以下命令获取在 K8s 集群上运行的 Pod 列表。

```shell
kubectl get pods -o wide -A
```

在输出结果中可以看到， 所有 pod 都在运行。

```shell
[root@ksp-master-1 kubekey]# kubectl get pod -A -o wide
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE     IP              NODE        
kube-system   calico-kube-controllers-64f6cb8db5-fsgnq   1/1     Running   0          4m59s   10.233.84.2     ksp-master-1           
kube-system   calico-node-5hkm4                          1/1     Running   0          4m59s   192.168.9.133   ksp-master-3          
kube-system   calico-node-wqz9s                          1/1     Running   0          4m59s   192.168.9.132   ksp-master-2
kube-system   calico-node-zzr5n                          1/1     Running   0          4m59s   192.168.9.131   ksp-master-1
kube-system   coredns-76dd97cd74-66k8z                   1/1     Running   0          6m22s   10.233.84.1     ksp-master-1
kube-system   coredns-76dd97cd74-94kvl                   1/1     Running   0          6m22s   10.233.84.3     ksp-master-1
kube-system   kube-apiserver-ksp-master-1                1/1     Running   0          6m39s   192.168.9.131   ksp-master-1
kube-system   kube-apiserver-ksp-master-2                1/1     Running   0          4m52s   192.168.9.132   ksp-master-2
kube-system   kube-apiserver-ksp-master-3                1/1     Running   0          5m9s    192.168.9.133   ksp-master-3
kube-system   kube-controller-manager-ksp-master-1       1/1     Running   0          6m39s   192.168.9.131   ksp-master-1
kube-system   kube-controller-manager-ksp-master-2       1/1     Running   0          4m58s   192.168.9.132   ksp-master-2
kube-system   kube-controller-manager-ksp-master-3       1/1     Running   0          5m5s    192.168.9.133   ksp-master-3
kube-system   kube-proxy-2xpq4                           1/1     Running   0          5m3s    192.168.9.131   ksp-master-1
kube-system   kube-proxy-9frmd                           1/1     Running   0          5m3s    192.168.9.133   ksp-master-3
kube-system   kube-proxy-bhg2k                           1/1     Running   0          5m3s    192.168.9.132   ksp-master-2
kube-system   kube-scheduler-ksp-master-1                1/1     Running   0          6m39s   192.168.9.131   ksp-master-1
kube-system   kube-scheduler-ksp-master-2                1/1     Running   0          4m59s   192.168.9.132   ksp-master-2
kube-system   kube-scheduler-ksp-master-3                1/1     Running   0          5m5s    192.168.9.133   ksp-master-3
kube-system   nodelocaldns-gl6dc                         1/1     Running   0          6m22s   192.168.9.131   ksp-master-1
kube-system   nodelocaldns-q45jf                         1/1     Running   0          5m9s    192.168.9.133   ksp-master-3
kube-system   nodelocaldns-rskk5                         1/1     Running   0          5m8s    192.168.9.132   ksp-master-2
```

- 查看 Image 列表

输入以下命令获取在 K8s 集群节点上已经下载的 Image 列表。

```shell
[root@ksp-master-1 kubekey]# crictl images ls
IMAGE                                                                   TAG                 IMAGE ID            SIZE
registry.cn-beijing.aliyuncs.com/kubesphereio/cni                       v3.27.3             6527a35581401       88.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/coredns                   1.9.3               5185b96f0becf       14.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache        1.22.20             ff71cd4ea5ae5       30.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver            v1.28.8             e70a71eaa5605       34.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager   v1.28.8             e5ae3e4dc6566       33.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers          v3.27.3             3e4fd05c0c1c0       33.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                v1.28.8             5ce97277076c6       28.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler            v1.28.8             ad3260645145d       18.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node                      v3.27.3             5c6ffd2b2a1d0       116MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pause                     3.9                 e6f1816883972       321kB
```

至此，我们已经完成了部署 3 台 Master 节点 和 Worker 节点复用的最小化 K8s 集群。

接下来我们将在 K8s 集群上部署一个简单的 Nginx Web 服务器，测试验证 K8s 集群是否正常。

## 5. 部署测试资源

本示例使用命令行工具在 K8s 集群上部署一个 Nginx Web 服务器。

### 5.1 创建 Nginx Deployment

运行以下命令创建一个部署 Nginx Web 服务器的 Deployment。此示例中，我们将创建具有两个副本基于 nginx:alpine 镜像的 Pod。

```shell
kubectl create deployment nginx --image=nginx:alpine --replicas=2
```

### 5.2 创建 Nginx Service

创建一个新的 K8s 服务，服务名称 nginx，服务类型 Nodeport，对外的服务端口 80。

```shell
kubectl create service nodeport nginx --tcp=80:80
```

### 5.3 验证 Nginx Deployment 和 Pod

- 运行以下命令查看创建的 Deployment 和 Pod 资源。

```shell
kubectl get deployment -o wide
kubectl get pods -o wide
```

- 查看结果如下：

```shell
[root@ksp-master-1 kubekey]# kubectl get deployment -o wide
NAME    READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES         SELECTOR
nginx   2/2     2            2           20s   nginx        nginx:alpine   app=nginx

[root@ksp-master-1 kubekey]# kubectl get pods -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP               NODE          NOMINATED NODE   READINESS GATES
nginx-6c557cc74d-tbw9c   1/1     Running   0          23s   10.233.102.187   ksp-master-2   <none>           <none>
nginx-6c557cc74d-xzzss   1/1     Running   0          23s   10.233.103.148   ksp-master-1   <none>           <none>
```

### 5.4 验证 Nginx Service

运行以下命令查看可用的服务列表，在列表中我们可以看到 nginx 服务类型 为 Nodeport，并在 Kubernetes 主机上开放了 **30619** 端口。

```shell
kubectl get svc -o wide
```

查看结果如下:

```shell
[root@ksp-master-1 kubekey]# kubectl get svc -o wide
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE     SELECTOR
kubernetes   ClusterIP   10.233.0.1     <none>        443/TCP        4d22h   <none>
nginx        NodePort    10.233.14.48   <none>        80:30619/TCP   5s      app=nginx
```

### 5.5 验证服务

运行以下命令访问部署的 Nginx 服务，验证服务是否成功部署。

- 验证直接访问 Pod

```shell
curl 10.233.102.187

# 访问结果如下
[root@ks-master-1 ~]# curl 10.233.102.187
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

- 验证访问 Service

```shell
curl 10.233.14.48

# 访问结果同上，略
```

- 验证访问 Nodeport

```shell
curl 192.168.9.131:30619

# 访问结果同上，略
```

## 6. 自动化 Shell 脚本

文章中所有操作步骤，已全部编排为自动化脚本，因篇幅限制，不在此文档中展示。

## 7. 总结

本文分享了在 openEuler 22.03 LTS SP3 操作系统上，如何利用 KubeSphere 开发的工具 **KubeKey**，部署 **K8s v1.28.8** 集群的详细流程及注意事项。

主要内容概括如下：

- openEuler 22.03 LTS SP3 操作系统基础配置
- openEuler 22.03 LTS SP3 操作系统上 LVM 磁盘的创建配置
- 使用 KubeKey 部署 K8s 高可用集群
- K8s 集群部署完成后的验证测试

> **免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！