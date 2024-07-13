---
title: "Configure DingTalk Notifications"
keywords: 'KubeSphere, Kubernetes, DingTalk, Alerting, Notification'
description: 'Learn how to configure a Dingtalk conversation or chatbot to receive platform notifications sent by KubeSphere.'
linkTitle: "Configure DingTalk Notifications"
weight: 8723
version: "v3.3"
---

[DingTalk](https://www.dingtalk.com/en) is an enterprise-grade communication and collaboration platform. It integrates messaging, conference calling, task management, and other features into a single application.

This document describes how to configure a DingTalk conversation or chatbot to receive platform notifications sent by KubeSphere.

## Prerequisites

- You need to have a user with the `platform-admin` role, for example, the `admin` user. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).
- You need to have a DingTalk account.
- You need to create an applet on [DingTalk Admin Panel](https://oa.dingtalk.com/index.htm#/microApp/microAppList) and make necessary configurations according to [DingTalk API documentation](https://developers.dingtalk.com/document/app/create-group-session).

## Configure DingTalk Conversation or Chatbot

1. Log in to the KubeSphere console as `admin`.
2. Click **Platform** in the upper-left corner and select **Platform Settings**.
3. In the left navigation pane, click **Notification Configuration** under **Notification Management**.
4. On the **DingTalk** page, select the **Conversation Settings** tab and configure the following parameters:
   - **AppKey**: The AppKey of the applet created on DingTalk.
   - **AppSecret**: The AppSecret of the applet created on DingTalk.
   - **Conversation ID**: The conversation ID obtained on DingTalk. To add a conversation ID, enter your conversation ID and click **Add** to add it.
5. (Optional) On the **DingTalk** page, select the **DingTalk Chatbot** tab and configure the following parameters:
   - **Webhook URL**: The webhook URL of your DingTalk robot.
   - **Secret**: The secret of your DingTalk robot.
   - **Keywords**: The keywords you added to your DingTalk robot. To add a keyword, enter your keyword and click **Add** to add it.
6. To specify notification conditions, select the **Notification Conditions** checkbox. Specify a label, an operator, and values and click **Add** to add it. You will receive only notifications that meet the conditions.
7. After the configurations are complete, click **Send Test Message** to send a test message.
8. If you successfully receive the test message, click **OK** to save the configurations.
9. To enable DingTalk notifications, turn the toggle in the upper-right corner to **Enabled**.



