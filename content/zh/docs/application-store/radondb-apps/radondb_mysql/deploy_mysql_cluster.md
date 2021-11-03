---
title: "在 KubeSphere 中创建 RadonDB MySQL"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB MySQL'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB MySQL。'
linkTitle: "安装 RadonDB  MySQL"
weight: 14521
---

[RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) 是基于 [MySQL](https://MySQL.org) 的开源、云原生、高可用集群解决方案。通过使用 Raft 协议，RadonDB MySQL 可以快速进行故障转移，且不会丢失任何事务。

本教程演示如何从 KubeSphere 应用商店安装 RadonDB MySQL 集群。

## 准备工作

- 请确保已授权 RadonDB MySQL 应用，且在授权使用期内。
- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 操作步骤

1. 登录 KubeSphere 工作台。
2. 点击左上角的**应用商店**，进入 KubeSphere 应用商店。
3. 在 **RadonDB 数据库**分类中找到并点击 RadonDB MySQL，进入**应用信息**页面。
4. 点击**安装**，跳转到应用**基本信息**配置页面。

   ![基本信息](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/basic_info.png)

5. 配置应用基本信息和安装位置。

   **名称**：自定义应用名称。  
   **版本**：选择应用版本。默认为最新版本。
   **位置**：选择应用安装的企业空间、集群和项目。

6. 点击**下一步**，进入**应用设置**页面。

   ![应用设置](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/confirm-deployment.png)

7. 配置应用规格、存储类型、存储卷容量和高可用备库数量。

   **规格**：选择应用服务器规格。可选 0.5核1Gi、1核2Gi、2核4Gi、4核8Gi。
   **存储类型**：选择应用存储类型。可选的存储类型由平台管理员创建。
   **存储卷**：配置应用存储卷容量。可选范围为 10～2048Gi。默认为 10Gi。
   **高可用备库数量**：选择高可用备库的数量。可选 1、2和4。

8. 确认信息无误后，点击**安装**，跳转到 **RadonDB 数据库应用**页面。

   待 RadonDB MySQL 集群状态为`运行中`时，则集群启动并正常运行。

   ![RadonDB MySQL 运行中](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-running.png)
