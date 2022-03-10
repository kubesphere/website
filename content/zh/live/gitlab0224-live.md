---
title: 在 KubeSphere 上安装和运行极狐GitLab
description: 本次分享将演示如何在 KubeSphere 平台上来安装和运行极狐GitLab 实例。
keywords: KubeSphere, Kubernetes, GitLab
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl:  //player.bilibili.com/player.html?aid=894332841&bvid=BV13P4y1c7Pd&cid=516352531&page=1&high_quality=1
  type: iframe
  time: 2022-02-24 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

极狐GitLab 是一个一体化的 DevOps 平台，提供覆盖软件研发全生命周期的 DevOps 能力，包括项目管理，源码的管理，CI/CD，DevSecOps 等。其有自管理和 SaaS 两种服务提供方式。自管理可以有多种方式进行安装，诸如安装包，Docker，K8s 等。本次分享将演示如何在 KubeSphere 平台上来安装和运行极狐GitLab 实例。

## 讲师简介

马景贺（小马哥），极狐GitLab DevOps 技术布道师，LFAPAC 开源布道师，CDF ambassador，云原生社区管委会成员。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/gitlab0224-live.png)

## 直播时间

2022 年 02 月 24 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220224` 即可下载 PPT。

## Q & A 

### Q1：极狐GitLab 和其他 CI/CD 工具相比有什么优势？

A：极狐GitLab CI/CD 开箱即用，无需安装第三方工具即可使用；使用方便，通过简单书写 yaml 文件即可实现；开发友好，开发人员无需额外的学习成本（语言的学习，诸如 groovy，配置的学习，比如插件配置等），即可快速上手构建自己的 CI/CD Pipeline；和极狐GitLab workflow 的无缝结合，CI/CD Pipeline的结果会在 MR（Merge Request）中展示，以明确显示构建结果，以此来告诉相关人员此 MR 是否应该被合并。

### Q2：极狐GitLab 可以编译打包代码吗？能否自动发布到 KubeSphere 上，实现自动化部署？

A：借助极狐GitLab 的 CI/CD 即可实现代码的编译和打包。如需自动发布到 KubeSphere 上，借助 GitOps 即可，极狐GitLab 使用 Kubernetes Agent Server 来实现 GitOps，而且也是开源的。

### Q3：GitLab ee 版功能比 ce 版功能多很多，极狐GitLab 的功能和 GitLab ee 版相比怎么样？

A：极狐GitLab 对应的版本叫做 JH，包含 EE 版的所有代码，用户在不导入 license 的情况下，可以使用免费的功能，在导入对应的 license 的情况下，可以使用专业版，旗舰版功能。

### Q4：GitHub + Jenkins 转向 GitLab + GitLab CI/CD 的学习成本高吗？

A：学习成本不高，只需要懂 yaml 文件即可，极狐GitLab的官方文档非常之详细，只需阅读官方文档即可快速上手极狐GitLab CI/CD。而且从 Jenkins 迁移到极狐GitLab CI/CD，减少了 Jenkins 的维护，工作量会大大降低。

### Q5：如何实现金丝雀部署？实现原理是什么？

A：金丝雀部署的方式有很多种，比如典型的采用 istio 来做，还有 nginx ingress（我记得最新版本是支持的），flagger等都可以。原理大概就是，根据用户配置的流量配置，将来自不同用户的流量根据不同的配置（比如 istio 的 destinationrule，virtualservice 等）导流至后端的服务。


> 其他问题请参考[问题收集文档](https://docs.qq.com/doc/DQ1VMUlhwVVFCY1J0)。

