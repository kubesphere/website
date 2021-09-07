---
title: '从 KubeSphere 3.1.0 边缘节点的监控问题排查，简要解析边缘监控原理'
tag: 'KubeSphere, monitoring'
keywords: 'Kubernetes, KubeSphere, monitoring, 边缘节点'
description: 'KubeSphere 3.1.0 通过集成 KubeEdge，将节点和资源的管理延伸到了边缘，也是 KubeSphere 正式支持边缘计算的第一个版本。本文作者也第一时间搭建和试用了边缘节点相关的功能，但是在边缘节点纳管之后遇到了一些监控的小问题，在排查过程中也顺带了解了一下 KubeSphere 对于边缘节点的监控原理，发出来和大家分享，方便其他的开发者能够更快的排查问题或进行二次开发。'
createTime: '2021-06-10'
author: '何毓川'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/edge-node-monitoring-cover.png'
---

KubeSphere 3.1.0 通过集成 KubeEdge，将节点和资源的管理延伸到了边缘，也是 KubeSphere 正式支持边缘计算的第一个版本。

本文作者也第一时间搭建和试用了边缘节点相关的功能，但是在边缘节点纳管之后遇到了一些监控的小问题，在排查过程中也顺带了解了一下 KubeSphere 对于边缘节点的监控原理，发出来和大家分享，方便其他的开发者能够更快的排查问题或进行二次开发。

## 环境版本和构成

通过 KubeKey 安装，参数如下，其余组件版本默认未改动。

Kubernetes: v1.19.8

KubeSphere: v3.1.0

