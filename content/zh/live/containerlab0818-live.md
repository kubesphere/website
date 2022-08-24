---
title: CONTINAERlab + KinD 秒速部署跨网络 K8s 集群
description: CONTAINERlab 提供快速部署网络资源能力，KinD 提供快速部署 K8s 能力，二者结合达到秒速部署跨网络 K8s 集群。帮助个人或企业快速初始化平台，秒速部署，秒速销毁。
keywords: KubeSphere, Kubernetes, CONTINAERlab, KinD 
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=259729617&bvid=BV1Qa411d7wm&cid=807962502&page=1&high_quality=1
  type: iframe
  time: 2022-08-18 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

CONTAINERlab 提供快速部署网络资源能力，KinD 提供快速部署 K8s 能力，二者结合达到秒速部署跨网络 K8s 集群。帮助个人或企业快速初始化平台，秒速部署，秒速销毁。

## 讲师简介

Rowan Luo，CONTAINERlab Maintainer，Telecom Virtualization Specialist。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/containerlab0818-live.png)

## 直播时间

2022 年 08 月 18 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220818` 即可下载 PPT。

## Q & A

### Q1. gw bridge Server 都是 K8s 集群里的 pod 吗？

答：gw 和 Server 是 Docker 下的容器，bridge 为 Linux 下普通的 Linux 网桥。

### Q2. 秒速创建删除集群的原理是什么？

答：得益于 Docker 容器的快速创建和快速销毁。

### Q3. 除了 kind 还支持其他的 K8s 集群部署方式吗？

答：我们的原理是为了在同一个节点上部署 CONTAINERlab，然后使用容器共享网络模式集成 K8s 环境和网络环境。

### Q4. 支持官方 K8s 集群吗？

答：同问题3.

### Q5. 是否支持 aarch64 架构？

答：由镜像本身决定。

### Q6. 容器里的 tunl0 是做什么用的？

答：这个是 Calico CNI 会默认为每一个 namespac 创建一个 tunl0 的网卡。

### Q7. vr 和 leaf 之间用 IBGP，leaf 和 spine 之间用 EBGP，都用 EBGP 有没有问题？

答：可以，但是不推荐。因为 IBGP 支持 BGP RR。故 VR 和 Leaf 直接采用 IBGP。具体参考 Calico 的 Architecture： https://projectcalico.docs.tigera.io/reference/architecture/design/l3-interconnect-fabric。

### Q8. 跨网络 K8s 集群怎么理解，有什么用处，两个集群用不同地址段不就行了？

答：同集群的节点处不同网段。

### Q9. Google 开源的是 K8s in K8s ?

答： https://github.com/openconfig/kne/

### Q10. gw 是什么实现出来的？

答：Docker 运行的 VyOS 的容器。
