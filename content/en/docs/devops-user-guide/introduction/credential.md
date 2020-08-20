---
title: "Introduction"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'KubeSphere Installation Overview'

linkTitle: "Introduction"
weight: 2110
---

[KubeSphere](https://kubesphere.io/) is an enterprise-grade multi-tenant container platform built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI for users to manage application workloads and computing resources with a few clicks, which greatly reduces the learning curve and the complexity of daily work such as development, testing, operation and maintenance. KubeSphere aims to alleviate the pain points of Kubernetes including storage, network, security and ease of use, etc.

KubeSphere supports installing on cloud-hosted and on-premises Kubernetes cluster, e.g. native K8s, GKE, EKS, RKE, etc. It also supports installing on Linux host including virtual machine and bare metal with provisioning fresh Kubernetes cluster. Both of the two methods are easy and friendly to install KubeSphere. Meanwhile, KubeSphere offers not only online installer, but air-gapped installer for such environment with no access to the internet.

KubeSphere is open source project on [GitHub](https://github.com/kubesphere). There are thousands of users are using KunbeSphere, and many of them are running KubeSphere for their production workloads.

In summary, there are several installation options you can choose. Please note not all options are mutually exclusive. For instance, you can deploy KubeSphere with minimal packages on existing K8s cluster on multiple nodes in air-gapped environment. Here is the decision tree shown in the following graph you may reference for your own situation.

- [All-in-One](../all-in-one): Intall KubeSphere on a singe node. It is only for users to quickly get familar with KubeSphere.
- [Multi-Node](../multi-node): Install KubeSphere on multiple nodes. It is for testing or development.
- [Install KubeSphere on Air Gapped Linux](../install-ks-on-linux-airgapped): All images of KubeSphere have been encapsulated into a package, it is convenient for air gapped installation on Linux machines.
- [High Availability Multi-Node](../master-ha): Install high availability KubeSphere on multiple nodes which is used for production environment.
- [KubeSphere on Existing K8s](../install-on-k8s): Deploy KubeSphere on your Kubernetes cluster including cloud-hosted services such as GKE, EKS, etc.
- [KubeSphere on Air-Gapped K8s](../install-on-k8s-airgapped): Install KubeSphere on a disconnected Kubernetes cluster.
- Minimal Packages: Only install minimal required system components of KubeSphere. The minimum of resource requirement is down to 1 core and 2G memory.
- [Full Packages](../complete-installation): Install all available system components of KubeSphere including DevOps, service mesh, application store, etc.

![Installer Options](https://pek3b.qingstor.com/kubesphere-docs/png/20200305093158.png)

## Before Installation

- As the installation will pull images and update operating system from the internet, your environment must have the internet access. If not, then you need to use the air-gapped installer instead.
- For all-in-one installation, the only one node is both the master and the worker.
- For multi-node installation, you are asked to specify the node roles in the configuration file before installation.
- Your linux host must have OpenSSH Server installed.
- Please check the [ports requirements](../port-firewall) before installation.

## Quick Install For Development and Testing

KubeSphere has decoupled some components since v2.1.0. The installer only installs required components by default which brings the benefits of fast installation and minimal resource consumption. If you want to install any optional component, please check the following section [Pluggable Components Overview](../intro#pluggable-components-overview) for details.

The quick install of KubeSphere is only for development or testing since it uses local volume for storage by default. If you want a production install please refer to the section [High Availability Installation for Production Environment](../intro#high-availability-installation-for-production-environment).

### 1. Install KubeSphere on Linux

- [All-in-One](../all-in-one): It means a single-node hassle-free configuration installation with one-click.
- [Multi-Node](../multi-node): It allows you to install KubeSphere on multiple instances using local volume, which means it is not required to install storage server such as Ceph, GlusterFS.

> Note：With regard to air-gapped installation please refer to [Install KubeSphere on Air Gapped Linux Machines](../install-ks-on-linux-airgapped).

### 2. Install KubeSphere on Existing Kubernetes

You can install KubeSphere on your existing Kubernetes cluster. Please refer [Install KubeSphere on Kubernetes](../install-on-k8s) for instructions.

## High Availability Installation for Production Environment

### 1. Install HA KubeSphere on Linux

KubeSphere installer supports installing a highly available cluster for production with the prerequisites being a load balancer and persistent storage service set up in advance.

- [Persistent Service Configuration](../storage-configuration): By default, KubeSphere Installer uses [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning in Kubernetes cluster. It is convenient for quick install of testing environment. In production environment, it must have a storage server set up. Please refer [Persistent Service Configuration](../storage-configuration) for details.
- [Load Balancer Configuration for HA install](../master-ha): Before you get started with multi-node installation in production environment, you need to configure a load balancer. Either cloud LB or `HAproxy + keepalived` works for the installation.

### 2. Install HA KubeSphere on Existing Kubernetes

Before you install KubeSphere on existing Kubernetes, please check the prerequisites of the installation on Linux described above, and verify the existing Kubernetes to see if it satisfies these prerequisites or not, i.e., a load balancer and persistent storage service.  

If your Kubernetes is ready, please refer [Install KubeSphere on Kubernetes](../install-on-k8s) for instructions.

> You can install KubeSphere on cloud Kubernetes service such as [Installing KubeSphere on GKE cluster](../install-on-gke)

## Pluggable Components Overview

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable, which means you can enable any of them before or after installation. The installer by default does not install the pluggable components. Please check the guide [Enable Pluggable Components Installation](../pluggable-components) for your requirement.

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## Storage Configuration Instruction

The following links explain how to configure different types of persistent storage services. Please refer to [Storage Configuration Instruction](../storage-configuration) for detailed instructions regarding how to configure the storage class in KubeSphere.

- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/)
- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)

## Add New Nodes

KubeSphere Installer allows you to scale the number of nodes, see [Add New Nodes](../add-nodes).

## Uninstall

Uninstall will remove KubeSphere from the machines. This operation is irreversible and dangerous. Please check [Uninstall](../uninstall).
