---
title: '基于 KubeKey 扩容 Kubernetes v1.24 Worker 节点实战'
tag: 'KubeSphere, Kubernetes, KubeKey'
keywords: 'KubeSphere, Kubernetes, KubeKey'
description: '本文主要实战演示了在利用 KubeKey 自动化增加 Worker 节点到已有 Kubernetes 集群的详细过程。'
createTime: '2023-07-19'
author: '老 Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-k8s-v1.24-cover.png'
---

## 前言

### **知识点**

- 定级：**入门级**
- KubeKey 扩容 Worker 节点
- openEuler 操作系统的基本配置
- Kubernets 基本命令

### **实战服务器配置(架构 1:1 复刻小规模生产环境，配置略有不同)**

|   主机名    |      IP      | CPU | 内存 | 系统盘 | 数据盘 |                    用途                    |
| :---------: | :----------: | :-: | :--: | :----: | :----: | :----------------------------------------: |
| ks-master-0 | 192.168.9.91 |  2  |  4   |   50   |  100   |           KubeSphere/k8s-master            |
| ks-master-1 | 192.168.9.92 |  2  |  4   |   50   |  100   |           KubeSphere/k8s-master            |
| ks-master-2 | 192.168.9.93 |  2  |  4   |   50   |  100   |           KubeSphere/k8s-master            |
| ks-worker-0 | 192.168.9.95 |  2  |  4   |   50   |  100   |               k8s-worker/CI                |
| ks-worker-1 | 192.168.9.96 |  2  |  4   |   50   |  100   |                 k8s-worker                 |
| ks-worker-2 | 192.168.9.97 |  2  |  4   |   50   |  100   |                 k8s-worker                 |
|  storage-0  | 192.168.9.81 |  2  |  4   |   50   |  100+  | ElasticSearch/GlusterFS/Ceph/Longhorn/NFS/ |
|  storage-1  | 192.168.9.82 |  2  |  4   |   50   |  100+  |   ElasticSearch/GlusterFS/Ceph/Longhorn    |
|  storage-2  | 192.168.9.83 |  2  |  4   |   50   |  100+  |   ElasticSearch/GlusterFS/Ceph/Longhorn    |
|  registry   | 192.168.9.80 |  2  |  4   |   50   |  200   |              Sonatype Nexus 3              |
|    合计     |      10      | 20  |  40  |  500   | 1100+  |                                            |

### **实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP2 x86_64**

- KubeSphere：**3.3.2**

- Kubernetes：**v1.24.12**

- Containerd：**1.6.4**

- KubeKey: **v3.0.8**

## 本文简介

