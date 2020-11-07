---
title: "Manage alerts with Alertmanager in KubeSphere"
keywords: 'kubernetes, prometheus, alertmanager, alerting'
description: 'Manage alerts with Alertmanager in KubeSphere'

linkTitle: "Alertmanager in KubeSphere"
weight: 2010
---

Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts. For more details, please refer to  [Alertmanager guide](https://prometheus.io/docs/alerting/latest/alertmanager/).

KubeSphere has been using Prometheus as its monitoring service's backend from the first release. Starting from v3.0, KubeSphere adds Alertmanager to its monitoring stack to manage alerts sent from Prometheus as well as other components such as [kube-events](https://github.com/kubesphere/kube-events) and kube-auditing.

![alertmanager@kubesphere](/images/docs/cluster-administration/cluster-settings/cluster-wide-alerting-and-notification/alertmanager@kubesphere.png)

## Use Alertmanager to manage Prometheus alerts

Alerting with Prometheus is separated into two parts. Alerting rules in Prometheus servers send alerts to an Alertmanager. The Alertmanager then manages those alerts, including silencing, inhibition, aggregation and sending out notifications via methods such as email, on-call notification systems, and chat platforms.

Starting from v3.0, KubeSphere adds popular alert rules in the open source community to its Prometheus offering as builtin alert rules. And by default Prometheus in KubeSphere v3.0 evaluates these builtin alert rules continuously and then sends alerts to Alertmanager.

## Use Alertmanager to manage K8s events alerts

Alertmanager can be used to manage alerts sent from sources other than Prometheus. In KubeSphere v3.0 and above, user can use it to manage alerts triggered by K8s events. For more details, please refer to [kube-events](https://github.com/kubesphere/kube-events).

## Use Alertmanager to manage KubeSphere auditing alerts

In KubeSphere v3.0 and above, user can also use Alertmanager to manage alerts triggered by K8s/KubeSphere audit events.

## Receiving notifications for Alertmanager alerts

Generally, to receive notifications for Alertmanager alerts, users have to edit Alertmanager's configuration files manually to configure receiver settings such as Email and Slack.

This is not convenient for K8s users and it breaks the multi-tenant principle/architecture of KubeSphere. More specifically, alerts triggered by workloads in different namespaces belonging to different users might be sent to the same user.

To use Alertmanager to manage alerts on the platform, KubeSphere offers [Notification Manager](https://github.com/kubesphere/notification-manager), a Kubernetes native notification management tool, which is completely open source. It complies with the multi-tenancy principle, providing user-friendly experiences of Kubernetes notifications. It's installed by default in KubeSphere v3.0 and above.

For more details about using Notification Manager to receive Alertmanager Notifications, please refer to [Notification Manager](../notification-manager)