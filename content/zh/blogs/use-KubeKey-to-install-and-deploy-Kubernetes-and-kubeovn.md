---
title: '使用 KubeKey 安装部署 Kubernetes 与 Kube-OVN'
tag: 'KubeKey, Kubernetes, 安装部署'
keywords: 'KubeSphere, KubeKey, Kubernetes, Kube-OVN, 安装部署'
description: 'KubeKey 是 KubeSphere v3.0 新增的安装方式，用户可以一键部署 Kubernetes 和 KubeSphere。Kube-OVN 是一款基于 OVS/OVN 的 Kubernetes 网络编排系统。本文将为大家介绍如何使用 KubeKey 来安装部署 Kubernetes 和 Kube-OVN。'
createTime: '2021-03-16'
author: '林瑞超'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeKey-Kubernetes-Kubeovn-banner.png'
---

> 作者简介：林瑞超，锐捷网络开发工程师， KubeSphere 社区 contributor， 关注 Kube-OVN, Cilium 等容器网络相关技术
## 背景
KubeKey 是 KubeSphere v3.0 新增的安装方式，用户可以一键部署 Kubernetes 和 KubeSphere。Kube-OVN 是一款基于 OVS/OVN 的 Kubernetes 网络编排系统。本文将为大家介绍如何使用 KubeKey 来安装部署 Kubernetes 和 Kube-OVN。
### KubeKey 简介
KubeKey 是 Kubernetes 和 KubeSphere 的新一代 Installer（安装程序），旨在更方便、快速、高效和灵活地安装 Kubernetes 与 KubeSphere。KubeKey 摒弃了原来 Ansible 带来的依赖问题，用 Go 重写，支持单独 Kubernetes 或整体安装 KubeSphere。它也是扩展和升级集群的有效工具。
### Kube-OVN 简介
Kube-OVN 是一款开源企业级云原生 Kubernetes 容器网络编排系统，它通过将 OpenStack 领域成熟的网络功能平移到 Kubernetes，极大增强了 Kubernetes 容器网络的安全性、可运维性、管理性和性能。在上个月 Kube-OVN 加入了 CNCF Sandbox。
## 准备工作
1. 满足 KubeKey 的安装条件   
2. 满足 Kube-OVN 的[安装条件](https://github.com/alauda/kube-ovn/wiki/%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C)(主要是内核版本需要满足要求)

## 安装步骤
1. 下载 KubeKey
   
如果能正常访问 GitHub/Googleapis，可以从 GitHub [发布页面](https://github.com/kubesphere/kubekey/releases)下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

如果访问 GitHub/Googleapis 受限
先执行以下命令以确保从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```
>下载 KubeKey 后，如果将其传至新的机器，且访问 Googleapis 同样受限，在执行以下步骤之前务必再次执行 `export KKZONE=cn` 命令。
>执行以上命令会下载最新版 KubeKey (v1.0.1)，可以修改命令中的版本号下载指定版本。

为 `kk` 添加可执行权限：
```bash
chmod +x kk
```

创建示例配置文件：

```shell
./kk create cluster --with-kubernetes v1.20.4
```
完整的文档请参考[官方文档](https://kubesphere.com.cn/docs/installing-on-linux/introduction/multioverview/)

2. 修改生成的 config-sample.yaml 文件, 把网络插件改成 Kube-OVN，配置如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: example
spec:
  hosts:
  - {name: node1, address: 192.168.0.183, internalAddress: 192.168.0.183, port: 22, user: root, password: Qcloud@123}
  roleGroups:
    etcd:
     - node1
    master:
     - node1
    worker:
     - node1
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.17.9
    imageRepo: kubesphere
    clusterName: cluster.local
    masqueradeAll: false
    maxPods: 110
    nodeCidrMaskSize: 24
    proxyMode: ipvs
  network:
    plugin: kubeovn
    kubeovn:
      joinCIDR: 100.64.0.0/16  #joinCIDR地址
      enableSSL: true   #开启SSL
      enableMirror: true    #是否开启流量镜像
      pingerExternalAddress: 114.114.114.114 #ping external地址
      networkType: geneve   #网络类型, 可选geneve与vlan, 如果选择vlan, vlan网卡名称必须填写
      vlanInterfaceName: interface_name  #vlan网卡名称
      vlanID: '100'    #默认vlanID
      dpdkMode: false  #是否dpdk模式
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
   registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: ""
  addons: []
```

> 在上面的 yaml 中 Kube-OVN 的配置可以不用填写，将使用默认的配置安装 Kube-OVN， 即配置可简化成如下：
 ``` 
 network:
   plugin: kubeovn
   kubePodsCIDR: 10.233.64.0/18
   kubeServiceCIDR: 10.233.0.0/18
```

## 部署

```shell
./kk create cluster -f config-sample.yaml
```

在安装过程中，能看到 Kube-OVN 的部署信息，看到`Congratulations`信息，表示集群已经安装成功了。
![](https://pek3b.qingstor.com/kubesphere-community/images/1612408284-600446-image.png)

通过`kubectl get pod -A`能看到 Kube-OVN 相关的 Pod 已经都正常运行
![](https://pek3b.qingstor.com/kubesphere-community/images/1612408433-423521-image.png)

查看当前的子网`kubectl get subnet`，能看到 join 子网与 ovn-default 子网：
![](https://pek3b.qingstor.com/kubesphere-community/images/1612408486-172151-image.png)

## 如何使用 Kube-OVN
在 Kube-OVN 中通过子网组织 IP，一个或多个 Namespace 可以被绑定到一个子网中，这些 Namespace 下的 Pod 将会从该子网中分配 IP，并使用子网下的网络配置。如果 Pod 绑定的 Namespace 没有绑定子网，将使用默认子网 ovn-default 为其分配 IP 地址。 在 **https://github.com/alauda/kube-ovn/wiki** 上有关于 Kube-OVN 详细的使用教程，可移步 Kube-OVN 社区查看。
![](https://pek3b.qingstor.com/kubesphere-community/images/1612413042-23232-image.png)

### 创建自定义子网
```yaml
apiVersion: kubeovn.io/v1
kind: Subnet
metadata:
  name: ls1
spec:
  protocol: IPv4
  cidrBlock: 10.100.0.0/16   #设置子网网段
  excludeIps:
  - 10.100.0.1..10.100.0.10  #设置子网排除(不使用)范围
  gateway: 10.100.0.1        #设置子网的网关地址
  namespaces:                #设置子网绑定的命名空间
  - ls1
```
子网的配置如上(相关字段的含义注释中有说明)， `kubectl apply`之后再`kubectl get subnet` 能看到子网已经创建出来，通过`kubectl get subnet ls1 -o yaml` 可以查看子网的状态是否可用。
![](https://pek3b.qingstor.com/kubesphere-community/images/1612409695-399692-image.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/1612409796-65612-image.png)

### 创建 Pod 并绑定自定义子网
我们已经创建了子网 ls1 并绑定了命名空间 ls1, 接下来我们创建一个 Pod 并绑定 ls1 命名空间:

创建命名空间 `kubectl create ns ns1`
![](https://pek3b.qingstor.com/kubesphere-community/images/1612410396-925604-image.png)

创建 Nginx Pod 并绑定 ls1  `kubectl run 

![](https://pek3b.qingstor.com/kubesphere-community/images/1612410446-100188-image.png)

通过上面两个步骤，Pod 已经创建出来了，并且分配的 IP 地址在排除地址范围外，通过`kubectl get ip`可以查看 Pod 分配到的 IP 地址与 mac 地址等信息

![](https://pek3b.qingstor.com/kubesphere-community/images/1612410554-323485-image.png)

