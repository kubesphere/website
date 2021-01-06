---
title: "KubeSphere Logging System"
keywords: "Kubernetes, Elasticsearch, KubeSphere, Logging, logs"
description: "How to enable the KubeSphere Logging System"
linkTitle: "KubeSphere Logging System"
weight: 6400
---

## What is KubeSphere Logging System

KubeSphere provides a powerful, holistic and easy-to-use logging system for log collection, query and management. It covers logs at varied levels, including tenants, infrastructure resources, and applications. Users can search logs from different dimensions, such as project, workload, Pod and keyword. Compared with Kibana, the tenant-based logging system of KubeSphere features better isolation and security among tenants as tenants can only view their own logs. Apart from KubeSphere's own logging system, the container platform also allows users to add third-party log collectors, such as Elasticsearch, Kafka and Fluentd.

For more information, see [Log Query](../../toolbox/log-query).

## Enable Logging before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

- If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Logging in this mode (e.g. for testing purposes), refer to [the following section](#enable-logging-after-installation) to see how Logging can be installed after installation.

- If you adopt [Multi-node Installation](../../installing-on-linux/introduction/multioverview/) and are using symbolic links for docker root directory, make sure all nodes follow the exactly same symbolic links. Logging agents are deployed in DaemonSets onto nodes. Any discrepancy in container log path may cause collection failures on that node.

{{</ notice >}}

2. In this file, navigate to `logging` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    logging:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
By default, KubeKey will install Elasticsearch internally if Logging is enabled. For a production environment, it is highly recommended that you set the following values in `config-sample.yaml` if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, KubeKey will integrate your external Elasticsearch directly instead of installing an internal one.
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

### **Installing on Kubernetes**

The process of installing KubeSphere on Kubernetes is same as stated in the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/) except the optional component Logging needs to be enabled first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and open it for editing.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `logging` and enable Logging by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    logging:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}
By default, ks-installer will install Elasticsearch internally if Logging is enabled. For a production environment, it is highly recommended that you set the following values in `cluster-configuration.yaml` if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, ks-installer will integrate your external Elasticsearch directly instead of installing an internal one.
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

## Enable Logging after Installation

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.
   
   ![clusters-management](/images/docs/enable-pluggable-components/kubesphere-logging-system/clusters-management.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

    ![edit-yaml](/images/docs/enable-pluggable-components/kubesphere-logging-system/edit-yaml.png)

4. In this yaml file, navigate to `logging` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    logging:
        enabled: true # Change "false" to "true"
    ```

    {{< notice note >}}By default, Elasticsearch will be installed internally if Logging is enabled. For a production environment, it is highly recommended that you set the following values in this yaml file if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information, KubeSphere will integrate your external Elasticsearch directly instead of installing an internal one.
    
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

Go to **Components** and check the status of **Logging**. You may see an image as follows:

![logging](/images/docs/enable-pluggable-components/kubesphere-logging-system/logging.png)

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n kubesphere-logging-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                  1/1     Running   0          9m33s
elasticsearch-logging-data-1                  1/1     Running   0          5m12s
elasticsearch-logging-discovery-0             1/1     Running   0          9m33s
fluent-bit-qpvrf                              1/1     Running   0          4m56s
fluentbit-operator-5bf7687b88-z7bgg           1/1     Running   0          9m26s
logsidecar-injector-deploy-667c6c9579-662pm   2/2     Running   0          8m56s
logsidecar-injector-deploy-667c6c9579-tjckn   2/2     Running   0          8m56s
```

{{</ tab >}}

{{</ tabs >}}
