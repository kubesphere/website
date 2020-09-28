---
title: "Log Query"
keywords: 'kubesphere, kubernetes, log'
description: 'Query kubernetes logs from toolbox'

linkTitle: "Log Query"
weight: 3040
---

The logs of applications and systems can help you understand what is happening inside your cluster and workloads. The logs are particularly useful for debugging problems and monitoring cluster activities. KubeSphere provides a powerful and easy-to-use logging system which offers users the capabilities of log collection, query and management in terms of tenants. Tenant-based logging system is much more useful than Kibana since different tenants can only view her/his own logs, leading much better security. Moreover, KubeSphere logging system filters out lots of redundant information.

## Objective

In this tutorial, you will learn how to use log query component to enter log query interface, use search parameters and drill into detail page.

## Prerequisites

- You need to enable [KubeSphere Logging System](../../pluggable-components/logging/).

## Enter log query interface

Log query function is available for all users, log in the console, and mouse over the **Toolbox** in the lower right corner and then select **Log Search**.

![log-query-guide](/images/docs/log-query/log-query-guide.png)

As shown in the pop-up window, you can see the time histogram of logs amount, cluster selection dropdown list and search parameter input box.

![log-query-interface](/images/docs/log-query/log-query-interface.png)

{{< notice note >}}
- The logging console query logs on each cluster separately, you can switch query cluster using the dropdown list beside the search parameter input box.
- The logging console supports the following search parameter fields:
    - Keyword
    - Project
    - Workload
    - Pod
    - Container
    - Time Range
- Keywords field supports multiple keyword combination query. For example, you can use "Error", "Fail", "Fatal", "Exception", "Warning" together to query all the exception logs.
- Keywords field supports exact query and fuzzy query. Fuzzy query provides case-insensitive fuzzy matching and retrieval of full terms by the first half of a word or phrase because of the ElasticSearch segmentation rules. For example, you can retrieve the logs containing `node_cpu_total` by search the keyword `node_cpu`, but not the keyword `cpu`.

{{</ notice >}}

![log-query-time-range](/images/docs/log-query/log-query-time-range.png)

It also supports customizing the range of time to query, you can input time range directly by selecting `time range` in search parameter input box, or click on the bars in the time histogram, then it will use the time range of that bar as searching time range.

{{< notice note >}}
- KubeSphere stores the logs for last seven days by default.
- Each cluster set its own log retain period separately, you can modify log retain period in the ClusterConfig, please refer to [KubeSphere Logging System](../../pluggable-components/logging/) for log retain period setting.

{{</ notice >}}

## Use search parameters

For example, if you want to query the logs on `product` cluster including the keyword `error` in the `kubesphere-system` project within `last 12 hours` shown in the following screenshot.

![log-query-log-search](/images/docs/log-query/log-query-log-search.png)

13 rows of logs returned with the corresponding time, project, pod and container information.

Click any one of the results from the list. Drill into its detail page and inspect the logs from this pod, including the complete context at the right section. It is convenient for developers to debug and analyze.

{{< notice note >}}
- Log query interface support dynamical refresh with 5s, 10s or 15s, and allows to export the logs to local storage for further analysis.

{{</ notice >}}

![log-query-log-detail](/images/docs/log-query/log-query-log-detail.png)

As you see from the left panel, you can switch to inspect another pod and its container within the same project from the dropdown list. In this case, you can determine if any abnormal pods affect other pods.

![log-query-inspect-other-pods](/images/docs/log-query/log-query-inspect-other-pods.png)


## Drill into detail page

If the log looks abnormal, you can drill into the the pod detail page or container detail page to deep inspect the container logs, resource monitoring graph and events.

![log-query-drill](/images/docs/log-query/log-query-drill.png)

Inspect the container detail page as follows. At the same time, it allows you to open the terminal to debug container directly.

![log-query-drill-container](/images/docs/log-query/log-query-drill-container.png)