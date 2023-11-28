---
title: 云原生 + 可观测性 Meetup 广州站
description: 此次 Meetup，我们邀请到了 KubeSphere、DeepFlow、SkyWalking 等社区的技术专家们，来为大家分享云原生及可观测性主题的技术干货。
keywords: KubeSphere, Meetup, Guangzhou, Kubernetes, DeepFlow, SkyWalking
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: 
  type: iframe
  time: 2023-11-25 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 广州 + 线上同步直播
  baseIcon: /images/live/base.svg
---

![](https://pek3b.qingstor.com/kubesphere-community/images/meetup-guangzhou-20231125-all.JPG)

2023 年 11 月 25 日，云原生 + 可观测性 Meetup 广州站圆满落幕。

此次 Meetup，我们邀请到了 KubeSphere、DeepFlow、SkyWalking 等社区的技术专家们，来为大家分享云原生及可观测性主题的技术干货。

## 活动时间和地点

- 时间：2023 年 11 月 25 日 14:00-18:00
- 地点：广州国际科技成果转化（天河）基地三楼星空厅

## 活动组织方

### 主办方

- KubeSphere 社区
- DeepFlow 社区

### 协办方

- 广州市天河区软件和信息产业协会
- 开源科技OSTech
- 广州（国际）科技成果转化天河基地

## 议程海报

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-meetup-guangzhou-20231125.png)

## 活动内容回顾

## 议题 1：DeepFlow 在中国移动磐基 PaaS 平台的实践

### 讲师

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-lucheng.JPG)

卢城，中移信息技术有限公司高级研发工程师，中国移动磐基平台运维研发，负责指标监控、可观测性平台相关工作，目前致力于将 DeepFlow 引入到中移磐基平台的监控体系。

### 议题简介

我国“十四五”规划纲要明确提出“迎接数字时代，激活数据要素潜能，推动网络强国建设，加快建设数字经济、数字社会、数字政府，以数字化转型整体驱动生产方式、生活方式和治理方式变革，实施上云用数赋智行动。”为积极响应国家政策，中国移动基于云原生技术体系，打造架构先进、自主可控的统一技术底座-磐基 PaaS 平台。其中可观测平台是其中的重要组成部分。本次介绍平台引入基于 eBPF 技术的 DeepFlow 可观测性工具，弥补当前复杂网络拓扑和内核资源监控能力的不足，完善云原生场景下的可观测图谱。

### 议题大纲

- 磐基 PaaS 平台介绍
- 为什么引入 DeepFlow
- 基于 eBPF 的可观测实践
- 落地业务场景分析和未来规划

> 因讲师要求，本议题直播回放及 PPT 不对外公开分享。

## 议题 2：蜘点云原生之 KubeSphere 落地实践过程

### 讲师

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-chixiaodong.JPG)

池晓东，蜘点商业网络服务有限公司技术总监，从事软件开发设计 10 多年，喜欢研究各类新技术，分享技术。

### 议题简介

本次分享会介绍蜘点商业网络服务有限公司平台从 0 到 1，从单体项目到微服务云原生的实施过程，以及在这个过程中遇到的坑。

### 议题大纲

- 公司及平台介绍
- 云原生进程
- 为什么选择 KubeSphere
- 落地实践
- 使用效果

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=621453031&bvid=BV1Ab4y1M7B5&cid=1345832474&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 议题 3：DeepFlow 扩展协议解析实践

### 讲师

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-zhengzhicong.JPG)

郑志聪，云原生技术爱好者并对可观测性技术深耕多年，DeepFlow、Thanos、Kube-state-metrics 等多个云原生开源项目的 Contributor。

### 议题简介

MongoDB 目前使用广泛，但是缺乏有效的可观测能力。DeepFlow 在可观测能力上是很优秀的解决方案。但是却缺少了对 MongoDB 协议的支持。为 DeepFlow 扩展了 MongoDB 协议解析，增强 MongoDB 生态的可观测能力，本次分享从协议文档分析到在 DeepFlow 内实现代码解析的过程拆解。

