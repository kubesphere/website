---
title: "KubeSphere Events"
keywords: "Kubernetes, events, KubeSphere, k8s-events"
description: "Learn how to enable Events to keep track of everything that is happening on the platform."
linkTitle: "KubeSphere Events"
weight: 6500
---

KubeSphere events allow users to keep track of what is happening inside a cluster, such as node scheduling status and image pulling result. They will be accurately recorded with the specific reason, status and message displayed in the web console. To query events, users can quickly launch the web Toolkit and enter related information in the search bar with different filters (e.g keyword and project) available. Events can also be archived to third-party tools, such as Elasticsearch, Kafka, or Fluentd.

For more information, see [Event Query](../../toolbox/events-query/).

## Enable Events Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Events in this mode (for example, for testing purposes), refer to [the following section](#enable-events-after-installation) to see how Events can be [installed after installation](#enable-events-after-installation).

{{</ notice >}}

2. In this file, navigate to `events` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    events:
      enabled: true # Change "false" to "true".
    ```

    {{< notice note >}}
By default, KubeKey will install Elasticsearch internally if Events is enabled. For a production environment, it is highly recommended that you set the following values in `config-sample.yaml` if you want to enable Events, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, KubeKey will integrate your external Elasticsearch directly instead of installing an internal one.
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # The total number of master nodes. Even numbers are not allowed.
      elasticsearchDataReplicas: 1     # The total number of data nodes.
      elasticsearchMasterVolumeSize: 4Gi   # The volume size of Elasticsearch master nodes.
      elasticsearchDataVolumeSize: 20Gi    # The volume size of Elasticsearch data nodes.
      logMaxAge: 7                     # Log retention day in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      externalElasticsearchUrl: # The Host of external Elasticsearch.
      externalElasticsearchPort: # The port of external Elasticsearch.
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeSphere Events first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `events` and enable Events by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    events:
      enabled: true # Change "false" to "true".
    ```

    {{< notice note >}}
By default, ks-installer will install Elasticsearch internally if Events is enabled. For a production environment, it is highly recommended that you set the following values in `cluster-configuration.yaml` if you want to enable Events, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, ks-installer will integrate your external Elasticsearch directly instead of installing an internal one.
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # The total number of master nodes. Even numbers are not allowed.
      elasticsearchDataReplicas: 1     # The total number of data nodes.
      elasticsearchMasterVolumeSize: 4Gi   # The volume size of Elasticsearch master nodes.
      elasticsearchDataVolumeSize: 20Gi    # The volume size of Elasticsearch data nodes.
      logMaxAge: 7                     # Log retention day in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      externalElasticsearchUrl: # The Host of external Elasticsearch.
      externalElasticsearchPort: # The port of external Elasticsearch.
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable Events After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-events/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `events` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    events:
      enabled: true # Change "false" to "true".
    ```

    {{< notice note >}}

By default, Elasticsearch will be installed internally if Events is enabled. For a production environment, it is highly recommended that you set the following values in this yaml file if you want to enable Events, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information, KubeSphere will integrate your external Elasticsearch directly instead of installing an internal one.
    {{</ notice >}}

    ```yaml
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # The total number of master nodes. Even numbers are not allowed.
      elasticsearchDataReplicas: 1     # The total number of data nodes.
      elasticsearchMasterVolumeSize: 4Gi   # The volume size of Elasticsearch master nodes.
      elasticsearchDataVolumeSize: 20Gi    # The volume size of Elasticsearch data nodes.
      logMaxAge: 7                     # Log retention day in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      externalElasticsearchUrl: # The Host of external Elasticsearch.
      externalElasticsearchPort: # The port of external Elasticsearch.
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-events/hammer.png" height="20px"> in the lower-right corner of the console.

{{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

Verify that you can use the **Resource Event Search** function from the **Toolbox** in the lower-right corner.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n kubesphere-logging-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                  1/1     Running   0          155m
elasticsearch-logging-data-1                  1/1     Running   0          154m
elasticsearch-logging-discovery-0             1/1     Running   0          155m
fluent-bit-bsw6p                              1/1     Running   0          108m
fluent-bit-smb65                              1/1     Running   0          108m
fluent-bit-zdz8b                              1/1     Running   0          108m
fluentbit-operator-9b69495b-bbx54             1/1     Running   0          109m
ks-events-exporter-5cb959c74b-gx4hw           2/2     Running   0          7m55s
ks-events-operator-7d46fcccc9-4mdzv           1/1     Running   0          8m
ks-events-ruler-8445457946-cl529              2/2     Running   0          7m55s
ks-events-ruler-8445457946-gzlm9              2/2     Running   0          7m55s
logsidecar-injector-deploy-667c6c9579-cs4t6   2/2     Running   0          106m
logsidecar-injector-deploy-667c6c9579-klnmf   2/2     Running   0          106m
```

{{</ tab >}}

{{</ tabs >}}

