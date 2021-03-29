---
title: "告警策略（工作负载级别）"
keywords: 'KubeSphere, Kubernetes, 工作负载, 告警, 策略, 通知'
description: '如何设置工作负载级别的告警策略。'
linkTitle: "告警策略（工作负载级别）"
weight: 10710
---

KubeSphere 支持针对节点和工作负载的告警策略。本教程演示如何为项目中的工作负载创建告警策略并配置邮件通知。有关如何为节点配置告警策略，请参阅[告警策略（节点级别）](../../../cluster-administration/cluster-wide-alerting-and-notification/alerting-policy/)。

## 准备工作

- 您需要启用 [KubeSphere 告警和通知](../../../pluggable-components/alerting-notification/)。
- 您需要配置[邮件服务器](../../../cluster-administration/cluster-settings/mail-server/)。
- 您需要创建一个企业空间、一个项目和一个帐户（例如 `project-regular`）。该帐户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要确保项目中存在工作负载。如果项目中没有工作负载，请进入**应用负载**下的**应用**页面，点击**部署示例应用**快速部署一个应用。有关更多信息，请参阅[部署 Bookinfo 和管理流量](../../../quick-start/deploy-bookinfo-to-k8s/)。

## 动手实验

### 步骤 1：进入控制台

登录 KubeSphere 控制台并进入项目，在左侧导航栏中选择**监控告警**下的**告警策略**，然后在页面右侧点击**创建**。

![alerting_policy_workload_level_create](/images/docs/zh-cn/alerting/alerting_policy_workload_level_create.png)

### 步骤 2：配置基本信息

在弹出的对话框中配置以下信息，然后点击**下一步**。
- **名称**：告警策略的名称，例如 `alert-demo`。该名称将用作告警策略的唯一标识符，请确保名称简洁明了。
- **别名**：帮助您更好地区分不同的告警策略。该字段支持中文字符。
- **描述**：告警策略的简单介绍。

![alerting_policy_workload_level_basic_info](/images/docs/zh-cn/alerting/alerting_policy_workload_level_basic_info.png)

### 步骤 3：选择监控目标

您可以选择**部署**、**有状态副本集**和**守护进程集**三种工作负载作为监控目标。在本示例中，选择**部署**以及 `reviews-v1` 和 `details-v1` 作为监控目标，然后点击**下一步**。

![alerting_policy_workload_level_monitoring_target](/images/docs/zh-cn/alerting/alerting_policy_workload_level_monitoring_target.png)

### 步骤 4：添加告警规则

1. 点击**添加规则**创建告警规则。告警规则中包含指标类型、检查周期、连续次数、指标阈值和告警级别等多个参数可供设置。
   - 检查周期（**规则**下的第二个字段）：表示两次指标检查的间隔，例如 `2 分钟/周期`表示每两分钟检查一次。
   - 连续次数（**规则**下的第三个字段）：表示至少连续几次检查到指标符合条件时才触发告警。

   ![alerting_policy_workload_level_alerting_rule](/images/docs/zh-cn/alerting/alerting_policy_workload_level_alerting_rule.png)

2. 在本示例中，将告警规则设置为`内存用量`、`1 分钟/周期`、`连续 2 次`、`>` 、`20` MiB、`重要告警`。该告警规则表示 KubeSphere 每 1 分钟检查一次内存用量，当连续 2 次检查到内存用量大于 20 MiB 时触发重要告警。

3. 点击 **√** 保存规则，然后点击**下一步**。

   {{< notice note >}}

您可以为以下指标创建工作负载级别的告警策略：
- CPU：`CPU 用量`
- 内存：`内存用量（包含缓存）`和`内存用量`
- 网络：`网络发送数据速率`和`网络接收数据速率`
- 工作负载：`部署副本不可用率`

{{</ notice >}}

### 步骤 5：设置通知规则

1. **通知有效时间**用于设置通知邮件的发送时间，例如 `09:00` 至 `19:00`。**通知渠道**目前只支持邮箱。您可以在**通知列表**中添加被通知的成员的邮箱地址。
1. **自定义重复规则**用于定义通知邮件的重复发送周期和重复发送次数。如果告警未被清除，通知邮件将按重复规则重复发送。您可以为不同的告警级别设置不同的重复规则。例如，将**重要告警**设置为`每 5 分钟警告一次`和`最多重发 3 次`。

   ![alerting_policy_workload_level_notification_rule](/images/docs/zh-cn/alerting/alerting_policy_workload_level_notification_rule.png)

3. 点击**创建**。告警策略创建后显示在**告警策略**页面。

### 步骤 6：查看告警策略

告警策略创建成功后，您可以进入其详情页面查看状态、告警规则、监控目标、通知规则、告警历史等信息。点击**更多操作**，然后从下拉菜单中选择**更改状态**可启用或禁用当前告警策略。