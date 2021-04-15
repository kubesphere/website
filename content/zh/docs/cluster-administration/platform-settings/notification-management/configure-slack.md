---
title: "配置 Slack 通知"
keywords: 'KubeSphere, Kubernetes, Slack, 通知'
description: '配置 Slack 通知及添加频道来接收告警策略、事件、审计等通知。'
linkTitle: "配置 Slack 通知"
weight: 8724
---

This tutorial demonstrates how to configure Slack notifications and add channels, which can receive notifications for alerting policies.

本教程演示如何配置 Slack 通知及添加频道，以便接收告警策略的通知。

## 准备工作

您需要准备一个可用的 [Slack](https://slack.com/) 工作区。

## 获取 Slack OAuth 令牌 (Token)

You need to create a Slack app first so that it can help you send notifications to Slack channels. To authenticate your app, you must create an OAuth token.

首先，您需要创建一个 Slack 应用，以便发送通知到 Slack 频道。若想认证您的应用，则必须创建一个 OAuth 令牌。

1. 登录 Slack 以[创建应用](https://api.slack.com/apps)。

2. 在 **Your Apps** 页面，点击 **Create New App**。

3. 在出现的对话框中，输入应用名称并为其选择一个 Slack 工作区。点击 **Create App** 继续。

4. 在左侧导航栏中，选择 **Features** 下的 **OAuth & Permissions**。在 **Auth & Permissions** 页面，下滑到 **Scopes**，分别点击 **Bot Token Scopes** 和 **User Token Scopes** 下的 **Add an OAuth Scope**，两者都选择 **chart:write** 权限。

   ![slack-scope](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/slack-scope.png)

5. 上滑到 **OAuth Tokens & Redirect URLs**，点击 **Install to Workspace**。授予该应用访问您工作区的权限，您可以在 **OAuth Tokens for Your Team** 下看到已创建的令牌。

   ![oauth-token](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/oauth-token.png)

## 在 KubeSphere 控制台上配置 Slack 通知

You must provide the Slack token on the console for authentication so that KubeSphere can send notifications to your channel.

您必须在 KubeSphere 控制台提供 Slack 令牌用于认证，这样 KubeSphere 才能将通知发送至您的频道。

1. 使用具有 `platform-admin` 角色的帐户登录 Web 控制台。

2. 点击左上角的**平台管理**，选择**平台设置**。

3. 导航到**通知管理**下的 **Slack**。

   ![slack-notification](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/slack-notification.png)

4. For **Slack Token** under **Server Settings**, you can enter either a User OAuth Token or a Bot User OAuth Token for authentication. If you use the User OAuth Token, it is the app owner that will send notifications to your Slack channel. If you use the Bot User OAuth Token, it is the app that will send notifications.

   对于**服务器配置**下的 **Slack Token**，您可以选择使用 User OAuth Token 或者 Bot User OAuth Token 进行认证。如果使用 User OAuth Token，将由应用所有者往您的 Slack 频道发送通知；如果使用 Bot User OAuth Token，将由应用发送通知。

5. 在**接收频道设置**下，输入您想要收取通知的频道，点击**添加**。

6. 添加完成后，该频道将在**已设置频道**下列出。您最多可以添加 20 个频道，所有已添加的频道都将能够收到告警通知。

   {{< notice note >}}

   若想从列表中移除频道，请点击频道右侧的 **×** 图标。

   {{</ notice >}} 

7. 点击**保存**。

8. 若想确保通知将会发送到 Slack 频道，请开启**接收通知**并点击**更新**。

   {{< notice note >}}

   如果您更改了现有配置，则必须点击**更新**以应用更改。

   {{</ notice >}} 

9. If you want the app to be the notification sender, make sure it is in the channel. To add it in a Slack channel, enter `/invite @<app-name>` in your channel.如果您想要由应用发送通知，请确保将其加入频道。若想将应用加入 Slack 频道中，请在频道中输入 `/invite @<app-name>`。

   ![add-app](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/add-app.png)

## 接收 Slack 通知

After you configure Slack notifications and add channels, you need to enable [KubeSphere Alerting](../../../../pluggable-components/alerting/) and create an alerting policy for workloads or nodes. Once it is triggered, all the channels in the list can receive notifications.

配置 Slack 通知并添加频道后，您需要启用 [KubeSphere 告警](../../../../pluggable-components/alerting/)，并为工作负载或节点创建告警策略。触发告警后，列表中的全部频道都将能接收通知。

以下图片为 Slack 通知的示例：

![example-notification](/images/docs/cluster-administration/platform-settings/notification-management/configure-slack/example-notification.png)

{{< notice note >}}

- 如果您更新了 Slack 通知配置，KubeSphere 将根据最新配置发送通知。

- By default, KubeSphere sends notifications for the same alert about every 12 hours. The notification repeat interval is mainly controlled by `repeat_interval` in the Secret `alertmanager-main` in the project `kubesphere-monitoring-system`. You can customize the interval as needed.

  默认情况下，KubeSphere 大约每 12 个小时发送相同告警的通知。告警重复间隔主要由 `kubesphere-monitoring-system` 项目中 `alertmanager-main` 密钥的 `repeat_interval` 所控制。您可以按需自定义间隔期间。

- As KubeSphere has built-in alerting policies, if you do not set any customized alerting policies, your Slack channel can still receive notifications once a built-in alerting policy is triggered.

  KubeSphere 拥有内置告警策略，如果不设置任何自定义告警策略，只要触发内置告警策略，那么您的 Slack 频道仍能接收通知。

{{</ notice >}} 