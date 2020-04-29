---
title: "all-in-one"
weight: 2
---

## All-in-One Installation

For those who are new to KubeSphere and looking for a quick way to discover the platform, the all-in-one mode is your best choice to install it since it is one-click and hassle-free configuration installation with provisioning KubeSphere and Kubernetes on your machine.

## Prerequisites

If your machine is behind a firewall, you need to open the ports by following the document [Ports Requirement](https://kubesphere.io/docs/v2.1/en/installation/port-firewall/) for more information.

## Step 1: Prepare Linux Machine

A Linux machine that is either a virtual machine or bare metal. This machine requires at a minimum:

- Hardware:

    - CPU: 2 Cores for minimal, 8 Cores for complete setup
    - Memory: 4 GB for minimal, 16 GB for complete setup

- Operating Systems:

    - CentOS 7.4 ~ 7.7 (`64-bit`)
    - Ubuntu 16.04/18.04 LTS (`64-bit`)
    - RHEL 7.4 (`64-bit`)
    - Debian Stretch 9.5 (`64-bit`)


> - For `Ubuntu 16.04` OS, it's recommended to select the latest `16.04.5`.
> - If you are using Ubuntu 18.04, you need to use the root user to install.
> - If the Debian system does not have the sudo command installed, you need to execute the `apt update && apt install sudo` command using root before installation.

## Step 2: Download Installer Package

Execute the following commands to download Installer 2.1.1 and unpack it.

```bash
$ curl -L https://kubesphere.io/download/stable/latest > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.1/scripts
```

> Please note: the installer will be started with a default minimal installation only, if there are 8 Cores and 16 GB RAM available in your machine, please enable more pluggable components in `kubesphere-all-v2.1.1/conf/common.yaml`, see [Complete Installation](https://kubesphere.io/docs/v2.1/en/installation/complete-installation/)

## Step 3: Get Started with Installation

You should not do anything except executing one command as follows. The installer will complete all things for you automatically including install/update dependency packages, install Kubernetes (Defaults to 1.16.7), storage service and so on.

**Note:**

> - Generally speaking, do not modify any configuration.
> - KubeSphere installs `calico` by default. If you would like to use a different network plugin, you are allowed to change the configuration in `conf/common.yaml`. You are also allowed to modify other configurations such as storage class, pluggable components, etc.
> - The default storage class is [OpenEBS](https://openebs.io/) which is a kind of [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) to provision persistence storage service. OpenEBS supports [dynamic provisioning PV](https://docs.openebs.io/docs/next/uglocalpv.html#Provision-OpenEBS-Local-PV-based-on-hostpath). It will be installed automatically for your testing environment.
> - Please refer [storage configurations](https://kubesphere.io/docs/v2.1/en/installation/storage-configuration/) for supported storage class.
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, and the default subnet for Pod IPs is 10.233.64.0/18, the node IPs must not use the two IP range. You can modify the default subnets `kube_service_addresses` or `kube_pods_subnet` in the file `conf/common.yaml` to avoid conflicts.


**1.** Execute the following command:

```
$ ./install.sh
```

**2.** Enter `1` to select `all-in-one` mode to start:

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2020-02-24
################################################
Please input an option: 1
```

**3.** Verify if KubeSphere is installed successfully or not：

**(1).** If you see "Successful" returned after installation completed, it means your environment is ready to use. The console service is exposed through nodeport 30880 by default.

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.8:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```

> Note: The information above is saved in a log file that you can view by following the [guide](https://kubesphere.io/docs/v2.1/en/installation/verify-components/).


**(2).** You will be able to use default account and password to log in the console to take a tour of KubeSphere.

<font color=red>Note: After log in console, please verify the monitoring status of service components in the "Cluster Status". If any service is not ready, please wait patiently untill all components get running up.</font>

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191125003158.png)

### Enable Pluggable Components

If you start with a default minimal installation, execute the following command to open the configmap in order to enable more pluggable components at your will. Make sure your cluster has enough CPU and memory, see [Enable Pluggable Components](https://kubesphere.io/docs/v2.1/en/installation/pluggable-components/).

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

### FAQ

If you have further questions please do not hesitate to raise issues on [GitHub](https://github.com/kubesphere/kubesphere/issues).

