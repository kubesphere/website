---
title: "在 KubeSphere 中管理 RadonDB PostgreSQL 配置参数"
keywords: 'KubeSphere, Kubernetes, 配置参数, RadonDB PostgreSQL'
description: '了解如何从 KubeSphere 管理 RadonDB PostgreSQL 集群配置参数。'
linkTitle: "管理配置参数"
weight: 14536
---


RadonDB PostgreSQL 集群支持配置参数管理功能，可查看和修改集群配置参数。通过修改配置参数可调优集群参数，并可开启相应集群高可用性能。

{{< notice info >}}

- 已开放管理参数包括 **数据库版本**、**shared_buffers**、**temp_buffers** 等 15 个参数。
- 集群配置参数仅支持查看初始配置，暂不支持修改。

{{</ notice >}}

本教程演示如何在 KubeSphere 上管理 PostgreSQL 集群配置参数。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 请确保创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保已部署 RadonDB PostgreSQL 集群。

## 查看配置参数

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。

2. 在应用列表下，选择 PostgreSQL 集群，进入集群详情页面。

3. 选择**参数配置**页面，即可查看集群配置参数。

   ![参数配置](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql—para.png)

<!--

- **数据库版本**仅支持查看初始配置，不支持修改。

- 部分参数修改后，将重启集群。为避免业务正常运行，请在业务低峰期修改这部分参数。
  
## 修改配置参数

1. 在**参数配置**页面，点击**编辑**，进入参数值可编辑状态。

   ![参数配置](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql—para.png)

2. 设置参数值。

3. 点击列表左上角**保存**。

注意**自动重启**列状态为 `是` 的参数，这部分参数修改后，集群将自动重启。待集群状态切换为`运行中`，则集群重启完成，修改后配置生效。
-->