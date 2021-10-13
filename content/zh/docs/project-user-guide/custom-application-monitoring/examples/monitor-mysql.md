---
title: "监控 MySQL"
keywords: '监控, Prometheus, MySQL, MySQL Exporter'
description: '部署 MySQL 和 MySQL Exporter 并为该应用创建监控面板。'
linkTitle: "监控 MySQL"
weight: 10812
---
通过[介绍](../../../../project-user-guide/custom-application-monitoring/introduction/#间接暴露)一文，您了解到无法直接将 Prometheus 指标接入 MySQL。若要以 Prometheus 格式暴露 MySQL 指标，您需要先部署 MySQL Exporter。

本教程演示如何监控 MySQL 指标并将其可视化。

## 准备工作

- 请确保已[启用应用商店](../../../../pluggable-components/app-store/)。MySQL 和 MySQL Exporter 将通过应用商店来部署。
- 您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)。该帐户需要在该项目中具有 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

## 步骤 1：部署 MySQL

首先，请[从应用商店部署 MySQL](../../../../application-store/built-in-apps/mysql-app/)。

1. 前往您的项目，点击左上角的**应用商店**。

2. 点击 **MySQL** 进入其产品详情页面，点击**应用信息**选项卡中的**部署**。

    {{< notice note >}}

MySQL 是 KubeSphere 应用商店中的内置应用，应用商店启用后可以直接部署和使用 MySQL。

{{</ notice >}} 

3. 在**基本信息**下，设置**应用名称**并选择**应用版本**。在**部署位置**下，选择要部署该应用的项目，然后点击**下一步**。

4. 在**应用配置**下，取消 `mysqlRootPassword` 字段的注解，并设置 root 密码，然后点击**部署**。

    ![mysql-root-password](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-root-password.png)

5. 等待 MySQL 启动并运行。

    ![mysql-ready](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-ready.png)

## 步骤 2：部署 MySQL Exporter

您需要在同一个集群上的同一个项目中部署 MySQL Exporter。MySQL Exporter 负责查询 MySQL 状态并以 Prometheus 格式报告数据。

1. 前往**应用商店**，点击 **MySQL Exporter**。

2. 在产品详情页面，点击**部署**。

3. 在**基本信息**下，设置**应用名称**并选择**应用版本**。在**部署位置**下，选择要部署该应用的项目（须和部署 MySQL 的项目相同），然后点击**下一步**。

4. 请确保 `serviceMonitor.enabled` 设为 `true`。内置 MySQL Exporter 默认将其设置为 `true`，故您无需手动修改 `serviceMonitor.enabled`。

    {{< notice warning >}}
如果您使用外部 Exporter 的 Helm Chart，请务必启用 ServiceMonitor CRD。此类 Chart 通常默认禁用 ServiceMonitor，需要手动修改。
    {{</ notice >}}

5. 修改 MySQL 连接参数。MySQL Exporter 需要连接到目标 MySQL。在本教程中，MySQL 以服务名 `mysql-dh3ily` 进行安装。在配置文件的 `mysql` 部分，将 `host` 设置为 `mysql-dh3ily`，`pass` 设置为 `testing`， `user` 设置为 `root`，如下所示。请注意，您 MySQL 服务的**名称可能不同**。

    ![mysql-exporter-configurations](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-exporter-configurations.png)

    点击**部署**。

6. 等待 MySQL Exporter 启动并运行。

    ![mysql-exporter-ready](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-exporter-ready.png)

## 步骤 3：创建监控面板

您可以为 MySQL 创建监控面板，并将指标实时可视化。

1. 在同一项目中，选择侧边栏中**监控告警**下的**自定义监控**，点击**创建**。

2. 在出现的对话框中，为监控面板设置名称（例如，`mysql-overview`）并选择 MySQL 模板。点击**下一步**继续。

3. 点击右上角的**保存模板**保存该模板。新创建的监控面板会显示在**自定义监控面板**页面。

    ![mysql-monitoring-dashboard](/images/docs/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-monitoring-dashboard.png)

    {{< notice note >}}

- 内置 MySQL 模板由 KubeSphere 提供，以便您监控 MySQL 的各项指标。您也可以按需在监控面板上添加更多指标。
  
- 有关监控面板上各属性的更多信息，请参见[可视化](../../../../project-user-guide/custom-application-monitoring/visualization/overview/)。
      {{</ notice >}}