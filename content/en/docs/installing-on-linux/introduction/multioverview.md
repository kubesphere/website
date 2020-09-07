---
title: "Multi-node Installation"
keywords: 'Multi-node, Installation, KubeSphere'
description: 'Multi-node Installation Overview'

linkTitle: "Multi-node Installation"
weight: 2112
---

In a production environment, a single-node cluster cannot satisfy most of the needs as the cluster has limited resources with insufficient compute capabilities. Thus, single-node clusters are not recommended for large-scale data processing. Besides, a cluster of this kind is not available with high availability as it only has one node. On the other hand, a multi-node architecture is the most common and preferred choice in terms of application deployment and distribution.

This section gives you an overview of multi-node installation, including the concept, KubeKey and steps. For information about HA installation, refer to Installing on Public Cloud and Installing in On-premises Environment.

## Concept

A multi-node cluster is composed of at least one master node and one worker node. You can use any node as the **taskbox** to carry out the installation task. You can add additional nodes based on your needs (e.g. for high availability) both before and after the installation.

- **Master**. A master node generally hosts the control plane that controls and manages the whole system.
- **Worker**. Worker nodes run the actual applications deployed on them.

## Why KubeKey

If you are not familiar with Kubernetes components, you may find it difficult to set up a highly-functional multi-node Kubernetes cluster. Starting from the version 3.0.0, KubeSphere uses a brand-new installer called KubeKey to replace the old ansible-based installer. Developed in Go language, KubeKey allows users to quickly deploy a multi-node architecture.

For users who do not have an existing Kubernetes cluster, they only need to create a configuration file with few commands and add node information (e.g. IP address and node roles) in it after KubeKey is downloaded. With one command, the installation will start and no additional operation is needed.

### Motivation

- The previous ansible-based installer has a bunch of software dependencies such as Python. KubeKey is developed in Go language to get rid of the problem in a variety of environments, making sure the installation is successful.
- KubeKey uses Kubeadm to install Kubernetes clusters on nodes in parallel as much as possible in order to reduce installation complexity and improve efficiency. It will greatly save installation time compared to the older installer.
- With KubeKey, users can scale clusters from an all-in-one cluster to a multi-node cluster, even an HA cluster.
- KubeKey aims to install clusters as an object, i.e., CaaO.

## Step 1: Prepare Linux Hosts

Please see the requirements for hardware and operating system shown below. To get started with multi-node installation, you need to prepare at least three hosts according to the following requirements.

### System Requirements

| Systems                                                | Minimum Requirements (Each node)            |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

The path `/var/lib/docker` is mainly used to store the container data, and will gradually increase in size during use and operation. In the case of a production environment, it is recommended that `/var/lib/docker` should mount a drive separately.

{{</ notice >}}

### Node Requirements

- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.
- `ebtables`/`socat`/`ipset`/`conntrack` should be installed in all nodes.
- `docker` can be installed by yourself or by KubeKey.

### Network and DNS Requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in clusters.
- If your network configuration uses Firewall or Security Group, you must ensure infrastructure components can communicate with each other through specific ports. It's recommended that you turn off the firewall or follow the guide [Network Access](https://github.com/kubesphere/kubekey/blob/master/docs/network-access.md).

{{< notice tip >}}

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- A container image mirror (accelerator) is recommended to be prepared if you have trouble downloading images from dockerhub.io. See [Configure registry mirrors for the Docker daemon](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon).

{{</ notice >}}

This example includes three hosts as below with the master node serving as the taskbox.

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## Step 2: Download KubeKey

Follow the step below to download KubeKey.

{{< tabs >}}

{{< tab "For users with poor network connections to GitHub" >}}

Download KubeKey using the following command:

```bash
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```
{{</ tab >}}

{{< tab "For users with good network connections to GitHub" >}}

