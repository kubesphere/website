---
title: "Upgrade with ks-installer"
keywords: "kubernetes, upgrade, kubesphere, v3.0.0"
description: "Upgrade KubeSphere with ks-installer"

linkTitle: "Upgrade with ks-installer"
weight: 4020
---

ks-installer is recommended for users whose Kubernetes clusters were not setup via [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package), but hosted by cloud vendors. This tutorial guides to **upgrade KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes on themselves beforehand.

## Prerequisite

- You need to have a KubeSphere cluster running version 2.1.1.

{{< notice warning >}}
If your KubeSphere version is v2.1.0 or earlier, please upgrade to v2.1.1 first.
{{</ notice >}}

- Make sure you read the release notes carefully

{{< notice warning >}}
In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator, IAM, etc. Make sure you back up any important components in case you heavily customized them but not from console.
{{</ notice >}}

## Step 1. Download YAML files

The following are configuration templates.

```
wget https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/kubesphere-installer.yaml
wget https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml
```

## Step 2. Modify the configuration file template

Sync the changes from the v2.1.1 to v3.0.0 into the config section of `cluster-configuration.yaml`. Note that the storage class and the pluggable components need to be consistent with the v2.1.1.

## Step 3. Apply YAML files

```
kubectl apply -f kubesphere-installer.yaml
kubectl apply -f cluster-configuration.yaml
```
