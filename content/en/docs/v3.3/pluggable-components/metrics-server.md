---
title: "Metrics Server"
keywords: "Kubernetes, KubeSphere, Metrics Server"
description: "Learn how to enable Metrics Server to use HPA to autoscale a Deployment."
linkTitle: "Metrics Server"
weight: 6910
---

KubeSphere supports Horizontal Pod Autoscalers (HPA) for [Deployments](../../project-user-guide/application-workloads/deployments/). In KubeSphere, the Metrics Server controls whether the HPA is enabled. You use an HPA object to autoscale a Deployment based on different types of metrics, such as CPU and memory utilization, as well as the minimum and maximum number of replicas. In this way, an HPA helps to make sure your application runs smoothly and consistently in different situations.

## Enable the Metrics Server Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

   ```bash
   vi config-sample.yaml
   ```

   {{< notice note >}}
   If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable the Metrics Server in this mode (for example, for testing purposes), refer to [the following section](#enable-devops-after-installation) to see how the Metrics Server can be installed after installation.
   {{</ notice >}}

2. In this file, navigate to `metrics_server` and change `false` to `true` for `enabled`. Save the file after you finish.

   ```yaml
   metrics_server:
     enabled: true # Change "false" to "true".
   ```

3. Create a cluster using the configuration file:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable the Metrics Server first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `metrics_server` and enable it by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    metrics_server:
      enabled: true # Change "false" to "true".
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```
    
    {{< notice note >}}

If you install KubeSphere on some cloud hosted Kubernetes engines, it is probable that the Metrics Server is already installed in your environment. In this case, it is not recommended that you enable it in `cluster-configuration.yaml` as it may cause conflicts during installation.
    {{</ notice >}} 

## Enable the Metrics Server After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/metrics-server/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `metrics_server` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    metrics_server:
      enabled: true # Change "false" to "true".
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/metrics-server/hammer.png" height="20px"> in the lower-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

Execute the following command to verify that the Pod of Metrics Server is up and running.

```bash
kubectl get pod -n kube-system
```

If the Metrics Server is successfully installed, your cluster may return the following output (excluding irrelevant Pods):

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
metrics-server-6c767c9f94-hfsb7             1/1     Running   0          9m38s
```