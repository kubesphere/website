---
title: "KubeSphere Service Mesh"
keywords: "Kubernetes, Istio, KubeSphere, service-mesh, microservices"
description: "Learn how to enable KubeSphere Service Mesh to use different traffic management strategies for microservices governance."
linkTitle: "KubeSphere Service Mesh"
weight: 6800
---

On the basis of [Istio](https://istio.io/), KubeSphere Service Mesh visualizes microservices governance and traffic management. It features a powerful toolkit including **circuit breaking, blue-green deployment, canary release, traffic mirroring, distributed tracing, observability, and traffic control**. Developers can easily get started with KubeSphere Service Mesh without any code hacking, with the learning curve of Istio greatly reduced. All features of KubeSphere Service Mesh are designed to meet users' demand for their business.

For more information, see [Grayscale Release](../../project-user-guide/grayscale-release/overview/).

## Enable KubeSphere Service Mesh Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable KubeSphere Service Mesh in this mode (for example, for testing purposes), refer to [the following section](#enable-service-mesh-after-installation) to see how KubeSphere Service Mesh can be installed after installation.
    {{</ notice >}}

2. In this file, navigate to `servicemesh` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    servicemesh:
      enabled: true # Change "false" to "true".
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeSphere Service Mesh first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.2.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.2.0/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `servicemesh` and enable it by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    servicemesh:
      enabled: true # Change "false" to "true".
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.2.0/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable KubeSphere Service Mesh After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click <img src="/images/docs/enable-pluggable-components/kubesphere-service-mesh/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.
   
4. In this YAML file, navigate to `servicemesh` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    servicemesh:
      enabled: true # Change "false" to "true".
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/enable-pluggable-components/kubesphere-service-mesh/hammer.png" height="20px"> in the lower-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

Go to **System Components** and check that all components on the **Istio** tab page is in **Healthy** state.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n istio-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                    READY   STATUS    RESTARTS   AGE
istio-ingressgateway-78dbc5fbfd-f4cwt   1/1     Running   0          9m5s
istiod-1-6-10-7db56f875b-mbj5p          1/1     Running   0          10m
jaeger-collector-76bf54b467-k8blr       1/1     Running   0          6m48s
jaeger-operator-7559f9d455-89hqm        1/1     Running   0          7m
jaeger-query-b478c5655-4lzrn            2/2     Running   0          6m48s
kiali-f9f7d6f9f-gfsfl                   1/1     Running   0          4m1s
kiali-operator-7d5dc9d766-qpkb6         1/1     Running   0          6m53s
```

{{</ tab >}}

{{</ tabs >}}
