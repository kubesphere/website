---
title: KubeBlocks RSM：如何让数据库更好的跑在 K8s 上
description: KubeBlocks 中设计了 StatefulSet 的增强版本 RSM 以解决上述问题，本次分享讲解 RSM 的核心设计思路和原理。
keywords:  KubeSphere, Kubernetes, KubeBlocks, RSM
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=535532341&bvid=BV1SM411Q79p&cid=1323375006&page=1&high_quality=1
  type: iframe
  time: 2023-11-04 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 成都 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

吴学强，云猿生数据高级技术专家。原阿里云 PolarDB-X 云原生分布式数据库技术负责人之一，毕业于浙江大学计算机学院，兴趣广泛，对操作系统、密码学、分布式系统等均有涉猎。2017 年加入 PolarDB-X 团队进行高并发低延迟的 MySQL 分布式相关系统开发工作，负责 PolarDB-X 的云原生底座打造、生态系统连接、开源等开放生态构建工作。现为开源数据基础设施 KubeBlocks 核心开发者。

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu1104-wuxueqiang.JPG)

## 议题简介

K8s 中管理数据库这种有状态应用的组件是 StatefulSet，但其并不能很好的满足数据库的高可用要求：
- 数据库通常有读写节点和只读节点，StatefulSet 中该如何支持？
- 想增加一个只读节点到现有的集群，如何正确搭建复制关系？
- 发生了主备切换，对外服务的 Service 如何自动感知并切换？
- 想先升级备库，后升级主库，怎么办？想先将 Leader 切换到别的节点以降低系统不可用时长该怎么做？

KubeBlocks 中设计了 StatefulSet 的增强版本 RSM 以解决上述问题，本次分享讲解 RSM 的核心设计思路和原理。	

## 议题大纲

- 数据库的本质
- 角色抽象与定义
- 基于角色对外提供服务
- 基于角色的更新策略
- 角色探测与更新
- 成员管理
- switchover 与 failover
- 数据副本准备	

## 听众受益

- 理解数据库的状态复杂在哪里
- 理解数据库高可用该考虑哪些方面
- 了解 RSM 的核心设计思路和原理
- 了解 KubeBlocks 为什么更适合管理数据库

## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20231104` 即可下载 PPT。

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu1104-poster-wuxueqiang.png)