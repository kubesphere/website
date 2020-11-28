---
title: "Add Fluentd as Receiver (aka Collector)"
keywords: 'kubernetes, log, fluentd, pod, container, fluentbit, output'
description: 'KubeSphere Installation Overview'

linkTitle: "Add Fluentd as Receiver"
weight: 9624
---
KubeSphere supports using Elasticsearch, Kafka and Fluentd as log receivers.
This doc will demonstrate:

- How to deploy Fluentd as deployment and create corresponding service and configmap.
- How to add Fluentd as a log receiver to receive logs sent from Fluent Bit and then output to stdout.
- How to verify if Fluentd receives logs successfully.

## Prerequisites

- Before adding a log receiver, you need to enable any of the `logging`, `events` or `auditing` components following [Enable Pluggable Components](https://kubesphere.io/docs/pluggable-components/). The `logging` component is enabled as an example in this doc.
- To configure log collection, you should use an account of ***platform-admin*** role.

## Step 1: Deploy Fluentd as a deployment

Usually, Fluentd is deployed as a daemonset in K8s to collect container logs on each node. KubeSphere chooses Fluent Bit for this purpose because of its low memory footprint. Besides, Fluentd features numerous output plugins. Hence, KubeSphere chooses to deploy Fluentd as a deployment to forward logs it receives from Fluent Bit to more destinations such as S3, MongoDB, Cassandra, MySQL, syslog and Splunk.

To deploy Fluentd as a deployment, you simply need to open  the ***kubectl*** console in ***KubeSphere Toolbox*** and run the following command:

{{< notice note >}}

- The following command will deploy Fluentd deployment, service and configmap into the `default` namespace and add a filter to Fluentd configmap to exclude logs from the `default` namespace to avoid Fluent Bit and Fluentd loop logs collection.
- You'll need to change all these `default` to the namespace you selected if you want to deploy to a different namespace.

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
    # Various output plugins are supported to output logs to S3, MongoDB, Cassandra, MySQL, syslog and Splunk etc.
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
    app: fluentd-svc
  name: fluentd-svc
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

## Step 2: Add Fluentd as log receiver (aka collector)

1. To add a log receiver:

    - Login KubeSphere with an account of ***platform-admin*** role
    - Click ***Platform*** -> ***Clusters Management***
    - Select a cluster if multiple clusters exist
    - Click ***Cluster Settings*** -> ***Log Collections***
    - Log receivers can be added by clicking ***Add Log Collector***

    ![Add receiver](/images/docs/cluster-administration/cluster-settings/log-collections/add-receiver.png)

2. Choose ***Fluentd*** and fill in the Fluentd service address and port like below:

    ![Add Fluentd](/images/docs/cluster-administration/cluster-settings/log-collections/add-fluentd.png)

3. Fluentd appears in the receiver list of ***Log Collections*** UI and its status shows ***Collecting***.

    ![Receiver List](/images/docs/cluster-administration/cluster-settings/log-collections/receiver-list.png)

4. Verify whether Fluentd is receiving logs sent from Fluent Bit:

    - Click ***Application Workloads*** in the ***Cluster Management*** UI.
    - Select ***Workloads*** and then select the `default` namespace in the ***Workload*** - ***Deployments*** tab
    - Click the ***fluentd*** item and then click the ***fluentd-xxxxxxxxx-xxxxx*** pod
    - Click the ***fluentd*** container
    - In the ***fluentd*** container page, select the ***Container Logs*** tab

    You'll see logs begin to scroll up continuously.

    ![Container Logs](/images/docs/cluster-administration/cluster-settings/log-collections/container-logs.png)