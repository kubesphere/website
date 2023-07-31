---
title: 万亿级流量下的视频行业云原生建设之路
description: 本次直播分享将分享某视频行业企业的云原生建设历程与实践。
keywords: KubeSphere, Kubernetes, 云原生
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=446457321&bvid=BV1mj411X7ZE&cid=1213078748&page=1&high_quality=1
  type: iframe
  time: 2023-07-27 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

随着 5G、VR、AR、MR 等技术的不断成熟和应用范围的扩大，用户对于数字内容和服务的需求也不断增长。为了满足用户对于高质量、高性能数字服务的需求，企业需要不断提升自身的技术水平和服务能力。同时，为了响应国家环保政策和公司的“节能增效”战略，企业需要寻求更加高效的技术解决方案。

在这样的背景下，传统基于 VM 的应用程序架构已经开始出现转型。云原生建设成为了企业数字化转型和业务创新的必要选择。云原生建设可以帮助企业更好地利用云计算的优势，从而实现更快速、更敏捷的业务创新和迭代。同时，云原生改造还可以帮助企业降低成本，提高效率，提高用户体验。

本次直播将分享某视频行业企业云原生改造实践经验，主要包括容器云平台、流量接入、可观测性以及全链路交付等。

## 讲师简介

Luga Lee，系统架构设计师，公众号：架构驿站（priest-arc）主理人，Traefik Ambassador，TraefikLab 中国社区发起人，专注于云原生技术、Java 虚拟机技术等领域，对相关技术有独特的理解和见解。擅长于软件架构设计及优化。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/cloudnative0727-live.png)

## 直播时间

2023 年 07 月 27 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20230727` 即可下载 PPT。

## Q & A

### Q1：流量网关怎么做灰度发布的呢，哪些方式处理好多版本管理兼容？

A：如果想构件自己的云原生环境，可以借助 Flux 的 Flagger 實現，作为一种渐进式交付工具，Flagger 可自动执行在 Kubernetes 上运行的应用程序的发布过程。具体可参考：https://mp.weixin.qq.com/s/2_Gbthiw8Sy6Moeg8VMYHw。 