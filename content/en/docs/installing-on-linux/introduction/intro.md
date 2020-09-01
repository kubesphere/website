---
title: "Overview"
keywords: 'Kubernetes, KubeSphere, Linux, Installation'
description: 'Overview of Installing KubeSphere on Linux'

linkTitle: "Overview"
weight: 2110
---

For the installation on Linux, KubeSphere can be installed both in clouds and in on-premises environments, such as AWS EC2, Azure VM and bare metal. Users can install KubeSphere on Linux hosts as they provision fresh Kubernetes clusters. The installation process is easy and friendly. Meanwhile, KubeSphere offers not only the online installer, or [KubeKey](https://github.com/kubesphere/kubekey), but also an air-gapped installation solution for the environment with no Internet access.

As an open-source project on [GitHub](https://github.com/kubesphere), KubeSphere is home to a community with thousands of users. Many of them are running KubeSphere for their production workloads.

Users are provided with multiple installation options. Please note not all options are mutually exclusive. For instance, you can deploy KubeSphere with minimal packages on multiple nodes in an air-gapped environment.

- [All-in-One](../all-in-one): Install KubeSphere on a single node. It is only for users to quickly get familiar with KubeSphere.
- [Multi-Node](../multi-node): Install KubeSphere on multiple nodes. It is for testing or development.
- [Install KubeSphere on Air-gapped Linux](../install-ks-on-linux-airgapped): All images of KubeSphere have been encapsulated into a package. It is convenient for air-gapped installation on Linux machines.
- [High Availability Installation](../master-ha): Install high availability KubeSphere on multiple nodes which is used for the production environment.
- Minimal Packages: Only install the minimum required system components of KubeSphere. Here is the minimum resource requirement:
  - 2vCPUs
  - 4GB RAM
  - 40GB Storage
- [Full Packages](../complete-installation): Install all available system components of KubeSphere such as DevOps, service mesh, and alerting.

For the installation on Kubernetes, see Overview of Installing on Kubernetes.

## Before Installation

- As images will be pulled and operating systems will be downloaded from the Internet, your environment must have Internet access. Otherwise, you need to use the air-gapped installer instead.
- For all-in-one installation, the only one node is both the master and the worker.
- For multi-node installation, you need to specify the node roles in the configuration file before installation.
- Your linux host must have OpenSSH Server installed.
- Please check the [ports requirements](../port-firewall) before installation.

## KubeKey

Developed in Go language, KubeKey represents a brand-new installation tool as a replacement for the ansible-based installer used before. KubeKey provides users with flexible installation choices, as they can install KubeSphere and Kubernetes separately or install them at one time, which is convenient and efficient.

Three scenarios to use KubeKey:

- Install Kubernetes only;
- Install Kubernetes and KubeSphere together in one command;
- Install Kubernetes first, and deploy KubeSphere on it using [ks-installer](https://github.com/kubesphere/ks-installer).

{{< notice note >}}

If you have existing Kubernetes clusters, please refer to [Installing on Kubernetes](https://kubesphere-v3.netlify.app/docs/installing-on-kubernetes/).

{{</ notice >}} 

## Quick Installation for Development and Testing

KubeSphere has decoupled some components since v2.1.0. KubeKey only installs necessary components by default as this way features fast installation and minimal resource consumption. If you want to enable enhanced pluggable functionalities, see [Overview of Pluggable Components](../intro#pluggable-components-overview) for details.

The quick installation of KubeSphere is only for development or testing since it uses local volume for storage by default. If you want a production installation, see HA Cluster Configuration.

- **All-in-one**. It means a single-node hassle-free installation with just one command.
- **Multi-node**. It allows you to install KubeSphere on multiple instances using the default storage class (local volume), which means it is not required to install storage server such as Ceph and GlusterFS.

{{< notice note >}}

For air-gapped installation, please refer to [Install KubeSphere on Air Gapped Linux Machines](../install-ks-on-linux-airgapped).

{{</ notice >}} 

## Install HA KubeSphere on Linux

KubeKey allows users to install a highly available cluster for production. Users need to configure load balancers and persistent storage services in advance.

- [Persistent Storage Configuration](../storage-configuration): By default, KubeKey uses [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage services with dynamic provisioning in Kubernetes clusters. It is convenient for the quick installation of a testing environment. In a production environment, it must have a storage server set up. Please refer to [Persistent Storage Configuration](../storage-configuration) for details.
- [Load Balancer Configuration for HA installation](../master-ha): Before you get started with multi-node installation in a production environment, you need to configure load balancers. Cloud load balancers, Nginx and `HAproxy + Keepalived` all work for the installation.

For more information, see HA Cluster Configuration. You can also see the specific step of HA installations across major cloud providers in Installing on Public Cloud.

## Overview of Pluggable Components

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable, which means you can enable any of them both before and after the installation. By default, KubeKey does not install these pluggable components. For more information, see [Enable Pluggable Components](https://kubesphere.io/docs/pluggable-components/).

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## Storage Configuration Instruction

The following links explain how to configure different types of persistent storage services. Please refer to [Storage Configuration Instruction](../storage-configuration) for detailed instructions regarding how to configure the storage class in KubeSphere.

- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/)
- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)

## Cluster Operation and Maintenance

### Add New Nodes

With KubeKey, you can scale the number of nodes to meet higher resource needs after the installation, especially in a production environment. For more information, see [Add New Nodes](../add-nodes).

### Remove Nodes

You need to drain a node before you remove. For more information, see Remove Nodes.

### Add New Storage Classes

KubeKey allows you to set a new storage class after the installation. You can set different storage classes for KubeSphere itself and your workloads.

For more information, see Add New Storage Classes.

## Uninstall

Uninstalling KubeSphere means it will be removed from the machines, which is irreversible. Please be cautious with the operation.

For more information, see [Uninstall](../uninstall).