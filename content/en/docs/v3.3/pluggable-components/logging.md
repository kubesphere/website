---
title: "KubeSphere Logging System"
keywords: "Kubernetes, Elasticsearch, KubeSphere, Logging, logs"
description: "Learn how to enable Logging to leverage the tenant-based system for log collection, query and management."
linkTitle: "KubeSphere Logging System"
weight: 6400
---

KubeSphere provides a powerful, holistic, and easy-to-use logging system for log collection, query, and management. It covers logs at varied levels, including tenants, infrastructure resources, and applications. Users can search logs from different dimensions, such as project, workload, Pod and keyword. Compared with Kibana, the tenant-based logging system of KubeSphere features better isolation and security among tenants as tenants can only view their own logs. Apart from KubeSphere's own logging system, the container platform also allows users to add third-party log collectors, such as Elasticsearch, Kafka, and Fluentd.

For more information, see [Log Query](../../toolbox/log-query/).

## Enable Logging Before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}

- If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Logging in this mode (for example, for testing purposes), refer to [the following section](#enable-logging-after-installation) to see how Logging can be installed after installation.

- If you adopt [Multi-node Installation](../../installing-on-linux/introduction/multioverview/) and are using symbolic links for docker root directory, make sure all nodes follow the exactly same symbolic links. Logging agents are deployed in DaemonSets onto nodes. Any discrepancy in container log path may cause collection failures on that node.

{{</ notice >}}

2. In this file, navigate to `logging` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    logging:
      enabled: true # Change "false" to "true".
      containerruntime: docker
    ```

    {{< notice info >}}To use containerd as the container runtime, change the value of the field `containerruntime` to `containerd`. If you upgraded to KubeSphere 3.3 from earlier versions, you have to manually add the field `containerruntime` under `logging` when enabling KubeSphere Logging system.

    {{</ notice >}}

    {{< notice note >}}By default, KubeKey will install Elasticsearch internally if Logging is enabled. For a production environment, it is highly recommended that you set the following values in `config-sample.yaml` if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, KubeKey will integrate your external Elasticsearch directly instead of installing an internal one.
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

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeSphere Logging first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `logging` and enable Logging by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    logging:
      enabled: true # Change "false" to "true".
      containerruntime: docker
    ```

    {{< notice info >}}To use containerd as the container runtime, change the value of the field `.logging.containerruntime` to `containerd`. If you upgraded to KubeSphere 3.3 from earlier versions, you have to manually add the field `containerruntime` under `logging` when enabling KubeSphere Logging system.

    {{</ notice >}}

    {{< notice note >}}By default, ks-installer will install Elasticsearch internally if Logging is enabled. For a production environment, it is highly recommended that you set the following values in `cluster-configuration.yaml` if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, ks-installer will integrate your external Elasticsearch directly instead of installing an internal one.
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

## Enable Logging After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-logging-system/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `logging` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    logging:
      enabled: true # Change "false" to "true".
      containerruntime: docker
    ```

    {{< notice info >}}To use containerd as the container runtime, change the value of the field `.logging.containerruntime` to `containerd`. If you upgraded to KubeSphere 3.3 from earlier versions, you have to manually add the field `containerruntime` under `logging` when enabling KubeSphere Logging system.

    {{</ notice >}}

    {{< notice note >}}By default, Elasticsearch will be installed internally if Logging is enabled. For a production environment, it is highly recommended that you set the following values in this yaml file if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information, KubeSphere will integrate your external Elasticsearch directly instead of installing an internal one.
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

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-logging-system/hammer.png" height="20px"> in the lower-right corner of the console.

{{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

Go to **System Components** and check that all components on the **Logging** tab page is in **Healthy** state.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n kubesphere-logging-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                  1/1     Running   0          87m
elasticsearch-logging-data-1                  1/1     Running   0          85m
elasticsearch-logging-discovery-0             1/1     Running   0          87m
fluent-bit-bsw6p                              1/1     Running   0          40m
fluent-bit-smb65                              1/1     Running   0          40m
fluent-bit-zdz8b                              1/1     Running   0          40m
fluentbit-operator-9b69495b-bbx54             1/1     Running   0          40m
logsidecar-injector-deploy-667c6c9579-cs4t6   2/2     Running   0          38m
logsidecar-injector-deploy-667c6c9579-klnmf   2/2     Running   0          38m
```

{{</ tab >}}

{{</ tabs >}}
