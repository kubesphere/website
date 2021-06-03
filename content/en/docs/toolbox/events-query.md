---
title: "Event Query"
keywords: 'KubeSphere, Kubernetes, Event, Query'
description: 'Understand how you can perform quick event queries to keep track of the latest events of your cluster.'
linkTitle: "Event Query"
weight: 15200
---

Kubernetes events provide insight into what is happening inside a cluster, based on which KubeSphere adds longer historical query and aggregation capabilities, and also supports event query for tenant isolation.

This guide demonstrates how you can do multi-level, fine-grained event queries to track the status of your components.

## Prerequisites

[KubeSphere Events](../../pluggable-components/events/) needs to be enabled.

## Query Events

1. The event query function is available for all users. Log in to the console with any account, hover over the **Toolbox** in the lower-right corner and select **Event Search**.

    ![events_query_guide](/images/docs/events/events_query_guide.png)

2. As shown in the pop-up window, you can see the number of events that the account has permission to view.

    ![events_query_home](/images/docs/events/events_query_home.png)

    {{< notice note >}}

- KubeSphere supports event queries on each cluster separately if you have enabled the multi-cluster feature. You can switch the target cluster using the drop-down list next to the search bar.

- Supported fields in the search bar:
  - **Workspace**
  - **Project**
  - **Resource Type**
  - **Resource Name**
  - **Reason**
  - **Message**
  - **Category**
  - **Time Range**
- You can customize the query time range by selecting **Time Range** in the search bar. KubeSphere stores events for last seven days by default.

    {{</ notice >}}

3. Here is an example to query events in the project `test` whose **Message** contains `container` within last 1 hour as shown in the following screenshot. It returns 84 rows of results with the corresponding time, project, and message all displayed.

    ![events_query_list](/images/docs/events/events_query_list.png)

4. Click any one of the results from the list, and you can see raw information of it. It is convenient for developers in terms of debugging and analyzing.

    ![events_query_detail](/images/docs/events/events_query_detail.png)

    {{< notice note >}}

The event query interface supports dynamic refreshing every 5s, 10s or 15s.

    {{</ notice >}}
