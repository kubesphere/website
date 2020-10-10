---
title: "Alerting Policy - node level"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Policy, Notification'
description: 'Alerting Policy - node level'

linkTitle: "Alerting Policy - node level"
weight: 4160
---

## Objective

KubeSphere provides alert policies for nodes and workloads. This guide demonstrates how you will create alert policy for nodes in the cluster and configure mail notifications. See [Alerting Policy - workload level](../../../project-user-guide/alerting/alerting-policy/) to learn how to configure alert policies for workloads.

## Prerequisites

- [KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/) needs to be enabled.
- [Mail Server](../../../cluster-administration/cluster-settings/mail-server/) needs to be configured.

## Hands-on Lab

### Task 1: Create a Alert Policy

1. Log in the console with one account granted the role `platform-admin`. 
2. Click **Platform** at the top left corner and select **Cluster Management**. 

![alerting_policy_node_level_guide](/images/docs/alerting/alerting_policy_node_level_guide.png)

3. Select one from the cluster list and enter it (If you do not enable multi-cluster, you will directly enter the only one). 
4. Navigate to **Alerting Policies** under **Monitoring & Alerting**, and click **Create**.

![alerting_policy_node_level_create](/images/docs/alerting/alerting_policy_node_level_create.png)

### Task 2: Fill in basic information

In the dialog that appears, fill in the basic information as follows. Click **Next** after finishing that.
- **Name**: a concise and clear name to browse and search, such as `alert-demo`.
- **Alias**: to help you distinguish alert policies better. Chinese is supported.
- **Description**: a brief introduction to the alert policy.

![alerting_policy_node_level_basic_info](/images/docs/alerting/alerting_policy_node_level_basic_info.png)

### Task 3: Select Monitoring Targets

Select several nodes in the node list as the monitoring targets. Here a node is selected for the convenience of demonstration. Then click **Next**.
![alerting_policy_node_level_monitoring_target](/images/docs/alerting/alerting_policy_node_level_monitoring_target.png)

{{< notice note >}}

The node list supports sorting nodes by the following three ways: `Sort By CPU`, `Sort By Memory`,  `Sort By Pod Utilization`.

{{</ notice >}}

### Task 4: Add Alerting Rules

Click **Add Rule** to begin to create an alerting rule. The rule defines parameters such as metric type, check period, consecutive times, metric threshold and alert level to provide rich configurations. The check period (the second field under **Rule**) means the time interval between 2 consecutive checks of the metric. For example, 2 minutes/period means the metric is checked every two minutes. The consecutive times (the third field under **Rule**) means the number of consecutive times that the metric meets the threshold when checked. An alert is only triggered when the actual time is equal to or is greater than the number of consecutive times set in the alert policy. 
 
In this example, set those parameters to `memory utilization rate`, `1 minute/period`, `2 consecutive times`, `>` and `50%`, and `Major Alert` in turn. It means KubeSphere checks the memory utilization rate every minute, and a major alert is triggered if it is larger than 50% for 2 consecutive times.  

Click **√** to save when finish that, and then click **Next**.

![alerting_policy_node_level_alerting_rule](/images/docs/alerting/alerting_policy_node_level_alerting_rule.png)

{{< notice note >}}

- You can create node-level alert policies for the following metrics:
    - cpu: `cpu utilization rate`, `cpu load average 1 minute`, `cpu load average 5 minutes`, `cpu load average 15 minutes`
    - memory: `memory utilization rate`, `memory available`
    - disk: `inode utilization rate`, `disk space available`, `local disk space utilization rate`, `disk write throughput`, `disk read throughput`, `disk read iops`, `disk write iops`
    - network: `network data transmitting rate`, `network data receiving rate`
    - pod: `pod abnormal ratio`, `pod utilization rate`

{{</ notice >}}

### Task 5: Set Notification Rule

1. **Effective Notification Time Range** is used to set sending time of notification emails, such as `09:00 ~ 19:00`. Notification channel currently only supports email. You can add email addresses of members to be notified to **Notification List**.
1. **Customize Repetition Rules** can set sending period and retransmission of notification emails. So if alerts have not been resolved, alerts will be sent repeatedly after a certain period of time. Different repetition rules can also be set for different levels of alerts. Since the alert level set in the previous step is `Major Alert`, So set **Major Alert** to `Alert once every 5 miniutes`(sending period) and `Resend up to 3 times`(retransmission). Refer to the followings to set notification rules:
1. Click **Create**, and you can see that the alert policy is successfully created.

![alerting_policy_node_level_notification_rule](/images/docs/alerting/alerting_policy_node_level_notification_rule.png)

{{< notice note >}}

*waiting time for alerting* **=** *check period* **x** *consecutive times*. For example, if check period is 1 minute/period, and the number of consecutive times is 2 times, you need to wait for 2 minutes.

{{</ notice >}}

### Task 6: View Alert Policy

After `alert-demo` alert policy is successfully created, you can enter the detailed information page of it to view status of it, and alert rules, monitoring targets, notification rule, alert history, etc.

You can go to **More** → **Change Status** on the left corner to enable or disable this alert policy.