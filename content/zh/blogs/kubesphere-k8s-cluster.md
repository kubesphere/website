---
title: 'Kubernetes 生产环境集群安装实践'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, 集群安装, 最佳实践 '
description: '基于 KubeSphere 部署的 Kubernetes，后续的很多功能实现都依托于 KubeSphere。适用于中小规模 (<=50) 的 K8s 生产环境，大型环境有待验证。'
createTime: '2022-01-21'
author: '张延英'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-K8s-cluster.png'
---

> 作者：张延英，电信系统集成公司山东分公司运维架构师，云原生爱好者，目前专注于云原生运维

## 前提说明

- 本系列文档适用于中小规模 (<=50) 的 K8s 生产环境，大型环境没有经验，有待验证

- 所有节点采用云上虚拟机的方式部署

- 本系列文档没考虑 K8s 安全配置，安全要求高的环境不适用，后续会补充完善

- 本系列文档属于实践之路上的积累，会不断根据线上遇到的问题进行优化改进

- 本系列文档基于 KubeSphere 部署的 Kubernetes，后续的很多功能实现都依托于 KubeSphere

- 本系列文档涉及的 Ansible 代码可以在 [https://gitee.com/zdevops/cloudnative]( "https://gitee.com/zdevops/cloudnative") 获取

## [KubeSphere 简介](https://kubesphere.io/zh/ "KubeSphere 简介")

### 全栈的 K8s 容器云 PaaS 解决方案

KubeSphere 是在 K8s 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。

1. 完全开源

   通过 CNCF 一致性认证的 K8s 平台，100% 开源，由社区驱动与开发

2. 简易安装

   支持部署在任何基础设施环境，提供在线与离线安装，支持一键升级与扩容集群

3. 功能丰富

   在一个平台统一纳管 DevOps、云原生可观测性、服务网格、应用生命周期、多租户、多集群、存储与网络

4. 模块化 & 可插拔

   平台中的所有功能都是可插拔与松耦合，您可以根据业务场景可选安装所需功能组件

### 选型理由 (从运维的角度考虑)

- **安装简单，使用简单**
- 具备构建一站式企业级的 DevOps 架构与可视化运维能力 (省去自己用开源工具手工搭建积木)
- 提供从平台到应用维度的日志、监控、事件、审计、告警与通知，实现集中式与多租户隔离的可观测性
- 简化应用的持续集成、测试、审核、发布、升级与弹性扩缩容
- 为云原生应用提供基于微服务的灰度发布、流量管理、网络拓扑与追踪
- 提供易用的界面命令终端与图形化操作面板，满足不同使用习惯的运维人员
- 可轻松解耦，避免厂商绑定

## 部署架构图

![](https://pek3b.qingstor.com/kubesphere-community/images/k8s-on-kubesphere.svg)

## 节点规划

### 软件版本

- 操作系统版本：centos7.9
- kubesphere: v3.1.1
- KubeKey 版本：v1.1.1
- Kubernetes 版本：v1.20.4
- Docker 版本：v19.03.15

### 规划说明

- K8s 集群规划

  - 负载均衡
    - 2 节点，HAProxy，使用 keepalived 实现高可用
  - Master 节点：3 节点，部署 KubeSphere 和 K8s 的管理组件，etcd 等服务
    - **本方案并没有把 etcd 单独部署，有条件或是规模较大的场景可以单独部署 etcd**
  - Worker 节点：6 节点，部署应用，根据实际需求决定数量

- 存储集群

  - 3 节点，GlusterFS
  - 每个节点 1T 数据盘

- 中间件集群

  - 在 K8s 集群之外，独立部署的常见中间件
  - nginx 代理节点，使用 keepalived 实现高可用，不采用 Ingress
  - MySQL 数据库，主从架构，中小规模使用，大规模需要专业运维人员或是使用云上成熟的产品，最好使用云服务商的产品
  - Ansible，单独的自动化运维管理节点，执行日常批量运维管理操作
  - Gitlab，运维代码管理，实现 Gitops
  - Harbor，镜像仓库
  - Elasticsearch，3 节点，存储日志
  - Prometheus，单独部署，用于 K8s 集群和 pod 的监控
  - Redis 集群，3 节点哨兵模式，该集群暂时还是部署在 K8s 上，后期考虑单独部署，因此预先规划预留机器，建议考虑云服务商的产品
  - RocketMQ 集群，3 节点，该集群暂时还是部署在 K8s 上，后期考虑单独部署，因此预先规划预留机器，建议考虑云服务上的产品

- 网络规划：我们网络要求比较多。因此，不同功能模块，规划了不同的网段，各位可根据需求合理规划

  |   功能域   |      网段       |                  说明                   |
  | :--------: | :-------------: | :-------------------------------------: |
  |  K8s 集群  | 192.168.9.0/24  |          K8s 集群内部节点使用           |
  |  存储集群  | 192.168.10.0/24 |          存储集群内部节点使用           |
  | 中间件集群 | 192.168.11.0/24 | 独立在 K8s 集群外的，各种中间件节点使用 |

#### 存储选型说明：

1. 候选者

   | 存储方案  |             优点             |                  缺点                  |                                           说明                                            |
   | :-------: | :--------------------------: | :------------------------------------: | :---------------------------------------------------------------------------------------: |
   |   Ceph    |            资源多            | 没有 Ceph 集群故障处理能力，最好不要碰 | 曾经，经历过 3 副本全部损坏数据丢失的惨痛经历，因此没有能力处理各种故障之前不会再轻易选择 |
   | GlusterFS | 部署、维护简单；多副本高可用 |                 资料少                 |                      部署和维护简单，出了问题找回数据的可能性大一些                       |
   |    NFS    |           使用广泛           |             单点、网络抖动             |             据说生产环境用的很多，但是单点和网络抖动风险，隐患不小，暂不考虑              |
   |   MinIO   |                              |                                        |                           官宣全球领先的对象存储先锋，还未实践                            |
   | Longhorn  |                              |                                        |                        官宣企业级云原生容器存储解决方案，还未实践                         |

2. 入选者 (第一季)

   **GlusterFS**

3. 说明

   - 以上方案为初期初选，属于摸着石头过河，选一个先用着，后期根据运行情况再重新调整。
   - 大家请根据自己的存储需求和团队运维能力选择适合的方案。
   - 因为我们的业务场景对于持久化存储的需求也就是存放一些 log 日志，能承受一定的数据损失，因此综合选择了 GlusterFS。
   - 存储规划中假设 1T 数据满足需求，没考虑扩容，后续会做补充。

### K8s 集群节点规划

| 节点角色 |    主机名    | CPU(核) | 内存 (GB) | 系统盘 (GB) | 数据盘 (GB) |           IP            |            备注            |
| -------- | :----------: | :-----: | :-------: | :---------: | :---------: | :---------------------: | :------------------------: |
| 负载均衡 |  k8s-slb-0   |    2    |     4     |     50      |             | 192.168.9.2/192.168.9.1 |                            |
| 负载均衡 |  k8s-slb-1   |    2    |     4     |     50      |             | 192.168.9.3/192.168.9.1 |                            |
| Master   | k8s-master-0 |    8    |    32     |     50      |     500     |       192.168.9.4       |                            |
| Master   | k8s-master-1 |    8    |    32     |     50      |     500     |       192.168.9.5       |                            |
| Master   | k8s-master-2 |    8    |    32     |     50      |     500     |       192.168.9.6       |                            |
| Worker   |  k8s-node-0  |    8    |    32     |     50      |     500     |       192.168.9.7       |                            |
| Worker   |  k8s-node-1  |    8    |    32     |     50      |     500     |       192.168.9.8       |                            |
| Worker   |  k8s-node-2  |    8    |    32     |     50      |     500     |       192.168.9.9       |                            |
| Worker   |  k8s-node-3  |    8    |    32     |     50      |     500     |      192.168.9.10       |                            |
| Worker   |  k8s-node-4  |    8    |    32     |     50      |     500     |      192.168.9.11       |                            |
| Worker   |  k8s-node-5  |    8    |    32     |     50      |     500     |      192.168.9.12       |                            |
| Worker   |  k8s-node-n  |    8    |    32     |     50      |     500     |           ...           | 根据自己的业务需求增加节点 |

### 存储集群节点规划

| 节点角色 |      主机名      | CPU(核) | 内存 (GB) | 系统盘 (GB) | 数据盘 (GB) |      IP      | 备注 |
| :------: | :--------------: | :-----: | :-------: | :---------: | :---------: | :----------: | :--: |
| 存储节点 | glusterfs-node-0 |    4    |    16     |     50      |    1000     | 192.168.10.1 |      |
| 存储节点 | glusterfs-node-1 |    4    |    16     |     50      |    1000     | 192.168.10.2 |      |
| 存储节点 | glusterfs-node-2 |    4    |    16     |     50      |    1000     | 192.168.10.3 |      |

### 中间件节点规划

|   节点角色    |   主机名   | CPU(核) | 内存 (GB) | 系统盘 (GB) | 数据盘 (GB) |            IP             |             备注             |
| :-----------: | :--------: | :-----: | :-------: | :---------: | :---------: | :-----------------------: | :--------------------------: |
|  nginx 代理   |  nginx-0   |    4    |    16     |     50      |             | 192.168.11.2/192.168.11.1 | 自建域名网关，不采用 Ingress |
|  nginx 代理   |  nginx-1   |    4    |    16     |     50      |             | 192.168.11.3/192.168.11.1 | 自建域名网关，不采用 Ingress |
|   MySQL-主    | db-master  |    4    |    16     |     50      |     500     |       192.168.11.4        |                              |
|   MySQL-从    |  db-slave  |    4    |    16     |     50      |     500     |       192.168.11.5        |                              |
| Elasticsearch | elastic-0  |    4    |    16     |     50      |    1000     |       192.168.11.6        |                              |
| Elasticsearch | elastic-1  |    4    |    16     |     50      |    1000     |       192.168.11.7        |                              |
| Elasticsearch | elastic-2  |    4    |    16     |     50      |    1000     |       192.168.11.8        |                              |
|  自动化运维   |  ansible   |    2    |     4     |     50      |             |       192.168.11.9        | 安装 ansible，用于自动化运维 |
|   配置管理    |   harbor   |    4    |    16     |     50      |     500     |       192.168.11.10       |    安装 gitlab 和 harbor     |
|  Prometheus   |  monitor   |    4    |    16     |     50      |     500     |       192.168.11.11       |                              |
|     Redis     |  redis-0   |    4    |    16     |     50      |     200     |       192.168.11.12       |             预留             |
|     Redis     |  redis-1   |    4    |    16     |     50      |     200     |       192.168.11.13       |             预留             |
|     Redis     |  redis-2   |    4    |    16     |     50      |     200     |       192.168.11.14       |             预留             |
|   RocketMQ    | rocketmq-0 |    4    |    16     |     50      |     200     |       192.168.11.15       |             预留             |
|   RocketMQ    | rocketmq-1 |    4    |    16     |     50      |     200     |       192.168.11.16       |             预留             |
|   RocketMQ    | rocketmq-2 |    4    |    16     |     50      |     200     |       192.168.11.17       |             预留             |

## K8s 集群服务器基础配置

### 操作系统基础配置

- 以下操作在 K8s 集群的 Master 和 Worker 节点均执行
- 以下操作为了文档需要采用的手工命令的方式，实践中都采用的 Ansible 进行的自动化配置

1. 关闭防火墙和 SELinux

   本环境没有考虑更多的安全配置，因此关闭了防火墙和 SELinux，有更高安全要求的环境不需要关闭，而是需要进行更多的安全配置。

   ```bash
   [root@k8s-master-0 ~]# systemctl stop firewalld && systemctl disable firewalld
   [root@k8s-master-0 ~]# sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
   ```

2. 配置主机名

   `hostnamectl set-hostname **规划的主机名**`

3. 配置主机名解析（可选）

4. 挂载数据盘

   ```bash
   # 查看数据盘盘符
   [root@k8s-master-0 ~]# lsblk
   NAME MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
   vda 253:0 0 40G 0 disk
   ├─vda1 253:1 0 4G 0 part
   └─vda2 253:2 0 36G 0 part /
   vdb 253:16 0 500G 0 disk

   # 分区
   [root@k8s-master-0 ~]# fdisk /dev/vdb
   n
   p
   一路回车
   ....
   w

   # 格式化文件系统 (可选 ext4 或是 xfs)
   [root@k8s-master-0 ~]# mkfs.ext4 /dev/vdb1

   # 创建挂载目录
   [root@k8s-master-0 ~]# mkdir /data

   # 挂载磁盘
   [root@k8s-master-0 ~]# mount /dev/vdb1 /data

   # 开机自动挂载
   [root@k8s-master-0 ~]# echo '/dev/vdb1       /data   ext4    defaults        0 0' >> /etc/fstab
   ```

5. 更新操作系统并重启

   ```bash
   [root@k8s-master-0 ~]# yum update
   [root@k8s-master-0 ~]# reboot
   ```

6. 安装依赖软件包

   ```bash
   [root@k8s-master-0 ~]# yum install socat conntrack ebtables ipset
   ```

### 基本的安全配置

基线加固配置

- 每个企业的基线扫描标准和工具不尽相同，因此本节内容请自行根据漏扫报告的整改要求进行配置
- 如有有需要，后期可以分享我们使用的基线加固的自动化配置脚本

### Docker 安装配置

容器运行时，我们生产环境保守的选择了 19.03 版本的 Docker，安装时选择最新版的即可

1. 配置 Docker yum 源

   ```bash
   [root@k8s-master-0 ~]# vi /etc/yum.repods.d/docker.repo

   [docker-ce-stable]
   baseurl=https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/$releasever/$basearch/stable
   gpgcheck=1
   gpgkey=https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/gpg
   enabled=1

   [root@k8s-master-0 ~]# yum clean all
   [root@k8s-master-0 ~]# yum makecache
   ```

2. 创建 Docker 的配置文件目录和配置文件

   ```bash
   [root@k8s-master-0 ~]# mkdir -p /etc/docker/

   [root@k8s-master-0 ~]# vi /etc/docker/daemon.json

   {
     "data-root": "/data/docker",
     "registry-mirrors":["https://docker.mirrors.ustc.edu.cn"],
     "log-opts": {
       "max-size": "5m",
       "max-file":"3"
     },
     "exec-opts": ["native.cgroupdriver=systemd"]
   }
   ```

3. 安装 Docker

   ```bash
   [root@k8s-master-0 ~]# yum install  docker-ce-19.03.15-3.el7  docker-ce-cli-19.03.15-3.el7 -y
   ```

4. 启动服务并设置开机自启动

   ```bash
   [root@k8s-master-0 ~]# systemctl restart docker.service && systemctl enable docker.service
   ```

5. 验证

   ```bash
   [root@k8s-master-0 ~]# docker version
   Client: Docker Engine - Community
    Version:           19.03.15
    API version:       1.40
    Go version:        go1.13.15
    Git commit:        99e3ed8919
    Built:             Sat Jan 30 03:17:57 2021
    OS/Arch:           linux/amd64
    Experimental:      false

   Server: Docker Engine - Community
    Engine:
     Version:          19.03.15
     API version:      1.40 (minimum version 1.12)
     Go version:       go1.13.15
     Git commit:       99e3ed8919
     Built:            Sat Jan 30 03:16:33 2021
     OS/Arch:          linux/amd64
     Experimental:     false
    containerd:
     Version:          1.4.12
     GitCommit:        7b11cfaabd73bb80907dd23182b9347b4245eb5d
    runc:
     Version:          1.0.2
     GitCommit:        v1.0.2-0-g52b36a2
    docker-init:
     Version:          0.18.0
     GitCommit:        fec3683
   ```

## 安装配置负载均衡

### 三种解决方案

1. 采用公有云或是私有云平台上自带的弹性负载均衡服务

   - 配置监听器监听的端口

     |    服务    | 协议 | 端口  |
     | :--------: | :--: | :---: |
     | apiserver  | TCP  | 6443  |
     | ks-console | TCP  | 30880 |
     |    http    | TCP  |  80   |
     |   https    | TCP  |  443  |

2. 采用 HAProxy 或是 Nginx 自建负载均衡（**此次选择**）

3. 使用 KubeSphere 自带的解决方案部署 HAProxy

   - kubekye v1.2.1 开始支持
   - 参考[使用 KubeKey 内置 HAproxy 创建高可用集群](https://kubesphere.io/zh/docs/installing-on-linux/high-availability-configurations/internal-ha-configuration/ "使用 KubeKey 内置 HAproxy 创建高可用集群")

### 安装配置

1. 安装软件包 (所有负载均衡节点)

   `[root@k8s-master-0 ~]# yum install haproxy keepalived`

2. 配置 HAproxy(所有负载均衡节点，配置相同)

   - 编辑配置文件

     ```bash
     [root@k8s-master-0 ~]# vi /etc/haproxy/haproxy.cfg
     ```

   - 配置示例

     ```yaml
     global
         log /dev/log  local0 warning
         chroot      /var/lib/haproxy
         pidfile     /var/run/haproxy.pid
         maxconn     4000
         user        haproxy
         group       haproxy
         daemon

        stats socket /var/lib/haproxy/stats

     defaults
       log global
       option  httplog
       option  dontlognull
             timeout connect 5000
             timeout client 50000
             timeout server 50000

     frontend kube-apiserver
       bind *:6443
       mode tcp
       option tcplog
       default_backend kube-apiserver

     backend kube-apiserver
         mode tcp
         option tcplog
         option tcp-check
         balance roundrobin
         default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100
         server kube-apiserver-1 192.168.9.4:6443 check # Replace the IP address with your own.
         server kube-apiserver-2 192.168.9.5:6443 check # Replace the IP address with your own.
         server kube-apiserver-3 192.168.9.6:6443 check # Replace the IP address with your own.

     frontend ks-console
       bind *:30880
       mode tcp
       option tcplog
       default_backend ks-console

     backend ks-console
         mode tcp
         option tcplog
         option tcp-check
         balance roundrobin
         default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100
         server kube-apiserver-1 192.168.9.4:30880 check # Replace the IP address with your own.
         server kube-apiserver-2 192.168.9.5:30880 check # Replace the IP address with your own.
         server kube-apiserver-3 192.168.9.6:30880 check # Replace the IP address with your own.
     ```

   - 启动服务并设置开机自启动 (所有负载均衡节点)

     ```bash
     [root@k8s-master-0 ~]# systemctl restart haproxy && systemctl enable haproxy
     ```

3. 配置 Keepalived

   - 编辑配置文件 (所有负载均衡节点)

     ```bash
     [root@k8s-master-0 ~]# vi /etc/keepalived/keepalived.conf
     ```

   - LB 节点 1 配置文件示例

     ```yaml
     global_defs {
       notification_email {
       }
       router_id LVS_DEVEL
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
       state MASTER                   # 主服务器的初始状态
       priority 100                   # 优先级主服务器的要高
       interface eth0                 # 网卡名称，根据实际情况替换
       virtual_router_id 60
       advert_int 1
       authentication {
         auth_type PASS
         auth_pass 1111
       }
       unicast_src_ip 192.168.9.2      # 本机eth0网卡的IP地址
       unicast_peer {
         192.168.9.3                   # SLB节点2的IP地址
       }

       virtual_ipaddress {
         192.168.9.1/24               # VIP地址
       }

       track_script {
         chk_haproxy
       }
     }

     ```

   - LB 节点 2 配置文件示例

     ```yaml
     global_defs {
       notification_email {
       }
       router_id LVS_DEVEL
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
       state BACKUP                   # 从服务器的初始状态
       priority 99                    # 优先级,从服务器的低于主服务器的值
       interface eth0                 # 网卡名称，根据实际情况替换
       virtual_router_id 60
       advert_int 1
       authentication {
         auth_type PASS
         auth_pass 1111
       }
       unicast_src_ip 192.168.9.3      # 本机eth0网卡的IP地址
       unicast_peer {
         192.168.9.2                   # SLB节点1的IP地址
       }

       virtual_ipaddress {
         192.168.9.1/24                # VIP地址
       }

       track_script {
         chk_haproxy
       }
     }
     ```

   - 启动服务并设置开机自启动 (所有负载均衡节点)

     ```bash
     [root@k8s-master-0 ~]# systemctl restart keepalived && systemctl enable keepalived
     ```

4. 验证

   - 查看 vip(在负载均衡节点)

     ```bash
     [root@k8s-slb-0 ~]# ip a s
     1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
         link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
         inet 127.0.0.1/8 scope host lo
            valid_lft forever preferred_lft forever
         inet6 ::1/128 scope host
            valid_lft forever preferred_lft forever
     2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
         link/ether 52:54:9e:27:38:c8 brd ff:ff:ff:ff:ff:ff
         inet 192.168.9.2/24 brd 192.168.9.255 scope global noprefixroute dynamic eth0
            valid_lft 73334sec preferred_lft 73334sec
         inet 192.168.9.1/24 scope global secondary eth0
            valid_lft forever preferred_lft forever
         inet6 fe80::510e:f96:98b2:af40/64 scope link noprefixroute
            valid_lft forever preferred_lft forever
     ```

   - 验证 vip 的连通性（在 k8s-master 其他节点）

     ```bash
     [root@k8s-master-0 ~]# ping -c 4 192.168.9.1
     PING 192.168.9.1 (192.168.9.1) 56(84) bytes of data.
     64 bytes from 192.168.9.1: icmp_seq=1 ttl=64 time=0.664 ms
     64 bytes from 192.168.9.1: icmp_seq=2 ttl=64 time=0.354 ms
     64 bytes from 192.168.9.1: icmp_seq=3 ttl=64 time=0.339 ms
     64 bytes from 192.168.9.1: icmp_seq=4 ttl=64 time=0.304 ms

     --- 192.168.9.1 ping statistics ---
     4 packets transmitted, 4 received, 0% packet loss, time 3000ms
     rtt min/avg/max/mdev = 0.304/0.415/0.664/0.145 ms
     ```

## KubeSphere 安装 K8s

1. 下载 KubeKey

   KubeKey 安装在了 master-0 节点，也可以安装在运维管理节点

   ```bash
   # 使用国内环境
   [root@k8s-master-0 ~]# export KKZONE=cn

   # 执行以下命令下载 KubeKey
   [root@k8s-master-0 ~]# curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.1 sh -

   # 为 kk 添加可执行权限 (可选)
   [root@k8s-master-0 ~]# chmod +x kk
   ```

2. 创建包含默认配置的示例配置文件 **config-sample.yaml**

   ```bash
   [root@k8s-master-0 ~]# ./kk create config --with-kubesphere v3.2.1 --with-kubernetes v1.20.4
   ```

   - --with-kubesphere 指定 KubeSphere 版本 v3.2.1
   - --with-kubernetes 指定 Kubernetes 版本 v1.20.4

3. 根据规划，编辑修改配置文件

   - vi config-sample.yaml

     ```yaml
     apiVersion: kubekey.kubesphere.io/v1alpha1
     kind: Cluster
     metadata:
       name: sample
     spec:
       hosts:
       - {name: k8s-master-0, address: 192.168.9.3, internalAddress: 192.168.9.3, user: root, password: P@ssw0rd@123}
       - {name: k8s-master-1, address: 192.168.9.4, internalAddress: 192.168.9.4, user: root, password: P@ssw0rd@123}
       - {name: k8s-master-2, address: 192.168.9.5, internalAddress: 192.168.9.5, user: root, password: P@ssw0rd@123}
       - {name: k8s-node-0, address: 192.168.9.6, internalAddress: 192.168.9.6, user: root, password: P@ssw0rd@123}
       - {name: k8s-node-1, address: 192.168.9.7, internalAddress: 192.168.9.7, user: root, password: P@ssw0rd@123}
       - {name: k8s-node-2, address: 192.168.9.8, internalAddress: 192.168.9.8, user: root, password: P@ssw0rd@123}
       roleGroups:
         etcd:
         - k8s-master-0
         - k8s-master-1
         - k8s-master-2
         control-plane:
         - k8s-master-0
         - k8s-master-1
         - k8s-master-2
         worker:
         - k8s-node-0
         - k8s-node-1
         - k8s-node-0
       controlPlaneEndpoint:
         domain: lb.kubesphere.local
         address: "192.168.9.1"
         port: 6443
       kubernetes:
         version: v1.20.4
         imageRepo: kubesphere
         clusterName: cluster.local
       network:
         plugin: calico
         kubePodsCIDR: 10.233.64.0/18
         kubeServiceCIDR: 10.233.0.0/18
       registry:
         registryMirrors: []
         insecureRegistries: []
       addons: []

     ---
     apiVersion: installer.kubesphere.io/v1alpha1
     kind: ClusterConfiguration

     ....(后面太多都是 KubeSphere 的配置，本文不涉及，先省略)
     ```

   - 重点配置项说明

     - hosts 配置 K8s 集群节点的名字、IP、管理用户、管理用户名

     - roleGroups

       - etcd: etcd 节点名称
       - control-plane: 主节点的名称
       - worker: work 节点的名称

     - controlPlaneEndpoint

       - domain： 负载衡器 IP 对应的域名，一般形式 lb.clusterName
       - address： 负载衡器 IP 地址

     - K8s

       - clusterName： kubernetes 集群的集群名称

4. 安装 KubeSphere 和 Kubernetes 集群

   ```bash
   [root@k8s-master-0 ~]# ./kk create cluster -f config-sample.yaml
   ```

5. 验证安装结果

   - 验证安装过程

     ```bash
     [root@k8s-master-0 ~]# kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
     ```

   - 验证集群状态

     安装完成后，您会看到如下内容：

     ```bash
     #####################################################
     ###              Welcome to KubeSphere!           ###
     #####################################################

     Console: http://192.168.9.2:30880
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

## 参考文档

1. [多节点安装](https://kubesphere.io/zh/docs/installing-on-linux/introduction/multioverview/ "多节点安装")
2. [使用 Keepalived 和 HAproxy 创建高可用 K8s 集群](https://kubesphere.io/zh/docs/installing-on-linux/high-availability-configurations/set-up-ha-cluster-using-keepalived-haproxy/ "使用 Keepalived 和 HAproxy 创建高可用 K8s 集群")

## 后续

下一篇文章将会介绍基于 KubeSphere 的 K8s 生产实践之路-持久化存储之 GlusterFS，敬请期待。
