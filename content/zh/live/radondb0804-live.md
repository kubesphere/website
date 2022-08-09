---
title: RadonDB MySQL K8s
description: 本次分享将从 KubeSphere 出发，探寻一个适合企业的 DevOps 平台打造方式。
keywords: KubeSphere, Kubernetes, RadonDB, MySQL
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=771638819&bvid=BV1tr4y157R4&cid=795798158&page=1&high_quality=1
  type: iframe
  time: 2022-08-04 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

自从 K8s 推出 Statefulset 特性之后，K8s 也能支撑像数据库这样有状态的应用。本次分享主题是 MySQL 在 K8s 平台的运用，介绍数据库平台到容器化的发展历程，MySQL 容器化特性、基础概概念、架构以及运行原理。

## 讲师简介

柯煜昌，青云科技，研发顾问级工程师，有多年数据库内核开发经验。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/radondb0804-live.png)

## 直播时间

2022 年 08 月 04 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220804` 即可下载 PPT。

## Q & A

### Q1：与 Oracle 官方的 MySQL Operator 有啥区别？

A：Oracle 官方的 MySQL Operator 用 Python 写的，功能相对简单，只支持最基本的部署与备份，用的人也非常少。我们用 Go 语言写的，功能比较齐全，支持滚动升级。

### Q2：支不支持逻辑备份？

A：暂时不支持，但是已经在 Roadmap 中，将来会支持。

### Q3：未来会用 MGR 实现高可用么？

A：目前没有哪个厂家将 MGR 部署到 K8s 上，MGR 对网络流量与响应速度有很高的要求，部署 MGR 到 K8s，需要定制 K8s 网络组件。

### Q4：主从的集群会考虑在同一 Pod 中实现吗？

A：K8s 最小调度单位为 Pod，如果放在同一个 Pod 中，无法实现滚动升级与扩展缩容，因此不会考虑这个方案。

### Q5：Statefulset 怎么调度到固定的节点？

A：Statefulset 会为每个 Pod 分配固定的名字与编号，根据名字标号调度到固定的 Pod。