---
title: 'KubeSphere 部署 Kafka 集群实战指南'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, Kafka'
description: '本文档将详细阐述如何利用 Helm 这一强大的工具，快速而高效地在 K8s 集群上安装并配置一个 Kafka 集群。'
createTime: '2024-08-08'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/deploy-kafka-on-kubesphere-20240808-cover.png'
---

本文档将详细阐述如何利用 Helm 这一强大的工具，快速而高效地在 K8s 集群上安装并配置一个 Kafka 集群。

**实战服务器配置(架构 1:1 复刻小规模生产环境，配置略有不同)**

|      主机名      |      IP       | CPU  | 内存 | 系统盘 | 数据盘 |                    用途                    |
| :--------------: | :-----------: | :--: | :--: | :----: | :----: | :----------------------------------------: |
|   ksp-registry   | 192.168.9.90  |  4   |  8   |   40   |  200   |              Harbor 镜像仓库               |
|  ksp-control-1   | 192.168.9.91  |  4   |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|  ksp-control-2   | 192.168.9.92  |  4   |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|  ksp-control-3   | 192.168.9.93  |  4   |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|   ksp-worker-1   | 192.168.9.94  |  8   |  16  |   40   |  100   |               k8s-worker/CI                |
|   ksp-worker-2   | 192.168.9.95  |  8   |  16  |   40   |  100   |                 k8s-worker                 |
|   ksp-worker-3   | 192.168.9.96  |  8   |  16  |   40   |  100   |                 k8s-worker                 |
|  ksp-storage-1   | 192.168.9.97  |  4   |  8   |   40   |  400+  |      ElasticSearch/Longhorn/Ceph/NFS       |
|  ksp-storage-2   | 192.168.9.98  |  4   |  8   |   40   |  300+  |        ElasticSearch/Longhorn/Ceph         |
|  ksp-storage-3   | 192.168.9.99  |  4   |  8   |   40   |  300+  |        ElasticSearch/Longhorn/Ceph         |
| ksp-gpu-worker-1 | 192.168.9.101 |  4   |  16  |   40   |  100   |    k8s-worker(GPU NVIDIA Tesla M40 24G)    |
| ksp-gpu-worker-2 | 192.168.9.102 |  4   |  16  |   40   |  100   |   k8s-worker(GPU NVIDIA Tesla P100 16G)    |
|  ksp-gateway-1   | 192.168.9.103 |  2   |  4   |   40   |        |  自建应用服务代理网关/VIP：192.168.9.100   |
|  ksp-gateway-2   | 192.168.9.104 |  2   |  4   |   40   |        |  自建应用服务代理网关/VIP：192.168.9.100   |
|     ksp-mid      | 192.168.9.105 |  4   |  8   |   40   |  100   | 部署在 k8s 集群之外的服务节点（Gitlab 等） |
|       合计       |      15       |  68  | 152  |  600   | 2100+  |                                            |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3 x86_64**
- KubeSphere：**v3.4.1**
- Kubernetes：**v1.28.8**
- KubeKey:  **v3.1.1**
- Bitnami Kafka Helm Charts：**29.3.13**
- Kafka： **3.7.1**

## 1. 前提条件

目前在 K8s 集群部署 Kafka 的主流方案有以下几种：

- 手写资源配置清单（麻烦，涉及的组件、配置多）
- Kafka Helm chart （**Bitnami 出品**，简单可定制，但是需要花时间成本学习可配置参数）

经过细致的调研、思考，本文选择采用 Bitnami 的 Kafka Helm chart 进行部署。Bitnami 提供的 Helm chart 以其稳定性和易用性著称，是快速部署 Kafka 到 Kubernetes 集群的理想选择。

编写本文的目的是为了验证 Kafka Helm chart 的部署可行性，并评估其在实际应用中的表现。为了确保过程的顺利和提高成功几率，以下部署配置进行了适度简化，某些配置并**不符合生产环境的标准**。

- 外部访问安全协议，使用了 `PLAINTEXT` ，关闭了访问认证，默认值为 `SASL_PLAINTEXT`。**生产环境务必开启认证。**
- 外部访问使用了 NodePort 模式
- 默认 StorageClass 使用了 NFS
- 没有考虑数据持久化的配置

