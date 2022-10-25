---
title: Kubernetes 多集群管理架构探索
description: 本议题会带大家了解一下为什么需要集群联邦以及这个领域过去和现在流行的项目，期望能让大家了解到一些基本概念以及如何上手。
keywords: KubeSphere, Kubernetes, 多集群
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=261837329&bvid=BV1Fe41157Br&cid=867492934&page=1&high_quality=1
  type: iframe
  time: 2022-10-20 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本议题会带大家了解一下为什么需要集群联邦以及这个领域过去和现在流行的项目，期望能让大家了解到一些基本概念以及如何上手。

## 讲师简介

徐信钊，青云高级软件工程师，目前负责维护 KubeSphere 多集群等模块。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/multicluster1020-live.png)

## 直播时间

2022 年 10 月 20 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20221020` 即可下载 PPT。

## Q & A 

### Q1：KubeSphere 添加集群的时候 kubefed 偶尔会出现同步用户会很慢，大概要 10 分钟才能同步，导致登陆子集群没法访问，不知道老师有遇到过这种情况没？

A：正常情况下这个是很快的，10 分钟大概是遇到特定情况下的 bug 了，比如之前版本我们在 LDAP 场景下会遇到这种类似的 bug，但是这个在新版本已经修复了，所以你这个问题得单独分析，你可以提一个 [issue](https://github.com/kubesphere/kubesphere/issues) 描述清楚你的问题、环境信息和组件有没有报错日志之类的，我们再一起分析一下是什么问题。

### Q2：在跨集群通信上有什么计划吗？比如 Redis 实例跨集群通信？

A：跨集群通信可以通过 Karmada 来实现，KubeSphere 本身没有这方面的计划，你可以借助支持这类功能的插件来实现，比如 Karmada：https://karmada.io/docs/userguide/service/multi-cluster-service 可以参考一下这块的文档.

### Q3：KubeSphere 4.0 做插件化改造以后，是不是纳管子集群只要一个 kubeconfig 就行，不需要在子集群安装一套 KubeSphere？

A：是的，可以这样理解，4.0 之后 ks-core 是一个非常小和轻量的组件，虽然还是要在子集群部署一套 ks-core，但是它相比之前版本的 KubeSphere 已经非常非常轻量了，只有 2-3 个组件（Pod）.

### Q4：集群联邦管理多个集群，被管理的集群必须暴露 API Server 吗？还是有 agent 的方式，不需要暴露被管理集群的 API Server。托管集群需要重新生成证书吗？

A：KubeSphere 有 agent 方式，对于 agent 方式就不需要考虑证书了，证书会由我们的 tower 组件来负责维护，具体可以参考文档：https://kubesphere.com.cn/docs/v3.3/multicluster-management/enable-multicluster/agent-connection/。

### Q5：Karmada 跨集群通信对于基础网络环境的要求是什么呢?

A： 这个应该和 CNI 这些插件有关系，具体可以参考 Karmada 的文档：https://karmada.io/docs/userguide/service/multi-cluster-service。

### Q6：Karmada 多集群的权限管理、资源监控、是否也都可以方便的统一管理？

A： 可以的，KubeSphere 计划是深度集成 Karmada，到时候大家依然是在 KubeSphere 平台上创建联邦应用等，但是背后的执行者是 Karmada。

### Q7：子集群 K8s 证书过期，更新证书后，KubeSphere 就连不上子集群了，一点就跳到登录界面，怎么办？

A： 这个问题也要具体分析，目前我们在 3.3 版本上线了集群过期提醒和直接在 UI 上更新集群 kubeconfig 的功能，对于之前的版本需要手动更新 Cluster CR 里面的 kubeconfig，理论上来说只要正确更新了，几乎马上就会恢复的，可以提一个 issue 描述清楚问题、环境信息和组件有没有报错日志之类的，我们再一起分析一下是什么问题。

### Q8：对于异构算力（如 A 集群 X86，B 集群 ARM），Karmada 如何进行策略化地调度呢？

A： 你可以将你的集群增加一个新的 Label 用来标识该集群的架构类型，之后在使用 Karmada 分发应用的时候，在分发策略上加上 LabelSelectors 用来筛选将该应用分发到 X86 集群或是 ARM 集群。

### Q9：跨多集群部署服务后，当有集群故障后，想让副本可以自动迁移到其他集群，如何实现？

A： 这个也是需要具体多集群框架来实现的，比如 Karmada 是支持的，Karmada 有 descheduler 这个概念，它就是用来实现你的这个需求，当一个集群故障了，它就把那个集群上的副本驱逐了，然后会触发 scheduler 重新调度，会再在新的可用集群上创建副本。