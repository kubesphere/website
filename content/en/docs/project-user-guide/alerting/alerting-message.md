---
title: "Alerting Message - workload level"
keywords: 'KubeSphere, Kubernetes, Workload, Alerting, Message, Notification'
description: 'Alerting Message - workload level'

linkTitle: "Alerting Message - workload level"
weight: 2220
---

Alert Message records the detailed information of alert triggered by alert rule. In it, you can view alert details, monitoring targets, alert policies, recent notifications, comments and etc.

## Prerequisites

You have created a workload-level alert policy and receive alert notifications of it. If no, please refer to [Alert Policy - workload level](../alerting-policy/) to create one.

## Hands-on Lab

### Task 1: View Alert Message

1. Log in the console and go to your project. Navigate to **Alerting Message** under **Monitoring & Alerting**, and you can see alert messages in the list. In the example of [Alert Policy - workload level](../alerting-policy/) you set two monitoring targets `reviews-v1` and `details-v1`, and both of their memory usages are higher than the threshold, so you can see two alert messages corresponding to them.

![alerting_message_workload_level_list](/images/docs/alerting/alerting_message_workload_level_list.png)

2. Select one of the alert messages to enter the detail page. In **Alerting Detail**, you can see the graph of the memory usage of the monitored workload over time, which has been continuously higher than the threshold of 20 MiB set in the alert rule, so the alert was triggered.

![alerting_message_workload_level_detail](/images/docs/alerting/alerting_message_workload_level_detail.png)

### Task 2: View Alert Policy

Switch to **Alert Policy** to view the alert policy corresponding to this alert message, and you can see the triggering rule of it set in the example of [Alert Policy - workload level](../alerting-policy/).

![alerting_message_workload_level_policy](/images/docs/alerting/alerting_message_workload_level_policy.png)

### Task 3: View Recent Notification

Switch to **Recent Notification**, it can be seen that the notifiers have received 3 notifications, because period of notification rule is set to `5 minutes/period` and consecutive count is `3 consecutive times`.

![alerting_message_workload_level_notification](/images/docs/alerting/alerting_message_workload_level_notification.png)

Log in your email to see alert notification mails sent by the KubeSphere mail server. You have received a total of 6 emails. This is because memory usages of two monitored workloads (deployments) have exceeded the threshold of `20 MiB` continuously, and notification rule has period of `5 minutes/period` and consecutive count of `3 consecutive times`.

### Task 4: Add Comment

Click **Comment** to add comment to current alert message. For example, if the memory usage of workload is higher than the threshold set by the alert rule, you can add a comment in the dialog: `Default maximum memory usage quota needs to be increased for this workload`.

![alerting_message_workload_level_comment](/images/docs/alerting/alerting_message_workload_level_comment.png)
