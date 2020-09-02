---
title: "Direct Connection"
keywords: 'kubernetes, kubesphere, multicluster, hybrid-cloud'
description: 'Overview'


weight: 2340
---

## Prerequisites

You have already installed at least two KubeSphere clusters, please refer to [Installing on Linux](../../../installing-on-linux) or [Installing on Kubernetes](../../../installing-on-kubernetes) if not yet.

{{< notice note >}}
Multi-cluster management requires Kubesphere to be installed on the target clusters. If you have an existing cluster, please install a minimal KubeSphere on it as an agent, see [Installing Minimal KubeSphere on Kubernetes](../../installing-on-kubernetes/minimal-kubesphere-on-k8s) for details.
{{</ notice >}}

## Direct Connection

If the kube-apiserver address of Member Cluster (hereafter referred to as **M** Cluster) is accessible on any node of the Host Cluster (hereafter referred to as **H** Cluster), you can adopt **Direction Connection**. This method is applicable when the kube-apiserver address of M Cluster can be exposed or H Cluster and M Cluster are in the same private network or subnet.

### Prepare a Host Cluster

{{< tabs >}}

{{< tab "KubeSphere has been installed" >}}

If you already have a standalone KubeSphere installed, you can change the `clusterRole` to a host cluster by editing the cluster configuration and **wait for a while**.

- Option A - Use Web Console:

Use `cluster-admin` account to enter **Cluster Management → CRDs**, search for the keyword `ClusterConfiguration` and enter its detailed page, edit the YAML of `ks-installer`. This is similar to Enable Pluggable Components.

- Option B - Use Kubectl:

```shell
kubectl edit cc ks-installer -n kubesphere-system
```

Scroll down and change the value of `clusterRole` to `host`, then click **Update** to make it effective:

```yaml
multicluster:
  clusterRole: host
```

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

There is no big difference if you just start the installation. Please note that the `clusterRole` in `config-sample.yaml` or `cluster-configuration.yaml` has to be set like following:

```yaml
multicluster:
  clusterRole: host
```

{{</ tab >}}

{{</ tabs >}}

Then you can use the **kubectl** to retrieve the installation logs to verify the status. Wait for a while, you will be able to see the successful logs return if the host cluster is ready.

```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

### Prepare a Member Cluster

In order to manage the member cluster within the host cluster, we need to make the jwtSecret same between them. So first you need to get it from the host by the following command.

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```

```yaml
jwtSecret: "gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU"
```

{{< tabs >}}

{{< tab "KubeSphere has been installed" >}}

If you already have a standalone KubeSphere installed, you can change the `clusterRole` to a host cluster by editing the cluster configuration and **wait for a while**.

- Option A - Use Web Console:

Use `cluster-admin` account to enter **Cluster Management → CRDs**, search for the keyword `ClusterConfiguration` and enter its detailed page, edit the YAML of `ks-installer`. This is similar to Enable Pluggable Components.

- Option B - Use Kubectl:

```shell
kubectl edit cc ks-installer -n kubesphere-system
```

Then input the corresponding jwtSecret shown above:

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

Then scroll down and change the value of `clusterRole` to `member`, then click **Update** to make it effective:

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

There is no big difference if you just start the installation. Please fill in the `jwtSecret` with the value shown as above in `config-sample.yaml` or `cluster-configuration.yaml`:

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

Then scroll down and change the `clusterRole` to `member`:

```
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{</ tabs >}}

Then you can use the **kubectl** to retrieve the installation logs to verify the status. Wait for a while, you will be able to see the successful logs return if the host cluster is ready.

```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

### Import Cluster

1. Open the H Cluster Dashboard and click **Add Cluster**.

![Add Cluster](https://ap3.qingstor.com/kubesphere-website/docs/20200827231611.png)

2. Enter the basic information of the cluster and click **Next**.

![Import Cluster](https://ap3.qingstor.com/kubesphere-website/docs/20200827211842.png)

3. In **Connection Method**, select **Direct Connection to Kubernetes cluster**.  

4. [Retrieve the KubeConfig](../retrieve-kubeconfig), then copy the KubeConfig of the Member Cluster and paste it into the box.

{{< notice tip >}}
Please make sure the `server` address in KubeConfig is accessible on any node of the H Cluster. For `KubeSphere API Server` address, you can fill in the KubeSphere APIServer address or leave it blank.
{{</ notice >}}

![import a cluster - direct connection](/images/docs/direct_import_en.png)

5. Click **Import** and wait for cluster initialization to finish.

![Azure AKS](https://ap3.qingstor.com/kubesphere-website/docs/20200827231650.png)
