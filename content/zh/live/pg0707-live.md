---
title: 当 KubeSphere 遇上最先进的开源数据库 PostgreSQL
description: 本次演讲会介绍容器化数据库 RadonDB PostgreSQL 的部署实践，以及 RadonDB PostgreSQL operator 2.0 的新特性，共同探讨 PostgreSQL 容器化数据库在云原生下的发展。
keywords: KubeSphere, Kubernetes, PostgreSQL, RadonDB
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=598178488&bvid=BV1kB4y1i7Kt&cid=767034832&page=1&high_quality=1
  type: iframe
  time: 2022-07-07 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

PostgreSQL 是一种特性非常齐全的开源自由软件对象-关系型数据库管理系统（ORDBMS），结合 KubeSphere 轻量、快速、自动化部署的特点，RadonDB PostgreSQL 就是一款兼容容器平台一键式部署、轻量、自动化的一款容器数据库。本次演讲会介绍容器化数据库 RadonDB PostgreSQL 的部署实践，以及 RadonDB PostgreSQL operator 2.0 的新特性，共同探讨 PostgreSQL 容器化数据库在云原生下的发展。

## 讲师简介

丁源，青云科技高级项目测试工程师，数据库从业发烧友，Oracle 数据库专家，信创数据库工程师，RadonDB 数据库爱好者，并对数据库有深入研究。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/pg0707-live.png)

## 直播时间

2022 年 07 月 07 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220707` 即可下载 PPT。

## Q & A

### Q1：PostgreSQL 有必要容器化吗？优势是什么？

A：不能肯定说有没有必要，是否有必要也是要看商业应用场景来决定。利用容器的优势来扩展数据库未必不可行。

容器的优势：
- 容器技术的最大优势是比创建 VM（虚拟机）实例更快的速度。它们的轻量化在性能和占用空间方面的开销更小。
- 版本控制：容器的每个镜像都可以进行版本控制，因此可以跟踪不同版本的容器，注意版本之间的差异等。
- 容器封装了运行应用程序所必需的所有相关细节，如应用程序依赖性和操作系统。容器镜像从一个环境到另一个环境的可移植性。例如，可以使用相同的镜像在 Windows/Linux 或 dev（生产）/test（测试）/stage（阶段）环境中运行。
- 安全：容器将一个容器的进程与另一个容器以及底层基础架构隔离开来，互不影响。

Kubernetes 作为一款开源的容器引擎，已经成为容器资源编排领域的事实标准、拥有调度、运维和声明式 API 设计。

### Q2：哪些场景试用 PostgreSQL 比 MySQL 更适合？

A：
- PostgreSQL 存储过程的功能支持要比 MySQL 好，具备本地缓存执行计划的能力；
- PostgreSQL 对表连接支持更完整，优化器的功能更完整，支持的索引类型很多，复杂查询能力较强；
- PostgreSQL 主备复制属于物理复制，支持异步、同步、半同步复制，MySQL 基于 binlog 的逻辑复制，是异步复制，pg数据的一致性更加可靠，复制性能更高，对主机性能的影响也更小；
- PostgreSQL 支持 json 数据类型，而 MySQL 不支持，MySQL 字符型有长度限制，而 PostgreSQL 的 text 类型无限长，可以使用 xml xpath，用 PostgreSQL 的话，MongoDB 这样文档数据库就省了；
- PostgreSQL 是完全免费开源的，而 MySQL 归属 Oracle 后，开源程度大不如以前，等等，这些优势足以让 PostgreSQL 比 MySQL 更适合。

### Q3：pgbouncer 是必须使用吗？使用时必须是 ssl 类型吗，对于存在证书过期的问题吗？

A：pgbouncer 是一个轻量级的针对 PostgreSQL 的数据库连接池工具，能够给客户端提供一个统一的链接视图，能够有效提高连接的利用率，避免过多的无效连接，导致数据库消耗资源过大，CPU 占用过高、起到缓冲作用，不是必须使用的，可以关闭 ssl。

### Q4：pgbouncer 和 pgpool 有什么区别？

A：PostgreSQL 的连接池主要有 pgpool 和 pgbouncer 两种，安装配置管理都要更为简单，配合 Repmgr 可以进行 PostgreSQL 超级高可用模式，这算是 PostgreSQL 的一种高可用的解决方案。

pgpool 是一个整体解决方案，它不仅实现了连接池，还实现了负载均衡等等高级功能，而 pgbouncer 则仅仅专注于连接池。所以说，如果你除了连接池还需要负载均衡等功能，那么 pgpool 通常是不错的选择，如果你只想要连接池功能，那么就和我一样使用小而美的 pgbouncer 吧。

### Q5：RandonDB PostgreSQL Operator 与其他的 PostgreSQL Operator 区别是什么？

A：RandonDB PostgreSQL Operator 是源于云原生 crunchydata 的一套 PostgreSQL 的容器化方案，但是我们做了一些增强的定制化修改，可以完全适配我们的 Kubesphere 架构平台，达到一键式部署，插件自由安装，还有一些高级功能的使用都非常方便。

### Q6：RadonDB 除了 PostgreSQL Operator 还有其他的 Operator 吗？

A：目前 RadonDB 除了 PostgreSQL Operator 还有 MySQL Operator、Clickhouse Operator，后期我们还会推出 Redis Operator……等系列数据库，敬请期待……

### Q7：RandonDB 会集成到 KubeSphere 产品中吗？

A：会，目前我们就是基于 KubeSphere 产品集成。

### Q8：和其他部署方式相比，性能方面有测试么？

A：性能方面有测试，在直播里面测试板块有提到过，跟物理机的差距并不算太大。并且在足够大的线程连接情况下，容器数据库性能优于物理机性能。

### Q9：数据库上云了，是不是以后对 DBA 需求就减少了？

A：个人认为只会对 DBA 的要求越来越高，需要掌握的技术也会变多，既是机遇也是挑战。


