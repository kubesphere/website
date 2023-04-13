---
title: Jenkins 云原生企业级实践
description: 本次分享介绍了 Jenkins 如何与云原生优雅耦合，以及如何解决遇到的常见问题，CI/CD 多样化需求下如何设计产品与架构等等。
keywords:  KubeSphere, Kubernetes, Jenkins, DevOps, CI/CD
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=782268846&bvid=BV1Z24y1c7dc&cid=1091056235&page=1&high_quality=1
  type: iframe
  time: 2023-04-08 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 深圳 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

王刚峰，联易融云原生架构师。联易融云原生架构师，负责联易融 IaaS 平台、DevOps 平台架构规划，支撑基础系统稳定运行。前腾讯架构师，曾负责腾讯云企业云技术运营，海量 toB 项目运营经验，维护数百个 OpenStack 大中小型集群、维护的 Ceph 存储量超 EB 级，期间降低平台故障率 60%。热爱开源，为多个活跃社区项目贡献过代码与文章，2022 年 OID 讲师。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-wanggangfeng.JPG)

张家华，联易融云原生开发工程师。负责联易融 IaaS 平台、DevOps 平台开发设计。前腾讯 IEG 后台开发，负责 tcaplus（自研 KV 数据库）开发。4 年云存储从业经验，在天融信云计算产品部时参与实现了第一版纯自研云存储。喜欢做性能优化，热爱开源，2022 年 OID 讲师,为多个活跃社区项目贡献过代码与文章。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-20230408-zhangjiahua.JPG)

## 分享主题介绍

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

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-wanggangfeng.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-shenzhen-zhangjiahua.png)

## 听众受益

- 了解在企业使用 Jenkins 作为 CI/CD 引擎时会遇到哪些问题、该如何解决
- 了解 Jenkins 如何与云原生优雅耦合
- 面对 CI/CD 丰富的场景需求，该如何精确做产品设计与架构

## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20230408` 即可下载 PPT。
