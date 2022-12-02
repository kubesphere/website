---
title: '使用 Fluent Operator 在边缘端构建云原生日志管道'
author: '周鹏飞'
createTime: '2022-05-17'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon-eu-2022-fluent-operator-2.png'
---

## 议题简介

Fluent Operator 的前身是 Fluentbit Operator，在构建基于 Fluent Bit 和 Fluentd 的日志层时提供了极大的灵活性。它由 KubeSphere 社区创建，旨在解决以下几个问题：

- 通过像 Fluent Bit 这样的轻量级代理收集 K8s 日志；
- 通过 Kubernetes API 控制 Fluent Bit；
- 可以在不重启 Fluent Bit 和 Fluentd Pod 的情况下更新配置；
- 多租户日志隔离；
- 自动部署和销毁 Fluent Bit DaemonSet 与 Fluentd StatefulSet。
- Fluent Operator 已逐渐成熟，目前已经发布了 v1.0.0，支持 Fluentd 和最新插件，并且几个月前就已经成为了 Fluent 社区的子项目。

在本次分享中，周鹏飞将给大家介绍 Fluent Operator 的架构和全新设计，并通过一个 Demo 来演示如何在 K3s 上使用 Fluent Operator 来处理边缘和 IoT 场景的日志。

## 分享者简介

周鹏飞是 CNCF 和 CDF 大使，同时也是 KubeSphere Member、Fluent Member 和 InfoQ 编辑，热衷于技术布道和推广。他于 2021 年发起并组织了首届中国 Kubernetes Community Days。

## 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeCon-EU-2022-Feynman.mp4" type="video/mp4">
</video>

## 对应文章

整理中