![](https://pek3b.qingstor.com/kubesphere-community/images/1621237867-89115-image.png)

## 问题现象

通过生成的 keadm 命令行将边缘节点加入集群，并在边缘节点上部署 POD，该 POD 的监控信息不能显示。

![](https://pek3b.qingstor.com/kubesphere-community/images/1621238378-230370-image.png)

## 监控原理

定位和解决问题之前，肯定是要先搞懂工作原理。

### 1. KubeEdge

KubeEdge 的 Edgecore 组件对 Kubelet 进行了轻量化改造，Edgecore 和 Cloudcore（云端）也不在同一个 Cluster 网络中，通过 K8s 默认的方式进行 metrics 获取肯定是行不通的（logs 和 exec 原理相同）。

当前 KubeEdge 的实现方法是 kube-apiserver 上的 iptables 转发给云端的 Cloudcore，Cloudcore 通过和 Edgecore 之间的 WebSocket 通道向边缘端进行消息和数据传递。

KubeEdge 官方的使用手册和文档如下： https://kubeedge.io/en/docs/advanced/metrics/。

为了便于大家理解，作者画了一张图，整体的流程请参考如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/1621239902-395149-image.png)

### 2. Metrics-server

原生的 K8S 中就是通过 Metrics-server 这个官方组件进行节点和 POD 的 CPU/Memory 等数据的监控。

简而言之，Metrics-server 通过 Pull 的方式去每个节点上拉取监控数据，放在自身的内存中，提供 K8S 的 API 供 kubectl top 这样的 client 来查询。

Metrics-server 的详细设计，可以参考 GitHub 的官方说明： https://github.com/kubernetes-sigs/metrics-server。

Metrcis-server 的启动参数中，有一个参数要特别说明一下：`_kubelet-use-node-status-port_`。

在 KubeEdge 的官方文档中，也提到了启动 Metrics-server 时要指定该参数，至于原因文档中并未提及，这里简单说明一下。这个参数的意思是：“调用 kubelet 服务时，用该 Node 上报的 port，而不是默认的 port”。我们知道 kubelet 的 metrcis 接口默认是监听在 10250 端口的，而 KubeEdge 的 edgecore 将 metrics 接口默认监听在 10350 端口，如果不加这个参数，Metrice-server 就会通过类似 `_edgenodeIP:10250/stat/summary_` 这样的请求去获取监控数据，结果肯定获取失败的。

我们通过 KubeSphere 环境的 yaml 文件，也能清晰地看到这一点配置：

![](https://pek3b.qingstor.com/kubesphere-community/images/1621241419-66605-image.png)

### 3. KubeSphere

上面讲到了，Metrics-server 已经从 KubeEdge 那里获取到了边缘节点的监控数据，那么 KubeSphere 只要从 Metrics-server 提供的 K8S API 中即可获取到边缘节点的实时监控数据用来在前端进行展示。

稍微翻了一下 KubeSphere 的代码，和我们的预想是一致的，KubeSphere 通过 Metrics-server 拿到了当前版本展示的监控数据。

![](https://pek3b.qingstor.com/kubesphere-community/images/1621242786-759271-image.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1621242705-438129-image.png)

### 4. EdgeWatcher

从上述第 1 点 KubeEdge 的工作原理来看，是需要在 kube-apiserver 所在的节点上进行 iptables 转发规则设置的（将所有 10350 的请求都转发给 Cloudcore 的 10003 端口进行处理）。

那么每一个边缘节点加入集群的时候不可能由运维人员手动进行 iptables 的规则设置，所以 KubeSphere 就自研了 EdgeWatcher 这样一个组件。这个组件的目的应该是有以下几点：
- 提供 kubeedge group API（添加边缘节点时前端调用该 group API）
- 边缘节点加入集群时，设置 IPtables 规则（logs exec metrics 都需要）
- 验证边缘节点指定的 IP 是否可用，IP 需要全局唯一

EdgeWatcher 暂未开源，作者从社区转载了下面这张 EdgeWatcher的工作原理图，供大家参考：

![](https://pek3b.qingstor.com/kubesphere-community/images/1621242234-504187-image.png)

关于边缘节点 IP 需要全局唯一的问题，作者还是有很多想说的，后续有时间再开一篇，和大家一起探讨。

### 5. 总体概览

其实通过对上述监控组件的了解，我们也基本能勾勒出 KubeSphere v3.1 在基于 KubeEdge 的边缘集成中，所作的努力和工作。下面是作者简单画的一张整体组件架构的图，供大家参考：

![](https://pek3b.qingstor.com/kubesphere-community/images/1621242545-525961-image.png)

## 问题定位

既然原理都搞清楚了，下面就简单说一下定位的过程和思路。

### 1. Metrics-server

首先我们判断 Metrics-server 有没有正常提供服务，能不能获取到边缘数据。

从下面的命令结果可以看出，边缘节点（K8s-agent）的监控数据和非边缘节点的 POD 的监控数据都是没有问题的。

![](https://pek3b.qingstor.com/kubesphere-community/images/1621244187-472154-image.png)

只有边缘节点上的 POD 的监控数据获取不到。

![](https://pek3b.qingstor.com/kubesphere-community/images/1621244304-535051-image.png)

### 2. KubeEdge

再来看 KubeEdge 提供的 10350 端口的 metrics 服务，有没有问题。

![](https://pek3b.qingstor.com/kubesphere-community/images/1621244559-585551-image.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/1621244588-460859-image.png)

我们可以看到，KubeEdge 的 edgecore 提供的 10350 端口的服务也是没有问题的，可以从中获取到边缘节点和边缘 POD（nginx-xxx）的监控数据。

### 3. 总结

从上面的分析可以得出以下结论：
- Metrcis-server 没问题
- KubeEdge 的 edgecore 在边缘节点的服务没问题
- cloudcore 和 edgecore 之间的通路没有问题（通过查看 edgecore 的日志，可以看到 stat/summary 的调用，但是 POD 的监控数据调用则没有）

最后再去确认其他可以获取边缘 POD 节点的信息，发现只有 Docker 版本的差别，出问题的是 v18.09.1，而正常的节点版本如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/1621245202-686659-image.png)

至此，基本能断定是 Docker 版本过低造成的，至于是哪个接口和 Metrics-server 不能兼容，就不花太多时间去调查分析，有经验的开发者可以留言共享一下。

## 结论

基于这个问题，我们对 Docker 版本进行了测试，最终确认在 KubeSphere 默认的 Metrics-server 版本（v0.4.2）的场景下，Docker 版本要大于等于 v19.3.0 才能支持边缘 POD 的监控。

## 后记

虽然问题不是很大，但是通过这个小问题能把边缘监控的脉络搞清楚，是比问题本身更有意义的。

通过这样的分析和总结，问题定位和二次开发的效率才会更高，希望我们社区的开发者一起把 KubeSphere 做得更好更完善。