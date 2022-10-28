---
title: "Service Topology"
keywords: "Kubernetes, KubeSphere, Services, Topology"
description: "Learn how to enable Service Topology to view contextual details of your Pods based on Weave Scope."
linkTitle: "Service Topology"
weight: 6915
---

You can enable Service Topology to integrate [Weave Scope](https://www.weave.works/oss/scope/), a visualization and monitoring tool for Docker and Kubernetes. Weave Scope uses established APIs to collect information to build a topology of your apps and containers. The Service topology displays in your project, providing you with visual representations of connections based on traffic.

## Enable Service Topology Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Service Topology in this mode (for example, for testing purposes), refer to [the following section](#enable-service-topology-after-installation) to see how Service Topology can be installed after installation.
   {{</ notice >}}

2. In this file, navigate to `network.topology.type` and change `none` to `weave-scope`. Save the file after you finish.

   ```yaml
   network:
     topology:
       type: weave-scope # Change "none" to "weave-scope".
   ```

3. Create a cluster using the configuration file:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable Service Topology first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `network.topology.type` and enable it by changing `none` to `weave-scope`. Save the file after you finish.

    ```yaml
    network:
      topology:
        type: weave-scope # Change "none" to "weave-scope".
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```


## Enable Service Topology After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/service-topology/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `network` and change `network.topology.type` to `weave-scope`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    network:
      topology:
        type: weave-scope # Change "none" to "weave-scope".
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/service-topology/hammer.png" height="20px"> in the lower-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

Go to one of your project, navigate to **Services** under **Application Workloads**, and you can see a topology of your Services on the **Service Topology** tab page.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n weave
```

The output may look as follows if the component runs successfully:

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
weave-scope-agent-48cjp                     1/1     Running   0          3m1s
weave-scope-agent-9jb4g                     1/1     Running   0          3m1s
weave-scope-agent-ql5cf                     1/1     Running   0          3m1s
weave-scope-app-5b76897b6f-8bsls            1/1     Running   0          3m1s
weave-scope-cluster-agent-8d9b8c464-5zlpp   1/1     Running   0          3m1s
```

{{</ tab >}}

{{</ tabs >}}