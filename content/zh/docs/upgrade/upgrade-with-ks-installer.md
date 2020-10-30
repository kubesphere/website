---
title: "Upgrade with ks-installer"
keywords: "kubernetes, upgrade, kubesphere, v3.0.0"
description: "Upgrade KubeSphere with ks-installer"

linkTitle: "Upgrade with ks-installer"
weight: 4020
---

ks-installer is recommended for users whose Kubernetes clusters were not set up via [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package), but hosted by cloud vendors. This tutorial is for **upgrading KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes themselves beforehand.

## Prerequisites

- You need to have a KubeSphere cluster running version 2.1.1.

{{< notice warning >}}
If your KubeSphere version is v2.1.0 or earlier, please upgrade to v2.1.1 first.
{{</ notice >}}

- Make sure you read [Release Notes For 3.0.0](../../release/release-v300/) carefully.

{{< notice warning >}}
In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator and IAM. Make sure you back up any important components in case you heavily customized them but not from console.
{{</ notice >}}

## Step 1: Download YAML files

Execute the following commands to download configuration templates.

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

## Step 2: Modify the configuration file template

Sync the changes from v2.1.1 to v3.0.0 into the config section of `cluster-configuration.yaml`. Note that the storage class and the pluggable components need to be consistent with that of v2.1.1.

## Step 3: Apply YAML files

```bash
kubectl apply -f kubesphere-installer.yaml
```

```bash
kubectl apply -f cluster-configuration.yaml
```