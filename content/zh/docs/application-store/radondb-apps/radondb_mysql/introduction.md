---
title: "在 KubeSphere 中部署 RadonDB MySQL"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB MySQL'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB MySQL。'
linkTitle: "RadonDB MySQL 简介"
weight: 14521
---

[RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) 是基于 [MySQL](https://MySQL.org) 的开源、云原生、高可用集群解决方案。

RadonDB MySQL 支持[KubeSphere](https://kubesphere.com.cn)上安装部署和管理，自动执行与运行 RadonDB MySQL 集群有关的任务。

## 架构图

- 通过 Raft 协议实现无中心化领导者自动选举
- 通过 Semi-Sync基于GTID 模式同步数据
- 通过 Xenon 提供高可用能力

![](docs/_images/radondb-mysql_Architecture.png)

## 功能特性

- 提供一主多从高可用架构。
- 金融级 MySQL 集群。
- 提供 Semi-Sync 插件，确保节点间的数据一致性。
- 提供一主多从架构，基于 Raft 协议管理集群节点，具备主从秒级切换性能，保障业务连续性。
- 提供数据自动备份功能。
- 提供集群资源与服务监控告警功能。