对于计划在生产环境部署的用户，我建议详细参考 Bitnami 官方文档，以获取更全面的配置指导和最佳实践。我认为生产环境应该考虑的几项配置如下：

- 外部访问安全协议，选择`PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL` 和 `SSL`  中的哪种方式加密认证方式，
- 数据、日志持久化配置
- k8s 集群外部访问 Kafka 的方式，NodePort 是否合适？是否需要使用 LoadBalancer、Ingress 
- 内否启用内置的监控 `Metrics`
- 是否利用 Helm 生成 Kubectl 可用的资源配置清单，离线部署

## 2. 使用 Helm 安装 Kafka 集群

### 2.1  安装 Kafka Helm Chart

- 添加 Kafka Helm repository

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

- 更新本地 charts

```bash
helm repo update bitnami				
```

### 2.2 安装 Kafka

- 官方默认安装命令（**仅供参考，本文未用**）

```bash
helm install my-release oci://registry-1.docker.io/bitnamicharts/kafka
```

- 按规划设置自定义配置项，执行下面的安装命令：

```bash
helm install opsxlab bitnami/kafka \
  --namespace opsxlab --create-namespace \
  --set replicaCount=3 \
  --set global.imageRegistry="registry.opsxlab.cn:8443" \
  --set global.defaultStorageClass="nfs-sc" \
  --set externalAccess.enabled=true \
  --set externalAccess.controller.service.type=NodePort \
  --set externalAccess.controller.service.nodePorts[0]='31211' \
  --set externalAccess.controller.service.nodePorts[1]='31212' \
  --set externalAccess.controller.service.nodePorts[2]='31213' \
  --set externalAccess.controller.service.useHostIPs=true \
  --set listeners.client.protocol=PLAINTEXT \
  --set listeners.external.protocol=PLAINTEXT
```

**自定义配置说明：**

- 指定并自动创建命名空间 **opsxlab** 
- 设置组件的镜像地址，本文为了演示修改方法，使用了内部的镜像仓库，**实际使用中请修改为自己的镜像仓库地址**
- 设置默认的持久化存储类为 `nfs-sc`，适用于 K8s 有多种存储类，需要部署到指定存储类的场景
- 开启外部访问，并设置相关参数
- 加密认证方式选择了 PLAINTEXT

**正确执行后，输出结果如下 :**

```bash
$ helm install opsxlab bitnami/kafka \
  --set externalAccess.controller.service.nodePorts[1]='31212' \
>   --namespace opsxlab --create-namespace \
>   --set replicaCount=3 \
>   --set global.imageRegistry="registry.opsxlab.cn:8443" \
>   --set global.defaultStorageClass="nfs-sc" \
>   --set externalAccess.enabled=true \
>   --set externalAccess.controller.service.type=NodePort \
>   --set externalAccess.controller.service.nodePorts[0]='31211' \
>   --set externalAccess.controller.service.nodePorts[1]='31212' \
>   --set externalAccess.controller.service.nodePorts[2]='31213' \
>   --set externalAccess.controller.service.useHostIPs=true \
>   --set listeners.client.protocol=PLAINTEXT \
>   --set listeners.external.protocol=PLAINTEXT
NAME: opsxlab
LAST DEPLOYED: Wed Jul 30 22:08:38 2024
NAMESPACE: opsxlab
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: kafka
CHART VERSION: 29.3.13
APP VERSION: 3.7.1
---------------------------------------------------------------------------------------------
 WARNING

    By specifying "serviceType=LoadBalancer" and not configuring the authentication
    you have most likely exposed the Kafka service externally without any
    authentication mechanism.

    For security reasons, we strongly suggest that you switch to "ClusterIP" or
    "NodePort". As alternative, you can also configure the Kafka authentication.

---------------------------------------------------------------------------------------------

** Please be patient while the chart is being deployed **

Kafka can be accessed by consumers via port 9092 on the following DNS name from within your cluster:

    opsxlab-kafka.opsxlab.svc.cluster.local

Each Kafka broker can be accessed by producers via port 9092 on the following DNS name(s) from within your cluster:

    opsxlab-kafka-controller-0.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092
    opsxlab-kafka-controller-1.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092
    opsxlab-kafka-controller-2.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092

To create a pod that you can use as a Kafka client run the following commands:

    kubectl run opsxlab-kafka-client --restart='Never' --image registry.opsxlab.cn:8443/bitnami/kafka:3.7.1-debian-12-r4 --namespace opsxlab --command -- sleep infinity
    kubectl exec --tty -i opsxlab-kafka-client --namespace opsxlab -- bash

    PRODUCER:
        kafka-console-producer.sh \
            --broker-list opsxlab-kafka-controller-0.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,opsxlab-kafka-controller-1.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,opsxlab-kafka-controller-2.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092 \
            --topic test

    CONSUMER:
        kafka-console-consumer.sh \
            --bootstrap-server opsxlab-kafka.opsxlab.svc.cluster.local:9092 \
            --topic test \
            --from-beginning
To connect to your Kafka controller+broker nodes from outside the cluster, follow these instructions:
    Kafka brokers domain: You can get the external node IP from the Kafka configuration file with the following commands (Check the EXTERNAL listener)

        1. Obtain the pod name:

        kubectl get pods --namespace opsxlab -l "app.kubernetes.io/name=kafka,app.kubernetes.io/instance=opsxlab,app.kubernetes.io/component=kafka"

        2. Obtain pod configuration:

        kubectl exec -it KAFKA_POD -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
    Kafka brokers port: You will have a different node port for each Kafka broker. You can get the list of configured node ports using the command below:

        echo "$(kubectl get svc --namespace opsxlab -l "app.kubernetes.io/name=kafka,app.kubernetes.io/instance=opsxlab,app.kubernetes.io/component=kafka,pod" -o jsonpath='{.items[*].spec.ports[0].nodePort}' | tr ' ' '\n')"

WARNING: There are "resources" sections in the chart not set. Using "resourcesPreset" is not recommended for production. For production installations, please set the following values according to your workload needs:
  - controller.resources
+info https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
```

