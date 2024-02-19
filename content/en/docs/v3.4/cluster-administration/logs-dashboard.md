---
title: "KubeSphere Log Dashboard"
keywords: "Kubernetes, KubeSphere, OpenSearch, Dashboard"
description: "Learn how to enable log dashboard, a graphical interface tool similar to ElasticSearch Kibana."
linkTitle: "KubeSphere Log Dashboard"
weight: 6200
---

As an open-source, application-centric container platform, KubeSphere v3.4.1 uses [OpenSearch](https://opensearch.org/) instead of ElasticSearch as the backend storage for logs, events, and auditing. By default, we can use the query tool provided in the lower-right corner on the KubeSphere console to retrieve logs, events, and auditing records.

If you want an experience similar to the Kibana page, such as log chart drawing, you can enable OpenSearch Dashboard.


## Enable Log Dashboard Before KubeSphere Installation

### Install on Linux

When installing KubeSphere with multiple nodes on Linux, you should create a configuration file that lists all KubeSphere components.

1. When you [Install KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), create a file `config-sample.yaml` and change it by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

2. Before enabling the OpenSearch Dashboard, you need to enable components `logging`, `opensearch`, and `events` or `auditing` in the yaml file. In this example, enable `events` as follows:

    ```yaml
    opensearch:
      basicAuth:
        enabled: true
        password: admin
        username: admin
      dashboard:
        enabled: true       # Change "false" to "true".
      enabled: true         # Change "false" to "true".
      externalOpensearchHost: ""
      externalOpensearchPort: ""
      logMaxAge: 7
      opensearchPrefix: whizard 
    ```

    ```yaml
    logging:
      enabled: true   # Change "false" to "true".
      logsidecar:
        enabled: true
        replicas: 2
    ```

    ```yaml
      events:
        enabled: true  # Change "false" to "true".
        ruler:
          enabled: true
          replicas: 2
    ```

3. Execute the following command to create the cluster using this configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Install on Kubernetes

When you [Install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you need to enable the relevant components in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/cluster-configuration.yaml) file.

1. Download the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/cluster-configuration.yaml) file and edit the file using the following command:

    ```bash
    vi cluster-configuration.yaml
    ```

2. Before enabling the OpenSearch Dashboard, you need to enable components `logging`, `opensearch`, and `events` or `auditing` in the yaml file. In this example, enable `events` as follows:

    ```yaml
    opensearch:
      basicAuth:
        enabled: true
        password: admin
        username: admin
      dashboard:
        enabled: true       # Change "false" to "true".
      enabled: true         # Change "false" to "true".
      externalOpensearchHost: ""
      externalOpensearchPort: ""
      logMaxAge: 7
      opensearchPrefix: whizard 
    ```

    ```yaml
    logging:
      enabled: true   # Change "false" to "true".
      logsidecar:
        enabled: true
        replicas: 2
    ```

    ```yaml
      events:
        enabled: true  # Change "false" to "true".
        ruler:
          enabled: true
          replicas: 2
    ```

3. Execute the following command to start KubeSphere installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable Log Dashboard After KubeSphere Installation

1. Log in to the console as the `admin` user, click **Platform** in the upper left corner, and select **Cluster Management**.

2. Click **CRDs**, enter `clusterconfiguration` in the search bar, and click the search result to view its detailed page.

    {{< notice info >}}
    Custom Resource Definitions (CRDs) allow users to create a new resource type without adding an additional API server. Users can use these custom resources just like other native Kubernetes objects.
    {{</ notice >}}

3. Under **Custom Resources**, click the three dots on the right side of `ks-installer`, select **Edit YAML**.
<img src="/images/docs/v3.x/cluster-administration/logs-dashboard/logs-dashboard-1.png"/>
4. In the YAML file, edit as follows, and then click **OK** to save the configuration.

    ```yaml
    opensearch:
      basicAuth:
        enabled: true
        password: admin
        username: admin
      dashboard:
        enabled: true       # Change "false" to "true".
      enabled: true         # Change "false" to "true".
      externalOpensearchHost: ""
      externalOpensearchPort: ""
      logMaxAge: 7
      opensearchPrefix: whizard 
    ```

    ```yaml
    logging:
      enabled: true   # Change "false" to "true".
      logsidecar:
        enabled: true
        replicas: 2
    ```

    ```yaml
      events:
        enabled: true  # Change "false" to "true".
        ruler:
          enabled: true
          replicas: 2
    ```

5. Check the installation process in kubectl by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}
    You can find the kubectl tool by clicking on the lower-right corner of the console.

<img src="/images/docs/v3.x/cluster-administration/logs-dashboard/logs-dashboard-2.png"/>

    {{</ notice >}}

## Access Log Dashboard

After logging in to the console, expose the 5601 port of the OpenSearch dashboard through NodePort or other forms such as Ingress to an accessible network as below. 

<img src="/images/docs/v3.x/cluster-administration/logs-dashboard/logs-dashboard-3.png"/>