---
title: "Air-Gapped Upgrade with ks-installer"
keywords: "Air-Gapped, upgrade, kubesphere, v3.0.0"
description: "Air-Gapped Upgrade KubeSphere"

linkTitle: "Air-Gapped Upgrade with ks-installer"
weight: 4020
---

ks-installer is recommended for users whose Kubernetes clusters were not set up via [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package), but hosted by cloud vendors. This tutorial is for **upgrading KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes themselves beforehand.


## Prerequisites

- You need to have a KubeSphere cluster running version 2.1.1.

{{< notice warning >}}

If your KubeSphere version is v2.1.0 or earlier, please upgrade to v2.1.1 first.

{{</ notice >}}

Download the air-gapped package and YAML file, and upload it to the Kubernetes server.
```bash
# md5: 212091024dca02f8f34323e00f4be81d
wget https://kubesphere-installer.pek3b.qingstor.com/offline/v3.0.0/kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
wget https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/kubesphere-installer.yaml
wget https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml
```
- Docker Registry

You need to have a harbor or other Docker registry.

{{< notice tip >}}

You can [quick start yourself docker registry](https://kubesphere.com.cn/forum/d/2240-docker-registry)

{{</ notice >}}

- Make sure you read [Release Notes For 3.0.0](../../release/release-v300/) carefully.

{{< notice warning >}}

In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator and IAM. Make sure you back up any important components in case you heavily customized them but not from console.

{{</ notice >}}

## Step 1: Push Docker Images

- Unzip upgrade package.

```bash
tar zxvf kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```

- Push docker images to the docker registry.

```bash
cd kubesphere-all-v3.0.0-offline-linux-amd64/kubesphere-images-v3.0.0/
./push-images.sh 192.168.1.5:5000
```

## Step 2: Modify the configuration file template

- Sync the changes from v2.1.1 to v3.0.0 into the config section of `cluster-configuration.yaml`. Note that the storage class and the pluggable components need to be consistent with that of v2.1.1.

- Add private image registry information.
```bash
cd ../../
sed -i '/spec:/a\\  local_registry: "192.168.1.5:5000"' cluster-configuration.yaml
```

- Replace `kubesphere-installer.yaml` with the image address.
```bash
sed -i "s#kubesphere/ks-installer:v3.0.0#192.168.1.5:5000/kubesphere/ks-installer:v3.0.0#g" kubesphere-installer.yaml
```

## Step 3: Apply YAML files

```bash
kubectl apply -f kubesphere-installer.yaml
```

```bash
kubectl apply -f cluster-configuration.yaml
```

## Demo 
<script src="https://asciinema.org/a/367221.js" id="asciicast-367221" async></script>