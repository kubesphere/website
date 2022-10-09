---
title: Kubernetes 节点故障自救方案探索
description: 结合生产环境 Docker runc hang 住导致节点 NotReady 的问题，分享问题排查过程中的思路与经验，以及内核在不同 namespace 间 user pipe 计数逻辑。
keywords: KubeSphere, Kubernetes, 容器, 节点故障
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=645814423&bvid=BV1YY4y1N7eC&cid=840546258&page=1&high_quality=1
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

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220922` 即可下载 PPT。

## Q & A

### Q1：如果不升级 runc，有没有办法解决？

A：升级 runc 是从根本上解决问题，也可以通过放大 pipe-user-pages-soft 来解决，只不过这种方法需要对这个内核参数有足够的把握，否则可能会引起其他问题。

### Q2：helm chart 部署的？

A：本次分享中通过 KubeSphere 来复现节点 NotReady 的问题，主要涉及的是 kubelet 调用 Docker 的逻辑，因此，我这边是通过 KubeSphere 图形化控制台创建了一个 Nginx 来做的。

### Q3：配置的是什么参数？

A：/proc/sys/fs/pipe-user-pages-soft，详见： https://man7.org/linux/man-pages/man7/pipe.7.html。

### Q4：现有环境，有必要优化这个参数吗?目前没遇到问题。

A：建议做下升级，这个升级风险不大的，这个问题官方是做了紧急修复的，可见重要程度 https://github.com/opencontainers/runc/pull/2871。

### Q5：老师出现问题的环境是什么内核版本？

A： 出问题的 runc 版本是 1.0.0-rc93，我这边环境是：
- Kubernetes 1.19.3 
- OS: CentOS 7.9.2009 
- Kernel: 5.4.94-1.el7.elrepo.x86_64 
- Docker: 20.10.6
