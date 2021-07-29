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

You need to prepare an account granted the `platform-admin` role. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../../quick-start/create-workspace-and-project/).

## Configure the Webhook Server

1. Log in to the KubeSphere web console as the `platform-admin` user.

2. Click **Platform** in the upper-left corner and select **Platform Settings**.

3. In the left nevigation pane, click **Webhook** under **Notification Management**.

4. On the **Webhook** page, configure the following parameters:

   - **URL**: URL of the webhook server.

   - **Verification Type**: Webhook authentication method.
     - **No Auth**: Skips authentication. All notifications can be sent to the URL.
     - **Bearer Token**: Uses a token for authentication.
     - **Basic Auth**: Uses a username and password for authentication.

   {{< notice note>}}Currently, KubeSphere does not suppot TLS connections (HTTPS). You need to select **Skip TLS Certification** if you use an HTTPS URL.

   {{</notice>}}

5. Under **Notification Settings**, turn on/off the **Receive Notifications** toggle to start/stop sending notifications to the webhook.

6. Click **Save** after you finish.
