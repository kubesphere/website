---
title: "Configure Webhook Notifications"
keywords: 'KubeSphere, Kubernetes, custom, platform, webhook'
description: 'Configure a webhook server to receive platform notifications through the webhook.'
linkTitle: "Configure Webhook notifications"
weight: 8725
---

A webhook is a way for an app to send notifications triggered by specific events. It delivers information to other applications in real time, allowing users to receive notifications immediately.

This tutorial describes how to configure a webhook server to receive platform notifications.

## Prerequisites

You need an account granted the `platform-admin` role. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../../quick-start/create-workspace-and-project/).

## Configure the Webhook Server

1. Log in to the KubeSphere web console as the `platform-admin` user.

2. Click **Platform** on the upper-left corner and select **Platform Settings**.

3. In the left nevigation pane, click **Webhook** under **Notification Management**.

4. On the **Webhook** page, configure your webhook server by filling in the text boxes. The parameters are described as follows:

   - **URL**: URL of the webhook server.

   - **Verification Type**: Select a verification method for security authentication.
     - **No Auth**: Skip the authentication. It means that all notifications can be sent to the URL.
     - **Bearer Token**: Add a token to the URL for unique identification.
     - **Basic Auth**: Provide a username and password for authentication.

   {{< notice note>}}Currently, KubeSphere does not suppot TLS connections (https). You need to select the checkbox on the left of **Skip TLS Certification** if you use https.

   {{</notice>}}

5. Click **Save** after you finish.

6. (Optional) You can click <img src="/images/docs/cluster-administration/platform-settings/notification-management/configure-webhook/toggle-switch.png" width='30' />/<img src="/images/docs/cluster-administration/platform-settings/notification-management/configure-webhook/toggle-switch-1.png" width='30' /> to turn on/off webhook notifications. After you finish, click **Update** to save the changes.
