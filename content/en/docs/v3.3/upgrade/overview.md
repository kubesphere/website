---
title: "Upgrade — Overview"
keywords: "Kubernetes, upgrade, KubeSphere, 3.3, upgrade"
description: "Understand what you need to pay attention to before the upgrade, such as versions, and upgrade tools."
linkTitle: "Overview"
weight: 7100
---

## Make Your Upgrade Plan

KubeSphere 3.3 is compatible with Kubernetes 1.19.x, 1.20.x, 1.21.x, 1.22.x, and 1.23.x (experimental support):

- Before you upgrade your cluster to KubeSphere 3.3, you need to have a KubeSphere cluster running v3.2.x.
- If your existing KubeSphere v3.1.x cluster is installed on Kubernetes 1.19.x+, you can choose to only upgrade KubeSphere to 3.3 or upgrade Kubernetes (to a higher version) and KubeSphere (to 3.3) at the same time.

## Before the Upgrade

{{< notice warning >}}

- You are supposed to implement a simulation for the upgrade in a testing environment first. After the upgrade is successful in the testing environment and all applications are running normally, upgrade your cluster in your production environment.
- During the upgrade process, there may be a short interruption of applications (especially for those single-replica Pods). Please arrange a reasonable period of time for your upgrade.
- It is recommended to back up etcd and stateful applications before in production. You can use [Velero](https://velero.io/) to implement the backup and migrate Kubernetes resources and persistent volumes.

{{</ notice >}}

## Upgrade Tool

Depending on how your existing cluster was set up, you can use KubeKey or ks-installer to upgrade your cluster. It is recommended that you [use KubeKey to upgrade your cluster](../upgrade-with-kubekey/) if it was created by KubeKey. Otherwise, [use ks-installer to upgrade your cluster](../upgrade-with-ks-installer/).