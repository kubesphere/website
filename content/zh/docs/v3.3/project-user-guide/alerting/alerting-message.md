---
title: "告警消息（工作负载级别）"
keywords: 'KubeSphere, Kubernetes, 工作负载, 告警, 消息, 通知'
description: '了解如何查看工作负载的告警策略。'

linkTitle: "告警消息（工作负载级别）"
weight: 10720
version: "v3.3"
---

告警消息中记录着按照告警规则触发的告警的详细信息。本教程演示如何查看工作负载级别的告警消息。

## 准备工作

* 您需要启用 [KubeSphere 告警系统](../../../pluggable-components/alerting/)。
* 您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
* 您需要创建一个工作负载级别的告警策略并且已经触发该告警。有关更多信息，请参考[告警策略（工作负载级别）](../alerting-policy/)。

## 查看告警消息

1. 使用 `project-regular` 帐户登录控制台并进入您的项目，导航到**监控告警**下的**告警消息**。

2. 在**告警消息**页面，可以看到列表中的全部告警消息。第一列显示您在告警通知中定义的标题和消息。如需查看某一告警消息的详情，点击该告警策略的名称，然后在显示的页面中点击**告警历史**选项卡。

3. 在**告警历史**选项卡，您可以看到告警级别、监控目标以及告警激活时间。

## 查看通知

如果需要接收告警通知（例如，邮件和 Slack 消息），则须先配置[一个通知渠道](../../../cluster-administration/platform-settings/notification-management/configure-email/)。