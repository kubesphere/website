---
title: 基于 Kubernetes 的新一代 MySQL 高可用架构实现方案
description: MySQL 是世界上最流行的数据库，从物理机到私有云公有云都有它的身影，但是基于 K8s 的 MySQL 高可用集群还是一片处女地。RadonDB MySQL 是基于 MySQL 的高可用、云原生的解决方案，在容器化方面进行了一些探索，支持主从秒级切换，确保业务高可用。主节点发生故障时，集群自动响应并选出新的主节点，从节点发生故障可自动重建并与主节点保持一致。
keywords:  KubeSphere,Kubernetes,MySQL,RadonDB
css: scss/live-detail.scss

section1:
  snapshot: https://pek3b.qingstor.com/kubesphere-community/images/luanxiaofan-hangzhou.jpeg
  videoUrl: //player.bilibili.com/player.html?aid=333433521&bvid=BV1YA41137MQ&cid=347162028&page=1&high_quality=1
  type: iframe
  time: 2021-05-29 13:00-18:00
  timeIcon: /images/live/clock.svg
  base: 线下 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

高日耀

青云科技，资深 MySQL 内核研发

RadonDB Orgnization 发起者，长期从事分布式数据库内核研发，喜欢研究主流数据库架构，源码。曾参与分布式 MPP 数据库 CirroData 内核开发（东方国信）。目前就职于青云，负责 RadonDB MySQL (云原生 HA）、分布式数据库 RadonDB-D MySQL 内核开发。

## 分享主题介绍

上海场我们介绍了 MySQL on K8s 的高可用容器编排方案背景，技术选型，以及初步探讨了该方案的架构，杭州场将深度解析该方案基于 Helm 的源码实现和 Xenon 组件的架构源码。

![](https://pek3b.qingstor.com/kubesphere-community/images/hangzhouposter-6.png)

## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 “2021 杭州” 即可下载 PPT。


