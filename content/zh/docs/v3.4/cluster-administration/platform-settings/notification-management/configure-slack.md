---
title: "配置 Slack 通知"
keywords: 'KubeSphere, Kubernetes, Slack, 通知'
description: '配置 Slack 通知及添加频道来接收告警策略、事件、审计等通知。'
linkTitle: "配置 Slack 通知"
weight: 8725
---

本教程演示如何配置 Slack 通知及添加频道，以便接收告警策略的通知。

## 准备工作

您需要准备一个可用的 [Slack](https://slack.com/) 工作区。

## 获取 Slack OAuth 令牌 (Token)

首先，您需要创建一个 Slack 应用，以便发送通知到 Slack 频道。若想认证您的应用，则必须创建一个 OAuth 令牌。

1. 登录 Slack 以[创建应用](https://api.slack.com/apps)。

2. 在 **Your Apps** 页面，点击 **Create New App**。

3. 在出现的对话框中，输入应用名称并为其选择一个 Slack 工作区。点击 **Create App** 继续。

4. 在左侧导航栏中，选择 **Features** 下的 **OAuth & Permissions**。在 **Auth & Permissions** 页面，下滑到 **Scopes**，分别点击 **Bot Token Scopes** 和 **User Token Scopes** 下的 **Add an OAuth Scope**，两者都选择 **chart:write** 权限。

5. 上滑到 **OAuth Tokens & Redirect URLs**，点击 **Install to Workspace**。授予该应用访问您工作区的权限，您可以在 **OAuth Tokens for Your Team** 下看到已创建的令牌。

## 在 KubeSphere 控制台上配置 Slack 通知

您必须在 KubeSphere 控制台提供 Slack 令牌用于认证，以便 KubeSphere 将通知发送至您的频道。

1. 使用具有 `platform-admin` 角色的用户登录 Web 控制台。

2. 点击左上角的**平台管理**，选择**平台设置**。

3. 导航到**通知管理**下的**通知配置**，选择 **Slack**。

4. 对于**服务器设置**下的 **Slack 令牌**，您可以选择使用 User OAuth Token 或者 Bot User OAuth Token 进行认证。如果使用 User OAuth Token，将由应用所有者往您的 Slack 频道发送通知；如果使用 Bot User OAuth Token，将由应用发送通知。

5. 在**接收频道设置**下，输入您想要收取通知的频道，点击**添加**。

6. 添加完成后，该频道将在**已添加的频道**下列出。您最多可以添加 20 个频道，所有已添加的频道都将能够收到告警通知。

   {{< notice note >}}

   若想从列表中移除频道，请点击频道右侧的 **×** 图标。

   {{</ notice >}} 

7. 点击**确定**。

8. 勾选**通知条件**左侧的复选框即可设置通知条件。
   
   - **标签**：告警策略的名称、级别或监控目标。您可以选择一个标签或者自定义标签。
   - **操作符**：标签与值的匹配关系，包括**包含值**，**不包含值**，**存在**和**不存在**。
   - **值**：标签对应的值。
   {{< notice note >}}
   - 操作符**包含值**和**不包含值**需要添加一个或多个标签值。使用回车分隔多个值。
   - 操作符**存在**和**不存在**判断某个标签是否存在，无需设置标签值。
   {{</ notice >}}

   您可以点击**添加**来添加多个通知条件，或点击通知条件右侧的 <img src="/images/docs/v3.3/common-icons/trashcan.png" width='25' height='25' alt="icon" /> 来删除通知条件。

9. 配置完成后，您可以点击右下角的**发送测试信息**进行验证。

10. 在右上角，打开**未启用**开关来接收 Slack 通知，或者关闭**已启用**开关来停用 Slack 通知。

     {{< notice note >}}

   - 通知条件设置后，接收人只会接受符合条件的通知。
   - 如果您更改了现有配置，则必须点击**确定**以应用更改。

   {{</ notice >}} 

11. 若想由应用发送通知，请确保将其加入频道。请在 Slack 频道中输入 `/invite @<app-name>` 将应用加入至该频道。

## 接收 Slack 通知

配置 Slack 通知并添加频道后，您需要启用 [KubeSphere 告警](../../../../pluggable-components/alerting/)，并为工作负载或节点创建告警策略。告警触发后，列表中的全部频道都将能接收通知。

{{< notice note >}}

- 如果您更新了 Slack 通知配置，KubeSphere 将根据最新配置发送通知。

- 默认情况下，KubeSphere 大约每 12 小时针对同一告警发送通知。告警重复间隔期主要由 `kubesphere-monitoring-system` 项目中 `alertmanager-main` 密钥的 `repeat_interval` 所控制。您可以按需自定义间隔期。

- KubeSphere 拥有内置告警策略，在不设置任何自定义告警策略的情况下，只要内置告警策略被触发，您的 Slack 频道仍能接收通知。

{{</ notice >}} 