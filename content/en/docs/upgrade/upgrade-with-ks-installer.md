---
title: "Upgrade with ks-installer"
keywords: "Kubernetes, upgrade, KubeSphere, v3.0.0"
description: "Use ks-installer to upgrade KubeSphere."
linkTitle: "Upgrade with ks-installer"
weight: 7300
---

ks-installer is recommended for users whose Kubernetes clusters were not set up through the [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package), but hosted by cloud vendors. This tutorial is for **upgrading KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes themselves beforehand.

## Prerequisites

- You need to have a KubeSphere cluster running version 2.1.1. If your KubeSphere version is v2.1.0 or earlier, upgrade to v2.1.1 first.

- Make sure you read [Release Notes For 3.0.0](../../release/release-v300/) carefully.

    {{< notice warning >}}
In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator and IAM. Make sure you back up any important components if you heavily customized them but not from the console.
    {{</ notice >}}

## Step 1: Download YAML files

Execute the following commands to download configuration templates.

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

## Step 2: Modify the Configuration File

Synchronize the changes from v2.1.1 to v3.0.0 into the configuration section of `cluster-configuration.yaml`. Note that the storage class and the pluggable components need to be consistent with that of v2.1.1.

## Step 3: Apply YAML files

Execute the following commands to upgrade KubeSphere.

```bash
kubectl apply -f kubesphere-installer.yaml
```

```bash
kubectl apply -f cluster-configuration.yaml
```
