---
title: "High Availability Configurations"
keywords: 'KubeSphere, Kubernetes, HA, high availability, installation, configuration'
description: 'How to configure a high-availability Kubernetes cluster.'
linkTitle: "High Availability Configurations"
weight: 3150
---

You can set up a single-master Kubernetes cluster with KubeSphere installed based on the tutorial of [Multi-node Installation](../multioverview/). Single-master clusters may be sufficient for development and testing in most cases. For a production environment, however, you need to consider the high availability of the cluster. If key components (for example, kube-apiserver, kube-scheduler, and kube-controller-manager) are all running on the same master node, Kubernetes and KubeSphere will be unavailable once the master node goes down. Therefore, you need to set up a high-availability cluster by provisioning load balancers with multiple master nodes. You can use any cloud load balancer, or any hardware load balancer (e.g. F5). In addition, Keepalived and [HAproxy](https://www.haproxy.com/), or Nginx is also an alternative for creating high-availability clusters.

This tutorial demonstrates the general configurations of a high-availability cluster as you install KubeSphere on Linux.

## Architecture

Make sure you have prepared six Linux machines before you begin, with three of them serving as master nodes and the other three as worker nodes. The following image shows details of these machines, including their private IP address and role. For more information about system and network requirements, see [Multi-node Installation](../multioverview/#step-1-prepare-linux-hosts).

![ha-architecture](/images/docs/installing-on-linux/introduction/ha-configurations/ha-architecture.png)

## Configure a Load Balancer

You must create a load balancer in your environment to listen (also known as listeners on some cloud platforms) on key ports. Here is a table of recommended ports that need to be listened on.

| Service    | Protocol | Port  |
| ---------- | -------- | ----- |
| apiserver  | TCP      | 6443  |
| ks-console | TCP      | 30880 |
| http       | TCP      | 80    |
| https      | TCP      | 443   |

{{< notice note >}}

- Make sure your load balancer at least listens on the port of apiserver.

- You may need to open ports in your security group to ensure external traffic is not blocked depending on where your cluster is deployed. For more information, see [Port Requirements](../port-firewall/).
- You can configure both internal and external load balancers on some cloud platforms. After assigning a public IP address to the external load balancer, you can use the IP address to access the cluster.
- For more information about how to configure load balancers, see “Installing on Public Cloud” to see specific steps on major public cloud platforms.

{{</ notice >}} 

## Download KubeKey

[Kubekey](https://github.com/kubesphere/kubekey) is the next-gen installer which provides an easy, fast and flexible way to install Kubernetes and KubeSphere. Follow the steps below to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

After you download KubeKey, If you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v1.0.1) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

Create an example configuration file with default configurations. Here Kubernetes v1.17.9 is used as an example.

```bash
./kk create config --with-kubesphere v3.0.0 --with-kubernetes v1.17.9
```

{{< notice note >}}

- Kubernetes versions that have been fully tested with KubeSphere: v1.15.12, v1.16.13, v1.17.9 (default), and v1.18.6.

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}}

## Deploy KubeSphere and Kubernetes

After you run the commands above, a configuration file `config-sample.yaml` will be created. Edit the file to add machine information, configure the load balancer and more.

{{< notice note >}}

The file name may be different if you customize it.

{{</ notice >}} 

### config-sample.yaml Example

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

For more information about different fields in this configuration file, see [Kubernetes Cluster Configurations](../vars/) and [Multi-node Installation](../multioverview/#2-edit-the-configuration-file).

### Configure the Load Balancer

```yaml
## Public LB config example
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.0.xx"
    port: "6443"
```

{{< notice note >}}

- The address and port should be indented by two spaces in `config-sample.yaml`.
- In most cases, you need to provide the **private IP address** of the load balancer for the field `address`. However, different cloud providers may have different configurations for load balancers. For example, if you configure a Server Load Balancer (SLB) on Alibaba Cloud, the platform assigns a public IP address to the SLB, which means you need to specify the public IP address for the field `address`.
- The domain name of the load balancer is `lb.kubesphere.local` by default for internal access. If you need to change the domain name, please uncomment and modify it.

{{</ notice >}}

### Persistent Storage Plugin Configurations

For a production environment, you need to prepare persistent storage and configure the storage plugin (e.g. CSI) in `config-sample.yaml` to define which storage service you want to use. For more information, see [Persistent Storage Configurations](../storage-configuration/).

### Enable Pluggable Components (Optional)

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable which means you can enable them either before or after installation. By default, KubeSphere will be installed with the minimal package if you do not enable them.

You can enable any of them according to your demands. It is highly recommended that you install these pluggable components to discover the full-stack features and capabilities provided by KubeSphere. Make sure your machines have sufficient CPU and memory before enabling them. See [Enable Pluggable Components](../../../pluggable-components/) for details.

### Start Installation

After you complete the configuration, you can execute the following command to start the installation:

```bash
./kk create cluster -f config-sample.yaml
```

### Verify Installation

1. Run the following command to Inspect the logs of installation.

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
   ```

2. When you see the following message, it means your HA cluster is successfully created.

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
   https://kubesphere.io             2020-xx-xx xx:xx:xx
   #####################################################
   ```

