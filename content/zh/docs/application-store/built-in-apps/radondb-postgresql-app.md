---
title: "在 KubeSphere 中部署 RadonDB PostgreSQL"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB PostgreSQL'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB PostgreSQL。'
linkTitle: "在 KubeSphere 中部署 RadonDB PostgreSQL"
weight: 14294
---

[RadonDB PostgreSQL](https://github.com/radondb/radondb-postgresql-kubernetes) 是基于 [PostgreSQL](https://postgresql.org) 的开源、云原生、高可用集群解决方案。

本教程演示如何从 KubeSphere 应用商店部署 RadonDB PostgreSQL。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 RadonDB PostgreSQL

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

2. 找到 RadonDB PostgreSQL，点击**应用信息**页面上的**安装**。

3. 设置名称并选择应用版本。请确保将 RadonDB PostgreSQL 部署在 `demo-project` 中，点击**下一步**。

4. 在**应用设置**页面，您可以使用默认配置，或者编辑 YAML 文件以自定义配置。点击**安装**继续。

5. 稍等片刻待 RadonDB PostgreSQL 启动并运行。


### 步骤 2：查看 PostgreSQL 集群状态

1. 在 `demo-project` 项目的**概览**页面，可查看当前项目资源使用情况。

2. 进入**应用负载**下的**工作负载**页面，点击**有状态副本集**，查看集群状态。

   进入一个有状态副本集群详情页面，点击**监控**标签页，可查看一定时间范围内的集群指标。

3. 进入**应用负载**下的**容器组**页面，可查看所有状态的容器。

4. 进入**存储**下的**持久卷声明**页面，可查看持久卷声明，所有组件均使用了持久化存储。

   查看某个持久卷声明用量信息，以其中一个数据节点为例，可以看到当前存储的存储容量和剩余容量等监控数据。


### 步骤 3：访问 RadonDB PostgreSQL

1. 在 **应用负载**下的**容器组**页面，点击一个容器的名称，进入容器详情页面。

2. 在**资源状态**页面，点击**终端**图标。

3. 在弹出窗口中，向终端输入命令使用该应用。

   ```bash
   psql -h <Pod name> -p 5432 -U postgres -d postgres
   ```

4. 如果您想从集群外部访问 RadonDB PostgreSQL，详细信息请参见 [RadonDB PostgreSQL 开源项目](https://github.com/radondb/radondb-postgresql-kubernetes)。
