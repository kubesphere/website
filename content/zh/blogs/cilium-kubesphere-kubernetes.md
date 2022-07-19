---
title: '使用 Cilium 作为网络插件部署 Kubernetes + KubeSphere'
tag: 'Kubernetes,KubeSphere,Cilium'
keywords: 'Kubernetes, KubeSphere, Cilium, 网络插件'
description: 'Cilium 是一个用于容器网络领域的开源项目，主要是面向容器而使用，用于提供并透明地保护应用程序工作负载（如应用程序容器或进程）之间的网络连接和负载均衡。本文主要介绍如何使用 Cilium 作为网络插件部署 Kubernetes 和 KubeSphere。'
createTime: '2021-06-04'
author: '姚锐'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/Cilium-KubeSphere-Kubernetes.png'
---

## Cilium 简介
Cilium 是一个用于容器网络领域的开源项目，主要是面向容器而使用，用于提供并透明地保护应用程序工作负载（如应用程序容器或进程）之间的网络连接和负载均衡。

Cilium 在第 3/4 层运行，以提供传统的网络和安全服务，还在第 7 层运行，以保护现代应用协议（如 HTTP, gRPC 和 Kafka）的使用。 Cilium 被集成到常见的容器编排框架中，如 Kubernetes 和 Mesos。

Cilium 的底层基础是 BPF，Cilium 的工作模式是生成内核级别的 BPF 程序与容器直接交互。区别于为容器创建 overlay 网络，Cilium 允许每个容器分配一个 IPv6 地址（或者 IPv4 地址），使用容器标签而不是网络路由规则去完成容器间的网络隔离。它还包含创建并实施 Cilium 规则的编排系统的整合。

![](https://pek3b.qingstor.com/kubesphere-community/images/cilium.png)

> 以上简介来源于 oschina

## 系统要求
Linux Kernel >= 4.9.17
更多信息请查看 [Cilium 系统要求](https://docs.cilium.io/en/v1.9/operations/system_requirements/)

## 环境
以一台 Ubuntu Server 20.04.1 LTS 64bit 为例

| name | ip | role |
| --- | ---| --- |
| node1 | 10.160.6.136 | etcd, master, worker |

## 下载安装包
```
sudo wget https://github.com/kubesphere/kubekey/releases/download/v1.1.0/kubekey-v1.1.0-linux-64bit.deb
```

## 使用 cilium 作为网络插件部署 KubeSphere

1. 安装 KubeKey
```
sudo dpkg -i kubekey-v1.1.0-linux-64bit.deb
```
2. 生成配置文件
```
sudo kk create config --with-kubernetes v1.19.8
```
3. 修改配置文件，将网络插件修改为 cilium

注意将 spec.network.plugin 的值修改为 **cilium**

```
sudo vi config-sample.yaml
```

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: node1, address: 10.160.6.136, internalAddress: 10.160.6.136, user: ubuntu, password: ********}
  roleGroups:
    etcd:
    - node1
    control-plane: 
    - node1
    worker:
    - node1
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.19.8
    imageRepo: kubesphere
    clusterName: cluster.local
  network:
    plugin: cilium
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

4. 部署依赖
```
sudo kk init os -f config-sample.yaml
```

5. 部署 KubeSphere
```
sudo kk create cluster -f config-sample.yaml --with-kubesphere v3.2.1
```

看到如下提示说明安装完成
```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://10.160.6.136:30880
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
https://kubesphere.io             2021-05-18 17:15:03
#####################################################
INFO[17:15:16 CST] Installation is complete.
```

6. 登陆 KubeSphere console

![](https://pek3b.qingstor.com/kubesphere-community/images/1621391485-957760-image.png)

7. 检查状态

![](https://pek3b.qingstor.com/kubesphere-community/images/1621391567-876515-image.png)

## 安装 Hubble UI 

Hubble 是专门为网络可视化设计的，能够利用 Cilium 提供的 eBPF 数据路径，获得对 Kubernetes 应用和服务的网络流量的深度可见性。这些网络流量信息可以对接 Hubble CLI、UI 工具，可以通过交互式的方式快速诊断如与 DNS 相关的问题。除了 Hubble 自身的监控工具，还可以对接主流的云原生监控体系——Prometheus 和 Grafana，实现可扩展的监控策略。


Hubble 的安装很简单，直接执行以下命令：

```
kubectl apply -f https://raw.githubusercontent.com/cilium/cilium/1.9.7/install/kubernetes/quick-hubble-install.yaml
```

![](https://pek3b.qingstor.com/kubesphere-community/images/1621391673-975700-image.png)

检查状态

![](https://pek3b.qingstor.com/kubesphere-community/images/1621391731-248693-image.png)


## 安装 demo 服务，并在 Hubble UI 查看服务依赖关系

1. 安装 demo

```
kubectl create -f https://raw.githubusercontent.com/cilium/cilium/1.9.7/examples/minikube/http-sw-app.yaml
```

![](https://pek3b.qingstor.com/kubesphere-community/images/1621391817-68900-image.png)


2. 将 Hubble UI 服务类型修改为 NodePort

![](https://pek3b.qingstor.com/kubesphere-community/images/1621392459-478999-image.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1621392485-943218-image.png)

3. 访问 demo

```bash
kubectl exec xwing -- curl -s -XPOST deathstar.default.svc.cluster.local/v1/request-landing
Ship landed
kubectl exec tiefighter -- curl -s -XPOST deathstar.default.svc.cluster.local/v1/request-landing
Ship landed
```

![](https://pek3b.qingstor.com/kubesphere-community/images/1621392797-391370-image.png)

4. 在 Hubble 上 查看服务依赖关系

![](https://pek3b.qingstor.com/kubesphere-community/images/1621337367-698475-image.png)

如果想开启网络 7 层的可视化观察，就需要对目标 Pod 进行 annotations ，感兴趣可以看 [Cilium 的官方文档](https://docs.cilium.io/en/stable/policy/visibility/)。

## 总结

从使用体验来看，Cilium 已经可以满足绝大多数的容器网络需求，特别是 Hubble 使用原生的方式实现了数据平面的可视化，比 Istio 高明多了。相信用不了多久，Cilium 便会成为 Kubernetes 社区使用最多的网络方案。
