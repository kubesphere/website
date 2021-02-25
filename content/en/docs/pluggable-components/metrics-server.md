---
title: "Metrics Server"
keywords: "Kubernetes, KubeSphere, Metrics Server"
description: "How to enable the Metrics Server"
linkTitle: "Metrics Server"
weight: 6910
---

## What is Metrics Server

KubeSphere supports Horizontal Pod Autoscalers (HPA) for [Deployments](../../project-user-guide/application-workloads/deployments/). In KubeSphere, the Metrics Server controls whether the HPA is enabled. You use an HPA object to autoscale a Deployment based on different types of metrics, such as CPU and memory utilization, as well as the minimum and maximum number of replicas. In this way, an HPA helps to make sure your application runs smoothly and consistently in different situations.

## Enable the Metrics Server before Installation

### Installing on Linux

When you use KubeKey to create a configuration file for your cluster, the Metrics Server is enabled by default in the file. Namely, you do not need to manually enable it before you install KubeSphere on Linux.

### **Installing on Kubernetes**

The process of installing KubeSphere on Kubernetes is stated in the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/). To install the optional component Metrics Server, you can enable it first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and open it for editing.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `metrics_server` and enable it by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    metrics_server:
      enabled: true # Change "false" to "true"
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```
    
    {{< notice note >}}
    

If you install KubeSphere on some cloud hosted Kubernetes engines, it is probable that the Metrics Server is already installed in your environment. In this case, it is not recommended that you enable it in `cluster-configuration.yaml` as it may cause conflicts during installation.
    {{</ notice >}} 

## Enable the Metrics Server after Installation

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.
   
    ![clusters-management](/images/docs/enable-pluggable-components/metrics-server/clusters-management.png)
    
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

    ![edit-yaml](/images/docs/enable-pluggable-components/metrics-server/edit-yaml.png)

4. In this YAML file, navigate to `metrics_server` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    metrics_server:
        enabled: true # Change "false" to "true"
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

Execute the following command to verify that the Pod of Metrics Server is up and running.

```bash
kubectl get pod -n kube-system
```

If the Metrics Server is successfully installed, your cluster may return the following output (`metrics-server-5ddd98b7f9-jjdln`):

```bash
NAME                                           READY   STATUS    RESTARTS   AGE
calico-kube-controllers-59d85c5c84-m4blq       1/1     Running   0          28m
calico-node-nqzcp                              1/1     Running   0          28m
coredns-74d59cc5c6-8djtt                       1/1     Running   0          28m
coredns-74d59cc5c6-jv65g                       1/1     Running   0          28m
kube-apiserver-master                          1/1     Running   0          29m
kube-controller-manager-master                 1/1     Running   0          29m
kube-proxy-6qjz7                               1/1     Running   0          28m
kube-scheduler-master                          1/1     Running   0          29m
metrics-server-5ddd98b7f9-jjdln                1/1     Running   0          7m17s
nodelocaldns-8wbfm                             1/1     Running   0          28m
openebs-localpv-provisioner-84956ddb89-dxbnx   1/1     Running   0          28m
openebs-ndm-operator-6896cbf7b8-xwcth          1/1     Running   1          28m
openebs-ndm-pf47z                              1/1     Running   0          28m
snapshot-controller-0                          1/1     Running   0          22m
```