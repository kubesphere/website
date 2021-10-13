---
title: "Configure Slack Notifications"
keywords: 'KubeSphere, Kubernetes, Slack, notifications'
description: 'Configure Slack notifications and add channels to receive notifications from alerting policies, kube-events, and kube-auditing.'
linkTitle: "Configure Slack Notifications"
weight: 8724
---

This tutorial demonstrates how to configure Slack notifications and add channels, which can receive notifications for alerting policies.

## Prerequisites

You have an available [Slack](https://slack.com/) workspace.

## Obtain a Slack OAuth Token

You need to create a Slack app first so that it can help you send notifications to Slack channels. To authenticate your app, you must create an OAuth token.

1. Log in to Slack to [create an app](https://api.slack.com/apps).

2. On the **Your Apps** page, click **Create New App**.

3. In the dialog that appears, enter your app name and select a Slack workspace for it. Click **Create App** to continue.

4. From the left navigation bar, select **OAuth & Permissions** under **Features**. On the **Auth & Permissions** page, scroll down to **Scopes** and click **Add an OAuth Scope** under **Bot Token Scopes** and **User Token Scopes** respectively. Select the **chart:write** permission for both scopes.

   ![slack-scope](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/slack-scope.png)

5. Scroll up to **OAuth Tokens & Redirect URLs** and click **Install to Workspace**. Grant the permission to access your workspace for the app and you can find created tokens under **OAuth Tokens for Your Team**.

   ![oauth-token](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/oauth-token.png)

## Configure Slack Notifications on the KubeSphere Console

You must provide the Slack token on the console for authentication so that KubeSphere can send notifications to your channel.

1. Log in to the web console with a user granted the role `platform-admin`.

2. Click **Platform** in the top-left corner and select **Platform Settings**.

3. Navigate to **Slack** under **Notification Management**.

   ![slack-notification](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/slack-notification.png)

4. For **Slack Token** under **Server Settings**, you can enter either a User OAuth Token or a Bot User OAuth Token for authentication. If you use the User OAuth Token, it is the app owner that will send notifications to your Slack channel. If you use the Bot User OAuth Token, it is the app that will send notifications.

5. Under **Channel Settings**, enter a Slack channel where you want to receive notifications and click **Add**.

6. After it is added, the channel will be listed under **Channel List**. You can add up to 20 channels and all of them will be able to receive notifications of alerts.

   {{< notice note >}}

   To remove a channel from the list, click the cross icon next to the channel.

   {{</ notice >}} 

7. Click **Save**.

8. To make sure notifications will be sent to a Slack channel, turn on **Receive Notifications** and click **Update**.

   {{< notice note >}}

   If you change the existing configuration, you must click **Update** to apply it.

   {{</ notice >}} 

9. If you want the app to be the notification sender, make sure it is in the channel. To add it in a Slack channel, enter `/invite @<app-name>` in your channel.

   ![add-app](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/add-app.png)

## Receive Slack Notifications

After you configure Slack notifications and add channels, you need to enable [KubeSphere Alerting](../../../../pluggable-components/alerting/) and create an alerting policy for workloads or nodes. Once it is triggered, all the channels in the list can receive notifications.

The image below is a Slack notification example:

![example-notification](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/example-notification.png)

{{< notice note >}}

- If you update your Slack notification configuration, KubeSphere will send notifications based on the latest configuration.
- By default, KubeSphere sends notifications for the same alert about every 12 hours. The notification repeat interval is mainly controlled by `repeat_interval` in the Secret `alertmanager-main` in the project `kubesphere-monitoring-system`. You can customize the interval as needed.
- As KubeSphere has built-in alerting policies, if you do not set any customized alerting policies, your Slack channel can still receive notifications once a built-in alerting policy is triggered.

{{</ notice >}} 

