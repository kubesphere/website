---
title: "Configure Webhook Notifications"
keywords: 'KubeSphere, Kubernetes, custom, platform, webhook'
description: 'Configure a webhook server to receive platform notifications through the webhook.'
linkTitle: "Configure Webhook Notifications"
weight: 8726
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

5. Select the checkbox on the left of **Notification Conditions** to set notification conditions.

    - **Label**: Name, severity, or monitoring target of an alerting policy. You can select a label or customize a label.
    - **Operator**: Mapping between the label and the values. The operator includes **Includes values**, **Does not include values**, **Exists**, and **Does not exist**.
    - **Values**: Values associated with the label.
    {{< notice note >}}

   - Operators **Includes values** and **Does not include values** require one or more label values. Use a carriage return to separate values.
   - Operators **Exists** and **Does not exist** determine whether a label exists, and do not require a label value.

   {{</ notice >}} 

6. You can click **Add** to add notification conditions, or click <img src="/images/docs/common-icons/trashcan.png" width='25' height='25' /> on the right of a notification condition to delete the condition.

7. After the configurations are complete, you can click **Send Test Message** for verification.

8. On the upper-right corner, you can turn on the **Disabled** toggle to enbale notifications, or turn off the **Enabled** toggle to diable them.

9. Click **OK** after you finish.

   {{< notice note >}}

   - After the notification conditions are set, the recepients will receive only notifications that meet the conditions.
   - If you change the existing configuration, you must click **OK** to apply it.

   {{</ notice >}} 
