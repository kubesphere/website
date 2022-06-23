---
title: "Agent Connection"
keywords: 'Kubernetes, KubeSphere, multicluster, agent-connection'
description: 'Understand the general steps of importing clusters through agent connection.'
titleLink: "Agent Connection"
weight: 5220
---

The component [Tower](https://github.com/kubesphere/tower) of KubeSphere is used for agent connection. Tower is a tool for network connection between clusters through the agent. If the host cluster cannot access the member cluster directly, you can expose the proxy service address of the host cluster. This enables the member cluster to connect to the host cluster through the agent. This method is applicable when the member cluster is in a private environment (for example, IDC) and the host cluster is able to expose the proxy service. The agent connection is also applicable when your clusters are distributed across different cloud providers.

To use the multi-cluster feature using an agent, you must have at least two clusters serving as the host cluster and the member cluster respectively. A cluster can be defined as the host cluster or the member cluster either before or after you install KubeSphere. For more information about installing KubeSphere, refer to [Installing on Linux](../../../installing-on-linux/) and [Installing on Kubernetes](../../../installing-on-kubernetes/).

## Video Demonstration

{{< youtube JB_tsALgjaA >}}

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

In the YAML file of `ks-installer`, navigate to `multicluster`, set the value of `clusterRole` to `host`, then click **OK** (if you use the web console) to make it effective:

```yaml
multicluster:
  clusterRole: host
```

To set the host cluster name, add a field `hostClusterName` under `multicluster.clusterRole` in the YAML file of `ks-installer`:

```yaml
multicluster:
  clusterRole: host
  hostClusterName: <Host cluster name>
```

{{< notice note >}}

- It is recommended that you set the host cluster name while you are preparing your host cluster. When your host cluster is set up and running with resources deployed, it is not recommended that you set the host cluster name.
- The host cluster name can contain only lowercase letters, numbers, hyphens (-), or periods (.), and must start and end with a lowercase letter or number.

{{</ notice >}}

You need to wait for a while so that the change can take effect.

{{</ tab >}}

{{< tab "KubeSphere has not been installed" >}}

You can define a host cluster before you install KubeSphere either on Linux or on an existing Kubernetes cluster. If you want to [install KubeSphere on Linux](../../../installing-on-linux/introduction/multioverview/#1-create-an-example-configuration-file), you use a `config-sample.yaml` file. If you want to [install KubeSphere on an existing Kubernetes cluster](../../../installing-on-kubernetes/introduction/overview/#deploy-kubesphere), you use two YAML files, one of which is `cluster-configuration.yaml`.

To set a host cluster, change the value of `clusterRole` to `host` in `config-sample.yaml` or `cluster-configuration.yaml` accordingly before you install KubeSphere.

```yaml
multicluster:
  clusterRole: host
```

To set the host cluster name, add a field `hostClusterName` under `multicluster.clusterRole` in `config-sample.yaml` or `cluster-configuration.yaml`:

```yaml
multicluster:
  clusterRole: host
  hostClusterName: <Host cluster name>
```

{{< notice note >}}

- The host cluster name can contain only lowercase letters, numbers, hyphens (-), or periods (.), and must start and end with a lowercase letter or number.

{{</ notice >}}

{{< notice info >}}

If you install KubeSphere on a single-node cluster ([All-in-One](../../../quick-start/all-in-one-on-linux/)), you do not need to create a `config-sample.yaml` file. In this case, you can set a host cluster after KubeSphere is installed.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

You can use **kubectl** to retrieve the installation logs to verify the status by running the following command. Wait for a while, and you will be able to see the successful log return if the host cluster is ready.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -f
```

## Set the Proxy Service Address

After the installation of the host cluster, a proxy service called `tower` will be created in `kubesphere-system`, whose type is `LoadBalancer`.

{{< tabs >}}

{{< tab "A LoadBalancer available in your cluster" >}}

If a LoadBalancer plugin is available for the cluster, you can see a corresponding address for `EXTERNAL-IP` of tower, which will be acquired by KubeSphere. In this case, the proxy service is set automatically. That means you can skip the step to set the proxy. Execute the following command to verify if you have a LoadBalancer.

```bash
kubectl -n kubesphere-system get svc
```

The output is similar to this:

```shell
NAME       TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)              AGE
tower      LoadBalancer    10.233.63.191   139.198.110.23  8080:30721/TCP       16h
```

{{< notice note >}}

Generally, there is always a LoadBalancer solution in the public cloud, and the external IP can be allocated by the load balancer automatically. If your clusters are running in an on-premises environment, especially a **bare metal environment**, you can use [OpenELB](https://github.com/kubesphere/openelb) as the LB solution.

{{</ notice >}}

{{</ tab >}}

{{< tab "No LoadBalancer available in your cluster" >}}

    ```
1. Run the following command to check the service:

    ```shell
    kubectl -n kubesphere-system get svc
    ```

    In this sample, `NodePort` is `30721`.
    ```
    NAME       TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)              AGE
    tower      LoadBalancer    10.233.63.191   <pending>  8080:30721/TCP            16h
    ```

2. If `EXTERNAL-IP` is `pending`, you need to manually set the proxy address. For example, if your public IP address is `139.198.120.120`, you need to expose port (for example, `8080`) of this public IP address to <NodeIP>:<NodePort>.

3. Add the value of `proxyPublishAddress` to the configuration file of `ks-installer` and provide the public IP address (`139.198.120.120` in this tutorial) and port number as follows.

    - Option A - Use the web console:

      Use the `admin` account to log in to the console and go to **CRDs** on the **Cluster Management** page. Enter the keyword `ClusterConfiguration` and go to its detail page. Edit the YAML of `ks-installer`, which is similar to [Enable Pluggable Components](../../../pluggable-components/).

    - Option B - Use Kubectl:

      ```bash
      kubectl -n kubesphere-system edit clusterconfiguration ks-installer
      ```

    Navigate to `multicluster` and add a new line for `proxyPublishAddress` to define the IP address to access tower.

    ```yaml
    multicluster:
        clusterRole: host
        proxyPublishAddress: http://139.198.120.120:8080 # Add this line to set the address to access tower
    ```

4. Save the configuration and wait for a while, or you can manually restart `ks-apiserver` to make the change effective immediately using the following command.

    ```shell
    kubectl -n kubesphere-system rollout restart deployment ks-apiserver
    ```

{{</ tab >}}

{{</ tabs >}}

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

If you already have a standalone KubeSphere cluster installed, you can set the value of `clusterRole` to `member` by editing the cluster configuration.

- Option A - Use the web console:

  Use the `admin` account to log in to the console and go to **CRDs** on the **Cluster Management** page. Enter the keyword `ClusterConfiguration` and go to its detail page. Edit the YAML of `ks-installer`, which is similar to [Enable Pluggable Components](../../../pluggable-components/).

- Option B - Use Kubectl:

  ```shell
  kubectl edit cc ks-installer -n kubesphere-system
  ```

In the YAML file of `ks-installer`, enter the corresponding `jwtSecret` shown above:

```yaml
authentication:
  jwtSecret: gfIwilcc0WjNGKJ5DLeksf2JKfcLgTZU
```

Scroll down and set the value of `clusterRole` to `member`, then click **OK** (if you use the web console) to make it effective:

```yaml
multicluster:
  clusterRole: member
```

You need to wait for a while so that the change can take effect.

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
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -f
```

## Import a Member Cluster

1. Log in to the KubeSphere console as `admin` and click **Add Cluster** on the **Cluster Management** page.

2. Enter the basic information of the cluster to be imported on the **Import Cluster** page. You can also click **Edit Mode** in the upper-right corner to view and edit the basic information in YAML format. After you finish editing, click **Next**.

3. In **Connection Method**, select **Agent connection** and click **Create**. It will show the YAML configuration file for the agent Deployment generated by the host cluster on the console.

4. Create an `agent.yaml` file on the member cluster based on the instruction, then copy and paste the agent deployment to the file. Execute `kubectl create -f agent.yaml` on the node and wait for the agent to be up and running. Please make sure the proxy address is accessible to the member cluster.

5. You can see the cluster you have imported in the host cluster when the cluster agent is up and running.