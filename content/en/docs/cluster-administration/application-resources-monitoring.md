---
title: "Application Resources Monitoring"
keywords: "Kubernetes, docker, kubesphere, Prometheus"
description: "Kubernetes and KubeSphere node management"

linkTitle: "Application Resources Monitoring"
weight: 400
---

In addition to monitoring the data from the physical resource level, the cluster-admin needs to know how many application resources, such as the number of projects and DevOps projects, as well as how many specific types of workloads and services have already been used in the platform. Application resource monitoring is a summary of the resource usage and trends of the application level of the platform.

## Resource Usage

Click **Platform** in the top left corner and select **Clusters Management**.

![Platform](/images/docs/cluster-administration/cluster-status-monitoring/platform.png)

If the cluster is a multi-cluster, click the cluster name.

![Clusters Management](/images/docs/cluster-administration/cluster-status-monitoring/clusters-management.png)

Choose **Monitoring & Alerting -> Application Resources** to enter the overview page of application resource monitoring, including the summary of the usage of all resources in the cluster, as shown in the following figure.

![Resource Usage](/images/docs/cluster-administration/application-resources-monitoring/application-resources-monitoring.png)

Among them, cluster resource usage and application resource usage will retain the monitoring data of the last 7 days and support custom time range queries.

![Time Range](/images/docs/cluster-administration/application-resources-monitoring/time-range.png)

Click on a specific resource to view the specific usage and trends of the cluster at a certain time, such as clicking on Cluster Resources usage to enter its details page. The details page allows you to view specific monitoring data by project, and users can customize the time range as well.

![Cluster Resources Usage](/images/docs/cluster-administration/application-resources-monitoring/cluster-resources-monitoring.png)

## Usage Ranking

The usage ranking supports the ranking of project resource usage, so that platform administrators can understand the resource usage of each project in the current cluster, including CPU usage, memory usage, Pod count, network inbound and outbound, support ascending or descending order according to any one of the indicators.
![pUsage Ranking](/images/docs/cluster-administration/application-resources-monitoring/usage-ranking.png)