### 议题大纲

- 如何在 DeepFlow 中扩展新协议-MongoDB
- 利用 Wasm 插件采集业务信息
- MongoDB 协议解析完效果展示

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=921401645&bvid=BV1Nu4y1A7ZC&cid=1345829549&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 议题 4：OpenKruiseGame 助力游戏运维管理提效

### 讲师

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-liuqiuyang.JPG)

刘秋阳，阿里云高级研发工程师，OpenKruiseGame 社区 Maintainer，长期从事云原生在游戏领域的研发工作，致力于推动游戏原生化转型与落地。

### 议题简介

OpenKruiseGame（OKG）是一个面向多云的开源游戏服 Kubernetes 工作负载，是 CNCF 孵化项目 OpenKruise 在游戏领域的子项目，致力打造游戏云原生化理想路径，让游戏服的云原生化变得更加简单、快速、稳定。本次分享将基于 OKG 的特性与功能，介绍 KubeSphere 如何支持 OKG 可视化操作，实现云原生游戏白屏化运维后台，进一步降低企业游戏服容器化的管理成本。

### 议题大纲

- 游戏云原生化的时代浪潮
- OpenKruiseGame 特性/功能介绍
- 云原生游戏白屏化运维后台展示

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=748948642&bvid=BV16C4y1w7jV&cid=1345824813&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 议题 5：基于 SkyWalking 实现全域可观测

### 讲师

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-chenxiuneng.JPG)

陈修能，江苏纵目信息科技有限公司 Argus 团队研发总监，拥有 10+年的 Java 开发经验，一直从事金融、电商领域的核心运维监控平台的研发和架构，精通 Zabbix，SkyWalking，Cat 等项目的源码，
并且对于如何深度协同二开做全域可观测有深刻的见解。

### 议题简介

SkyWalking 目前已经发展到了 V9 的版本，功能上面有了非常大的提升，从对接普罗米修斯的 exporter 到支持外部日志的写入，到 tracing 的采集，都可以在一套 SkyWalking 集群上实现，纵目目前基于 V9 版本开发了 ArgusAPM 产品，结合 ClickHouse 大大优化了存储的效率和性能，同时结合 WebFunny 前端监控的能力，无缝对接了 SkyWalking 前端采集，大大增强了对端侧性能以及体验的可观测。

### 议题大纲

- SkyWalking V9 带来了哪些新特性
- SkyWalking 结合 ClickHouse 优化存储模型
- ArgusAPM 如何实现全域可观测

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=706430813&bvid=BV1EQ4y1t7dg&cid=1345834171&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 议题 6：大模型网络优化方法——闪电演讲 ⚡️

### 讲师

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-wangjing.JPG)

王静，天翼云研发专家，专注于智算平台的网络优化和能力建设，目前成功落地千卡级别的 AI 大模型平台。

### 议题简介

主要分享一下，大模型网络优化方法包括 IB 网络优化和 ROCE 网络优化的若干方法。

### 议题大纲

- IB 网络优化方法
- ROCE 网络优化方法

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=451490195&bvid=BV1Zj411L7SS&cid=1345860870&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## PPT 下载

关注「KubeSphere云原生」公众号，回复关键词 `20231125`，获取 PPT 下载链接。

> 获取 PDF 下载链接后，若手机无法下载，可在电脑端浏览器打开下载。

## 现场精彩画面

![](https://pek3b.qingstor.com/kubesphere-community/images/guangzhou-meetup-20231125-xyz.png)

## 致谢

感谢 DeepFlow 社区对本场活动的支持！

感谢活动支持方：广州市天河区软件和信息产业协会、开源科技OSTech、广州（国际）科技成果转化天河基地。

感谢各位讲师贡献的精彩演讲和分享！

感谢 KubeSphere 社区用户委员会广州站的站长裴振飞、副站长胡卓超以及委员刘星、王静对本次活动的贡献！