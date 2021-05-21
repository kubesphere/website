---
title: "KubeEdge"
keywords: "Kubernetes, KubeSphere, Kubeedge"
description: "Learn how to enable KubeEdge to add edge nodes to your cluster."
linkTitle: "KubeEdge"
weight: 6930
---

## What is KubeEdge

[KubeEdge](https://kubeedge.io/en/) is an open-source system for extending native containerized application orchestration capabilities to hosts at edge. It supports multiple edge protocols and looks to provide unified management of cloud and edge applications and resources.

KubeEdge has components running in two separate places - cloud and edge nodes. The components running on the cloud, collectively known as CloudCore, include Controllers and Cloud Hub. Cloud Hub serves as the gateway for the requests sent by edge nodes while Controllers function as orchestrators. The components running on edge nodes, collectively known as EdgeCore, include EdgeHub, EdgeMesh, MetadataManager, and DeviceTwin. For more information, see [the KubeEdge website](https://kubeedge.io/en/).

After you enable KubeEdge, you can [add edge nodes to your cluster](../../installing-on-linux/cluster-operation/add-edge-nodes/) and deploy workloads on them.

![kubeedge_arch](/images/docs/enable-pluggable-components/kubeedge/kubeedge_arch.png)

## Enable KubeEdge before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable KubeEdge in this mode (e.g. for testing purposes), refer to [the following section](#enable-kubeedge-after-installation) to see how KubeEdge can be installed after installation.
   {{</ notice >}}

2. In this file, navigate to `kubeedge.enabled` and change `false` to `true`.

   ```yaml
   kubeedge:
     enabled: true # Change "false" to "true".
   ```

3. Set the value of `kubeedge.cloudCore.cloudHub.advertiseAddress` to the public IP address of your cluster or an IP address that can be accessed by edge nodes. Save the file when you finish editing.

4. Create a cluster using the configuration file:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeEdge first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `kubeedge.enabled` and enable it by setting it to `true`.

    ```yaml
    kubeedge:
      enabled: true # Change "false" to "true".
    ```

3. Set the value of `kubeedge.cloudCore.cloudHub.advertiseAddress` to the public IP address of your cluster or an IP address that can be accessed by edge nodes.

4. Save the file and execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.1.0/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable KubeEdge after Installation

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.
   
4. In this YAML file, navigate to `kubeedge.enabled` and enable it by setting it to `true`.

    ```yaml
    kubeedge:
      enabled: true # Change "false" to "true".
    ```

5. Set the value of `kubeedge.cloudCore.cloudHub.advertiseAddress` to the public IP address of your cluster or an IP address that can be accessed by edge nodes. After you finish, click **Update** in the bottom-right corner to save the configuration.

    {{< notice note >}}

The `kubeedge` section is not included in `cluster-configuration.yaml` if your cluster is upgraded from KubeSphere v3.0.0. For more information, see [how to enable KubeEdge after upgrade](#enable-kubeedge-after-upgrade).

    {{</ notice >}} 

6. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.
    {{</ notice >}}

## Enable KubeEdge after Upgrade

If your KubeSphere v3.1.0 cluster is upgraded from KubeSphere v3.0.0, add the following content in `cluster-configuration.yaml` (i.e. the `clusterconfiguration` CRD) and enable `kubeedge` as shown [in the steps above](#enable-kubeedge-after-installation).

```yaml
  kubeedge:
    enabled: false
    cloudCore:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      cloudhubPort: "10000"
      cloudhubQuicPort: "10001"
      cloudhubHttpsPort: "10002"
      cloudstreamPort: "10003"
      tunnelPort: "10004"
      cloudHub:
        advertiseAddress:
          - ""            
        nodeLimit: "100"
      service:
        cloudhubNodePort: "30000"
        cloudhubQuicNodePort: "30001"
        cloudhubHttpsNodePort: "30002"
        cloudstreamNodePort: "30003"
        tunnelNodePort: "30004"
    edgeWatcher:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      edgeWatcherAgent:
        nodeSelector: {"node-role.kubernetes.io/worker": ""}
        tolerations: []
```

{{< notice warning >}}

Do not add the `kubeedge` section in `cluster-configuration.yaml` before the upgrade.

{{</ notice >}} 

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

On the **Cluster Management** page, verify that the section **Edge Nodes** has appeared under **Node Management**.

![edge-nodes](/images/docs/enable-pluggable-components/kubeedge/edge-nodes.png)

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

## Custom Configurations

After you enable KubeEdge, you can manually create a [ConfigMap](../../project-user-guide/configuration/configmaps/) to customize some configurations, such as the download URL of `keadm` and the version of KubeEdge. Local configurations will be dynamically updated based on the ConfigMap.

Here is an example of the ConfigMap:

```yaml
apiVersion: v1
data:
  region: zh # Download region.
  version: v1.6.1 # The default installed version of KubeEdge.
kind: ConfigMap
metadata:
  name: edge-watcher-config
  namespace: kubeedge
```

{{< notice note >}}

You can specify `zh` or `en` for the field `region`. `zh` is the default value and the default download link is `https://kubeedge.pek3b.qingstor.com/bin/v1.6.1/$arch/keadm-v1.6.1-linux-$arch.tar.gz`. If you set `region` to `en`, the download link will be `https://github.com/kubesphere/kubeedge/releases/download/v1.6.1-kubesphere/keadm-v1.6.1-linux-amd64.tar.gz`.

{{</ notice >}} 