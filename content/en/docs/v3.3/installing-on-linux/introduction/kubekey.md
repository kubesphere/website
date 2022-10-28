---
title: "KubeKey"
keywords: 'KubeKey, Installation, KubeSphere'
description: 'Understand what KubeKey is and how it works to help you create, scale and upgrade your Kubernetes cluster.'
linkTitle: "KubeKey"
weight: 3120
---

Developed in Go, [KubeKey](https://github.com/kubesphere/kubekey) represents a brand-new installation tool as a replacement for the ansible-based installer used before. KubeKey provides you with flexible installation choices, as you can install Kubernetes only or install both Kubernetes and KubeSphere.

There are several scenarios to use KubeKey:

- Install Kubernetes only;
- Install Kubernetes and KubeSphere together in one command;
- Scale a cluster;
- Upgrade a cluster;
- Install Kubernetes-related add-ons (Chart or YAML).

## How Does KubeKey Work

After you download KubeKey, you use an executable called `kk` to perform different operations. No matter you use it to create, scale or upgrade a cluster, you must prepare a configuration file using `kk` beforehand. This configuration file contains basic parameters of your cluster, such as host information, network configurations (CNI plugin and Pod and Service CIDR), registry mirrors, add-ons (YAML or Chart) and pluggable component options (if you install KubeSphere). For more information, see [an example configuration file](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md).

With the configuration file in place, you execute the `./kk` command with varied flags for different operations. After that, KubeKey automatically installs Docker and pulls all the necessary images for installation. When the installation is complete, you can inspect installation logs.

## Why KubeKey

- The previous ansible-based installer has a bunch of software dependencies such as Python. KubeKey is developed in Go language to get rid of the problem in a variety of environments, making sure the installation is successful.
- KubeKey supports multiple installation options, such as [all-in-one installation](../../../quick-start/all-in-one-on-linux/), [multi-node installation](../multioverview/), and [air-gapped installation](../air-gapped-installation/).
- KubeKey uses Kubeadm to install Kubernetes clusters on nodes in parallel as much as possible in order to reduce installation complexity and improve efficiency. It greatly saves installation time compared to the older installer.
- KubeKey aims to install clusters as an object, i.e., CaaO.

## Download KubeKey

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.3.0) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}}

## Support Matrix

If you want to use KubeKey to install both Kubernetes and KubeSphere 3.3, see the following table of all supported Kubernetes versions.

| KubeSphere version | Supported Kubernetes versions                                |
| ------------------ | ------------------------------------------------------------ |
| v3.3.1             | v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support) |

{{< notice note >}} 

- You can also run `./kk version --show-supported-k8s` to see all supported Kubernetes versions that can be installed by KubeKey.
- The Kubernetes versions that can be installed using KubeKey are different from the Kubernetes versions supported by KubeSphere 3.3. If you want to [install KubeSphere 3.3 on an existing Kubernetes cluster](../../../installing-on-kubernetes/introduction/overview/), your Kubernetes version must be v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).
- If you want to use KubeEdge, you are advised to install Kubernetes v1.22.x or earlier to prevent compatability issues.
{{</ notice >}}