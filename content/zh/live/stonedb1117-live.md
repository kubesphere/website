---
title: 基于 KubeSphere 部署 StoneDB 云原生 HTAP 数据库
description: 本次分享将给大家带来 StoneDB 的架构，查询、存储等核心特性，并介绍 StoneDB 的容器化演进路线，以及如何借助 KubeSphere 部署、使用、管理 StoneDB，一站式的解决 StoneDB 的运维管理问题。
keywords: KubeSphere, Kubernetes, StoneDB, HTAP, 数据库
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=902738544&bvid=BV1tP4y117Wk&cid=895003938&page=1&high_quality=1
  type: iframe
  time: 2022-11-17 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

StoneDB 是由石原子科技公司自主设计、研发的国内首款基于 MySQL 内核打造的开源 HTAP（Hybrid Transactional and Analytical Processing）融合型数据库，对标 Oracle MySQL Heatwave，可实现与 MySQL 的无缝切换。StoneDB 具备超高性能、实时分析等特点，为用户提供一站式 HTAP 解决方案。

本次分享将给大家带来 StoneDB 的架构，查询、存储等核心特性，并介绍 StoneDB 的容器化演进路线，以及如何借助 KubeSphere 部署、使用、管理 StoneDB，一站式的解决 StoneDB 的运维管理问题。

## 讲师简介

高日耀，StoneDB PMC、HTAP 内核架构师。毕业于华中科技大学，喜欢研究主流数据库架构和源码。8 年的数据库内核开发经验，曾从事分布式数据库 CirroData 、RadonDB 和 TDengine 的内核研发工作，现担任 StoneDB 的内核架构师及 StoneDB 项目 PMC。

张少鹏，StoneDB Committer、数据库高级工程师。喜欢研究数据库各种架构以及周边生态工具，5 年 MySQL 数据库工作经验，现担任 StoneDB 的高级工程师、StoneDB committer。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/stonedb1117-live.png)

## 直播时间

2022 年 11 月 17 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20221117` 即可下载 PPT。

## Q & A

### Q1：StoneDB 数据库容器化或者说部署在 K8s 上遇到的数据安全（数据丢失）问题是怎么处理的？

A：StoneDB 是基于 MySQL 分支做的，所以 StoneDB 也支持 mysqldump 备份，可以类似 MySQL 做一个定时备份脚本进行周期性数据备份，定时备份之间的增量数据可以利用 binlog server 做两个备份备份周期内的增量数据备份。

### Q2：StoneDB 数据库容器化或者说部署在 K8s 上遇到的容器网络带来的延迟问题是怎么处理的？

A：这个问题比较宽泛，我们可以缩小到数据库集群的延迟问题。数据库在遇到业务峰值的时，经常会发生 latency 高的问题，有两种方案解决这个问题。一是借助 Service 创建一个负载均衡器，对读写业务进行分流，降低主节点的压力。另外就是根据业务压力做自动扩容，也能降低 latency 的问题。

### Q3：在 Docker 中水平伸缩只能用于无状态服务非数据库，针对数据库隔离功能，StoneDB 会如何处理呢？

A：Docker 不具备水平伸缩吧？这里应该说的是 K8s。数据库是一个有状态的应用，StoneDB 在 K8s 里面运行的环境是 pod，类似一个独立的虚拟环境，另外通过 operator 创建一个 statefulset，来对 StoneDB 进行管理和操作。

### Q4：使用 Docker 后会对 StoneDB 的 IO 性能有影响吗？

A：肯定是有影响的，从我们测试过的数据看，大部分读写场景性能下降在 5% 左右，少部分场景下降在 10% 以内。

### Q5：StoneDB 基于 Docker 可以做到弹性伸缩吗？

A： 这里说的应该是基于 K8s。基于 K8s 肯定是可以实现弹性伸缩的，通过 operator 创建的 statefulset，可以做到水平和垂直扩缩容。

### Q6：StoneDB 与 TiDB 的区别是什么？

A： TiDB 也主推自己是一款 HTAP，兼容 MySQL 协议。我们可以从以下几个方面来说说区别：
- 兼容性：TiDB 主要兼容 MySQL 5.7 协议，目前还做不到完全兼容，只是大部分兼容其协议和语法，StoneDB 原生兼容 MySQL 所有的协议和语法。
- 架构层面：TiDB 是通过 tifalsh（魔改的 ClickHouse），嫁接到 TiDB 集群里面作为 ap 节点的，架构比较重。StoneDB 是通过 MySQL 独特的插件式引擎，接入自研的 Tianmu 引擎。跟 innodb、myisam 等一样可插拔，很轻量。
- 易用性：TiDB 架构复杂，组件多，学习成本高。StoneDB 只需要会使用 mysql，就能零成本直接迁移到 StoneDB，包括业务上也不用做很多的改动。
- 业务数据：TiDB 适合大数据量的场景，StoneDB 主打 10T 以下的数据，面向大部分中小客户的业务。
