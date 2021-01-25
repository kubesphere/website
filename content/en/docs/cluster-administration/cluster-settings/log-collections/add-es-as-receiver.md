---
title: "Add Elasticsearch as a Receiver (i.e. Collector)"
keywords: 'Kubernetes, log, elasticsearch, pod, container, fluentbit, output'
description: 'Add Elasticsearch as a log receiver to receive container logs'
linkTitle: "Add Elasticsearch as a Receiver"
weight: 8622
---
You can use Elasticsearch, Kafka and Fluentd as log receivers in KubeSphere. This tutorial demonstrates how to add an Elasticsearch receiver.

## Prerequisites

- You need an account granted a role including the authorization of **Clusters Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to an account.

- Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components. For more information, see [Enable Pluggable Components](../../../../pluggable-components/). `logging` is enabled as an example in this tutorial.

## Add Elasticsearch as a Receiver

1. Log in to KubeSphere as `admin`. Click **Platform** in the top left corner and select **Clusters Management**.

2. If you have enabled the [multi-cluster feature](../../../../multicluster-management), you can select a specific cluster. If you have not enabled the feature, refer to the next step directly.

3. On the **Cluster Management** page, go to **Log Collections** in **Cluster Settings**.

4. Click **Add Log Collector** and choose **Elasticsearch**.

    ![add-receiver](/images/docs/cluster-administration/cluster-settings/log-collections/add-es-as-receiver/add-receiver.png)

5. Provide the Elasticsearch service address and port as below:

    ![add-es](/images/docs/cluster-administration/cluster-settings/log-collections/add-es-as-receiver/add-es.png)

6. Elasticsearch will appear in the receiver list on the **Log Collections** page, the status of which is **Collecting**.

    ![receiver-list](/images/docs/cluster-administration/cluster-settings/log-collections/add-es-as-receiver/receiver-list.png)

7. To verify whether Elasticsearch is receiving logs sent from Fluent Bit, click **Log Search** in the **Toolbox** in the bottom right corner and search logs on the console. For more information, read [Log Query](../../../../toolbox/log-query/).

