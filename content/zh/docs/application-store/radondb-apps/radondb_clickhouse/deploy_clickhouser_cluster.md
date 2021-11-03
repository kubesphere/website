---
title: "在 KubeSphere 中部署 RadonDB ClickHouse"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB ClickHouse'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB ClickHouse。'
linkTitle: "部署 ClickHouse 集群"
weight: 14511
---

[ClickHouse](https://clickhouse.tech/) 是一款用于联机分析 (OLAP) 的列式数据库管理系统 (DBMS)。[RadonDB ClickHouse](https://github.com/radondb/radondb-clickhouse-kubernetes) 是一款深度定制的 ClickHouse 集群应用，完美保持了 ClickHouse 集群功能特性，并具备集群自动管理、集群数据重分布、高性能低成本等优势功能特性。

本教程演示了如何在 KubeSphere 上部署 ClickHouse 集群。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户(`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

1. 在项目的**概览**页面，点击左上角的**应用商店**。
2. 在 **RadonDB 数据库**分类中找到并点击 ClickHouse，进入**应用信息**页面。
   
   ![应用商店中的 ClickHouse](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/radondb-clickhouse-in-app-store.png)

3. 点击**安装**，跳转到应用**基本信息**配置页面。

   ![部署 RadonDB ClickHouse](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/deploy-radondb-clickhouse.png)

4. 设置名称，并选择应用版本和部署位置。点击**下一步**，进入**应用设置**页面。

   ![确认部署](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/confirm-deployment.png)

5. 选择规格、存储类型、存储卷容量、节点数、副本节点数，并设置用户名称和用户密码。

   {{< notice tip >}}

   **高级设置**中可选择设置数据库 **HTTP 端口**。默认端口号为 8123。

   {{</ notice >}}
   ![设置应用配置](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/set-app-configuration.png)

6. 点击**安装**，跳转到 **RadonDB 数据库应用**页面。

   待 ClickHouse 集群状态为`运行中`时，则集群启动并正常运行。

   ![RadonDB ClickHouse 运行中](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/radondb-clickhouse-running.png)
