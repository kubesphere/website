---
title: "Alerting Messages (Node Level)"
keywords: 'KubeSphere, Kubernetes, node, Alerting, messages'
description: 'Learn how to view alerting messages for nodes.'
linkTitle: "Alerting Messages (Node Level)"
weight: 8540
---

Alerting messages record detailed information of alerts triggered based on the alerting policy defined. This tutorial demonstrates how to view alerting messages at the node level.

## Prerequisites

- You have enabled [KubeSphere Alerting](../../../pluggable-components/alerting/).
- You need to create a user (`cluster-admin`) and grant it the `clusters-admin` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-4-create-a-role).
- You have created a node-level alerting policy and an alert has been triggered. For more information, refer to [Alerting Policies (Node Level)](../alerting-policy/).

## View Alerting Messages

1. Log in to the KubeSphere console as `cluster-admin` and go to **Alerting Messages** under **Monitoring & Alerting**.

2. On the **Alerting Messages** page, you can see all alerting messages in the list. The first column displays the summary and details you have defined for the alert. To view details of an alerting message, click the name of the alerting policy and then click the **Alerting History** tab on the alerting policy details page.

3. On the **Alerting History** tab, you can see alert severity, monitoring target, and activation time.

## View Notifications

If you also want to receive alert notifications (for example, email and Slack messages), you need to configure [a notification channel](../../../cluster-administration/platform-settings/notification-management/configure-email/) first.