本文是 **openEuler 22.03 LTS SP2** [基于 KubeKey 扩容 Kubernetes Worker 节点实战](https://mp.weixin.qq.com/s/VrEoTW63uscP36lNknRCBw)一文的更新版。

变更原因及改动说明如下：

- 在后期的实战训练中发现 Kubernetes v1.26 版本过高导致原生**不支持 GlusterFS** 作为后端存储，最后支持的版本是 v1.25 系列。
- KubeKey 有了更新，官方发布了 **v3.0.8** ，支持更多的 Kubernetes 版本。
- 综合考虑，我们选择 **Kubernetes v1.24.12**、**KubeKey v3.0.8** 更新我们的系列文档。
- 文档整体结构稍微做了一些调整，但整体变化不大，只是细节略有差异。

上一期，我们实战讲解了使用 KubeSphere 开发的 KubeKey 工具自动化部署 3 Master 和 1 Worker 的 Kubernetes 集群和 KubeSphere。

本期我们将模拟真实的生产环境演示如何使用 KubeKey 新增 Worker 节点到已有的 Kubernetes 集群 。

## 操作系统基础配置

新增加的 Worker 节点，操作系统基础配置与初始化安装部署时 Worker 节点的配置保持一致。

其他节点配置说明：

- 所有节点都要更新 **/etc/hosts** 文件，在原有内容基础上追加新增加的 Worker 节点的主机名和 IP 对应配置。
- 在 **Master-0** 节点上将 SSH 公钥发送到新增加的 Worker 节点。

### 新增 Worker 节点配置

本文只选取 Worker-1 节点作为演示，其余新增 Worker 节点都按照相同的方式进行配置和设置。

- 配置主机名

```shell
hostnamectl hostname ks-worker-1
```

- 配置服务器时区

配置服务器时区为 **Asia/Shanghai**。

```shell
timedatectl set-timezone Asia/Shanghai
```

验证服务器时区，正确配置如下。

```shell
[root@ks-worker-1 ~]# timedatectl
               Local time: Tue 2023-07-18 11:20:49 CST
           Universal time: Tue 2023-07-18 03:20:49 UTC
                 RTC time: Tue 2023-07-18 03:20:49
                Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

- 配置时间同步

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
systemctl restart chronyd && systemctl enable chronyd
```

验证 chrony 同步状态。

```shell
# 执行查看命令
chronyc sourcestats -v

# 正常的输出结果如下
[root@ks-worker-1 ~]# chronyc sourcestats -v
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
ntp6.flashdance.cx          4   3     7   -503.672     127218    +23ms    15ms
time.cloudflare.com         4   3     7   +312.311  34651.250    +11ms  4357us
ntp8.flashdance.cx          4   4     8   +262.274  10897.487    -15ms  1976us
tick.ntp.infomaniak.ch      4   4     7  -2812.902  31647.234    -34ms  4359us
```

- 配置 hosts 文件

编辑 /etc/hosts 文件，将规划的服务器 IP 和主机名添加到文件中。

```shell
192.168.9.91    ks-master-0
192.168.9.92    ks-master-1
192.168.9.93    ks-master-2
192.168.9.95    ks-worker-0
192.168.9.96    ks-worker-1
192.168.9.97    ks-worker-2
```

- 配置 DNS

```shell
 echo "nameserver 114.114.114.114" > /etc/resolv.conf
```

- 关闭系统防火墙

```shell
systemctl stop firewalld && systemctl disable firewalld
```

- 禁用 SELinux

openEuler 22.03 SP2 最小化安装的系统默认启用了 SELinux，为了减少麻烦，我们所有的节点都禁用 SELinux。

```shell
# 使用 sed 修改配置文件，实现彻底的禁用
sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

# 使用命令，实现临时禁用，这一步其实不做也行，KubeKey 会自动配置
setenforce 0
```

- 安装系统依赖

在所有节点上，以 **root** 用户登陆系统，执行下面的命令为 Kubernetes 安装系统基本依赖包。

```shell
# 安装 Kubernetes 系统依赖包
yum install curl socat conntrack ebtables ipset ipvsadm

# 安装其他必备包，openEuler 也是奇葩了，默认居然都不安装tar，不装的话后面会报错
yum install tar
```

### 集群所有已有节点新增配置

> 注意：本小节为可选配置项，如果你安装部署时没有使用主机名，均使用 IP 模式时，可以忽略本节内容。

- 配置 hosts 文件

编辑 /etc/hosts 文件，将新增的 Worker 节点 IP 和主机名条目更想到文件中。

```ini
192.168.9.91    ks-master-0
192.168.9.92    ks-master-1
192.168.9.93    ks-master-2
192.168.9.95    ks-worker-0
192.168.9.96    ks-worker-1
192.168.9.97    ks-worker-2
```

### Master-0 节点新增配置

本小节为可选配置项，如果你使用纯密码的方式作为服务器远程连接认证方式，可以忽略本节内容。

输入以下命令将 SSH 公钥从 **master-0** 节点发送到其他节点。命令执行时输入 **yes**，以接受服务器的 SSH 指纹，然后在出现提示时输入 **root** 用户的密码。

```shell
ssh-copy-id root@ks-worker-1
ssh-copy-id root@ks-worker-2
```

添加并上传 SSH 公钥后，您现在可以执行下面的命令验证，通过 root 用户连接到所有服务器，无需密码验证。

```shell
[root@ks-master-0 ~]# ssh root@ks-worker-1
# 登陆输出结果 略
```

## 使用 KubeKey 扩容 Worker 节点

接下来我们使用 KubeKey 将新增加的节点加入到 Kubernetes 集群，参考官方说明文档，整个过程比较简单，仅需两步。

- 修改 KubeKey 部署时使用的集群配置文件
- 执行增加节点的命令

### 修改集群配置文件

通过 SSH 登陆到 master-0 节点，切换到原有的 KubeKey 目录，修改原有的集群配置文件，我们实战中使用的名字为 **kubesphere-v3.3.2.yaml**，请根据实际情况修改 。

主要修改点：

- spec.hosts 部分：增加新的 Worker 节点的信息。
- spec.roleGroups.worker 部分：增加新的 Worker 节点的信息

修改后的示例如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: ks-master-0, address: 192.168.9.91, internalAddress: 192.168.9.91, user: root, password: "P@88w0rd"}
  - {name: ks-master-1, address: 192.168.9.92, internalAddress: 192.168.9.92, user: root, privateKeyPath: "~/.ssh/id_ed25519"}
  - {name: ks-master-2, address: 192.168.9.93, internalAddress: 192.168.9.93, user: root, privateKeyPath: "~/.ssh/id_ed25519"}
  - {name: ks-worker-0, address: 192.168.9.95, internalAddress: 192.168.9.95, user: root, privateKeyPath: "~/.ssh/id_ed25519"}
  - {name: ks-worker-1, address: 192.168.9.96, internalAddress: 192.168.9.96, user: root, privateKeyPath: "~/.ssh/id_ed25519"}
  - {name: ks-worker-2, address: 192.168.9.97, internalAddress: 192.168.9.97, user: root, privateKeyPath: "~/.ssh/id_ed25519"}
  roleGroups:
    etcd:
    - ks-master-0
    - ks-master-1
    - ks-master-2
    control-plane:
    - ks-master-0
    - ks-master-1
    - ks-master-2
    worker:
    - ks-worker-0
    - ks-worker-1
    - ks-worker-2
 ....
