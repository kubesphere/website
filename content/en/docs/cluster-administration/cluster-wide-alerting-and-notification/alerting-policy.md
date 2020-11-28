---
title: "Alerting Policy (Node Level)"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Policy, Notification'
description: 'How to set alerting policies at the node level.'

linkTitle: "Alerting Policy (Node Level)"
weight: 9530
---

## Objective

KubeSphere provides alert policies for nodes and workloads. This guide demonstrates how you can create alert policies for nodes in the cluster and configure mail notifications. See [Alerting Policy (Workload Level)](../../../project-user-guide/alerting/alerting-policy/) to learn how to configure alert policies for workloads.

## Prerequisites

- [KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/) needs to be enabled.
- [Mail Server](../../../cluster-administration/cluster-settings/mail-server/) needs to be configured.

## Hands-on Lab

### Task 1: Create an Alert Policy

1. Log in the console with one account granted the role `platform-admin`.

2. Click **Platform** in the top left corner and select **Clusters Management**.

    ![alerting_policy_node_level_guide](/images/docs/alerting/alerting_policy_node_level_guide.png)

3. Select a cluster from the list and enter it (If you do not enable the [multi-cluster feature](../../../multicluster-management/), you will directly go to the **Overview** page).

4. Navigate to **Alerting Policies** under **Monitoring & Alerting**, and click **Create**.

    ![alerting_policy_node_level_create](/images/docs/alerting/alerting_policy_node_level_create.png)

### Task 2: Provide Basic Information

In the dialog that appears, fill in the basic information as follows. Click **Next** after you finish.

- **Name**: a concise and clear name as its unique identifier, such as `alert-demo`.
- **Alias**: to help you distinguish alert policies better. Chinese is supported.
- **Description**: a brief introduction to the alert policy.

![alerting_policy_node_level_basic_info](/images/docs/alerting/alerting_policy_node_level_basic_info.png)

### Task 3: Select Monitoring Targets

Select several nodes in the node list or use Node Selector to choose a group of nodes as the monitoring targets. Here a node is selected for the convenience of demonstration. Click **Next** when you finish.

![alerting_policy_node_level_monitoring_target](/images/docs/alerting/alerting_policy_node_level_monitoring_target.png)

{{< notice note >}}

You can sort nodes in the node list from the drop-down menu through the following three ways: `Sort By CPU`, `Sort By Memory`,  `Sort By Pod Utilization`.

{{</ notice >}}

### Task 4: Add Alerting Rules

1. Click **Add Rule** to begin to create an alerting rule. The rule defines parameters such as metric type, check period, consecutive times, metric threshold and alert level to provide rich configurations. The check period (the second field under **Rule**) means the time interval between 2 consecutive checks of the metric. For example, `2 minutes/period` means the metric is checked every two minutes. The consecutive times (the third field under **Rule**) means the number of consecutive times that the metric meets the threshold when checked. An alert is only triggered when the actual time is equal to or is greater than the number of consecutive times set in the alert policy.

    ![alerting_policy_node_level_alerting_rule](/images/docs/alerting/alerting_policy_node_level_alerting_rule.png)

2. In this example, set those parameters to `memory utilization rate`, `1 minute/period`, `2 consecutive times`, `>` and `50%`, and `Major Alert` in turn. It means KubeSphere checks the memory utilization rate every minute, and a major alert is triggered if it is larger than 50% for 2 consecutive times.  

3. Click **√** to save the rule when you finish and click **Next** to continue.

{{< notice note >}}

You can create node-level alert policies for the following metrics:

- CPU: `cpu utilization rate`, `cpu load average 1 minute`, `cpu load average 5 minutes`, `cpu load average 15 minutes`
- Memory: `memory utilization rate`, `memory available`
- Disk: `inode utilization rate`, `disk space available`, `local disk space utilization rate`, `disk write throughput`, `disk read throughput`, `disk read iops`, `disk write iops`
- Network: `network data transmitting rate`, `network data receiving rate`
- Pod: `pod abnormal ratio`, `pod utilization rate`

{{</ notice >}}

### Task 5: Set Notification Rule

1. **Effective Notification Time Range** is used to set sending time of notification emails, such as `09:00 ~ 19:00`. **Notification Channel** currently only supports **Email**. You can add email addresses of members to be notified to **Notification List**.

2. **Customize Repetition Rules** defines sending period and retransmission times of notification emails. If alerts have not been resolved, the notification will be sent repeatedly after a certain period of time. Different repetition rules can also be set for different levels of alerts. Since the alert level set in the previous step is `Major Alert`, select `Alert once every 5 miniutes` (sending period) in the second field for **Major Alert** and `Resend up to 3 times` in the third field (retransmission times). Refer to the following image to set notification rules:

    ![alerting_policy_node_level_notification_rule](/images/docs/alerting/alerting_policy_node_level_notification_rule.png)

3. Click **Create**, and you can see that the alert policy is successfully created.

{{< notice note >}}

*Waiting Time for Alerting* **=** *Check Period* **x** *Consecutive Times*. For example, if the check period is 1 minute/period, and the number of consecutive times is 2, you need to wait for 2 minutes before the alert message appears.

{{</ notice >}}

### Task 6: View Alert Policy

After an alert policy is successfully created, you can enter its detail information page to view the status, alert rules, monitoring targets, notification rule, alert history, etc. Click **More** and select **Change Status** from the drop-down menu to enable or disable this alert policy.

![alerting-policy-node-level-detail-page](/images/docs/alerting/alerting-policy-node-level-detail-page.png)

