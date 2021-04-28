---
title: "Alerting Policies (Node Level)"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Policy, Notification'
description: 'Learn how to set alerting policies for nodes.'
linkTitle: "Alerting Policies (Node Level)"
weight: 8530
---

KubeSphere provides alerting policies for nodes and workloads. This tutorial demonstrates how to create alerting policies for nodes in a cluster. See [Alerting Policy (Workload Level)](../../../project-user-guide/alerting/alerting-policy/) to learn how to configure alerting policies for workloads.

KubeSphere also has built-in policies which will trigger alerts if conditions defined for these policies are met. On the **Built-in Policies** tab, you can click a policy to see its details. Note that they cannot be directly deleted or edited on the console.

## Prerequisites

- You have enabled [KubeSphere Alerting](../../../pluggable-components/alerting/).
- To receive alert notifications, you must configure a [notification channel](../../../cluster-administration/platform-settings/notification-management/configure-email/) beforehand.
- You need to create an account (`cluster-admin`) and grant it the `clusters-admin` role. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/#step-4-create-a-role).
- You have workloads in your cluster. If they are not ready, see [Deploy and Access Bookinfo](../../../quick-start/deploy-bookinfo-to-k8s/) to create a sample app.

## Create an Alerting Policy

1. Log in to the console as `cluster-admin`. Click **Platform** in the top left corner, and then click **Cluster Management**.

2. Navigate to **Alerting Policies** under **Monitoring & Alerting**, and then click **Create**.

   ![click-create](/images/docs/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/click-create.png)

3. In the dialog that appears, provide the basic information as follows. Click **Next** to continue.

   - **Name**. A concise and clear name as its unique identifier, such as `node-alert`.
   - **Alias**. Help you distinguish alerting policies better.
   - **Duration (Minutes)**. An alert will be firing when the conditions defined for an alerting policy are met at any given point in the time range.
   - **Severity**. Allowed values include **Warning**, **Error** and **Critical**, providing an indication of how serious an alert is.
   - **Description**. A brief introduction to the alerting policy.

4. On the **Alerting Rule** tab, you can use the rule template or create a custom rule. To use the template, fill in the following fields and click **Next** to continue.

   - **Monitoring Target**. Select a node in your cluster for monitoring.
   - **Alerting Rule**. Define a rule for the alerting policy. The rules provided in the drop-down list are based on Prometheus expressions and an alert will be triggered when conditions are met. You can monitor objects such as CPU and memory.

   ![alert-rule](/images/docs/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/alert-rule.png)

   {{< notice note >}}

   You can create a custom rule with PromQL by entering an expression in the **Monitoring Metrics** field (autocompletion supported). For more information, see [Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/). 

   {{</ notice >}} 

5. On the **Notification Settings** tab, enter the alert summary and message to be included in your notification, then click **Create**.

6. An alerting policy will be **Inactive** when just created. If conditions in the rule expression are met, it will reach **Pending** first, and then turn to **Firing** if conditions keep to be met in the given time range.

## Edit an Alerting Policy

To edit an alerting policy after it is created, on the **Alerting Policies** page, click <img src="/images/docs/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/edit-policy.png" height="25px"> on the right.

1. Click **Edit** from the drop-down menu and edit the alerting policy following the same steps as you create it. Click **Update** on the **Notification Settings** page to save it.

   ![click-edit](/images/docs/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/click-edit.png)

2. Click **Delete** from the drop-down menu to delete an alerting policy.

## View an Alerting Policy

Click an alerting policy on the **Alerting Policies** page to see its detail information, including alerting rules and alerting messages. You can also see the rule expression which is based on the template you use when creating the alerting policy.

Under **Monitoring**, the **Alert Monitoring** chart shows the actual usage or amount of resources over time. **Notification Settings** displays the customized message you set in notifications.

![alert-detail](/images/docs/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/alert-detail.png)