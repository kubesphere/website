---
title: 携程分布式存储实践
description: 本次直播将分享携程近几年 Ceph 的发展历程，监控告警，相关实践，io_uring 使用测试，及混合云架构探索。
keywords: KubeSphere, Kubernetes, Ceph
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=464989966&bvid=BV1DL411j7wV&cid=462915303&page=1&high_quality=1
  type: iframe
  time: 2021-12-16 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

在海量数据时代，面向应用程序和用户的数据存储规模在逐渐扩大。数据量不断增长，也驱动着我们寻找更好的方法来满足用户需求、保护自身的数据。Ceph 在携程数据存储中发展中扮演了不可或缺的角色。

本次直播将分享携程近几年 Ceph 的发展历程，监控告警，相关实践，io_uring 使用测试，及混合云架构探索。

## 讲师简介

张搏航，高级软件工程师。

个人简介：
张搏航，高级软件工程师。2016 年加入携程，目前就职于系统研发团队。主要负责分布式存储架构调优，性能优化和大数据相关运维工作。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/ceph1216-live.png)

## 直播时间

2021 年 12 月 16 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20211216` 即可下载 PPT。

## Q & A

### Q1：生产环境如果是K8S，从数据安全和管理方便的方向推荐用什么存储方案比较好？（比如：Ceph 或者 CSI 插件对接对象存储）、生产环境使用 Ceph 是不是比较依赖有专业存储团队去维护？

A：块存储我们使用的是 RBD，文件存储我们现在使用的是 GlusterFS，也有在尝试开源版JuiceFS+Ceph 对象存储。

### Q2：RBD 是 thin-provision 的，只有实际写入的容量才会计入 Ceph 的已使用量。其供应的容量甚至可以超过整个 Ceph 集群的存储容量，对这个情况，是否有考虑并控制？还是仅关注总容量并扩容?

A：暂时只关注总使用容量来考虑扩容。

### Q3：K8s Pod 挂上 Ceph RBD，如果 Pod 挂掉重启后在别的节点上还能挂上这个 RBD 么？

A：如果 Pod 挂掉之后，K8s 没有正确对 Rbd 从老 Node unmap 掉，会导致 Pod 调度到新 Node 时候无法正常启动，需要人工介入 unmap 或者设置 blacklist 后才能正常调度。

### Q4：Ceph RBD 性能和本地 Disk 比较起来怎么样

A：本地磁盘性能会好，不涉及网络开销，多副本写入强一致性等问题。

### Q5：在实际生产中有对不同的用户或模块做配额管理吗？

A：有对用户做容量限制。

### Q6：RGW 业务量有多大呢 ？多少文件？

A: 50 亿+
 
### Q7：Ceph 还没有支持 K8s 的对象存储，以后会支持吗？

A：这个不太清楚，但是实际上还是有很多方法可以去调度，比如 pod 里直接通过 rest api 方式调用，或者直接装个 s3cmd 来使用。