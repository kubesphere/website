---
title: 'Development Practices of CSI Storage Plugins - Part Ⅰ'
author: 'Xin Wang'
createTime: '2019-06-25'
---

Many users will transfer their apps to Kubernetes, where storage underlies applications. As users deploy their apps on the Kubernetes, some existing storage plugins are unable to satisfy the growing needs in terms of both diversity and functionality. This is why we need to accelerate the development of new storage plugins, and integrate QingCloud storage services with Kubernetes and KubeSphere.

## Kubernetes Storage Plugin Classification

In this article, we will focus on the development practices of Kubernetes storage plugins based on CSI. The introduction will be divided into different sections, including the feature, deployment and practice of CSI plugins. We will look at how storage plugins can be classified in this section.

Kubernetes can schedule a certain type of storage plugins for backend storage services, such as the scheduling of GCE storage plugins for the backend GCE storage service. Storage plugins in Kubernetes can be classified into two types: in-tree and out-of-tree.

First, the code of in-tree storage plugins is in the core code repository of Kubernetes and they are running in the core component of Kubernetes. When Kubernetes needs to use a backend storage service, a corresponding in-tree storage plugin will be scheduled, such as the scheduling of in-tree AWS storage plugin for the backend AWS storage service.

Another type of storage plugin is out-of-tree, whose code is independent of the core Kubernetes code. The deployment of out-of-tree plugins is also independent of the core components of Kubernetes. These core components can schedule a certain out-of-tree storage plugin, such as the scheduling of GCE out-of-tree storage plugin for the backend GCE storage service.

![In-tree and Out-of-tree CSI](https://pek3b.qingstor.com/kubesphere-docs/png/20200611113049.png)

## In-tree and Out-of-tree Storage Plugins

From the perspective of functionality, in-tree storage plugins only support a limited number of features, such as the creation, deletion, mounting and uninstallation of storage volumes. By contrast, out-of-tree storage plugins boast rich functionality as they support both basic storage management and snapshot management. For instance, we can create snapshots for a storage volume, delete them or restore a storage volume based on the snapshots.

From the perspective of supported storage classes, in-tree storage plugins only apply to a limited number of types, which means users need to prepare storage systems supported by native Kubernetes themselves. This will restrict their plugin options. If users need to select in-tree storage plugins in Kubernetes, they must refer to the storage servers listed in the official website for interfacing.

Out-of-tree storage plugins, however, support a wide range of storage classes. Out-of-tree storage plugins developed by storage service providers or storage system providers can all be used for Kubernetes. As such, users will have various out-of-tree storage plugins to choose from.

From the perspective of maintenance, the code of in-tree storage plugins is in the core code repository of Kubernetes, which is released together with Kubernetes in a package. In this connection, maintenance does pose a challenge as in-tree storage plugins run in the core components of Kubernetes. That means these components will be affected in the case of an in-tree storage plugin failure. On the contrary, the code of out-of-tree storage plugins is independent of Kubernetes. It can be released separately and it is easy to maintain. In this regard, we can expect that out-of-tree storage plugins will be developed and used more in the future.

Currently, out-of-tree storage plugins can be classified into two types: FlexVolume and CSI. FlexVolume is an out-of-tree plugin interface that has existed in Kubernetes since version 1.2. QingCloud has developed relevant FlexVolume storage plugins. The deployment of FlexVolume storage plugins is a bit more complicated than that of CSI. Besides, FlexVolume supports the basic management features of storage volumes.

CSI, or Container Storage Interface, provides another new storage solution, representing an industry standard among container platforms. Not only is CSI developed for Kubernetes, but also it stands for a universal solution for container platforms. That means as long as storage service providers develop storage plugins that meet CSI standards, they can be used for different container platforms. CSI support was introduced as alpha in Kubernetes v1.9.

The deployment of CSI plugins is relatively simple as they support containerized deployment. In Kubernetes, we can deploy CSI plugins directly through Kubernetes resource objects. CSI provides a powerful plugin solution as it features both storage volume management and snapshot management. As the standard storage solution of CSI sees a rapid development, relevant features will continue to expand. Going forward, we will work to develop and use more storage plugin solutions based on CSI.

In the next blog, we will elaborate on how to develop a CSI plugin, the CSI standard, CSI deployment, and quality management.
