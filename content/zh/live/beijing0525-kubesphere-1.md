---
title: 可观测平台在 KubeSphere 4.x 可插拔架构下的演进
description: 本次分享除了介绍 KubeSphere 4.x 的可插拔架构之外，还会重点介绍 WhizardTelemetry 可观测平台在 KubeSphere 4.1 中的架构调整与重构，以及未来的规划。
keywords:  KubeSphere, Kubernetes, 可观测性, 可插拔架构, 扩展组件
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=1655132217&bvid=BV1Q7421Z7bE&cid=1561545680&page=1&high_quality=1
  type: iframe
  time: 2024-05-25 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 北京 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

霍秉杰是青云科技的架构及可观测性团队的负责人。他是 KubeSphere 的创始成员，也是 Fluent Operator、Kube-Events、Notification Manager、OpenFunction 以及最近开源的 eBPFConductor 的发起人及维护者。他热爱云原生技术，尤其是可观测性和与 eBPF 相关的技术，是 KEDA、Prometheus Operator、Thanos、Loki 和 Falco 等项目的贡献者。在自 2019 年以来每年的国内外 KubeCon 上都做过演讲。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-ben.jpeg)

## 分享主题介绍

KubeSphere 4.0 引入了 LuBan 可插拔架构，KubeSphere 4.1 将 KubeSphere 3.x 的全部功能都适配了 LuBan 可插拔架构，发布了 20+ 扩展组件。用户仅需要首先安装极度精简的 KubeSphere Core 后，再根据需求仅安装自己需要的扩展组件，避免默认安装一些用不到的组件占用资源。KubeSphere 原可观测性相关功能都统一在了 WhizardTelemetry 可观测平台中进行演进，该平台由 10 款 KubeSphere 4.1 的扩展组件构成。本次分享除了介绍 KubeSphere 4.x 的可插拔架构之外，还会重点介绍 WhizardTelemetry 可观测平台在 KubeSphere 4.1 中的架构调整与重构，以及未来的规划（包括在 eBPF 赋能可观测方向的介绍）。

**议题大纲：**

- KubeSphere 4.x LuBan 可插拔架构介绍
- KubeSphere 可观测性相关功能在 4.1 的演进
- WhizardTelemetry 可观测平台介绍及路线图

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-20240525-p-ben.png)

## 听众受益

- 了解 KubeSphere 4.x LuBan 可插拔架构
- 了解云原生可观测体系构建
- 了解 WhizardTelemetry 可观测平台

## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20240525` 即可下载 PPT。
