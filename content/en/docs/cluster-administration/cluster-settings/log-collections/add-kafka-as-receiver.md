---
title: "Add Kafka as Receiver (aka Collector)"
keywords: 'kubernetes, log, kafka, pod, container, fluentbit, output'
description: 'KubeSphere Installation Overview'

linkTitle: "Add Kafka as Receiver"
weight: 2300
---
KubeSphere supports using Elasticsearch, Kafka and Fluentd as log receivers.
This doc will demonstrate:

- Deploy [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) and then create a Kafka cluster and a Kafka topic by creating `Kafka` and `KafkaTopic` CRDs.
- Add Kafka log receiver to receive logs sent from Fluent Bit.
- Verify whether the Kafka cluster is receiving logs using [Kafkacat](https://github.com/edenhill/kafkacat).

## Prerequisite

Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components following [Enable Pluggable Components](https://kubesphere.io/docs/pluggable-components/). The `logging` component is enabled as an example in this doc.

## Step 1: Create a Kafka cluster and a Kafka topic

{{< notice note >}}

If you already have a Kafka cluster, you can start from Step 2.

{{</ notice >}}

You can use [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) to create a Kafka cluster and a Kafka topic

1. Install [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) to the `default` namespace:

    ```bash
    helm repo add strimzi https://strimzi.io/charts/
    helm install --name kafka-operator -n default strimzi/strimzi-kafka-operator
    ```

2. Create a Kafka cluster and a Kafka topic in the `default` namespace:

    To deploy a Kafka cluster and create a Kafka topic, you simply need to open  the ***kubectl*** console in ***KubeSphere Toolbox*** and run the following command:

    {{< notice note >}}
The following will create Kafka and Zookeeper clusters with storage type `ephemeral` which is `emptydir` for demo purpose. You should use other storage types for production, please refer to [kafka-persistent](https://github.com/strimzi/strimzi-kafka-operator/blob/0.19.0/examples/kafka/kafka-persistent.yaml).
    {{</ notice >}}

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

3. Run the following command to wait for Kafka and Zookeeper pods are all up and runing:

    ```bash
    kubectl -n default get pod 
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

    Then run the follwing command to find out metadata of kafka cluster

    ```bash
    kafkacat -L -b my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc:9092
    ```

4. Add Kafka as logs receiver:

    Click ***Add Log Collector*** and then select ***Kafka***, input Kafka broker address and port like below:

    ```bash
    my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc 9092
    my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc 9092
    my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc 9092
    ```

    ![Add Kafka](/images/docs/cluster-administration/cluster-settings/log-collections/add-kafka.png)

5. Run the following command to verify whether the Kafka cluster is receiving logs sent from Fluent Bit:

    ```bash
    # Start a util container
    kubectl run --rm utils -it --generator=run-pod/v1 --image arunvelsriram/utils bash
    # Install Kafkacat in the util container
    apt-get install kafkacat
    # Run the following command to consume log messages from kafka topic: my-topic
    kafkacat -C -b my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc:9092 -t my-topic
    ```
