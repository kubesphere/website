---
title: Curve 分布式存储设计
description: 本次主要分享 Curve 项目的由来，并分别介绍 CurveBS 和 CurveFS，并说明两个存储系统的应用场景、挑战以及我们如何设计来达成设计目标。最后分享一下 CurveBS 与 CurveFS 的 Roadmap 发展方向以及 Curve 的社区具体情况。
keywords: KubeSphere, Kubernetes, Curve, 存储
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=474116094&bvid=BV1kK411Q7pR&cid=861240651&page=1&high_quality=1
  type: iframe
  time: 2022-10-13 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次主要分享 Curve 项目的由来，分别介绍 Curve 块存储和 Curve 文件存储的应用场景、挑战以及我们如何设计来达成设计目标。最后分享 Curve 块存储与 Curve 文件存储的 Roadmap 发展方向以及 Curve 的社区具体情况。

## 讲师简介

程义，Curve Maintainer、网易高级服务端开发工程师。2021 年加入网易 Curve 开发团队。参与 Curve 文件存储和 Curveadm 项目开发，负责 Curve 工具重构。热爱开源，相信热爱的力量。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/curve1013-live.png)

## 直播时间

2022 年 10 月 13 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20221013` 即可下载 PPT。

## Q & A

### Q1：Curve 目前有成熟的使用案例吗？

Answer: Curve 分为块存储和文件存储。
- 对于块存储：目前有两种使用案例，一个是 OpenStack + Curve 块存储作为虚拟机解决方案，本方案有外部用户已经线上使用，网易也在线上使用了 3 年左右，网易内部的各业务都在使用中。一个是 PFS + Curve 块存储作为云原生数据库的存储底座，本方案对接 MySQL 云原生数据库已经在网易内部业务使用半年左右的时间，本方案还可以对接 PolarDB，有用户尝试使用。
- 对于文件存储：目前有两种使用案例，一个是做为 ES + Curve 文件存储作为冷数据存储，内部已有使用案例，线上使用 1 个季度左右；一个是 Curve 文件存储 + S3 作为 AI 场景下用于训练的文件系统，适用于 TensorFlow、pytorch 等框架，目前有业务正在测试，训练过程中读性能满足，但分布式训练场景下的写性能还不满足（单机训练性能是满足的），正在做优化。

### Q2：Curve 是如何提供云原生存储能力的？

Answer: 目前 Curve 是对接了 CSI，用户在 K8s 上可以通过 CSI 对接 Curve 服务。Curve 服务在 K8s 上的部署正在支持中，有兴趣的同学可以关注： https://github.com/opencurve/curve/discussions/1948。

### Q3：Curve 是否支持热更新，更新过程中是否会影响业务？

Answer: Curve 块存储支持热更新，更新过程中，我们采用 server 和 client 的设计，更新过程中可能有秒级 io 抖动，可以基本做到用户无感知。Curve 文件存储当前是基于 fuse 实现的，热升级功能也在 Roadmap 中，做了初步的调研，感兴趣的小伙伴可以参与开发。

### Q4：对象存储和块存储区别？

Answer: 可以参考下这个回答： https://www.alibabacloud.com/zh/knowledge/difference-between-object-storage-file-storage-block-storage。

### Q5：Curve 什么时候入驻 KubeSphere 应用商店？

Answer: 近期会入驻。代码已经改完了，待发布。

### Q6：mds主没有性能问题吗？

Answer: 没有，mds 不在 io 的关键路径上，主要是做一些管控面的事情，所以不会有性能问题。

更多 mds 了解： https://github.com/opencurve/curve/blob/master/docs/cn/mds.md

更多 io 路径了解： https://github.com/opencurve/curve/blob/master/docs/cn/curve-client.md

### Q7：逻辑 chunkid 与物理 chunkid 映射什么建立的，是创建文件的时候吗?如果是写时更新那需要 mds 插入这条映射元数据了？

Answer: 写时创建的，是的。

### Q8：为啥 mds 不用 raft 做高可用？用 etcd 出于简单?

Answer: 是的。开发初期是为了能更快的完成系统功能。目前对于 kv 需求的服务来说，raft + rocksdb 是高可用比较成熟的方案，Curve 文件存储目前已经有了 raft + rocksdb 的组件，可以使用的 mds 上。如果有感兴趣的小伙伴，可以尝试支持。

### Q9：块存储支持秒级快照吗，有计划吗？文件存储有快照支持吗？

Answer: 块存储支持秒级快照，快照是lazy的，使用cow技术。快照的说明可以参考：https://github.com/opencurve/curve/blob/master/docs/cn/snapshotcloneserver.md
文件存储的快照支持在roadmap中。

### Q10：我们存储的性能，有没有跟别的存储解决方案，做过对比？

Answer: 在我们的[官网](https://github.com/opencurve/curve)有和 Ceph 进行对比，欢迎登录查看。

### Q11：Curve 支持动态扩容吗？

Answer：支持动态扩容，关于 Curve 如何扩容可以参考： https://github.com/opencurve/curveadm/wiki/scale-curve。

### Q12：Curve 支持副本手动调整吗？

Answer: 可以通过工具手动调整单个复制组的副本，但不支持批量调整。

### Q13：在快照创建完成前不能再创建快照吧？

Answer: 是的。

### Q14：块存储客户端会缓存文件元数据吗？老师说 mds 不参与 io？mds 没有性能问题?

Answer：块的客户端会缓存文件元数据，更多的信息参照问题 6。
