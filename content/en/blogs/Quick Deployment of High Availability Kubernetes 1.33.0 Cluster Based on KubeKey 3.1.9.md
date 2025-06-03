---
title: 'Quick Deployment of High Availability Kubernetes 1.33.0 Cluster Based on KubeKey 3.1.9'
tag: 'Kubernetes, KubeKey'
keywords: 'Kubernetes, KubeKey, KubeSphere'
description: 'The KubeKey tool can be used to quickly and efficiently deploy an HA Kubernetes cluster. This article demonstrates how to deploy an HA Kubernetes cluster on AWS.'
createTime: '2025-06-03'
author: 'Ding Xinlei'
snapshot: '/images/blogs/en/Quick Deployment of High-Availability Kubernetes KubeKey en.png'
---

# Quick Deployment of High-Availability Kubernetes 1.33.0 Cluster Using KubeKey 3.1.9

> Author: Ding Xinlei, Cloud-Native Operations Engineer 
> Focused on deep integration of KubeSphere and Kubernetes (K8s), passionate about simplifying Kubernetes operations and enabling enterprise cloud-native transformation.

---

## 🌍 Compatibility Notice

- This guide is optimized for **global users**.
- Default deployment uses **public registries** (`docker.io`, `quay.io`, `ghcr.io`).
- Harbor (private registry) is **optional**, only needed for **offline / air-gapped** environments.
- Timezone is set to `UTC`.
- NTP server is `pool.ntp.org`.

---

## Table of Contents

1. [Background](#1-background) 
2. [Software Versions](#2-software-versions) 
3. [Server Planning](#3-server-planning) 
4. [Host Initialization](#4-host-initialization) 
5. [Package Preparation](#5-package-preparation) 
6. [Optional: Harbor Setup (Offline)](#6-optional-harbor-setup-offline) 
7. [Kubernetes Cluster Installation](#7-kubernetes-cluster-installation) 
8. [KubeSphere Installation](#8-kubesphere-installation) 
9. [Conclusion](#9-conclusion)

---

## 1. Background

### 1.1 KubeKey 3.1.9 Updates

- Support for Kubernetes 1.33.0
- Bug fixes:
  - kubelet cgroup configuration
  - UFW and IPVS issues

### 1.2 Kubernetes 1.33.0 Highlights

- In-place vertical scaling
- Sidecar GA
- Indexed Jobs GA
- Improved ServiceAccount token security
- `kubectl` subresource support
- Dynamic Service CIDR expansion
- Enhanced User Namespaces
- OCI image mounting
- Ordered namespace deletion

---

## 2. Software Versions

| Component      | Version                        |
| -------------- | ------------------------------ |
| OS             | openEuler 22.03 (LTS-SP3) amd64 |
| Docker         | 24.0.9                         |
| Kubernetes     | v1.33.0                        |
| KubeSphere     | v4.1.3                         |
| KubeKey        | v3.1.9                         |

---

## 3. Server Planning

| IP Address      | Hostname      | Role         |
| --------------- | ------------- | ------------ |
| 192.168.118.180 | k8s-master1   | master       |
| 192.168.118.181 | k8s-node01    | worker       |
| 192.168.118.182 | k8s-node02    | worker       |

---

## 4. Host Initialization

### 4.1 Configure Static IP

```shell
vim /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
IPADDR=192.168.118.180
NETMASK=255.255.255.0
GATEWAY=192.168.118.2
DNS1=192.168.118.2
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
DEVICE=ens33
ONBOOT=yes
```

### 4.2 Disable SELinux

```shell
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
setenforce 0
```


### 4.3 Disable Swap for Performance Improvement

```
swapoff -a
vim /etc/fstab
```



### 4.4 Disable Firewalld

```shell
systemctl stop firewalld
systemctl disable firewalld
```

### 4.5 Generate config file
```shell
kk create config
```
It will generate a default configuration file as shown here: https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md.

You can then modify it according to your environment settings.

>Note: The hostname will be updated based on your configuration file.


### 4.6 Install Basic Packages

```shell
kk init os -f config-example.yaml
```


### 4.7  Create Data Directories

```
timezone: "UTC"
ntpServers:
  - pool.ntp.org
```



## 5. Package Preparation

### 5.1 Download KubeKey 

```shell
curl -sSL https://get-kk.kubesphere.io | sh -
```



### 5.2 Prepare `manifest.yaml`

```shell
./kk create manifest --with-kubernetes v1.33.0 --with-registry
vim manifest-sample.yaml
```
Example image sources (use public registries):

```yaml
images:
  - docker.io/library/pause:3.9
  - k8s.gcr.io/kube-apiserver:v1.33.0
  - k8s.gcr.io/kube-controller-manager:v1.33.0
  - k8s.gcr.io/kube-scheduler:v1.33.0
  - docker.io/coredns/coredns:1.9.3
  ...
```

### 5.3 Optional: Export Images (Offline Only)

`kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz`


## 6. Optional: Harbor Setup (Offline)

> Note: Harbor is required only for offline or air-gapped environments.
> Online users can skip this section.

### 6.1 Create Harbor Config (Optional)
```shell
kk create config --with-kubernetes v1.33.0 -f config-sample.yaml
```

Example:

```yaml
registry:
  type: "harbor"
  privateRegistry: "your.harbor.domain"
```
### 6.2 Push Images (Optional)

`./kk artifact image push -f config-sample.yaml -a kubesphere.tar.gz`



## 7. Kubernetes Cluster Installation

### 7.1 Create Cluster

```shell
./kk create cluster -f config-sample.yaml --with-local-storage`
```



### 7.2 Verify Cluster

`kubectl get nodes`


## 8. KubeSphere Installation

### 8.1 Install KubeSphere via Helm

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core ks-core-1.1.5.tgz \
  --set global.imageRegistry=docker.io/ks \
  --set extension.imageRegistry=docker.io/ks \
  --set ksExtensionRepository.image.tag=v1.1.6 \
  --debug \
  --wait
```



### 8.2 Verify Deployment

`kubectl get pods -n kubesphere-system`

Access KubeSphere:

`http://<master-ip>:30880`

Default credentials:

```
Username: admin
Password: P@88w0rd
```



## 9. Conclusion

You have successfully deployed a high-availability Kubernetes 1.33.0 cluster with KubeKey 3.1.9 and KubeSphere 4.1.3.

✅ For online deployments, public registries (`docker.io`, etc.) are used by default.
✅ For offline deployments, Harbor is supported (optional).

You can now customize your cluster with advanced storage, networking, and observability as needed.

Enjoy your cloud-native journey! 🚀