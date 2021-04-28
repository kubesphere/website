---
title: "告警消息（节点级别）"
keywords: 'KubeSphere, Kubernetes, 节点, 告警, 消息, 通知'
description: '了解如何查看节点的告警策略并处理告警消息。'

linkTitle: "告警消息（节点级别）"
weight: 8540
---

告警消息会记录按照告警规则触发的告警的详细信息，包括监控目标、告警策略、最近通知和处理意见。
## 准备工作

您已创建节点级别的告警策略并收到该策略的告警通知。如果尚未准备就绪，请先参考[告警策略（节点级别）](../alerting-policy/)创建一个告警策略。

## 动手实验

### 任务 1：查看告警信息

1. 使用具有 `platform-admin` 角色的帐户登录控制台。

2. 点击左上角的**平台管理**，然后选择**集群管理**。

    ![选择集群管理](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-message-node-level/alerting_message_node_level_guide.png)

3. 从列表中选择一个集群并进入该集群（如果您未启用[多集群功能](../../../multicluster-management/)，则将直接转到**概览**页面）。

4. 转到**监控告警**下的**告警消息**，您可以在列表中看到告警消息。在[告警策略（节点级别）](../alerting-policy/)的示例中，您将一个节点设置为监控目标并且它的内存利用率高于 `50%` 的阈值，因此您可以看到它的告警消息。

    ![告警消息列表](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-message-node-level/alerting_message_node_level_list.png)

5. 点击该告警消息进入详情页面。在**告警详情**中，您可以看到节点的内存利用率随时间变化的图表，该图表显示内存一直高于告警规则中设置的 `50％` 的阈值，因此触发了告警。

    ![告警详情](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-message-node-level/alerting_message_node_level_detail.png)

### 任务 2：查看告警策略

切换到**告警策略**查看与此告警消息相对应的告警策略，您可以在[告警策略（节点级别）](../alerting-policy/)示例中看到设置的触发规则。

![告警策略](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-message-node-level/alerting_message_node_level_policy.png)

### 任务 3：查看最近通知

1. 切换到**最近通知**。您可以看到已收到 3 条通知，因为该通知规则设置的重复周期为`每 5 分钟警告1次`和`最多重发3次`。

    ![告警通知](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-message-node-level/alerting_message_node_level_notification.png)

2. 登录到您配置的邮箱，查看 KubeSphere 邮件服务器发送的告警通知邮件。您一共会收到 3 封邮件。

### 任务 4：添加处理意见

点击**处理意见**将处理意见添加到当前告警消息。例如，由于节点的内存利用率高于告警规则中设置的阈值，因此您可以在下面的对话框中添加处理意见：`节点需要添加污点，并且不允许将新的 Pod 调度到该节点`。

![alerting_message_node_level_comment](/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-message-node-level/alerting_message_node_level_comment.png)

