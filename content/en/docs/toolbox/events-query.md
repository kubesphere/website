---
title: "Event Query"
keywords: 'KubeSphere, Kubernetes, Event'
description: 'Event Query'

linkTitle: "Event Query"
weight: 4190
---

## Objective

Kubernetes event provides insight into what is happening inside a cluster, based on which KubeSphere adds longer historical query and aggregation capabilities, and also supports event query for tenant isolation. This guide demonstrates how you will do multi-level, fine-grained event queries to track the state of your components.

## Prerequisites

- [KubeSphere Events](../../../pluggable-components/events/) needs to be enabled.

## Hands-on Lab

1. Log in the console with one account. Mouse over the **Toolbox** in the lower right corner and then select **Event Search**.

![events_query_guide](/images/docs/events/events_query_guide.png)

2. As shown in the pop-up window, you can see the amount trend of events that the logged in account has permission to view. 

![events_query_home](/images/docs/events/events_query_home.png)

{{< notice note >}}
- The events console supports the following query conditions:
    - Workspace
    - Project
    - Resource Type
    - Resource Name
    - Reason
    - Message
    - Category
    - Time Range
- It also supports customizing the range of time to query. KubeSphere stores the events for last seven days by default.

{{</ notice >}}

3. Here is an example to query the events in project `test` whose message contains `container` within last 1 hour as shown in the following screenshot. It returns 84 rows of results with the corresponding time, project, message.

![events_query_list](/images/docs/events/events_query_list.png)

4. Click any one of the results from the list, you can see raw information of it. It is convenient for developers to debug and analyze.

![events_query_detail](/images/docs/events/events_query_detail.png)