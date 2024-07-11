---
title: '鲲鹏（ARM64）+麒麟（Kylin v10）离线部署 KubeSphere'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, Kylin, ARM '
description: '本文将详细介绍，如何基于鲲鹏 CPU（ARM64）和操作系统 Kylin V10 SP2/SP3，利用 KubeKey 制作 KubeSphere 和 Kubernetes 离线安装包，并实战部署 KubeSphere 3.3.1 和 Kubernetes 1.22.12 集群。'
createTime: '2024-07-11'
author: '天行1st'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-on-arm-kylin-offlin-cover.png'
---

本文将详细介绍，如何基于鲲鹏 CPU（ARM64）和操作系统 Kylin V10 SP2/SP3，利用 KubeKey 制作 KubeSphere 和 Kubernetes 离线安装包，并实战部署 KubeSphere 3.3.1 和 Kubernetes 1.22.12 集群。

实战服务器配置

| **主机名** | **IP**        | **CPU**     | **OS**        | **用途**                       |
| ---------- | ------------- | ----------- | ------------- | ------------------------------ |
| master-1   | 192.168.10.2  | Kunpeng-920 | Kylin V10 SP2 | 离线环境 KubeSphere/k8s-master |
| master-2   | 192.168.10.3  | Kunpeng-920 | Kylin V10 SP2 | 离线环境 KubeSphere/k8s-master |
| master-3   | 192.168.10.4  | Kunpeng-920 | Kylin V10 SP2 | 离线环境 KubeSphere/k8s-master |
| deploy     | 192.168.200.7 | Kunpeng-920 | Kylin V10 SP3 | 联网主机用于制作离线包         |

实战环境涉及软件版本信息

- 服务器芯片: **Kunpeng-920**
- 操作系统：**麒麟 V10 SP2 aarch64**
- Docker: **24.0.7**
- Harbor: **v2.7.1**
- KubeSphere：**v3.3.1**
- Kubernetes：**v1.22.12**
- KubeKey: **v2.3.1**

## 1. 本文简介

本文介绍了如何在 **麒麟 V10 aarch64** 架构服务器上制品和离线部署 KubeSphere 和 Kubernetes 集群。我们将使用 KubeSphere 开发的 KubeKey 工具实现自动化部署，在三台服务器上实现高可用模式最小化部署 Kubernetes 集群和 KubeSphere。

KubeSphere 和 Kubernetes 在 ARM 架构 和 X86 架构的服务器上部署，最大的区别在于所有服务使用的**容器镜像架构类型**的不同，KubeSphere 开源版对于 ARM 架构的默认支持可以实现 KubeSphere-Core 功能，即可以实现最小化的 KubeSphere 和完整的 Kubernetes 集群的部署。当启用了 KubeSphere 可插拔组件时，会遇到个别组件部署失败的情况，需要我们手工替换官方或是第三方提供的 ARM 版镜像或是根据官方源码手工构建 ARM 版镜像。如果需要实现开箱即用及更多的技术支持，则需要购买企业版的 KubeSphere。

### 1.1 确认操作系统配置

在执行下文的任务之前，先确认操作系统相关配置。

- 操作系统类型

```
[root@localhost ~]# cat /etc/os-release
NAME="Kylin Linux Advanced Server"
VERSION="V10 (Halberd)"
ID="kylin"
VERSION_ID="V10"
PRETTY_NAME="Kylin Linux Advanced Server V10 (Halberd)"
ANSI_COLOR="0;31
```

- 操作系统内核

```
[root@node1 ~]# uname -r
Linux node1 4.19.90-52.22.v2207.ky10.aarch64
```

- 服务器 CPU 信息

```
[root@node1 ~]# lscpu
Architecture:                    aarch64
CPU op-mode(s):                  64-bit
Byte Order:                      Little Endian
CPU(s):                          32
On-line CPU(s) list:             0-31
Thread(s) per core:              1
Core(s) per socket:              1
Socket(s):                       32
NUMA node(s):                    2
Vendor ID:                       HiSilicon
Model:                           0
Model name:                      Kunpeng-920
Stepping:                        0x1
BogoMIPS:                        200.00
NUMA node0 CPU(s):               0-15
NUMA node1 CPU(s):               16-31
Vulnerability Itlb multihit:     Not affected
Vulnerability L1tf:              Not affected
Vulnerability Mds:               Not affected
Vulnerability Meltdown:          Not affected
Vulnerability Spec store bypass: Not affected
Vulnerability Spectre v1:        Mitigation; __user pointer sanitization
Vulnerability Spectre v2:        Not affected
Vulnerability Srbds:             Not affected
Vulnerability Tsx async abort:   Not affected
Flags:                           fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma dcpop asimddp asimdfhm
```

