---
title: 云原生 Meetup 北京站——2024
description: 此次活动，我们邀请到了 SkyWalking 项目创始人、青云科技架构及可观测性团队负责人、江苏纵目科技 APM 研发总监、青云科技容器产品经理、数元灵科技 CTO 以及 Databend Cloud 平台负责人等专家和大咖，为社区的小伙伴们带来精彩的技术分享。
keywords: KubeSphere,Meetup,Beijing,SkyWalking,Kubernetes,Databend,可观测性
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: 
  type: iframe
  time: 2024-05-25 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 北京 + 线上同步直播
  baseIcon: /images/live/base.svg
---

5 月 25 日，由 KubeSphere 社区、纵目科技、Databend 社区联合组织的 Meetup 在北京圆满落幕！感谢各位到现场参与的小伙伴。

**此次活动，我们邀请到了 SkyWalking 项目创始人、青云科技架构及可观测性团队负责人、江苏纵目科技 APM 研发总监、青云科技容器产品经理、数元灵科技 CTO 以及 Databend Cloud 平台负责人等专家和大咖，为社区的小伙伴们带来了精彩的技术分享。**

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-all.jpg)

## 活动时间和地点

- 时间：5 月 25 日 14:00-18:00
- 地点：北京市海淀区北清路 68 号用友产业园中区

## 主办方

- KubeSphere 社区
- 江苏纵目信息科技有限公司
- Databend 社区

## 活动议程回顾

![](http://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525.png)

## 活动内容回顾

### 洞察云原生服务性能--多层次剖析系统性能，分布式追踪不再是万能灵药

讲师：万凯，SkyWalking PMC 成员，Tetrate 工程师。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-wankai.jpeg)

**内容简介：**

云原生环境提供了强大的功能，也带来的巨大的复杂性。SkyWalking v10 在本月全新发布，针对云原生环境，提供了更全面的视角，可以利用 eBPF、OTEL、传统应用探针等对部署在云原生平台的应用进行全方位的整合监控。并能更直接从不同角度反馈应用系统指标以及背后的核心原因。

**议题大纲：**

- 云原生环境下监控的新挑战
- 分布式追踪不再是万能灵药，分布式追踪的局限性
- 监控的新宠 OTel 与 eBPF
- SkyWalking v10 能力介绍

**听众收益：**

更全面的了解云原生环境下监控的挑战，以及需要增强的方向。帮助听众扩展对监控范围的认识。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=1655199982&bvid=BV187421d748&cid=1561538640&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 可观测平台在 KubeSphere 4.x 可插拔架构下的演进

讲师：霍秉杰是青云科技的架构及可观测性团队的负责人。他是 KubeSphere 的创始成员，也是 Fluent Operator、Kube-Events、Notification Manager、OpenFunction 以及最近开源的 eBPFConductor 的发起人及维护者。他热爱云原生技术，尤其是可观测性和与 eBPF 相关的技术，是 KEDA、Prometheus Operator、Thanos、Loki 和 Falco 等项目的贡献者。在自 2019 年以来每年的国内外 KubeCon 上都做过演讲。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-ben.jpeg)

**内容简介：**

KubeSphere 4.0 引入了 LuBan 可插拔架构，KubeSphere 4.1 将 KubeSphere 3.x 的全部功能都适配了 LuBan 可插拔架构，发布了 20+ 扩展组件。用户仅需要首先安装极度精简的 KubeSphere Core 后，再根据需求仅安装自己需要的扩展组件，避免默认安装一些用不到的组件占用资源。KubeSphere 原可观测性相关功能都统一在了 WhizardTelemetry 可观测平台中进行演进，该平台由 10 款 KubeSphere 4.1 的扩展组件构成。本次分享除了介绍 KubeSphere 4.x 的可插拔架构之外，还会重点介绍 WhizardTelemetry 可观测平台在 KubeSphere 4.1 中的架构调整与重构，以及未来的规划（包括在 eBPF 赋能可观测方向的介绍）。

**议题大纲：**

- KubeSphere 4.x LuBan 可插拔架构介绍
- KubeSphere 可观测性相关功能在 4.1 的演进
- WhizardTelemetry 可观测平台介绍及路线图

**听众收益：**

- 了解 KubeSphere 4.x LuBan 可插拔架构
- 了解云原生可观测体系构建
- 了解 WhizardTelemetry 可观测平台

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=1655132217&bvid=BV1Q7421Z7bE&cid=1561545680&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 使用 KubeSphere 部署 Databend，极速启动新一代云原生数据分析平台

讲师：李亚舟，数变科技软件工程师，Databend 云平台负责人，致力于研发易用、可靠的云原生数据仓库服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-liyazhou.jpeg)

**内容简介：**

