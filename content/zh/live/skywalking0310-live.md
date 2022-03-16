---
title: SkyWalking 在无人驾驶领域的实践
description: 本次分享将主要介绍 SkyWalking 的基本概念和使用方法，以及在无人驾驶领域，我们进行的一系列实践。
keywords: KubeSphere, Kubernetes, SkyWalking, 无人驾驶
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=254749860&bvid=BV1qY41137ZT&cid=546474932&page=1&high_quality=1
  type: iframe
  time: 2022-03-10 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

随着无人驾驶在行业的不断发展和技术的持续革新，规范化、常态化的真无人运营逐渐成为事实标准，而要保障各个场景下的真无人业务运作，一个迫切需要解决的现状就是业务链路长，出现问题难以定位。本次分享将主要介绍 SkyWalking 的基本概念和使用方法，以及在无人驾驶领域，我们进行的一系列实践。

## 讲师简介

李可卉，驭势科技云平台技术中台负责人，开源爱好者，日常工作领域包括云原生可观察性系统的业务落地等。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/skywalking0310-live.png)

## 直播时间

2022 年 03 月 10 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220310` 即可下载 PPT。

## Q & A

### Q1：边车方式接入 SkyWalking agent 后，pod 启动变慢，至少慢 1 分钟，你们怎么解决的？

A：SkyWalking agent 的接入分为几种，基于语言的原生代理、第三方打点类库，以及问题中提到的 服务网格 sidecar 方式接入。目前我们在实际使用上，由于链路较为复杂，使用协议较多，更多探索了通过第三方类库埋点的方式；后续我们也希望能够将第三方类库埋点方式与服务网格边车方式进行结合使用。

### Q2：SkyWalking 与 zipkin、jeager 这些链路追踪工具相比有什么优势？
 
答：一方面，SkyWalking 对框架和语言的支持性很好，功能上涵盖的内容比较广泛，对可观察性三元组都有所涉猎，且功能的更新也很快；另一方面，SkyWalking 社区非常活跃以及友好（提 issue 都是秒回），这一点上体验非常好。

### Q3：SkyWalking 的监控是用的原生的吗还是在原生的基础上进行改造过的，有遇到复杂业务场景报警比较频繁的情况吗，比如接口耗时、平响这些，你们是怎么做的？（探索完后再播一次）
 
A：Skywalking 发送告警的基本原理是每隔一段时间轮询 skywalking-oap 收集到的链路追踪的数据，再根据所配置的告警规则（如服务响应时间、服务响应时间百分比）等，如果达到阈值则发送响应的告警信息。 这部分目前我们尚未做进一步探索。

