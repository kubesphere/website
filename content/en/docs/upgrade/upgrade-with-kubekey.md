---
title: "Upgrade with KubeKey"
keywords: "Kubernetes, upgrade, KubeSphere, v3.2.0, KubeKey"
description: "Use KubeKey to upgrade Kubernetes and KubeSphere."
linkTitle: "Upgrade with KubeKey"
weight: 7200
---
KubeKey is recommended for users whose KubeSphere and Kubernetes were both installed by [KubeKey](../../installing-on-linux/introduction/kubekey/). If your Kubernetes cluster was provisioned by yourself or cloud providers, refer to [Upgrade with ks-installer](../upgrade-with-ks-installer/).

This tutorial demonstrates how to upgrade your cluster using KubeKey.

## Prerequisites

- You need to have a KubeSphere cluster running v3.1.x. If your KubeSphere version is v3.0.0 or earlier, upgrade to v3.1.x first.
- Read [Release Notes for 3.1.1](../../release/release-v311/) carefully.
- Back up any important component beforehand.
- Make your upgrade plan. Two scenarios are provided in this document for [all-in-one clusters](#all-in-one-cluster) and [multi-node clusters](#multi-node-cluster) respectively.

## Download KubeKey

Follow the steps below to download KubeKey before you upgrade your cluster.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.1 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.1 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v1.1.1) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

## Upgrade KubeSphere and Kubernetes

Upgrading steps are different for single-node clusters (all-in-one) and multi-node clusters.

{{< notice info >}}

When upgrading Kubernetes, KubeKey will upgrade from one MINOR version to the next MINOR version until the target version. For example, you may see the upgrading process going from 1.16 to 1.17 and to 1.18, instead of directly jumping to 1.18 from 1.16.

{{</ notice >}}

### All-in-one cluster

Run the following command to use KubeKey to upgrade your single-node cluster to KubeSphere v3.2.0 and Kubernetes v1.20.4:

```bash
./kk upgrade --with-kubernetes v1.20.4 --with-kubesphere v3.1.1
```

To upgrade Kubernetes to a specific version, explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.19.0, v1.19.8, v1.19.9
- v1.20.4, v1.20.6
- v1.21.5
- v1.22.1

### Multi-node cluster

#### Step 1: Generate a configuration file using KubeKey

This command creates a configuration file `sample.yaml` of your cluster.

```bash
./kk create config --from-cluster
```

{{< notice note >}}

It assumes your kubeconfig is allocated in `~/.kube/config`. You can change it with the flag `--kubeconfig`.

{{</ notice >}}

#### Step 2: Edit the configuration file template

Edit `sample.yaml` based on your cluster configuration. Make sure you replace the following fields correctly.

- `hosts`: The basic information of your hosts (hostname and IP address) and how to connect to them using SSH.
- `roleGroups.etcd`: Your etcd nodes.
- `controlPlaneEndpoint`: Your load balancer address (optional).
- `registry`: Your image registry information (optional).

{{< notice note >}}

For more information, see [Edit the configuration file](../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file) or refer to the `Cluster` section of [the complete configuration file](https://github.com/kubesphere/kubekey/blob/release-1.1/docs/config-example.md) for more information.

{{</ notice >}}

#### Step 3: Upgrade your cluster
The following command upgrades your cluster to KubeSphere v3.2.0 and Kubernetes v1.20.4:

```bash
./kk upgrade --with-kubernetes v1.20.4 --with-kubesphere v3.1.1 -f sample.yaml
```

To upgrade Kubernetes to a specific version, explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.19.0, v1.19.8, v1.19.9
- v1.20.4, v1.20.6
- v1.21.5
- v1.22.1

{{< notice note >}}

To use new features of KubeSphere v3.2.0, you may need to enable some pluggable components after the upgrade.

{{</ notice >}} 