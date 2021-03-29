---
title: "Service Topology"
keywords: "Kubernetes, KubeSphere, Services, Topology"
description: "Learn how to enable Service Topology to view contextual details of your Pods based on Weave Scope."
linkTitle: "Service Topology"
weight: 6915
---

## What is Service Topology

You can enable Service Topology to integrate [Weave Scope](https://www.weave.works/oss/scope/), a visualization and monitoring tool for Docker and Kubernetes. Weave Scope uses established APIs to collect information to build a topology of your applications and containers. The Service topology displays in your project, providing you with visual representations of connections based on traffic.

## Enable Service Topology before Installation

### Installing on Linux



### **Installing on Kubernetes**

The process of installing KubeSphere on Kubernetes is stated in the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/). To install the optional component Service Topology, you can enable it first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and open it for editing.

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
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```
    

## Enable Service Topology after Installation

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `network` and change `network.topology.type` to `weave-scope`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    network:
      topology:
        type: weave-scope # Change "none" to "weave-scope".
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

Go to one of your project, navigate to **Services** under **Application Workloads**, and you can see a topology of your **Services** on the **Topology** tab.

![topology](/images/docs/enable-pluggable-components/service-topology/topology.png)

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n weave
```

The output may look as follows if the component runs successfully:

```yaml
NAME                                        READY   STATUS    RESTARTS   AGE
weave-scope-agent-48cjp                     1/1     Running   0          3m1s
weave-scope-agent-9jb4g                     1/1     Running   0          3m1s
weave-scope-agent-ql5cf                     1/1     Running   0          3m1s
weave-scope-app-5b76897b6f-8bsls            1/1     Running   0          3m1s
weave-scope-cluster-agent-8d9b8c464-5zlpp   1/1     Running   0          3m1s
```

{{</ tab >}}

{{</ tabs >}}