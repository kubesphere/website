---
title: MQTT 及车联网场景应用
description: 本次分享期望能够让⼤家更深⼊了解物联⽹通信协议 MQTT：⾸先介绍 MQTT 协议基础；然后通过对⽐ MQTT Broker 和消息队列的异同点，并介绍一个云原生 MQTT Broker：EMQ X；最后和⼤家分享 MQTT 协议及 EMQ X 在⻋联⽹场景下的应⽤。
keywords: KubeSphere, Kubernetes, MQTT, EMQ X, MQTT Broker,  车联网
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=422780369&bvid=BV133411i7JM&cid=473091163&page=1&high_quality=1
  type: iframe
  time: 2021-12-30 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享期望能够让⼤家更深⼊了解物联⽹通信协议 MQTT：⾸先介绍 MQTT 协议基础；然后通过对⽐ MQTT Broker 和消息队列的异同点，并介绍一个云原生 MQTT Broker：EMQ X；最后和⼤家分享 MQTT 协议及 EMQ X 在⻋联⽹场景下的应⽤。

## 讲师简介

郭祖龙，驭势科技云脑架构研发经理

个人简介：
郭祖龙，驭势科技云脑架构研发经理。加⼊驭势科技整整三年，主要负责运营业务、⻋云通信架构等。云原⽣爱好者，期望能够充分享⽤云原⽣红利⾼效提升业务功能开发能⼒。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/mqtt1230-live.png)

## 直播时间

2021 年 12 月 30 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20211230` 即可下载 PPT。

## Q & A

### Q1：EMQ X 的稳定性这块可以更加详细讲讲吗？

A：高并发和高可用是 EMQ X 的设计目标，为了实现这些目标 EMQ X 中应用了多种技术，比如：利用 Erlang/OTP 平台的软实时、高并发和容错；全异步架构；连接、会话、路由、集群的分层设计；消息平面和控制平面的分离等。EMQ X 支持多节点集群，集群下整个系统的性能会成倍高于单节点，并能在单节点故障时保证系统服务不中断。

### Q2：真实应用场景下部署方式可以分享吗?比如说 Edege->Broker->MQ->DB。

A：是的，这是一种真实场景，边缘端 MQTT Broker 将数据转发至云端 MQTT Broker，云端 MQTT Broker 可以将消息桥接至 MQ 中，MQ 中的数据供后续业务模块处理。

### Q3：EMQ X 有多次真实测试数据吗？

A：我们数套生产环境均使用 EMQ X 作为 MQTT Broker，使用稳定。

### Q4：EMQ X 规则引擎效率高么?

A：数套生产环境使用下来能够满足我们需求。

### Q5：基于Emqx的扩展和Hook这块用的是什么方案能分享下么？

A比如我们使用了 CoAP 扩展，在某系弱网络场景下使用 CoAP 作为通信协议；比如使用各种认证机制增强认证能力等。钩子使用详见 [EMQ 文档](https://docs.emqx.cn/enterprise/v4.4/advanced/hooks.html#%E5%AE%9A%E4%B9%89)。

### Q6：EMQ X 和 KubeSphere 是什么关系呢？

A：我们使用 EMQ X 作为 MQTT Broker，使用 KubeSphere 作为集群管理工具。

### Q7：你们公有云上用的全是 AWS 那套，私有部署是用的开源替代的那套？

A：不完全是，公有云不仅仅是 AWS，我们还有其他公有云厂商的解决方案；私有部署取决于客户现场情况。
