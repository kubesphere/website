---
title: "Alerting Message (Workload Level)"
keywords: 'KubeSphere, Kubernetes, Workload, Alerting, Message, Notification'
description: 'How to view alerting messages at the workload level.'
linkTitle: "Alerting Message (Workload Level)"
weight: 10720
---

Alerting messages record detailed information of alerts triggered based on alert rules, including monitoring targets, alerting policies, recent notifications and comments.

This tutorial demonstrates how to view alerting messages at the workload level.

## Prerequisites

- You have enabled [KubeSphere Alerting and Notification](../../../pluggable-components/alerting-notification/).
- You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project).

- You have created a workload-level alerting policy and received alert notifications of it. If it is not ready, refer to [Alerting Policy (Workload Level)](../alerting-policy/) to create one first.

## Hands-on Lab

### Step 1: View alerting messages

1. Log in to the console as `project-regular` and go to your project. Navigate to **Alerting Message** under **Monitoring & Alerting**, and you can see alerting messages in the list. In the example of [Alerting Policy (Workload Level)](../alerting-policy/), you set two monitoring targets (`reviews-v1` and `details-v1`), and both of their memory usage are higher than the threshold, so you can see two alerting messages corresponding to them.

   ![alerting_message_workload_level_list](/images/docs/alerting/alerting_message_workload_level_list.png)

2. Select one of the alerting messages to enter the detail page. In **Alerting Detail**, you can see the graph of the memory usage of the monitored workload over time, which has been continuously higher than the threshold of 20 MiB set in the alert rule, so the alert was triggered.

   ![alerting_message_workload_level_detail](/images/docs/alerting/alerting_message_workload_level_detail.png)

### Step 2: View the alerting policy

Switch to **Alerting Policy** to view the alerting policy corresponding to this alerting message, and you can see the triggering rule of it set in the example of [Alerting Policy (Workload Level)](../alerting-policy/).

![alerting_message_workload_level_policy](/images/docs/alerting/alerting_message_workload_level_policy.png)

### Step 3: View recent notifications

1. Switch to **Recent Notification**. It can be seen that 3 notifications have been received, because the notification rule was set with a repetition period of `Alert once every 5 minutes` and retransmission of `Resend up to 3 times`.

   ![alerting_message_workload_level_notification](/images/docs/alerting/alerting_message_workload_level_notification.png)

2. Log in to your email to see alert notification emails sent by the KubeSphere mail server. You have received a total of 6 emails. This is because the memory usage of two monitored workloads (**Deployments**) has exceeded the threshold of `20 MiB` continuously, and the notification email is sent every 5 minutes for 3 consecutive times based on the notification rule.

### Step 4: Add comments

Click **Comment** to add comments to the current alerting message. For example, as the memory usage of workload is higher than the threshold set based on the alert rule, you can add a comment in the dialog: `Default maximum memory usage quota needs to be increased for this workload`.

![alerting_message_workload_level_comment](/images/docs/alerting/alerting_message_workload_level_comment.png)
