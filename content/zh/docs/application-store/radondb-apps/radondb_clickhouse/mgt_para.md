---
title: "管理 RadonDB ClickHouse 配置参数"
keywords: 'KubeSphere, Kubernetes, 配置参数, RadonDB ClickHouse'
description: '了解如何从 KubeSphere 管理 RadonDB ClickHouse 集群配置参数。'
linkTitle: "管理配置参数"
weight: 14516
---



RadonDB ClickHouse 集群支持配置参数管理功能，可查看和修改集群配置参数。

{{< notice info >}}

- RadonDB ClickHouse 已开放管理参数包括 **副本数量**、**TCP 端口**、**HTTP 端口** 3个参数。
- 集群 3个配置参数仅支持查看初始配置，暂不支持修改。

{{</ notice >}}

本教程演示如何在 KubeSphere 上管理 ClickHouse 集群配置参数。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 请确保创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保已部署 RadonDB ClickHouse 集群。

## 查看配置参数

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。

2. 在应用列表下，选择 ClickHouse 集群，进入集群详情页面。

3. 选择**参数配置**页面，即可查看集群配置参数。

   ![参数配置](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/radondb-clickhouse—para.png)
