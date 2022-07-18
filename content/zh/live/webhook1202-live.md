---
title: 浅谈 Webhook 开发与实践
description: 本次分享将带大家了解 Webhook 原理、插件的开发过程以及使用方法，掌握 Admission Webhook 的相关知识。
keywords: KubeSphere, Kubernetes, Webhook
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=592116483&bvid=BV14q4y1z785&cid=453718387&page=1&high_quality=1
  type: iframe
  time: 2021-12-02 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Webhook 的概念在互联网初期就被提出，在云原生时代 Webhook 依然作为 Admission 插件为 K8s 进行拓展。本次分享将带大家了解 Webhook 原理、插件的开发过程以及使用方法，掌握 Admission Webhook 的相关知识。

## 讲师简介

周杨，KubeSphere 后端研发助理工程师

个人简介：
周杨，目前就职于青云科技公司容器研发部，负责 KubeSphere 存储模块的功能开发以及相关 CSI 组件的维护与更新工作。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/webhook1202-live.png)

## 直播时间

2021 年 12 月 02 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20211202` 即可下载 PPT。

## Q & A

### Q1：自己开发的 Webhook 与官方自带的 Webhook 有作用优先顺序吗？

A：这个取决于 Webhook 的类型，`MutatingAdmissionWebhook` 是先于`ValidatingAdmissionWebhook` 执行的，如果同一类型的作用顺序影响并不大，特别是验证类型的Webhook，所有匹配的 Webhook 是同时并行运行的。

### Q2：Initializers 和 AdmissionWebhook 二者都能实现动态可扩展载入 admission controller，有何区别？

A：相比之下 AdmissionWebhook 的效率更高，虽然 Initializers 和 `MutatingAdmissionWenhook` 都是串行执行，但是 `ValidatingAdmissionWebhook` 是并行执行的，官方也更推荐使用 AdmissionWebhook。在一些高并发场景 Webhook 会更可靠。
