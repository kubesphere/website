---
title: "Agent Connection"
keywords: 'Kubernetes, KubeSphere, multicluster, agent-connection'
description: 'Overview'

weight: 3013
---

## Prerequisites

You have already installed at least two KubeSphere clusters. Please refer to [Installing on Linux](../../../installing-on-linux) or [Installing on Kubernetes](../../../installing-on-kubernetes) if they are not ready yet.

{{< notice note >}}
Multi-cluster management requires Kubesphere to be installed on the target clusters. If you have an existing cluster, you can deploy KubeSphere on it with a minimal installation so that it can be imported. See [Minimal KubeSphere on Kubernetes](../../../quick-start/minimal-kubesphere-on-k8s/) for details.
{{</ notice >}}

## Agent Connection

The component [Tower](https://github.com/kubesphere/tower) of KubeSphere is used for agent connection. Tower is a tool for network connection between clusters through the agent. If the H Cluster cannot access the M Cluster directly, you can expose the proxy service address of the H cluster. This enables the M Cluster to connect to the H cluster through the agent. This method is applicable when the M Cluster is in a private environment (e.g. IDC) and the H Cluster is able to expose the proxy service. The agent connection is also applicable when your clusters are distributed across different cloud providers.

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

There is no big difference if you define a host cluster before installation. Please note that the `clusterRole` in `config-sample.yaml` or `cluster-configuration.yaml` has to be set as follows:

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

#### Set Proxy Service Address

After the installation of the Host Cluster, a proxy service called tower will be created in `kubesphere-system`, whose type is **LoadBalancer**.

{{< tabs >}}

{{< tab "There is a LoadBalancer in your cluster" >}}

If a LoadBalancer plugin is available for the cluster, you can see a corresponding address for `EXTERNAL-IP`, which will be acquired by KubeSphere automatically. That means we can skip the step to set the proxy.

```shell
$ kubectl -n kubesphere-system get svc
NAME       TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)              AGE
tower      LoadBalancer    10.233.63.191   139.198.110.23  8080:30721/TCP       16h
```

> Generally, there is always a LoadBalancer solution in the public cloud, and the external IP should be allocated by Load Balancer automatically. If your clusters are running in an on-premises environment (Especially for the **bare metal environment**), we recommend you to use [Porter](https://github.com/porter/porter) as the LB solution.

{{</ tab >}}

{{< tab "There is not a LoadBalancer in your cluster" >}}

1. If you cannot see a corresponding address displayed (the EXTERNAL-IP is pending), you need to manually set the proxy address. For example, you have an available public IP address `139.198.120.120`. And the port `8080` of this IP address has been forwarded to the port `30721` of the cluster.

```shell
kubectl -n kubesphere-system get svc
```

```
NAME       TYPE            CLUSTER-IP      EXTERNAL-IP     PORT(S)              AGE
tower      LoadBalancer    10.233.63.191   <pending>  8080:30721/TCP       16h
```

2. Change the ConfigMap of the ks-installer and input the the address you set before. You can also edit the ConfigMap from **Configuration → ConfigMaps**, search for the keyword `kubesphere-config`, then edit its YAML and add the following configuration:

```bash
kubectl -n kubesphere-system edit cm kubesphere-config
```

```
multicluster:
    clusterRole: host
    proxyPublishAddress: http://139.198.120.120:8080 # Add this line to set the address to access tower
```

3. Save and update the ConfigMap, then restart the Deployment `ks-apiserver`.

```shell
kubectl -n kubesphere-system rollout restart deployment ks-apiserver
```

{{</ tab >}}

{{</ tabs >}}


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

```yaml
multicluster:
  clusterRole: member
```

{{</ tab >}}

{{</ tabs >}}


### Import Cluster

1. Open the H Cluster Dashboard and click **Add Cluster**.

![Add Cluster](https://ap3.qingstor.com/kubesphere-website/docs/20200827231611.png)

2. Enter the basic information of the imported cluster and click **Next**.

![Import Cluster](https://ap3.qingstor.com/kubesphere-website/docs/20200827211842.png)

3. In **Connection Method**, select **Cluster connection agent** and Click **Import**.

![agent-en](/images/docs/agent-en.png)

4. Create an `agent.yaml` file in the M Cluster based on the instruction, then copy and paste the deployment to the file. Execute `kubectl create -f agent.yaml` on the node and wait for the agent to be up and running. Please make sure the proxy address is accessible to the M Cluster.

5. You can see the cluster you have imported in the H Cluster when the cluster agent is up and running.

![Azure AKS](https://ap3.qingstor.com/kubesphere-website/docs/20200827231650.png)
