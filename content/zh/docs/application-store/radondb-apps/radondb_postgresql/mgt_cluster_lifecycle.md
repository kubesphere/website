---
title: "在 KubeSphere 中管理 RadonDB PostgreSQL 集群"
keywords: 'KubeSphere, Kubernetes, 集群生命周期, RadonDB PostgreSQL'
description: '了解如何从 KubeSphere 管理 RadonDB PostgreSQL 集群生命周期。'
linkTitle: "集群生命周期"
weight: 14533
---



本教程演示了如何在 KubeSphere 上管理 PostgreSQL 集群生命周期，包括变更集群资源规格、扩容集群存储卷、删除集群。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 请确保创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保已部署 RadonDB PostgreSQL 集群。

## 查看集群状态

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。

2. 在应用列表下，选择 PostgreSQL 集群，进入集群详情页面。

3. 在**详情**区域，可查看集群基本信息。

   ![集群基本信息](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/cluster_basic_info.png)

4. 在**资源状态**页签，可分别查看集群数据库连接方式和节点列表。

   默认支持内外访问方式；KubeSphere 项目网关开启外网访问后，支持外网访问方式。
   
   ![连接方式](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/cluster_connection_list.png)

   节点列表可查看节点 **pod name**、运行状态、节点 IP 等节点基本信息。

   ![节点列表](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/cluster_node_list.png)

5. 在**用户帐号**页签，可查看集群用户帐号列表。

   ![用户帐号](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/cluster_user_list.png)

6. 在**参数配置**页签，可查看集群开放的配置参数列表。

   ![配置参数](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/cluster_para_list.png)

## 变更集群规格

集群部署完成后，可在集群管理页面，变更集群资源规格。支持选择`0.5 Core, 1 Gi`、 `1 Core, 2 Gi`、`2 Core, 4 Gi`、`4 Core, 8 Gi` 四种规格类型。

1. 进入集群详情页面。

1. 在应用基本信息区域，点击**更多操作** > **变更集群规格**，弹出规格配置窗口。

   ![变更集群规格](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql—class.png)

2. 选择资源规格类型。

3. 点击**确定**，待集群状态切换为`运行中`，则规格变更完成。

   可在**节点**列表，查看节点规格已变更。

## 扩容存储卷

集群部署完成后，可在集群管理页面，扩容集群存储卷，支持选择存储卷范围 10 ～ 2048 Gi。

1. 进入集群详情页面。

3. 在应用基本信息区域，点击**更多操作** > **扩容存储卷**，弹出存储卷配置窗口。

   ![扩容存储卷](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql—volume.png)

4. 配置存储卷容量大小。

5. 点击**确定**，将重启集群，待集群状态切换为`运行中`，则存储卷扩容完成。
   
   可在**节点**列表，查看节点容量已变更。

## 修改集群信息

集群名称唯一，不支持修改。

1. 进入 RadonDB 数据库应用列表页面。

2. 在目标帐号行，点击 **...** > **编辑信息**，弹出修改集群信息窗口。

   ![修改集群信息](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql—cluster—info.png)

3. 设置描述信息，点击**更新**即可修改集群信息。

## 删除集群

{{< notice warning >}}

- 删除集群前，请确保数据已备份。
- 删除集群后，集群中数据也将被清除不可恢复，请谨慎操作。

{{</ notice >}}

1. 进入 RadonDB 数据库应用列表页面。

2. 勾选一个或多个集群，点击**删除**，弹出删除确认窗口。

   ![删除集群](/images/docs/zh-cn/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql—delete.png)

3. 输入集群名称。

4. 点击**确定**，立即删除集群。
