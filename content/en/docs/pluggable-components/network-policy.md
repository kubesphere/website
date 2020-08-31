---
title: "Network Policy"
keywords: "Kubernetes, KubeSphere, NetworkPolicy"
description: "How to Enable Network Policy"

linkTitle: "Network Policy"
weight: 3547
---

## What is Network Policy

Starting from v3.0.0, users can configure network policies of native Kubernetes in KubeSphere. Network Policies are an application-centric construct, enabling you to specify how a pod is allowed to communicate with various network entities over the network. With network policies, users can achieve network isolation within the same cluster, which means firewalls can be set up between certain instances (pods).

{{< notice note >}}

Please make sure that the CNI network plugin used by the cluster supports Network Policies before you enable it. There are a number of CNI network plugins that support Network Policies, including Calico, Cilium, Kube-router, Romana and Weave Net.

{{</ notice >}} 

For more information, see [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/).

## Enable Network Policy before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere-v3.netlify.app/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere-v3.netlify.app/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Network Policy in this mode (e.g. for testing purpose), refer to the following section to see how Network Policy can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `networkpolicy` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
networkpolicy:
    enabled: true # Change "false" to "true"
```

3. Create a cluster using the configuration file:

```bash
./kk create cluster -f config-sample.yaml
```

### **Installing on Kubernetes**

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) for cluster setting. If you want to install Network Policy, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](https://kubesphere-v3.netlify.app/docs/installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml). After that, to enable Network Policy, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `networkpolicy` and enable Network Policy by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
networkpolicy:
    enabled: true # Change "false" to "true"
```

4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

## Enable Network Policy after Installation

1. Log in the console as `admin`. Click **Platform** at the top left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `networkpolicy` and change `false` to `true` for `enabled`. After you finish, click **Update** at the bottom right corner to save the configuration.

```bash
networkpolicy:
    enabled: true # Change "false" to "true"
```

5. You can use the web kubectl to check the installation process by executing the following command:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

You can find the web kubectl tool by clicking the hammer icon at the bottom right corner of the console.

{{</ notice >}}

## Verify the Installation of Component

If you can see **Network Policies** in **Network** as the image below, it means the installation succeeds as this part won't display until you install the component.

![networkpolicy](https://ap3.qingstor.com/kubesphere-website/docs/20200831162836.png)