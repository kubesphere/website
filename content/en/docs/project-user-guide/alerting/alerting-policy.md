---
title: "Alerting Policy (Workload Level)"
keywords: 'KubeSphere, Kubernetes, Workload, Alerting, Policy, Notification'
description: 'How to set alerting policies at the workload level.'
linkTitle: "Alerting Policy (Workload Level)"
weight: 10710
---

KubeSphere provides alerting policies for nodes and workloads. This tutorial demonstrates how to create alerting policies for workloads in the project and configure mail notifications. See [Alerting Policy (Node Level)](../../../cluster-administration/cluster-wide-alerting-and-notification/alerting-policy/) to learn how to configure alerting policies for nodes.

## Prerequisites

- You have enabled [KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/).
- You have configured the [Mail server](../../../cluster-administration/cluster-settings/mail-server/).
- You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project).
- You have workloads in this project. If they are not ready, go to **Applications** under **Application Workloads**, and click **Deploy Sample Application** to deploy an application quickly. For more information, see [Deploy Bookinfo and Manage Traffic](../../../quick-start/deploy-bookinfo-to-k8s/).

## Hands-on Lab

### Step 1: Open the dashboard

Log in to the console as `project-regular` and go to your project. Navigate to **Alerting Policy** under **Monitoring & Alerting**, then click **Create**.

![alerting_policy_workload_level_create](/images/docs/alerting/alerting_policy_workload_level_create.png)

### Step 2: Provide basic information

In the dialog that appears, fill in the basic information as follows. Click **Next** after you finish.
- **Name**: a concise and clear name as its unique identifier, such as `alert-demo`.
- **Alias**: to help you distinguish alerting policies better.
- **Description**: a brief introduction to the alerting policy.

![alerting_policy_workload_level_basic_info](/images/docs/alerting/alerting_policy_workload_level_basic_info.png)

### Step 3: Select monitoring targets

You can select three types of workloads as the monitoring targets: **Deployments**, **StatefulSets** and **DaemonSets**. Select **Deployments** as the type and `reviews-v1` and `details-v1` as monitoring targets, then click **Next**.

![alerting_policy_workload_level_monitoring_target](/images/docs/alerting/alerting_policy_workload_level_monitoring_target.png)

### Step 4: Add an alerting rule

1. Click **Add Rule** to begin to create an alerting rule. The rule defines parameters such as metric type, check period, consecutive times, metric threshold and alert level to provide rich configurations. The check period (the second field under **Rule**) means the time interval between 2 consecutive checks of the metric. For example, `2 minutes/period` means the metric is checked every two minutes. The consecutive times (the third field under **Rule**) means the number of consecutive times that the metric meets the threshold when checked. An alert is only triggered when the actual time is equal to or is greater than the number of consecutive times set in the alerting policy.

   ![alerting_policy_workload_level_alerting_rule](/images/docs/alerting/alerting_policy_workload_level_alerting_rule.png)

2. In this example, set those parameters to `memory usage`, `1 minute/period`, `2 consecutive times`, `>` and `20` MiB for threshold and `Major Alert` for alert level. It means KubeSphere checks the memory usage every minute, and a major alert is triggered if it is larger than 20 MiB for 2 consecutive times.  

3. Click **√** to save the rule when you finish and click **Next** to continue.

   {{< notice note >}}

You can create workload-level alerting policies for the following metrics:
- CPU: `cpu usage`
- Memory: `memory usage (including cache)`, `memory usage`
- Network: `network data transmitting rate`, `network data receiving rate`
- Workload Metric: `unavailable deployment replicas ratio`

{{</ notice >}}

### Step 5: Set a notification rule

1. **Effective Notification Time Range** is used to set sending time of notification emails, such as `09:00 ~ 19:00`. **Notification Channel** currently only supports **Email**. You can add email addresses of members to be notified to **Notification List**.

1. **Customize Repetition Rules** defines sending period and retransmission times of notification emails. If alerts have not been resolved, the notification will be sent repeatedly after a certain period of time. Different repetition rules can also be set for different levels of alerts. Since the alert level set in the previous step is `Major Alert`, select `Alert once every 5 minutes` (sending period) in the second field for **Major Alert** and `Resend up to 3 times` in the third field (retransmission times). Refer to the following image to set notification rules:

   ![alerting_policy_workload_level_notification_rule](/images/docs/alerting/alerting_policy_workload_level_notification_rule.png)

3. Click **Create**, and you can see that the alerting policy is successfully created.

### Step 6: View the alerting policy

After an alerting policy is successfully created, you can go to its detail page to view the status, alert rules, monitoring targets, notification rule, alert history, etc. Click **More** and select **Change Status** from the drop-down menu to enable or disable this alerting policy.