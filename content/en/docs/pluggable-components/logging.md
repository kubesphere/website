---
title: "KubeSphere Logging System"
keywords: "Kubernetes, Elasticsearch, KubeSphere, Logging, logs"
description: "How to Enable KubeSphere Logging System"

linkTitle: "KubeSphere Logging System"
weight: 3535
---

## What is KubeSphere Logging System

KubeSphere provides a powerful, holistic and easy-to-use logging system for log collection, query and management. It covers logs from at varied levels, including tenants, infrastructure resources, and applications. Users can search logs from different dimensions, such as project, workload, Pod and keyword. Compared with Kibana, the tenant-based logging system of KubeSphere features better isolation and security among tenants as each tenant can only view his or her own logs. Apart from KubeSphere's own logging system, the container platform also allows users to add third-party log collectors, such as Elasticsearch, Kafka and Fluentd. 

For more information, see Logging, Events and Auditing.

## Enable Logging before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere-v3.netlify.app/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere-v3.netlify.app/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Logging in this mode (e.g. for testing purpose), refer to the following section to see how Logging can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `logging` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
logging:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

By default, KubeKey will install Elasticsearch internally if Logging is enabled. For a production environment, it is highly recommended that you set the following value in **config-sample.yaml** if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, KubeKey will integrate your external Elasticsearch directly instead of installing an internal one.

{{</ notice >}}

```bash
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

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) for cluster setting. If you want to install Logging, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](https://kubesphere-v3.netlify.app/docs/installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml). After that, to enable Logging, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `logging` and enable Logging by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
logging:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

By default, ks-installer will install Elasticsearch internally if Logging is enabled. For a production environment, it is highly recommended that you set the following value in **cluster-configuration.yaml** if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, ks-installer will integrate your external Elasticsearch directly instead of installing an internal one.

{{</ notice >}}

```bash
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

4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

## Enable Logging after Installation

1. Log in the console as `admin`. Click **Platform** at the top left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `logging` and change `false` to `true` for `enabled`. After you finish, click **Update** at the bottom right corner to save the configuration.

```bash
logging:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

By default, Elasticsearch will be installed internally if Logging is enabled. For a production environment, it is highly recommended that you set the following value in this yaml file if you want to enable Logging, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information, KubeSphere will integrate your external Elasticsearch directly instead of installing an internal one.

{{</ notice >}}

```bash
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

You can find the web kubectl tool by clicking the hammer icon at the bottom right corner of the console.

{{</ notice >}}

## Verify the Installation of Component

{{< tabs >}}

{{< tab "Verify the Component in Dashboard" >}}

Go to **Components** and check the status of Logging. You may see an image as follows:

![logging](https://ap3.qingstor.com/kubesphere-website/docs/20200829104152.png)

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

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