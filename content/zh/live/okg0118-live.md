---
title: KubeSphere X OpenKruiseGame 解锁云原生游戏运维之道
description: 本次分享将基于 OKG 的特性与功能，介绍 KubeSphere 如何支持 OKG 可视化操作实现云原生游戏白屏化运维后台，进一步降低企业游戏服容器化的管理成本。
keywords: KubeSphere, Kubernetes, OpenKruiseGame
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=241458512&bvid=BV1re411J7SA&cid=1411811634&page=1&high_quality=1
  type: iframe
  time: 2024-01-18 20:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---

本期直播由 OpenKruiseGame 社区 Maintainer 刘秋阳 与 KubeSphere Maintainer 万宏明主讲，带大家了解 KubeSphere 如何支持 OKG 可视化操作，实现云原生游戏白屏化运维后台。

如果你对开发、发布和分享 KubeSphere 扩展组件感兴趣的话，这期直播还将告诉你从何入手、可能遇到的问题以及如何解决。

## 议题 1：OpenKruiseGame 助力游戏运维管理提效

### 讲师简介

刘秋阳，阿里云，OpenKruiseGame 社区 Maintainer，长期从事云原生在游戏领域的研发工作，致力于推动游戏原生化转型与落地。

### 分享内容简介

本次分享将基于 OKG 的特性与功能，介绍 KubeSphere 如何支持 OKG 可视化操作实现云原生游戏白屏化运维后台，进一步降低企业游戏服容器化的管理成本。

- 游戏云原生化的时代浪潮
- OpenKruiseGame 特性/功能介绍
- 云原生游戏白屏化运维后台展示

## 议题 2：Build Your Own KubeSphere

### 讲师简介

万宏明，青云科技研发工程师，KubeSphere Maintainer，参与 KubeSphere 的核心架构与设计。

### 分享内容简介

本次议题将深入浅出的带大家了解 KubeSphere 扩展组件的开发，轻松实现 Build Your Own KubeSphere。

## 海报

![](https://pek3b.qingstor.com/kubesphere-community/images/okg-ks-20240118-live.png)

## 直播时间

2024 年 01 月 18 日 20:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载 

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20240118` 即可下载 PPT。

## Q & A

### Q1：刘老师在介绍会话类游戏服务器时提到的工作负载自动伸缩功能，在 OKG Dashboard 中的实现步骤是怎样的？在应用交付方面，KubeSphere 平台也支持 Argo 持续部署。想了解一下 OKG 是否考虑在 KubeSphere 中进行应用交付？

OKG 自动伸缩功能可以参考[文档](https://openkruise.io/zh/kruisegame/user-manuals/gameservers-scale/#%E6%B8%B8%E6%88%8F%E6%9C%8D%E7%9A%84%E6%B0%B4%E5%B9%B3%E8%87%AA%E5%8A%A8%E4%BC%B8%E7%BC%A9)。

实际上与所有 Kubernetes 对象一样，在集群中部署名为 ScaledObject 的对象 Yaml 即可实现游戏服的自动水平伸缩了。我们推荐的交付与运维方式如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/okg-kubesphere-xyz.png)

游戏运维通过 GitOps 维护各种部署 Yaml。当然，KubeSphere 也支持 DevOps 流程，所以也可以通过 KubeSphere 进行交付管理。OKG 项目本身提供的是面向游戏的工作负载，在集群内就是一个 CR 对象，无论通过何种方式都可以部署起来。当前的控制台更多是一个查询与定向管理的角色，可以面向游戏服进行精细化的控制。

### Q2：我对 KubeSphere 扩展组件开发很感兴趣，想了解一下是否有特定的技术栈要求或推荐？

扩展组件开发需要用到 React，除此之外扩展组件的编排还需要有一定 Helm、K8s 的使用经验。

### Q3：上架的扩展组件都是免费订阅的吗？后续的扩展组件也免费吗？

目前上架的扩展组件都是免费订阅的。后续上架的扩展组件是否免费由开发者自行决定。