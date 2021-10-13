---
title: "Direct Connection"
keywords: 'Kubernetes, KubeSphere, multicluster, hybrid-cloud, direct-connection'
description: 'Understand the general steps of importing clusters through direct connection.'
titleLink: "Direct Connection"
weight: 5210
---

If the kube-apiserver address of the Member Cluster (M Cluster) is accessible on any node of the Host Cluster (H Cluster), you can adopt **Direction Connection**. This method is applicable when the kube-apiserver address of the M Cluster can be exposed or H Cluster and M Cluster are in the same private network or subnet.

To use the multi-cluster feature using direct connection, you must have at least two clusters serving as the H Cluster and the M Cluster respectively. A cluster can be defined as the H Cluster or the M Cluster either before or after you install KubeSphere. For more information about installing KubeSphere, refer to [Installing on Linux](../../../installing-on-linux/) and [Installing on Kubernetes](../../../installing-on-kubernetes/).

## Video Demonstration

{{< youtube i-yWU4izFPo >}}

## Prepare a Host Cluster

A host cluster provides you with the central control plane and you can only define one host cluster.

{{< tabs >}}

{{< tab "KubeSphere has been installed" >}}

If you already have a standalone KubeSphere cluster installed, you can set the value of  `clusterRole` to `host` by editing the cluster configuration.

- Option A - Use the web console:

  Use the `admin` account to log in to the console and go to **CRDs** on the **Cluster Management** page. Enter the keyword `ClusterConfiguration` and go to its detail page. Edit the YAML of `ks-installer`, which is similar to [Enable Pluggable Components](../../../pluggable-components/).

- Option B - Use Kubectl:

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

In the YAML file of `ks-installer`, navigate to `multicluster`, set the value of `clusterRole` to `host`, then click **Update** (if you use the web console) to make it effective:

```yaml
multicluster:
  clusterRole: host
```

You need to wait for a while so that the change can take effect.

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

You can define a host cluster before you install KubeSphere either on Linux or on an existing Kubernetes cluster. If you want to [install KubeSphere on Linux](../../../installing-on-linux/introduction/multioverview/#1-create-an-example-configuration-file), you use a `config-sample.yaml` file. If you want to [install KubeSphere on an existing Kubernetes cluster](../../../installing-on-kubernetes/introduction/overview/#deploy-kubesphere), you use two YAML files, one of which is `cluster-configuration.yaml`. To set a host cluster, change the value of `clusterRole` to `host` in `config-sample.yaml` or `cluster-configuration.yaml` accordingly before you install KubeSphere.

```yaml
multicluster:
  clusterRole: host
```

{{< notice note >}}

If you install KubeSphere on a single-node cluster ([All-in-One](../../../quick-start/all-in-one-on-linux/)), you do not need to create a `config-sample.yaml` file. In this case, you can set a host cluster after KubeSphere is installed.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

You can use **kubectl** to retrieve the installation logs to verify the status by running the following command. Wait for a while, and you will be able to see the successful log return if the host cluster is ready.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## Prepare a Member Cluster

In order to manage the member cluster from the **host cluster**, you need to make `jwtSecret` the same between them. Therefore, get it first by excuting the following command on the **host cluster**.

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```

The output may look like this:

```yaml
jwtSecret: "gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU"
```

{{< tabs >}}

{{< tab "KubeSphere has been installed" >}}

If you already have a standalone KubeSphere cluster installed, you can set the value of  `clusterRole` to `member` by editing the cluster configuration.

- Option A - Use the web console:

  Use the  `admin` account to log in to the console and go to **CRDs** on the **Cluster Management** page. Enter the keyword `ClusterConfiguration` and go to its detail page. Edit the YAML of `ks-installer`, which is similar to [Enable Pluggable Components](../../../pluggable-components/).

- Option B - Use Kubectl:

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

In the YAML file of `ks-installer`, enter the corresponding `jwtSecret` shown above:

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

Scroll down and set the value of `clusterRole` to `member`, then click **Update** (if you use the web console) to make it effective:

```yaml
multicluster:
  clusterRole: member
```

You need to **wait for a while** so that the change can take effect.

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

You can define a member cluster before you install KubeSphere either on Linux or on an existing Kubernetes cluster. If you want to [install KubeSphere on Linux](../../../installing-on-linux/introduction/multioverview/#1-create-an-example-configuration-file), you use a `config-sample.yaml` file. If you want to [install KubeSphere on an existing Kubernetes cluster](../../../installing-on-kubernetes/introduction/overview/#deploy-kubesphere), you use two YAML files, one of which is `cluster-configuration.yaml`. To set a member cluster, enter the value of `jwtSecret` shown above and change the value of `clusterRole` to `member` in `config-sample.yaml` or `cluster-configuration.yaml` accordingly before you install KubeSphere.

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

```yaml
multicluster:
  clusterRole: member
```

{{< notice note >}}

If you install KubeSphere on a single-node cluster ([All-in-One](../../../quick-start/all-in-one-on-linux/)), you do not need to create a `config-sample.yaml` file. In this case, you can set a member cluster after KubeSphere is installed.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

You can use **kubectl** to retrieve the installation logs to verify the status by running the following command. Wait for a while, and you will be able to see the successful log return if the member cluster is ready.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## Import a Member Cluster

1. Log in to the KubeSphere console as `admin` and click **Add Cluster** on the **Cluster Management** page.

2. Enter the basic information of the cluster to be imported on the **Import Cluster** page. You can also click **Edit Mode** in the top-right corner to view and edit the basic information in YAML format. After you finish editing, click **Next**.

3. In **Connection Method**, select **Direct Connection**, and copy the kubeconfig of the Member Cluster and paste it into the box. You can also click **Edit Mode** in the top-right corner to edit the kubeconfig of the Member Cluster in YAML format.

     {{< notice note >}}

Make sure the `server` address in KubeConfig is accessible on any node of the Host Cluster.

     {{</ notice >}}

1. Click **Create** and wait for cluster initialization to finish.