---
title: "Configure Email Notifications"
keywords: 'KubeSphere, Kubernetes, custom, platform'
description: 'Configure your email server and add recipients to receive email notifications from alerting policies, kube-events, and kube-auditing.'
linkTitle: "Configure Email Notifications"
weight: 8721
---

This tutorial demonstrates how to configure your email server and add recipients, who can receive email notifications for alerting policies.

## Configure the Email Server

1. Log in to the web console with an account granted the role  `platform-admin`.

2. Click **Platform** in the top left corner and select **Platform Settings**.

3. Navigate to **Email** under **Notification Management**.

   ![emai-server](/images/docs/cluster-administration/platform-settings/notification-management/configure-email/email-server.png)

4. Under **Server Settings**, configure your email server by filling in the following fields.

   - **SMTP Server Address**: The SMTP server address that can provide email services. The port is usually `25`.
   - **Use SSL Secure Connection**: SSL can be used to encrypt emails, thereby improving the security of information transmitted by email. Usually you have to configure the certificate for the email server.
   - **SMTP User**: The SMTP account.
   - **SMTP Password**: The SMTP account password.
   - **Sender Email Address**: The sender's email address. Customized email addresses are currently not supported.

5. Click **Save**.

## Add Recipients

1. Under **Recipient Settings**, enter a recipient's email address and click **Add**.

2. After it is added, the email address of a recipient will be listed under **Recipient Settings**. You can add up to 50 recipients and all of them will be able to receive email notifications of alerts.

3. To remove a recipient, hover over the email address you want to remove, then click the trash bin icon that appears.

4. To make sure notifications will be sent to your recipients, turn on **Receive Notifications** and click **Update**.

   {{< notice note >}}

   If you change the existing configuration, you must click **Update** to apply it.

   {{</ notice >}} 

## Receive Email Notifications

After you configure the email server and add recipients, you need to enable [KubeSphere Alerting](../../../../pluggable-components/alerting/) and create an alerting policy for workloads or nodes. Once it is triggered, all the recipients can receive email notifications.

The image below is an email notification example:

![example-email-notification](/images/docs/cluster-administration/platform-settings/notification-management/configure-email/example-email-notification.png)

{{< notice note >}}

- If you update your email server configuration, KubeSphere will send email notifications based on the latest configuration.
- By default, KubeSphere sends notifications for the same alert about every 12 hours. The notification repeat interval is mainly controlled by `repeat_interval` in the Secret `alertmanager-main` in the project `kubesphere-monitoring-system`. You can customize the interval as needed.
- As KubeSphere has built-in alerting policies, if you do not set any customized alerting policies, your recipient can still receive email notifications once a built-in alerting policy is triggered.

{{</ notice >}} 

