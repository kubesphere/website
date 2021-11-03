---
title: "在 KubeSphere 中查看 RadonDB PostgreSQL 集群监控"
keywords: 'KubeSphere, Kubernetes, 监控, RadonDB PostgreSQL'
description: '了解如何从 KubeSphere 查看 RadonDB PostgreSQL 集群监控。'
linkTitle: "查看集群监控"
weight: 14537
---

通过 PostgreSQL Operator 采集应用指标，并通过 Prometheus 进行查询，最终在 KubeSphere 监控面板实现监控指标可视化。

本教程演示如何从 KubeSphere 中查看 RadonDB PostgreSQL 集群监控。

## 监控指标简介

### 服务监控指标

| 监控指标 | 指标说明 |
| :--- | :--- |
| 活跃连接  |  统计数据库活跃连接数与总连接数比值，单位为 %。|
| 空闲事务连接  |  统计数据库空闲事务连接数与总连接数比值，单位为 %。|
| 空闲连接  |  统计数据库空闲状态连接数与总连接数比值，单位为 %。|
| 回绕事务  |  统计回绕事务比例，单位为 %。|
| 缓存命中率  |  统计缓存命中率，单位为 %。|
| 活跃事务与查询  |  统计数据库总事务数和查询数，单位为 %。主要监控项包括 `总事务数`、`查询数`。|
| 连接数  |  统计数据库连接数。主要监控项包括 `活跃连接数`、`空闲事务连接数`、`空闲连接数`。|
| 数据库大小  |  统计每个数据库容量大小，单位为 MB。主要监控项包括 `Total`、`postgres`、`radondb`。|
| 查询时间  |  统计每个数据库最大和平均查询时间，单位为毫秒。主要监控项包括 `Avg：ccp_monitor（postgres）`、`Avg：postgres（postgres）`、`Avg：postgres（radondb）`、`Max：ccp_monitor（postgres）`、`Max：postgres（postgres）`、`Max：postgres（radondb）`。|
| 活跃元组  |  统计数据库元组数。主要监控项包括 `获取`、`插入`、`更新`、`删除`、`返回`操作。|
| WAL 日志大小  |  统计 WAL 日志总容量大小，单位为 MB。|
| 关键统计   |  统计数据库关键计数。主要监控项包括 `冲突数`、`死锁数`、`提交数`、`回滚数`。|
| 复制延迟  |  统计数据库复制延迟的时间和容量大小，单位为 bytes，时间格式 hh:mm:ss。主要监控项包括 `Bytes`、`Time`。|
| 缓冲区  |  统计数据库缓存区大小，单位为 bytes。主要监控项包括 `Allocated`、`Backend`、`FSync`、`CheckPoint`、`Clean`。|
| 锁信息  |  统计数据库锁数量。主要监控项包括 `accesssexclusivelock`、`exclusivelock`、`rowexclusivelock`、`sharerowexclusivelock`、`shareupdateexclusivelock`、`accesssharelock`。|
| 缓存命中率  |  统计每个数据库缓存事务数和与在磁盘中运行的事务数的比值，即缓存命中率，单位为 %。主要监控项包括 `postgres`、`radondb`。|

| 监控指标 | 指标说明 |
| :--- | :--- |
| Active Connection  |  统计活跃连接数与总连接数比值，单位为 %。|
| Idle In Transaction  |  统计事务中空闲连接数与总连接数比值，单位为 %。|
| Idle Connection  |  统计空闲状态连接数与总连接数比值，单位为 %。|
| Toward Wraparound  |  统计事务回卷比例，单位为 %。|
| Cache Hit Ratio  |  统计缓存命中率，单位为 %。|
| Activity  |  统计数据库总事务数和查询数，单位为 %。主要监控项包括 `Transactions`、`Queries`。|
| Connections  |  统计数据库连接数。主要监控项包括 `Idle`、`Idle In Transaction`、`Active`。|
| Database Size  |  统计数据库容量大小，单位为 MB。主要监控项包括 `Total`、`postgres`、`radondb`。|
| Query Duration  |  统计数据库查询时间，单位为毫秒。主要监控项包括 `Avg：ccp_monitor（postgres）`、`Avg：postgres（postgres）`、`Avg：postgres（radondb）`、`Max：ccp_monitor（postgres）`、`Max：postgres（postgres）`、`Max：postgres（radondb）`。|
| Row Activity  |  统计数据库行数。主要监控项包括 `Fetched`、`Inserted`、`Updated`、`Deleted`、`Returned`。|
| WAL Size  |  统计 WAL 日志总容量大小，单位为 MB。|
| Key Counters   |  统计数据库关键计数。主要监控项包括 `Conflicts`、`DeadLocks`、`Commits`、`Rollbacks`。|
| Replication Lag  |  统计复制延迟的时间和容量大小，单位为 bytes，时间格式 hh:mm:ss。主要监控项包括 `Bytes`、`Time`。|
| Buffers  |  统计数据库缓存区大小，单位为 bytes。主要监控项包括 `Allocated`、`Backend`、`FSync`、`CheckPoint`、`Clean`。|
| Locks  |  统计数据库锁数。主要监控项包括 `accesssexclusivelock`、`exclusivelock`、`rowexclusivelock`、`sharerowexclusivelock`、`shareupdateexclusivelock`、`accesssharelock`。|
| Cache Hit Ratio  |  统计每个数据库缓存事务数和与在磁盘中运行的事务数的比值，即缓存命中率，单位为 %。主要监控项包括 `postgres`、`radondb`。|


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
- 请确保已部署 RadonDB PostgreSQL 集群。

## 查看节点服务监控

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。

2. 在应用列表下，选择 PostgreSQL 集群，进入集群详情页面。

3. 在**资源状态**页面**节点**列表区域，选择目标节点，点击监控图标，进入服务监控页面。

   ![服务监控](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/service_monitoring_port.png)

4. 在时间过滤框，选择监控时间范围，点击**确定**，在页面即可查看指定时间范围的服务监控。

   ![服务监控](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/service_monitoring.png)

## 查看节点资源监控

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。

2. 在应用列表下，选择 PostgreSQL 集群，进入集群详情页面。

3. 在**资源状态**页面**节点**列表区域，点击目标节点名称，进入节点容器组详情页面。

4. 选择 **Monitoring** 页签，进入资源监控页面

   ![资源监控](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/resources_monitoring.png)

5. 在时间过滤框，选择监控时间范围，点击**确定**，在页面即可查看指定时间范围的资源监控。

   ![时间过滤](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/resources_monitoring_timer.png)
