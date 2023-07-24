---
title: 'KubeSphere 前端开源，社区架构首次公布'
tag: '产品动态,社区动态'
keywords: 'KubeSphere, Kubernetes'
description: 'KubeSphere 前端项目 console 宣布开源，并公布了社区架构。'
createTime: '2019-12-02'
author: 'Feynman Zhou'
image: 'https://pek3b.qingstor.com/kubesphere-docs/png/20191202112003.png'
---

## Console 开源

从 KubeSphere 第一行代码至今，项目经历了一年多时间的迅速发展，开源社区也这个期间完成孵化，并初具规模。为了让 KubeSphere 项目能够更好地以开源社区的形式发展和演进，让社区开发者能够方便地参与到 KubeSphere 项目的建设，社区宣布将 KubeSphere 前端项目 `console` 开源，**当前开源的版本包含了 KubeSphere 最新发布 v2.1 所有功能的代码**，前端的 Feature Map 可以通过这张图快速了解。

**Feature Map**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202112003.png)

前端项目的代码已在 `github.com/kubesphere/console` 可见，欢迎大家 **Star + Fork**。此前已有多位社区用户与开发者表示，希望能参与到 KubeSphere 项目的前端贡献，现在大家已经可以从 `github.com/kubesphere/kubesphere/issues` 通过标签 `area/console` 找到前端相关的 issue，包括 Bug、feature and design。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202111750.png)


至此，KubeSphere 开源社区发布的项目已涵盖了容器平台（KubeSphere）、多云应用管理平台（OpenPitrix）、网络插件（Porter LB 插件、Hostnic-CNI）、存储插件（CSI）、CI/CD（S2i-operator）、日志插件（Fluentbit-operator）、通知告警（Alert & Notification）、身份认证（IAM）等。


![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202104556.png)

## KubeSphere 社区架构

KubeSphere 相信 `Community over code`，一个健康良好的开源社区发展必定离不开 Contributor 的参与。为了让社区相关的事情更加成体系，让社区同学更有归属感，KubeSphere 首次建立了社区架构，第一次公开的架构包括 **Developer Group** 和 **User Group**。

> SIG（特别兴趣小组）由开发者和用户共同组成，目前架构中暂未划分主题，未来将根据社区用户的参与和关注方向进行划分。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202150115.png)

### Developer Group

Developer Group 将以开发者对 KubeSphere 组织下的所有开源项目的贡献数量和质量作为参考，可贡献的项目包括前后端、存储与网络插件、官网文档等项目。


- Active Contributor：2 个月内贡献过超过 4 个 PR，这样即可获得邀请。
- Reviewer： 从 Active Contributor 中诞生，当 Active Contributor 对该模块拥有比较深度的贡献，并且得到 2 个或 2 个以上 Maintainer 的提名时，将被邀请成为该模块的 Reviewer，具有 Review PR 的义务。
- Maintainer：即该功能模块的组织者，负责项目某个功能模块的代码与版本开发与维护，社区日常运营，包括组织会议，解答疑问等。Tech Lead 需要为项目的管理和成长负责，责任重大。目前暂由 KubeSphere 内部成员担任，将来可根据贡献程度由社区开发者一起担任，共同为项目的进步而努力。

### User Group

KubeSphere 社区是由开发者和用户共建的，随着 KubeSphere 用户群体愈发壮大，用户在使用过程中遇到的问题反馈及实践经验，对于 KubeSphere 产品的完善及应用推广有着不可忽视的重要作用。


- Ambassador 定位是为 KubeSphere 项目提供过多个有价值的建议反馈，并在其他社区发布内容帮助宣传推广过 KubeSphere。
- Co-Leader 定位是 KubeSphere 的高级用户，已将 KubeSphere & Kubernetes 在企业环境落地，并乐于在社区帮助其他用户解决技术问题，发布过优质内容。
- Leader 一定是 KubeSphere 的资深用户，从 Co-Leader 中诞生；参与 KubeSphere 的新功能设计探讨与社区维护，将作为演讲嘉宾在线下 Meetup 进行技术实践分享。


User Group 旨在加强 KubeSphere 用户之间的交流和学习，形式包括但不限于论坛与 GitHub 问答、论坛技术文章分享、官网文档贡献、KubeSphere & K8s 落地实践分享、项目建议反馈、线下技术沙龙等等。User Group 成员可以通过定期的线上、线下的活动，学习前沿的云原生技术知识与交流微服务落地避坑实践，发表技术见解，共同建设 KubeSphere 项目。


## KubeSphere 贡献奖励

KubeSphere 社区在一个月之前上线了论坛（ask.kubesphere.io/forum/），方便社区成员与用户间的技术交流与产品问答反馈。最近两周，我们很欣慰的是，有不少用户在论坛发布了多篇高质量的实践文章或避坑指南，帮助了其他用户更好地理解和上手 KubeSphere。社区欢迎大家在论坛分享记录你们在各种基础设施环境下的安装部署相关的文章，以及使用实践和避坑技巧，也希望大家能够将个人原创的云原生相关的知识或文章发布在 KubeSphere 论坛。对于社区用户发布的优质技术文章，将被同步在 KubeSphere 官网博客下。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202142733.png)

为了奖励来自社区论坛的优质内容和代码的贡献者，社区也准备了精美礼品予以奖励，礼品包括带有 KubeSphere Logo 的马克杯、T 恤和帽衫。如发布的主题或回复获赞数较多者，将根据排行榜段位标准获得精美礼品，这个奖励机制也同样适用于 Active Contributor。

## Meetup 预告

2019 年 12 月 14 日（周六）13:00-18:00，社区将在北京举行年度首次线下 Meetup，地址是 **北京市东城区青龙胡同 1 号歌华大厦 13 层**，。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202151552.png)



![](https://pek3b.qingstor.com/kubesphere-docs/png/20191202151751.png)
