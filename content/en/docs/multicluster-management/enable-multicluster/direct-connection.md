---
title: "Direct Connection"
keywords: 'Kubernetes, KubeSphere, multicluster, hybrid-cloud, direct-connection'
description: 'Overview'

weight: 5210
---

## Prerequisites

You have already installed at least two KubeSphere clusters. Please refer to [Installing on Linux](../../../installing-on-linux) or [Installing on Kubernetes](../../../installing-on-kubernetes) if they are not ready yet.

{{< notice note >}}
Multi-cluster management requires Kubesphere to be installed on the target clusters. If you have an existing cluster, you can deploy KubeSphere on it with a minimal installation so that it can be imported. See [Minimal KubeSphere on Kubernetes](../../../quick-start/minimal-kubesphere-on-k8s/) for details.
{{</ notice >}}

## Direct Connection

If the kube-apiserver address of Member Cluster (hereafter referred to as **M** Cluster) is accessible on any node of the Host Cluster (hereafter referred to as **H** Cluster), you can adopt **Direction Connection**. This method is applicable when the kube-apiserver address of M Cluster can be exposed or H Cluster and M Cluster are in the same private network or subnet.

### Prepare a Host Cluster

{{< tabs >}}

{{< tab "KubeSphere has been installed" >}}

If you already have a standalone KubeSphere installed, you can set the value of  `clusterRole` to `host` by editing the cluster configuration. You need to **wait for a while** so that the change can take effect.

- Option A - Use Web Console:

  Use `admin` account to log in the console and go to **CRDs** on the **Cluster Management** page. Enter the keyword `ClusterConfiguration` and go to its detail page. Edit the YAML of `ks-installer`, which is similar to [Enable Pluggable Components](../../../pluggable-components/).

- Option B - Use Kubectl:

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

Scroll down and set the value of `clusterRole` to `host`, then click **Update** (if you use the web console) to make it effective:

```yaml
multicluster:
  clusterRole: host
```

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

There is no big difference than installing a standalone KubeSphere if you define a host cluster before installation. Please note that the `clusterRole` in `config-sample.yaml` or `cluster-configuration.yaml` has to be set as follows:

```yaml
multicluster:
  clusterRole: host
```

{{</ tab >}}

{{</ tabs >}}

You can use **kubectl** to retrieve the installation logs to verify the status by running the following command. Wait for a while, and you will be able to see the successful log return if the host cluster is ready.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

### Prepare a Member Cluster
  
In order to manage the member cluster within the **host cluster**, you need to make `jwtSecret` the same between them. Therefore, you need to get it first by excuting the following command on the **host cluster** .

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```

The output may look like this:

```yaml
jwtSecret: "gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU"
```

{{< tabs >}}

{{< tab "KubeSphere has been installed" >}}

If you already have a standalone KubeSphere installed, you can set the value of  `clusterRole` to `member` by editing the cluster configuration. You need to **wait for a while** so that the change can take effect.

- Option A - Use Web Console:

  Use `admin` account to log in the console and go to **CRDs** on the **Cluster Management** page. Enter the keyword `ClusterConfiguration` and go to its detail page. Edit the YAML of `ks-installer`, which is similar to [Enable Pluggable Components](../../../pluggable-components/).

- Option B - Use Kubectl:

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

Input the corresponding `jwtSecret` shown above:

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

Scroll down and set the value of `clusterRole` to `member`, then click **Update** (if you use the web console) to make it effective:

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

There is no big difference than installing a standalone KubeSphere if you define a member cluster before installation. Please note that the `clusterRole` in `config-sample.yaml` or `cluster-configuration.yaml` has to be set as follows:

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

Scroll down and set the value of `clusterRole` to `member`:

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{</ tabs >}}

You can use **kubectl** to retrieve the installation logs to verify the status by running the following command. Wait for a while, and you will be able to see the successful log return if the member cluster is ready.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

### Import Cluster

1. Open the H Cluster dashboard and click **Add Cluster**.
  ![Add Cluster](https://ap3.qingstor.com/kubesphere-website/docs/20200827231611.png)

2. Enter the basic information of the cluster to be imported and click **Next**.
  ![Import Cluster](https://ap3.qingstor.com/kubesphere-website/docs/20200827211842.png)

3. In **Connection Method**, select **Direct Connection to Kubernetes cluster**.  

4. [Retrieve the KubeConfig](../retrieve-kubeconfig), copy the KubeConfig of the Member Cluster and paste it into the box.
  {{< notice tip >}}
  Please make sure the `server` address in KubeConfig is accessible on any node of the H Cluster.
  {{</ notice >}}
  ![import a cluster - direct connection](/images/docs/direct_import_en.png)

5. Click **Import** and wait for cluster initialization to finish.
  ![Azure AKS](https://ap3.qingstor.com/kubesphere-website/docs/20200827231650.png)
