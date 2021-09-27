---
title: '运营商业务系统基于 KubeSphere 的容器化实践'
tag: 'KubeSphere, 最佳实践'
keywords: 'Kubernetes, KubeSphere, container, 最佳实践'
description: '本篇文章是 KubeSphere 2020 年度 Meetup 上讲师宋磊分享内容整理而成。主要讲述了运营商业务系统基于 KubeSphere 的容器化实践经验。'
createTime: '2021-07-29'
author: ' 宋磊'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/20210921134215.png'
---

> 本篇文章是 KubeSphere 2020 年度 Meetup 上讲师宋磊分享内容整理而成。

大家好，我是宋磊，在运营商的一个科技子公司任职，主要做大数据业务。我主要负责公司的 IaaS 层和 PaaS 层的建设和运营的工作，涉及到两个层面。因为 Kubernetes 是一个非常全面的技术体系，并不是我们部署了一个集群把业务放上去就能开箱即用，涉及到很多方面，比如服务器、网络、存储，还有一系列的工具链的支持，我们才能真正的去投产，所以我们团队是比较适合做这件事的。

## 业务类型和实践架构

![](https://pek3b.qingstor.com/kubesphere-community/images/ToS-operator.png)


我们目前有三种类型的业务：
1.接口的服务，容量占比是比较大的一块
2.APP 的应用
3.外部的应用系统，主要做智慧政务、智慧生态、智慧城市、智慧旅游等业务

这三个类型的业务，整体的 TPS 的峰值大约在 2500，平均在 1500 左右。

我们整体的集群规模：我们所有的集群都是以物理服务器进行部署的，生产集群有 50 个物理节点，测试的集群有 20——30 个节点，整体的 Kubernetes 集群的规模不到 100 个物理节点。

![](https://pek3b.qingstor.com/kubesphere-community/images/architecture-operator.png)

上面这张图是我们 Kubernetes 的实践。

IaaS 层：
数据中心物理层的网络是 SDN 加 VXLAN 的架构，后续对于网络插件的选型是有考虑的。

存储这一块我们主要是对接 Ceph，我们有一个比较大的 Ceph 集群，大概有 50 个物理节点，其中对接层不单单跑了 KubeSphere 的这些业务，还跑了一些 OpenStack 的虚拟机。我们在 Ceph 上面做了一些数据的分层，闪存盘(存放集群元数据)和 SATA 盘(存放真正的数据)，也做了一些数据的热度分层，然后以 KubeSphere 为中心的容器集群周边做了很多对接的工具链。这其中的一些工具链不是容器化的，而是外链的，比如说 CMDB 配置管理，Prometheus 的监控，Skywalking 主要做微服务的全链路监控，还有一些日志的采集分析，主要还是以 ELK 的工具链为主，也是在 KubeSphere 集群之外的，DevOps 这层是基于 Jenkins 的 pipeline 去做的。

然后流量入口这一块，因为我们所有的业务类型都是互联网性质的，所以我们在互联网区域有一个整体的 Nginx 的集群，主要做业务的路由分发和流量的集中控制。

## 存储和网络的选型与实践

![](https://pek3b.qingstor.com/kubesphere-community/images/operator-stor-network.png)

### 网络

上文已经提到我们的物理网络已经是 SDN 加 VXLAN 的大二层的租户性质，所以对于 KubeSphere 的网络插件的选型，目前主要就两种——Calico 和 Flannel。

Flannel 本身就是基于 VXLAN的，如果选择它的话，相当于我们两个层面——物理网络和 Kubernetes 网络都是 VXLAN，这就涉及到两次层面的封包和解包的问题，对性能还是有一定的影响的，所以我们最终还是选择了 Calico 这种纯三层的 BGP 的网络，然后做网络的插件。


### 存储

目前我们主要对接的是 Ceph 的块存储，服务于一些有状态的服务，比如我们会做一些 helm 的镜像，主要是 Zookeeper、Redis、MySQL。但是这些有状态的服务主要是在测试集群，给开发测试人员使用的。生产环境主要是一些无状态的服务，比如分布式框架的 Java微服务应用，还有 Python 和 go。go 主要是用来做区块链，因为现在区块链跟 K8s 结合是非常有必要的业务类型。

但是 RBD 块存储有局限性，我们很多业务需要多个 Pod 或者多个容器共同读写某一块存储，但块存储是实现不了的，后续我们还会有对象存储和网络存储（NFS）的对接。


## DevOps 和日志采集的实践


![](https://pek3b.qingstor.com/kubesphere-community/images/log-operator.png)


CI/CD 这块，底层是 Jenkins，没有集成到 KubeSphere 里，因为我们之前有一个 Jenkins 的 Master 和 Slave 的架构的平台，基于 pipeline，镜像直接打到 Kubernetes 集群，做自动化的 CD。

日志采集相对来说会麻烦一点，目前对接的 ELK 的工具链，底层主要是采集三种类型的日志，宿主机日志、Pod 业务日志和 Kubernetes 组件相关的日志。宿主机和 Kubernetes 组件日志都是基于宿主机采集。


Pod 业务日志的采集，主要有两种方式：
1. 在 Pod 里加一个 Sidecar 的容器
2. 在一个业务容器里起两个服务，前台服务是 Java 的微服务，后台是采集的 Filebeat 的 agent，然后将采集 agent 直接打到镜像里运行

ELK 的工具链是比较成熟的工具链了，可以参见上图。


## 灰度发布

![](https://pek3b.qingstor.com/kubesphere-community/images/gatedlaunch-operator.png)

我们是以两种形式来进行灰度发布。

1. 针对小版本迭代
基于权重，通过 Kubernetes 控制器的副本特性来做灰度发布。一个业务中有多个副本，先灰度发布一两个，没有问题就继续灰度发布，如果有问题就回退。这种方式是比较常规的。

2. 针对大版本迭代
使用业务灰度方式。针对用户的 HTTP 请求的头部以及 body 里用户的 ID，通过 Nginx 和 lua 脚本，分发到不同的版本上面去。



## 服务治理

![](https://pek3b.qingstor.com/kubesphere-community/images/servicemesh-operator.png)

我们对于服务治理这块后续可能会有一些需求，目前没有一种特别好的实践方式。

目前来说我们对于微服务治理都是基于辅助的手段，比如全链路监控，日志的指标，来做微服务的流量控制和垄断。后续我们想往服务网格上探索，把流量的监测和控制放在平台层，开发只需要专注于业务的逻辑，目前还没有比较好的落地方案。

