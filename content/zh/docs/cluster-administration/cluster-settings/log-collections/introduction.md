---
title: "介绍"
keywords: 'Kubernetes, log, elasticsearch, kafka, fluentd, pod, container, fluentbit, output'
description: 'Add log receivers to receive container logs'
linkTitle: "介绍"
weight: 8621
---

KubeSphere provides a flexible log collection configuration method. Powered by [FluentBit Operator](https://github.com/kubesphere/fluentbit-operator/), users can easily add, modify, delete, enable or disable Elasticsearch, Kafka and Fluentd receivers. Once a receiver is added, logs will be sent to this receiver.

This tutorial gives a brief introduction about the general steps of adding log receivers in KubeSphere.

## Prerequisites

- You need an account granted a role including the authorization of **Clusters Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to an account.

- Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components. For more information, see [Enable Pluggable Components](../../../../pluggable-components/).

## Add a Log Receiver (i.e. Collector) for Container Logs

To add a log receiver:

1. Log in to the web console of KubeSphere as `admin`.

2. Click **Platform** in the top left corner and select **Clusters Management**.

3. If you have enabled the [multi-cluster feature](../../../../multicluster-management), you can select a specific cluster. If you have not enabled the feature, refer to the next step directly.

4. Go to **Log Collections** in **Cluster Settings**.

5. Click **Add Log Collector**.

   ![log-collections](/images/docs/cluster-administration/cluster-settings/log-collections/introduction/log-collections.png)

   {{< notice note >}}

- At most one receiver can be added for each receiver type.
- Different types of receivers can be added simultaneously.

{{</ notice >}}

### Add Elasticsearch as a log receiver

A default Elasticsearch receiver will be added with its service address set to an Elasticsearch cluster if `logging`, `events`, or `auditing` is enabled in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md).

An internal Elasticsearch cluster will be deployed to the Kubernetes cluster if neither `externalElasticsearchUrl` nor `externalElasticsearchPort` is specified in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) when `logging`, `events` or `auditing` is enabled. The internal Elasticsearch cluster is for testing and development only. It is recommended that you configure an external Elasticsearch cluster for production.

Log searching relies on the internal or external Elasticsearch cluster configured.

If the default Elasticsearch log receiver is deleted, refer to [Add Elasticsearch as a Receiver](../add-es-as-receiver/) to add a new one.

### Add Kafka as a log receiver

Kafka is often used to receive logs and serves as a broker to other processing systems like Spark. [Add Kafka as a Receiver](../add-kafka-as-receiver) demonstrates how to add Kafka to receive Kubernetes logs.

### Add Fluentd as a log receiver

If you need to output logs to more places other than Elasticsearch or Kafka, you can add Fluentd as a log receiver. Fluentd has numerous output plugins which can forward logs to various destinations such as S3, MongoDB, Cassandra, MySQL, syslog, and Splunk. [Add Fluentd as a Receiver](../add-fluentd-as-receiver) demonstrates how to add Fluentd to receive Kubernetes logs.

## Add a Log Receiver (i.e. Collector) for Events or Auditing Logs

Starting from KubeSphere v3.0.0, the logs of Kubernetes events and the auditing logs of Kubernetes and KubeSphere can be archived in the same way as container logs. The tab **Events** or **Auditing** on the **Log Collections** page will appear if `events` or `auditing` is enabled accordingly in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md). You can go to the corresponding tab to configure log receivers for Kubernetes events or Kubernetes and KubeSphere auditing logs.

![log-collections-events](/images/docs/cluster-administration/cluster-settings/log-collections/introduction/log-collections-events.png)

Container logs, Kubernetes events and Kubernetes and KubeSphere auditing logs should be stored in different Elasticsearch indices to be searched in KubeSphere. The index prefixes are:

- `ks-logstash-log` for container logs
- `ks-logstash-events` for Kubernetes events
- `ks-logstash-auditing` for Kubernetes and KubeSphere auditing logs

## Turn a Log Receiver on or Off

You can turn a log receiver on or off without adding or deleting it. To turn a log receiver on or off:

1. On the **Log Collections** page, click a log receiver and go to the receiver's detail page.
2. Click **More** and select **Change Status**.

    ![more](/images/docs/cluster-administration/cluster-settings/log-collections/introduction/more.png)

3. Select **Activate** or **Close** to turn the log receiver on or off.

    ![change-status](/images/docs/cluster-administration/cluster-settings/log-collections/introduction/change-status.png)

4. A log receiver's status will be changed to **Close** if you turn it off, otherwise the status will be **Collecting**.

    ![receiver-status](/images/docs/cluster-administration/cluster-settings/log-collections/introduction/receiver-status.png)

## Modify or Delete a Log Receiver

You can modify a log receiver or delete it:

1. On the **Log Collections** page, click a log receiver and go to the receiver's detail page.
2. Edit a log receiver by clicking **Edit** or **Edit YAML** from the drop-down list.

    ![more](/images/docs/cluster-administration/cluster-settings/log-collections/introduction/more.png)

3. Delete a log receiver by clicking **Delete Log Collector**.