# 下面的内容保持不变
```

### 使用 KubeKey 增加节点

在增加节点之前，我们再确认一下当前集群的节点信息。

```shell
[root@ks-master-0 kubekey]# kubectl get nodes -o wide
NAME          STATUS   ROLES           AGE    VERSION    INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION                        CONTAINER-RUNTIME
ks-master-0   Ready    control-plane   130m   v1.24.12   192.168.9.91   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-master-1   Ready    control-plane   130m   v1.24.12   192.168.9.92   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-master-2   Ready    control-plane   130m   v1.24.12   192.168.9.93   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-worker-0   Ready    worker          130m   v1.24.12   192.168.9.95   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
```

接下来我们执行下面的命令，使用修改后的配置文件将新增的 Worker 节点加入集群。

```shell
export KKZONE=cn
./kk add nodes -f kubesphere-v3.3.2.yaml
```

> 注意：export KKZONE=cn 一定要先执行，否则会去 DockerHub 上拉取镜像。

上面的命令执行后，首先 kk 会检查部署 Kubernetes 的依赖及其他详细要求。检查合格后，系统将提示您确认安装。输入 **yes** 并按 ENTER 继续部署。

```shell
[root@ks-master-0 kubekey]# ./kk add nodes -f kubesphere-v3.3.2.yaml


 _   __      _          _   __
| | / /     | |        | | / /
| |/ / _   _| |__   ___| |/ /  ___ _   _
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

13:35:51 CST [GreetingsModule] Greetings
13:35:51 CST message: [ks-worker-2]
Greetings, KubeKey!
13:35:52 CST message: [ks-master-2]
Greetings, KubeKey!
13:35:52 CST message: [ks-master-0]
Greetings, KubeKey!
13:35:52 CST message: [ks-master-1]
Greetings, KubeKey!
13:35:53 CST message: [ks-worker-0]
Greetings, KubeKey!
13:35:53 CST message: [ks-worker-1]
Greetings, KubeKey!
13:35:53 CST success: [ks-worker-2]
13:35:53 CST success: [ks-master-2]
13:35:53 CST success: [ks-master-0]
13:35:53 CST success: [ks-master-1]
13:35:53 CST success: [ks-worker-0]
13:35:53 CST success: [ks-worker-1]
13:35:53 CST [NodePreCheckModule] A pre-check on nodes
13:35:57 CST success: [ks-worker-1]
13:35:57 CST success: [ks-worker-2]
13:35:57 CST success: [ks-master-2]
13:35:57 CST success: [ks-master-1]
13:35:57 CST success: [ks-master-0]
13:35:57 CST success: [ks-worker-0]
13:35:57 CST [ConfirmModule] Display confirmation form
+-------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name        | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+-------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| ks-master-0 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     |            |             |                  | CST 13:35:56 |
| ks-master-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     |            |             |                  | CST 13:35:56 |
| ks-master-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     |            |             |                  | CST 13:35:56 |
| ks-worker-0 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     |            |             |                  | CST 13:35:57 |
| ks-worker-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 13:35:52 |
| ks-worker-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 13:35:53 |
+-------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

