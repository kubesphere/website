---
title: "Alerting Messages (Workload Level)"
keywords: 'KubeSphere, Kubernetes, Workload, Alerting, Message, Notification'
description: 'Learn how to view alerting messages for workloads.'
linkTitle: "Alerting Messages (Workload Level)"
weight: 10720
---

Alerting messages record detailed information of alerts triggered based on the alerting policy defined. This tutorial demonstrates how to view alerting messages at the workload level.

## Prerequisites

- You have enabled [KubeSphere Alerting](../../../pluggable-components/alerting/).
- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You have created a workload-level alerting policy and an alert has been triggered. For more information, refer to [Alerting Policies (Workload Level)](../alerting-policy/).

## View Alerting Messages

1. Log in to the console as `project-regular`, go to your project, and go to **Alerting Messages** under **Monitoring & Alerting**.

2. On the **Alerting Messages** page, you can see all alerting messages in the list. The first column displays the summary and message you have defined in the notification of the alert. To view details of an alerting message, click the name of the alerting policy and click the **Alerting History** tab on the displayed page.

3. On the **Alerting History** tab, you can see alert severity, monitoring targets, and activation time.

## View Notifications

If you also want to receive alert notifications (for example, email and Slack messages), you need to configure [a notification channel](../../../cluster-administration/platform-settings/notification-management/configure-email/) first.