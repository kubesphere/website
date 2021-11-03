---
title: "在 KubeSphere 中查看 RadonDB MySQL 集群监控"
keywords: 'KubeSphere, Kubernetes, 监控, RadonDB MySQL'
description: '了解如何从 KubeSphere 查看 RadonDB MySQL 集群监控。'
linkTitle: "查看集群监控"
weight: 14527
---

通过 MySQL Operator 采集应用指标，并通过 Prometheus 进行查询，最终在 KubeSphere 监控面板实现监控指标可视化。

本教程演示如何从 KubeSphere 中查看 RadonDB MySQL 集群监控。

## 监控指标简介

### 服务监控指标

| 监控指标 | 指标说明 | 
| :--- | :--- | 
| 连接数  |  统计数据库的最大连接数。主要监控项包括 `Max Used Connections`。 |
| 线程数   |  统计数据库连接线程数。主要监控项包括 `Peak Threads Connected`、`Peak Threads Running`、`Avg Threads Running`。 |
| 已中止连接数  |  统计已经连接失败的 MySQL 服务器尝试连接的次数。主要监控项包括 `Aborted Connects（attempts）`、`Aborted Clients（timeout）`。 |
| 查询数 |  统计发往 MySQL 服务器的查询的次数。主要监控项包括 `Questions`。|
| 未使用索引的查询数   |  统计使用索引的 SELECT 语句执行次数。主要监控项包括 `Select Full Join`、 `Select Full Range Jion`、 `Select Range` 、`Select Range Check`、 `Select Scan`。|
| 未使用索引的排序   |  统计使用索引的排序记录次数。主要监控项包括 `Sort Rows`、 `Sort Range`、 `Sort Merge Passes`、`Sort Scan`。|
| 慢查询   |  统计超过 `long_query_time` 时间的查询数。主要监控项包括 `Slow Queries`。|
| 表级锁  |  统计表锁数 。主要监控项包括 `Table Locks Immediate`、`Table Locks Waited`。|
| 临时表数量   |  统计创建的临时表和文件数。主要监控项包括 `Created Tmp Tables`、`Created Tmp Disk Tables`、 `Created Tmp Files`。|
| 网络流量  |  统计网络输入和输出吞吐量，单位为 bytes/s。主要监控项包括 `Inbound`、`Outbound`。|

| 监控指标 | 指标说明 | 
| :--- | :--- | 
| Connections  |  统计数据库的最大连接数。主要监控项包括 `Max Used Connections`。 |
| Threads   |  统计数据库连接线程数。主要监控项包括 `Peak Threads Connected`、`Peak Threads Running`、`Avg Threads Running`。 |
| Aborted Connections  |  统计已经连接失败的 MySQL 服务器尝试连接的次数。主要监控项包括 `Aborted Connects（attempts）`、`Aborted Clients（timeout）`。 |
| Questions |  统计发往 MySQL 服务器的查询的次数。主要监控项包括 `Questions`。|
| Select By Types   |  统计 SELECT 语句执行次数。主要监控项包括 `Select Full Join`、 `Select Full Range Jion`、 `Select Range` 、`Select Range Check`、 `Select Scan`。|
| Sort By Types   |  统计排序记录次数。主要监控项包括 `Sort Rows`、 `Sort Range`、 `Sort Merge Passes`、`Sort Scan`。|
| Slow Queries   |  统计超过 `long_query_time` 时间的查询数。主要监控项包括 `Slow Queries`。|
| Locks By Types  |  统计表锁数 。主要监控项包括 `Table Locks Immediate`、`Table Locks Waited`。|
| Tmp Tables and Files   |  统计创建的临时表和文件数。主要监控项包括 `Created Tmp Tables`、`Created Tmp Disk Tables`、 `Created Tmp Files`。|
| Inbound vs Outbound  |  统计网络输入和输出吞吐量，单位为 bytes/s。主要监控项包括 `Inbound`、`Outbound`。|

### 资源监控指标

| 监控指标 | 指标说明 | 
| :--- | :--- | 
| CPU 使用量  |  统计节点 CPU 资源使用量，单位为 m。|
| 内存使用量   |  统计节点内存资源使用量，单位为 Mi。|
| 网络流出速率  |  统计节点网络流出速率，单位为 Kbps。|
| 网络流入速率  |  统计节点网络流入速率，单位为 Kbps。|

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 请确保创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保已安装 RadonDB MySQL 应用。

## 查看节点服务监控

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。
2. 在应用列表下，选择 MySQL 集群，进入集群详情页面。
3. 在**资源状态**页面**节点**列表区域，选择目标节点，点击监控图标，进入服务监控页面。

   ![服务监控](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/service_monitoring_port.png)

4. 在时间过滤框，选择监控时间范围，点击**确定**，在页面即可查看指定时间范围的服务监控。

   ![服务监控](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/service_monitoring.png)

## 查看节点资源监控

1. 进入集群详情页面。
2. 在**资源状态**页面**节点**列表区域，点击目标节点名称，进入节点容器组详情页面。
3. 选择**Monitoring**页签，进入资源监控页面

   ![资源监控](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/resources_monitoring.png)

4. 在时间过滤框，选择监控时间范围，点击**确定**，在页面即可查看指定时间范围的资源监控。

   ![时间过滤](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/resources_monitoring_timer.png)