This is a simple check of your environment.
Before installation, ensure that your machines meet all requirements specified at
https://github.com/kubesphere/kubekey#requirements-and-recommendations

Continue this installation? [yes/no]:
```

安装过程日志输出比较多，为了节省篇幅这里就不展示了。

部署完成需要大约 15 分钟左右，具体看网速和机器配置，本次部署完成耗时 7 分钟。

部署完成后，您应该会在终端上看到类似于下面的输出。提示部署完成的同时，输出中还会显示用户登陆 KubeSphere 的默认管理员用户和密码。

```yaml
...
13:41:39 CST [AutoRenewCertsModule] Generate k8s certs renew script
13:41:40 CST success: [ks-master-1]
13:41:40 CST success: [ks-master-0]
13:41:40 CST success: [ks-master-2]
13:41:40 CST [AutoRenewCertsModule] Generate k8s certs renew service
13:41:42 CST success: [ks-master-1]
13:41:42 CST success: [ks-master-2]
13:41:42 CST success: [ks-master-0]
13:41:42 CST [AutoRenewCertsModule] Generate k8s certs renew timer
13:41:43 CST success: [ks-master-1]
13:41:43 CST success: [ks-master-0]
13:41:43 CST success: [ks-master-2]
13:41:43 CST [AutoRenewCertsModule] Enable k8s certs renew service
13:41:44 CST success: [ks-master-0]
13:41:44 CST success: [ks-master-1]
13:41:44 CST success: [ks-master-2]
13:41:44 CST Pipeline[AddNodesPipeline] execute successfully
```

## 扩容后集群状态验证

### KubeSphere 管理控制台验证集群状态

我们打开浏览器访问 master-0 节点的 IP 地址和端口 **30880**，登陆 KubeSphere 管理控制台的登录页面。

进入集群管理界面，单击左侧「节点」菜单，点击「集群节点」查看 Kubernetes 集群可用节点的详细信息。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-oe-clusters-nodes-6-v1.24.png)

还记得上一期，初始部署集群时只有一个 Worker 节点，「系统组件」中监控组件处于异常状态。加入新的 Worker 节点后，我们验证一下监控组件是否自动恢复正常。

单击左侧「系统组件」菜单，查看已安装组件的详细信息。重点查看监控类别的组件状态，在图中可以看到**监控的 10 个组件**都正常。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-oe-clusters-components-v1.24-ok.png)

### Kubectl 命令行验证集群状态

- 查看集群节点信息

在 master-0 节点运行 kubectl 命令获取 Kubernetes 集群上的可用节点列表。

```shell
kubectl get nodes -o wide
```

在输出结果中可以看到，当前的 Kubernetes 集群有三个可用节点、节点的内部 IP、节点角色、节点的 Kubernetes 版本号、容器运行时及版本号、操作系统类型及内核版本等信息。

```shell
[root@ks-master-0 kubekey]# kubectl get nodes -o wide
NAME          STATUS   ROLES           AGE    VERSION    INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION                        CONTAINER-RUNTIME
ks-master-0   Ready    control-plane   149m   v1.24.12   192.168.9.91   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-master-1   Ready    control-plane   148m   v1.24.12   192.168.9.92   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-master-2   Ready    control-plane   148m   v1.24.12   192.168.9.93   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-worker-0   Ready    worker          148m   v1.24.12   192.168.9.95   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-worker-1   Ready    worker          11m    v1.24.12   192.168.9.96   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
ks-worker-2   Ready    worker          11m    v1.24.12   192.168.9.97   <none>        openEuler 22.03 (LTS-SP2)   5.10.0-153.12.0.92.oe2203sp2.x86_64   containerd://1.6.4
```

- 查看 Pod 列表

输入以下命令获取在 Kubernetes 集群上运行的 Pod 列表，按工作负载在 NODE 上的分布排序。

```shell
kubectl get pods -o wide -A | sort -k 8
```

在输出结果中可以看到， 新增的两个 Worker 节点上已经运行了 5 个必须的基本组件。除此之外，在 worker-1 上，还成功自启动了上一期在 worker-0 启动失败的 **prometheus-k8s-1**。

```shell
[root@ks-master-0 kubekey]# kubectl get pods -o wide -A | sort -k 8
NAMESPACE                      NAME                                               READY   STATUS    RESTARTS      AGE    IP              NODE          NOMINATED NODE   READINESS GATES
kube-system                    kube-scheduler-ks-master-0                         1/1     Running   1 (43m ago)   149m   192.168.9.91    ks-master-0   <none>           <none>
kubesphere-monitoring-system   node-exporter-t9vrm                                2/2     Running   0             142m   192.168.9.91    ks-master-0   <none>           <none>
kube-system                    calico-node-kx4fz                                  1/1     Running   0             148m   192.168.9.91    ks-master-0   <none>           <none>
kube-system                    kube-apiserver-ks-master-0                         1/1     Running   0             149m   192.168.9.91    ks-master-0   <none>           <none>
kube-system                    kube-controller-manager-ks-master-0                1/1     Running   0             149m   192.168.9.91    ks-master-0   <none>           <none>
kube-system                    kube-proxy-sk4hz                                   1/1     Running   0             148m   192.168.9.91    ks-master-0   <none>           <none>
kube-system                    nodelocaldns-h4vmx                                 1/1     Running   0             149m   192.168.9.91    ks-master-0   <none>           <none>
kubesphere-monitoring-system   node-exporter-b57bp                                2/2     Running   0             142m   192.168.9.92    ks-master-1   <none>           <none>
kube-system                    calico-node-qx5qk                                  1/1     Running   0             148m   192.168.9.92    ks-master-1   <none>           <none>
kube-system                    coredns-f657fccfd-8lnd5                            1/1     Running   0             149m   10.233.103.2    ks-master-1   <none>           <none>
kube-system                    coredns-f657fccfd-vtlmx                            1/1     Running   0             149m   10.233.103.1    ks-master-1   <none>           <none>
kube-system                    kube-apiserver-ks-master-1                         1/1     Running   0             148m   192.168.9.92    ks-master-1   <none>           <none>
kube-system                    kube-controller-manager-ks-master-1                1/1     Running   0             148m   192.168.9.92    ks-master-1   <none>           <none>
kube-system                    kube-proxy-728cs                                   1/1     Running   0             148m   192.168.9.92    ks-master-1   <none>           <none>
kube-system                    kube-scheduler-ks-master-1                         1/1     Running   0             148m   192.168.9.92    ks-master-1   <none>           <none>
kube-system                    nodelocaldns-5594x                                 1/1     Running   0             148m   192.168.9.92    ks-master-1   <none>           <none>
kubesphere-monitoring-system   node-exporter-vm9cq                                2/2     Running   0             142m   192.168.9.93    ks-master-2   <none>           <none>
kube-system                    calico-node-rb2cf                                  1/1     Running   0             148m   192.168.9.93    ks-master-2   <none>           <none>
kube-system                    kube-apiserver-ks-master-2                         1/1     Running   0             148m   192.168.9.93    ks-master-2   <none>           <none>
kube-system                    kube-controller-manager-ks-master-2                1/1     Running   0             148m   192.168.9.93    ks-master-2   <none>           <none>
kube-system                    kube-proxy-ndc62                                   1/1     Running   0             148m   192.168.9.93    ks-master-2   <none>           <none>
kube-system                    kube-scheduler-ks-master-2                         1/1     Running   0             148m   192.168.9.93    ks-master-2   <none>           <none>
kube-system                    nodelocaldns-gnbg6                                 1/1     Running   0             148m   192.168.9.93    ks-master-2   <none>           <none>
kubesphere-controls-system     default-http-backend-587748d6b4-57zck              1/1     Running   0             144m   10.233.115.6    ks-worker-0   <none>           <none>
kubesphere-monitoring-system   alertmanager-main-0                                2/2     Running   0             142m   10.233.115.9    ks-worker-0   <none>           <none>
kubesphere-monitoring-system   kube-state-metrics-5b8dc5c5c6-9ng42                3/3     Running   0             142m   10.233.115.8    ks-worker-0   <none>           <none>
kubesphere-monitoring-system   node-exporter-79c6m                                2/2     Running   0             142m   192.168.9.95    ks-worker-0   <none>           <none>
kubesphere-monitoring-system   prometheus-operator-66d997dccf-zfdf5               2/2     Running   0             142m   10.233.115.7    ks-worker-0   <none>           <none>
kubesphere-system              ks-console-7f88c4fd8d-b4wdr                        1/1     Running   0             144m   10.233.115.5    ks-worker-0   <none>           <none>
kubesphere-system              ks-installer-559fc4b544-pcdrn                      1/1     Running   0             148m   10.233.115.3    ks-worker-0   <none>           <none>
kube-system                    calico-kube-controllers-f9f9bbcc9-9x49n            1/1     Running   0             148m   10.233.115.2    ks-worker-0   <none>           <none>
kube-system                    calico-node-kvfbg                                  1/1     Running   0             148m   192.168.9.95    ks-worker-0   <none>           <none>
kube-system                    kube-proxy-qdmkb                                   1/1     Running   0             148m   192.168.9.95    ks-worker-0   <none>           <none>
kube-system                    nodelocaldns-d572z                                 1/1     Running   0             148m   192.168.9.95    ks-worker-0   <none>           <none>
kube-system                    snapshot-controller-0                              1/1     Running   0             146m   10.233.115.4    ks-worker-0   <none>           <none>
kubesphere-controls-system     kubectl-admin-5d588c455b-7bw75                     1/1     Running   0             139m   10.233.115.19   ks-worker-0   <none>           <none>
kubesphere-monitoring-system   alertmanager-main-1                                2/2     Running   0             142m   10.233.115.10   ks-worker-0   <none>           <none>
kubesphere-monitoring-system   alertmanager-main-2                                2/2     Running   0             142m   10.233.115.11   ks-worker-0   <none>           <none>
kubesphere-monitoring-system   notification-manager-deployment-6f8c66ff88-mqmxx   2/2     Running   0             140m   10.233.115.16   ks-worker-0   <none>           <none>
kubesphere-monitoring-system   notification-manager-deployment-6f8c66ff88-pjm79   2/2     Running   0             140m   10.233.115.15   ks-worker-0   <none>           <none>
kubesphere-monitoring-system   notification-manager-operator-6455b45546-kgdpf     2/2     Running   0             141m   10.233.115.13   ks-worker-0   <none>           <none>
kubesphere-monitoring-system   prometheus-k8s-0                                   2/2     Running   0             142m   10.233.115.14   ks-worker-0   <none>           <none>
kubesphere-system              ks-apiserver-7ddfccbb94-kd7tg                      1/1     Running   0             144m   10.233.115.18   ks-worker-0   <none>           <none>
kubesphere-system              ks-controller-manager-6cd89786dc-4xnhq             1/1     Running   1 (43m ago)   144m   10.233.115.17   ks-worker-0   <none>           <none>
kube-system                    openebs-localpv-provisioner-7497b4c996-ngnv9       1/1     Running   1 (43m ago)   148m   10.233.115.1    ks-worker-0   <none>           <none>
kube-system                    haproxy-ks-worker-0                                1/1     Running   1 (10m ago)   148m   192.168.9.95    ks-worker-0   <none>           <none>

