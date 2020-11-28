---
title: "Introduction"
keywords: 'kubernetes, log, elasticsearch, kafka, fluentd, pod, container, fluentbit, output'
description: 'Add log receivers to receive container logs'

linkTitle: "Introduction"
weight: 9621
---

KubeSphere provides a flexible log collection configuration method. Powered by [FluentBit Operator](https://github.com/kubesphere/fluentbit-operator/), users can add/modify/delete/enable/disable Elasticsearch, Kafka and Fluentd receivers with ease. Once a receiver is added, logs will be sent to this receiver.

## Prerequisite

Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components following [Enable Pluggable Components](https://kubesphere.io/docs/pluggable-components/).

## Add Log Receiver (aka Collector) for container logs

To add a log receiver:

- Login with an account of ***platform-admin*** role
- Click ***Platform*** -> ***Clusters Management***
- Select a cluster if multiple clusters exist
- Click ***Cluster Settings*** -> ***Log Collections***
- Log receivers can be added by clicking ***Add Log Collector***

![Log collection](/images/docs/cluster-administration/cluster-settings/log-collections/log-collections.png)

{{< notice note >}}

- At most one receiver can be added for each receiver type.
- Different types of receivers can be added simultaneously.

{{</ notice >}}

### Add Elasticsearch as log receiver

A default Elasticsearch receiver will be added with its service address set to an Elasticsearch cluster if logging/events/auditing is enabled in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md).

An internal Elasticsearch cluster will be deployed into K8s cluster if neither ***externalElasticsearchUrl*** nor ***externalElasticsearchPort*** are specified in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) when logging/events/auditing is enabled.

Configuring an external Elasticsearch cluster is recommended for production usage, the internal Elasticsearch cluster is for test/development/demo purpose only.

Log searching relies on the internal/external Elasticsearch cluster configured.

Please refer to [Add Elasticsearch as receiver](../add-es-as-receiver) to add a new Elasticsearch log receiver if the default one is deleted.

### Add Kafka as log receiver

Kafka is often used to receive logs and serve as a broker to other processing systems like Spark. [Add Kafka as receiver](../add-kafka-as-receiver) demonstrates how to add Kafka to receive Kubernetes logs.

### Add Fluentd as log receiver

If you need to output logs to more places other than Elasticsearch or Kafka, you'll need to add Fluentd as a log receiver. Fluentd has numerous output plugins which can forward logs to various destinations like S3, MongoDB, Cassandra, MySQL, syslog, Splunk etc. [Add Fluentd as receiver](../add-fluentd-as-receiver) demonstrates how to add Fluentd to receive Kubernetes logs.

## Add Log Receiver (aka Collector) for events/auditing logs

Starting from KubeSphere v3.0.0, K8s events logs and K8s/KubeSphere auditing logs can be archived in the same way as container logs. There will be ***Events*** or ***Auditing*** tab in the ***Log Collections*** page if ***events*** or ***auditing*** component is enabled in [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md). Log receivers for K8s events or K8s/KubeSphere auditing can be configured after switching to the corresponding tab.

![events](/images/docs/cluster-administration/cluster-settings/log-collections/log-collections-events.png)

Container logs, K8s events and K8s/KubeSphere auditing logs should be stored in different Elasticsearch indices to be searched in KubeSphere, the index prefixes are:

- ***ks-logstash-log*** for container logs
- ***ks-logstash-events*** for K8s events
- ***ks-logstash-auditing*** for K8s/KubeSphere auditing

## Turn a log receiver on or off

KubeSphere supports turning a log receiver on or off without adding/deleting it.
To turn a log receiver on or off:

- Click a log receiver and enter the receiver details page.
- Click ***More*** -> ***Change Status***

    ![more](/images/docs/cluster-administration/cluster-settings/log-collections/more.png)

- You can select ***Activate*** or ***Close*** to turn the log receiver on or off

    ![Change Status](/images/docs/cluster-administration/cluster-settings/log-collections/change-status.png)

- Log receiver's status will be changed to ***Close*** if you turn it off, otherwise the status will be ***Collecting***

    ![receiver-status](/images/docs/cluster-administration/cluster-settings/log-collections/receiver-status.png)

## Modify or delete a log receiver

You can modify a log receiver or delete it:

- Click a log receiver and enter the receiver details page.
- You can edit a log receiver by clicking ***Edit*** or ***Edit Yaml***

    ![more](/images/docs/cluster-administration/cluster-settings/log-collections/more.png)

- Log receiver can be deleted by clicking ***Delete Log Collector***
