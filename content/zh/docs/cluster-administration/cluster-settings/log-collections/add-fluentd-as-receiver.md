---
title: "添加 Fluentd 作为接收器"
keywords: 'Kubernetes, 日志, Fluentd, 容器组, 容器, Fluentbit, 输出'
description: '了解如何添加 Fluentd 来接收容器日志、资源事件或审计日志。'
linkTitle: "添加 Fluentd 作为接收器"
weight: 8624
---
您可以在 KubeSphere 中使用 Elasticsearch、Kafka 和 Fluentd 日志接收器。本教程演示：

- 创建 Fluentd 部署以及对应的服务（Service）和配置字典（ConfigMap）。
- 添加 Fluentd 作为日志接收器以接收来自 Fluent Bit 的日志，并输出为标准输出。
- 验证 Fluentd 能否成功接收日志。

## 准备工作

- 您需要一个被授予**集群管理**权限的用户。例如，您可以直接用 `admin` 用户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个用户。

- 添加日志接收器前，您需要启用组件 `logging`、`events` 或 `auditing`。有关更多信息，请参见[启用可插拔组件](../../../../pluggable-components/)。本教程启用 `logging` 作为示例。

## 步骤 1：创建 Fluentd 部署

由于内存消耗低，KubeSphere 选择 Fluent Bit。Fluentd 一般在 Kubernetes 中以守护进程集的形式部署，在每个节点上收集容器日志。此外，Fluentd 支持多个插件。因此，Fluentd 会以部署的形式在 KubeSphere 中创建，将从 Fluent Bit 接收到的日志发送到多个目标，例如 S3、MongoDB、Cassandra、MySQL、syslog 和 Splunk 等。

执行以下命令：

{{< notice note >}}

- 以下命令将在默认命名空间 `default` 中创建 Fluentd 部署、服务和配置字典，并为该 Fluentd 配置字典添加 `filter` 以排除 `default` 命名空间中的日志，避免 Fluent Bit 和 Fluentd 重复日志收集。
- 如果您想要将 Fluentd 部署至其他命名空间，请修改以下命令中的命名空间名称。

{{</ notice >}}

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: default
data:
  fluent.conf: |-
    # Receive logs sent from Fluent Bit on port 24224
    <source>
      @type forward
      port 24224
    </source>

    # Because this will send logs Fluentd received to stdout,
    # to avoid Fluent Bit and Fluentd loop logs collection,
    # add a filter here to avoid sending logs from the default namespace to stdout again
    <filter **>
      @type grep
      <exclude>
        key $.kubernetes.namespace_name
        pattern /^default$/
      </exclude>
    </filter>

    # Send received logs to stdout for demo/test purpose only
    # Various output plugins are supported to output logs to S3, MongoDB, Cassandra, MySQL, syslog, Splunk, etc.
    <match **>
      @type stdout
    </match>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: fluentd
  name: fluentd
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      containers:
      - image: fluentd:v1.9.1-1.0
        imagePullPolicy: IfNotPresent
        name: fluentd
        ports:
        - containerPort: 24224
          name: forward
          protocol: TCP
        - containerPort: 5140
          name: syslog
          protocol: TCP
        volumeMounts:
        - mountPath: /fluentd/etc
          name: config
          readOnly: true
      volumes:
      - configMap:
          defaultMode: 420
          name: fluentd-config
        name: config
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: fluentd
  name: fluentd
  namespace: default
spec:
  ports:
  - name: forward
    port: 24224
    protocol: TCP
    targetPort: forward
  selector:
    app: fluentd
  sessionAffinity: None
  type: ClusterIP
EOF
```

## 步骤 2：添加 Fluentd 作为日志接收器

1. 以 `admin` 身份登录 KubeSphere 的 Web 控制台。点击左上角的**平台管理**，然后选择**集群管理**。

   {{< notice note >}} 

   如果您启用了[多集群功能](../../../../multicluster-management/)，您可以选择一个集群。

   {{</ notice >}}

2. 在**集群管理**页面，选择**集群设置**下的**日志接收器**。

3. 点击**添加日志接收器**并选择 **Fluentd**。

4. 输入 **Fluentd** 服务地址和端口信息。

5. Fluentd 会显示在**日志接收器**页面的接收器列表中，状态为**收集中**。


## 步骤 3：验证 Fluentd 能否从 Fluent Bit 接收日志

1. 在**集群管理**页面点击**应用负载**。

2. 点击**工作负载**，并在**部署**选项卡中选择 `default` 项目。

3. 点击 **fluentd** 项目并选择 **fluentd-xxxxxxxxx-xxxxx** 容器组。

4. 点击 **fluentd** 容器。

5. 在 **fluentd** 容器页面，选择**容器日志**选项卡。

6. 您可以看到日志持续滚动输出。