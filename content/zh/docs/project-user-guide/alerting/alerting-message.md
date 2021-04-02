---
title: "告警消息（工作负载级别）"
keywords: 'KubeSphere, Kubernetes, 工作负载, 告警, 消息, 通知'
description: '了解如何查看工作负载的告警策略。'

linkTitle: "告警消息（工作负载级别）"
weight: 10720
---

告警消息中记录着按照告警规则触发的告警的详细信息，包括监控目标、告警策略、最近通知和处理意见。

本教程演示如何查看工作负载级别的告警消息。

## 准备工作

* 您需要启用 [KubeSphere 告警和通知](../../../pluggable-components/alerting-notification/)。
* 您需要创建一个企业空间、一个项目和一个帐户（例如 `project-regular`）。该帐户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
* 您需要创建一个工作负载级别的告警策略并接收到相关告警通知。如果尚未创建告警策略，请按照[告警策略（工作负载级别）](../alerting-policy/)创建一个告警策略。

## 动手实验

### 步骤 1：查看告警消息

1. 以 `project-regular` 用户登录 KubeSphere 控制台并进入项目，在左侧导航栏选择**监控告警**下的**告警消息**。页面上显示告警消息列表。如果您已经完成示例教程[告警策略（工作负载级别）](../alerting-policy/)，工作负载 `reviews-v1` 和 `details-v1` 已被设置为监控目标，并且这两个工作负载的内存用量都高于设置的阈值，从而页面上会显示两个对应的告警消息。

   ![alerting_message_workload_level_list](/images/docs/zh-cn/alerting/alerting_message_workload_level_list.png)

2. 选择一个告警消息打开详情页面。**告警详情**选项卡显示被监控工作负载的内存用量随时间的变化。工作负载的内存用量持续高于设置的阈值 20 MiB，于是触发了告警。

   ![alerting_message_workload_level_detail](/images/docs/zh-cn/alerting/alerting_message_workload_level_detail.png)

### 步骤 2：查看告警策略

点击**告警策略**选项卡查看当前告警消息对应的告警策略。页面上显示示例教程[告警策略（工作负载级别）](../alerting-policy/)中设置的告警触发规则。

![alerting_message_workload_level_policy](/images/docs/zh-cn/alerting/alerting_message_workload_level_policy.png)

### 步骤 3：查看最近通知

1. 点击**最近通知**选项卡。页面上显示接收到 3 个通知（由于通知规则为`每 5 分钟警告一次`和`最多重发 3 次`）。

   ![alerting_message_workload_level_notification](/images/docs/zh-cn/alerting/alerting_message_workload_level_notification.png)

2. 登录您的邮箱查看 KubeSphere 邮件服务器发送的告警通知邮件。您一共收到 6 封邮件，这是由于两个被监控的工作负载（或部署）的内存用量持续超过设置的阈值 `20 MiB`，同时通知规则为`每 5 分钟警告一次`和`最多重发 3 次`。

### 步骤 4：添加处理意见

点击页面左侧的**处理意见**为当前告警消息添加处理意见。例如，由于工作负载的内存用量高于告警规则中设置的阈值，您可以在对话框中添加如下处理意见：`此工作负载的默认内存用量上限需要提高`。

![alerting_message_workload_level_comment](/images/docs/zh-cn/alerting/alerting_message_workload_level_comment.png)
