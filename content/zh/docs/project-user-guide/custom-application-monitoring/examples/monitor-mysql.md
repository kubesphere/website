---
title: "监控 MySQL"
keywords: '监控, Prometheus, Prometheus operator'
description: '监控 MySQL'
linkTitle: "监控 MySQL"
weight: 10812
---
通过[介绍](../../../../project-user-guide/custom-application-monitoring/introduction/#间接暴露)一文，您了解到无法直接将 Prometheus 指标接入 MySQL。要以 Prometheus 格式暴露 MySQL 指标，您需要部署 MySQL 导出器 (Exporter)。

本教程演示如何监控 MySQL 指标并将这些指标可视化。

## 准备工作

- 请确保已[启用 OpenPitrix 系统](../../../../pluggable-components/app-store/)。MySQL 和 MySQL 导出器将通过应用商店来部署。
- 您需要创建一个企业空间、一个项目和一个帐户。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../../quick-start/create-workspace-and-project/)。该帐户需要是平台普通用户，将其邀请至项目中并赋予 `operator` 角色作为项目操作员。在本教程中，您以 `project-operator` 身份登录控制台，在 `demo-workspace` 企业空间中的 `demo` 项目下进行操作。

## 动手实验

### 步骤 1：部署 MySQL

首先，请[从应用商店部署 MySQL](../../../../application-store/built-in-apps/mysql-app/)，将 Root 密码设置为 `testing`。

1. 转到 `demo` 项目，点击左上角的**应用商店**。

    ![转到应用商店](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/go-to-app-store.PNG)

2. 找到 **MySQL**，点击**部署**。

    ![找到 MySQL](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/find-mysql.PNG)

    ![点击部署](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/click-deploy.PNG)

3. 请确保将 MySQL 部署在 `demo` 项目，点击**下一步**。

    ![点击下一步](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/click-next.PNG)

4. 取消 `mysqlRootPassword` 字段的注解，点击**部署**。

    ![取消 mysqlRootPassword 注解](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/uncommet-mysqlrootpassword.PNG)

5. 稍等片刻待 MySQL 启动并运行。

    ![Mysql 运行中](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/check-if-mysql-running.PNG)

### 步骤 2：部署 MySQL 导出器

您需要在同一个集群上的 `demo` 项目中部署 MySQL 导出器。MySQL 导出器负责查询 MySQL 状态并报告 Prometheus 格式的数据。

1. 转到**应用商店**，找到 **MySQL exporter**。

    ![找到 Mysql Exporter](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/find-mysql-exporter.PNG) 

    ![Exporter 点击部署](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/exporter-click-deploy.PNG)

2. 部署 MySQL 导出器至 `demo` 项目。

    ![Exporter 点击下一步](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/exporter-click-next.PNG)

3. 请确保将 `serviceMonitor.enabled` 设为 `true`。内置 MySQL 导出器默认将其设置为 `true`，故您无需手动修改 `serviceMonitor.enabled`。

    ![设置 servicemonitor 为 true](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/set-servicemonitor-to-true.PNG)

    {{< notice warning >}}
如果您使用外部导出器的 Helm Chart，请记得启用 ServiceMonitor CRD。此类 Chart 通常默认禁用 ServiceMonitor，需要手动修改。
    {{</ notice >}}

4. 修改 MySQL 连接参数。MySQL 导出器需要连接到目标 MySQL。在本教程中，MySQL 以服务名 `mysql-8jkp3d` 进行安装。请将 `mysql.host` 设置为 `mysql-8jkp3d`，将 `mysql.pass` 设置为 `testing`，将 `user` 设置为 `root`，如下所示。请注意，您的 MySQL 服务创建后可能**名称不同**。

    ![Mysql 连接参数](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-conn-params.PNG)

5. 点击**部署**，稍等片刻待 MySQL 导出器启动并运行。

    ![Exporter 点击部署-2](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/exporter-click-deploy-2.PNG)

    ![Exporter 运行中](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/exporter-is-running.PNG)

### 步骤 3：创建监控面板

大约两分钟后，您可以为 MySQL 创建监控面板，并将指标实时可视化。

1. 转到**监控告警**下的**自定义监控**，点击**创建**。

    ![转到自定义监控](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/navigate-to-custom-monitoring.PNG)

2. 在弹出对话框中，将监控面板命名为 `mysql-overview` 并选择 **MySQL 模板**。点击**创建**继续。

    ![创建 Mysql 仪表板](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/create-mysql-dashboard.PNG)

3. 点击右上角的**保存模板**保存该模板。新创建的监控面板会在监控面板列表中显示，如下所示。

    ![保存 Mysql 模板](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/save-mysql-template.PNG)

    ![监控 Mysql 配置完成](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/monitor-mysql-done.PNG)

    {{< notice tip >}}
有关监控面板上各属性的更多信息，请参见[可视化](../../../../project-user-guide/custom-application-monitoring/visualization/overview/)。
    {{</ notice >}}