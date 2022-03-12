---
title: ROOK 云原生分布式存储开源项目的介绍及其在企业中的应用未来
description: 今天，Ceph 的云原生化开源项目-ROOK，其正是将 Ceph 技术通过 K8s 现代化的例子，我们对此将展开探讨，探究其发展历程、分布式存储技术在云原生环境下的解决方案，及在云原生世界的未来更为广阔的应用场景。
keywords: KubeSphere, Kubernetes, 云原生存储
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=421734665&bvid=BV1D3411873Z&cid=442118347&page=1&high_quality=1
  type: iframe
  time: 2021-11-11 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

随着云原生技术在企业中的深入广泛应用，越来越多的场景对于数据存储的需求日渐增长，Ceph 作为开源世界最为成功的分布式存储项目之一，其悠久的历史和技术沉淀为我们带来了无限遐想空间。今天，Ceph 的云原生化开源项目-ROOK，其正是将 Ceph 技术通过 K8s 现代化的例子，我们对此将展开探讨，探究其发展历程、分布式存储技术在云原生环境下的解决方案，及在云原生世界的未来更为广阔的应用场景。

## 讲师简介

林文炜，RedHat 解决方案架构师

个人简介：
林文炜，目前就职于红帽软件中国区技术团队，负责企业级合作伙伴及开源社区技术生态的建设工作。

历史工作经历：VMware、Citrix 虚拟化、OpenStack 私有云。

当前专注领域：以 Kubernetes 为中心的云原生混合云基础架构。

主要负责的解决方案包括：K8s 容器云平台、云原生分布式存储 ROOK 和云原生虚拟化 kubevirt 等开源项目的企业级应用。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/rook1111-live.png)

## 直播时间

2021 年 11 月 11 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注「KubeSphere云原生」公众号，后台回复 `20211111` 即可下载 PPT。

## Q & A

### Q1：Ceph 集群部署后，如果磁盘动态扩容，Ceph 能否识别到？

A：可以通过 ROOK 的 CRD 结合 Local Storage Operator 或者 IaaS 厂商提供的 StorageClass 进行扩展。

### Q2：假设存储为磁盘上的 lvm，扩容 lvm，Rook 能够动态发现扩容 pool 池吗？

A：ROOK 支持以 OSD 为单位的扩容。

### Q3：Rook 的 Ceph 和普通 Raid 的性能和稳定性相比较？

A：这个看应用场景，ROOK 或者 Ceph 的目的并不是取代传统存储，需要结合场景来取长补短，这点是我们需要注意的！

### Q4：Rook Ceph 中的 PG 出现限制，无法创建存储对象，请问如何扩展 pool 中的 PG，简单加磁盘吗？

A：可以通过 rook-ceph-tools 工具容器，使用 ceph 命令创建自定义的 pool。

### Q5：rook--ceph 有成熟的压测方案吗？

A：可以参考红帽相关产品的测试性能方案，关键字搜索 OpenShift Container Storage 或者 OpenShift Data Foundation。

### Q6：Rook 有成熟的灾后数据恢复方案吗？在 Ceph 中如何取出存储在内的文件？

A：灾后恢复分为在线恢复和离线恢复，在线恢复建议参考红帽 ROOK 项目的商业开源方案中的 OpenShift Data Foundation 的 Metro-DR 特性，离线恢复可以使用 velero 或其他商业方案。

### Q7：Ceph和 seaweedfs 比较

A：Ceph 的发展历史、技术成熟度和支持的接口丰富，是其核心优势！并且，Rook 是 CNCF 的毕业项目。