---
title: 如何优化容器网络性能
description: 容器平台的最大挑战之一是容器网络。本次分享会介绍如何从 ovs、内核、协议等多个角度去优化 Kube-OVN 的过程。
keywords: KubeSphere, Kubernetes, Kube-OVN, 容器网络
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=591309774&bvid=BV17q4y1R7jk&cid=432621951&page=1&high_quality=1
  type: iframe
  time: 2021-10-28 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

容器平台的最大挑战之一是容器网络。从前几年开始, 社区就有同行在做 CNI 性能测试，去年，随着用户量和知名度的增加，Kube-OVN 作为新兴的容器网络工具被引入了测试集合。 

今年我们看到用户越来越关注容器网络的性能，因此，我们尝试了多种性能优化方案，包括优化传输时延和传输带宽。这次分享会介绍如何从 ovs、内核、协议等多个角度去优化 Kube-OVN 的过程。

## 讲师简介

刘韬，Kube-OVN 社区 Maintainer，灵雀云资深工程师，

个人简介：
长期关注 SDN、网络虚拟化及网络性能优化。目前工作重点是扩展 Kube-OVN 的功能，包括基于 Kube-OVN 打通 OpenStack 和 K8s 的网络、Cilium  部分功能引入和 Kube-OVN 容器网络性能优化等。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeovn1028-live.png)

## 直播时间

2021 年 10 月 28 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20211028` 即可下载 PPT。

## Q & A

### Q1：相对于 multus 和 ovs-cni 插件下的 pod 多网卡方案有什么区别？

A：Kube-ovn 提供了更多高层的功能，例如 subnet，VPC，集群互联等.。

### Q2：跨主机的 pod 网络与 vxlan 方式效率提升有多少？

A：我们没有具体测过 vxlan。但是考虑到目前 kube-ovn 的性能几乎和 Calico 持平，而 Calico 是事实优于 flannel/vxlan 的。我认为 Kube-ovn 优化过后的性能会更好些。

### Q3：使用 Quagga 等软路由软件模拟路由协议 bgp 啥的互联基于 ovn 效果如何？

A：我们目前优化的是数据面的性能。而 BGP 事实是在做控制面的路由，稳定情况下并不会影响到数据面的情况。

