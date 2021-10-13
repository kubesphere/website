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

You need to prepare a user granted the `platform-admin` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

## Configure the Webhook Server

1. Log in to the KubeSphere web console as the `platform-admin` user.

2. Click **Platform** in the upper-left corner and select **Platform Settings**.

3. In the left nevigation pane, click **Notification Configuration** under **Notification Management**, and select **Webhook**.

4. On the **Webhook** tab page, set the following parameters:

   - **Webhook URL**: URL of the webhook server.

   - **Verification Type**: Webhook authentication method.
     - **No authentication**: Skips authentication. All notifications can be sent to the URL.
     - **Bearer token**: Uses a token for authentication.
     - **Basic authentication**: Uses a username and password for authentication.

   {{< notice note>}}Currently, KubeSphere does not suppot TLS connections (HTTPS). You need to select **Skip TLS verification (insecure)** if you use an HTTPS URL.

   {{</notice>}}

5. Under **Notification Settings**, turn on/off the **Receive Notifications** toggle to start/stop sending notifications to the webhook.

6. Click **OK** after you finish.
