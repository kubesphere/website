---
title: 'OpenELB 项目进入 CNCF Sandbox，让私有化环境对外暴露服务更简单'
tag: '产品动态'
keywords: 'OpenELB, 负载均衡器, Kubernetes, LoadBalancer, 物理机'
description: 'CNCF 宣布由青云科技 KubeSphere 团队开源的负载均衡器插件 OpenELB 正式进入 CNCF 沙箱'
createTime: '2021-11-24'
author: 'KubeSphere'
image: 'https://kubesphere-community.pek3b.qingstor.com/images/4761636694917_.pic_hd.jpg'
--- 

![头图](https://kubesphere-community.pek3b.qingstor.com/images/4761636694917_.pic_hd.jpg)

11 月 10 日，云原生计算基金会 (CNCF) 宣布由青云科技 KubeSphere 团队开源的负载均衡器插件 OpenELB 正式进入 CNCF 沙箱（Sandbox）托管。

![示意图](https://kubesphere-community.pek3b.qingstor.com/images/8471636692467_.pic_hd.jpg)

OpenELB 项目在此前命名为 PorterLB，是为物理机（Bare-metal）、边缘（Edge）和私有化环境设计的负载均衡器插件，可作为 Kubernetes、K3s、KubeSphere 的 LB 插件对集群外暴露 “LoadBalancer” 类型的服务，核心功能包括：

- 基于 BGP 与 Layer 2 模式的负载均衡 
- 基于路由器 ECMP 的负载均衡
- IP 地址池管理
- 使用 CRD 进行 BGP 配置

![架构](https://kubesphere-community.pek3b.qingstor.com/images/8441636691354_.pic_hd.jpg)

## 为什么发起 OpenELB

我们起初在 KubeSphere 社区做了一项针对广大社区用户安装部署 Kubernetes 所使用环境的调研，从 5000 多份 KubeSphere 用户调研数据中发现有近 36% 的用户选择在物理机安装部署 Kubernetes，占比高居第一位。并且还有大量客户是在离线的数据中心或边缘设备安装和使用 Kubernetes 或 K3s，导致用户在私有环境对外暴露 LoadBalancer 服务比较困难。

![用户调研](https://kubesphere-community.pek3b.qingstor.com/images/8401636689164_.pic.jpg)

我们知道，在 Kubernetes 集群中可以使用 “LoadBalancer” 类型的服务将后端工作负载暴露在外部。云厂商通常为 Kubernetes 提供云上的 LB 插件，但这需要将集群部署在特定 IaaS 平台上。然而，许多企业用户通常都将 Kubernetes 集群部署在裸机上，尤其是用于生产环境时。而且对于私有化环境特别是物理机或边缘集群，Kubernetes 并不提供 LoadBalancer 方案。

OpenELB 解决了在非公有云环境的 Kubernetes 集群下对外暴露 LoadBalancer 服务的问题，为私有化环境的用户提供了易用的 EIP 与 IP Pool 管理能力。

## 社区情况

目前 OpenELB 已具备生产可用的特性，已被**本来生活、苏州电视台、视源股份、云智天下、Jollychic、QingCloud、百旺、Rocketbyte** 等海内外多家企业采用。早在 2019 年底，本来生活就将 OpenELB 的早期版本用于其生产环境，可参考 [OpenELB 如何帮助本来生活在 K8s 物理环境暴露集群服务](https://mp.weixin.qq.com/s/uFwYaPE7cVolLWxYHcgZdQ) 了解详情。OpenELB 项目目前有 13 位贡献者，100 多位社区成员。

![采用企业](https://kubesphere-community.pek3b.qingstor.com/images/8411636689286_.pic_hd.jpg)

## 与 MetalLB 的对比

MetalLB 在近期也加入了 CNCF Sandbox，该项目在 2017 年底发起，经过 4 年的发展已经在社区被广泛采用。OpenELB 作为后起之秀，采用了更加  Kubernetes-native 的实现方式，虽然起步更晚但得益于社区的帮助，已经迭代了 8 个版本并支持了多种路由方式。很多用户关注 MetalLB 与 OpenELB 的差异性，以下简单介绍两者对比。

### 云原生架构

在 OpenELB 中，不管是地址管理，还是 BGP 配置管理，你都可以使用 CRD 来配置。对于习惯了 Kubectl 的用户而言， OpenELB 十分友好。对于想定制 OpenELB 的高级用户，也可以直接调用 Kubernetes API 来做二次开发。在 MetalLB 中，需通过 ConfigMap 来配置， 感知它们的状态需要通过查看监控或者日志。

### 灵活的地址管理

OpenELB 通过 EIP CRD 管理地址，它定义子资源 Status 来存储地址分配状态，这样就不会存在分配地址时各副本发生冲突，编程时逻辑也会简单。

### 使用 gobgp 发布路由

不同于 MetalLB 自己实现 BGP 协议， OpenELB 采用标准的 gobgp 来发布路由，这样做的好处如下：

- 开发成本低，且有 gobgp 社区支持
- 可以利用 gobgp 丰富特性
- 通过 BgpConf/BgpPeer CRD 动态配置 gobgp，用户无需重启 OpenELB 即可动态加载最新的配置信息
- gobgp 作为 lib 使用时， 社区提供了基于 protobuf 的 API， OpenELB 在实现 BgpConf/BgpPeer CRD 时也是参照该 API，并保持兼容
- OpenELB 也提供 status 用于查看 BGP neighbor 配置，状态信息丰富

### 架构简单，资源占用少

OpenELB 目前只用部署 Deployment 即可，通过多副本实现高可用，部分副本 Crash 之后并不会影响已建立的正常连接。

BGP 模式下， Deployment 不同副本都会与路由器建立连接用于发布等价路由，所以正常情况下我们部署两个副本即可。在 Layer 2 模式下，不同副本之间通过 Kubernetes 提供的 Leader Election 机制选举 Leader，进而应答 ARP/NDP。

## OpenELB 安装与使用

目前 OpenELB 可支持部署在任意标准的 Kubernetes、K3s 以及其发行版，通过 Yaml 文件或 Helm Chart 一条命令完成部署。同时，在 KubeSphere 容器平台的应用商店和应用仓库也可以通过界面一键部署，可参考 [OpenELB 文档](https://openelb.github.io/docs/getting-started/installation/) 进行部署。

## 未来规划

得益于 CNCF 为项目提供了开源和中立的背书，OpenELB 也将真正变成一个由 100% 社区驱动的开源项目。接下来，OpenELB 将开发与实现如下功能，欢迎给社区提交需求与反馈：

- 基于 Keepalived 实现 VIP 模式的高可用
- 实现 kube-apiserver 的 LoadBalancer
- 支持 BGP 策略与配置
- 支持 VIP Group
- 支持 IPv6
- 提供独立的界面管理与配置 EIP 与 IP Pool
- 集成至 KubeSphere Console；提供 Prometheus metrics 

OpenELB 还将重点开展社区运营并推出一系列社区活动，希望借助更多开发者和用户的力量，解决用户在私有环境下的服务暴露与 IP 管理问题，为应用在 Kubernetes 上打开一扇大门，使服务对外暴露与管理变得更加轻松。

## 持续开源开放

KubeSphere 团队秉持 “Upstream first” 的原则，今年 7 月份先将 Fluentbit Operator 项目捐给 Fluent 社区成为 CNCF 子项目，此次又将 OpenELB 加入 CNCF Sandbox。未来 KubeSphere 团队将继续保持开源、开放的理念，持续作为 OpenELB 项目的参与方之一，推动国内和国际开源组织的生态建设，帮助 OpenELB 社区培育一个中立的开源社区与生态，与更多的容器平台及上下游生态伙伴进行深度合作，欢迎大家关注、使用 OpenELB 以及参与社区贡献。

- ✨ GitHub：[https://github.com/kubesphere/openelb/](https://github.com/kubesphere/openelb/)
- 💻 官网：[https://openelb.github.io/](https://openelb.github.io/)
- 🙋 社群：请通过官网底部二维码关注 KubeSphere 公众号加入社群

