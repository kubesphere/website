---
title: "Upgrade with ks-installer"
keywords: "Kubernetes, upgrade, KubeSphere, v3.3.0"
description: "Use ks-installer to upgrade KubeSphere."
linkTitle: "Upgrade with ks-installer"
weight: 7300
---

ks-installer is recommended for users whose Kubernetes clusters were not set up by [KubeKey](../../installing-on-linux/introduction/kubekey/), but hosted by cloud vendors or created by themselves. This tutorial is for **upgrading KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes beforehand.

## Prerequisites

- You need to have a KubeSphere cluster running v3.2.x. If your KubeSphere version is v3.1.x or earlier, upgrade to v3.2.x first.
- Read [Release Notes for 3.3.0](../../../v3.3/release/release-v330/) carefully.
- Back up any important component beforehand.
- Supported Kubernetes versions of KubeSphere 3.3.0: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).

## Apply ks-installer

Run the following command to upgrade your cluster.

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.0/kubesphere-installer.yaml  --force
```

## Enable Pluggable Components

You can [enable new pluggable components](../../pluggable-components/overview/) of KubeSphere 3.3.0 after the upgrade to explore more features of the container platform.