## 2. 安装 K8s 依赖服务

本文增加了一台能联网的 **deploy** 节点，用来制作离线部署资源包。由于 **Harbor** 官方不支持 ARM，先使用在线安装 KubeSphere，后续根据 KubeKey 生成的文件作为伪制品。故在 192.168.200.7 服务器以单节点形式部署 KubeSphere。

### 2.1 部署 Docker 和 docker-compose

具体可参考 [鲲鹏+欧拉部署 KubeSphere3.4](https://yiszrebrp2h.feishu.cn/docx/SSgRdobX7oVAgDxyXpucqCrNnFd)

安装包-百度云： https://pan.baidu.com/s/1lKtCRqxGMUxyumd4XIz4Bg?pwd=4ct2 

解压后执行其中的 install.sh。

### 2.2 部署 Harbor 仓库

安装包-百度云： https://pan.baidu.com/s/1fL69nDOG5j92bEk84UQk7g?pwd=uian 

解压后执行其中的 install.sh。

### 2.3 下载麒麟系统 K8s 依赖包

```
mkdir -p /root/kubesphere/k8s-init
# 该命令将下载
yum -y install openssl socat conntrack ipset ebtables chrony ipvsadm --downloadonly --downloaddir /root/kubesphere/k8s-init
# 编写安装脚本
vim install.sh
#!/bin/bash
#

rpm -ivh *.rpm --force --nodeps

# 打成压缩包，方便离线部署使用
tar -czvf k8s-init-Kylin_V10-arm.tar.gz ./k8s-init/*
```

### 2.4 下载镜像

下载 KubeSphere 3.3.1 所需要的 ARM 镜像。

```
#!/bin/bash
#
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.3.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.3.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.3.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.3.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs:v3.3.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/alpine:3.14
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.22.12
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.22.12
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.12
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.22.12
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:3.3.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.23.2
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.23.2
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.23.2
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.23.2
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics:v2.5.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit:v1.8.11
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader:v0.55.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator:v0.55.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/thanos:v0.25.2
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus:v2.34.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator:v0.13.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter:v1.3.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.22.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager:v1.4.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar:v3.2.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator:v1.4.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager:v0.23.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.11.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/docker:19.03
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.5
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload:v0.5.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector:1.1
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/redis:5.0.14-alpine
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.3
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch:2.6.0
docker pull registry.cn-beijing.aliyuncs.com/kubesphereio/busybox:latest
docker pull kubesphere/fluent-bit:v2.0.6
```

这里使用 KubeSphere 阿里云镜像，其中有些镜像会下载失败。对于下载失败的镜像，可通过本地电脑，直接去 hub.docker.com 下载。例如：

```
docker pull kubesphere/fluent-bit:v2.0.6 --platform arm64
#官方ks-console:v3.3.1(arm版)在麒麟中跑不起来，据运维有术介绍，需要使用node14基础镜像。当在鲲鹏服务器准备自己构建时报错淘宝源https过期，使用https://registry.npmmirror.com仍然报错，于是放弃使用该3.3.0镜像，重命名为3.3.1
docker pull zl862520682/ks-console:v3.3.0
docker tag zl862520682/ks-console:v3.3.0 dockerhub.kubekey.local/kubesphereio/ks-console:v3.3.1
## mc和minio也需要重新拉取打tag
docker pull minio/minio:RELEASE.2020-11-25T22-36-25Z-arm64
docker tag  minio/minio:RELEASE.2020-11-25T22-36-25Z-arm64 dockerhub.kubekey.local/kubesphereio/minio:RELEASE
```

### 2.5 重命名镜像

重新给镜像打 tag，标记为私有仓库镜像

```
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.27.3  dockerhub.kubekey.local/kubesphereio/kube-controllers:v3.27.3
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.27.3  dockerhub.kubekey.local/kubesphereio/cni:v3.27.3
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.27.3  dockerhub.kubekey.local/kubesphereio/pod2daemon-flexvol:v3.27.3
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.27.3  dockerhub.kubekey.local/kubesphereio/node:v3.27.3
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.3.1  dockerhub.kubekey.local/kubesphereio/ks-console:v3.3.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/alpine:3.14  dockerhub.kubekey.local/kubesphereio/alpine:3.14
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.22.20  dockerhub.kubekey.local/kubesphereio/k8s-dns-node-cache:1.22.20
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.3.1  dockerhub.kubekey.local/kubesphereio/ks-controller-manager:v3.3.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.3.1  dockerhub.kubekey.local/kubesphereio/ks-installer:v3.3.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.3.1  dockerhub.kubekey.local/kubesphereio/ks-apiserver:v3.3.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs:v3.3.1  dockerhub.kubekey.local/kubesphereio/openpitrix-jobs:v3.3.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-apiserver:v1.22.12
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.12  dockerhub.kubekey.local/kubesphereio/
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-controller-manager:v1.22.12
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-scheduler:v1.22.12
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0  dockerhub.kubekey.local/kubesphereio/provisioner-localpv:3.3.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:3.3.0  dockerhub.kubekey.local/kubesphereio/linux-utils:3.3.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics:v2.5.0  dockerhub.kubekey.local/kubesphereio/kube-state-metrics:v2.5.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit:v1.8.11  dockerhub.kubekey.local/kubesphereio/fluent-bit:v1.8.11
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader:v0.55.1  dockerhub.kubekey.local/kubesphereio/prometheus-config-reloader:v0.55.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator:v0.55.1  dockerhub.kubekey.local/kubesphereio/prometheus-operator:v0.55.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/thanos:v0.25.2  dockerhub.kubekey.local/kubesphereio/thanos:v0.25.2
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus:v2.34.0  dockerhub.kubekey.local/kubesphereio/prometheus:v2.34.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator:v0.13.0  dockerhub.kubekey.local/kubesphereio/fluentbit-operator:v0.13.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter:v1.3.1  dockerhub.kubekey.local/kubesphereio/node-exporter:v1.3.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.22.0  dockerhub.kubekey.local/kubesphereio/kubectl:v1.22.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager:v1.4.0  dockerhub.kubekey.local/kubesphereio/notification-manager:v1.4.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar:v3.2.0  dockerhub.kubekey.local/kubesphereio/notification-tenant-sidecar:v3.2.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator:v1.4.0  dockerhub.kubekey.local/kubesphereio/notification-manager-operator:v1.4.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager:v0.23.0  dockerhub.kubekey.local/kubesphereio/alertmanager:v0.23.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.11.0  dockerhub.kubekey.local/kubesphereio/kube-rbac-proxy:v0.11.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/docker:19.03  dockerhub.kubekey.local/kubesphereio/docker:19.03
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2  dockerhub.kubekey.local/kubesphereio/metrics-server:v0.4.2
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.5  dockerhub.kubekey.local/kubesphereio/pause:3.5
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload:v0.5.0  dockerhub.kubekey.local/kubesphereio/configmap-reload:v0.5.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0  dockerhub.kubekey.local/kubesphereio/snapshot-controller:v4.0.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z  dockerhub.kubekey.local/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z  dockerhub.kubekey.local/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0  dockerhub.kubekey.local/kubesphereio/kube-rbac-proxy:v0.8.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.0  dockerhub.kubekey.local/kubesphereio/coredns:1.8.0
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector:1.1  dockerhub.kubekey.local/kubesphereio/log-sidecar-injector:1.1
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4  dockerhub.kubekey.local/kubesphereio/defaultbackend-amd64:1.4
docker tag  registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-proxy:v1.22.12
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.22.20 dockerhub.kubekey.local/kubesphereio/k8s-dns-node-cache:1.15.12
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.23.2    dockerhub.kubekey.local/kubesphereio/kube-controllers:v3.23.2
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.23.2   dockerhub.kubekey.local/kubesphereio/cni:v3.23.2
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.23.2   dockerhub.kubekey.local/kubesphereio/pod2daemon-flexvol:v3.23.2
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.23.2  dockerhub.kubekey.local/kubesphereio/node:v3.23.2
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch:2.6.0 dockerhub.kubekey.local/kubesphereio/opensearch:2.6.0
docker tag registry.cn-beijing.aliyuncs.com/kubesphereio/busybox:latest dockerhub.kubekey.local/kubesphereio/busybox:latest
docker tag kubesphere/fluent-bit:v2.0.6 dockerhub.kubekey.local/kubesphereio/fluent-bit:v2.0.6 # 也可重命名为v1.8.11，可省下后续修改fluent的yaml，这里采用后修改方式
```

### 2.6 推送镜像至 harbor 仓库

```
#!/bin/bash
#

docker load < ks3.3.1-images.tar.gz

docker login -u admin -p Harbor12345 dockerhub.kubekey.local

docker push dockerhub.kubekey.local/kubesphereio/ks-console:v3.3.1
docker push dockerhub.kubekey.local/kubesphereio/ks-controller-manager:v3.3.1
docker push dockerhub.kubekey.local/kubesphereio/ks-installer:v3.3.1
docker push dockerhub.kubekey.local/kubesphereio/ks-apiserver:v3.3.1
docker push dockerhub.kubekey.local/kubesphereio/openpitrix-jobs:v3.3.1
docker push dockerhub.kubekey.local/kubesphereio/alpine:3.14
docker push dockerhub.kubekey.local/kubesphereio/kube-apiserver:v1.22.12
docker push dockerhub.kubekey.local/kubesphereio/kube-scheduler:v1.22.12
docker push dockerhub.kubekey.local/kubesphereio/kube-proxy:v1.22.12
docker push dockerhub.kubekey.local/kubesphereio/kube-controller-manager:v1.22.12
docker push dockerhub.kubekey.local/kubesphereio/provisioner-localpv:3.3.0
docker push dockerhub.kubekey.local/kubesphereio/linux-utils:3.3.0
docker push dockerhub.kubekey.local/kubesphereio/kube-controllers:v3.23.2
docker push dockerhub.kubekey.local/kubesphereio/cni:v3.23.2
docker push dockerhub.kubekey.local/kubesphereio/pod2daemon-flexvol:v3.23.2
docker push dockerhub.kubekey.local/kubesphereio/node:v3.23.2
docker push dockerhub.kubekey.local/kubesphereio/kube-state-metrics:v2.5.0
docker push dockerhub.kubekey.local/kubesphereio/fluent-bit:v1.8.11
docker push dockerhub.kubekey.local/kubesphereio/prometheus-config-reloader:v0.55.1
docker push dockerhub.kubekey.local/kubesphereio/prometheus-operator:v0.55.1
docker push dockerhub.kubekey.local/kubesphereio/thanos:v0.25.2
docker push dockerhub.kubekey.local/kubesphereio/prometheus:v2.34.0
docker push dockerhub.kubekey.local/kubesphereio/fluentbit-operator:v0.13.0
docker push dockerhub.kubekey.local/kubesphereio/node-exporter:v1.3.1
docker push dockerhub.kubekey.local/kubesphereio/kubectl:v1.22.0
docker push dockerhub.kubekey.local/kubesphereio/notification-manager:v1.4.0
docker push dockerhub.kubekey.local/kubesphereio/notification-tenant-sidecar:v3.2.0
docker push dockerhub.kubekey.local/kubesphereio/notification-manager-operator:v1.4.0
docker push dockerhub.kubekey.local/kubesphereio/alertmanager:v0.23.0
docker push dockerhub.kubekey.local/kubesphereio/kube-rbac-proxy:v0.11.0
docker push dockerhub.kubekey.local/kubesphereio/docker:19.03
docker push dockerhub.kubekey.local/kubesphereio/pause:3.5
docker push dockerhub.kubekey.local/kubesphereio/configmap-reload:v0.5.0
docker push dockerhub.kubekey.local/kubesphereio/snapshot-controller:v4.0.0
docker push dockerhub.kubekey.local/kubesphereio/kube-rbac-proxy:v0.8.0
docker push dockerhub.kubekey.local/kubesphereio/coredns:1.8.0
docker push dockerhub.kubekey.local/kubesphereio/log-sidecar-injector:1.1
docker push dockerhub.kubekey.local/kubesphereio/k8s-dns-node-cache:1.15.12
docker push dockerhub.kubekey.local/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
docker push dockerhub.kubekey.local/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
docker push dockerhub.kubekey.local/kubesphereio/defaultbackend-amd64:1.4
docker push dockerhub.kubekey.local/kubesphereio/redis:5.0.14-alpine
docker push dockerhub.kubekey.local/kubesphereio/haproxy:2.3
docker push dockerhub.kubekey.local/kubesphereio/opensearch:2.6.0
docker push dockerhub.kubekey.local/kubesphereio/busybox:latest
docker push dockerhub.kubekey.local/kubesphereio/fluent-bit:v2.0.6
```

## 3. 使用 KubeKey 部署 KubeSphere

### 3.1 移除麒麟系统自带的 podman

podman 是麒麟系统自带的容器引擎，为避免后续与 Docker 冲突，直接卸载。否则后续 CoreDNS/NodelocalDNS 也会受影响无法启动以及各种 Docker 权限问题。

```
yum remove podman
```

### 3.2 下载 KubeKey

下载 **kubekey-v2.3.1-linux-arm64.tar.gz**。具体 KubeKey 版本号可以在 **[KubeKey 发行页面](https://github.com/kubesphere/kubekey/releases)** 查看。

- 方式一

```
cd ~
mkdir kubesphere
cd kubesphere/

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn

# 执行下载命令，获取最新版的 kk（受限于网络，有时需要执行多次）
curl -sfL https://get-kk.kubesphere.io/v2.3.1/kubekey-v2.3.1-linux-arm64.tar.gz | tar xzf -
```

- 方式二

使用本地电脑，直接去 GitHub 下载 [Releases · kubesphere/kubekey](https://github.com/kubesphere/kubekey/releases?page=4)，上传至服务器 /root/kubesphere 目录解压。

```
tar zxf kubekey-v2.3.1-linux-arm64.tar.gz
```

### 3.3 生成集群创建配置文件

创建集群配置文件，本示例中，选择 KubeSphere 3.3.1 和 Kubernetes 1.22.12。

```
./kk create config -f kubesphere-v331-v12212.yaml --with-kubernetes v1.22.12 --with-kubesphere v3.3.1
```

命令执行成功后，在当前目录会生成文件名为 **kubesphere-v331-v12212.yaml** 的配置文件。

**注意：** 生成的默认配置文件内容较多，这里就不做过多展示了，更多详细的配置参数请参考 官方配置示例。

本文示例采用 3 个节点同时作为 control-plane、etcd 节点和 worker 节点。

编辑配置文件 kubesphere-v331-v12212.yaml，主要修改 **kind: Cluster** 和 **kind: ClusterConfiguration** 两小节的相关配置。

修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下：

- hosts：指定节点的 IP、ssh 用户、ssh 密码、ssh 端口。**特别注意：** 一定要手工指定 **arch: arm64**，否则部署的时候会安装 X86 架构的软件包。
- roleGroups：指定 3 个 etcd、control-plane 节点，复用相同的机器作为 3 个 worker 节点。
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器。
- domain：自定义了一个 opsman.top。
- containerManager：使用了 containerd。
- storage.openebs.basePath：**新增配置**，指定默认存储路径为 **/data/openebs/local**。

修改后的示例如下：

```
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: node1, address: 192.168.200.7, internalAddress: 192.168.200.7, user: root, password: "123456", arch: arm64}
  roleGroups:
    etcd:
    - node1
    control-plane:
    - node1
    worker:
    - node1
    registry:
    - node1
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers
    # internalLoadbalancer: haproxy

    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.22.12
    clusterName: cluster.local
    autoRenewCerts: true
    containerManager: docker
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  registry:
    type: harbor
    auths:
      "dockerhub.kubekey.local":
        username: admin
        password: Harbor12345
    privateRegistry: "dockerhub.kubekey.local"
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []



---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.3.1
spec:
  persistence:
    storageClass: ""
  authentication:
    jwtSecret: ""
  zone: ""
  local_registry: ""
  namespace_override: ""
  # dev_tag: ""
  etcd:
    monitoring: true
    endpointIps: localhost
    port: 2379
    tlsEnable: true
  common:
    core:
      console:
        enableMultiLogin: true
        port: 30880
        type: NodePort
    # apiserver:
    #  resources: {}
    # controllerManager:
    #  resources: {}
    redis:
      enabled: false
      volumeSize: 2Gi
    openldap:
      enabled: false
      volumeSize: 2Gi
    minio:
      volumeSize: 20Gi
    monitoring:
      # type: external
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
      GPUMonitoring:
        enabled: false
    gpu:
      kinds:
      - resourceName: "nvidia.com/gpu"
        resourceType: "GPU"
        default: true
    es:
      # master:
      #   volumeSize: 4Gi
      #   replicas: 1
      #   resources: {}
      # data:
      #   volumeSize: 20Gi
      #   replicas: 1
      #   resources: {}
      logMaxAge: 7
      elkPrefix: logstash
      basicAuth:
        enabled: false
        username: ""
        password: ""
      externalElasticsearchHost: ""
      externalElasticsearchPort: ""
  alerting:
    enabled: true
    # thanosruler:
    #   replicas: 1
    #   resources: {}
  auditing:
    enabled: false
    # operator:
    #   resources: {}
    # webhook:
    #   resources: {}
  devops:
    enabled: false
    # resources: {}
    jenkinsMemoryLim: 8Gi
    jenkinsMemoryReq: 4Gi
    jenkinsVolumeSize: 8Gi
  events:
    enabled: false
    # operator:
    #   resources: {}
    # exporter:
    #   resources: {}
    # ruler:
    #   enabled: true
    #   replicas: 2
    #   resources: {}
  logging:
    enabled: true
    logsidecar:
      enabled: true
      replicas: 2
      # resources: {}
  metrics_server:
    enabled: false
  monitoring:
    storageClass: ""
    node_exporter:
      port: 9100
      # resources: {}
    # kube_rbac_proxy:
    #   resources: {}
    # kube_state_metrics:
    #   resources: {}
    # prometheus:
    #   replicas: 1
    #   volumeSize: 20Gi
    #   resources: {}
    #   operator:
    #     resources: {}
    # alertmanager:
    #   replicas: 1
    #   resources: {}
    # notification_manager:
    #   resources: {}
    #   operator:
    #     resources: {}
    #   proxy:
    #     resources: {}
    gpu:
      nvidia_dcgm_exporter:
        enabled: false
        # resources: {}
  multicluster:
    clusterRole: none
  network:
    networkpolicy:
      enabled: false
    ippool:
      type: none
    topology:
      type: none
  openpitrix:
    store:
      enabled: true
  servicemesh:
    enabled: false
    istio:
      components:
        ingressGateways:
        - name: istio-ingressgateway
          enabled: false
        cni:
          enabled: false
  edgeruntime:
    enabled: false
    kubeedge:
      enabled: false
      cloudCore:
        cloudHub:
          advertiseAddress:
            - ""
        service:
          cloudhubNodePort: "30000"
          cloudhubQuicNodePort: "30001"
          cloudhubHttpsNodePort: "30002"
          cloudstreamNodePort: "30003"
          tunnelNodePort: "30004"
        # resources: {}
        # hostNetWork: false
      iptables-manager:
        enabled: true
        mode: "external"
        # resources: {}
      # edgeService:
      #   resources: {}
  terminal:
    timeout: 600
```

### 3.4 执行安装

```
./kk create cluster -f kubesphere-v331-v122123.yaml
```

此节点之所以安装 KubeSphere 是因为 KubeKey 在安装过程中会产生 KubeKey 文件夹并将 K8s 所需要的依赖都下载到 KubeKey 目录。后续我们离线安装主要使用 KubeKey 文件夹，配合一下脚本代替之前的制品。

## 4. 制作离线安装资源

### 4.1 导出 K8s 基础依赖包

```
yum -y install openssl socat conntrack ipset ebtables chrony ipvsadm --downloadonly --downloaddir /root/kubesphere/k8s-init
# 打成压缩包
tar -czvf k8s-init-Kylin_V10-arm.tar.gz ./k8s-init/*
```

### 4.2 导出 KubeSphere 需要的镜像

导出 KubeSphere 相关的镜像至 `ks3.3.1-images.tar`。

```
docker save -o ks3.3.1-images.tar  dockerhub.kubekey.local/kubesphereio/kube-controllers:v3.27.3  dockerhub.kubekey.local/kubesphereio/cni:v3.27.3  dockerhub.kubekey.local/kubesphereio/pod2daemon-flexvol:v3.27.3  dockerhub.kubekey.local/kubesphereio/node:v3.27.3  dockerhub.kubekey.local/kubesphereio/ks-console:v3.3.1  dockerhub.kubekey.local/kubesphereio/alpine:3.14  dockerhub.kubekey.local/kubesphereio/k8s-dns-node-cache:1.22.20  dockerhub.kubekey.local/kubesphereio/ks-controller-manager:v3.3.1  dockerhub.kubekey.local/kubesphereio/ks-installer:v3.3.1  dockerhub.kubekey.local/kubesphereio/ks-apiserver:v3.3.1  dockerhub.kubekey.local/kubesphereio/openpitrix-jobs:v3.3.1  dockerhub.kubekey.local/kubesphereio/kube-apiserver:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-proxy:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-controller-manager:v1.22.12  dockerhub.kubekey.local/kubesphereio/kube-scheduler:v1.22.12  dockerhub.kubekey.local/kubesphereio/provisioner-localpv:3.3.0  dockerhub.kubekey.local/kubesphereio/linux-utils:3.3.0  dockerhub.kubekey.local/kubesphereio/kube-state-metrics:v2.5.0  dockerhub.kubekey.local/kubesphereio/fluent-bit:v2.0.6  dockerhub.kubekey.local/kubesphereio/prometheus-config-reloader:v0.55.1  dockerhub.kubekey.local/kubesphereio/prometheus-operator:v0.55.1  dockerhub.kubekey.local/kubesphereio/thanos:v0.25.2  dockerhub.kubekey.local/kubesphereio/prometheus:v2.34.0  dockerhub.kubekey.local/kubesphereio/fluentbit-operator:v0.13.0   dockerhub.kubekey.local/kubesphereio/node-exporter:v1.3.1  dockerhub.kubekey.local/kubesphereio/kubectl:v1.22.0  dockerhub.kubekey.local/kubesphereio/notification-manager:v1.4.0  dockerhub.kubekey.local/kubesphereio/notification-tenant-sidecar:v3.2.0  dockerhub.kubekey.local/kubesphereio/notification-manager-operator:v1.4.0  dockerhub.kubekey.local/kubesphereio/alertmanager:v0.23.0  dockerhub.kubekey.local/kubesphereio/kube-rbac-proxy:v0.11.0  dockerhub.kubekey.local/kubesphereio/docker:19.03  dockerhub.kubekey.local/kubesphereio/metrics-server:v0.4.2  dockerhub.kubekey.local/kubesphereio/pause:3.5  dockerhub.kubekey.local/kubesphereio/configmap-reload:v0.5.0  dockerhub.kubekey.local/kubesphereio/snapshot-controller:v4.0.0  dockerhub.kubekey.local/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z  dockerhub.kubekey.local/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z  dockerhub.kubekey.local/kubesphereio/kube-rbac-proxy:v0.8.0  dockerhub.kubekey.local/kubesphereio/coredns:1.8.0   dockerhub.kubekey.local/kubesphereio/defaultbackend-amd64:1.4 dockerhub.kubekey.local/kubesphereio/redis:5.0.14-alpine dockerhub.kubekey.local/kubesphereio/k8s-dns-node-cache:1.15.12 dockerhub.kubekey.local/kubesphereio/node:v3.23.2 dockerhub.kubekey.local/kubesphereio/pod2daemon-flexvol:v3.23.2 dockerhub.kubekey.local/kubesphereio/cni:v3.23.2 dockerhub.kubekey.local/kubesphereio/kube-controllers:v3.23.2 dockerhub.kubekey.local/kubesphereio/haproxy:2.3 dockerhub.kubekey.local/kubesphereio/busybox:latest dockerhub.kubekey.local/kubesphereio/opensearch:2.6.0 dockerhub.kubekey.local/kubesphereio/fluent-bit:v2.0.6
```

压缩。

```
gzip ks3.3.1-images.tar
```

### 4.3 导出 KubeSphere 文件夹

```
[root@node1 ~]# cd /root/kubesphere
[root@node1 kubesphere]# ls
create_project_harbor.sh  docker-24.0.7-arm.tar.gz  fluent-bit-daemonset.yaml  harbor-arm.tar.gz  harbor.tar.gz  install.sh  k8s-init-Kylin_V10-arm.tar.gz  ks3.3.1-images.tar.gz  ks3.3.1-offline  push-images.sh

tar -czvf kubeshpere.tar.gz ./kubesphere/*
```

install.sh 内容。

```
#!/usr/bin/env bash
read -p "请先修改机器配置文件ks3.3.1-offline/kubesphere-v331-v12212.yaml中相关IP地址，是否已修改(yes/no)" B
do_k8s_init(){
        echo "--------开始进行依赖包初始化------"
        tar zxf k8s-init-Kylin_V10-arm.tar.gz
        cd k8s-init && ./install.sh
        cd -
        rm -rf k8s-init
}

install_docker(){
        echo "--------开始安装docker--------"
        tar zxf docker-24.0.7-arm.tar.gz
        cd docker && ./install.sh
        cd -

}
install_harbor(){
        echo "-------开始安装harbor----------"
        tar zxf  harbor-arm.tar.gz
        cd harbor && ./install.sh
        cd -
        echo "--------开始推送镜像----------"
        source create_project_harbor.sh
        source push-images.sh
        echo "--------镜像推送完成--------"
}
install_ks(){
        echo "--------开始安装kubesphere--------"
#        tar zxf ks3.3.1-offline.tar.gz
        cd ks3.3.1-offline && ./install.sh
}

if [ "$B" = "yes" ] || [ "$B" = "y" ]; then
    do_k8s_init
    install_docker
    install_harbor
    install_ks
else
    echo "请先配置集群配置文件"
    exit 1
fi
```

## 5. 离线环境安装 KubeSphere

### 5.1 卸载 podman

```
yum remove podman -y
```

### 5.2 安装 K8s 依赖包

**所有节点都需要操作**，上传 `k8s-init-Kylin_V10-arm.tar.gz` 并解压后执行 install.sh。

### 5.3 安装 KubeSphere 集群

上传 `kubeshpere.tar.gz` 并解压，修改 `./kubesphere/ks3.3.1-offline/kubesphere-v331-v12212.yaml` 集群配置文件中相关 ip，密码等信息。

```
**************************************************
Waiting for all tasks to be completed ...
task alerting status is successful  (1/6)
task network status is successful  (2/6)
task multicluster status is successful  (3/6)
task openpitrix status is successful  (4/6)
task logging status is successful  (5/6)
task monitoring status is successful  (6/6)
**************************************************
Collecting installation results ...
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.10.2:30880
Account: admin
Password: P@88w0rd
NOTES：
  1. After you log into the console, please check the
     monitoring status of service components in
     "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             2024-07-03 11:10:11
#####################################################
```

### 5.4 修改 fluent-bit

```
kubectl edit daemonsets fluent-bit -n kubesphere-logging-system
修改其中fluent-bit版本1.8.11为2.0.6
```

### 5.5 关闭/删除 es 相关服务和负载

如果不需要日志功能，可以修改 KubeSphere 创建集群配置文件不安装 log 插件，此时 5.4、5.5 以及镜像可以更加简化。

## 6. 测试查看

```
[root@node1 ~]# kubectl get nodes
NAME    STATUS   ROLES                         AGE   VERSION
node1   Ready    control-plane,master,worker   26h   v1.22.12
node2   Ready    control-plane,master,worker   26h   v1.22.12
node3   Ready    control-plane,master,worker   26h   v1.22.12
```

![](https://cdn.nlark.com/yuque/0/2024/png/12795725/1720493928397-270bd836-6b4b-4128-806c-e0787f06cca6.png#averageHue=%23c4e5d6&clientId=ufb9fedf4-f260-4&from=paste&id=uc0c339d3&originHeight=911&originWidth=1920&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4f666a96-480b-48b0-a3d5-cd1382159f0&title=)

## 7. 总结

本文主要实战演示了 ARM 版 麒麟 V10 服务器通过在线环境部署 K8s 和 KubeSphere，并将基础依赖，需要的 Docker 镜像和 Harbor，以及 KubeKey 部署 KubeSphere 下载的各类包一起打包。通过 shell 脚本编写简单的部署过程，实现离线环境安装 K8s 和 KubeSphere。

离线安装主要知识点：

- 卸载 podman
- 安装 K8s 依赖包
- 安装 Docker
- 安装 Harbor
- 将 K8s 和 KubeSphere 需要的镜像推送到 Harbor
- 使用 KubeKey 部署集群
