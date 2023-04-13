---
title: KubeSphere Meetup 深圳站
description: 本次 Meetup 邀请到了 Flomesh、联易融、青云科技、深圳好上好信息、深圳氦三科技等企业的技术专家，分享多集群、Jenkins、GitOps 以及 KubeSphere 的可插拔架构和应用实践等干货内容。
keywords: KubeSphere, Meetup, ShenZhen, Kubernetes, Jenkins, GitOps, DevOps
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: 
  type: iframe
  time: 2023-04-08 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 深圳 + 线上同步直播
  baseIcon: /images/live/base.svg
---

自 2021 年起，KubeSphere 社区开始走进多个城市组织大规模的 Meetup，这些近距离的线下分享交流会，既增强了社区各位小伙伴之间的连接和联系，又让各位小伙伴享受到了技术盛宴。

2023 年 KubeSphere Meetup 第一站将首次走进深圳，欢迎深圳当地的云原生爱好者和 KubeSphere 用户报名参与。本次 Meetup 邀请到了 Flomesh、联易融、青云科技、深圳好上好信息、深圳氦三科技等企业的技术专家，分享多集群、Jenkins、GitOps 以及 KubeSphere 的可插拔架构和应用实践等干货内容。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-2023.4.8-all.png)

## 活动时间和地点

**活动时间：2023 年 4 月 8 日 14:00——18:00**

**活动地点：深圳市南山区留仙大道 3370 号南山智园崇文园区 2 号楼 3 楼 T2 国际会议厅**

## 活动议程回顾

![](https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-Meetup-shenzhen-20230408.png)

## 活动内容回顾

### 混合多云下的多 K8s 集群和流量管理

讲师：张晓辉，Flomesh 高级云原生架构师、布道师。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-zhangxiaohui.JPG)

**内容简介：**

在今天的云原生应用环境中，许多公司使用多个 Kubernetes 集群来支持其应用程序已变得越来越普遍。

有效的集群和流量管理对于确保现代云原生应用程序的可靠和高效运行至关重要。随着这些应用程序的日益复杂和需要支持高水平的用户流量，高效的流量管理比以往任何时候都更为重要。通过正确管理多个 Kubernetes 集群及其之间的流量，组织可以确保其应用程序顺畅运行，用户获得最佳的体验。

本次分享从多集群的驱动因素出发，介绍如何管理多 Kubernetes 集群并实现应用的跨集群互通来实现应用高可用性、灾难恢复和全局负载均衡。
- 介绍混合多云的驱动因素、技术方案、应用场景
- Kubernetes 多集群管理以及跨集群流量管理的挑战
- 介绍 KubeSphere 的多集群管理
- 介绍 Flomesh 多集群、技术亮点和架构
- KubeSphere 与 Flomesh 一站式的解决方案

> 因直播收音设备问题，本议题直播回放视频未收录声音，后续讲师会进行补录。届时会更新。

### Jenkins 云原生企业级实践

讲师：王刚峰，联易融云原生架构师/张家华，联易融云原生开发工程师

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-wanggangfeng.JPG)

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-zhangjiahua.JPG)

**内容简介：** 

在企业 DevOps 实践初期大都会选择一个大而全、社区活跃的组件作为底层引擎孵化企业自己的 DevOps 平台，这时候使用 Jenkins 则恰到好处的以其稳定可靠的 CI/CD 基础服务与丰富多彩的插件、以及开放的生态解决了先用起来的问题。在云原生大行其道的今天，软件云原生化已成为架构标准，云原生对计算服务提供了高效便捷的编排管理，为当前计算服务生命周期管理方案的不二之选。Jenkins 的软件特性与云原生相得益彰：

- Jenkins 可以使用 K8s 的 pod 作为 Slave，达成了云计算按需分配的特点
- Jenkins 可以通过 K8s 部署，实现高可用与生命周期管理，提高服务交付效率，降低维护成本

