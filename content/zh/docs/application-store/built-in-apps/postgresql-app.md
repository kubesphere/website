---
title: "在 KubeSphere 中部署 PostgreSQL"
keywords: 'Kubernetes, KubeSphere, PostgreSQL, 应用商店'
description: '如何从 KubeSphere 的应用商店部署 PostgreSQL'
linkTitle: "在 KubeSphere 中部署 PostgreSQL"
weight: 14280  
---

作为强大的开源对象关系型数据库系统，[PostgreSQL](https://www.postgresql.org/) 以其卓越的可靠性、功能鲁棒性和高性能而著称。

本教程演示如何从 KubeSphere 的应用商店部署 PostgreSQL。

## 准备工作

- 您需要[启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`)。该帐户必须是已邀请至项目的平台普通用户，并且在项目中的角色为 `operator`。在本教程中，您需要以 `project-regular` 用户登录，并在 `demo-workspace` 企业空间的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店部署 PostgreSQL

1. 在 `demo-project` 的**概览**页面，点击左上角的**应用商店**。

   ![click-app-store](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/click-app-store.jpg)

2. 找到 PostgreSQL，在**应用信息**页面点击**部署**。

   ![postgresql-in-app-store](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/postgresql-in-app-store.jpg)

   ![deploy-postgresql](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/deploy-postgresql.jpg)

3. 设置应用名称和版本，确保 PostgreSQL 部署在 `demo-project` 项目中，然后点击**下一步**。

   ![deploy-postgresql-2](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/deploy-postgresql-2.jpg)

4. 在**应用配置**页面，为应用设置持久卷，记录用户名和密码用于后续访问应用，然后点击**部署**。

   ![set-config](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/set-config.jpg)

   {{< notice note >}} 

   如需为 PostgreSQL 设置更多的参数，可点击 **YAML** 后的切换开关打开应用的 YAML 清单文件，并在清单文件中设置相关参数。 

   {{</ notice >}} 

5. 等待 PostgreSQL 创建完成并开始运行。

   ![postgresql-ready](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/postgresql-ready.jpg)

### 步骤 2：访问 PostgreSQL 数据库

要从集群外访问 PostgreSQL，您需要先用 NodePort 暴露该应用。

1. 打开**服务**页面并点击 PostgreSQL 的服务名称。

   ![access-postgresql](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/access-postgresql.jpg)

2. 点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![edit-internet-access](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/edit-internet-access.jpg)

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![nodeport](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/nodeport.jpg)

4. 您可以在**服务端口**区域查看暴露的端口。该端口将在下一步中用于访问 PostgreSQL 数据库。

   ![port-number](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/port-number.jpg)

5. 在**容器组**区域，展开容器详情，点击终端图标。在弹出的窗口中直接输入命令访问数据库。

   ![container-terminal](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/container-terminal.jpg)

   ![postgresql-output](/images/docs/zh-cn/appstore/built-in-apps/postgresql-app/postgresql-output.jpg)

   {{< notice note >}}

   您也可以使用第三方应用例如 SQLPro Studio 连接数据库。取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

6. 有关更多信息，请参考[ PostgreSQL 官方文档](https://www.postgresql.org/docs/)。