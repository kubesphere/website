---
title: 深度解析 Kubernetes API 扩展：从 CRD 到独立 API Server 的最佳实践
description: 在 Kubernetes 的开发中，如何高效扩展 API 是企业级应用面临的重要课题。本次演讲由 陈定昌（青云科技软件工程师）为您深度解析 Kubernetes API 扩展的三大方式——CRD、聚合 API 和 独立 API Server。通过对其原理、优劣势及应用场景的全面剖析，帮助开发者更好地选择和实现适合的扩展方式。
keywords:  KubeSphere, Kubernetes,API
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=113547929456296&bvid=BV1FRzuYvE3R&cid=27036549732&page=1&high_quality=1
  type: iframe
  time: 2024-11-23 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 成都 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

陈定昌（青云科技软件工程师）

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-chengdu-20241123-chendingchang.jpg)

## 分享主题介绍

本议题将全面解析 Kubernetes API 扩展的三种主要方式：基于 CRD 的扩展、通过聚合 API 实现的扩展以及独立 API Server 的实现。通过对每种方式的原理、实践以及优缺点的深度剖析，讲解如何根据实际需求选择最适合的 API 扩展方式。此外，将结合实际案例，分享在企业级开发中的最佳实践经验。

**议题大纲：**

- CRD 扩展 API
 - CRD 核心原理：动态路由与资源管理。
 - CRD 使用场景及问题分析。

- 聚合 API 扩展 API
 - 聚合 API 的原理与定义。
 - 解决 CRD 局限性的聚合 API 实现。
 - 聚合 API 在多集群管理和资源分发中的应用。

- 独立 API Server
 - 独立 API Server 的原理与实现：
 - 资源注册、存储与逻辑处理。
- 三种扩展方式的比较与应用场景建议
![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-20241123-p-dingchang.png)


## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20241123` 即可下载 PPT。
