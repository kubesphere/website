---
title: "Alerting Policy - workload level"
keywords: 'KubeSphere, Kubernetes, Workload, Alerting, Policy, Notification'
description: 'Alerting Policy - workload level'

linkTitle: "Alerting Policy - workload level"
weight: 2210
---

## Objective

KubeSphere provides alert policies for nodes and workloads. This guide demonstrates how you as a project member will create alert policy for workloads in the project and configure mail notifications. See [Alerting Policy - node level](../../../cluster-administration/alerting/alerting-policy/) to learn how to configure alert policies for nodes.

## Prerequisites

- [KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/) needs to be enabled by `platform-admin`.
- [Mail Server](../../../cluster-administration/cluster-settings/mail-server/) needs to be configured by `platform-admin`.
- You have been invited to one project with a `operator` role.
- You have workloads in this project. If no, you can go to **Applications** under **Application Workloads**, click **Deploy Sample Application** to deploy an application quickly.

## Hands-on Lab

### Task 1: Create an Alert Policy

Log in the console and go to your project. Navigate to **Alerting Policies** under **Monitoring & Alerting**, then click **Create**.

![alerting_policy_workload_level_create](/images/docs/alerting/alerting_policy_workload_level_create.png)

### Task 2: Fill in basic information

In the dialog that appears, fill in the basic information as follows. Click **Next** after finishing that.
- **Name**: a concise and clear name to browse and search, such as `alert-demo`.
- **Alias**: to help you distinguish alert policies better. Chinese is supported.
- **Description**: a brief introduction to the alert policy.

![alerting_policy_workload_level_basic_info](/images/docs/alerting/alerting_policy_workload_level_basic_info.png)

### Task 3: Select Monitoring Targets

Supports three workloads as monitoring targets: deployment, statefulset and daemonset. 
Here select **Deployments** and select `reviews-v1` and `details-v1` as monitoring targets. Then click **Next**.

![alerting_policy_workload_level_monitoring_target](/images/docs/alerting/alerting_policy_workload_level_monitoring_target.png)

### Task 4: Add Alerting Rules

Click **Add Rule** to begin to create an alerting rule. The rule defines parameters such as metric type, check period, consecutive times, metric threshold and alert level to provide rich configurations. The check period (the second field under **Rule**) means the time interval between 2 consecutive checks of the metric. For example, 2 minutes/period means the metric is checked every two minutes. The consecutive times (the third field under **Rule**) means the number of consecutive times that the metric meets the threshold when checked. An alert is only triggered when the actual time is equal to or is greater than the number of consecutive times set in the alert policy.  

In this example, set those parameters to `memory usage`, `1 minute/period`, `2 consecutive times`, `>` and `20` MiB for threshold and `Major Alert` for alert level. It means KubeSphere checks the memory usage every minute, and a major alert is triggered if it is larger than 20 MiB for 2 consecutive times.  

Click **√** to save when finish that, and then click **Next**.

![alerting_policy_workload_level_alerting_rule](/images/docs/alerting/alerting_policy_workload_level_alerting_rule.png)

{{< notice note >}}

- You can create workload-level alert policies for the following metrics:
    - cpu: `cpu usage`
    - memory: `memory usage (including cache)`, `memory usage`
    - network: `network data transmitting rate`, `network data receiving rate`
    - workload metric: `unavailable deployment replicas ratio`

{{</ notice >}}

### Task 5: Set Notification Rule

1. **Effective Notification Time Range** is used to set sending time of notification emails, such as `09:00 ~ 19:00`. Notification channel currently only supports email. You can add email addresses of members to be notified to **Notification List**.
1. **Customize Repetition Rules** can set sending period and retransmission of notification emails. So if alerts have not been resolved, alerts will be sent repeatedly after a certain period of time. Different repetition rules can also be set for different levels of alerts. Since the alert level set in the previous step is `Major Alert`, So set **Major Alert** to `Alert once every 5 miniutes`(sending period) and `Resend up to 3 times`(retransmission). Refer to the followings to set notification rules:
1. Click **Create**, and you can see that the alert policy is successfully created.

![alerting_policy_workload_level_notification_rule](/images/docs/alerting/alerting_policy_workload_level_notification_rule.png)

### Task 6: View Alert Policy

After `alert-demo` alert policy is successfully created, you can enter the detailed information page of it to view status of it, and alert rules, monitoring targets, notification rule, alert history, etc.

You can go to **More** → **Change Status** on the left corner to enable or disable this alert policy.