但 Jenkins 本身是一个 JAVA 应用，在和 K8s 集成过程中、大规模使用上仍有不少挑战，开源社区方面 KubeSphere DevOps 提供了高效优雅的集成思路，例如从利用 JCasC 自动配置 Jenkins Cloud 到 Jenkins Slave 打包等等，除此之外在企业实践中还遇到了如下关键问题：

- Jenkins 单集群性能瓶颈
- 多 CI 集群的智能调度
- Slave 启动慢的性能问题
- 构建缓存加速
- 流水线构建公共模块提取
- 交叉编译实践
- 轻量级构建解决方案

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=782268846&bvid=BV1Z24y1c7dc&cid=1091056235&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### KubeSphere 可插拔架构前瞻

讲师：万宏明，青云科技研发工程师，KubeSphere Maintainer。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-wanhongming.jpeg)

**内容简介：** 

KubeSphere 4.0 将迎来全新的架构变化，代号 LuBan，实现真正意义上的动态扩展，帮助大家构建一个全栈的 PaaS 平台，本次分享将为大家带来 KubeSphere LuBan 最新的研发进展：

- KubeSphere Extension 是什么
- 如何开发 KubeSphere Extension
- KubeSphere Extension 开发示例

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=654847503&bvid=BV1Ga4y1N71n&cid=1092251258&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 好上好信息 API 微服务集群在 KubeSphere 的部署实践

讲师：徐鹏，深圳好上好信息技术副总监

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-xupeng.jpeg)

**内容简介：**

本次分享为大家介绍了好上好信息如何使用 Kubernetes 和 KubeSphere 管理和优化 DevOps 环境，以便更快地交付产品，提高业务效率并满足客户需求：

- 项目背景
- 新项目挑战
- 为什么选择 KubeSphere
- 实践过程
- DevOps 流程

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=484757502&bvid=BV1PT411W7wx&cid=1091048631&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 借助 Argo CD 实现 GitOps 多环境管理

讲师：王炜，深圳氦三科技技术负责人

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-wangwei.JPG)

**内容简介：**

本次分享介绍了如何使用 Argo CD Generators 和 ApplicationSet 自动管理多套 K8s 环境，并实现“代码即环境”的统一管理方式。此外，还简单介绍了 KubeSphere 的 DevOps 能力以及开发者工具箱 He3。

- 自动多环境适用场景
- ApplicationSet CRD 对象介绍
- 多环境实战
- 分支即环境

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=739790018&bvid=BV1Hk4y1Y7RX&cid=1091067350&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## PPT 下载

关注「KubeSphere云原生」公众号，回复关键词 `20230408`，获取 PPT 下载链接。

> 获取 PPT 下载链接后，若手机无法下载，可在电脑端浏览器打开下载。

## 现场精彩画面

![](https://pek3b.qingstor.com/kubesphere-community/images/shenzhen0408-x.png)

## KubeSphere 用户委员会深圳站正式成立

在本次 Meetup 上，KubeSphere 社区成立了用户委员会深圳站，由来自深圳好上好信息的徐鹏担任站长，来自技研智联的郑建林担任副站长，还有三位委员，分别是：蔡耀辉（深圳好上好信息）、吴妙勇、刘锡锋（深圳市文鼎创数据科技）。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-usergroup.jpeg)

截至目前，KubeSphere 社区用户委员会已经成立 5 站：上海站、杭州站、成都站、广州站、深圳站。

接下来，各个城市站也会持续组织活动，包括 Meetup 和走进企业交流等。

KubeSphere 社区祝愿[社区用户委员会](https://kubesphere.com.cn/user-group/)蓬勃发展，越来越壮大，也欢迎更多的[城市站创建](https://github.com/kubesphere/community/issues/new?assignees=&labels=area%2Fuser-group&template=new_leader.yml&title=REQUEST%3A+New+leader+for+a+User+Group+in+new+city)。

## 致谢

在本次 Meetup 的筹备和组织上，深圳用户委员会的几位成员都做出了自己的贡献，比如联系场地、现场签到、现场拍照、现场发放礼品等。在此，KubeSphere 社区对几位成员深表感谢。
