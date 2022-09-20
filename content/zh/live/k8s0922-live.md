---
title: Kubernetes 节点故障自救方案探索
description: 结合生产环境 Docker runc hang 住导致节点 NotReady 的问题，分享问题排查过程中的思路与经验，以及内核在不同 namespace 间 user pipe 计数逻辑。
keywords: KubeSphere, Kubernetes, 容器, 节点故障
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: 
  type: iframe
  time: 2022-09-22 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享将结合生产环境 Docker runc hang 住导致节点 NotReady 的问题，分享问题排查过程中的思路与经验，以及内核在不同 namespace 间 user pipe 计数逻辑。

## 讲师简介

莫红波，杭州又拍云科技有限公司容器技术负责人。从 2014 年首次接触到 Docker 就深深被容器技术吸引。从单机 Docker 到 Mesos 再到 K8s，拥有多年容器平台开发以及容器编排运维经验。热爱开源，钟情云原生，曾给 KubeSphere 贡献 PR 并被接收。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/k8s0922-live.png)

## 直播时间

2022 年 09 月 22 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654


