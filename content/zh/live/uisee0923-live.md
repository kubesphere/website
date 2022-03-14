---
title: Kubebuilder 使用简介
description: Kubebuilder 是一个帮助快速开发定制资源及控制器的框架工具。和大家一起走进 Kubebuilder，初步了解 Kubebuilder 的基本原理以及使用方法。
keywords: KubeSphere, Kubernetes, Kuberbuilder
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=590717915&bvid=BV1zq4y1o7Lg&cid=413701182&page=1&high_quality=1
  type: iframe
  time: 2021-09-23 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Kubebuilder 是一个帮助快速开发定制资源及控制器的框架工具。本次分享基于上一讲 [Kubernetes 控制器原理简介](https://kubesphere.com.cn/live/uisee0916-live/)，和大家一起走进 Kubebuilder，初步了解 Kubebuilder 的基本原理以及使用方法。

## 讲师简介

张晓濛，驭势科技，云脑多车智能架构师

个人简介：
浙江大学博士，驭势科技云脑多车智能架构师，Kubernetes 爱好者，开源社区爱好者。虽然主业不是 Kubernetes，但是希望基于云原生的思想来思考和反哺自身业务的设计与实现。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/uisee0923-live.png)

## 直播时间

2021 年 09 月 23 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20210923` 即可下载 PPT。

## Q & A

### Q1：对于自己开发的自定义 Controller，一般会监控哪些通用的指标？

A：说到指标监控，我们通常会考虑功能指标、性能指标、可用性指标等，对于用户自定义 Controller，最重要的还是根据用户自身的业务需求去寻找适合自身的指标做监控。

### Q2：client-go 或 Kubebuilder 是如何保证 apiserver 和 local cache 数据一致性的？监听事件会不会有丢失的情况？ 

A：首先，Kubebuilder 本身使用的是建立在 client-go 之上的 [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) 库去实现的，所以这个问题可以描述为 client-go 中是如何保证 apiserver 和 local cache 数据一致性。我们知道 client-go 中的 Informer 会对 apiserver 进行 `ListAndWatch`，这里的 List 就是第一次会通过 apiserver 把 etcd 中的数据全部列举出来存入 local cache 中，并通过 Watch 建立长链接，后续从 apiserver 中监控到有资源数据的变动则同步会更新 local cache 中的数据。通过这种方式，保证了两者数据的一致性。 

其次，Kubernetes 事件是两种触发方式（边缘触发和水平触发）相结合的。边缘触发是有数据变化就触发，水平触发是定时进行重新同步，从而避免边缘触发事件丢失引起的问题。 

### Q3：在一个 Reconciler 中 Watch 多种对象时，`For()` 和 `Watches()` 的主次的区别，具体会影响什么？可以像 client-go 那样，指定事件进入某个特定的队列吗（比如对于同一种对象的事件，根据优先级进入不同优先级的队列）？ 

A：通过 `For()`  的注释我们可以看到，它本身就是相当于调用了 `Watches()`，所以二者在主体功能上可以认为等价，只是 `For()`让用户简化了参数。 

Kubebuilder 中提供了一个 [EventHandler](https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/handler#EventHandler) 模块可以指定监控资源事件并加入 Workqueue 之前做些处理，默认提供的处理方式有三种： 
- 监控本 CR 变化并触发本 CR 的 Reconcile，相当于 `For()`
- 监控本 CR 所拥有的 CR 变化并触发本 CR 的 Reconcile，相当于 `Owns() `
- 监控其他与本 CR 无关的的资源变化并触发本 CR 的 Reconcile，相当于 Watches() 且第二个参数为 `EnqueueRequestsFromMapFunc`
 
通常我们会直接使用默认提供的这几种方式。如果这几种方式仍然不能满足用户需求，如问题中所述场景，用户可以尝试自行实现 EventHandler。
 
### Q4：Operator 一直监听 CR 的资源还是一直监控的操作 CR 的事件，如果整个 CR 未达到期望状态，但 CR 的资源又一直没有发生改变，此时还会进入 Reconcile 方法吗？ 

A：Operator 一直监听 CR 的资源事件。如问题 2 中所述，Kubernetes 除了资源发生改变时会触发事件，还会定时进行同步，即定时触发一个更新事件，此时即使整个 CR 未达到期望状态且 CR 的资源也没有发生改变，还是会进入 Reconcile 方法促使 CR 状态去逼近期望状态。