Databend 是一个开源、完全面向云架构、基于对象存储构建的新一代云原生数据仓库，采用存算分离架构，支持 S3、QingStor、HDFS 等 20 多种对象存储，提供极速的弹性扩展能力，可以为企业提供一个集中式的平台，用于存储、管理和分析大量数据，从而为企业的大规模分析需求保驾护航。同时，Databend 提供云服务 SaaS 模式与 K8s 私有部署模式，用户可以选择适合自己的方式使用 Databend，满足业务负载场景需求。

本分享将会介绍如何使用 KubeSphere 创建和部署 Databend 高可用集群，并使用 QingStor 作为底层存储服务，解锁 Databend 的强大分析能力。

**议题大纲：**

- Databend 简介
- 配置 QingStor 对象存储
- 在 KubeSphere 上部署 Databend
- 使用 Databend 分析用户行为数据

**听众收益：**

- 了解云原生数仓 Databend 的部署和使用过程
- 了解如何在 KubeSphere + QingStor 进行存算分离的数据分析

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=1205239007&bvid=BV1Df42197H5&cid=1561553670&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### SkyWalking 二开企业级实战

讲师：陈修能，江苏纵目信息科技有限公司 APM 研发总监。从 2012 年开始一直在一线从事 Java 研发的工作，有超过 8 年的核心架构维护与开发经验，曾经带领团队给某金融客户开发过核心系统的统一监控平台。19 年开始创业，成立江苏纵目，继续选择运维监控赛道，在可观测性上持续发力，推出一体化可观测性平台 Argus。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-chenxiuneng.jpeg)

**内容简介：**

通过对于 SkyWalking 社区版本的功能拓展和补充，以及 UI 功能的重新设计和实现，在社区版本的基础上大大增强了 SkyWalking 的易用性、美观性以及可操作性，从而实现很多企业级才会有的功能。

**议题大纲：**

- 增强 SkyWalking 的前端监控特性
- MQE 告警页面化配置
- 实现 ClickHouse 底层存储与分析
- 分布式部署的配置下发

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=1655026634&bvid=BV1b7421Z7C2&cid=1561561536&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 以应用为中心的可插拔产品设计 KubeSphere 4.x

讲师：张文浩，青云科技产品经理，负责青云云原生商业化与产品化，深度参与 KubeSphere 开源社区致力于通过产品化的形式赋能用户云原生转型。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-zhangwenhao.jpeg)

**内容简介：**

作为降低 Kubernetes 以及周边生态使用成本的解决方案，多样的功能场景让容器管理平台变得庞大而复杂，这带来了两个严重问题：一方面对团队内部带来了极高的维护成本，另一方面给用户增加了使用复杂度。

本次分享重点围绕如何解决如上两个问题展开对于 KubeSphere 整体形态框架的思考与展望。

**议题大纲：**

- KubeSphere 当前产品体验中长期积累的严重问题
- 当前云原生生态产品中的一些共性问题
- 什么是以应用为中心的交互体验
- 容器管理平台的可扩展性设计展望

**听众收益：**

深度了解 KubeSphere 全新可插拔设计思路。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=1555022133&bvid=BV1K1421q7Ew&cid=1561558925&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 闪电演讲 ⚡️——构建云原生湖仓数据智能一体化架构

讲师：陈绪，数元灵科技联合创始人，CTO，负责 LakeSoul 开源湖仓框架的研发工作。曾就职阿里巴巴，负责集团超大规模分布式模型训练平台的研发工作，支撑了阿里妈妈广告、手机淘宝推荐、蚂蚁芝麻信用分等多个核心业务线的算法模型落地。曾任汇量科技，担任平台架构师，负责全公司大数据、AI 平台的架构研发工作。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-chenxu.jpeg)

**内容简介：**

本次分享分析云原生和数据智能一体化趋势下数据架构的挑战，并分享湖仓一体架构对这些问题的解决方式，优势和应用。

**议题大纲：**

- 在云原生和大数据 AI 一体化的背景下，湖仓一体架构面临的挑战和问题；
- 云原生湖仓一体架构是怎样解决上述挑战和问题，以及这一架构的优势；
- 云原生湖仓一体架构在数据智能场景的应用案例。

**听众收益：**

- 了解在云原生和数据智能一体化背景下，现有数据架构的问题；
- 了解云原生湖仓一体架构的原理、优势；
- 了解云原生湖仓一体架构在数据智能场景的应用。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=1105080916&bvid=BV15w4m1S7Au&cid=1561563253&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## PPT 下载

关注「KubeSphere云原生」公众号，回复关键词 `20240525`，获取 PPT 下载链接。

> 获取 PPT 下载链接后，若手机无法下载，可在电脑端浏览器打开下载。

## 现场精彩画面

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-beijing-20240525-xyz.png)

## 致谢

感谢纵目科技与 Databend 社区对本场活动的大力支持！

感谢 KubeSphere 社区贡献者卢兴民及新道科技对本场活动的大力支持！