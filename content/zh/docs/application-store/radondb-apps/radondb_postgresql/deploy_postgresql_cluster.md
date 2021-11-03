---
title: "在 KubeSphere 中部署 RadonDB PostgreSQL"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB PostgreSQL'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB PostgreSQL。'
linkTitle: "部署 PostgreSQL 集群"
weight: 14531
---

[RadonDB PostgreSQL](https://github.com/radondb/radondb-postgresql-kubernetes) 是基于 [PostgreSQL](https://postgresql.org) 的开源、云原生、高可用集群解决方案。

本教程演示如何从 KubeSphere 应用商店部署 RadonDB PostgreSQL 集群。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户(`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

1. 在项目的**概览**页面，点击左上角的**应用商店**。
2. 在 **RadonDB 数据库**分类中找到并点击 PostgreSQL，进入**应用信息**页面。
3. 点击**安装**，跳转到应用**基本信息**配置页面。

   ![应用商店中的 PostgreSQL](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-in-app-store.png)

   ![部署 RadonDB PostgreSQL](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/deploy-radondb-postgresql.png)

4. 设置名称，并选择应用版本和部署位置。点击**下一步**，进入**应用设置**页面。

   ![确认部署](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/confirm-deployment.png)

5. 选择规格、存储类型、存储卷容量、高可用备库数量，并设置数据库名称、用户名称、用户密码。

   {{< notice tip >}}

   **高级设置**中可选择设置数据库**复制模式**。默认为`同步`表示为同步流复制模式。

   {{</ notice >}}

   ![设置应用配置](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/set-app-configuration.png)

6. 点击**安装**，跳转到 **RadonDB 数据库应用**页面。

   待 PostgreSQL 集群状态为`运行中`时，则集群启动并正常运行。

   ![RadonDB PostgreSQL 运行中](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-running.png)
