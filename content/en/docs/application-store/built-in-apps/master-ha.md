---
title: "High Availability Configuration"
keywords: "kubesphere, kubernetes, docker,installation, HA, high availability"
description: "The guide for installing a high availability of KubeSphere cluster"

weight: 2230
---

## Introduction

[Multi-node installation](../multi-node) can help you to quickly set up a single-master cluster on multiple machines for development and testing. However, we need to consider the high availability of the cluster for production. Since the key components on the master node, i.e. kube-apiserver, kube-scheduler, and kube-controller-manager are running on a single master node, Kubernetes and KubeSphere will be unavailable during the master being down. Therefore we need to set up a high availability cluster by provisioning load balancers and multiple masters. You can use any cloud load balancer, or any hardware load balancer (e.g. F5). In addition, keepalved and Haproxy is also an alternative for creating such high-availability cluster.

This document walks you through an example how to create two [QingCloud Load Balancer](https://docs.qingcloud.com/product/network/loadbalancer), serving as internal load balancer and external load balancer respectively, and how to configure the high availability of masters and Etcd using the load balancers.

## Prerequisites

- Please make sure that you already read [Multi-Node installation](../multi-node). This document only demonstrates how to configure load balancers.
- You need a [QingCloud](https://console.qingcloud.com/login) account to create load balancers, or follow the guide of any other cloud provider to create load balancers.

## Architecture

This example prepares six machines of CentOS 7.5. We will create two load balancers, and deploy three masters and Etcd nodes on three of the machines. You can configure these masters and Etcd nodes in `conf/hosts.ini`.

![Master and etcd node high availability architecture](https://pek3b.qingstor.com/kubesphere-docs/png/20200307215924.png)

## Install HA Cluster

### Step 1: Create Load Balancers

This step briefly shows an example of creating a load balancer on QingCloud platform.

#### Create an Internal Load Balancer

1.1. Log in [QingCloud Console](https://console.qingcloud.com/login) and select **Network & CDN → Load Balancers**, then click on the create button and fill in the basic information.

1.2. Choose the VxNet that your machines are created within from the **Network** dropdown list. Here is `kube`. Other settings can be default values as follows. Click **Submit** to complete the creation.

![Create Internal LB on QingCloud](https://pek3b.qingstor.com/kubesphere-docs/png/20200215224125.png)

1.3. Drill into the detail page of the load balancer, then create a listener that listens to the port `6443` of the `TCP` protocol.

- Name: Define a name for this Listener
- Listener Protocol: Select `TCP` protocol
- Port: `6443`
- Load mode: `Poll`

> Note: After creating the listener, please check the firewall rules of the load balancer. Make sure that the port `6443` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation will fail.

![Add Listener to LB](https://pek3b.qingstor.com/kubesphere-docs/png/20200215225205.png)

1.4. Click **Add Backend**, choose the VxNet `kube` that we chose. Then click on the button **Advanced Search** and choose the three master nodes under the VxNet and set the port to `6443` which is the default secure port of api-server.

Click **Submit** when you are done.

![Choose Backends](https://pek3b.qingstor.com/kubesphere-docs/png/20200215225550.png)

1.5. Click on the button **Apply Changes** to activate the configurations. At this point, you can find the three masters have been added as the backend servers of the listener that is behind the internal load balancer.

> Please note: The status of all masters might shows `Not available` after you added them as backends. This is normal since the port `6443` of api-server are not active in masters yet. The status will change to `Active` and the port of api-server will be exposed after installation complete, which means the internal load balancer you configured works as expected.

![Apply Changes](https://pek3b.qingstor.com/kubesphere-docs/png/20200215230107.png)

#### Create an External Load Balancer

You need to create an EIP in advance.

1.6. Similarly, create an external load balancer without joining any network, but associate the EIP that you created to this load balancer.

1.7. Enter the load balancer detail page, create a listener that listens to the port `30880` of the `HTTP` protocol which is the nodeport of KubeSphere console..

> Note: After creating the listener, please check the firewall rules of the load balancer. Make sure that the port `30880` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation will fail.

![Create external LB](https://pek3b.qingstor.com/kubesphere-docs/png/20200215232114.png)

1.8. Click **Add Backend**, then choose the `six` machines that we are going to install KubeSphere within the VxNet `Kube`, and set the port to `30880`.

Click **Submit** when you are done.

1.9. Click on the button **Apply Changes** to activate the configurations. At this point, you can find the six machines have been added as the backend servers of the listener that is behind the external load balancer.

![Apply Changes](https://pek3b.qingstor.com/kubesphere-docs/png/20200215232445.png)

### Step 2: Modify the host.ini

Go to the taskbox where you downloaded the installer by following the [Multi-node Installation](../multi-node) and complete the following configurations.

| **Parameter**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `[all]`                  | node information. Use the following syntax if you run installation as `root` user: <br> -  `<node_name> ansible_connection=<host> ip=<ip_address>` <br> -  `<node_name> ansible_host=<ip_address> ip=<ip_address> ansible_ssh_pass=<pwd>` <br> If you log in as a non-root user, use the syntax: <br> - `<node_name> ansible_connection=<host> ip=<ip_address> ansible_user=<user>  ansible_become_pass=<pwd>` |
| `[kube-master]`          | master node names                                                                                                                                                                                                                                                                                                                                                                                              |
| `[kube-node]`            | worker node names                                                                                                                                                                                                                                                                                                                                                                                                |
| `[etcd]`                 | etcd node names. The number of `etcd` nodes needs to be odd.                                                                                                                                                                                                                                                                                                                                                   |
| `[k8s-cluster:children]` | group names of `[kube-master]` and `[kube-node]`                                                                                                                                                                                                                                                                                                                                                               |


We use **CentOS 7.5** with `root` user to install an HA cluster. Please see the following configuration as an example:

> Note:
> <br>
> If the _taskbox_ cannot establish `ssh` connection with the rest nodes, try to use the non-root user configuration.

#### host.ini example

```ini
[all]
master1  ansible_connection=local  ip=192.168.0.1
master2  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
master3  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD
node1  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.5  ip=192.168.0.5  ansible_ssh_pass=PASSWORD
node3  ansible_host=192.168.0.6  ip=192.168.0.6  ansible_ssh_pass=PASSWORD

[kube-master]
master1
master2
master3

[kube-node]
node1
node2
node3

[etcd]
master1
master2
master3

[k8s-cluster:children]
kube-node
kube-master
```

### Step 3: Configure the Load Balancer Parameters

Besides configuring the `common.yaml` by following the [Multi-node Installation](../multi-node), you need to modify the load balancer information in the `common.yaml`. Assume the **VIP** address and listening port of the **internal load balancer** are `192.168.0.253` and `6443`, then you can refer to the following example.

> - Note that address and port should be indented by two spaces in `common.yaml`, and the address should be VIP.
> - The domain name of the load balancer is "lb.kubesphere.local" by default for internal access. If you need to change the domain name, please uncomment and modify it.

#### The configuration sample in common.yaml

```yaml
## External LB example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
loadbalancer_apiserver:
  address: 192.168.0.253
  port: 6443
```

Finally, please refer to the [guide](../storage-configuration) to configure the persistent storage service in `common.yaml` and start your HA cluster installation.

Then it is ready to install the high availability KubeSphere cluster.
