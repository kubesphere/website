---
title: "邮件服务器"
keywords: 'KubeSphere, Kubernetes, Notification, Mail Server'
description: '邮件服务器'

linkTitle: "邮件服务器"
weight: 4190
---

## 目标

本指南演示了告警策略的电子邮件通知设置（支持自定义设置）。 您可以指定用户电子邮件地址以接收告警消息。

## 前提条件

[KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/) 需要启用。

## 动手实验室

1. 使用具有 ` platform-admin` 角色的一个帐户登录 Web 控制台。
2. 点击左上角的平台管理，然后选择集群管理。

![mail_server_guide](/images/docs/alerting/mail_server_guide-zh.png)

1. 从列表中选择一个集群并输入它（如果您未启用[多集群功能](../../../multicluster-management/)，则将直接转到**概述**页面）。
2. 在**群集设置**下选择**邮件服务器**。 在页面中，提供您的邮件服务器配置和 SMTP 身份验证信息，如下所示：
    - **SMTP 服务器地址**：填写可以提供邮件服务的 SMTP 服务器地址。 端口通常是 25。
    - **使用 SSL 安全连接**：SSL 可用于加密邮件，从而提高了邮件传输信息的安全性。 通常，您必须为邮件服务器配置证书。
    - SMTP 验证信息：如下填写 **SMTP 用户**，**SMTP 密码**，**发件人电子邮件地址**等

![mail_server_config](/images/docs/alerting/mail_server_config-zh.png)

5. 完成上述设置后，单击**保存**。 您可以发送测试电子邮件以验证服务器配置是否成功。

