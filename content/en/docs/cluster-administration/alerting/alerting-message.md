---
title: "Alerting Message - node level"
keywords: 'KubeSphere, Kubernetes, Node, Alerting, Message, Notification'
description: 'Alerting Message - node level'

linkTitle: "Alerting Message - node level"
weight: 4170
---

Alert Message records the detailed information of alert triggered by alert rule. In it, you can view alert details, monitoring targets, alert policies, recent notifications, comments and etc.

## Prerequisites

You have created a node-level alert policy and receive alert notifications of it. If no, please refer to [Alert Policy - node level](../alerting-policy/) to create one.

## Hands-on Lab

### Task 1: View Alert Message

1. Log in the console with one account granted the role `platform-admin`. 
2. Click **Platform** at the top left corner and select **Cluster Management**. 

![alerting_message_node_level_guide](/images/docs/alerting/alerting_message_node_level_guide.png)

3. Select one from the cluster list and enter it (If you do not enable multi-cluster, you will directly enter the only one). 
4. Navigate to **Alerting Message** under **Monitoring & Alerting**, and you can see alert messages in the list. In the example of [Alert Policy - node level](../alerting-policy/), you set one node as the monitoring target, and its memory utilization rage is higher than the threshold of `50%`, so you can see an alert message of it.

![alerting_message_node_level_list](/images/docs/alerting/alerting_message_node_level_list.png)

5. Click the alert message to enter the detail page. In **Alerting Detail**, you can see the graph of memory utilization rate of the node over time, which has been continuously higher than the threshold of `50%` set in the alert rule, so the alert was triggered.

![alerting_message_node_level_detail](/images/docs/alerting/alerting_message_node_level_detail.png)

### Task 2: View Alert Policy

Switch to **Alert Policy** to view the alert policy corresponding to this alert message, and you can see the triggering rule of it set in the example of [Alert Policy - node level](../alerting-policy/).

![alerting_message_node_level_policy](/images/docs/alerting/alerting_message_node_level_policy.png)

### Task 3: View Recent Notification

Switch to **Recent Notification**, it can be seen that the notifiers have received 3 notifications, because notification rule has sending period of `Alert once every 5 miniutes` and retransmission of `Resend up to 3 times`.

![alerting_message_node_level_notification](/images/docs/alerting/alerting_message_node_level_notification.png)

Log in your email to see alert notification mails sent by the KubeSphere mail server. You have received a total of 3 emails. 

### Task 4: Add Comment

Click **Comment** to add comment to current alert message. For example, memory utilization rate of the node is higher than the threshold set by the alert rule, you can add a comment in the dialog: `The node needs to be tainted and new pod is not allowed to schedule`.

![alerting_message_node_level_comment](/images/docs/alerting/alerting_message_node_level_comment.png)
