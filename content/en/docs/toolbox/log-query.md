---
title: "Log Query"
keywords: 'KubeSphere, Kubernetes, log, query'
description: 'Query Kubernetes logs from toolbox'
linkTitle: "Log Query"
weight: 15100
---

The logs of applications and systems can help you better understand what is happening inside your cluster and workloads. The logs are particularly useful for debugging problems and monitoring cluster activities. KubeSphere provides a powerful and easy-to-use logging system which offers users the capabilities of log collection, query and management from the perspective of tenants. The tenant-based logging system is much more useful than Kibana since different tenants can only view their own logs, leading to better security. Moreover, the KubeSphere logging system filters out some redundant information so that tenants can only focus on logs that are useful to them.

This tutorial demonstrates how to use the log query function, including the interface, search parameters and details pages.

## Prerequisites

You need to enable the [KubeSphere Logging System](../../pluggable-components/logging/).

## Enter the Log Query Interface

1. The log query function is available for all users. Log in to the console with any account, hover over <img src="/images/docs/toolbox/log-query/toolbox.png" width='20' /> in the lower-right corner and select **Log Search**.

2. In the displayed dialog box, you can see a time histogram of log numbers, a cluster selection drop-down list and a log search box.

    ![log-search](/images/docs/toolbox/log-query/log-search.png)

    {{< notice note >}}

- KubeSphere supports log queries on each cluster separately if you have enabled the [multi-cluster feature](../../multicluster-management/). You can click <img src="/images/docs/toolbox/log-query/drop-down-list.png" width='20' /> on the left of the search box and select a target cluster.

- KubeSphere stores logs for last seven days by default.

    {{</ notice >}}

3. You can click the search box and enter a condition to search for logs by keyword, project, workload, Pod, container, or time range (for example, use `Time Range:Last 10 minutes` to search for logs within the last 10 minutes). Alternatively, click on the bars in the time histogram, and KubeSphere will use the time range of that bar for log queries.

    ![log-search-list](/images/docs/toolbox/log-query/log-search-list.png)

    {{< notice note >}}

- The keyword field supports the query of keyword combinations. For example, you can use `Error`, `Fail`, `Fatal`, `Exception`, and `Warning` together to query all the exception logs.
- The keyword field supports exact query and fuzzy query. The fuzzy query provides case-insensitive fuzzy matching and retrieval of full terms by the first half of a word or phrase based on the ElasticSearch segmentation rules. For example, you can retrieve the logs containing `node_cpu_total` by searching the keyword `node_cpu` instead of the keyword `cpu`.
- Each cluster has its own log retention period which can be set separately. You can modify it in `ClusterConfiguration`. For more information, see [KubeSphere Logging System](../../pluggable-components/logging/).

{{</ notice >}}

## Use Search Parameters

1. You can enter multiple conditions to narrow down your search results.

    ![log-search-conditions](/images/docs/toolbox/log-query/log-search-conditions.png)

3. Click any one of the results from the list. Drill into its details page and inspect the log from this Pod, including the complete context on the right. It is convenient for developers in terms of debugging and analyzing.

    ![log-search-details-page](/images/docs/toolbox/log-query/log-search-details-page.png)
    
    {{< notice note >}}

- The log query interface supports dynamic refreshing with 5s, 10s or 15s.
- You can click <img src="/images/docs/toolbox/log-query/export-logs.png" width='20' /> in the upper-right corner to export logs to a local file for further analysis.

{{</ notice >}}

4. In the left panel, you can click <img src="/images/docs/toolbox/log-query/drop-down-list.png" width='20' /> to switch between Pods and inspect its containers within the same project. In this case, you can detect if any abnormal Pods affect other Pods.


## Drill into the Details Page

In the left panel, you can click <img src="/images/docs/toolbox/log-query/view-detail-page.png" width='20' /> to view the Pod details page or container details page.

The following figure shows the Pod details page:

![pod-details-page](/images/docs/toolbox/log-query/pod-details-page.png)

The following figure shows the container detail page. You can click **Terminal** on the upper-left corner to open the terminal and debug the container.

![container-detail-page](/images/docs/toolbox/log-query/container-detail-page.png)