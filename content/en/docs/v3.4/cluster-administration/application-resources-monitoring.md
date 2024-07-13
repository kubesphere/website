---
title: "Application Resources Monitoring"
keywords: "Kubernetes, KubeSphere, resources, monitoring"
description: "Monitor application resources across the cluster, such as the number of Deployments and CPU usage of different projects."

linkTitle: "Application Resources Monitoring"
weight: 8300
version: "v3.4"
---

In addition to monitoring data at the physical resource level, cluster administrators also need to keep a close track of application resources across the platform, such as the number of projects and DevOps projects, as well as the number of workloads and services of a specific type. Application resource monitoring provides a summary of resource usage and application-level trends of the platform.

## Prerequisites

You need a user granted a role including the authorization of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to a user.

## Resource Usage

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. If you have enabled the [multi-cluster feature](../../multicluster-management/) with member clusters imported, you can select a specific cluster to view its application resources. If you have not enabled the feature, refer to the next step directly.

3. Choose **Application Resources** under **Monitoring & Alerting** to see the overview of application resources, including the summary of the usage of all resources in the cluster.

4. Among them, **Cluster Resource Usage** and **Application Resource Usage** retain the monitoring data of the last 7 days and support custom time range queries.

5. Click a specific resource to view detailed usage and trends of it during a certain time period, such as **CPU** under **Cluster Resource Usage**. The detail page allows you to view specific monitoring data by project. The highly-interactive dashboard enables users to customize the time range, displaying the exact resource usage at a given time point.

## Usage Ranking

**Usage Ranking** supports the sorting of project resource usage, so that platform administrators can understand the resource usage of each project in the current cluster, including **CPU usage**, **memory usage**, **Pod count**, **inbound traffic** and **outbound traffic**. You can sort projects in ascending or descending order by one of the indicators in the drop-down list. This feature is very useful for quickly locating your application (Pod) that is consuming heavy CPU or memory.
