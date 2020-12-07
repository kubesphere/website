---
title: "Add Elasticsearch as receiver (aka Collector)"
keywords: 'kubernetes, log, elasticsearch, pod, container, fluentbit, output'
description: 'Add Elasticsearch as log receiver to receive container logs'

linkTitle: "Add Elasticsearch as Receiver"
weight: 8622
---
KubeSphere supports using Elasticsearch, Kafka and Fluentd as log receivers.
This doc will demonstrate how to add an Elasticsearch receiver.

## Prerequisite

Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components following [Enable Pluggable Components](https://kubesphere.io/docs/pluggable-components/). The `logging` component is enabled as an example in this doc.

1. To add a log receiver:

    - Login KubeSphere with an account of ***platform-admin*** role
    - Click ***Platform*** -> ***Clusters Management***
    - Select a cluster if multiple clusters exist
    - Click ***Cluster Settings*** -> ***Log Collections***
    - Log receivers can be added by clicking ***Add Log Collector***

    ![Add receiver](/images/docs/cluster-administration/cluster-settings/log-collections/add-receiver.png)

2. Choose ***Elasticsearch*** and fill in the Elasticsearch service address and port like below:

    ![Add Elasticsearch](/images/docs/cluster-administration/cluster-settings/log-collections/add-es.png)

3. Elasticsearch appears in the receiver list of ***Log Collections*** page and its status becomes ***Collecting***.

    ![Receiver List](/images/docs/cluster-administration/cluster-settings/log-collections/receiver-list.png)

4. Verify whether Elasticsearch is receiving logs sent from Fluent Bit:

    - Click ***Log Search*** in the ***Toolbox*** in the bottom right corner.
    - You can search logs in the logging console that appears.

    You can read [Log Query](../../../../toolbox/log-query/) to learn how to use the tool.
