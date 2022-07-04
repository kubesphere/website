---
title: KubeSphere 3.3.0 社区交流会
description: 本次分享，将为大家解读 KubeSphere 3.3.0 的新特性以及 KubeSphere 4.0 的架构和新功能展望。
keywords: KubeSphere, Kubernetes, 开源, 云原生, 容器
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=982937180&bvid=BV1Yt4y187Lu&cid=760650754&page=1&high_quality=1
  type: iframe
  time: 2022-06-30 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

KubeSphere 3.3.0 已于 6.25 发布，该版本新增了基于 GitOps 的持续部署方案，进一步优化了 DevOps 的使用体验。同时还增强了“多集群管理、多租户管理、可观测性、应用商店、微服务治理、边缘计算、存储”等特性，更进一步完善交互设计，并全面提升了用户体验。本次分享，将为大家解读 v3.3.0 的新特性以及答疑解惑。此外本次分享还会讲解 KubeSphere 4.0 的架构和新功能展望。
## 讲师简介

于爽（Calvin Yu），现任 KubeSphere 容器平台顾问产品经理，参与并研发了多款青云容器相关产品，如 Kubernetes On QingCloud，KubeSphere 等。在加入青云科技之前供职于 IBM，对中间件监控、电子商务等多个领域有深入的研究。
万宏明，KubeSphere 研发工程师 & 核心贡献者，KubeSphere 多租户和安全团队负责人，专注于开源和云原生安全领域。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-v3.3.0-live.png)

## 直播时间

2022 年 06 月 30 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## Q & A

### Q1：关于安全容器方向，有什么计划吗？

A：[KubeKey](https://github.com/kubesphere/kubekey) 可以指定 container runtime 为 kata，欢迎试用。

### Q2：持续部署和流水线怎么样结合起来？

A：已支持。

### Q3：灰度发布考虑集成到流水线或持续部署中吗？

A：在规划中，另外现在通过内置的 Jenkins 结合 Kubectl 和 Nginx Ingress 或者通过 Argo CD 都可以实现灰度发布。

### Q4：监控和告警目前还比较简单，集群和应用监控信息比较少，有下一步的升级计划么？

A：在规划中，会优化可观测的整体体验。

### Q5：灰度部署仅支持前台手动创建的应用，对小白友好，但运维来说不太友好，有考虑支持 Helm 命令部署的应用么？或者已有的其他工作负载？

A：GitHub 已有相关 issue，会在后续版本支持。

### Q6：KubeSphere 4.0 从提出到现在开发已经到最终的 release，刚才提到是 Q3 末，有一个较大的时间跨度，在这期间，是否能进一步详细的来同步设计、进展，以及如何有阶段性的 beta 方便开发者体验测试及提出新的功能想法？

A：今年 Q3 就会发布 alpha 版本，年底会发布正式版。

### Q7：CI/CD 可以配置发布窗口吗？

A：暂时没有，可否在 GitHub 说明一下具体场景和需求。

### Q8：CI/CD 是如何串起来的？

A：请参考流水线使用文档。

### Q9：ARM 架构的适配考虑开放出来么？目前是商业支持。

A：KubeSphere core arm 相关镜像一直是公开的，其他镜像的 arm 支持涉及大量的人力和技术投入，暂时没有开源的计划。

### Q10：KubeSphere 4.0 预计什么时间发布？

A：2022 年底。

### Q11：OpenELB 在 KubeSphere 3.3.0 已经有图形配置了， 有没有完整的集成文档？

A：我们会对这块的文档进行排期。

### Q12：应用资源监控监控，能支持在每个项目中，工作负载的 CPU，内存，磁盘使用率，使用量。以及资源请求，限制。查看监控历史 1-30 天，折线图对比所有服务的使用情况。这也是在 Grafana 经常使用监控的姿势。

A：正在设计中，可以关注 KubeSphere 4.0。

### Q13：现有的告警功能，通知消息在多集群下可能看不出来是哪个集群，项目通知的？

A：KubeSphere 3.3.0 解决了这个问题，多集群下可以看到通知的所属集群。

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220630` 即可下载 PPT。