---
title: "Configure WeCom Notifications"
keywords: 'KubeSphere, Kubernetes, WeCom, Alerting, Notification'
description: 'Learn how to configure a WeCom server to receive platform notifications sent by KubeSphere.'
linkTitle: "Configure WeCom Notifications"
weight: 8724
version: "v3.3"
---

[WeCom](https://work.weixin.qq.com/) is a communication platform for enterprises that includes convenient communication and office automation tools.

This document describes how to configure a WeCom server to receive platform notifications sent by KubeSphere.

## Prerequisites

- You need to have a user with the `platform-admin` role, for example, the `admin` user. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).
- You need to have a [WeCom account](https://work.weixin.qq.com/wework_admin/register_wx?from=myhome).
- You need to create a self-built application on the [WeCom Admin Console](https://work.weixin.qq.com/wework_admin/loginpage_wx) and obtain its AgentId and Secret. 

## Configure WeCom Server

1. Log in to the KubeSphere console as `admin`.
2. Click **Platform** in the upper-left corner and select **Platform Settings**.
3. In the left navigation pane, click **Notification Configuration** under **Notification Management**.
4. On the **WeCom** page, set the following fields under **Server Settings**:
   - **Corporation ID**: The Corporation ID of your WeCom account.
   - **App AgentId**: The AgentId of the self-built application.
   - **App Secret**: The Secret of the self-built application.
5. To add notification recipients, select **User ID**, **Department ID**, or **Tag ID** under **Recipient Settings**, enter a corresponding ID obtained from your WeCom account, and click **Add** to add it.
6. To specify notification conditions, select the **Notification Conditions** checkbox. Specify a label, an operator, and values and click **Add** to add it. You will receive only notifications that meet the conditions.
7. After the configurations are complete, click **Send Test Message** to send a test message.
8. If you successfully receive the test message, click **OK** to save the configurations.
9. To enable WeCom notifications, turn the toggle in the upper-right corner to **Enabled**.

