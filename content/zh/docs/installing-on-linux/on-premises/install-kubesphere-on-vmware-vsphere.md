---
title: "在 VMware vSphere 安装 KubeSphere"
keywords: 'kubernetes, kubesphere, VMware vSphere, installation'
description: 'How to install KubeSphere on VMware vSphere Linux machines'
---

# 在 VMware vSphere 部署高可用的 KubeSphere

对于生产环境，我们需要考虑集群的高可用性。如果关键组件（例如 kube-apiserver，kube-scheduler 和 kube-controller-manager）都在同一主节点上运行，则一旦主节点出现故障，Kubernetes 和 KubeSphere 将不可用。因此，我们需要通过为负载均衡器配置多个主节点来设置高可用性集群。您可以使用任何云负载平衡器或任何硬件负载平衡器（例如F5）。另外，Keepalived 和HAproxy 或 Nginx 也是创建高可用性集群的替代方法。

本教程为您提供了一个示例，说明如何使用 [keepalived + haproxy](https://kubesphere.com.cn/forum/d/1566-kubernetes-keepalived-haproxy) 对 kube-apiserver 进行负载均衡，实现高可用 kubernetes 集群。

## 前提条件

- 请遵循该[指南](https://github.com/kubesphere/kubekey)，确保您已经知道如何将 KubeSphere 与多节点集群一起安装。有关用于安装的 config yaml 文件的详细信息，请参阅多节点安装。本教程重点介绍如何配置负载均衡器。
- 您需要一个 VMware vSphere 帐户来创建VM资源。
- 考虑到数据的持久性，对于生产环境，我们建议您准备持久化存储。若搭建开发和测试，您可以直接使用默认集成的 OpenEBS 准备 LocalPV。

## 部署架构

![部署架构](/images/docs/vsphere/kubesphereOnVsphere-zh-architecture.png)

## 创建主机

本示例创建 9 台 **CentOS Linux release 7.6.1810（Core）**  的虚拟机，默认的最小化安装，每台配置为 2 Core 4 GB 40 G 即可。

| 主机 IP | 主机名称 | 角色 |
| --- | --- | --- |
|10.10.71.214|master1|master1, etcd|
|10.10.71.73|master2|master2, etcd|
|10.10.71.62|master3|master3, etcd|
|10.10.71.75|node1|node|
|10.10.71.76|node2|node|
|10.10.71.79|node3|node|
|10.10.71.67|vip|vip|
|10.10.71.77|lb-0|lb（keepalived + haproxy）|
|10.10.71.66|lb-1|lb（keepalived + haproxy）|

选择可创建的资源池，点击右键-新建虚拟机（创建虚拟机入口请好几个，自己选择）

![0-1-新创](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-1-create-type.png)

选择创建类型，创建新虚拟机。

![0-1-1创建类型](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-create.png)

填写虚拟机名称和存放文件夹。

![0-1-2-name](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-2-name.png)

选择计算资源。

![0-1-3-资源](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-3-resource.png)

选择存储。

![0-1-4-存储](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-4-storage.png)

选择兼容性，这里是 ESXi 7.0 及更高版本。

![0-1-5-兼容性](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-5-compatibility.png)

选择客户机操作系统，Linux CentOS 7 （64 位）。

![0-1-6-系统](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-6-system.png)

自定义硬件，这里操作系统是挂载的 ISO 文件（打开电源时连接），网络是 VLAN71（勾选）。

![0-1-7-硬件](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-7-hardware.png)

在`即将完成`页面上可查看为虚拟机选择的配置。

![0-1-8](/images/docs/vsphere/kubesphereOnVsphere-zh-0-1-8.png)

## 部署 keepalived 和 HAproxy（可选）

生产环境需要单独准备负载均衡器，例如 Nginx、F5、keepalived + HAproxy 这样的私有化部署负载均衡器方案。如果您是准备搭建开发或测试，可以无需准备负载均衡器，则可以跳过此小节。

###  yum 安装

在主机为 lb-0 和 lb-1 中部署 keepalived+haproxy 即IP为10.10.71.77与10.10.71.66的服务器上安装部署haproxy、keepalived、psmisc

```bash
yum install keepalived haproxy psmisc -y
```

### 配置 haproxy

在IP为 10.10.71.77 与 10.10.71.66 的服务器 ，配置 haproxy  (两台 lb 机器配置一致即可，注意后端服务地址)。

Haproxy 配置 /etc/haproxy/haproxy.cfg

```bash
global
    log         127.0.0.1 local2
    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon
    # turn on stats unix socket
    stats socket /var/lib/haproxy/stats
#---------------------------------------------------------------------
# common defaults that all the 'listen' and 'backend' sections will
# use if not designated in their block
#---------------------------------------------------------------------
defaults
    log                     global
    option                  httplog
    option                  dontlognull
    timeout connect         5000
    timeout client          5000
    timeout server          5000
#---------------------------------------------------------------------
# main frontend which proxys to the backends
#---------------------------------------------------------------------
frontend  kube-apiserver
    bind *:6443
    mode tcp
    option tcplog
    default_backend kube-apiserver
#---------------------------------------------------------------------
# round robin balancing between the various backends
#---------------------------------------------------------------------
backend kube-apiserver
    mode tcp
    option tcplog
    balance     roundrobin
    default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100
    server kube-apiserver-1 10.10.71.214:6443 check
    server kube-apiserver-2 10.10.71.73:6443 check
    server kube-apiserver-3 10.10.71.62:6443 check
```



启动之前检查语法是否有问题

```bash
haproxy -f /etc/haproxy/haproxy.cfg -c
```

启动 Haproxy，并设置开机自启动

```bash
systemctl restart haproxy && systemctl enable haproxy
```

停止 Haproxy

```bash
systemctl stop haproxy
```

### 配置 keepalived

主 haproxy 77 lb-0-10.10.71.77 (/etc/keepalived/keepalived.conf)

```bash
global_defs {
notification_email {
}
smtp_connect_timeout 30    #连接超时时间
router_id LVS_DEVEL01 ##相当于给这个服务器起个昵称
vrrp_skip_check_adv_addr
vrrp_garp_interval 0
vrrp_gna_interval 0
}
vrrp_script chk_haproxy {
script "killall -0 haproxy"
interval 2
weight 2
}
vrrp_instance haproxy-vip {
state MASTER  #主服务器 是MASTER
priority 100  #主服务器优先级要比备服务器高
interface ens192                        #实例绑定的网卡
virtual_router_id 60 #定义一个热备组，可以认为这是60号热备组
advert_int 1 #1秒互相通告一次，检查对方死了没。
authentication {
  auth_type PASS #认证类型
  auth_pass 1111 #认证密码  这些相当于暗号
}
unicast_src_ip 10.10.71.77      #当前机器地址
unicast_peer {
  10.10.71.66                       #peer中其它机器地址
}
virtual_ipaddress {
  #vip地址
  10.10.71.67/24
}
track_script {
  chk_haproxy
}
}
```

备 haproxy 66 lb-1-10.10.71.66 (/etc/keepalived/keepalived.conf)
```bash
global_defs {
notification_email {
}
router_id LVS_DEVEL02 ##相当于给这个服务器起个昵称
vrrp_skip_check_adv_addr
vrrp_garp_interval 0
vrrp_gna_interval 0
}
vrrp_script chk_haproxy {
script "killall -0 haproxy"
interval 2
weight 2
}
vrrp_instance haproxy-vip {
state BACKUP #备份服务器 是 backup
priority 90 #优先级要低（把备份的90修改为100）
interface ens192                        #实例绑定的网卡
virtual_router_id 60
advert_int 1
authentication {
  auth_type PASS
  auth_pass 1111
}
unicast_src_ip 10.10.71.66      #当前机器地址
unicast_peer {
  10.10.71.77                         #peer 中其它机器地址
}
virtual_ipaddress {
  #加/24
  10.10.71.67/24
}
track_script {
  chk_haproxy
}
}
```

启动 keepalived，设置开机自启动
```bash
systemctl restart keepalived && systemctl enable keepalived
systemctl stop keepaliv

```

开启 keepalived服务

```bash
systemctl start keepalivedb
```

### 验证可用性

使用 `ip a s` 查看各 lb 节点 vip 绑定情况
```bash
ip a s
```
暂停vip所在节点 haproxy：`systemctl stop haproxy`
```bash
systemctl stop haproxy
```
再次使用 `ip a s ` 查看各 lb 节点 vip 绑定情况，查看 vip 是否发生漂移
```bash
ip a s
```
或者使用 `systemctl status -l keepalived`  命令查看
```bash
systemctl status -l keepalived
```


## 获取安装程序可执行文件

下载可执行安装程序 `kk` 至一台目标机器：

```
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

给 `kk` 授予可执行权限：

```bash
chmod +x kk
```

## 创建多节点集群

您可以使用高级安装来控制自定义参数或创建多节点集群。具体来说，通过指定配置文件来创建集群。

### kubekey 部署 k8s 集群

创建配置文件(一个示例配置文件)|包含 kubesphere 的配置文件

```bash
./kk create config --with-kubesphere v3.0.0 --with-kubernetes v1.17.9
```

> 提示：默认是 Kubernetes 1.17.9，这些 Kubernetes 版本也与 KubeSphere 同时进行过充分的测试： v1.15.12, v1.16.13, v1.17.9 (default), v1.18.6，您可以根据需要指定版本。

#### 集群节点配置

vi ~/config-sample.yaml

```yaml
#vi ~/config-sample.yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: config-sample
spec:
  hosts:
  - {name: master1, address: 10.10.71.214, internalAddress: 10.10.71.214, password: P@ssw0rd!}
  - {name: master2, address: 10.10.71.73, internalAddress: 10.10.71.73, password: P@ssw0rd!}
  - {name: master3, address: 10.10.71.62, internalAddress: 10.10.71.62, password: P@ssw0rd!}
  - {name: node1, address: 10.10.71.75, internalAddress: 10.10.71.75, password: P@ssw0rd!}
  - {name: node2, address: 10.10.71.76, internalAddress: 10.10.71.76, password: P@ssw0rd!}
  - {name: node3, address: 10.10.71.79, internalAddress: 10.10.71.79, password: P@ssw0rd!}
  roleGroups:
    etcd:
    - master1
    - master2
    - master3
    master:
    - master1
    - master2
    - master3
    worker:
    - node1
    - node2
    - node3
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    # vip
    address: "10.10.71.67"                    
    port: "6443"
  kubernetes:
    version: v1.17.9
    imageRepo: kubesphere
    clusterName: cluster.local
    masqueradeAll: false  # masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode. [Default: false]
    maxPods: 110  # maxPods is the number of pods that can run on this Kubelet. [Default: 110]
    nodeCidrMaskSize: 24  # internal network node size allocation. This is the size allocated to each node on your network. [Default: 24]
    proxyMode: ipvs  # mode specifies which proxy mode to use. [Default: ipvs]
  network:
    plugin: calico
    calico:
      ipipMode: Always  # IPIP Mode to use for the IPv4 POOL created at start up. If set to a value other than Never, vxlanMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Always]
      vxlanMode: Never  # VXLAN Mode to use for the IPv4 POOL created at start up. If set to a value other than Never, ipipMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Never]
      vethMTU: 1440  # The maximum transmission unit (MTU) setting determines the largest packet size that can be transmitted through your network. [Default: 1440]
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: []
  addons: [] # add your persistent storage and LoadBalancer plugin configuration here if you have, see https://kubesphere.io/docs/installing-on-linux/introduction/storage-configuration/

···
# 其它配置可以在安装后之后根据需要进行修改
```

#### 持久化存储配置

如本文开头的前提条件所说，对于生产环境，我们建议您准备持久性存储，可参考以下说明进行配置。若搭建开发和测试，您可以直接使用默认集成的 OpenEBS 准备 LocalPV，则可以跳过这小节。

继续编辑上述 `config-sample.yaml` 文件，找到 `[addons]` 字段，这里支持定义任何持久化存储的插件或客户端，如 NFS Client、Ceph、GlusterFS、CSI，您可以根据您自己的持久化存储服务类型，并参考 [持久化存储服务](https://kubesphere.com.cn/docs/installing-on-linux/introduction/storage-configuration/) 中对应的示例 yaml 文件进行设置。

#### 执行创建集群

使用您在上面自定义的配置文件创建集群：

```
./kk create cluster -f config-sample.yaml
```

根据表格的系统依赖的前提条件检查，如果相关依赖都显示 **√**，则可以输入 **yes** 继续执行安装。

#### 验证安装结果

此时可以看到安装日志自动输出，或者可以再打开一个 SSH 手动检查安装日志，然后等待安装成功。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

如果在创建集群，最后返回 `Welcome to KubeSphere` ，则表示已安装成功。

```
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.10.71.214:30880
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
https://kubesphere.io             2020-08-15 23:32:12
#####################################################
```

#### 登录 console 界面

使用上述日志中给定的访问地址进行访问，进入到 KubeSphere 的登陆界面并使用默认账号（用户名 `admin`，密码 `P@88w0rd`）即可登陆平台。

![登录](/images/docs/vsphere/login.png)

![默认界面](/images/docs/vsphere/default.png)

#### 开启可插拔功能组件(可选)

上面的示例演示了默认最小安装的过程。若要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](https://github.com/kubesphere/ks-installer/blob/master/README_zh.md#安装功能组件)了解更多详细信息。
