---
title: "告警消息（节点级别）"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Message, Notification'
description: '如何在节点级别查看告警信息。'

linkTitle: "告警消息（节点级别）"
weight: 8540
---

告警信息记录根据警报规则触发的告警的详细信息，包括监控目标，告警策略，最近的通知和注释。
## 前提条件

您已创建节点级告警策略并收到有关它的告警通知。 如果尚未准备就绪，请先先参考[告警策略（节点级别）](../alerting-policy/) 创建一个。

## 动手实验

### 任务 1: 查看告警信息

1. 使用一个被授予`平台管理员`角色的帐户登录控制台。.

2. 单击左上角的**平台管理**，然后选择**集群管理**。

    ![alerting_message_node_level_guide](/images/docs/alerting-zh/alerting_message_node_level_guide.png)

3. 从列表中选择一个集群并进入（如果您未启用[多集群特性](../../../multicluster-management/)，则将直接转到**总览**页面）。

4. 导航到**监控告警**下的**告警消息**， 您可以在列表中看到告警消息。您可以在列表中看到警告消息。在[告警策略(节点级别)](../alerting-policy/)的示例中，您将一个节点设置为监控目标，它的内存利用率高于`50%`的阈值，因此您可以看到它的警报消息。

    ![alerting_message_node_level_list](/images/docs/alerting-zh/alerting_message_node_level_list.png)

5. 单击告警消息以进入详细信息页面。 在**告警详细信息**中，您可以看到节点的内存利用率随时间变化的图表，该图表显示内存一直高于警报规则中设置的`50％`阈值，因此触发了警报。

    ![alerting_message_node_level_detail](/images/docs/alerting-zh/alerting_message_node_level_detail.png)

### 任务 2: 查看告警策略

切换到**告警策略**查看与此告警消息相对应的告警策略，您可以在[告警策略（节点级别）](../alerting-policy/)示例中看到设置的触发规则。

![alerting_message_node_level_policy](/images/docs/alerting-zh/alerting_message_node_level_policy.png)

### 任务 3: 查看最近的通知

1. 切换到**最近通知**。 可以看到已收到3条通知，因为该通知规则设置的自定义重复规则为`每5分钟告警1次`和`最多重发3次`。

    ![alerting_message_node_level_notification](/images/docs/alerting-zh/alerting_message_node_level_notification.png)

2. 登录到配置的告警发送邮箱，查看KubeSphere邮件服务器发送的警报通知邮件。您一共会收到3封邮件。

### 任务 4: 添加处理意见

单击**处理意见**将意见添加到当前警报消息。 例如，由于节点的内存利用率高于基于警报规则设置的阈值，因此您可以在下面的对话框中添加注释：`节点需要添加污点标记，并且不允许将新的容器组调度到该节点`。

![alerting_message_node_level_comment](/images/docs/alerting-zh/alerting_message_node_level_comment.png)
