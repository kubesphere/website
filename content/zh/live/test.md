---
title: KubeSphere 在直播电商行业的多集群应用实践
description:
css: scss/live-detail.scss

section1:
  snapshot: https://pek3b.qingstor.com/kubesphere-docs/png/20200206170305.png
  videoUrl: //player.bilibili.com/player.html?aid=69124503&bvid=BV1vJ411T7th&cid=119801064&page=1
  type: iframe
  time: 2020-10-13 20:00-20:40
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---

## 导引

随着容器的普及和 Kubernetes 的日渐成熟，企业内部运行多个 Kubernetes 集群已变得非常主流，多集群天然适合业务高可用、异地容灾备份、低延迟、开发生产隔离、避免单一厂商绑定等使用场景，并且很多企业通常会选择将 Kubernetes 多集群分别部署在本地环境+公有云这样的模式来构建容器混合云。本次技术分享将介绍杭州遥望网络公司如何将 KubeSphere 3.0 在生产环境进行落地，并基于 KubeSphere 3.0 打造多集群架构的电商支撑体系，使亿级交易的核心订单交易系统在 KubeSphere 之上平稳运行。
