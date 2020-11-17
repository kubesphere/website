---
title: "Deploy KubeSphere on QingCloud Instance"
keywords: "KubeSphere, Installation, HA, High-availability, LoadBalancer"
description: "The tutorial is for installing a high-availability cluster."

Weight: 2229
---

## Introduction

For a production environment, we need to consider the high availability of the cluster. If the key components (e.g. kube-apiserver, kube-scheduler, and kube-controller-manager) are all running on the same master node, Kubernetes and KubeSphere will be unavailable once the master node goes down. Therefore, we need to set up a high-availability cluster by provisioning load balancers with multiple master nodes. You can use any cloud load balancer, or any hardware load balancer (e.g. F5). In addition, Keepalived and [HAproxy](https://www.haproxy.com/), or Nginx is also an alternative for creating high-availability clusters.

This tutorial walks you through an example of how to create two [QingCloud Load Balancers](https://docs.qingcloud.com/product/network/loadbalancer), serving as the internal load balancer and external load balancer respectively, and of how to implement high availability of master and etcd nodes using the load balancers.

## Prerequisites

- Please make sure that you already know how to install KubeSphere with a multi-node cluster by following the [guide](https://github.com/kubesphere/kubekey). For the detailed information about the config yaml file that is used for installation, see Multi-node Installation. This tutorial focuses more on how to configure load balancers.
- You need a [QingCloud](https://console.qingcloud.com/login) account to create load balancers, or follow the guide of any other cloud provider to create load balancers.
- Considering data persistence, for a production environment, we recommend you to prepare persistent storage and create a StorageClass in advance. For development and testing, you can use the integrated OpenEBS to provision LocalPV as the storage service directly.

## Architecture

This example prepares six machines of **Ubuntu 16.04.6**. We will create two load balancers, and deploy three master and etcd nodes on three of the machines. You can configure these master and etcd nodes in `config-sample.yaml` of KubeKey (Please note that this is the default name, which can be changed by yourself).

![kubesphere-ha-architecture](https://ap3.qingstor.com/kubesphere-website/docs/ha-architecture.png)

{{< notice note >}}

The Kubernetes document [Options for Highly Available topology](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/) demonstrates that there are two options for configuring the topology of a highly available (HA) Kubernetes cluster, i.e. stacked etcd topology and external etcd topology. You should carefully consider the advantages and disadvantages of each topology before setting up an HA cluster according to [this document](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/). In this guide, we adopt stacked etcd topology to bootstrap an HA cluster for convenient demonstration.

{{</ notice >}}

## Install HA Cluster

### Create Load Balancers

This step demonstrates how to create load balancers on QingCloud platform.

#### Create an Internal Load Balancer

1. Log in [QingCloud Console](https://console.qingcloud.com/login). In the menu on the left, under **Network & CDN**, select **Load Balancers**. Click **Create** to create a load balancer.

![create-lb](https://ap3.qingstor.com/kubesphere-website/docs/create-lb.png)

2. In the pop-up window, set a name for the load balancer. Choose the VxNet where your machines are created from the Network drop-down list. Here is `pn`. Other fields can be default values as shown below. Click **Submit** to finish.

![qingcloud-lb](https://ap3.qingstor.com/kubesphere-website/docs/qingcloud-lb.png)

3. Click the load balancer. In the detailed information page, create a listener that listens on port `6443` with the Listener Protocol set as `TCP`.

![Listener](https://ap3.qingstor.com/kubesphere-website/docs/listener.png)

- Name: Define a name for this Listener
- Listener Protocol: Select `TCP` protocol
- Port: `6443`
- Load mode: `Poll`

Click Submit to continue.

{{< notice note >}}

After you create the listener, please check the firewall rules of the load balancer. Make sure that the port `6443` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation will fail. If you are using QingCloud platform, you can find the information in **Security Groups** under **Security**.

{{</ notice >}}

4. Click **Add Backend**, and choose the VxNet you just selected (in this example, it is `pn`). Click the button **Advanced Search**, choose the three master nodes, and set the port to `6443` which is the default secure port of api-server.

![add-backend](https://ap3.qingstor.com/kubesphere-website/docs/3-master.png)

Click **Submit** when you finish.

5. Click the button **Apply Changes** to activate the configurations. At this point, you can find the three masters have been added as the backend servers of the listener that is behind the internal load balancer.

{{< notice note >}}

The status of all masters might show `Not Available` after you added them as backends. This is normal since the port `6443` of api-server is not active on master nodes yet. The status will change to `Active` and the port of api-server will be exposed after the installation finishes, which means the internal load balancer you configured works as expected.

{{</ notice >}}

![apply-changes](https://ap3.qingstor.com/kubesphere-website/docs/apply-change.png)

Record the Intranet VIP shown under Networks. The IP address will be added later to the config yaml file.

#### Create an External Load Balancer

You need to create an EIP in advance. To create an EIP, go to **Elastic IPs** under **Networks & CDN**.

{{< notice note >}}

Two elastic IPs are needed for this whole tutorial, one for the VPC network and the other for the external load balancer created in this step. You cannot associate the same EIP to the VPC network and the load balancer at the same time.

{{</ notice >}}

6. Similarly, create an external load balancer while don't select VxNet for the Network field. Bind the EIP that you created to this load balancer by clicking **Add IPv4**.

![bind-eip](https://ap3.qingstor.com/kubesphere-website/docs/bind-eip.png)

7. In the load balancer detailed information page, create a listener that listens on port `30880` (NodePort of KubeSphere console) with the Listener Protocol set as `HTTP`.

{{< notice note >}}

After you create the listener, please check the firewall rules of the load balancer. Make sure that the port `30880` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation will fail. If you are using QingCloud platform, you can find the information in **Security Groups** under **Security**.

{{</ notice >}}

![listener2](https://ap3.qingstor.com/kubesphere-website/docs/listener2.png)

8. Click **Add Backend**. In **Advanced Search**, choose the `six` machines on which we are going to install KubeSphere within the VxNet `pn`, and set the port to `30880`.

![six-instances](https://ap3.qingstor.com/kubesphere-website/docs/six-instances.png)

Click **Submit** when you finish.

9. Click **Apply Changes** to activate the configurations. At this point, you can find the six machines have been added as the backend servers of the listener that is behind the external load balancer.

### Download KubeKey

[Kubekey](https://github.com/kubesphere/kubekey) is the next-gen installer which provides an easy, fast and flexible way to install Kubernetes and KubeSphere v3.0.0.

Follow the step below to download KubeKey.

{{< tabs >}}

{{< tab "For users with good network connections to GitHub" >}}

Download KubeKey from [GitHub Release Page](https://github.com/kubesphere/kubekey/releases/tag/v1.0.0) or use the following command directly.

```bash
wget https://github.com/kubesphere/kubekey/releases/download/v1.0.0/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

{{</ tab >}}

{{< tab "For users with poor network connections to GitHub" >}}

Download KubeKey using the following command:

```bash
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

{{</ tab >}}

{{</ tabs >}}

Make `kk` executable:

```bash
chmod +x kk
```

Create an example configuration file with default configurations. Here Kubernetes v1.17.9 is used as an example.

```bash
./kk create config --with-kubesphere v3.0.0 --with-kubernetes v1.17.9
```

{{< notice note >}}

These Kubernetes versions have been fully tested with KubeSphere: v1.15.12, v1.16.13, v1.17.9 (default), and v1.18.6.

{{</ notice >}}

### Cluster Node Planning

As we adopt the HA topology with stacked control plane nodes, where etcd nodes are colocated with master nodes, we will define the master nodes and etcd nodes are on the same three machines.

| **Property** | **Description**                   |
| :----------- | :-------------------------------- |
| `hosts`      | Detailed information of all nodes |
| `etcd`       | etcd node names                   |
| `master`     | Master node names                 |
| `worker`     | Worker node names                 |

- Put the master node name (master1, master2 and master3) under `etcd` and `master` respectively as below, which means these three machines will be assigned with both the master and etcd role. Please note that the number of etcd needs to be odd. Meanwhile, we do not recommend you to install etcd on worker nodes since the memory consumption of etcd is very high. Edit the configuration file, and we use **Ubuntu 16.04.6** in this example.

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
    master:
    - master1
    - master2
    - master3
    worker:
    - node1
    - node2
    - node3
```

For a complete configuration sample explanation, please see [this file](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md).

### Configure the Load Balancer

In addition to the node information, you need to provide the load balancer information in the same yaml file. For the Intranet VIP address, you can find it in step 5 mentioned above. Assume the VIP address and listening port of the **internal load balancer** are `192.168.0.253` and `6443` respectively, and you can refer to the following example.

#### The configuration example in config-sample.yaml

```yaml
## Internal LB config example
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.0.253"
    port: "6443"
```

{{< notice note >}}

- The address and port should be indented by two spaces in `config-sample.yaml`, and the address should be VIP.
- The domain name of the load balancer is `lb.kubesphere.local` by default for internal access. If you need to change the domain name, please uncomment and modify it.

{{</ notice >}}

After that, you can enable any components you need by following [Enable Pluggable Components](../../../pluggable-components/) and start your HA cluster installation.

### Kubernetes Cluster Configuration (Optional)

Kubekey provides some fields and parameters to allow the cluster administrator to customize Kubernetes installation, including Kubernetes version, network plugins and image registry. There are some default values provided in `config-example.yaml`. Optionally, you can modify the Kubernetes related configuration in `config-example.yaml` according to your needs. See [config-example.md](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) for detailed explanation.

### Persistent Storage Plugin Configuration

As we mentioned in the prerequisites, considering data persistence in a production environment, you need to prepare persistent storage and configure the storage plugin (e.g. CSI) in `config-sample.yaml` to define which storage service you want.

{{< notice note >}}

For testing or development, you can skip this part. KubeKey will use the integrated OpenEBS to provision LocalPV as the storage service directly.

{{</ notice >}}

**Available Storage Plugins & Clients**

- Ceph RBD & CephFS
- GlusterFS
- NFS
- QingCloud CSI
- QingStor CSI
- More plugins are WIP, which will be added soon

For each storage plugin configuration, you can refer to [config-example.md](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) to get detailed explanation. Make sure you have configured the storage plugin before you get started. KubeKey will create a StorageClass and persistent volumes for related workloads during the installation.

### Enable Pluggable Components (Optional)

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable which means you can enable them either before or after installation. By default, KubeSphere will be started with a minimal installation if you do not enable them.

You can enable any of them according to your demands. It is highly recommended that you install these pluggable components to discover the full-stack features and capabilities provided by KubeSphere. Please ensure your machines have sufficient CPU and memory before enabling them. See [Enable Pluggable Components](../../../pluggable-components/) for details.

### Start to Bootstrap a Cluster

After you complete the configuration, you can execute the following command to start the installation:

```bash
./kk create cluster -f config-sample.yaml
```

### Verify the Installation

Inspect the logs of installation. When you see the successful logs as follows, congratulations and enjoy it!

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.3:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are ready.
  2. Please modify the default password after login.

#####################################################
https://kubesphere.io             2020-08-13 10:50:24
#####################################################
```

### Verify the HA Cluster

Now that you have finished the installation, you can go back to the detailed information page of both the internal and external load balancers to see the status.

![LB active](https://ap3.qingstor.com/kubesphere-website/docs/active.png)

Both listeners show that the status is `Active`, meaning the node is up and running.

![active-listener](https://ap3.qingstor.com/kubesphere-website/docs/active-listener.png)

In the web console of KubeSphere, you can also see that all the nodes are functioning well.

![cluster-node](https://ap3.qingstor.com/kubesphere-website/docs/cluster-node.png)

To verify if the cluster is highly available, you can turn off an instance on purpose. For example, the above dashboard is accessed through the address `IP: 30880` (the EIP address here is the one bound to the external load balancer). If the cluster is highly available, the dashboard will still work well even if you shut down a master node.
