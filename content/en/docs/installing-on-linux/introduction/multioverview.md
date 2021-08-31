---
title: "Install a Multi-node Kubernetes and KubeSphere Cluster"
keywords: 'Multi-node, Installation, KubeSphere'
description: 'Learn the general steps of installing KubeSphere and Kubernetes on a multi-node cluster.'
linkTitle: "Multi-node Installation"
weight: 3130
---

In a production environment, a single-node cluster cannot satisfy most of the needs as the cluster has limited resources with insufficient compute capabilities. Thus, single-node clusters are not recommended for large-scale data processing. Besides, a cluster of this kind is not available with high availability as it only has one node. On the other hand, a multi-node architecture is the most common and preferred choice in terms of application deployment and distribution.

This section gives you an overview of a single-master multi-node installation, including the concept, [KubeKey](https://github.com/kubesphere/kubekey/) and steps. For information about HA installation, refer to [High Availability Configurations](../../../installing-on-linux/high-availability-configurations/ha-configuration/), [Installing on Public Cloud](../../public-cloud/install-kubesphere-on-azure-vms/) and [Installing in On-premises Environment](../../on-premises/install-kubesphere-on-bare-metal/).

## Video Demonstration

{{< youtube nYOYk3VTSgo >}}

## Concept

A multi-node cluster is composed of at least one master node and one worker node. You can use any node as the **taskbox** to carry out the installation task. You can add additional nodes based on your needs (for example, for high availability) both before and after the installation.

- **Master**. A master node generally hosts the control plane that controls and manages the whole system.
- **Worker**. Worker nodes run the actual applications deployed on them.

## Step 1: Prepare Linux Hosts

Please see the requirements for hardware and operating system shown below. To get started with multi-node installation in this demo, you need to prepare at least three hosts according to the following requirements. It is possible to install [KubeSphere Container Platform](https://kubesphere.io/) on two nodes with enough resources planned.

### System requirements

| Systems                                                | Minimum Requirements (Each node)            |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux** *7*                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server** *15* **/openSUSE Leap** *15.2* | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

The path `/var/lib/docker` is mainly used to store the container data, and will gradually increase in size during use and operation. In the case of a production environment, it is recommended that `/var/lib/docker` should mount a drive separately.

{{</ notice >}}

### Node requirements

- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.
- `docker` can be installed by yourself or by KubeKey.

{{< notice note >}}

`docker` must be installed in advance if you want to deploy KubeSphere in an offline environment.

{{</ notice >}}

### Dependency requirements

KubeKey can install Kubernetes and KubeSphere together. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the list below to see if you need to install relevant dependencies on your node in advance. 

| Dependency  | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

### Network and DNS requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in clusters.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It's recommended that you turn off the firewall or follow the guide [Port Requirements](../port-firewall/).

{{< notice tip >}}

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- A registry mirror (booster) is recommended to be prepared if you have trouble downloading images from `dockerhub.io`. See [Configure a Booster for Installation](../../../faq/installation/configure-booster/) and [Configure registry mirrors for the Docker daemon](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon).

{{</ notice >}}

This example includes three hosts as below with the master node serving as the taskbox.

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## Step 2: Download KubeKey

Follow the step below to download [KubeKey](../kubekey).

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

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

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

## Step 3: Create a Kubernetes Multi-node Cluster

For multi-node installation, you need to create a cluster by specifying a configuration file.

### 1. Create an example configuration file

Command:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

{{< notice note >}}

- Supported Kubernetes versions: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}}

Here are some examples for your reference:

- You can create an example configuration file with default configurations. You can also specify the file with a different filename, or in a different folder.

  ```bash
  ./kk create config [-f ~/myfolder/abc.yaml]
  ```

- You can specify a KubeSphere version that you want to install (for example, `--with-kubesphere v3.0.0`).

  ```bash
  ./kk create config --with-kubesphere [version]
  ```

### 2. Edit the configuration file of a Kubernetes multi-node cluster

A default file `config-sample.yaml` will be created if you do not change the name. Edit the file and here is an example of the configuration file of a multi-node cluster with one master node.

{{< notice note >}}

To customize 





etes related parameters, refer to [Kubernetes Cluster Configurations](../vars/).

{{</ notice >}}

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

List all your machines under `hosts` and add their detailed information as above.

`name`: The hostname of the instance.

`address`: The IP address you use for the connection between the taskbox and other instances through SSH. This can be either the public IP address or the private IP address depending on your environment. For example, some cloud platforms provide every instance with a public IP address which you use to access instances through SSH. In this case, you can input the public IP address for this field.

`internalAddress`: The private IP address of the instance.

- In this tutorial, port 22 is the default port of SSH so you do not need to add it in the YAML file. Otherwise, you need to add the port number after the IP address. For example:

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```

- For the default root user:

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
  ```

- For passwordless login with SSH keys:

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
  ```

{{< notice tip >}} 

- Before you install KubeSphere, you can use the information provided under `hosts` (for example, IP addresses and passwords) to test the network connection between the taskbox and other instances using SSH.
- Make sure port 6443 is not being used by other services before the installation. Otherwise, it may cause conflicts as the default port of the API server is 6443.

{{</ notice >}}

#### roleGroups

- `etcd`: etcd node names
- `master`: Master node names
- `worker`: Worker node names

#### controlPlaneEndpoint (for HA installation only)

`controlPlaneEndpoint` allows you to define an external load balancer for an HA cluster. You need to prepare and configure an external load balancer if and only if you need to install multiple master nodes. Please note that the address and port should be indented by two spaces in `config-sample.yaml`, and `address` should be VIP. See [HA Configuration](../ha-configuration/) for details.

#### addons

You can customize persistent storage plugins (for example, NFS Client, Ceph RBD, and GlusterFS) by specifying storage under the field `addons` in `config-sample.yaml`. For more information, see [Persistent Storage Configurations](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/).

{{< notice note >}}

KubeKey will install [OpenEBS](https://openebs.io/) to provision [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local) for development and testing environment by default, which is convenient for new users. In this example of multi-node installation, the default storage class (local volume) is used. For production, please use NFS/Ceph/GlusterFS/CSI or commercial products as persistent storage solutions.

{{</ notice >}}

{{< notice tip >}}

- You can enable the multi-cluster feature by editing the configuration file. For more information, see [Multi-cluster Management](../../../multicluster-management/).
- You can also select the components you want to install. For more information, see [Enable Pluggable Components](../../../pluggable-components/). For an example of a complete `config-sample.yaml` file, see [this file](https://github.com/kubesphere/kubekey/blob/release-1.0/docs/config-example.md).

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

Now, you will be able to access the web console of KubeSphere at `http://{IP}:30880` (for example, you can use the EIP) with the account and password `admin/P@88w0rd`.

{{< notice note >}}

To access the console, you may need to configure port forwarding rules depending on your environment. Please also make sure port 30880 is opened in your security group.

{{</ notice >}}

![login](/images/docs/installing-on-linux/introduction/multi-node-installation/login.png)

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

## Demo
<script src="https://asciinema.org/a/368752.js" id="asciicast-368752" async></script>
