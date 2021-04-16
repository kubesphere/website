---
title: "配置邮件通知"
keywords: 'KubeSphere, Kubernetes, 自定义, 平台'
description: '配置邮件服务器并添加接收人以接收告警策略、事件、审计等邮件通知。'
linkTitle: "配置邮件通知"
weight: 8721
---

本教程演示如何配置邮件通知及添加接收人，以便接收告警策略的邮件通知。

## 配置邮件服务器

1. 使用具有 `platform-admin` 角色的帐户登录 Web 控制台。

2. 点击左上角的**平台管理**，选择**平台设置**。

3. 导航至**通知管理**下的**邮件**。

   ![email-server](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-email/email-server.png)

4. 在**服务器配置**下，填写以下字段配置邮件服务器。

   - **SMTP 服务器地址**：能够提供邮件服务的 SMTP 服务器地址。端口通常是 `25`。
   - **使用 SSL 安全连接**：SSL 可以用于加密邮件，从而提高通过邮件传输的信息的安全性。通常来说，您必须为邮件服务器配置证书。
   - **SMTP 用户**：SMTP 帐户。
   - **SMTP 密码**：SMTP 帐户密码。
   - **发件人邮箱**：发件人的邮箱地址。目前不支持自定义邮箱地址。

5. 点击**保存**。

## 添加接收人

1. 在**接收设置**下，输入接收人的邮箱地址，点击**添加**。

2. 添加完成后，接收人的邮箱地址将在**接收设置**下列出。您最多可以添加 50 位接收人，所有接收人都将能收到告警通知。

3. 若想移除接收人，请将鼠标悬停在想要移除的邮箱地址上，然后点击右侧出现的垃圾桶图标。

4. 若要确保将通知发送至接收人，请开启**接收通知**并点击**更新**。

   {{< notice note >}}

   如果您更改了现有配置，则必须点击**更新**以应用更改。

   {{</ notice >}} 

## 接收邮件通知

配置邮件通知并添加接收人后，您需要启用 [KubeSphere 告警](../../../pluggable-components/alerting/)，并为工作负载或节点创建告警策略。告警触发后，所有接收人都将能收到邮件通知。

以下图片为邮件通知的示例：

![example-email-notification](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-email/example-email-notification.png)

{{< notice note >}}

- 如果您更新了邮件服务器配置，KubeSphere 将根据最新配置发送邮件通知。
- 默认情况下，KubeSphere 大约每 12 小时针对同一告警发送通知。告警重复间隔期主要由 `kubesphere-monitoring-system` 项目中 `alertmanager-main` 密钥的 `repeat_interval` 所控制。您可以按需自定义间隔期。
- KubeSphere 拥有内置告警策略，在不设置任何自定义告警策略的情况下，只要内置告警策略被触发，您的接收人仍能收到邮件通知。

{{</ notice >}} 