kubesphere-monitoring-system   node-exporter-2jntq                                2/2     Running   0             11m    192.168.9.96    ks-worker-1   <none>           <none>
kubesphere-monitoring-system   prometheus-k8s-1                                   2/2     Running   0             81m    10.233.120.2    ks-worker-1   <none>           <none>
kube-system                    calico-node-4bwx9                                  1/1     Running   0             11m    192.168.9.96    ks-worker-1   <none>           <none>
kube-system                    haproxy-ks-worker-1                                1/1     Running   0             11m    192.168.9.96    ks-worker-1   <none>           <none>
kube-system                    kube-proxy-tgn54                                   1/1     Running   0             11m    192.168.9.96    ks-worker-1   <none>           <none>
kube-system                    nodelocaldns-mmcpk                                 1/1     Running   0             11m    192.168.9.96    ks-worker-1   <none>           <none>

kubesphere-monitoring-system   node-exporter-hslhs                                2/2     Running   0             11m    192.168.9.97    ks-worker-2   <none>           <none>
kube-system                    calico-node-27jxb                                  1/1     Running   0             11m    192.168.9.97    ks-worker-2   <none>           <none>
kube-system                    haproxy-ks-worker-2                                1/1     Running   0             11m    192.168.9.97    ks-worker-2   <none>           <none>
kube-system                    kube-proxy-qjhq2                                   1/1     Running   0             11m    192.168.9.97    ks-worker-2   <none>           <none>
kube-system                    nodelocaldns-2ttp8                                 1/1     Running   0             11m    192.168.9.97    ks-worker-2   <none>           <none>
```

- 查看 Image 列表

输入以下命令查看在 Worker 节点上已经下载的 Image 列表。

```shell
crictl images ls
```

在新增的 Worker 节点执行，输出结果如下：

```shell
# Worker-1
[root@ks-worker-1 ~]# crictl images ls
IMAGE                                                                      TAG                 IMAGE ID            SIZE
registry.cn-beijing.aliyuncs.com/kubesphereio/cni                          v3.23.2             a87d3f6f1b8fd       111MB
registry.cn-beijing.aliyuncs.com/kubesphereio/coredns                      1.8.6               a4ca41631cc7a       13.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy                      2.3                 0ea9253dad7c0       38.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache           1.15.12             5340ba194ec91       42.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers             v3.23.2             ec95788d0f725       56.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                   v1.24.12            562ccc25ea629       39.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy              v0.11.0             29589495df8d9       19.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils                  3.3.0               e88cfb3a763b9       26.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter                v1.3.1              1dbe0e9319764       10.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node                         v3.23.2             a3447b26d32c7       77.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pause                        3.7                 221177c6082a8       311kB
registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol           v3.23.2             b21e2d7408a79       8.67MB
registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader   v0.55.1             7c63de88523a9       4.84MB
registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus                   v2.34.0             e3cf894a63f55       78.1MB

