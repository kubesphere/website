---
title: 基于 KubeSphere & Crane 的成本优化实践
description: 本次分享将介绍如何在 KubeSphere 管控的集群内安装 Crane 并使用资源推荐和动态调度优化 Kubernetes 集群的成本。
keywords: KubeSphere, Kubernetes, PostgreSQL, RadonDB
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=898470386&bvid=BV1vN4y1T73t&cid=773921427&page=1&high_quality=1
  type: iframe
  time: 2022-07-14 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Crane 是腾讯开源的基于 Kubernetes 的降本增效项目。本次分享将介绍如何在 KubeSphere 管控的集群内安装 Crane 并使用资源推荐和动态调度优化 Kubernetes 集群的成本。

## 讲师简介

胡启明，腾讯云容器技术专家，开源项目 Crane 的 Founder 和负责人。曾在蚂蚁集团，SAP 等多家公司任职，专注 Kubernetes 云原生领域 8 年，Kubernetes, Dapr, KubeEdge 等多个开源项目 Contributor。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/crane0714-live.png)

## 直播时间

2022 年 07 月 14 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220714` 即可下载 PPT。

## Q & A

### Q1：这个和 keda hpa 扩容一样？

A：资源推荐和 keda hpa 是解决不同问题的。资源推荐解决的是应用配置不当导致的资源浪费问题，通过资源推荐可以分析历史用量给出更合理的资源配置，而 keda hpa 是通过 event driving 调整副本数进行水平弹性。

### Q2：官方文档地址

A： https://github.com/gocrane/crane

### Q3：腾讯云 TKE 有类似的工具么？

A：腾讯云上可通过 helm/chart 包安装 Crane。

### Q4：商店中找不到是因为 KubeSphere 版本吗？

A：Crane 在 6 月 24 号加入了 KubeSphere 的应用商店，KubeSphere 3.2.0 版本以上的用户应该可以实时从 GitHub 上拉到最新的应用 Crane，如果没有搜索出来可能是网络不通。

### Q5：如何动态修改 requests？是说现在版本不支持是吗？现在如果修改的话，是针对 deployment 还是 pod？修改后 pod 会重启吗？

A：目前 K8s 版本修改 requests 会导致 pod 重建，1.25 版本以上 K8s 可能会支持动态修改 requests。

### Q6：与 Autopilot 的 VPA 的区别？

A：相比 VPA，资源推荐更轻量化，且更灵活。

- 算法：算法模型采用了 VPA 的滑动窗口（Moving Window）算法，并且支持自定义算法的关键配置，提供了更高的灵活性

- 支持批量分析：通过 Analytics 的 ResourceSelector，用户可以批量分析多个工作负载，而无需一个一个的创建 VPA 对象

- 更轻便：由于 VPA 的 Auto 模式在更新容器资源配置时会导致容器重建，因此很难在生产上使用自动模式，资源推荐给用户提供资源建议，把变更的决定交给用户决定

### Q7：动态调度器与 K8s 的冲突吗？

A：动态调度器是基于 K8s 的 scheduler framework 框架实现的，因此和 K8s 不冲突。

### Q8：可以根据 K8s pod 应用状态码扩容嘛？比如 Java 的假死了，接口状态码不是 200。扩容 pod？

A：Crane 的 effective HPA 支持基于自定义指标的扩容。不过如果 Java 假死了，此时 metric 可能收集不到，也就无法扩容了。

### Q9：支持短延迟的函数计算场景吗？

A：Crane 的 effective HPA 支持针对函数计算场景的弹性扩缩容。资源推荐也支持基于 K8s 架构的函数计算场景。