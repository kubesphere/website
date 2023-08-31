---
title: "添加 Kafka 作为接收器"
keywords: 'Kubernetes, 日志, Kafka, Pod, 容器, Fluentbit, 输出'
description: '了解如何添加 Kafka 来接收容器日志、资源事件或审计日志。'
linkTitle: "添加 Kafka 作为接收器"
weight: 8623
---
您可以在 KubeSphere 中使用 Elasticsearch、Kafka 和 Fluentd 日志接收器。本教程演示：

- 部署 [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator)，然后通过创建 `Kafka` 和 `KafkaTopic` CRD 以创建 Kafka 集群和 Kafka 主题。
- 添加 Kafka 作为日志接收器以从 Fluent Bit 接收日志。
- 使用 [Kafkacat](https://github.com/edenhill/kafkacat) 验证 Kafka 集群是否能接收日志。

## 准备工作

- 您需要一个被授予**集群管理**权限的用户。例如，您可以直接用 `admin` 用户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个用户。
- 添加日志接收器前，您需要启用组件 `logging`、`events` 或 `auditing`。有关更多信息，请参见[启用可插拔组件](../../../../pluggable-components/)。本教程启用 `logging` 作为示例。

## 步骤 1：创建 Kafka 集群和 Kafka 主题

您可以使用 [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) 创建 Kafka 集群和 Kafka 主题。如果您已经有了一个 Kafka 集群，您可以直接从下一步开始。

1. 在 `default` 命名空间中安装 [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator)：

    ```bash
    helm repo add strimzi https://strimzi.io/charts/
    ```

    ```bash
    helm install --name kafka-operator -n default strimzi/strimzi-kafka-operator
    ```


2. 运行以下命令在 `default` 命名空间中创建 Kafka 集群和 Kafka 主题，该命令所创建的 Kafka 和 Zookeeper 集群的存储类型为 `ephemeral`，使用 `emptyDir` 进行演示。若要在生产环境下配置储存类型，请参见 [kafka-persistent](https://github.com/strimzi/strimzi-kafka-operator/blob/0.19.0/examples/kafka/kafka-persistent.yaml)。

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

3. 运行以下命令查看容器组状态，并等待 Kafka 和 Zookeeper 运行并启动。

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

    运行以下命令查看 Kafka 集群的元数据：

    ```bash
    kafkacat -L -b my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc:9092
    ```

## 步骤 2：添加 Kafka 作为日志接收器

1. 以 `admin` 身份登录 KubeSphere 的 Web 控制台。点击左上角的**平台管理**，然后选择**集群管理**。

   {{< notice note >}}

   如果您启用了[多集群功能](../../../../multicluster-management/)，您可以选择一个集群。

   {{</ notice >}} 

2. 在**集群管理**页面，选择**集群设置**下的**日志接收器**。

3. 点击**添加日志接收器**并选择 **Kafka**。输入 Kafka 服务地址和端口信息，然后点击**确定**继续。

   | 服务地址                                                 | 端口号 |
   | ------------------------------------------------------- | ---- |
   | my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc | 9092 |
   | my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc | 9092 |
   | my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc | 9092 |

4. 运行以下命令验证 Kafka 集群是否能从 Fluent Bit 接收日志：

   ```bash
   # Start a util container
   kubectl run --rm utils -it --generator=run-pod/v1 --image arunvelsriram/utils bash
   # Install Kafkacat in the util container
   apt-get install kafkacat
   # Run the following command to consume log messages from kafka topic: my-topic
   kafkacat -C -b my-cluster-kafka-0.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-1.my-cluster-kafka-brokers.default.svc:9092,my-cluster-kafka-2.my-cluster-kafka-brokers.default.svc:9092 -t my-topic
   ```