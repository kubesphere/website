---
title: '用云原生无服务器技术构建现代 FaaS（函数即服务）平台'
author: '霍秉杰，雷万钧'
createTime: '20 21-12-10'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-ben.png'
---

## 议题简介

作为无服务器的核心，FaaS（函数即服务）越来越受到人们的关注。新兴的云原生无服务器技术可以通过用更强大的云原生替代方案替换 FaaS平台的关键组件，从而构建一个强大的现代 FaaS 平台。在本次分享中，OpenFunction 的维护人员分享讨论：

- 构成 FaaS 平台的关键组成部分，包括函数框架、函数构建、函数服务以及函数事件管理。
- 新兴云原生无服务器技术在 FaaS 各个关键领域中的优势，包括 Knative 服务、Cloud Native Buildpacks、Shipwright、Tekton、KEDA 和 Dapr。
- 如何以 OpenFunction 为例，利用这些云原生技术构建强大的现代 FaaS 平台。
- 事件管理对 FaaS 很重要的原因。既然已经有了 Knative eventing 和 Argo Events，为什么 OpenFunction 还要创建自己的事件管理系统“OpenFunction Events”?

## 分享者简介

霍秉杰，云原生 FaaS 项目 OpenFunction Founder；FluentBit Operator 的发起人；他还是几个可观测性开源项目的发起人，如 Kube-Events、Notification Manager 等；热爱云原生和开源技术，是 Prometheus Operator, Thanos, Loki, Falco 的贡献者。

雷万钧，OpenFunction Maintainer，负责开发 OpenFunction；FluentBit Operator 的维护者；KubeSphere 可观测性团队的成员，负责 Notification Manager 的开发；云原生和开源技术的爱好者，fluent bit 和 nats 的贡献者。

## 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeCon2021-China-Ben.mp4" type="video/mp4">
</video>

## 对应文章

整理中，敬请期待