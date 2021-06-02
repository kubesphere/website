---
title: "Add Elasticsearch as a Receiver"
keywords: 'Kubernetes, log, elasticsearch, pod, container, fluentbit, output'
description: 'Learn how to add Elasticsearch to receive logs, events or auditing logs.'
linkTitle: "Add Elasticsearch as a Receiver"
weight: 8622
---
You can use Elasticsearch, Kafka and Fluentd as log receivers in KubeSphere. This tutorial demonstrates how to add an Elasticsearch receiver.

## Prerequisites

- You need an account granted a role including the permission of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to an account.

- Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components. For more information, see [Enable Pluggable Components](../../../../pluggable-components/). `logging` is enabled as an example in this tutorial.

## Add Elasticsearch as a Receiver

1. Log in to KubeSphere as `admin`. Click **Platform** in the top left corner and select **Cluster Management**.

    {{< notice note >}}

If you have enabled the [multi-cluster feature](../../../../multicluster-management/), you can select a specific cluster.

{{</ notice >}} 

2. On the **Cluster Management** page, go to **Log Collection** in **Cluster Settings**.

3. Click **Add Log Receiver** and choose **Elasticsearch**.

4. Provide the Elasticsearch service address and port as below:

    ![add-es](/images/docs/cluster-administration/cluster-settings/log-collections/add-es-as-receiver/add-es.png)

5. Elasticsearch will appear in the receiver list on the **Log Collection** page, the status of which is **Collecting**.

6. To verify whether Elasticsearch is receiving logs sent from Fluent Bit, click **Log Search** in the **Toolbox** in the bottom right corner and search logs on the console. For more information, read [Log Query](../../../../toolbox/log-query/).

