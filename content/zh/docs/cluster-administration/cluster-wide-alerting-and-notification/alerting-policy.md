---
title: "告警策略（节点级别）"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Policy, Notification'
description: '如何在节点级设置告警策略。'

linkTitle: "告警策略（节点级别）"
weight: 8530
---

## 目标

KubeSphere为节点和工作负载提供告警策略。 本指南演示了如何为群集中的节点创建告警策略以及如何配置邮件通知。如需了解如何为工作负载配置告警策略请参阅[告警策略（工作负载级别）](../../../project-user-guide/alerting/alerting-policy/) 。

## 前提条件

- [KubeSphere告警和通知](../../../pluggable-components/alerting-notification/)功能需要启用。
- [邮件服务器](../../../cluster-administration/cluster-settings/mail-server/) 需要配置。

## 动手实验

### 任务 1: 创建一个告警策略

1. 使用一个被授予`平台管理员`角色的帐户登录控制台。

2. 单击左上角的**平台管理**，然后选择**集群管理**。

    ![alerting_policy_node_level_guide](/images/docs/alerting-zh/alerting_policy_node_level_guide.png)

3. 从列表中选择一个集群并进入（如果您未启用[多集群特性](../../../multicluster-management/)，则将直接转到**总览**页面）。

4. 导航到**监控告警**下的**告警策略**，点击 **创建**.

    ![alerting_policy_node_level_create](/images/docs/alerting-zh/alerting_policy_node_level_create.png)

### 任务 2: 提供基本信息

在出现的对话框中，填写如下基本信息。 完成后，单击**下一步**。

- **名称**: 简洁明了的名称作为其唯一标识符，例如`alert-demo`。
- **别名**: 帮助您更好地区分告警策略。 支持中文。
- **描述信息**: 告警策略的简要介绍。

![alerting_policy_node_level_basic_info](/images/docs/alerting-zh/alerting_policy_node_level_basic_info.png)

### 任务 3: 选择监控目标

在节点列表中选择节点，或使用**节点选择器**选择一组节点作为监控目标。 为了方便演示，此处选择一个节点。 完成后单击“下一步”。

![alerting_policy_node_level_monitoring_target](/images/docs/alerting-zh/alerting_policy_node_level_monitoring_target.png)

{{< notice note >}}

您可以通过以下三种方式从下拉菜单中对节点列表中的节点进行排序：</br>

1. CPU使用率
2. 内存使用率
3. 容器组用量

{{</ notice >}}

### 任务 4: 添加告警规则

1. 单击**添加规则**开始创建告警规则。该规则提供丰富的配置，如度量标准类型、检查周期、连续次数、度量阈值和告警级别之类的参数。 检测周期(**规则**下的第二个字段)表示对度量进行两次连续检查之间的时间间隔。 例如，`1分钟/周期`表示每1分钟检查一次指标。 连续次数（**规则**下的第三个字段）表示检查的指标满足阈值的连续次数。 只有当实际次数等于或大于告警策略中设置的连续次数时，才会触发告警。

    ![alerting_policy_node_level_alerting_rule](/images/docs/alerting-zh/alerting_policy_node_level_alerting_rule.png)

2. 在本示例中，将这些参数分别设置为`内存利用率`，`1分钟/周期`，`连续2次`，`>50％`和`重要告警`。这意味着KubeSphere会每分钟检查一次内存利用率，如果连续2次大于50%，则会触发此重要告警。

3. 完成后，单击 **√** 保存规则，然后单击**下一步**继续。

{{< notice note >}}

您可以为以下指标创建节点级别的告警策略：

- CPU：`CPU利用率`, `CPU 1分钟平均负载`, `CPU 5分钟平均负载`, `CPU 15分钟平均负载`
- 内存： `内存利用率`, `可用内存`
- 磁盘： `inode利用率`, `本地磁盘可用空间`, `本地磁盘空间利用率`, `本地磁盘写入吞吐`, `本地磁盘读吞吐`, `磁盘读iops`, `磁盘写iops`
- 网络： `网络发送数据速率`, `网络接收数据速率`
- 容器组： `容器组异常率`, `容器组利用率`

{{</ notice >}}

### 任务 5: 设置通知规则

1. **有效通知时间范围**用于设置通知电子邮件的发送时间，例如09:00〜19:00。 **通知渠道**目前仅支持电子邮件。 您可以将要通知的成员电子邮件地址添加到**通知列表**。

2. **自定义重复规则**定义了通知电子邮件的发送频率和重发次数。 如果尚未解决告警，则将在一段时间后重复发送通知。 还可以为不同级别的告警设置不同的重复规则。 由于在上一步中设置的警报级别为**重要告警**，因此在**重要告警**的第二个字段选择`每5分钟告警一次`（发送周期），并在第三个字段中选`最多重发3次`（重发次数）。 请参考下图设置通知规则：

    ![alerting_policy_node_level_notification_rule](/images/docs/alerting-zh/alerting_policy_node_level_notification_rule.png)

3. 单击**创建**，您可以看到告警策略已成功创建。

{{< notice note >}}

*警报等待时间* **=**  *检测周期* **x** *连续次数*。 例如，如果检测周期为1分钟/周期，并且连续次数为2，则需要等待2分钟，然后才会显示告警消息。

{{</ notice >}}

### 任务 6: 查看告警策略

成功创建告警策略后，您可以进入其详细信息页面查看状态:告警规则、监控目标、通知规则和告警历史记录等。单击**更多操作**，然后从下拉菜单中选择**更改状态**可以启用或禁用此告警策略。

![alerting-policy-node-level-detail-page](/images/docs/alerting-zh/alerting-policy-node-level-detail-page.png)
