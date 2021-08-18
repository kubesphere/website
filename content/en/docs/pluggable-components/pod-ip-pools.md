---
title: "Pod IP Pools"
keywords: "Kubernetes, KubeSphere, Pod, IP Pools"
description: "Learn how to enable Pod IP Pools to assign a specific Pod IP Pool to your Pods."
linkTitle: "Pod IP Pools"
weight: 6920
---

A Pod IP Pool is used to manage the Pod network address space, and the address space between each Pod IP Pool cannot overlap. When you create a workload, you can select a specific Pod IP Pool, so that created Pods will be assigned IP addresses from this Pod IP Pool.

## Enable Pod IP Pools before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Pod IP Pools in this mode (for example, for testing purposes), refer to [the following section](#enable-pod-ip-pools-after-installation) to see how Pod IP Pools can be installed after installation.
   {{</ notice >}}

2. In this file, navigate to `network.ippool.type` and change `none` to `calico`. Save the file after you finish.

   ```yaml
   network:
     ippool:
       type: calico # Change "none" to "calico".
   ```

3. Create a cluster using the configuration file:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable Pod IP Pools first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `network.ippool.type` and enable it by changing `none` to `calico`. Save the file after you finish.

    ```yaml
    network:
      ippool:
        type: calico # Change "none" to "calico".
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.1.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```


## Enable Pod IP Pools after Installation

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Cluster Management**.

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click <img src="/images/docs/enable-pluggable-components/pod-ip-pools/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `network` and change `network.ippool.type` to `calico`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    network:
      ippool:
        type: calico # Change "none" to "calico".
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/enable-pluggable-components/pod-ip-pools/hammer.png" height="20px"> in the bottom-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

On the **Cluster Management** page, verify that you can see the section **Pod IP Pools** under **Network**.

![pod-ip-pool](/images/docs/enable-pluggable-components/pod-ip-pools/pod-ip-pool.png)



