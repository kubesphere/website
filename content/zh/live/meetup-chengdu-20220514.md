---
title: 云原生技术交流 Meetup 成都站
description: KubeSphere and Friends 2021，Kubernetes and Cloud Native Meetup 首站上海站顺利举办，围绕“云原生、边缘云、微服务、DevOps”等火热话题，来自 IT、金融、物流、媒体等行业技术大牛、嘉宾以及社区伙伴带来最新的思考与实践。
keywords: KubeSphere, Meetup, Chengdu, Kubernetes, DevOps, OpenFunction, Fluent-operator
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: 
  type: iframe
  time: 2022-05-14 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 成都 + 线上同步直播
  baseIcon: /images/live/base.svg
---
![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-all.JPG)

<center>5 月 14 日</center>

<center>由 KubeSphere 社区和 SOFAStack 社区联合主办</center>

<center>云原生 Meetup 成都站取得圆满成功🎉🎉🎉</center>

<center>围绕“DevOps、容器镜像、Serverless、分级管理、云原生应用配置、日志管理”等火热话题</center>

<center>思码逸、蚂蚁集团、OpenFunction 社区、航天网信、KubeSphere 社区的技术大牛和嘉宾</center>

<center>带来了最新的思考与实践</center>

<center>都有哪些令人难忘的精彩环节和瞬间呢？</center>

<center>一起来看看</center>

<center>↓</center>

## 开源 DevOps 工具链整合可以更简单

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-hutao.JPG)

讲师：胡涛，思码逸 DevOps 专家

演讲概要：本次分享围绕着一些基础问题的展开，比如：什么是一站式 DevOps 平台，一站式 DevOps 平台的优劣势是什么等。进一步讨论了云原生和微服务等理念背后的价值，还有开源 DevOps 工具链的优劣势等问题。接着又聊了 KubeSphere 的价值，KubeSphere 解决了哪些问题等，进一步引出在 DevOps 工具链管理方向 DevStream 所做的一些思考与尝试。最后畅想了 DevStream 与 KubeSphere 如何“双剑合璧”一起落地 DevOps 工具链。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=511560759&bvid=BV1Pu41167Th&cid=721563337&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## Nydus - 面向下一代的容器镜像

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-yansong.JPG)

讲师：严松，蚂蚁集团技术专家

演讲概要：镜像是容器基础设施中的一个重要部分。目前 OCI 标准镜像的一个缺陷是容器需要等待整个镜像数据完成下载后才能启动，这导致了在容器启动时消耗了过多的端到端时间，在大规模集群场景下，这对网络与存储负载的影响尤为明显。本议题介绍了开源容器镜像加速项目 Nydus 在构建，分发与运行时等整个容器镜像生命周期中的一些深入思考，从实践上展现镜像加速在镜像性能与安全性方向上的一些探索。近期 Nydus 运行时项目 Nydus Snapshotter 成为了 Containerd 的子项目，也与内核态 EROFS 做了深度集成，成为了 Kata Containers 安全容器原生集成的镜像加速方案。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=939016870&bvid=BV1sT4y1B7oL&cid=721573712&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 镜像构建技术 Buildpacks 的原理及在 FaaS 平台中的实践

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-fangtian.JPG)

讲师：方阗，OpenFunction Maintainer

演讲概要：本次分享介绍了 Cloud Native Buildpacks，它具备成为 Dockerfile 之后主流的镜像构建技术的潜力。在分享中我们讲解了 CNB 的组成与原理，以及谈到了它的最佳使用场景和在开源云原生 FaaS 框架 OpenFunction 中实践与应用。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=554062007&bvid=BV1Kv4y1N7DQ&cid=721576758&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 基于 KubeSphere 的分级管理实践

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-xuwei.JPG)

讲师：许伟，航天网信研发工程师

演讲概要：KubeSphere 解决了用户构建、部署、管理和可观测性等方面的痛点，它的资源可以在多个租户之间共享。但是在资源有权限等级的场景中，低等级资源可以操作高等级资源，造成资源越权管理的问题。为解决这一问题，航天网信在 KubeSphere 的基础上进行了改造，以适应租户与资源之间和资源与资源之间的分级管理，同时在项目的网络策略中，增加黑名单和白名单策略，增强了项目间的网络隔离，让资源的管理更安全。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=214069597&bvid=BV1aa411J7Yw&cid=721579413&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 云原生应用配置代码化实践

讲师：何子波，蚂蚁集团高级技术专家

演讲概要：K8s 提供了一个高度开放可扩展，基于配置&策略驱动的 Infra 架构，并根据使用场景划分了不同的模型群组，植入了一切皆可配置描述的思路，随着蚂蚁整体的运维架构向云原生方向演进，如何做好大规模云原生应用基础设施配置管理成为一个新的 Hard Problem。本议题介绍了蚂蚁如何基于可编程配置代码化思路构建应用声明式配置描述，实现应用基线配置体系的下一代架构演进，并结合具体场景展现配置代码化及 Kusion 技术栈的落地实践。同时 Kusion 技术栈的开源准备工作正在推进，预期很快就会对外正式开源。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=641570888&bvid=BV1ZY4y147YA&cid=721581357&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 从 Fluentbit-operator 到 Fluent-operator

![](https://pek3b.qingstor.com/kubesphere-community/images/chengdu0514-chengdehao.JPG)

讲师：程德昊，青云科技研发工程师

演讲概要：随着云原生技术的不断发展与迭代，我们对于日志的采集、处理及转发提出了更高的要求。云原生架构下的日志方案相比基于物理机或者是虚拟机场景的日志架构设计存在很大差别。作为 CNCF 的 毕业项目，Fluentd 以及 Fluent Bit 无疑为解决云环境中的日志记录问题的首选解决方案之一。但是在 Kubernetes 中安装部署以及配置 Fluentd 以及 Fluent Bit 都具有一定的门槛，加大了用户的使用成本。于是 Fluent Operator 也就应运而生，它可以灵活且方便地部署、配置及卸载 Fluent Bit 以及 Fluentd。同时, 社区还支持 Fluentd 以及 Fluent Bit 的海量插件，用户可以根据实际情况进行定制化配置。官方文档提供了详细的示例，极易上手，大大降低了 Fluent Bit 以及 Fluentd 的使用门槛。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=426507696&bvid=BV113411N7ji&cid=721591563&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>


> 云原生 Meetup 圆满收官！可扫描官网底部二维码关注 「KubeSphere云原生」 公众号，后台回复 `云原生成都0514` 获取下载链接。