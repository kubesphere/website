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

A multi-node cluster is composed of at least one control plane and one worker node. You can use any node as the **taskbox** to carry out the installation task. You can add additional nodes based on your needs (for example, for high availability) both before and after the installation.

- **Control plane node**. The control plane generally hosts the control plane and controls and manages the whole system.

- **Worker node**. Worker nodes run the actual applications deployed on them.

## Step 1: Prepare Linux Hosts

Please see the requirements for hardware and operating system shown below. To get started with multi-node installation in this tutorial, you need to prepare at least three hosts according to the following requirements. It is possible to install the [KubeSphere Container Platform](https://kubesphere.io/) on two nodes if they have sufficient resources.

### System requirements

| Systems                                                | Minimum Requirements (Each node)            |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04, 20.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux** *7*                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server** *15* **/openSUSE Leap** *15.2* | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

- The path `/var/lib/docker` is mainly used to store the container data, and will gradually increase in size during use and operation. In the case of a production environment, it is recommended that `/var/lib/docker` should mount a drive separately.

- Only x86_64 CPUs are supported, and Arm CPUs are not fully supported at present.

{{</ notice >}}

### Node requirements

- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl`/`tar` should be used in all nodes.

### Container runtimes

Your cluster must have an available container runtime. If you use KubeKey to set up a cluster, KubeKey will install the latest version of Docker by default. Alternatively, you can install Docker or other container runtimes by yourself before you create a cluster.

| Supported Container Runtime | Version |
| --------------------------- | ------- |
| Docker                      | 19.3.8+ |
| containerd   | Latest  |
| CRI-O (experimental, not fully tested)        | Latest  |
| iSula (experimental, not fully tested)        | Latest  |

{{< notice note >}}

A container runtime must be installed in advance if you want to deploy KubeSphere in an offline environment.

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
- Supported CNI plugins: Calico and Flannel. Others (such as Cilium and Kube-OVN) may also work but note that they have not been fully tested.

{{< notice tip >}}

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- A registry mirror (booster) is recommended to be prepared if you have trouble downloading images from `dockerhub.io`. See [Configure a Booster for Installation](../../../faq/installation/configure-booster/) and [Configure registry mirrors for the Docker daemon](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon).

{{</ notice >}}

This example includes three hosts as below with the control plane serving as the taskbox.

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | control plane    | control plane, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## Step 2: Download KubeKey

Follow the step below to download [KubeKey](../kubekey).

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.3.0) of KubeKey. You can change the version number in the command to download a specific version.

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

- Recommended Kubernetes versions for KubeSphere 3.3: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../kubekey/#support-matrix).

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}}

Here are some examples for your reference:

- You can create an example configuration file with default configurations. You can also specify the file with a different filename, or in a different folder.

  ```bash
  ./kk create config [-f ~/myfolder/abc.yaml]
  ```

- You can specify a KubeSphere version that you want to install (for example, `--with-kubesphere v3.3.1`).

  ```bash
  ./kk create config --with-kubesphere [version]
  ```

### 2. Edit the configuration file of a Kubernetes multi-node cluster

A default file `config-sample.yaml` will be created if you do not change the name. Edit the file and here is an example of the configuration file of a multi-node cluster with the control plane.

{{< notice note >}}

To customize Kubernetes related parameters, refer to [Kubernetes Cluster Configurations](../vars/).

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
    control-plane:
    - master
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
```

#### Hosts

List all your machines under `hosts` and add their detailed information as above.

`name`: The hostname of the instance.

`address`: The IP address you use for the connection between the taskbox and other instances through SSH. This can be either the public IP address or the private IP address depending on your environment. For example, some cloud platforms provide every instance with a public IP address which you use to access instances through SSH. In this case, you can provide the public IP address for this field.

`internalAddress`: The private IP address of the instance.

At the same time, you must provide the login information used to connect to each instance. Here are some examples:

- For password login:

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```

  {{< notice note >}}

  In this tutorial, port `22` is the default port of SSH so you do not need to add it in the YAML file. Otherwise, you need to add the port number after the IP address as above.

  {{</ notice >}} 

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
- Make sure port `6443` is not being used by other services before the installation. Otherwise, it may cause conflicts as the default port of the API server is `6443`.

{{</ notice >}}

#### roleGroups

- `etcd`: etcd node names
- `control-plane`: Control plane node names
- `worker`: Worker node names

#### controlPlaneEndpoint (for HA installation only)

The `controlPlaneEndpoint` is where you provide your external load balancer information for an HA cluster. You need to prepare and configure the external load balancer if and only if you need to install multiple control plane nodes. Please note that the address and port should be indented by two spaces in `config-sample.yaml`, and `address` should be your load balancer's IP address. See [HA Configurations](../../../installing-on-linux/high-availability-configurations/ha-configuration/) for details.

#### addons

You can customize persistent storage plugins (for example, NFS Client, Ceph RBD, and GlusterFS) by specifying storage under the field `addons` in `config-sample.yaml`. For more information, see [Persistent Storage Configurations](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/).

KubeKey will install [OpenEBS](https://openebs.io/) to provision [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local) for development and testing environment by default, which is convenient for new users. In this example of multi-node installation, the default storage class (local volume) is used. For production, you can use Ceph/GlusterFS/CSI or commercial products as persistent storage solutions.

{{< notice tip >}}

- You can enable the multi-cluster feature by editing the configuration file. For more information, see [Multi-cluster Management](../../../multicluster-management/).
- You can also select the components you want to install. For more information, see [Enable Pluggable Components](../../../pluggable-components/). For an example of a complete `config-sample.yaml` file, see [this file](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md).

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
  1. After you log into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

Now, you will be able to access the web console of KubeSphere at `<NodeIP>:30880` with the default account and password (`admin/P@88w0rd`).

{{< notice note >}}

To access the console, you may need to configure port forwarding rules depending on your environment. Please also make sure port `30880` is opened in your security group.

{{</ notice >}}

![login](/images/docs/v3.3/installing-on-linux/introduction/multi-node-installation/login.png)

## Enable kubectl Autocompletion

KubeKey doesn't enable kubectl autocompletion. See the content below and turn it on:

{{< notice note >}}

Make sure bash-autocompletion is installed and works.

{{</ notice >}}

```bash
# Install bash-completion
apt-get install bash-completion

# Source the completion script in your ~/.bashrc file
echo 'source <(kubectl completion bash)' >>~/.bashrc

# Add the completion script to the /etc/bash_completion.d directory
kubectl completion bash >/etc/bash_completion.d/kubectl
```

Detailed information can be found [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion).

## Code Demonstration
<script src="https://asciinema.org/a/368752.js" id="asciicast-368752" async></script>
