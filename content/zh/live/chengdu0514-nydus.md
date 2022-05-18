---
title: Nydus - 面向下一代的容器镜像
description: 本议题介绍了开源容器镜像加速项目 Nydus 在构建，分发与运行时等整个容器镜像生命周期中的一些深入思考，从实践上展现镜像加速在镜像性能与安全性方向上的一些探索。
keywords:  KubeSphere, Kubernetes, Nydus
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=939016870&bvid=BV1sT4y1B7oL&cid=721573712&page=1&high_quality=1
  type: iframe
  time: 2022-05-14 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 成都 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

严松，蚂蚁集团技术专家

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-yansong.JPG)

## 分享主题介绍

镜像是容器基础设施中的一个重要部分。目前 OCI 标准镜像的一个缺陷是容器需要等待整个镜像数据完成下载后才能启动，这导致了在容器启动时消耗了过多的端到端时间，在大规模集群场景下，这对网络与存储负载的影响尤为明显。本议题介绍了开源容器镜像加速项目 Nydus 在构建，分发与运行时等整个容器镜像生命周期中的一些深入思考，从实践上展现镜像加速在镜像性能与安全性方向上的一些探索。近期 Nydus 运行时项目 Nydus Snapshotter 成为了 Containerd 的子项目，也与内核态 EROFS 做了深度集成，成为了 Kata Containers 安全容器原生集成的镜像加速方案。

## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `云原生成都0514` 即可下载 PPT。
