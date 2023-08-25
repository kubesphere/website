---
title: "Add Kafka as a Receiver"
keywords: 'Kubernetes, log, kafka, pod, container, fluentbit, output'
description: 'Learn how to add Kafka to receive container logs, resource events, or audit logs.'
linkTitle: "Add Kafka as a Receiver"
weight: 8623
---
You can use Elasticsearch, Kafka and Fluentd as log receivers in KubeSphere. This tutorial demonstrates:

- Deploy [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) and then create a Kafka cluster and a Kafka topic by creating `Kafka` and `KafkaTopic` CRDs.
- Add Kafka as a log receiver to receive logs sent from Fluent Bit.
- Verify whether the Kafka cluster is receiving logs using [Kafkacat](https://github.com/edenhill/kafkacat).

## Prerequisites

- You need a user granted a role including the permission of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to a user.
- Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components. For more information, see [Enable Pluggable Components](../../../../pluggable-components/). `logging` is enabled as an example in this tutorial.

## Step 1: Create a Kafka Cluster and a Kafka Topic

You can use [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) to create a Kafka cluster and a Kafka topic. If you already have a Kafka cluster, you can start from the next step.

1. Install [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) in the `default` namespace:

    ```bash
    helm repo add strimzi https://strimzi.io/charts/
    ```

    ```bash
    helm install --name kafka-operator -n default strimzi/strimzi-kafka-operator
    ```


2. Create a Kafka cluster and a Kafka topic in the `default` namespace by running the following commands. The commands create Kafka and Zookeeper clusters with storage type `ephemeral` which is `emptyDir` for demonstration purposes. For other storage types in a production environment, refer to [kafka-persistent](https://github.com/strimzi/strimzi-kafka-operator/blob/0.19.0/examples/kafka/kafka-persistent.yaml).

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: kafka.strimzi.io/v1beta1
    kind: Kafka
    metadata:
      name: my-cluster
      namespace: default
    spec:
      kafka:
        version: 2.5.0
        replicas: 3
        listeners:
          plain: {}
          tls: {}
        config:
          offsets.topic.replication.factor: 3
          transaction.state.log.replication.factor: 3
          transaction.state.log.min.isr: 2
          log.message.format.version: '2.5'
        storage:
          type: ephemeral
      zookeeper:
        replicas: 3
        storage:
          type: ephemeral
      entityOperator:
        topicOperator: {}
        userOperator: {}
    ---
    apiVersion: kafka.strimzi.io/v1beta1
    kind: KafkaTopic
    metadata:
      name: my-topic
      namespace: default
      labels:
        strimzi.io/cluster: my-cluster
    spec:
      partitions: 3
      replicas: 3
      config:
        retention.ms: 7200000
        segment.bytes: 1073741824
    EOF
    ```

3. Run the following command to check Pod status and wait for Kafka and Zookeeper are all up and running.

    ```bash
    $ kubectl -n default get pod 
    NAME                                         READY   STATUS    RESTARTS   AGE
    my-cluster-entity-operator-f977bf457-s7ns2   3/3     Running   0          69m
    my-cluster-kafka-0                           2/2     Running   0          69m
    my-cluster-kafka-1                           2/2     Running   0          69m
    my-cluster-kafka-2                           2/2     Running   0          69m
    my-cluster-zookeeper-0                       1/1     Running   0          71m
    my-cluster-zookeeper-1                       1/1     Running   1          71m
    my-cluster-zookeeper-2                       1/1     Running   1          71m
    strimzi-cluster-operator-7d6cd6bdf7-9cf6t    1/1     Running   0          104m
    ```

    Run the following command to check the metadata of the Kafka cluster:

    ```bash
    kafkacat -L -b my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc:9092
    ```

## Step 2: Add Kafka as a Log Receiver

1. Log in to KubeSphere as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.

   {{< notice note >}}

   If you have enabled the [multi-cluster feature](../../../../multicluster-management/), you can select a specific cluster.

   {{</ notice >}} 

2. On the **Cluster Management** page, go to **Log Receivers** in **Cluster Settings**.

3. Click **Add Log Receiver** and select **Kafka**. Enter the Kafka service address and port number, and then click **OK** to continue.

   | Service Address                                         | Port Number |
   | ------------------------------------------------------- | ---- |
   | my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc | 9092 |
   | my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc | 9092 |
   | my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc | 9092 |

4. Run the following commands to verify whether the Kafka cluster is receiving logs sent from Fluent Bit:

   ```bash
   # Start a util container
   kubectl run --rm utils -it --generator=run-pod/v1 --image arunvelsriram/utils bash
   # Install Kafkacat in the util container
   apt-get install kafkacat
   # Run the following command to consume log messages from kafka topic: my-topic
   kafkacat -C -b my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc:9092 -t my-topic
   ```