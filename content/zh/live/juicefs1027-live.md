---
title: 向云而生 - JuiceFS 在云原生文件系统的实践
description: 在本次分享中，将介绍 JuiceFS 在云原生文件系统的探索与实践。
keywords: KubeSphere, Kubernetes, JuiceFS, 云原生文件系统
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=347078192&bvid=BV1wR4y1X7St&cid=874065844&page=1&high_quality=1
  type: iframe
  time: 2022-10-27 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

JuiceFS 是一款面向云原生设计的高性能共享文件系统，在 Apache 2.0 开源协议下发布。提供完备的 POSIX 兼容性，可将几乎所有对象存储接入本地作为海量本地磁盘使用，亦可同时在跨平台、跨地区的不同主机上挂载读写。目前很多用户都已经在 Kubernetes 环境中使用 JuiceFS。在本次分享中，将介绍 JuiceFS 在云原生文件系统的探索与实践。

## 讲师简介

朱唯唯，Juicedata 全栈工程师，cloud-native Fluid 项目 commiter，具备 CKA 和 CKAD 认证。主要负责 JuiceFS 在云原生领域的发展。	

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/juicefs1027-live.png)

## 直播时间

2022 年 10 月 27 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20221027` 即可下载 PPT。

## Q & A

### Q1：block 固定 4MB，如果文件小于 4MB 存储利用率就降低，就不适合使用了？比如一个 1MB 的大小文件，也将占用 4MB 的存储空间。

A：不会，小于 4MB 的文件不会补齐到 4MB，应该多少就多少。

### Q2：能展开聊聊 pods share mount 的使用场景吗？还有多租户的场景是如何实现隔离的？

A：多个应用 pod 共用同一个 PVC 的时候，会共享一个 mount pod，通常多应用需要共享数据做读写的时候，会这么用。业务上的多租户可以在 PV/StorageClass 中用 subpath 挂载实现业务之间的隔离。

### Q3：未来没有优化资源占用与开销的计划？

A：性能优化是长期在做的，最近的重点是减小 CPU 消耗。

### Q4：一个 PVC 对应一个 MountPod 吗？

A：取决于应用 pod 调度在多少节点上，每台节点上有一个或多个应用使用 PVC 的话，只有一个 mount pod。

### Q5：多个 sc 是否对应多种 oss/s3？

A： 一个 storageClass 对应一个 JuiceFS 文件系统，一个文件系统只能对应一个对象存储。多个 sc 可以对应一个，也可以对应多个。

### Q6：支持哪些应用，MySQL 或者 es 这些常见应用合适吗？

A： 比较适合顺序读写多于随机读写的场景，比如大数据、AI 训练这些。MySQL 不是很适合（但也有用户这么用的），es 场景通常拿 JuiceFS 做冷存储。