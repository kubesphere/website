---
title: 基于 KubeSphere 的 ClickHouse 容器化实践
description: 本次演讲会介绍容器化数据库 RadonDB ClickHouse 的部署实践，以及 RadonDB ClickHouse Operator 2.0 的新特性，共同探讨容器化数据库的可行性。
keywords: KubeSphere, Kubernetes, ClickHouse, RadonDB
css: scss/live-detail.scss

section1:
  snapshot: 
<<<<<<< HEAD
  videoUrl: //player.bilibili.com/player.html?aid=939100007&bvid=BV1FT4y1z7Sb&cid=719562038&page=1&high_quality=1
=======
  videoUrl: 
>>>>>>> 3b2e2541 (update the page of live)
  type: iframe
  time: 2022-05-12 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

ClickHouse 如何结合 KubeSphere 轻量、快速、自动化部署的特点，实现兼容容器平台一键式部署、轻量、自动化。本次演讲会介绍容器化数据库 RadonDB ClickHouse 的部署实践，以及 RadonDB ClickHouse Operator 2.0 的新特性，共同探讨容器化数据库的可行性。

## 讲师简介

丁源，青云科技高级项目测试工程师，数据库从业发烧友，Oracle 数据库专家，信创数据库工程师，RadonDB 数据库爱好者，并对数据库有深入研究。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/clickhouse0512-live.png)

## 直播时间

2022 年 05 月 12 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

<<<<<<< HEAD
## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220512` 即可下载 PPT。

## Q & A

### Q1：可以支持 ClickHouse Keeper 吗？

A：当前 RadonDB ClickHouse 使用的是 21.1.3 版本，依然使用 Zookeeper 去管理集群。ClickHouse-Keeper 是 ClickHouse 在 21.8 社区版本中引入的，所以当前我们还没有集成使用。后期我们也会考虑将 Zookeeper 迁移到 Clickhouse-Keeper 中。

### Q2：除了 ClickHouse ，其它数据库适合容器化么？

A：目前市面上主流的数据库基本都发布了 Operator。RadonDB 开源社区也开源了 MySQL、ClickHouse、PostgreSQL 的 Operator 等，都是可以稳定跑在 KubeSphere 上。

### Q3：数据库容器化会丢数据吧？

A：容器化数据库可以使用独立存储来保存数据，通过外接存储盘来保证数据不会因为容器 Pod 的资源定义更新而丢失数据，相当于我们的数据跟 Pod 是隔离开来的。

### Q4：容器化性能损耗大不大？

A：容器性能损耗取决于网络插件的损耗和持久化存储的性能损耗。

### Q5：数据通过什么网络同步呢

A：数据通过 Kubernetes 的网络插件转发。

### Q6：Helm 跟 Operater 是替代关系吗？

A：Helm 和 Operator 是两种不同的概念，Helm 是管理 CRD 的一个工具，K8s 是舵手，Helm 就是那个舵。而 Operator 其实并不是一个工具，它相当于是一个定制方法，管理用户自己定义资源的模块。

### Q7：支撑 ClickHouse 集群部署时进行 SQL 初始化吗？

A：是支持的标准化 SQL 初始化的。

### Q8：ClickHouse 集群部署是 1 个 statefulset 包含多 replica，还是部署多个独立的 statefulet？

A：多个独立的 statefulet 去管理不同应用的状态。

### Q9：ClickHouse 集群是主-主集群吗，如何解决读写数据一致性？

A：ClickHouse 是没有一个主从架构概念的，ClickHouse 是分布式的一个架构。一个集群有多个分片，一个分片有多个副本，每个副本对应集群一个节点，可以对任意节点进行读写操作，通过 Zookeeper 来管理分片里面副本之间的一个数据同步。

### Q10：是不是 localpv 性能最好？

A：Kubernetes 直接使用 localpv 宿主机的本地磁盘目录 ，来持久化存储容器的数据。它的读写性能相比于大多数远程存储来说，要好得多，尤其是 SSD 盘。但是 localpv 也需要分场景应用。

### Q11：ClickHouse-Operator 部署集群后，能支持 ClickHouse 容器自动初始化么？

A：SQL（DDL、DML 等），满足某些场景一键部署（先数据库、后应用，有编排关联）。当容器化 ClickHouse 部署好以后，操作数据库的方式跟物理机是一模一样的，都可以对数据库进行 DDL 和 DML 一系列操作，而且还可以利用容器的便利性搭建你喜欢的应用去连接数据库。
=======
>>>>>>> 3b2e2541 (update the page of live)
