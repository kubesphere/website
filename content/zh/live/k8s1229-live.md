---
title: 华能信托核心业务系统 Kubernetes 落地实践
description: 本次分享将介绍信托核心交易系统的 K8s 落地实践过程，包括技术选型，自动化构建，自动化运维监控等。
keywords: KubeSphere, Kubernetes, DevOps
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=734486389&bvid=BV1UD4y1j7E5&cid=942378159&page=1&high_quality=1
  type: iframe
  time: 2022-12-29 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享将介绍信托核心交易系统的 K8s 落地实践过程，包括技术选型，自动化构建，自动化运维监控等。

## 讲师简介

王昆，东北大学计算机专业硕士，华能贵诚信托基础架构师，先后负责核心业务系统开发，基础平台搭建，以及网络安全负责人，拥有 CKA、CKS 等证书，自主搭建私有云以及云原生混合金融基础设施平台。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/k8s1229-live.png)

## 直播时间

2022 年 12 月 29 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20221229` 即可下载 PPT。

## Q & A

### Q1：K8s 集群跑在物理机上，如何解决物理机故障问题？

A：K8s 集群无需担心物理机故障问题，首先 K8s 部署的时候尽量考虑多副本，其次 K8s 集群 node 节点与部署应用要有合理的比例，K8s 默认机制同一个应用多副本默认不会部署到同一个 node 节点。

### Q2：K8s 存储用的哪个分布式存储方案？

A：建议采用分布式存储产品，商业产品或或者开源的分布式存储都可以，例如 Ceph，尽可能的不要采用集中存储，否则存储就会成为 K8s 本身的瓶颈。

### Q3：使用的 K8s 版本，Linux 内核版本，KubeSphere 版本是什么？

A：我们 K8s 采用的是 19.13，Linux 内核是 5.15 ，KubeSphere 版本是 3.0。

### Q4：数据有做持久化吗，用什么存储？

A：有，我们采用的是杉岩的分布式存储。

### Q5：K8s 集群怎么部署的，用的 KubeKey 吗？

A：K8s 采用的 KubeKey 部署的，因为他不仅可以部署 K8s，还可以部署 KubeSphere。

### Q6：你们的中间件有迁移到 K8s 集群上吗？

A：暂时没有，目前所有中间件仍在虚拟化平采部署，数据库目前基本都是采用物理服务器部署。

### Q7：自动生成 Dockerfile 和 K8s 等资源文件是如何实现的？

A：目前是基于 maven 打包的命令，通过变量替换的方式自动生成 yaml 文件，生成的前提是提前约定好各种命名规则。

### Q8：生产环境对外发布应用用的什么？多套应用系统怎么发布的？

A：有部分业务是采用 Ingress 部署的。不同的业务绑定不通的 Ingress，多个应用不冲突。

### Q9：master 部署到虚拟机上，node 部署到物理机，那虚拟机容易挂，这样集群很容易挂掉，master 做了高可用吗还是什么？

A：首先我们虚拟机是采用的分布式虚拟化集群，当一个节点挂掉后，能迅速在其他节点拉起，其次 master 节点尽量部署 3 个以上，放在不同的虚拟化节点上，保障业务的可靠性。

### Q10：用的开源还是商业版？ 生产环境多少个节点了? 一共多少核? 有做定制开发吗? 是自有团队开发的吗？

A：我们采用的是开源的版本，生产环境 25 节点，1440 core，没有定制开发，目前全部采用开源版本，仅仅只是使用，没有定制能力。

### Q11：金融环境部署 KubeSphere，是脱离网络本地部署嘛？因为金融客户一般都是不连外网的。

A：目前我们是在线部署的，但是有离线部署 K8s 的方法， https://www.cnblogs.com/takako_mu/p/15380631.html。

### Q12：有没有做 K8s 集群可靠性压测？比如 api server。

A：目前我们没有做相关的压力测试，如果大家后合适的方法，可以一起分享一下，大家相互学习一下。

### Q13：Jenkins 发开发，测试，生产等不同的环境是在同一个 Jenkins pipeline 里面发吗？请问是怎么实现的呢？

A：我们 Jenkins 部署了三套，分为开发测试生产；可以通过策略访问 DMZ 区域的 GitLab 服务器，GitLab 上有 dev、release、prod 不同分分支，分别对应不同的环境进行发布。