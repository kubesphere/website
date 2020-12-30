---
title: "在 KubeSphere 中部署 MySQL"
keywords: 'KubeSphere, Kubernetes, 安装, MySQL'
description: '如何通过应用商店在 KubeSphere 中部署 MySQL'

link title: "在 KubeSphere 中部署 MySQL"
weight: 14260
---
[MySQL ](https://www.mysql.com/)是一个开源的关系型数据库管理系统 (RDBMS)，它基于最常用的数据库管理语言 SQL。作为世界上最受欢迎的开源数据库，MySQL 为云原生应用部署提供了完全托管的数据库服务。

本教程演示如何从 KubeSphere 的应用商店部署 MySQL。

## 准备工作

- 您需要[启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`)。该帐户必须是已邀请至项目的平台普通用户，并且在项目中的角色为 `operator`。在本教程中，您需要以 `project-regular` 用户登录，并在 `demo-workspace` 企业空间的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店部署 MySQL

1. 在 `demo-project` 的**概览**页面，点击左上角的**应用商店**。

   ![go-to-app-store](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/go-to-app-store.jpg)

2. 找到 MySQL，在**应用信息**页面点击**部署**。

   ![find-mysql](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/find-mysql.jpg)

   ![click-deploy](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/click-deploy.jpg)

3. 设置应用名称和版本，确保 MySQL 部署在 `demo-project` 项目中，然后点击**下一步**。

   ![deploy-mysql](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/deploy-mysql.jpg)

4. 在**应用配置**页面，取消对 `mysqlRootPassword` 字段的注释并设置密码，然后点击**部署**。

   ![uncomment-password](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/uncomment-password.jpg)

5. 等待 MySQL 创建完成并开始运行。

   ![mysql-running](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/mysql-running.jpg)

### 步骤 2：访问 MySQL 终端

1. 打开**工作负载**页面并点击 MySQL 的工作负载名称。

   ![mysql-workload](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/mysql-workload.jpg)

2. 在**容器组**区域，展开容器详情，点击终端图标。

   ![mysql-teminal](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/mysql-teminal.jpg)

3. 在终端窗口中，执行 `mysql -uroot -ptesting` 命令以 `root` 用户登录 MySQL。

   ![log-in-mysql](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/log-in-mysql.jpg)

### 步骤 3：从集群外访问 MySQL 数据库

要从集群外访问 MySQL，您需要先用 NodePort 暴露该应用。

1. 打开**服务**页面并点击 MySQL 的服务名称。

   ![mysql-service](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/mysql-service.jpg)

2. 点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![edit-internet-access](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/edit-internet-access.jpg)

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![nodeport-mysql](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/nodeport-mysql.jpg)

4. 您可以在**服务端口**区域查看暴露的端口。该端口号和公网 IP 地址将在下一步用于访问 MySQL 数据库。

   ![mysql-port-number](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/mysql-port-number.jpg)

5. 您需要使用 MySQL Client 或第三方应用（例如 SQLPro Studio）才能访问 MySQL 数据库。以下演示如何使用 SQLPro Studio 访问 MySQL 数据库。

   ![login](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/login.jpg)

   ![access-mysql-success](/images/docs/zh-cn/appstore/built-in-apps/mysql-app/access-mysql-success.jpg)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

6. 有关 MySQL 的更多信息，请参考[ MySQL 官方文档](https://dev.mysql.com/doc/)。