# Worker-2
[root@ks-worker-2 ~]# crictl images ls
IMAGE                                                              TAG                 IMAGE ID            SIZE
registry.cn-beijing.aliyuncs.com/kubesphereio/cni                  v3.23.2             a87d3f6f1b8fd       111MB
registry.cn-beijing.aliyuncs.com/kubesphereio/coredns              1.8.6               a4ca41631cc7a       13.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy              2.3                 0ea9253dad7c0       38.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache   1.15.12             5340ba194ec91       42.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers     v3.23.2             ec95788d0f725       56.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy           v1.24.12            562ccc25ea629       39.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy      v0.11.0             29589495df8d9       19.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter        v1.3.1              1dbe0e9319764       10.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node                 v3.23.2             a3447b26d32c7       77.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pause                3.7                 221177c6082a8       311kB
registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol   v3.23.2             b21e2d7408a79       8.67MB
```

> 注意：Worker-1 节点的 Image 初始数量为 **14** 个，Worker-2 节点的 Image 初始数量为 **11** 个。

至此，我们完成了在已有三个 Master 节点和一个 Worker 节点的 Kubernetes 集群中增加 2 个 Worker 节点的全部任务。

## 结束语

本文主要实战演示了在利用 KubeKey 自动化增加 Worker 节点到已有 Kubernetes 集群的详细过程。

本文的操作虽然是基于 **openEuler 22.03 LTS SP2**，但是整个操作流程同样适用于其他操作系统利用 KubeKey 部署的 Kubernetes 集群的扩容。
