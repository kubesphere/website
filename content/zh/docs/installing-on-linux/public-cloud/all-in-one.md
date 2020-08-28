---
title: "All-in-One Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'The guide for installing all-in-one KubeSphere for developing or testing'

linkTitle: "All-in-One"
weight: 2210
---

For those who are new to KubeSphere and looking for a quick way to discover the platform, the all-in-one mode is your best choice to install it since it is one-click and hassle-free configuration installation with provisioning KubeSphere and Kubernetes on your machine.

- <font color=red>The following instructions are for the default installation without enabling any optional components as we have made them pluggable since v2.1.0. If you want to enable any one, please see the section [Enable Pluggable Components](../all-in-one#enable-pluggable-components) below.</font>
- <font color=red>If your machine has >= 8 cores and >= 16G memory, we recommend you to install the full package of KubeSphere by [enabling optional components](../complete-installation)</font>.

## Prerequisites

If your machine is behind a firewall, you need to open the ports by following the document [Ports Requirement](../port-firewall) for more information.

## Step 1: Prepare Linux Machine

The following describes the requirements of hardware and operating system.

- For `Ubuntu 16.04` OS, it is recommended to select the latest `16.04.5`.
- If you are using Ubuntu 18.04, you need to use the root user to install.
- If the Debian system does not have the sudo command installed, you need to execute the `apt update && apt install sudo` command using root before installation.

### Hardware Recommendation

| System  | Minimum Requirements |
| ------- | ----------- |
| CentOS 7.4 ~ 7.7 (64 bit) | CPU：2 Core,  Memory：4 G, Disk Space：100 G |
| Ubuntu 16.04/18.04 LTS (64 bit)   | CPU：2 Core,  Memory：4 G, Disk Space：100 G |
| Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：2 Core,  Memory：4 G, Disk Space：100 G  |
| Debian Stretch 9.5 (64 bit)| CPU：2 Core,  Memory：4 G, Disk Space：100 G  |

## Step 2: Download Installer Package

Execute the following commands to download Installer 2.1.1 and unpack it.

```bash
curl -L https://kubesphere.io/download/stable/latest > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.1/scripts
```

## Step 3: Get Started with Installation

You should not do anything except executing one command as follows. The installer will complete all things for you automatically including installing/updating dependency packages, installing Kubernetes with default version 1.16.7, storage service and so on.

> Note:
>
> - Generally speaking, do not modify any configuration.
> - KubeSphere installs `calico` by default. If you would like to use a different network plugin, you are allowed to change the configuration in `conf/common.yaml`. You are also allowed to modify other configurations such as storage class, pluggable components, etc.
> - The default storage class is [OpenEBS](https://openebs.io/) which is a kind of [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) to provision persistence storage service. OpenEBS supports [dynamic provisioning PV](https://docs.openebs.io/docs/next/uglocalpv.html#Provision-OpenEBS-Local-PV-based-on-hostpath). It will be installed automatically for your testing purpose.
> - Please refer [storage configurations](../storage-configuration) for supported storage class.
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, and the default subnet for Pod IPs is 10.233.64.0/18, the node IPs must not use the two IP range. You can modify the default subnets `kube_service_addresses` or `kube_pods_subnet` in the file `conf/common.yaml` to avoid conflicts.

**1.** Execute the following command:

```bash
./install.sh
```

**2.** Enter `1` to select `All-in-one` mode and type `yes` if your machine satisfies the requirements to start:

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

**(1).** If you see "Successful" returned after completed, it means the installation is successful. The console service is exposed through nodeport 30880 by default. You may need to bind EIP and configure port forwarding in your environment for outside users to access. Make sure you disable the related firewall.

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

> Note: The information above is saved in a log file that you can view by following the [guide](../verify-components).

**(2).** You will be able to use default account and password to log in the console to take a tour of KubeSphere.

<font color=red>Note: After log in console, please verify the monitoring status of service components in the "Cluster Status". If any service is not ready, please wait patiently untill all components get running up.</font>

![Dashboard](https://pek3b.qingstor.com/kubesphere-docs/png/20191125003158.png)

## Enable Pluggable Components

The guide above is only used for minimal installation by default. You can execute the following command to open the configure map and enable pluggable components. Make sure your cluster has enough CPU and memory in advance, see [Enable Pluggable Components](../pluggable-components).

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

## FAQ

The installer has been tested on Aliyun, AWS, Huawei Cloud, QingCloud and Tencent Cloud. Please check the [results](https://github.com/kubesphere/ks-installer/issues/23) for details. Also please read the [FAQ of installation](../../faq/faq-install).

If you have any further questions please do not hesitate to file issues on [GitHub](https://github.com/kubesphere/kubesphere/issues).
