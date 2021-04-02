---
title: "邮件服务器"
keywords: 'KubeSphere, Kubernetes, 通知, 邮件服务器'
description: '自定义您的电子邮件地址设置，以接收来自告警的通知。'

linkTitle: "邮件服务器"
weight: 8630
---

## 目标

本指南演示告警策略的电子邮件通知设置（支持自定义设置）。您可以指定用户电子邮件地址以接收告警消息。

## 准备工作

需要启用 [KubeSphere 告警和通知系统](../../../pluggable-components/alerting-notification/)。

## 动手实验

1. 使用具有 ` platform-admin` 角色的帐户登录 Web 控制台。
2. 点击左上角的**平台管理**，然后选择**集群管理**。

    ![mail_server_guide](/images/docs/zh-cn/cluster-administration/cluster-settings/mail-server/mail_server_guide.png)

3. 从列表中选择一个集群并进入该集群（如果您未启用[多集群功能](../../../multicluster-management/)，则会直接转到**概览**页面）。
4. 在**集群设置**下选择**邮件服务器**。请在该页面提供您的邮件服务器配置和 SMTP 身份验证信息，如下所示：
    - **SMTP 服务器地址**：填写可以提供邮件服务的 SMTP 服务器地址。端口通常是 25。
    - **使用 SSL 安全连接**：SSL 可用于加密邮件，从而提高邮件传输信息的安全性。通常，您需要为邮件服务器配置证书。
    - SMTP 身份验证信息：请填写 **SMTP 用户**、**SMTP 密码**、**发件人电子邮件地址**等，如下所示。

    ![mail_server_config](/images/docs/zh-cn/cluster-administration/cluster-settings/mail-server/mail-server-config.PNG)

5. 完成上述设置后，请点击**保存**。您可以发送一封测试电子邮件以验证服务器配置是否成功。