### 2.3 查看安装结果

Helm 安装命令成功执行后，观察 Pod 运行状态。

```bash
kubectl get pods -n opsxlab
```

**安装成功后，输出结果如下 :**

```bash
$ kubectl get pods -n opsxlab
NAME                         READY   STATUS    RESTARTS   AGE
opsxlab-kafka-controller-0   1/1     Running   0          1m17s
opsxlab-kafka-controller-1   1/1     Running   0          1m17s
opsxlab-kafka-controller-2   1/1     Running   0          1m17s
```

KubeSphere 管理控制台查看部署的组件信息。

- StatefulSet（**1个**）

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//kafka-statefulsets-v371.png)

- Services（**5个**）

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//kafka-services-v371.png)

## 3. 验证测试 Kafka 服务可用性

分别在 K8s 集群内和集群外验证 Kafka 服务的可用性。

### 3.1 K8s 集群内部验证

在 K8s 集群内的验证过程，可以参考 Helm 部署 Kafka 时给出的提示信息。

1. 创建测试 Pod

```bash
kubectl run opsxlab-kafka-client --restart='Never' --image registry.opsxlab.cn:8443/bitnami/kafka:3.7.1-debian-12-r4 --namespace opsxlab --command -- sleep infinity
```

2. 打开测试 Pod 终端

```bash
kubectl exec --tty -i opsxlab-kafka-client --namespace opsxlab -- bash
```

3. 执行命令，生产数据

```bash
kafka-console-producer.sh \
  --broker-list opsxlab-kafka-controller-0.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,opsxlab-kafka-controller-1.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,opsxlab-kafka-controller-2.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092 \
  --topic test
```

4. **再打开一个**测试 Pod 终端，消费数据

再打开一个终端后，先执行 第 2 步`打开测试 Pod 终端`的命令，然后再执行下面的命令。

```bash
kafka-console-consumer.sh \
  --bootstrap-server opsxlab-kafka.opsxlab.svc.cluster.local:9092 \
  --topic test \
  --from-beginning
```

5. 生产并消费数据测试

在生产者一侧随便输入测试数据，观察消费者一侧是否正确收到信息。

**生产者侧：**

```bash
I have no name!@opsxlab-kafka-client:/$ kafka-console-producer.sh   --broker-list opsxlab-kafka-controller-0.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,opsxlab-kafka-controller-1.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,opsxlab-kafka-controller-2.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092   --topic test
>cluster kafka test 1
>cluster kafka test 2
```

