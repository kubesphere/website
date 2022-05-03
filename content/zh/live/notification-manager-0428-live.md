---
title: 使用 Notification Manager 构建云原生通知系统
description: 本次演讲会介绍 Notification Manager 的原理、 KubeSphere 如何使用 Notification Manager 构建多集群的通知系统以及 Notification Manager 2.0 的新特性。
keywords: KubeSphere, Kubernetes, Notification Manager, 云原生通知
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=213573367&bvid=BV1Na411e759&cid=587338629&page=1&high_quality=1
  type: iframe
  time: 2022-04-28 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Notification Manager 是 KubeSphere 开源的一款云原生多租户通知管理系统，支持从 Kubernetes 接收告警、事件、审计，根据用户设置的模板生成通知消息并推送给用户。本次演讲会介绍 Notification Manager 的原理、 KubeSphere 如何使用 Notification Manager 构建多集群的通知系统以及 Notification Manager 2.0 的新特性。

## 讲师简介

雷万钧，青云科技可观测性研发工程师，KubeSphere Member，Notification Manager Maintainer，OpenFunction Maintainer，云原生爱好者。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-0428-live.png)

## 直播时间

2022 年 04 月 28 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220428` 即可下载 PPT。

## Q & A

### Q1：通知消息是以 Webhook 形式发送吗？

A：通知消息发送的形式取决于接收者，邮件使用的是 SMTP 协议，钉钉使用的是钉钉的 API。Notification Manager 支持发送通知到 webhook，使用的是 HTTP 协议。

### Q2：存消息的是 Prometheus 的时序数据库吗？消息量很大 TB 级别的，这个日志落盘的后端存储的选择，这时序数据库扛得住吗？

A：消息不会发送到 Prometheus。

### Q3：消息在缓存里，消息易丢失，最后会存储到硬盘里吗？多久会写到硬盘里去？

A：目前缓存使用的是内存，是会存在丢失的风险，后续会使用支持持久化存储的中间件作为缓存，就不会存在丢失的问题了。

### Q4：后面会分享代码如何实现吗？

A：Notification Manager 的代码结构比较清晰，上手的难度不大，可以尝试先阅读下源码。有问题的话可以在社区论坛和 Github 上讨论。

### Q5：数据采集怎么做的？自己写的 exporter 吗？还是什么？

A：Notification Manager 提供了一个接口供数据源写入数据。

https://github.com/kubesphere/notification-manager/blob/master/docs/api/_index.md#Receive-alerts

### Q6：KubeSphere 多集群中，是不是每个 Member 集群都需要单独配置 Receiver？

A：不需要，KubeSphere 实现了配置的自动分发。

### Q7：KubeSphere 3.3 应该不会集成 Notification Manager 2.0 吧？是否可以手动升级？

A：KubeSphere 3.3 没有集成 Notification Manager 2.0。可以手动升级。参考： 
https://github.com/kubesphere/notification-manager#install

### Q8：社区新手怎样参与 Notification Manager 项目的贡献？

A：完善用户文档，用例，e2e 测试都是社区贡献的一部分，提出你的建议和需求也能够帮助项目成长。

### Q9：自定义采集消息怎么去做？

A：参考问题 5.
