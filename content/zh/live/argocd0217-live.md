---
title: Argo CD 速度通关指南
description: 本次直播将介绍 Argo CD，分享实践经验，结合测试环境案例，演示相应场景下的实验效果；让用户快速把握重点难点以及相应的思路和方向。
keywords: KubeSphere, Kubernetes, Argo CD
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=594178574&bvid=BV1aq4y1t7XJ&cid=511486300&page=1&high_quality=1
  type: iframe
  time: 2022-02-17 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次直播将介绍 Argo CD，分享实践经验，结合测试环境案例，演示相应场景下的实验效果；让用户快速把握重点难点以及相应的思路和方向。

## 讲师简介

裴振飞，广州视源电子科技股份有限公司运维工程师，Python 前后端全栈开发实践者，云原生爱好者。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/argocd0217-live.png)

## 直播时间

2022 年 02 月 17 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220217` 即可下载 PPT。

## Q & A

### Q1：Argo CD 与 Flux 主要区别？及各自应用的场景？哪个应用的比较多些？

A：Argo CD 和 Flux 都是非常优秀的 GitOps 工具，但从灵活性和可扩展性上看，Argo CD 更胜一筹。推荐使用 Argo CD 及其相关工具。

### Q2：流水线内编译产物部署到集群会有更加简化的操作么？
对 K8s 不够了解，编写 yml 配置文件难度较高，流水线内提供的 Kubernetes Deploy 在不久后会弃用，会有新的方式来进行快速部署项目么？

A：流水线编译产生的制品，一般为镜像。纯手工编写 K8s 配置清单，容易出错，而且需要非常高的熟练度。实践过程中，推荐在 KubeSphere 中直接创建工作负载，运行成功后，拷贝出对应的配置清单即可。

### Q3：最新版本 Argo CD Web UI 上可以添加第二个集群吗，还是只能通过 Argo CD cluster add cli 来操作？

A：Argo CD 暂不支持在 Web UI 上添加多集群。Argocd Web UI 是种极简的设计，高频操作才会在 UI 中设计，而添加多集群，使用频率非常低，一般也只会由管理员操作。从安全的角度看，只通过 CLI 添加，是种非常合理的设计。


### Q4：对于 Argo CD 和 Git 部署清单仓库之间的安全有没好的建议或实践？

A：项目配置清单确实有很多敏感数据，比如 secret 中常存放数据库连接信息等等；Argo CD 官方给出了多种方案，但没有哪种偏方是可以包治百病的，还需要根据具体的场景对症下药。
https://argo-cd.readthedocs.io/en/stable/operator-manual/secret-management/

在 与 KubeSphere 官方合作推出的视频教程中，介绍了 sealed secrets 的使用；可以点击了解[详细教程](https://kubesphere.com.cn/learn/)。

### Q5：Argo CD 与 helm 如何结合使用？

A：helm 和 kustomize 都只是用来管理配置清单的工具；Argo CD 自身是支持 helm 的，使用方法跟 kustomize 一样。但 Argo CD 官方推荐使用 kustomize 方式编排。我认为有两个原因，第一足够简单；第二更接近原生配置清单。


> 其他问题请参考[问题收集文档](https://docs.qq.com/doc/DQ1VMUlhwVVFCY1J0)。