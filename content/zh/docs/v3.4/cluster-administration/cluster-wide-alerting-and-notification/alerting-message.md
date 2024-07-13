---
title: "告警消息（节点级别）"
keywords: 'KubeSphere, Kubernetes, 节点, 告警, 消息'
description: '了解如何查看节点的告警消息。'

linkTitle: "告警消息（节点级别）"
weight: 8540
version: "v3.4"
---

告警消息会记录按照告警规则触发的告警的详细信息。本教程演示如何查看节点级别的告警消息。
## 准备工作

- 您需要启用 [KubeSphere 告警系统](../../../pluggable-components/alerting/)。
- 您需要创建一个用户 (`cluster-admin`) 并授予其 `clusters-admin` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-4-create-a-role)。
- 您已经创建节点级别的告警策略并已触发该告警。有关更多信息，请参考[告警策略（节点级别）](../alerting-policy/)。

## 查看告警消息

1. 使用 `cluster-admin` 帐户登录 KubeSphere 控制台，导航到**监控告警**下的**告警消息**。

2. 在**告警消息**页面，可以看到列表中的全部告警消息。第一列显示了为告警消息定义的概括和详情。如需查看告警消息的详细信息，点击告警策略的名称，然后点击告警策略详情页面上的**告警历史**选项卡。

3. 在**告警历史**选项卡，您可以看到告警级别、监控目标和告警激活时间。

## 查看通知

如果需要接收告警通知（例如，邮件和 Slack 消息），则须先配置[一个通知渠道](../../../cluster-administration/platform-settings/notification-management/configure-email/)。