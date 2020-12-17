---
title: "KubeSphere Events"
keywords: "Kubernetes, events, KubeSphere, k8s-events"
description: "How to enable KubeSphere Events"
linkTitle: "KubeSphere Events"
weight: 6500
---

## What are KubeSphere Events

KubeSphere events allow users to keep track of what is happening inside a cluster, such as node scheduling status and image pulling result. They will be accurately recorded with the specific reason, status and message displayed in the web console. To query events, users can quickly launch the web Toolkit and enter related information in the search bar with different filters (e.g keyword and project) available. Events can also be archived to third-party tools, such as Elasticsearch, Kafka or Fluentd.

For more information, see [Event Query](../../toolbox/events-query).

## Enable Events before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Events in this mode (e.g. for testing purposes), refer to [the following section](#enable-events-after-installation) to see how Events can be [installed after installation](#enable-events-after-installation).

{{</ notice >}}

2. In this file, navigate to `events` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    events:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
By default, KubeKey will install Elasticsearch internally if Events is enabled. For a production environment, it is highly recommended that you set the following values in `config-sample.yaml` if you want to enable Events, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, KubeKey will integrate your external Elasticsearch directly instead of installing an internal one.
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
      elasticsearchDataReplicas: 1     # total number of data nodes
      elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
      elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
      logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
      externalElasticsearchUrl: # The URL of external Elasticsearch
      externalElasticsearchPort: # The port of external Elasticsearch
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

The process of installing KubeSphere on Kubernetes is same as stated in the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/) except the optional component Events needs to be enabled first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and open it for editing.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `events` and enable Events by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    events:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
By default, ks-installer will install Elasticsearch internally if Events is enabled. For a production environment, it is highly recommended that you set the following values in `cluster-configuration.yaml` if you want to enable Events, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, ks-installer will integrate your external Elasticsearch directly instead of installing an internal one.
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
      elasticsearchDataReplicas: 1     # total number of data nodes
      elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
      elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
      logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
      externalElasticsearchUrl: # The URL of external Elasticsearch
      externalElasticsearchPort: # The port of external Elasticsearch
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## Enable Events after Installation

1. Log in the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.
   
    ![clusters-management](/images/docs/enable-pluggable-components/kubesphere-events/clusters-management.png)
    
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

     ![edit-yaml](/images/docs/enable-pluggable-components/kubesphere-events/edit-yaml.png)

4. In this yaml file, navigate to `events` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    events:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}

By default, Elasticsearch will be installed internally if Events is enabled. For a production environment, it is highly recommended that you set the following values in this yaml file if you want to enable Events, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information, KubeSphere will integrate your external Elasticsearch directly instead of installing an internal one.
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
      elasticsearchDataReplicas: 1     # total number of data nodes
      elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
      elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
      logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
      externalElasticsearchUrl: # The URL of external Elasticsearch
      externalElasticsearchPort: # The port of external Elasticsearch
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}

You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.

{{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

If you enable both Logging and Events, you can check the status of Events in **Logging** in **Components**. You may see an image as follows:

![events](/images/docs/enable-pluggable-components/kubesphere-events/events.png)

If you only enable Events without Logging installed, you cannot see the image above as the button **Logging** will not display.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of pods:

```bash
kubectl get pod -n kubesphere-logging-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                  READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0          1/1     Running   0          11m
elasticsearch-logging-data-1          1/1     Running   0          6m48s
elasticsearch-logging-discovery-0     1/1     Running   0          11m
fluent-bit-ljlsl                      1/1     Running   0          6m30s
fluentbit-operator-5bf7687b88-85vxv   1/1     Running   0          11m
ks-events-exporter-5cb959c74b-rc4lm   2/2     Running   0          7m1s
ks-events-operator-7d46fcccc9-8vvsh   1/1     Running   0          10m
ks-events-ruler-97f756879-lg65t       2/2     Running   0          7m1s
ks-events-ruler-97f756879-ptbkr       2/2     Running   0          7m1s
```

{{</ tab >}}

{{</ tabs >}}

