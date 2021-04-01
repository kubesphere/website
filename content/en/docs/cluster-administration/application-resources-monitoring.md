---
title: "Application Resources Monitoring"
keywords: "Kubernetes, KubeSphere, resources, monitoring"
description: "Monitor application resources across the cluster, such as the number of Deployments and CPU usage of different projects."

linkTitle: "Application Resources Monitoring"
weight: 8300
---

In addition to monitoring data at the physical resource level, cluster administrators also need to keep a close track of application resources across the platform, such as the number of projects and DevOps projects, as well as the number of workloads and services of a specific type. Application resource monitoring provides a summary of resource usage and application-level trends of the platform.

## Prerequisites

You need an account granted a role including the authorization of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to an account.

## Resource Usage

1. Click **Platform** in the top left corner and select **Cluster Management**.

    ![Platform](/images/docs/cluster-administration/cluster-status-monitoring/platform.png)

2. If you have enabled the [multi-cluster feature](../../multicluster-management/) with member clusters imported, you can select a specific cluster to view its application resources. If you have not enabled the feature, refer to the next step directly.

    ![Cluster Management](/images/docs/cluster-administration/cluster-status-monitoring/clusters-management.png)

3. Choose **Application Resources** under **Monitoring & Alerting** to see the overview of application resource monitoring, including the summary of the usage of all resources in the cluster, as shown in the following figure.

    ![Resource Usage](/images/docs/cluster-administration/application-resources-monitoring/application-resources-monitoring.png)

4. Among them, **Cluster Resources Usage** and **Application Resources Usage** retain the monitoring data of the last 7 days and support custom time range queries.

    ![Time Range](/images/docs/cluster-administration/application-resources-monitoring/time-range.png)

5. Click a specific resource to view detailed usage and trends of it during a certain time period, such as **CPU** under **Cluster Resources Usage**. The detail page allows you to view specific monitoring data by project. The highly-interactive dashboard enables users to customize the time range, displaying the exact resource usage at a given time point.

    ![Cluster Resources Usage](/images/docs/cluster-administration/application-resources-monitoring/cluster-resources-monitoring.png)

## Usage Ranking

**Usage Ranking** supports the sorting of project resource usage, so that platform administrators can understand the resource usage of each project in the current cluster, including **CPU Usage**, **Memory Usage**, **Pod Count**, as well as **Outbound Traffic** and **Inbound Traffic**. You can sort projects in ascending or descending order by one of the indicators in the drop-down list. This feature is very useful for quickly locating your application (Pod) that is consuming heavy CPU or memory.

![Usage Ranking](/images/docs/cluster-administration/application-resources-monitoring/usage-ranking.png)
