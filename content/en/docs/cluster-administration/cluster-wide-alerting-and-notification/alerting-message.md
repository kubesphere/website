---
title: "Alerting Messages (Node Level)"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Message, Notification'
description: 'How to view alerting messages at the node level.'
linkTitle: "Alerting Messages (Node Level)"
weight: 8540
---

Alerting messages record detailed information of alerts triggered based on alert rules, including monitoring targets, alerting policies, recent notifications and comments.

## Prerequisites

You have created a node-level alerting policy and received alert notifications of it. If it is not ready, please refer to [Alerting Policy (Node Level)](../alerting-policy/) to create one first.

## Hands-on Lab

### Task 1: View alerting messages

1. Log in to the console with one account granted the role `platform-admin`.

2. Click **Platform** in the top left corner and select **Clusters Management**.

    ![alerting_message_node_level_guide](/images/docs/alerting/alerting_message_node_level_guide.png)

3. Select a cluster from the list and enter it (If you do not enable the [multi-cluster feature](../../../multicluster-management/), you will directly go to the **Overview** page).

4. Navigate to **Alerting Messages** under **Monitoring & Alerting**, and you can see alerting messages in the list. In the example of [Alerting Policy (Node Level)](../alerting-policy/), you set one node as the monitoring target, and its memory utilization rate is higher than the threshold of `50%`, so you can see an alerting message of it.

    ![alerting_message_node_level_list](/images/docs/alerting/alerting_message_node_level_list.png)

5. Click the alerting message to go to its detail page. In **Alerting Detail**, you can see the graph of memory utilization rate of the node over time, which has been continuously higher than the threshold of `50%` set in the alert rule, so the alert was triggered.

    ![alerting_message_node_level_detail](/images/docs/alerting/alerting_message_node_level_detail.png)

### Task 2: View alerting policies

Switch to **Alerting Policy** to view the alerting policy corresponding to this alerting message, and you can see the triggering rule of it set in the example of [Alerting Policy (Node Level)](../alerting-policy/).

![alerting_message_node_level_policy](/images/docs/alerting/alerting_message_node_level_policy.png)

### Task 3: View recent notifications

1. Switch to **Recent Notification**. It can be seen that 3 notifications have been received, because the notification rule was set with a repetition period of `Alert once every 5 minutes` and retransmission of `Resend up to 3 times`.

    ![alerting_message_node_level_notification](/images/docs/alerting/alerting_message_node_level_notification.png)

2. Log in to your email to see alert notification mails sent by the KubeSphere mail server. You have received a total of 3 emails.

### Task 4: Add comments

Click **Comment** to add comments to current alerting messages. For example, as memory utilization rate of the node is higher than the threshold set based on the alert rule, you can add a comment in the dialog below: `The node needs to be tainted and new pod is not allowed to be scheduled to it`.

![alerting_message_node_level_comment](/images/docs/alerting/alerting_message_node_level_comment.png)
