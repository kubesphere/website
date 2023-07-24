---
title: 'KubeKey 在 AWS 安装部署 Kubernetes 高可用集群'
tag: 'Kubernetes,AWS,亚马逊'
keywords: 'Kubernetes, AWS, KubeKey, 高可用, 亚马逊'
description: 'KubeKey 是一款可以快速、便捷部署高可用 Kubernetes 集群的工具。本文将主要介绍如何在亚马逊 AWS 部署高可用的 Kubernetes 集群。'
createTime: '2021-08-05'
author: '李耀宗'
snapshot: '../../../images/blogs/aws-kubernetes/aws.png'
---

### 介绍

对于生产环境，我们需要考虑 Kubernetes 集群的高可用性。本文教您部署如何在多台 AWS EC2 实例快速部署一套高可用的生产环境。要满足 Kubernetes 集群服务需要做到高可用，需要保证 kube-apiserver 的 HA ，可使用下列两种方式：

* AWS ELB（推荐）
* [keepalived + haproxy](https://ask.kubesphere.io/forum/d/1566-kubernetes-keepalived-haproxy) 对 kube-apiserver 进行负载均衡，实现高可用 Kubernetes 集群。

本教程重点介绍配置 AWS ELB 服务高可用安装。

### 前提条件

- 考虑到数据的持久性，对于生产环境，我们不建议您使用存储OpenEBS，建议 NFS、GlusterFS、Ceph 等存储(需要提前准备)。文章为了进行开发和测试，集成了 OpenEBS 将 LocalPV 设置为默认的存储服务；
- SSH 可以访问所有节点；
- 所有节点的时间同步；
- Red Hat 在其 Linux 发行版本中包括了 SELinux，建议关闭 SELinux 或者将 SELinux 的模式切换为 Permissive [宽容]工作模式。

### 准备主机

本示例创建 3 台 Ubuntu 18.04 server 64bit 的 EC2 云服务器，每台配置为 2 核 4 GB

| 主机IP       | 主机名称 | 角色               |
| :----------- | :------- | :----------------- |
| 192.168.1.10 | master1  | master, node, etcd |
| 192.168.1.11 | master2  | master, node, etcd |
| 192.168.1.12 | master3  | master, node, etcd |

> 注意:本教程仅作部署演示，在生产环境建议角色分离，单独部署 etcd 和 node 节点，提高稳定性。

### 创建VPC

进入AWS控制台，在全部服务中选择VPC，创建一个VPC，配置如下图所示：

![vpc](../../../images/blogs/aws-kubernetes/vpc.png)

### 创建子网

为该VPC创建子网，配置如下图所示：

![subnet](../../../images/blogs/aws-kubernetes/subnet.png)

### 创建互联网网关

选择互联网网关，创建网关并绑定对应的VPC：

![internetGateway](../../../images/blogs/aws-kubernetes/internetGateway.png)

### 配置路由表

配置VPC自动创建的路由表，增加一条`0.0.0.0/0`的路由：

![router](../../../images/blogs/aws-kubernetes/router.png)

### 创建安全组

配置VPC自动创建的默认安全组，设置如下入方向规则：

![safeGroup](../../../images/blogs/aws-kubernetes/safeGroup.png)

### 创建主机

在计算中选择EC2，按如下配置创建三台EC2主机：

* 选择镜像

![selectISO](../../../images/blogs/aws-kubernetes/selectISO.png)

* 选择规格

![selectFlavor](../../../images/blogs/aws-kubernetes/selectFlavor.png)

* 配置对应的VPC和子网

![EC2config](../../../images/blogs/aws-kubernetes/EC2config.png)

* 配置对应安全组

![EC2config2](../../../images/blogs/aws-kubernetes/EC2config2.png)

* EC2主机创建成功后，将一台主机绑定一个弹性IP地址，用于远程终端连接：

![EC2IP](../../../images/blogs/aws-kubernetes/EC2IP.png)

### 创建负载均衡器

选择负载均衡-目标群组，创建负载均衡目标群组，并注册 EC2 主机的`6443`端口：

![targetGroup](../../../images/blogs/aws-kubernetes/targetGroup.png)

* 创建`Network Load Balancer`类型的负载均衡器，并配置对应的 VPC 和子网：

![internalLB1](../../../images/blogs/aws-kubernetes/internalLB1.png)

* 配置监听器监听`6443`端口并连接对应的目标群组：

![internalLB12](../../../images/blogs/aws-kubernetes/internalLB12.png)

### 查询负载均衡器的 IP 地址

选择网络接口，可以看到自动生成的 ELB 网络接口的公有 IP 地址和私有 IP 地址：

![LBIPaddr](../../../images/blogs/aws-kubernetes/LBIPaddr.png)

### 配置 AWS 服务器 SSH 密码登录

依次登录到每台服务器，重置`ubuntu`用户的密码：

```
sudo passwd ubuntu
```

修改 SSH 配置：

```
# 查找 PasswordAuthentication，将 PasswordAuthentication no 修改为： PasswordAuthentication yes
sudo vi /etc/ssh/sshd_config
```

重启 SSH 服务：

```
sudo systemctl restart sshd
```

### 获取 KubeKey 部署程序

从[Github Realese Page](https://github.com/kubesphere/kubekey/releases)下载 KubeKey 或直接使用以下命令：

```
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.0.0 sh -
```

### 使用 KubeyKey 部署

在当前位置创建部署配置文件`config-HA.yaml`:

```
./kk create config -f config-HA.yaml
```

### 集群配置调整

根据当前集群信息修改配置文件内容，有关更多信息，请参见[多节点安装](https://kubesphere.io/zh/docs/installing-on-linux/introduction/multioverview/)和[ Kubernetes 集群配置](https://kubesphere.io/zh/docs/installing-on-linux/introduction/vars/)：

```
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master1, address: 192.168.0.10, internalAddress: 192.168.0.10, user: ubuntu, password: password}
  - {name: master2, address: 192.168.0.11, internalAddress: 192.168.0.11, user: ubuntu, password: password}
  - {name: master3, address: 192.168.0.12, internalAddress: 192.168.0.12, user: ubuntu, password: password}
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
    - master1
    - master2
    - master3
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.0.151"
    port: 6443
  kubernetes:
    version: v1.19.8
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
```

### 执行命令创建集群

```
./kk create cluster -f config-HA.yaml
```

> KubeKey 可能会提示缺少 conntrack，可执行命令安装：`sudo apt-get install conntrack`。

### 检查结果

可执行命令检查部署结果，主要可通过以下命令进行检查：
1. `kubectl get node` 和 `kubectl get po` 两个命令返回的结果中 `STATUS` 的值为 `Ready`则表示集群部署成功且组件运行正常。
2. `kubectl get ep` 命令返回的结果中 `ENDPOINTS` 包含所有控制平面即 `master` 节点的 IP 地址。

```
ubuntu@master1:~$ kubectl get node -owide
NAME      STATUS   ROLES           AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION   CONTAINER-RUNTIME
master1   Ready    master,worker   3m45s   v1.19.8   192.168.0.10   <none>        Ubuntu 18.04.5 LTS   5.4.0-1045-aws   docker://20.10.7
master2   Ready    master,worker   95s     v1.19.8   192.168.0.11   <none>        Ubuntu 18.04.5 LTS   5.4.0-1045-aws   docker://20.10.7
master3   Ready    master,worker   2m      v1.19.8   192.168.0.12   <none>        Ubuntu 18.04.5 LTS   5.4.0-1045-aws   docker://20.10.7

ubuntu@master1:~$ kubectl get po -A
NAMESPACE     NAME                                      READY   STATUS              RESTARTS   AGE
kube-system   calico-kube-controllers-8f59968d4-gchrc   1/1     Running             0          104s
kube-system   calico-node-c65wl                         1/1     Running             0          105s
kube-system   calico-node-kt4qd                         1/1     Running             0          105s
kube-system   calico-node-njxsh                         1/1     Running             0          105s
kube-system   coredns-86cfc99d74-ldx9b                  1/1     Running             0          3m59s
kube-system   coredns-86cfc99d74-pg5lj                  1/1     Running             0          3m59s
kube-system   kube-apiserver-master1                    1/1     Running             0          4m19s
kube-system   kube-apiserver-master2                    1/1     Running             0          115s
kube-system   kube-apiserver-master3                    1/1     Running             0          2m33s
kube-system   kube-controller-manager-master1           1/1     Running             0          4m19s
kube-system   kube-controller-manager-master2           1/1     Running             0          115s
kube-system   kube-controller-manager-master3           1/1     Running             0          2m34s
kube-system   kube-proxy-klths                          1/1     Running             0          2m12s
kube-system   kube-proxy-nm79t                          1/1     Running             0          3m59s
kube-system   kube-proxy-nsvmh                          1/1     Running             0          2m37s
kube-system   kube-scheduler-master1                    1/1     Running             0          4m19s
kube-system   kube-scheduler-master2                    1/1     Running             0          115s
kube-system   kube-scheduler-master3                    1/1     Running             0          2m34s
kube-system   nodelocaldns-nblsl                        1/1     Running             0          2m12s
kube-system   nodelocaldns-q78k4                        1/1     Running             0          3m54s
kube-system   nodelocaldns-q9244                        1/1     Running             0          2m37s

ubuntu@master1:~$ kubectl get ep
NAME         ENDPOINTS                                               AGE
kubernetes   192.168.0.10:6443,192.168.0.11:6443,192.168.0.12:6443   5m10s
```