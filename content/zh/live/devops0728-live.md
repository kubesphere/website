---
title: 在 KubeSphere 之上构建云原生时代的企业级 DevOps 平台
description: 本次分享将从 KubeSphere 出发，探寻一个适合企业的 DevOps 平台打造方式。
keywords: KubeSphere, Kubernetes, DevOps
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=601497813&bvid=BV1CB4y1b7Pm&cid=787106869&page=1&high_quality=1
  type: iframe
  time: 2022-07-28 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

K8s 作为 DevOps 首选编排系统，大幅度提高了应用交付速度，以及应用迭代次数。大量企业想通过容器技术提高应用手段，而在这个过程中，如何使用合理的工具，符合团队内部的技术手段，来构建自己的 DevOps 平台，也是众多企业主要的关注点。本次分享将从 KubeSphere 出发，探寻一个适合企业的 DevOps 平台打造方式。

## 讲师简介

周靖峰，青云科技容器顾问，云原生爱好者，目前专注于 Devops，云原生领域技术涉及 Kubernetes、KubeSphere、Argo。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/devops0728-live.png)

## 直播时间

2022 年 07 月 28 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220728` 即可下载 PPT。

## Q & A

### Q1：多流水线能不能实现并发流水线，目前我们公司每次只能三条左右流水线运行，其他都得等待前面运行完了才可以运行

A：可以并发运行。出现等待情况可以尝试分配出 CI 节点，并且通过标签固定，另外提高 CI 节点的资源。

### Q2：能不能实现审核，比如发布到 K8s 的时候需要指定一个审核人？审核通过后才可以发布。

A：可以审核，并且也可以指定审核人，进行发布。
参考： https://github.com/kubesphere/devops-maven-sample/blob/master/Jenkinsfile-online#L67

### Q3：多集群如何提升 Jenkins 并行构建发布效率？目前 host 会发布开发，测试，预发布，生产多个集群服务，并行构建发布等待时间大概 3-5 分钟。

A：同样的，划分出专门的 CI 节点，固定标签。提高 CI 节点资源率。

### Q4：在运行流水线拉取代码前能否修改 git 配置,例如 `git config --global http.sslVerify false`，目前刚刚遇到的问题。

A：可以修改，可以手动编辑 Jenkinsfile，在拉代码的步骤，通过添加 sh 脚本方式添加 git 配置。

### Q5：能不能实现 DevSecOps？或者有没有相关的开发计划？

A：CI 基于 Jenkins 实现，所以可以实现 DevSecOps。目前暂时没有，主要还是在产品增强方面，可以提交相关 issue，一起来参与。

