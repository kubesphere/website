---
title: "Deploy KubeSphere on QingCloud Instances"
keywords: "KubeSphere, Installation, HA, High-availability, LoadBalancer"
description: "Learn how to create a high-availability cluster on QingCloud platform."
linkTitle: "Deploy KubeSphere on QingCloud Instances"
Weight: 3420
---

## Introduction

For a production environment, you need to consider the high availability of the cluster. If key components (for example, kube-apiserver, kube-scheduler, and kube-controller-manager) are all running on the same control plane node, Kubernetes and KubeSphere will be unavailable once the control plane node goes down. Therefore, you need to set up a high-availability cluster by provisioning load balancers with multiple control plane nodes. You can use any cloud load balancer, or any hardware load balancer (for example, F5). In addition, Keepalived and [HAproxy](https://www.haproxy.com/), or Nginx is also an alternative for creating high-availability clusters.

This tutorial walks you through an example of how to create two [QingCloud load balancers](https://docs.qingcloud.com/product/network/loadbalancer), serving as the internal load balancer and external load balancer respectively, and of how to implement high availability of control plane and etcd nodes using the load balancers.

## Prerequisites

- Make sure you already know how to install KubeSphere on a multi-node cluster by following the [guide](../../../installing-on-linux/introduction/multioverview/). For detailed information about the configuration file that is used for installation, see [Edit the configuration file](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file). This tutorial focuses more on how to configure load balancers.
- You need a [QingCloud](https://console.qingcloud.com/login) account to create load balancers, or follow the guide of any other cloud provider to create load balancers.
- For a production environment, it is recommended that you prepare persistent storage and create a StorageClass in advance. For development and testing, you can use the integrated OpenEBS to provision LocalPV as the storage service directly.

## Architecture

This example prepares six machines of **Ubuntu 16.04.6**. You will create two load balancers, and deploy three control plane nodes and etcd nodes on three of the machines. You can configure these control plane and etcd nodes in `config-sample.yaml` created by KubeKey (Please note that this is the default name, which can be changed by yourself).

![ha-architecture](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/ha-architecture.png)

{{< notice note >}}

The Kubernetes document [Options for Highly Available topology](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/) demonstrates that there are two options for configuring the topology of a highly available (HA) Kubernetes cluster, i.e. stacked etcd topology and external etcd topology. You should carefully consider the advantages and disadvantages of each topology before setting up an HA cluster according to [this document](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/). This tutorial adopts stacked etcd topology to bootstrap an HA cluster for demonstration purposes.

{{</ notice >}}

## Install an HA Cluster

### Step 1: Create load balancers

This step demonstrates how to create load balancers on the QingCloud platform.

#### Create an internal load balancer

1. Log in to the [QingCloud console](https://console.qingcloud.com/login). In the menu on the left, under **Network & CDN**, select **Load Balancers**. Click **Create** to create a load balancer.

   ![create-lb](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/create-lb.png)

2. In the pop-up window, set a name for the load balancer. Choose the VxNet where your machines are created from the **Network** drop-down list. Here is `pn`. Other fields can be default values as shown below. Click **Submit** to finish.

   ![qingcloud-lb](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/qingcloud-lb.png)

3. Click the load balancer. On the detail page, create a listener that listens on port `6443` with the **Listener Protocol** set to `TCP`.

   ![listener](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/listener.png)

   - **Name**: Define a name for this Listener
   - **Listener Protocol**: Select `TCP` protocol
   - **Port**: `6443`
   - **Balance mode**: `Poll`

   Click **Submit** to continue.

   {{< notice note >}}
   
   After you create the listener, check the firewall rules of the load balancer. Make sure that port `6443` has been added to the firewall rules and that external traffic is allowed to port `6443`. Otherwise, the installation will fail. You can find the information in **Security Groups** under **Security** on the QingCloud platform.
   
   {{</ notice >}}

4. Click **Add Backend**, and choose the VxNet you just selected (in this example, it is `pn`). Click **Advanced Search**, choose the three control plane nodes, and set the port to `6443` which is the default secure port of api-server.

   ![3-master](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/3-master.png)

   Click **Submit** when you finish.

5. Click  **Apply Changes** to use the configurations. At this point, you can find the three control plane nodes have been added as the backend servers of the listener that is behind the internal load balancer.

   {{< notice note >}}
   
   The status of all control plane nodes might show **Not Available** after you added them as backends. This is normal since port `6443` of api-server is not active on control plane nodes yet. The status will change to **Active** and the port of api-server will be exposed after the installation finishes, which means the internal load balancer you configured works as expected.
   
   {{</ notice >}}
   
   ![apply-change](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/apply-change.png)
   
   Record the Intranet VIP shown under **Networks**. The IP address will be added later to the configuration file.

#### Create an external load balancer

You need to create an EIP in advance. To create an EIP, go to **Elastic IPs** under **Networks & CDN**.

{{< notice note >}}

Two elastic IPs are needed for this tutorial, one for the VPC network and the other for the external load balancer created in this step. You cannot associate the same EIP to the VPC network and the load balancer at the same time.

{{</ notice >}}

1. Similarly, create an external load balancer while don't select VxNet for the **Network** field. Bind the EIP that you created to this load balancer by clicking **Add IPv4**.

   ![bind-eip](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/bind-eip.png)

2. On the load balancer's detail page, create a listener that listens on port `30880` (NodePort of KubeSphere console) with **Listener Protocol** set to `HTTP`.

   {{< notice note >}}

   After you create the listener, check the firewall rules of the load balancer. Make sure that port `30880` has been added to the firewall rules and that external traffic is allowed to port `30880`. Otherwise, the installation will fail. You can find the information in **Security Groups** under **Security** on the QingCloud platform.

   {{</ notice >}}

   ![listener2](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/listener2.png)

3. Click **Add Backend**. In **Advanced Search**, choose the `six` machines on which you are going to install KubeSphere within the VxNet `pn`, and set the port to `30880`.

   ![six-instances](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/six-instances.png)

   Click **Submit** when you finish.

4. Click **Apply Changes** to use the configurations. At this point, you can find the six machines have been added as the backend servers of the listener that is behind the external load balancer.

### Step 2: Download KubeKey

[Kubekey](https://github.com/kubesphere/kubekey) is the next-gen installer which provides an easy, fast and flexible way to install Kubernetes and KubeSphere.

Follow the step below to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.2.2) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

Create an example configuration file with default configurations. Here Kubernetes v1.22.10 is used as an example.

```bash
./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10
```

{{< notice note >}}

- Recommended Kubernetes versions for KubeSphere 3.3.0: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../../installing-on-linux/introduction/kubekey/#support-matrix).

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}}

### Step 3: Set cluster nodes

As you adopt the HA topology with stacked control plane nodes, the control plane nodes and etcd nodes are on the same three machines.

| **Property** | **Description**                   |
| :----------- | :-------------------------------- |
| `hosts`      | Detailed information of all nodes |
| `etcd`       | etcd node names                   |
| `control-plane`     | Control plane node names                 |
| `worker`     | Worker node names                 |

Put the control plane nodes (`master1`, `master2` and `master3`) under `etcd` and `master` respectively as below, which means these three machines will serve as both the control plane and etcd nodes. Note that the number of etcd needs to be odd. Meanwhile, it is not recommended that you install etcd on worker nodes since the memory consumption of etcd is very high.

#### config-sample.yaml Example

```yaml
spec:
  hosts:
  - {name: master1, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: master2, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: master3, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.5, internalAddress: 192.168.0.5, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.6, internalAddress: 192.168.0.6, user: ubuntu, password: Testing123}
  - {name: node3, address: 192.168.0.7, internalAddress: 192.168.0.7, user: ubuntu, password: Testing123}
  roleGroups:
    etcd:
    - master1
    - master2
    - master3
    control-plane:
    - master1
    - master2
    - master3
    worker:
    - node1
    - node2
    - node3
```

For a complete configuration sample explanation, see [this file](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md).

### Step 4: Configure the load balancer

In addition to the node information, you need to provide the load balancer information in the same YAML file. For the Intranet VIP address, you can find it in the last part when you create [an internal load balancer](#step-1-create-load-balancers). Assume the VIP address and listening port of the **internal load balancer** are `192.168.0.253` and `6443` 

respectively, and you can refer to the following example.

#### The configuration example in config-sample.yaml

```yaml
## Internal LB config example
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.0.253"
    port: 6443
```

{{< notice note >}}

- The address and port should be indented by two spaces in `config-sample.yaml`, and the address should be VIP.
- The domain name of the load balancer is `lb.kubesphere.local` by default for internal access. If you need to change the domain name, uncomment and modify it.

{{</ notice >}}

### Step 5: Kubernetes cluster configurations (Optional)

Kubekey provides some fields and parameters to allow the cluster administrator to customize Kubernetes installation, including Kubernetes version, network plugins and image registry. There are some default values provided in `config-sample.yaml`. You can modify Kubernetes-related configurations in the file based on your needs. For more information, see [Kubernetes Cluster Configurations](../../../installing-on-linux/introduction/vars/).

### Step 6: Persistent storage plugin configurations

Considering data persistence in a production environment, you need to prepare persistent storage and configure the storage plugin (for example, CSI) in `config-sample.yaml` to define which storage service you want.

{{< notice note >}}

For testing or development, you can skip this part. KubeKey will use the integrated OpenEBS to provision LocalPV as the storage service directly.

{{</ notice >}}

**Available storage plugins and clients**

- Ceph RBD & CephFS
- GlusterFS
- QingCloud CSI
- QingStor CSI
- More plugins will be supported in future releases

Make sure you have configured the storage plugin before you get started. KubeKey will create a StorageClass and persistent volumes for related workloads during the installation. For more information, see [Persistent Storage Configurations](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/).

### Step 7: Enable pluggable components (Optional)

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable which means you can enable them either before or after installation. By default, KubeSphere will be installed with the minimal package if you do not enable them.

You can enable any of them according to your demands. It is highly recommended that you install these pluggable components to discover the full-stack features and capabilities provided by KubeSphere. Make sure your machines have sufficient CPU and memory before you enable them. See [Enable Pluggable Components](../../../pluggable-components/) for details.

### Step 8: Start to bootstrap a cluster

After you complete the configuration, you can execute the following command to start the installation:

```bash
./kk create cluster -f config-sample.yaml
```

### Step 9: Verify the installation

Inspect the logs of installation. When you see output logs as follows, it means KubeSphere has been successfully deployed.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.3:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After you log into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             2020-08-13 10:50:24
#####################################################
```

### Step 10: Verify the HA cluster

Now that you have finished the installation, go back to the detail page of both the internal and external load balancers to see the status.

![active](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/active.png)

Both listeners show that the status is **Active**, meaning nodes are up and running.

![active-listener](/images/docs/v3.3/installing-on-linux/installing-on-public-cloud/deploy-kubesphere-on-qingcloud-instances/active-listener.png)

In the web console of KubeSphere, you can also see that all the nodes are functioning well.

To verify if the cluster is highly available, you can turn off an instance on purpose. For example, the above console is accessed through the address `IP: 30880` (the EIP address here is the one bound to the external load balancer). If the cluster is highly available, the console will still work well even if you shut down a control plane node.

## See Also

[Multi-node Installation](../../../installing-on-linux/introduction/multioverview/)

[Kubernetes Cluster Configurations](../../../installing-on-linux/introduction/vars/)

[Persistent Storage Configurations](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)

[Enable Pluggable Components](../../../pluggable-components/)