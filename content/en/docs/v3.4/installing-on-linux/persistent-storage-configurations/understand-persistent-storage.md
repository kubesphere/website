---
title: "Understand Persistent Storage Installation"
keywords: 'KubeSphere, Kubernetes, storage, installation, configuration'
description: 'Understand how to use KubeKey to install different storage systems.'
linkTitle: "Understand Persistent Storage Installation"
weight: 3310
version: "v3.4"
---

Persistent volumes are a **must** for installing KubeSphere. When you use [KubeKey](../../../installing-on-linux/introduction/kubekey/) to set up a KubeSphere cluster, you can install different storage systems as [add-ons](https://github.com/kubesphere/kubekey/blob/master/docs/addons.md). The general steps of installing KubeSphere by KubeKey on Linux are:

1. Install Kubernetes.
2. Install any provided add-ons.
3. Install KubeSphere by [ks-installer](https://github.com/kubesphere/ks-installer).

In the second step, an available StorageClass **must** be installed. It includes:

- The StorageClass itself
- The storage plugin for the StorageClass if necessary

{{< notice note >}}

Some storage systems require you to prepare a storage server in advance to provide external storage services. 

{{</ notice >}} 

## How Does KubeKey Install Different Storage Systems

KubeKey creates [a configuration file](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file) (`config-sample.yaml` by default) for your cluster which contains all the necessary parameters you can define for different resources, including various add-ons. Different storage systems, such as QingCloud CSI, can also be installed as add-ons by Helm charts or YAML. To let KubeKey install them in the desired way, you must provide KubeKey with necessary configurations of these storage systems.

There are generally two ways for you to let KubeKey apply configurations of the storage system to be installed.

1. Enter necessary parameters under the `addons` field directly in `config-sample.yaml`.
2. Create a separate configuration file for your add-on to list all the necessary parameters and provide the path of the file in `config-sample.yaml` so that KubeKey can reference it during installation.

For more information, see [add-ons](https://github.com/kubesphere/kubekey/blob/master/docs/addons.md).

## Default Storage Class

KubeKey supports the installation of different storage plugins and storage classes. No matter what storage systems you will be installing, you can specify whether it is a default storage class in its configuration file. If KubeKey detects that no default storage class is specified, it will install [OpenEBS](https://github.com/openebs/openebs) by default.

OpenEBS Dynamic Local PV provisioner can create Kubernetes Local Persistent Volumes using a unique HostPath (directory) on the node to persist data. It is very convenient for users to get started with OpenEBS when they have no specific storage system.

## Multi-storage Solutions

If you intend to install more than one storage plugins, only one of them can be set as the default storage class. Otherwise, KubeKey will be confused about which storage class to use.

## Supported CSI Plugins

Kubernetes has announced that in-tree volume plugins will be removed from Kubernetes in version 1.21. For more information, see [Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/). Therefore, it is recommended that you install CSI plugins instead.

Supported CSI plugins:

- [neonsan-csi](https://github.com/yunify/qingstor-csi)
- [qingcloud-csi](../install-qingcloud-csi/)
- [ceph-csi](../install-ceph-csi-rbd/)
