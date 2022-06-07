---
title: 基于 KubeSphere 和 Thanos 构建可持久化存储的多集群监控系统
description: 本次分享打算介绍如何在 KubeSphere 集成 Thanos 这个 CNCF 项目，其可以与 Prometheus 组成持久化的高可用集群监控，并且减低存储的费用与支持多租户。
keywords: KubeSphere, Kubernetes, Thanos, Prometheus, 高可用集群监控
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=384705296&bvid=BV1NZ4y1t7fH&cid=736504662&page=1&high_quality=1
  type: iframe
  time: 2022-06-02 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Prometheus 目前是监控的主流软件，其包括含监控服务，告警服务，收集器等一系列组件，但在云原生时代，K8s 的监控带来了更多难题。本次分享打算介绍如何在 KubeSphere 集成 Thanos 这个 CNCF 项目，其可以与 Prometheus 组成持久化的高可用集群监控，并且减低存储的费用与支持多租户。

## 讲师简介

陶然，Jina AI 云架构研发工程师，开源社区爱好者。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/jinaai0602-live.png)

## 直播时间

2022 年 06 月 02 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220602` 即可下载 PPT。

## Q & A

### Q1：Thanos Receiver 模式较于 prometheus remote write to VictoriaMetrics 有哪些优势呢？可以结合适用场景简单介绍下嘛？

A：VictoriaMetrics 是一个开源的时序数据库，可以为 Prometheus 提供 tsdb 的持久化替代。而 Thanos 的话，他组件更多是为 Prometheus 提供对象存储的持久化，和压缩，下采样等功能。如果要说的话，vm 可以为 Prometheus 提供存储层的替代并且提供全局性 query；而 Thanos 可以为 Prometheus 提供云端对象存储的接口，而让用户不需要管理 tsdb 本身，并且提供压缩等功能。

### Q2：query 查询 store 时的去重逻辑是如何实现的?

A：简而言之，query 会将获取到的数据 label 比对去重。这里有比较详细的介绍：https://github.com/thanos-io/thanos/blob/main/docs/components/query.md#deduplication

### Q3：存储有迁移到 VictoriaMetrics 的计划吗？

A：Thanos 与 vm 为 Prometheus 提供两种不同的存储方案，我也不认为 Thanos 会有计划为 vm 提供兼容方案。