**消费者侧：**

```bash
I have no name!@opsxlab-kafka-client:/$ kafka-console-consumer.sh \
  --bootstrap-server opsxlab-kafka.opsxlab.svc.cluster.local:9092 \
  --topic test \
  --from-beginning

cluster kafka test 1
cluster kafka test 2
```

### 3.2 k8s 集群外部验证

为了**更严谨的测试** Kafka 在 K8s 集群外的可用性，我在 K8s 集群外找了一台机器，**安装 JDK 和 Kafka**。安装方式上 JDK 选择了 Yum 安装 `openjdk`，Kafka 则选用了官方提供的二进制包。

实际测试时还可以选择 Docker 镜像或是在 K8s 集群上再创建一个 Pod，测试时连接 K8s 节点的宿主机 IP 和 NodePort。

1. 准备外部测试环境

```bash
# 安装 JDK
yum install java-1.8.0-openjdk

# 下载 Kafka
cd /srv
wget https://downloads.apache.org/kafka/3.7.1/kafka_2.13-3.7.1.tgz

# 解压
tar xvf kafka_2.13-3.7.1.tgz
cd /srv/kafka_2.13-3.7.1/bin
```

2. 获取 Kafka 外部访问配置信息

一共 3个 Kafka Pod，每个 Pod 的 `advertised.listeners` 配置不同，在 **K8s 控制节点**，分别执行下面的命令：

```bash
kubectl exec -n opsxlab -it opsxlab-kafka-controller-0 -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
kubectl exec -n opsxlab -it opsxlab-kafka-controller-1 -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
kubectl exec -n opsxlab -it opsxlab-kafka-controller-2 -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
```

**正确执行后，输出结果如下 :**

```bash
$ kubectl exec -n opsxlab -it opsxlab-kafka-controller-0 -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
Defaulted container "kafka" out of: kafka, kafka-init (init)
advertised.listeners=CLIENT://opsxlab-kafka-controller-0.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,INTERNAL://opsxlab-kafka-controller-0.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9094,EXTERNAL://192.168.9.125:31211

$ kubectl exec -n opsxlab -it opsxlab-kafka-controller-1 -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
Defaulted container "kafka" out of: kafka, kafka-init (init)
advertised.listeners=CLIENT://opsxlab-kafka-controller-1.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,INTERNAL://opsxlab-kafka-controller-1.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9094,EXTERNAL://192.168.9.124:31212

$ kubectl exec -n opsxlab -it opsxlab-kafka-controller-2 -- cat /opt/bitnami/kafka/config/server.properties | grep advertised.listeners
Defaulted container "kafka" out of: kafka, kafka-init (init)
advertised.listeners=CLIENT://opsxlab-kafka-controller-2.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9092,INTERNAL://opsxlab-kafka-controller-2.opsxlab-kafka-controller-headless.opsxlab.svc.cluster.local:9094,EXTERNAL://192.168.9.126:31213
```

3. 外部节点连接 Kafka 测试

跟 K8s 集群内部验证测试过程一样，打开两个终端，运行生产者和消费者脚本。执行下面的命令验证测试(细节略过，直接上结果)。

**外部生产者侧：**

```bash
$ ./kafka-console-producer.sh --broker-list 192.168.9.125:31211  --topic test
>external kafka test 3
>external kafka test 4
```

**外部消费者侧：**

```bash
$ ./kafka-console-consumer.sh --bootstrap-server 192.168.9.125:31211  --topic test --from-beginning

cluster kafka test 1
cluster kafka test 2
external kafka test 3
external kafka test 4
```

> **注意：**  外部消费者能消费到所有数据，包括集群内部测试时生成的数据。

**集群内消费者侧：** 集群内的消费者，同样能获取外部生产者产生的数据。

```bash
I have no name!@opsxlab-kafka-client:/$ kafka-console-consumer.sh \
  --bootstrap-server opsxlab-kafka.opsxlab.svc.cluster.local:9092 \
  --topic test \
  --from-beginning

cluster kafka test 1
cluster kafka test 2
external kafka test 3
external kafka test 4
```

**免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！