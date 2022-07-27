---
title: 基于 Zadig 打造云原生 DevOps 平台
description: 本次分享介绍开源、云原生持续交付平台 Zadig ，它主要基于 K8s 打造，面向开发者体验的云原生平台。本次分享它的设计理念、业务架构、解决什么问题、技术架构、使用场景等。
keywords: KubeSphere, Kubernetes, DevOps, Zadig
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=301165591&bvid=BV1CF411K7Vw&cid=780078084&page=1&high_quality=1
  type: iframe
  time: 2022-07-21 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享介绍开源、云原生持续交付平台 Zadig ，它主要基于 K8s 打造，面向开发者体验的云原生平台。本次分享它的设计理念、业务架构、解决什么问题、技术架构、使用场景等。

## 讲师简介

MinMin，KodeRover Golang 开发工程师，Zadig Maintainer。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/zadig0721-live.png)

## 直播时间

2022 年 07 月 21 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220721` 即可下载 PPT。

## Q & A

### Q1：Zadig 会集成到 KubeSphere 中吗？在 KubeSphere 3.3.0 中没看到有 Zadig。

A：是个好点子。后续我们会和 KubeSphere 团队探讨下集成的可行性。

### Q2：GitOps 比如 Argo CD 不是更先进吗？为什么又搞这么多  CI/CD 工具出来？

A：两者从出发点上就不同, Argo CD 一类的 GitOps 工具从本身依旧没有跳脱出面向代码片段的交付流程。如果企业是单一代码仓库管理的话，其实并没有太大问题。但是如果是多个小仓库进行代码管理的话，由于代码的碎片化，会导致服务交付过程中遇到很多的问题。Zadig 作为云原生的 DevOps 工具，面向的是服务的全生命周期而非仅关注代码本身，这样在交付过程中会将碰到的一致性问题概率大大降低。

### Q3：基于 kubecustomize 吗？

A：对于 kustomize 的支持在目前版本还没有，但是最近社区小伙伴反馈对于 kustomize 的需求比较多，可能在未来版本会提供相关能力。

### Q4：能跑个流水线来看看吗？

A：可以通过文档了解一下 Zadig 的工作流能力： https://docs.koderover.com/zadig/v1.13.0/project/workflow/，然后在自行安装体验一下。

### Q5：相比 Jenkins 流水线， Zadig 优势在哪儿？

A：流水线对比的话，Zadig 的优势有如下几点：
- 原生的对 K8s 的支持，让工作流并发不需要额外繁琐的配置，开箱即用
- 最大程度上的在保留配置自由度的情况下，降低配置的复杂度