---
title: "Configure Email Notifications"
keywords: 'KubeSphere, Kubernetes, custom, platform'
description: 'Configure a email server and add recipients to receive email notifications.'
linkTitle: "Configure Email Notifications"
weight: 8722
---

This tutorial demonstrates how to configure a email server and add recipients to receive email notifications of alerting policies.

## Configure the Email Server

1. Log in to the web console with a user granted the role `platform-admin`.

2. Click **Platform** in the upper-left corner and select **Platform Settings**.

3. Navigate to **Notification Configuration** under **Notification Management**, and then choose **Email**.

4. Under **Server Settings**, configure your email server by filling in the following fields.

   - **SMTP Server Address**: The SMTP server address that provides email services. The port is usually `25`.
   - **Use SSL Secure Connection**: SSL can be used to encrypt emails, thereby improving the security of information transmitted by email. Usually you have to configure the certificate for the email server.
   - **SMTP Username**: The SMTP account.
   - **SMTP Password**: The SMTP account password.
   - **Sender Email Address**: The sender's email address.

5. Click **OK**.

## Recepient Settings

### Add recipients

1. Under **Recipient Settings**, enter a recipient's email address and click **Add**.

2. After it is added, the email address of a recipient will be listed under **Recipient Settings**. You can add up to 50 recipients and all of them will be able to receive email notifications.

3. To remove a recipient, hover over the email address you want to remove, then click <img src="/images/docs/common-icons/trashcan.png" width="25" height="25" />.

### Set notification conditions

1. Select the checkbox on the left of **Notification Conditions** to set notification conditions.

    - **Label**: Name, severity, or monitoring target of an alerting policy. You can select a label or customize a label.
    - **Operator**: Mapping between the label and the values. The operator includes **Includes values**, **Does not include values**, **Exists**, and **Does not exist**.
    - **Values**: Values associated with the label.
    {{< notice note >}}

   - Operators **Includes values** and **Does not include values** require one or more label values. Use a carriage return to separate values.
   - Operators **Exists** and **Does not exist** determine whether a label exists, and do not require a label value.

   {{</ notice >}} 

2. You can click **Add** to add notification conditions.

3. You can click <img src="/images/docs/common-icons/trashcan.png" width='25' height='25' /> on the right of a notification condition to delete the condition.

4. After the configurations are complete, you can click **Send Test Message** for verification.

5. On the upper-right corner, you can turn on the **Disabled** toggle to enbale notifications, or turn off the **Enabled** toggle to diable them.

   {{< notice note >}}

   - After the notification conditions are set, the recepients will receive only notifications that meet the conditions.
   - If you change the existing configuration, you must click **OK** to apply it.

   {{</ notice >}} 

## Receive Email Notifications

After you configure the email server and add recipients, you need to enable [KubeSphere Alerting](../../../../pluggable-components/alerting/) and create an alerting policy for workloads or nodes. Once it is triggered, all the recipients can receive email notifications.

{{< notice note >}}

- If you update your email server configuration, KubeSphere will send email notifications based on the latest configuration.
- By default, KubeSphere sends notifications for the same alert about every 12 hours. The notification repeat interval is mainly controlled by `repeat_interval` in the Secret `alertmanager-main` in the project `kubesphere-monitoring-system`. You can customize the interval as needed.
- As KubeSphere has built-in alerting policies, if you do not set any customized alerting policies, your recipient can still receive email notifications once a built-in alerting policy is triggered.

{{</ notice >}} 

