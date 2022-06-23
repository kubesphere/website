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

1. The log query function is available for all users. Log in to the console with any account, hover over <img src="/images/docs/v3.3/toolbox/log-query/toolbox.png" width='20' /> in the lower-right corner and select **Log Search**.

2. In the pop-up window, you can see a time histogram of log numbers, a cluster selection drop-down list, and a log search bar.

    {{< notice note >}}

- KubeSphere supports log queries on each cluster separately if you have enabled the [multi-cluster feature](../../multicluster-management/). You can click <img src="/images/docs/v3.3/toolbox/log-query/drop-down-list.png" width='20' /> on the left of the search box and select a target cluster.

- KubeSphere stores logs for last seven days by default.

    {{</ notice >}}

3. You can customize the query time range by selecting **Time Range** in the log search bar. Alternatively, click on the bars in the time histogram, and KubeSphere will use the time range of that bar for log queries.

{{< notice note >}}

- The keyword field supports the query of keyword combinations. For example, you can use `Error`, `Fail`, `Fatal`, `Exception`, and `Warning` together to query all the exception logs.
- The keyword field supports exact query and fuzzy query. The fuzzy query provides case-insensitive fuzzy matching and retrieval of full terms by the first half of a word or phrase based on the ElasticSearch segmentation rules. For example, you can retrieve the logs containing `node_cpu_total` by searching the keyword `node_cpu` instead of the keyword `cpu`.
- Each cluster has its own log retention period which can be set separately. You can modify it in `ClusterConfiguration`. For more information, see [KubeSphere Logging System](../../pluggable-components/logging/).

{{</ notice >}}

## Use Search Parameters

1. You can provide as many fields as possible to narrow down your search results.

2. Click any one of the results from the list. Drill into its detail page and inspect the log from this Pod, including the complete context on the right. It is convenient for developers in terms of debugging and analyzing.
    
    {{< notice note >}}

The log query interface supports dynamic refreshing with 5s, 10s or 15s, and allows users to export logs to a local file for further analysis (in the upper-right corner).

    {{</ notice >}}

4. In the left panel, you can click <img src="/images/docs/v3.3/toolbox/log-query/view-detail-page.png" width='20' /> to view the Pod details page or container details page.

## Drill into the Details Page

1. If the log looks abnormal, you can drill into the Pod detail page or container detail page to further inspect container logs, resource monitoring graphs, and events.

2. Inspect the container detail page. At the same time, it allows you to open the terminal to debug the container directly.
