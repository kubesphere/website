---
title: "在 KubeSphere 中管理 RadonDB MySQL 用户帐号"
keywords: 'KubeSphere, Kubernetes, 用户帐号, RadonDB MySQL'
description: '了解如何从 KubeSphere 管理 RadonDB MySQL 用户帐号。'
linkTitle: "管理用户帐号"
weight: 14525
---


本教程演示如何在 KubeSphere 中管理 RadonDB MySQL 用户帐号，包括创建用户帐号、修改用户帐号信息、删除用户帐号。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 请确保创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保已安装 RadonDB mysql 应用。

## 创建用户帐号

1. 选择**应用负载** > **应用**，点击**RadonDB 数据库应用**页面。
2. 在应用列表下，选择 MySQL 集群，进入集群详情页面。
3. 选择**用户帐号**页签，进入用户帐号列表页面。
4. 点击**创建帐号**，弹出帐号配置窗口。

   ![配置帐号](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql—user.png)

5. 设置用户名和密码。
6. 点击**确认**，返回帐号列表即可查看到新增帐号。

## 修改用户帐号

1. 在**用户账号**页面。
2. 在目标帐号行，点击 **...** > **编辑**，弹出修改帐号窗口。

   ![修改帐号](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql—user.png)

3. 设置用户名和密码，点击**确认**即可完成修改。

## 删除用户帐号

{{< notice warning >}}

用户帐号删除后，不可恢复，请谨慎操作。

{{</ notice >}}

1. 在**用户账号**页面。
2. 勾选一个或多个帐号，点击列表上方**删除**，弹出删除确认窗口。

   ![修改帐号](/images/docs/zh-cn/appstore/built-in-apps/radondb-mysql-app/radondb-mysql—user.png)

3. 输入用户名，点击**确认**即可删除帐号。
