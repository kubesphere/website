---
title: "告警策略（节点级别）"
keywords: 'KubeSphere, Kubernetes, 节点, 告警, 策略, 通知'
description: '了解如何为节点设置告警策略。'

linkTitle: "告警策略（节点级别）"
weight: 8530
---

## 目标

KubeSphere 为节点和工作负载提供告警策略。本指南演示如何为集群中的节点创建告警策略以及如何配置电子邮件通知。如需了解如何为工作负载配置告警策略，请参见[告警策略（工作负载级别）](../../../project-user-guide/alerting/alerting-policy/)。

## 准备工作

- 您需要启用 [KubeSphere 告警和通知系统](../../../pluggable-components/alerting-notification/)。
- 您需要配置[邮件服务器](../../../cluster-administration/cluster-settings/mail-server/)。

## 动手实验

### 任务 1：创建一个告警策略

1. 使用具有 `platform-admin` 角色的帐户登录控制台。

2. 点击左上角的**平台管理**，然后选择**集群管理**。

    ![选择集群管理](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting_policy_node_level_guide.png)

3. 从列表中选择一个集群并进入该集群（如果您未启用[多集群功能](../../../multicluster-management/)，则将直接转到**概览**页面）。

4. 转到**监控告警**下的**告警策略**，点击**创建**.

    ![点击创建](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting_policy_node_level_create.png)

### 任务 2：提供基本信息

在弹出对话框中，填写如下基本信息。完成操作后，点击**下一步**。

- **名称**：该告警策略的简明名称，例如 `alert-demo`，用作其唯一标识符。
- **别名**：帮助您更好地区分告警策略，支持中文。
- **描述信息**：告警策略的简要介绍。

![基本信息](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting_policy_node_level_basic_info.png)

### 任务 3：选择监控目标

在节点列表中选择节点，或使用**节点选择器**选择一组节点作为监控目标。为了方便演示，此处选择一个节点。完成操作后，点击**下一步**。

![监控目标](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting_policy_node_level_monitoring_target.png)

{{< notice note >}}

您可以在下拉菜单中通过以下三种方式对节点列表中的节点进行排序：`按 CPU 使用率排行`、`按内存使用率排行`、`按容器组用量排行`。

{{</ notice >}}

### 任务 4：添加告警规则

1. 点击**添加规则**创建告警规则。告警规则定义指标类型、检查周期、连续次数、指标阈值和告警级别等多个参数，可提供丰富配置。检查周期（**规则**下的第二个字段）表示两次连续指标检查之间的时间间隔。例如，`2 分钟/周期`表示每 2 分钟检查一次指标。连续次数（**规则**下的第三个字段）表示检查的指标满足阈值的连续次数。只有当实际次数等于或大于告警策略中设置的连续次数时，才会触发告警。

    ![告警规则](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting_policy_node_level_alerting_rule.png)

2. 在本示例中，将这些参数分别设置为`内存利用率`、`1 分钟/周期`、`连续2次`、`>`、`50％` 和`重要告警`。这意味着 KubeSphere 会每 1 分钟检查一次内存利用率，如果连续 2 次大于 50%，则会触发此重要告警。

3. 完成操作后，点击 **√** 保存规则，然后点击**下一步**继续。

{{< notice note >}}

您可以为以下指标创建节点级别的告警策略：

- CPU：`CPU利用率`、`CPU 1分钟平均负载`、`CPU 5分钟平均负载`、`CPU 15分钟平均负载`
- 内存：`内存利用率`、`可用内存`
- 磁盘：`inode利用率`、`本地磁盘可用空间`、`本地磁盘空间利用率`、`本地磁盘写入吞吐量`、`本地磁盘读取吞吐量`、`本地磁盘读取IOPS`、`本地磁盘写入IOPS`
- 网络：`网络发送数据速率`、`网络接收数据速率`
- 容器组：`容器组异常率`、`容器组利用率`

{{</ notice >}}

### 任务 5：设置通知规则

1. **通知有效时间**用于设置通知电子邮件的发送时间，例如 `09:00` 至 `19:00`。 **通知渠道**目前仅支持**邮箱**。您可以在**通知列表**中添加要通知的成员的邮箱地址。

2. **自定义重复规则**用于定义通知邮件的发送周期和重发次数。如果告警未被解除，则会在一段时间后重复发送通知。不同级别的告警还可以设置不同的重复规则。上一步中设置的告警级别为`重要告警`，因此在**重要告警**的第二个字段选择`每 5 分钟警告一次`（发送周期），并在第三个字段中选择`最多重发3次`（重发次数）。请参考下图设置通知规则：

    ![通知规则](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting_policy_node_level_notification_rule.PNG)

3. 点击**创建**，您可以看到告警策略已成功创建。

{{< notice note >}}

*告警等待时间* **=** *检查周期* **x** *连续次数*。例如，如果检查周期为 1 分钟/周期，并且连续次数为 2，则需要等待 2 分钟后才会显示告警消息。

{{</ notice >}}

### 任务 6：查看告警策略

成功创建告警策略后，您可以进入其详情页面查看状态、告警规则、监控目标、通知规则和告警历史等信息。点击**更多操作**，然后从下拉菜单中选择**更改状态**可以启用或禁用此告警策略。

![详情页面](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/alerting-policy-node-level-detail-page.png)
