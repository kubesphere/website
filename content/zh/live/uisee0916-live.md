---
title: Kubernetes 控制器原理简介
description: 基于  Inside of Kubernetes Controller PPT (作者 Kenta Iso) 对 Kubernetes 的核心构件 Controller（控制器）的概念和工作原理从高层次的整体视角到低层次的实现视角进行深入的介绍。
keywords: KubeSphere, Kubernetes, Controller
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=633004106&bvid=BV1qb4y127kL&cid=409378884&page=1&high_quality=1
  type: iframe
  time: 2021-09-16 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

基于  Inside of Kubernetes Controller PPT (作者 Kenta Iso) 对 Kubernetes 的核心组件 Controller（控制器）的概念和工作原理从高层次的整体视角到低层次的实现视角进行深入的介绍。

## 讲师简介

张晓濛，驭势科技，云脑多车智能架构师

个人简介：
浙江大学博士，驭势科技云脑多车智能架构师，Kubernetes 爱好者，开源社区爱好者。虽然主业不是 Kubernetes，但是希望基于云原生的思想来思考和反哺自身业务的设计与实现。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/uisee0916-live.png)

## 直播时间

2021 年 09 月 16 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20210916` 即可下载 PPT。

## Q & A

### Q1：调谐过程是起了一个长链接吗，自动驾驶也会用 K8s 吗，具体讲讲怎么实践的？

A：调谐过程只是指观察、分析、动作的控制循环。我想这里的问题应该是从监控事件到触发调谐的整个过程。从 kube-apiserver 监控资源事件是通过 Watch 起了一个长链接，建立之后就会持续监控事件。 

自动驾驶并非只依赖一个车上的服务或算法，在背后，其实云上还有大量的服务对它进行支持。在这种场景下，K8s 对我们进行服务的编排和管理是非常有效的。 

一般我们使用 K8s 对服务进行部署和更新，为服务分配资源，并对服务进行监控等。同时，我们也在简单使用的基础上做了一些扩展，例如，针对自动驾驶对于高可用性的高要求，我们实现了用于热备切换的 K8s Operator，用于服务异常时的主备切换。具体可参见我们之前在 KubeSphere Meetup 北京站上的分享 —— 面向无人驾驶 “云端大脑” 可用性的云原生实践。 

### Q2：讲师可以分享一下 K8s 和 KubeSphere 在实际业务场景中的应用吗？刚简单看了下你们的官网介绍，主要是无人驾驶相关应用场景，云原生究竟在无人驾驶业务发展当中具体带来了哪些价值，另外自动驾驶有边缘计算的场景吗？如果有的话，通过什么平台实现的云边协同？

A：K8s 的容器编排能力、自修复、可移动、可扩展的特性都很符合我们在实际业务场景的需要，是无人驾驶领域关注的问题。稳定可靠的云环境、自动化的运维体验，这些都是云原生带来的价值。KubeSphere 则极大地提升了 DevOps 效率。 

边缘计算在物联网领域很常见，当然是有的。云边协同在业内的实现方式其实很多，驭势也是同样，基于拥抱云原生的理念，让驭势的产品拥有更广阔的道路。

### Q3：Indexer 分成两个队列的话，怎么通过 key 拿到 object 呢？ 

A：Indexer 是缓存（ThreadSafeStore）的 Getter / Setter，我想这个问题应该是之前那张图中 ThreadSafeStore 的两个队列，一个是 key, 一个是 object。这里其实并不是真的两个队列，是一个示意，提示里面既存储了 key 又存储了 object。实际实现是使用的 go 语言中的 map 数据结构，如下所示：

```
type threadSafeMap struct{ 
    items map[string]interface{} 
    ... 
}
```

这里 map 的 key 就是资源的 key, map 的 value 是 object。 

### Q4：它的 DelayingQueue 是怎么实现的？ 

A：DelayingQueue 是延时队列，基于 FIFO 队列接口封装，在原有的基本队列（支持插入元素、获取元素、获取队列长度等操作）基础上增加了 AddAfter 方法，原理是延迟一段时间后再将元素插入 FIFO 队列。数据结构中有个 waitingForAddCh 的 go channel 等待外部元素插入队列，通过 waitingLoop 函数消费元素数据。当元素的延迟时间不大于当前时间时，说明还需要延迟将元素插入 FIFO 队列的时间，此时将该元素放入优先队列中。当元素的延迟时间大于当前时间时，则将该元素插入 FIFO 队列中。另外，还会遍历优先队列中的元素，按照上述逻辑验证时间。 

### Q5：贵司用的 K8s 环境是自己搭建的还是使用云厂商的提供的 K8s 环境？使用集群的规模是什么样子的？ 

A：驭势科技提供自动驾驶云脑公有云 SaaS 平台和私有云两种解决方案。公有云 SaaS 平台使用云厂商提供的 K8s 环境；私有云解决方案可以使用自己搭建的 K8s 环境，亦可以使用客户提供的 K8s 环境。私有云集群规模取决于客户的车辆规模。 

### Q6：市面上 K8s 集群管理平台有很多，为啥选择了 KubeShphere 呢？ 

A：首先源于 KubeSphere 开源社区是一个非常活跃、非常向上的社区，社区氛围很好，有问题回应很积极。这些对于我们和产品、社区共同成长有很大的帮助。 

其次我们比较看中 KubeSphere 能够根据企业使用 K8s 管理平台的痛点持续更新新功能。比如从 2.0 到现在最新的 3.1.1 版本，期间演进了很多面向企业级应用的功能，包括多集群管理、多租户、监控、CI/CD 等等，同时对 K8s 周边生态整合非常好。 

另外 KubeSphere 界面简单易上手，无论对于运维还是开发，使用交互都非常方便，可以让企业（尤其是开发人员）更专注于自身业务研发，无需关心集群管理。
