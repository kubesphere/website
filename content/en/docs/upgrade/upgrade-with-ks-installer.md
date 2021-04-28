---
title: "Upgrade with ks-installer"
keywords: "Kubernetes, upgrade, KubeSphere, v3.1.0"
description: "Use ks-installer to upgrade KubeSphere."
linkTitle: "Upgrade with ks-installer"
weight: 7300
---

ks-installer is recommended for users whose Kubernetes clusters were not set up by [KubeKey](../../installing-on-linux/introduction/kubekey/), but hosted by cloud vendors. This tutorial is for **upgrading KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes beforehand.

## Prerequisites

- You need to have a KubeSphere cluster running v3.0.0. If your KubeSphere version is v2.1.1 or earlier, upgrade to v3.0.0 first.
- Read [Release Notes for 3.1.0](../../release/release-v310/) carefully.
- Back up any important component beforehand.
- Supported Kubernetes versions of KubeSphere v3.1.0: v1.17.x, v1.18.x, v1.19.x or v1.20.x.

## Step 1: Download YAML files

Execute the following commands to download configuration templates.

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

## Step 2: Edit the Configuration File

Synchronize the changes from v3.0.0 to v3.1.0 in `cluster-configuration.yaml`. Note that the storage class and the pluggable components need to be consistent with that of v3.0.0.

You can also enable new pluggable components of KubeSphere v3.1.0 in `cluster-configuration.yaml` to explore more features of the container platform.

## Step 3: Apply YAML files

Execute the following commands to upgrade KubeSphere.

```bash
kubectl apply -f kubesphere-installer.yaml
```

```bash
kubectl apply -f cluster-configuration.yaml
```
