---
title: "KubeEdge"
keywords: "Kubernetes, KubeSphere, Kubeedge"
description: "Learn how to enable KubeEdge to add edge nodes to your cluster."
linkTitle: "KubeEdge"
weight: 6930
---

[KubeEdge](https://kubeedge.io/en/) is an open-source system for extending native containerized application orchestration capabilities to hosts at edge. It supports multiple edge protocols and looks to provide unified management of cloud and edge applications and resources.

KubeEdge has components running in two separate places - cloud and edge nodes. The components running on the cloud, collectively known as CloudCore, include Controllers and Cloud Hub. Cloud Hub serves as the gateway for the requests sent by edge nodes while Controllers function as orchestrators. The components running on edge nodes, collectively known as EdgeCore, include EdgeHub, EdgeMesh, MetadataManager, and DeviceTwin. For more information, see [the KubeEdge website](https://kubeedge.io/en/).

After you enable KubeEdge, you can [add edge nodes to your cluster](../../installing-on-linux/cluster-operation/add-edge-nodes/) and deploy workloads on them.

![kubeedge_arch](/images/docs/v3.3/enable-pluggable-components/kubeedge/kubeedge_arch.png)

## Enable KubeEdge Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable KubeEdge in this mode (for example, for testing purposes), refer to [the following section](#enable-kubeedge-after-installation) to see how KubeEdge can be installed after installation.
   {{</ notice >}}

2. In this file, navigate to `edgeruntime` and `kubeedge`, and change the value of `enabled` from `false` to `true` to enable all KubeEdge components. Click **OK**.

   ```yaml
   edgeruntime:          # Add edge nodes to your cluster and deploy workloads on edge nodes.
    enabled: false
    kubeedge:        # kubeedge configurations
      enabled: false
      cloudCore:
        cloudHub:
          advertiseAddress: # At least a public IP address or an IP address which can be accessed by edge nodes must be provided.
            - ""            # Note that once KubeEdge is enabled, CloudCore will malfunction if the address is not provided.
        service:
          cloudhubNodePort: "30000"
          cloudhubQuicNodePort: "30001"
          cloudhubHttpsNodePort: "30002"
          cloudstreamNodePort: "30003"
          tunnelNodePort: "30004"
        # resources: {}
        # hostNetWork: false
   ```

3. Set the value of `kubeedge.cloudCore.cloudHub.advertiseAddress` to the public IP address of your cluster or an IP address that can be accessed by edge nodes. Save the file when you finish editing.

4. Create a cluster using the configuration file:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeEdge first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `edgeruntime` and `kubeedge`, and change the value of `enabled` from `false` to `true` to enable all KubeEdge components. Click **OK**.

    ```yaml
   edgeruntime:          # Add edge nodes to your cluster and deploy workloads on edge nodes.
    enabled: false
    kubeedge:        # kubeedge configurations
      enabled: false
      cloudCore:
        cloudHub:
          advertiseAddress: # At least a public IP address or an IP address which can be accessed by edge nodes must be provided.
            - ""            # Note that once KubeEdge is enabled, CloudCore will malfunction if the address is not provided.
        service:
          cloudhubNodePort: "30000"
          cloudhubQuicNodePort: "30001"
          cloudhubHttpsNodePort: "30002"
          cloudstreamNodePort: "30003"
          tunnelNodePort: "30004"
        # resources: {}
        # hostNetWork: false
    ```

3. Set the value of `kubeedge.cloudCore.cloudHub.advertiseAddress` to the public IP address of your cluster or an IP address that can be accessed by edge nodes.

4. Save the file and execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable KubeEdge After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/kubeedge/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.
   
4. In this YAML file, navigate to `edgeruntime` and `kubeedge`, and change the value of `enabled` from `false` to `true` to enable all KubeEdge components. Click **OK**.

    ```yaml
   edgeruntime:          # Add edge nodes to your cluster and deploy workloads on edge nodes.
    enabled: false
    kubeedge:        # kubeedge configurations
      enabled: false
      cloudCore:
        cloudHub:
          advertiseAddress: # At least a public IP address or an IP address which can be accessed by edge nodes must be provided.
            - ""            # Note that once KubeEdge is enabled, CloudCore will malfunction if the address is not provided.
        service:
          cloudhubNodePort: "30000"
          cloudhubQuicNodePort: "30001"
          cloudhubHttpsNodePort: "30002"
          cloudstreamNodePort: "30003"
          tunnelNodePort: "30004"
        # resources: {}
        # hostNetWork: false
    ```

5. Set the value of `kubeedge.cloudCore.cloudHub.advertiseAddress` to the public IP address of your cluster or an IP address that can be accessed by edge nodes. After you finish, click **OK** in the lower-right corner to save the configuration.

6. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/kubeedge/hammer.png" height="20px"> in the lower-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

On the **Cluster Management** page, verify that the **Edge Nodes** module has appeared under **Nodes**.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n kubeedge
```

The output may look as follows if the component runs successfully:

```bash
NAME                                              READY   STATUS    RESTARTS   AGE
cloudcore-5f994c9dfd-r4gpq                        1/1     Running   0          5h13m
edge-watcher-controller-manager-bdfb8bdb5-xqfbk   2/2     Running   0          5h13m
iptables-hphgf                                    1/1     Running   0          5h13m
```

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

CloudCore may malfunction (`CrashLoopBackOff`) if `kubeedge.cloudCore.cloudHub.advertiseAddress` was not set when you enabled KubeEdge. In this case, run `kubectl -n kubeedge edit cm cloudcore` to add the public IP address of your cluster or an IP address that can be accessed by edge nodes.

{{</ notice >}} 
