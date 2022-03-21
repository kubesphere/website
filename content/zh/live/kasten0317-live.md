---
title: 使用 Kanister 为你的云原生应用数据保驾护航
description: 随着 Kubernetes 中有状态应用程序的部署在云原生基础架构中的越发成熟，对有状态的云原生应用如何进行备份就成为了一个让人关注的问题。实际上在生产系统运行有状态应用并不是一件容易的事情，这需要我们仔细的计划并部署，管理者需要清晰地知道数据备份到哪个位置，备份的时间计划以及备份时间窗口，以确保与应用关联的数据也被正确备份了，从而达成应用的一致性，Kanister 就是解决这类问题的开源解决方案。
keywords: KubeSphere, Kubernetes, Kanister
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=637291016&bvid=BV19b4y1H7pa&cid=552384030&page=1&high_quality=1
  type: iframe
  time: 2022-03-17 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

随着 Kubernetes 中有状态应用程序的部署在云原生基础架构中的越发成熟，对有状态的云原生应用如何进行备份就成为了一个让人关注的问题。实际上在生产系统运行有状态应用并不是一件容易的事情，这需要我们仔细的计划并部署，管理者需要清晰地知道数据备份到哪个位置，备份的时间计划以及备份时间窗口，以确保与应用关联的数据也被正确备份了，从而达成应用的一致性，Kanister 就是解决这类问题的开源解决方案。

## 讲师简介

Mars Zhang 张聪，现就职与 Veeam 软件公司，任云解决方案架构师，负责云与云原生数据管理业务的技术支持，技术专栏作者，和团队一起著有《云数据管理实战指南》，热爱技术知识的学习与分享，熟悉云原生领域生态，做为架构师负责云灾备与数据管理解决方案。加入 Veeam 之前，就职于多家国际知名公司，曾作为架构师为客户设计与实现过多个云管理及云灾备即服务平台，有丰富的云端数据管理经验。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten0317-live.png)

## 直播时间

2022 年 03 月 17 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220317` 即可下载 PPT。

## Q & A

### Q1：是否支持 MySQL 物理备份和恢复？备份数据保存周期能设置吗？对于数据量大的场景，sql 备份和恢复时间太长？是否支持备份自定义数据库？

A：如果是物理的 MySQL 可以通过 Veeam Backup & Replication 的解决方案来完成。

对于数据量大的场景，可以通过与存储快照结合的方式在保证性能的同时还要计划时间窗口。

在 Kasten K10 中可以方便的设置保留周期。

Kanister 是开源的数据管理框架可以支持自定义数据库。

### Q2：该产品是否生产可用？

A：Kasten K10 是被多家大型客户在生产环境中验证的解决方案。详情可访问 www.Kasten.io 网站了解更多内容。 

### Q3：能在 KubeSpere 的页面里点点就完成备份恢复等业务操作吗，像各种云厂商产品一样？
A：可以通过 KubeSphere 直接打开 Kasten K10 的界面，通过简单的 UI 交互实现备份恢复等业务逻辑。关于如何在 KubeSphere 中部署 Kasten k10 可以参考这篇文章：https://mp.weixin.qq.com/s/CYU0V2QfO0JQ0zJaYZFxIw。

此外 KubeSphere 项目的发起方青云科技也推出了备份容灾 SaaS 产品，基于原生的 Kubernetes API，提供了可视化界面，能够覆盖云原生数据保护的绝大多数重要场景，而且能够跨集群、跨云服务商、跨存储区域，轻松实现基础设施间多地、按需的备份恢复。目前该服务还在体验改进阶段，提供了 1TB 的免费托管仓库，感兴趣的可以前往试用：https://kubesphere.cloud/self-service/disaster-recovery/

### Q4：如何做到自动识别出工作负载为 MySQL 或者是其他应用？如何保证 MySQL 数据的一致性？蓝图利用 mysqldum 在数据量大了之后如何保证性能？

A：Kasten 通过与 调用 K8s API 来进行应用发现，可以通过 Kanister 调用 Actionsset 保证应用一致性。蓝图利用 mysqldump 数据量大后可以通过与存储快照结合的方式在保证性能的同时还要计划时间窗口。

### Q5：K10 有中文界面吗？

答；目前还没有中文界面，不过我们有些来实现中文显示的方法。如果有项目机会可以直接联系 Mars 13910937256（微信同号）。

### Q6：可以备份 MySQL 的事务日志吗？

答: 可以启用 MySQL 的 binlog，备份到磁盘（PVC），我们备份整个 Namespace。同时您也可以自行开发一个 Blueprint。 
