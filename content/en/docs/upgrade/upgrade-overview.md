---
title: "Overview"
keywords: "Kubernetes, upgrade, KubeSphere, v3.0.0, upgrade"
description: "KubeSphere Upgrade Overview"

linkTitle: "Overview"
weight: 4010
---

## Kubernetes

KubeSphere v3.0.0 is compatible with Kubernetes 1.15.x, 1.16.x, 1.17.x and 1.18.x:

- If your KubeSphere v2.1.x is installed on Kubernetes 1.15.x+, you can choose to only upgrade KubeSphere to v3.0.0 or upgrade Kubernetes (to a higher version) and  KubeSphere (to v3.0.0) at the same time.

- If your KubeSphere v2.1.x is installed on Kubernetes 1.14.x, you have to upgrade Kubernetes (to 1.15.x+) and KubeSphere (to v3.0.0 ) at the same time.

{{< notice warning >}}
There are some significant API changes in Kubernetes 1.16.x compared with prior versions 1.14.x and 1.15.x. Please refer to [Deprecated APIs Removed In 1.16: Here’s What You Need To Know](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) for more details. So if you plan to upgrade from Kubernetes 1.14.x/1.15.x to 1.16.x+, you have to migrate some of your workloads after upgrading.

{{</ notice >}}

## Before Upgrade

{{< notice warning >}}
- You are supposed to implement a simulation for the upgrade in a testing environment first. After the upgrade is successful in the testing environment and all applications are running normally, upgrade it in your production environment.
- During the upgrade process, there may be a short interruption of applications (especially for those single-replica Pod). Please arrange a reasonable period of time for upgrade.
- It is recommended to back up ETCD and stateful applications before upgrading in a production environment. You can use [Velero](https://velero.io/) to implement backup and migrate Kubernetes resources and persistent volumes.

{{</ notice >}}

## How

A brand-new installer [KubeKey](https://github.com/kubesphere/kubekey) is introduced in KubeSphere v3.0.0, with which you can install or upgrade Kubernetes and KubeSphere. More details about upgrading with [KubeKey](https://github.com/kubesphere/kubekey) will be covered in [Upgrade with KubeKey](../upgrade-with-kubekey/).

## KubeKey or ks-installer?

[ks-installer](https://github.com/kubesphere/ks-installer/tree/master) was the main installation tool as of KubeSphere v2. For users whose Kubernetes clusters were NOT deployed via [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package), they should choose ks-installer to upgrade KubeSphere. For example, if your Kubernetes is hosted by cloud vendors or self provisioned, please refer to [Upgrade with ks-installer](../upgrade-with-ks-installer).
