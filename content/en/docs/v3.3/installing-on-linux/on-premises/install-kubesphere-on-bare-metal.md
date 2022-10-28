---
title: "Deploy Kubernetes and Kubesphere on Bare Metal"
keywords: 'Kubernetes, KubeSphere, bare-metal'
description: 'Learn how to create a multi-node cluster with one master on bare metal.'
linkTitle: "Deploy KubeSphere on Bare Metal"
weight: 3520
---

## Introduction

In addition to the deployment on cloud, KubeSphere can also be installed on bare metal. As the virtualization layer is removed, the infrastructure overhead is drastically reduced, which brings more compute and storage resources to app deployments. As a result, hardware efficiency is improved. Refer to the example below to deploy KubeSphere on bare metal.

## Prerequisites

- Make sure you already know how to install KubeSphere on a multi-node cluster based on the tutorial [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/).
- Server and network redundancy in your environment.
- For a production environment, it is recommended that you prepare persistent storage and create a StorageClass in advance. For development and testing, you can use the integrated OpenEBS to provision LocalPV as the storage service directly.

## Prepare Linux Hosts

This tutorial uses 3 physical machines of **DELL 620 Intel (R) Xeon (R) CPU E5-2640 v2 @ 2.00GHz (32G memory)**, on which **CentOS Linux release 7.6.1810 (Core)** will be installed for the minimal deployment of KubeSphere.

### Install CentOS

Download and install the [image](https://www.centos.org/download/) first, and CentOS Linux release 7.6.1810 (Core) is recommended. Make sure you allocate at least 200 GB to the root directory where it stores docker images (you can skip this if you are installing KubeSphere for testing).

For more information about the supported systems, see [System Requirements](../../../installing-on-linux/introduction/multioverview/). 

Here is a list of the three hosts for your reference.


| Host IP | Host Name | Role |
| --- | --- | --- |
|192.168.60.152|master1|master1, etcd|
|192.168.60.153|worker1|worker|
|192.168.60.154|worker2|worker|

### NIC settings

1. Clear NIC configurations.

   ```bash
   ifdown em1
   ```
   
   ```bash
   ifdown em2
   ```
   
   ```bash
   rm -rf /etc/sysconfig/network-scripts/ifcfg-em1
   ```
   
   ```bash
   rm -rf /etc/sysconfig/network-scripts/ifcfg-em2
   ```

2. Create the NIC bonding.

   ```bash
   nmcli con add type bond con-name bond0 ifname bond0 mode 802.3ad ip4 192.168.60.152/24 gw4 192.168.60.254
   ```

3. Set the bonding mode.

   ```bash
   nmcli con mod id bond0 bond.options mode=802.3ad,miimon=100,lacp_rate=fast,xmit_hash_policy=layer2+3
   ```

4. Bind the physical NIC.

   ```bash
   nmcli con add type bond-slave ifname em1 con-name em1 master bond0
   ```

   ```bash
   nmcli con add type bond-slave ifname em2 con-name em2 master bond0
   ```

5. Change the NIC mode.

   ```bash
   vi /etc/sysconfig/network-scripts/ifcfg-bond0
   BOOTPROTO=static
   ```

6. Restart Network Manager.

   ```bash
   systemctl restart NetworkManager
   ```

   ```bash
   nmcli con # Display NIC information
   ```

7. Change the host name and DNS.

   ```bash
   hostnamectl set-hostname worker-1
   ```

   ```bash
   vim /etc/resolv.conf
   ```

### Time settings

1. Synchronize time.

   ```bash
   yum install -y chrony
   ```
   
   ```bash
   systemctl enable chronyd
   ```
   
   ```bash
   systemctl start chronyd
   ```
   
   ```bash
   timedatectl set-ntp true
   ```

2. Set the time zone.

   ```bash
   timedatectl set-timezone Asia/Shanghai
   ```

3. Check if the ntp-server is available.

   ```bash
   chronyc activity -v
   ```

### Firewall settings

Execute the following commands to stop and disable the FirewallD service:

```bash
iptables -F
```

```bash
systemctl status firewalld
```

```bash
systemctl stop firewalld
```

```bash
systemctl disable firewalld
```

### Package updates and dependencies

Execute the following commands to update system packages and install dependencies.

```bash
yum update
```

```bash
yum install openssl openssl-devel
```

```bash
yum install socat
```

```bash
yum install epel-release
```

```bash
yum install conntrack-tools
```

{{< notice note >}} 

You may not need to install all the dependencies depending on the Kubernetes version to be installed. For more information, see [Dependency Requirements](../../../installing-on-linux/introduction/multioverview/).

{{</ notice >}} 

## Download KubeKey

[Kubekey](https://github.com/kubesphere/kubekey) is the next-gen installer which provides an easy, fast and flexible way to install Kubernetes and KubeSphere.

Follow the step below to download KubeKey.

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

## Create a Multi-node Cluster

With KubeKey, you can install Kubernetes and KubeSphere together. You have the option to create a multi-node cluster by customizing parameters in the configuration file.

Create a Kubernetes cluster with KubeSphere installed (for example, `--with-kubesphere v3.3.1`):

```bash
./kk create config --with-kubernetes v1.22.10 --with-kubesphere v3.3.1
```

{{< notice note >}} 

- Recommended Kubernetes versions for KubeSphere 3.3: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../../installing-on-linux/introduction/kubekey/#support-matrix).

- If you do not add the flag `--with-kubesphere` in the command above, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}} 

