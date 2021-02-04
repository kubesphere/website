---
title: "Mail Server"
keywords: 'KubeSphere, Kubernetes, Notification, Mail Server'
description: 'Mail Server'

linkTitle: "Mail Server"
weight: 8630
---

## Objective

This guide demonstrates email notification settings (customized settings supported) for alerting policies. You can specify user email addresses to receive alerting messages.

## Prerequisites

[KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/) needs to be enabled.

## Hands-on Lab

1. Log in to the web console with one account granted the role  `platform-admin`.
2. Click **Platform** in the top left corner and select **Clusters Management**.

    ![mail_server_guide](/images/docs/alerting/mail_server_guide.png)

3. Select a cluster from the list and enter it (If you do not enable the [multi-cluster feature](../../../multicluster-management/), you will directly go to the **Overview** page).
4. Select **Mail Server** under **Cluster Settings**. In the page, provide your mail server configuration and SMTP authentication information as follows:
    - **SMTP Server Address**: Fill in the SMTP server address that can provide mail services. The port is usually 25.
    - **Use SSL Secure Connection**: SSL can be used to encrypt mails, thereby improving the security of information transmitted by mails. Usually you have to configure the certificate for the mail server.
    - SMTP authentication information: Fill in **SMTP User**, **SMTP Password**, **Sender Email Address**, etc. as below

    ![mail_server_config](/images/docs/alerting/mail_server_config.png)

5. After you complete the above settings, click **Save**. You can send a test email to verify the success of the server configuration.
