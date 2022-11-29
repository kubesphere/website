---
title: KubeSphere + Flux CD 多集群应用的探索
description: 在本次分享中，将介绍 KubeSphere 集成 Flux CD 的探索并分享一个 Demo 案例。
keywords: KubeSphere, Kubernetes, Flux CD , GitOps, Argo CD
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=733023261&bvid=BV1zD4y1e7US&cid=902200128&page=1&high_quality=1
  type: iframe
  time: 2022-11-24 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

GitOps 是云原生环境下的持续交付模型，Flux CD 是实现 GitOps 的一套按需取用的工具集，在本次分享中，将介绍 KubeSphere 集成 Flux CD 的探索并分享一个 Demo 案例。

## 讲师简介

程乐齐，西安电子科技大学研究生，图像工程方向，专注于 K8s 和云原生，开源之夏 2022 KubeSphere 项目中选学生，完成项目 [KubeSphere-DevOps 对接 FluxCD](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2022/ks-devops-fluxcd-integrations_zh-CN.md)。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/fluxcd1124-live.png)

## 直播时间

2022 年 11 月 24 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20221124` 即可下载 PPT。

## Q & A 

### Q1：`application-controller` 是在 Flux CD 项目下的吗，还是自己开发的？应用下发到多个集群，也是由这个组件下发的吗？

A：`application-controller` 是自己开发的，负责监听`gitops.kubesphere.io/v1alpha1/applications` 这个 CRD，解析下发给 Flux CD 的 `kustomize-controller` 或者 `helm-controller` 去做真正的应用下发。

### Q2：Flux CD 也类似于 controller，来处理 `application-controller` 创建出来的资源吗？

A：对的，Flux CD 是由一系列 [controller](https://fluxcd.io/flux/components/ "controller") 组成的，用来处理 `application-controller` 的资源。

### Q3：由这两个 `application-controller` 和 Flux CD 来支持多集群，和由 Karmada 来部署多集群资源，各有什么优势吗？看上去都是由 crd + controller 的形式，只是定义来源不一样？

A：Flux CD 的多集群和 Karmada 的多集群的概念是不一样的，Flux CD 的多集群是人为手动指定的部署位置可以是多集群，Karmada 的多集群是存在集群层面的负载调度。