A default file `config-sample.yaml` will be created. Modify it according to your environment.

```bash
vi config-sample.yaml
```

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: config-sample
spec:
  hosts:
  - {name: master1, address: 192.168.60.152, internalAddress: 192.168.60.152, user: root, password: P@ssw0rd}
  - {name: worker1, address: 192.168.60.153, internalAddress: 192.168.60.153, user: root, password: P@ssw0rd}
  - {name: worker2, address: 192.168.60.154, internalAddress: 192.168.60.154, user: root, password: P@ssw0rd}
  roleGroups:
    etcd:
    - master1
    control-plane:
    - master1
    worker:
    - worker1
    - worker2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""                    
    port: 6443
```
Create a cluster using the configuration file you customized above:

```bash
./kk create cluster -f config-sample.yaml
```

#### Verify the installation

After the installation finishes, you can inspect the logs of installation by executing the command below:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

If you can see the welcome log return, it means the installation is successful.

```bash
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://192.168.60.152:30880
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

#### Log in to the console

You will be able to use default account and password `admin/P@88w0rd` to log in to the console `http://{$IP}:30880` to take a tour of KubeSphere. Please change the default password after login.

#### Enable pluggable components (Optional)
The example above demonstrates the process of a default minimal installation. To enable other components in KubeSphere, see [Enable Pluggable Components](../../../pluggable-components/) for more details.

## System Improvements

- Update your system.

   ```bash
   yum update
   ```

- Add the required options to the kernel boot arguments:

   ```bash
   sudo /sbin/grubby --update-kernel=ALL --args='cgroup_enable=memory cgroup.memory=nokmem swapaccount=1'
   ```

- Enable the `overlay2` kernel module.

   ```bash
   echo "overlay2" | sudo tee -a /etc/modules-load.d/overlay.conf
   ```

- Refresh the dynamically generated grub2 configuration.

   ```bash
   sudo grub2-set-default 0
   ```

- Adjust kernel parameters and make the change effective.

   ```bash
   cat <<EOF | sudo tee -a /etc/sysctl.conf
   vm.max_map_count = 262144
   fs.may_detach_mounts = 1
   net.ipv4.ip_forward = 1
   vm.swappiness=1
   kernel.pid_max =1000000
   fs.inotify.max_user_instances=524288
   EOF
   sudo sysctl -p
   ```

- Adjust system limits.

   ```bash
   vim /etc/security/limits.conf
   *                soft    nofile         1024000
   *                hard    nofile         1024000
   *                soft    memlock        unlimited
   *                hard    memlock        unlimited
   root             soft    nofile         1024000
   root             hard    nofile         1024000
   root             soft    memlock        unlimited
   ```

- Remove the previous limit configuration.

   ```bash
   sudo rm /etc/security/limits.d/20-nproc.conf
   ```

- Reboot the system.

   ```bash
   reboot
   ```
