---
title: "KubeSphere Auditing Logs"
keywords: "Kubernetes, auditing, KubeSphere, logs"
description: "How to enable KubeSphere Auditing Logs"

linkTitle: "KubeSphere Auditing Logs"
weight: 3525
---

## What are KubeSphere Auditing Logs?

KubeSphere Auditing Log System provides a security-relevant chronological set of records documenting the sequence of activities related to individual users, managers, or other components of the system. Each request to KubeSphere generates an event that is then written to a webhook and processed according to a certain rule.

For more information, see Logging, Events, and Auditing.

## Enable Auditing Logs before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere-v3.netlify.app/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere-v3.netlify.app/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Auditing in this mode (e.g. for testing purpose), refer to the following section to see how Auditing can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `auditing` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
auditing:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

By default, KubeKey will install Elasticsearch internally if Auditing is enabled. For a production environment, it is highly recommended that you set the following value in **config-sample.yaml** if you want to enable Auditing, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, KubeKey will integrate your external Elasticsearch directly instead of installing an internal one.

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

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) for cluster setting. If you want to install Auditing, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](https://kubesphere-v3.netlify.app/docs/installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml). After that, to enable Auditing, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `auditing` and enable Auditing by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
auditing:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

By default, ks-installer will install Elasticsearch internally if Auditing is enabled. For a production environment, it is highly recommended that you set the following value in **cluster-configuration.yaml** if you want to enable Auditing, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information before installation, ks-installer will integrate your external Elasticsearch directly instead of installing an internal one.

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

## Enable Auditing Logs after Installation

1. Log in the console as `admin`. Click **Platform** at the top left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `auditing` and change `false` to `true` for `enabled`. After you finish, click **Update** at the bottom right corner to save the configuration.

```bash
auditing:
    enabled: true # Change "false" to "true"
```

{{< notice note >}}

By default, Elasticsearch will be installed internally if Auditing is enabled. For a production environment, it is highly recommended that you set the following value in this yaml file if you want to enable Auditing, especially `externalElasticsearchUrl` and `externalElasticsearchPort`. Once you provide the following information, KubeSphere will integrate your external Elasticsearch directly instead of installing an internal one.

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

If you enable both Logging and Auditing, you can check the status of Auditing in **Logging** in **Components**. You may see an image as follows:

![auditing](https://ap3.qingstor.com/kubesphere-website/docs/20200829121140.png)

If you only enable Auditing without Logging installed, you cannot see the image above as the button **Logging** will not display.

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

```bash
kubectl get pod -n kubesphere-logging-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                                              READY   STATUS      RESTARTS   AGE
elasticsearch-logging-curator-elasticsearch-curator-159872n9g9g   0/1     Completed   0          2d10h
elasticsearch-logging-curator-elasticsearch-curator-159880tzb7x   0/1     Completed   0          34h
elasticsearch-logging-curator-elasticsearch-curator-1598898q8w7   0/1     Completed   0          10h
elasticsearch-logging-data-0                                      1/1     Running     1          2d20h
elasticsearch-logging-data-1                                      1/1     Running     1          2d20h
elasticsearch-logging-discovery-0                                 1/1     Running     1          2d20h
fluent-bit-6v5fs                                                  1/1     Running     1          2d20h
fluentbit-operator-5bf7687b88-44mhq                               1/1     Running     1          2d20h
kube-auditing-operator-7574bd6f96-p4jvv                           1/1     Running     1          2d20h
kube-auditing-webhook-deploy-6dfb46bb6c-hkhmx                     1/1     Running     1          2d20h
kube-auditing-webhook-deploy-6dfb46bb6c-jp77q                     1/1     Running     1          2d20h
```

{{</ tab >}}

{{</ tabs >}}