Download KubeKey from [GitHub Release Page](https://github.com/kubesphere/kubekey/releases/tag/v1.0.0) or use the following command directly.

```bash
wget https://github.com/kubesphere/kubekey/releases/download/v1.0.0/kubekey-v1.0.0-linux-amd64.tar.gz
```
{{</ tab >}}

{{</ tabs >}}

Grant the execution right to `kk`:

```bash
chmod +x kk
```

## Step 3: Create a Cluster

For multi-node installation, you need to create a cluster by specifying a configuration file.

### 1. Create an example configuration file

Command:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

{{< notice info >}}

Supported Kubernetes versions: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.

{{</ notice >}}

Here are some examples for your reference:

- You can create an example configuration file with default configurations. You can also specify the file with a different filename, or in a different folder.

```bash
./kk create config [-f ~/myfolder/abc.yaml]
```

- You can customize persistent storage plugins (e.g. NFS Client, Ceph RBD, and GlusterFS) in `config-sample.yaml`.

```bash
./kk create config --with-storage localVolume
```

{{< notice note >}}

KubeKey will install [OpenEBS](https://openebs.io/) to provision [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local) for development and testing environment by default, which is convenient for new users. In this example of multi-node installation, the default storage class (local volume) is used. For production, please use NFS/Ceph/GlusterFS/CSI or commercial products as persistent storage solutions. You need to specify them under `addons` of `config-sample.yaml`. See [Persistent Storage Configuration](../storage-configuration) for more details.

{{</ notice >}}

- You can specify a KubeSphere version that you want to install (e.g. `--with-kubesphere v3.0.0`).

```bash
./kk create config --with-kubesphere [version]
```

### 2. Edit the configuration file

A default file **config-sample.yaml** will be created if you do not change the name. Edit the file and here is an example of the configuration file of a multi-node cluster with one master node.

```yaml
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
  roleGroups:
    etcd:
    - master
    master:
    - master
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: "6443"
```

#### Hosts

- List all your machines under `hosts` and add their detailed information as above. In this case, port 22 is the default port of SSH. Otherwise, you need to add the port number after the IP address. For example:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
```

- For default root user:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
```

- For passwordless login with SSH keys:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
```

#### roleGroups

- `etcd`: etcd node names
- `master`: Master node names
- `worker`: Worker node names

#### controlPlaneEndpoint (for HA installation only)

`controlPlaneEndpoint` allows you to define an external load balancer for an HA cluster. You need to prepare and configure an external load balancer if and only if you need to install more than 3 master nodes. Please note that the address and port should be indented by two spaces in `config-sample.yaml`, and the `address` should be VIP. See HA Configuration for details.

{{< notice tip >}}

- You can enable the multi-cluster feature by editing the configuration file. For more information, see Multi-cluster Management.
- You can also select the components you want to install. For more information, see [Enable Pluggable Components](../../../pluggable-components/). For an example of a complete config-sample.yaml file, see [this file](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md).

{{</ notice >}}

When you finish editing, save the file.

### 3. Create a cluster using the configuration file

```bash
./kk create cluster -f config-sample.yaml
```

{{< notice note >}}

You need to change `config-sample.yaml` above to your own file if you use a different name.

{{</ notice >}}

The whole installation process may take 10-20 minutes, depending on your machine and network.

### 4. Verify the installation

When the installation finishes, you can see the content as follows:

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.2:30880
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
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

Now, you will be able to access the web console of KubeSphere at `http://{IP}:30880` (e.g. you can use the EIP) with the account and password `admin/P@88w0rd`.

{{< notice note >}}

To access the console, you may need to forward the source port to the intranet port of the intranet IP depending on the platform of your cloud providers. Please also make sure port 30880 is opened in the security group.

{{</ notice >}}

![kubesphere-login](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## Enable kubectl Autocompletion

KubeKey doesn't enable kubectl autocompletion. See the content below and turn it on:

**Prerequisite**: make sure bash-autocompletion is installed and works.

```bash
# Install bash-completion
apt-get install bash-completion

# Source the completion script in your ~/.bashrc file
echo 'source <(kubectl completion bash)' >>~/.bashrc

# Add the completion script to the /etc/bash_completion.d directory
kubectl completion bash >/etc/bash_completion.d/kubectl
```

Detailed information can be found [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion).
