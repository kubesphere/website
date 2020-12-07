---
title: "Upgrade with KubeKey"
keywords: "Kubernetes, upgrade, KubeSphere, v3.0.0, KubeKey"
description: "Upgrade KubeSphere with kubekey"

linkTitle: "Upgrade with KubeKey"
weight: 7200
---
KubeKey is recommended for users whose KubeSphere and Kubernetes were both deployed by [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package). If your Kubernetes cluster was provisioned by yourself or cloud providers, please refer to [Upgrade with ks-installer](../upgrade-with-ks-installer).

## Prerequisites

- You need to have a KubeSphere cluster running version 2.1.1.

    {{< notice warning >}}
If your KubeSphere version is v2.1.0 or earlier, please upgrade to v2.1.1 first.
    {{</ notice >}}

- Download KubeKey.

{{< tabs >}}

{{< tab "For users with good network connections to GitHub" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tab >}}

{{< tab "For users with poor network connections to GitHub" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

After you download KubeKey, If you transfer it to a new machine also with poor network connections to GitHub, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v1.0.1) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

- Make sure you read [Release Notes For 3.0.0](../../release/release-v300/) carefully.

    {{< notice warning >}}
In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator and IAM. Make sure you back up any important components in case you heavily customized them but not from console.
    {{</ notice >}}

- Make your upgrade plan. Two upgrading scenarios are documented below.

## Upgrade KubeSphere and Kubernetes

Upgrading steps are different for single-node clusters (all-in-one) and multi-node clusters.

{{< notice info >}}

- Upgrading with Kubernetes will cause helm to be upgraded from v2 to v3. If you want to continue using helm2, please back up it: `cp /usr/local/bin/helm /usr/local/bin/helm2`
- When upgrading Kubernetes, KubeKey will upgrade from one MINOR version to the next MINOR version until the target version. For example, you may see the upgrading process going from 1.16 to 1.17 and to 1.18, instead of directly jumping to 1.18 from 1.16.

{{</ notice >}}

### All-in-one Cluster

The following command upgrades your single-node cluster to KubeSphere v3.0.0 and Kubernetes v1.17.9 (default):

```bash
./kk upgrade --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

To upgrade Kubernetes to a specific version, please explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.15.12
- v1.16.8, v1.16.10, v1.16.12, v1.16.13
- v1.17.0, v1.17.4, v1.17.5, v1.17.6, v1.17.7, v1.17.8, v1.17.9
- v1.18.3, v1.18.5, v1.18.6

### Multi-node Cluster

#### Step1: Generate a configuration file with KubeKey

This command creates a configuration file `config-sample.yaml` from your cluster.

```bash
./kk create config --from-cluster
```

{{< notice note >}}

It assumes your kubeconfig is allocated in `~/.kube/config`. You can change it with the flag `--kubeconfig`.

{{</ notice >}}

#### Step 2: Modify the configuration file template

Modify `config-sample.yaml` to fit your cluster setup. Make sure you replace the following fields correctly.

- `hosts`: Input connection information among your hosts.
- `roleGroups.etcd`: Input etcd members.
- `controlPlaneEndpoint`: Input your load balancer address (Optional).
- `registry`: Input image registry information (Optional).

{{< notice note >}}

Please refer to the `Cluster` section of [config-example.yaml](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) for more information.

{{</ notice >}}

#### Step 3: Upgrade your cluster
The following command upgrades your cluster to KubeSphere v3.0.0 and Kubernetes v1.17.9 (default):

```bash
./kk upgrade --with-kubernetes v1.17.9 --with-kubesphere v3.0.0 -f config-sample.yaml
```

To upgrade Kubernetes to a specific version, please explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.15.12
- v1.16.8, v1.16.10, v1.16.12, v1.16.13
- v1.17.0, v1.17.4, v1.17.5, v1.17.6, v1.17.7, v1.17.8, v1.17.9
- v1.18.3, v1.18.5, v1.18.6
