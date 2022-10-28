---
title: "Introduction to Log Receivers"
keywords: 'Kubernetes, log, elasticsearch, kafka, fluentd, pod, container, fluentbit, output'
description: 'Learn the basics of cluster log receivers, including tools, and general steps.'
linkTitle: "Introduction"
weight: 8621
---

KubeSphere provides a flexible log receiver configuration method. Powered by [Fluent Operator](https://github.com/fluent/fluent-operator), users can easily add, modify, delete, enable, or disable Elasticsearch, Kafka and Fluentd receivers. Once a receiver is added, logs will be sent to this receiver.

This tutorial gives a brief introduction about the general steps of adding log receivers in KubeSphere.

## Prerequisites

- You need a user granted a role including the permission of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to a user.

- Before adding a log receiver, you need to enable any of the `Logging`, `Events` or `Auditing` components. For more information, see [Enable Pluggable Components](../../../../pluggable-components/).

## Add a Log Receiver for Container Logs

To add a log receiver:

1. Log in to the web console of KubeSphere as `admin`.

2. Click **Platform** in the upper-left corner and select **Cluster Management**.

   {{< notice note >}}

   If you have enabled the [multi-cluster feature](../../../../multicluster-management/), you can select a specific cluster.

   {{</ notice >}} 

3. Go to **Log Receivers** under **Cluster Settings** in the sidebar.

4. On the log receivers list page, click **Add Log Receiver**.

   {{< notice note >}}

- At most one receiver can be added for each receiver type.
- Different types of receivers can be added simultaneously.

{{</ notice >}}

### Add Elasticsearch as a log receiver

A default Elasticsearch receiver will be added with its service address set to an Elasticsearch cluster if `logging`, `events`, or `auditing` is enabled in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md).

An internal Elasticsearch cluster will be deployed to the Kubernetes cluster if neither `externalElasticsearchUrl` nor `externalElasticsearchPort` is specified in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md) when `logging`, `events`, or `auditing` is enabled. The internal Elasticsearch cluster is for testing and development only. It is recommended that you configure an external Elasticsearch cluster for production.

Log searching relies on the internal or external Elasticsearch cluster configured.

If the default Elasticsearch log receiver is deleted, refer to [Add Elasticsearch as a Receiver](../add-es-as-receiver/) to add a new one.

### Add Kafka as a log receiver

Kafka is often used to receive logs and serves as a broker to other processing systems like Spark. [Add Kafka as a Receiver](../add-kafka-as-receiver/) demonstrates how to add Kafka to receive Kubernetes logs.

### Add Fluentd as a log receiver

If you need to output logs to more places other than Elasticsearch or Kafka, you can add Fluentd as a log receiver. Fluentd has numerous output plugins which can forward logs to various destinations such as S3, MongoDB, Cassandra, MySQL, syslog, and Splunk. [Add Fluentd as a Receiver](../add-fluentd-as-receiver/) demonstrates how to add Fluentd to receive Kubernetes logs.

## Add a Log Receiver for Resource Events or Audit Logs

Starting from KubeSphere v3.0.0, resource events and audit logs can be archived in the same way as container logs. The tab **Resource Events** or **Audit Logs** on the **Log Receivers** page will appear if `events` or `auditing` is enabled accordingly in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md). You can go to the corresponding tab to configure log receivers for resource events or audit logs.

Container logs, resource events, and audit logs should be stored in different Elasticsearch indices to be searched in KubeSphere. The index is automatically generated in <Index prefix>-<Year-month-date> format.

## Turn a Log Receiver on or Off

You can turn a log receiver on or off without adding or deleting it. To turn a log receiver on or off:

1. On the **Log Receivers** page, click a log receiver and go to the receiver's detail page.
2. Click **More** and select **Change Status**.

3. Select **Collecting** or **Disabled** to turn the log receiver on or off.

4. A log receiver's status will be changed to **Disabled** if you turn it off, otherwise the status will be **Collecting** on the **Log Receivers** page.


## Edit or Delete a Log Receiver

You can edit a log receiver or delete it:

1. On the **Log Receivers** page, click a log receiver and go to the receiver's detail page.
2. Edit a log receiver by clicking **Edit** or **Edit YAML** from the drop-down list.

3. Delete a log receiver by clicking **Delete**.
