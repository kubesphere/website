---
title: "KubeSphere Service Mesh"
keywords: "Kubernetes, istio, KubeSphere, service-mesh, microservices"
description: "How to Enable KubeSphere Service Mesh"

linkTitle: "KubeSphere Service Mesh"
weight: 3540
---

## What is KubeSphere Service Mesh

On the basis of [Istio](https://istio.io/), KubeSphere Service Mesh visualizes microservices governance and traffic management. It features a powerful toolkit including **circuit breaking, blue-green deployment, canary release, traffic mirroring, distributed tracing, observability and traffic control**. Developers can easily get started with Service Mesh without any code hacking, with the learning curve of Istio greatly reduced. All features of KubeSphere Service Mesh are designed to meet users' demand for their business.

For more information, see related sections in Project Administration and Usage.

## Enable Service Mesh before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Service Mesh in this mode (e.g. for testing purpose), refer to the following section to see how Service Mesh can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `servicemesh` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
servicemesh:
    enabled: true # Change "false" to "true"
```

3. Create a cluster using the configuration file:

```bash
./kk create cluster -f config-sample.yaml
```

### **Installing on Kubernetes**

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml) for cluster setting. If you want to install Service Mesh, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/kubesphere-installer.yaml). After that, to enable Service Mesh, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `servicemesh` and enable Service Mesh by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
servicemesh:
    enabled: true # Change "false" to "true"
```

4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

## Enable Service Mesh after Installation

1. Log in the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `servicemesh` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

```bash
servicemesh:
    enabled: true # Change "false" to "true"
```

5. You can use the web kubectl to check the installation process by executing the following command:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.

{{</ notice >}}

## Verify the Installation of Component

{{< tabs >}}

{{< tab "Verify the Component in Dashboard" >}}

Go to **Components** and check the status of Istio. You may see an image as follows:

![Istio](https://ap3.qingstor.com/kubesphere-website/docs/20200829130918.png)

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

```bash
kubectl get pod -n istio-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                     READY   STATUS      RESTARTS   AGE
istio-citadel-7f676f76d7-n2rsr           1/1     Running     0          1h29m
istio-galley-78688b475c-kvkbx            1/1     Running     0          1h29m
istio-ingressgateway-8569f8dcb-rmvl5     1/1     Running     0          1h29m
istio-init-crd-10-1.4.8-fpvwg            0/1     Completed   0          1h43m
istio-init-crd-11-1.4.8-5rc4g            0/1     Completed   0          1h43m
istio-init-crd-12-1.4.8-62zmp            0/1     Completed   0          1h43m
istio-init-crd-14-1.4.8-ngq4d            0/1     Completed   0          1h43m
istio-pilot-67fd55d974-g5bn2             2/2     Running     4          1h29m
istio-policy-668894cffc-8tpt4            2/2     Running     7          1h29m
istio-sidecar-injector-9c4d79658-g7fzf   1/1     Running     0          1h29m
istio-telemetry-57fc886bf8-kx5rj         2/2     Running     7          1h29m
jaeger-collector-76bf54b467-2fh2v        1/1     Running     0          1h17m
jaeger-operator-7559f9d455-k26xz         1/1     Running     0          1h29m
jaeger-query-b478c5655-s57k8             2/2     Running     0          1h17m
```

{{</ tab >}}

{{</ tabs >}}
