---
title: OpenFunction v0.5.0 新特性讲解与 v0.6.0 展望
description: 本次分享将整体介绍 OpenFunction，也会讲解 v0.5.0 的新特性以及 v0.6.0 的展望。
keywords: KubeSphere, Kubernetes, Serverless, FaaS, 函数计算, OpenFunction
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=850694353&bvid=BV1tL4y147yY&cid=483897885&page=1&high_quality=1
  type: iframe
  time: 2022-01-13 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

将业务转变为 Serverless 计算模式正逐渐被越来越多的用户所接受，而依托于 Kubernetes 迅速发展起来的云原生生态圈也加速了这一过程。Serverless 可以拆解为两个部分：BaaS 和 FaaS。其中的 FaaS —— 也就是“函数即服务”部分相较于“后端即服务” BaaS 而言，更具中立、多样的特质，因此开源 FaaS 项目应运而生。

今天，云原生 Serverless 领域的技术栈突飞猛进，已孵化出 Dapr、KEDA、Knative 等等优秀的开源项目。这驱使 KubeSphere 团队去寻求一种新的 FaaS 平台解决方案 —— 更多样的函数构建方式、更多样的函数调用类型、更多样的弹性伸缩指标以及更完整的一站式服务能力。

于是 KubeSphere 团队在设计中大胆地引入了最前沿的技术栈，借助开源社区的力量打造新一代的开源函数计算平台 —— OpenFunction。 本次分享将整体介绍 OpenFunction，也会讲解 v0.5.0 的新特性以及 v0.6.0 的展望。

## 讲师简介

方阗，KubeSphere 研发工程师，OpenFunction Maintainer，云原生爱好者。

雷万钧，KubeSphere 可观测性研发工程师，penFunction Maintainer，云原生爱好者。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/openfunction0113-live.png)

## 直播时间

2022 年 01 月 13 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220113` 即可下载 PPT。

## Q & A

### Q1. OpenFunction 和 Knative 之间的关系和区别是什么？

A: OpenFunction 会包含将用户函数转换为可运行应用和将应用构建为 OCI 标准镜像这两个步骤，同时 OpenFunction 还可以负载异步的工作负载，这些是有别于 Knative 的地方。

### Q2. function framework 依赖语言实现，在开发中很多情况都是采用框架，比如 React NextJS 或者 BlitzJS 这些来说他们并没有对外暴露启动入口（提供命令的方式去启动，对于前端开发者来说，去阅读源码并提取入口是困难的），在现在的使用到的 Serverless  服务(阿里，腾讯) 对 function 需要确定的入口，OpenFunction 有对于这一块去解决么？

A: Functions framework 其实是和 builder 共同协作完成用户函数到应用的转换过程，所以这其中不能靠 functions-framework 单独解决的问题可以交给 builder 协同完成。我们之前在关于 nodejs 函数的 functions-framework 实现中也遇到了这个问题，已经有大致的实现方案。

