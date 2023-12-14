---
title: 'KubeKey 离线部署 KubeSphere v3.4.1 和 K8s v1.26 实战指南'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, KubeKey '
description: '详细介绍了如何使用 KubeKey **v3.0.13** 离线部署 KubeSphere 和 K8s 集群。'
createTime: '2023-12-13'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/deploying-kubesphere-and-k8s-offline-with-kubekey-cover.png'
---

## 前言

### 知识点

- 定级：**入门级**
- 了解清单 (manifest) 和制品 (artifact) 的概念
- 掌握 manifest 清单的编写方法
- 根据 manifest 清单制作 artifact
- KubeKey 离线集群配置文件编写
- KubeKey 离线部署 Harbor
- KubeKey 离线部署 KubeSphere 和 K8s
- KubeKey 离线部署常见问题排查处理

### 实战服务器配置

|    主机名    |      IP      | CPU  | 内存 | 系统盘 | 数据盘 |              用途              |
| :----------: | :----------: | :--: | :--: | :----: | :----: | :----------------------------: |
| ksp-master-1 | 192.168.9.91 |  8   |  16  |   40   |  100   | 离线环境 KubeSphere/k8s-master |
| ksp-master-2 | 192.168.9.92 |  8   |  16  |   40   |  100   | 离线环境 KubeSphere/k8s-master |
| ksp-master-3 | 192.168.9.93 |  8   |  16  |   40   |  100   | 离线环境 KubeSphere/k8s-master |
| ksp-registry | 192.168.9.90 |  4   |  8   |   40   |  100   | 离线环境镜像仓库节点（Harbor） |
|  ksp-deploy  | 192.168.9.89 |  4   |  8   |   40   |  100   |     联网主机用于制作离线包     |
|     合计     |      4       |  32  |  64  |  200   |  500   |                                |

### 实战环境涉及软件版本信息

- 操作系统：**CentOS 7.9 x86_64**
- KubeSphere：**v3.4.1**
- K8s：**v1.26.5**
- Containerd：**1.6.4**
- KubeKey:  **v3.0.13**
- Harbor：**2.5.3**

## 1. 简介

KubeKey 从 v2.1.0 版开始新增了清单 (manifest) 和制品 (artifact) 的概念，为用户离线部署 KubeSphere 和 K8s 集群提供了一种简单便捷的解决方案。

manifest 是一个描述当前 Kubernetes 集群信息和定义 artifact 制品中需要包含哪些内容的文本文件。

使用 KubeKey，用户只需使用清单 manifest 文件来定义将要离线部署的集群环境需要的内容，再通过该 manifest 来导出制品 artifact 文件即可完成准备工作。离线部署时只需要 KubeKey 和 artifact 就可快速、简单的在环境中部署镜像仓库 Harbor 和 KubeSphere 以及 K8s 集群。

KubeKey 生成 manifest 文件有两种方式：

- 利用现有运行中的集群作为源生成 manifest 文件，也是官方推荐的一种方式，具体参考 KubeSphere [官网的离线部署文档](https://www.kubesphere.io/zh/docs/v3.4/installing-on-linux/introduction/air-gapped-installation/)。
- 根据 [ manifest 模板文件](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md) 手动编写 manifest 文件。

第一种方式的好处是可以根据 1:1 的运行集群构建离线集群，依赖于已有集群，灵活度不够，并不是所有人都具备这种条件。

因此，本文参考官方的离线文档，采用**手写 manifest** 清单文件的方式，实现离线环境的安装部署。

## 2. 离线部署资源制作

制作离线部署资源需要找一台能联通互联网的节点，本文为了资源的制作和离线部署验证，单独增加了一个能联网的 **ksp-deploy** 节点。

在该节点下载 KubeKey （下文简称 KK）最新版（**v3.0.13**）。具体 KK 版本号可以在 [KubeKey 发行页面](https://github.com/kubesphere/kubekey/releases) 查看。

### 2.1. 下载 KubeKey

- 下载最新版的 KubeKey

```shell
cd ~
mkdir kubekey
cd kubekey/

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn

# 执行下载命令，获取最新版的 kk（受限于网络，有时需要执行多次）
curl -sfL https://get-kk.kubesphere.io | sh -

# 也可以使用下面的命令指定具体版本
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.13 sh -
```

### 2.2. 获取 manifest 模板

 manifest 文件的编写可以参考 [官方示例文档](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md)。有两个可用参考用例，一个简单版，一个完整版。参考简单版即可。

受限于篇幅，本文不展示原始的示例文件，建议读者仔细阅读官方示例，理解每一项配置的含义后根据需求改写（**暂时无法理解的，可以直接使用下文提供的成品配置文件**）。

### 2.3. 获取 images-list 及可裁剪性分析

执行下面的命令获取官方 releases v3.4.1 对应的 images-list（最终实验结果，一些镜像需要自行整理，完整的镜像列表可参考下文中的 manifest 文件）。

```shell
wget https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/images-list.txt
```

完整的 Image（**136 个**） 分类及可裁剪性（**必须留的有标粗，个人判断，未必精准**）：

- kubesphere-images（**18 个，不可裁剪**）
- kubeedge-images（3 个，可裁剪，取决于是否启用 kubeedge）
- gatekeeper-images（1 个，可裁剪，取决于是否启用 gatekeeper，建议保留）
- openpitrix-images（**1 个，可裁剪但是基本都会用到，建议保留**）
- kubesphere-devops-images（45 个，构建用的开发环境镜像可裁剪，前缀带 builder-、tomcat85-、java-、nodejs-、python- 这一类的都可以酌情处理）
- kubesphere-monitoring-images（**14 个，不可裁剪**）
- kubesphere-logging-images（15 个，能裁剪的也就是 elasticsearch- 和 opensearch 开头的，KubeSphere v3.4.1 默认选择 opensearch，建议都保留）
- istio-images（9 个，可裁剪，取决于是否启用 istio，建议保留）
- example-images（13 个，可裁剪）
- weave-scope-images（1 个，可裁剪，取决于是否启用 weave）
- **官方列表中未列出的核心 images**（12 个，必须，否则部署时报错）
- **官方列表中未列出的必要 images**（4 个，必须，否则部署时报错）

为了保持完整性，本文使用了所有 Image，只是修改了镜像前缀为  **registry.cn-beijing.aliyuncs.com/kubesphereio**，修改后的完整的镜像列表在下面的 manifest 文件中展示，读者可根据需求裁剪。

### 2.4. 获取操作系统依赖包

本实验环境使用的操作系统是 x64 的 CentOS 7.9，所以只下载  centos7 的操作系统依赖包，其他操作系统请读者在 [KubeKey releases 页面](https://github.com/kubesphere/kubekey/releases)下载。

执行下面的命令，在能联网的部署服务器上执行下载。网络访问受限时，也可以通过其他方式，将该 ISO 下载后放到制作离线镜像的服务器的 /root/kubekey 目录下。

```shell
wget https://github.com/kubesphere/kubekey/releases/download/v3.0.12/centos7-rpms-amd64.iso
```

> 说明：KubeKey v3.0.13 的 release 中没包，只能在 v3.0.12 的 releases 中下载。

最终的 ISO（**centos7-rpms-amd64.iso，314 MB**）实际信息如下：

```bash
# 查看文件大小
[root@ksp-deploy kubekey]# ll -h centos7-rpms-amd64.iso
-rw-r--r--. 1 root root 315M Oct 23 18:21 centos7-rpms-amd64.iso

# 验证 sha256sum，确保 ISO 在下载过程中没出问题（官方提供的 sha256sum 信息在 https://github.com/kubesphere/kubekey/releases/download/v3.0.12/centos7-rpms.iso.sha256sum.txt）
[root@ksp-deploy kubekey]# sha256sum centos7-rpms-amd64.iso
2588fbc12acc9f3b95766a0c20382988f2a21da2a36e444b7e1a0f523e75f858  centos7-rpms-amd64.iso
```

### 2.5. 生成 manifest 文件

根据上面的文件及相关信息，生成最终 **manifest.yaml**。

命名为 **ksp-v3.4.1-manifest.yaml**

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Manifest
metadata:
  name: sample
spec:
  arches:
  - amd64
  operatingSystems:
  - arch: amd64
    type: linux
    id: centos
    version: "7"
    osImage: CentOS Linux 7 (Core)
    repository:
      iso:
        localPath: "/root/kubekey/centos7-rpms-amd64.iso"
        url:
  kubernetesDistributions:
  - type: kubernetes
    version: v1.26.5
  components:
    helm: 
      version: v3.9.0
    cni: 
      version: v1.2.0
    etcd: 
      version: v3.4.13
    calicoctl:
      version: v3.26.1
    containerRuntimes:
    - type: docker
      version: 20.10.23
    - type: containerd
      version: 1.6.4
    crictl: 
      version: v1.24.0
    docker-registry:
      version: "2"
    harbor:
      version: v2.5.3
    docker-compose:
      version: v2.2.2
  images:
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubefed:v0.8.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tower:v0.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
  - registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
  - registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx-ingress-controller:v1.3.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/redis:5.0.14-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.0.25-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/alpine:3.14
  - registry.cn-beijing.aliyuncs.com/kubesphereio/openldap:1.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/netshoot:v1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cloudcore:v1.13.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/iptables-manager:v1.13.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/edgeservice:v0.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/gatekeeper:v3.5.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs:v3.3.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-apiserver:ks-v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-controller:ks-v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:ks-v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/inbound-agent:4.10-2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.1-jdk11
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.16
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.17
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.18
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.2-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.1-jdk11-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.16-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.17-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.18-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2ioperator:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2irun:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2i-binary:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java11-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java11-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java8-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java8-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-11-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-8-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-8-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-11-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-8-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-6-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-4-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-36-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-35-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-34-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-27-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/argocd:v2.3.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset:v0.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/dex:v2.30.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/redis:6.2.6-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload:v0.7.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus:v2.39.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader:v0.55.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator:v0.55.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.11.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics:v2.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter:v1.3.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager:v0.23.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/thanos:v0.31.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/grafana:8.3.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.11.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator:v2.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager:v2.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-curator:v5.7.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch-curator:v0.0.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-oss:6.8.22
  - registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch:2.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch-dashboards:2.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator:v0.14.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/docker:19.03
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit:v1.9.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector:v1.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/filebeat:6.7.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-operator:v0.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-exporter:v0.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-ruler:v0.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-operator:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-webhook:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.14.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/proxyv2:1.14.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-operator:1.29
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-agent:1.29
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-collector:1.29
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-query:1.29
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-es-index-cleaner:1.29
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kiali-operator:v1.50.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kiali:v1.50
  - registry.cn-beijing.aliyuncs.com/kubesphereio/busybox:1.31.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx:1.14-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/wget:1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/hello:plain-text
  - registry.cn-beijing.aliyuncs.com/kubesphereio/wordpress:4.8-apache
  - registry.cn-beijing.aliyuncs.com/kubesphereio/hpa-example:latest
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentd:v1.4.2-2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/perl:latest
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-productpage-v1:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-reviews-v1:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-reviews-v2:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-details-v1:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-ratings-v1:1.16.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/scope:1.13.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.26.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.26.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.26.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.26.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12
  - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.9.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.26.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.26.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.26.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.26.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.22.0
  kubectl:v1.22.0
  registry:
    auths: {}
```

> **manifest 修改说明**
>
> - **最后的 16 个镜像就是官方 images-list 文件缺失的镜像，一定要手工补充在 list 中**
> - kubernetes 版本：v1.26.5
> - 其他组件版本的选择：个人是根据 kubekey 在线安装过程的日志，查找相关组件的对应版本，以及参考官方的文档 [组件默认版本说明](https://github.com/kubesphere/kubekey/blob/v3.0.13/docs/components-versions.md)、[组件默认版本源码](https://github.com/kubesphere/kubekey/blob/v3.0.13/cmd/kk/apis/kubekey/v1alpha2/default.go) 、[支持的组件列表](https://github.com/kubesphere/kubekey/blob/v3.0.13/version/components.json) 和 [制品清单源码](https://github.com/kubesphere/kubekey/blob/v3.0.13/cmd/kk/pkg/artifact/manifest.go)
>
> - 开启 **harbor** 和 **docker-compose** 配置项，为后面通过 KubeKey 自建 harbor 仓库推送镜像使用。
> - 默认创建的 manifest 里面的镜像列表从 **docker.io** 获取，替换前缀为 **registry.cn-beijing.aliyuncs.com/kubesphereio**。
> - 若需要导出的 artifact 文件中包含操作系统依赖文件（如：conntarck、chrony 等），可在 **operationSystem** 元素中的 **.repostiory.iso.url** 中配置相应的 ISO 依赖文件下载地址为 **localPath** ，填写提前下载好的 ISO 包在本地的存放路径，并将 **url** 配置项置空。
> - 您可以访问 `https://github.com/kubesphere/kubekey/releases/tag/v3.0.12` 下载 ISO 文件。

### 2.6. 导出制品 artifact

**制品 (artifact) 说明**

- 制品（artifact）是一个根据指定的 manifest 文件内容导出的包含镜像 tar 包和相关二进制文件的 tgz 包。

- 在 KubeKey 初始化镜像仓库、创建集群、添加节点和升级集群的命令中均可指定一个 artifact，KubeKey 将自动解包该 artifact 并在执行命令时直接使用解包出来的文件。

- 导出时请确保网络连接正常。

- KubeKey 会解析镜像列表中的镜像名，若镜像名中的镜像仓库需要鉴权信息，可在 manifest 文件中的 **.registry.auths** 字段中进行配置（**本文未配置**）。

根据生成的 manifest，执行下面的命令制作制品（artifact）。

```shell
export KKZONE=cn
./kk artifact export -m ksp-v3.4.1-manifest.yaml -o ksp-v3.4.1-artifact.tar.gz
```

制作完成后，我们简单查看一下制作的制品包含哪些内容。

- 查看 KubeKey 目录内容

```bash
# 制作完成后查看结果
[root@ksp-deploy kubekey]# ls -lh
total 14G
-rw-r--r--. 1 root root 315M Oct 23 18:21 centos7-rpms-amd64.iso
-rwxr-xr-x. 1 root root  76M Nov  7 16:43 kk
-rw-r--r--. 1 root root  13G Dec 12 13:08 ksp-v3.4.1-artifact.tar.gz
-rw-r--r--. 1 root root  11K Dec 12 11:23 ksp-v3.4.1-manifest.yaml
drwxr-xr-x. 3 root root   18 Dec 12 13:08 kubekey
-rw-r--r--. 1 root root  35M Dec  8 10:33 kubekey-v3.0.13-linux-amd64.tar.gz

# 制作过程中捕捉的内容，可能不全（制作完成后 kubekey/artifact 目录会被清理）
[root@ksp-deploy kubekey]# du -sh kubekey/*
13G     kubekey/artifact
88K     kubekey/logs
[root@ksp-deploy kubekey]# du -sh kubekey/artifact/*
102M    kubekey/artifact/cni
43M     kubekey/artifact/containerd
14M     kubekey/artifact/crictl
130M    kubekey/artifact/docker
17M     kubekey/artifact/etcd
45M     kubekey/artifact/helm
12G     kubekey/artifact/images
207M    kubekey/artifact/kube
660M    kubekey/artifact/registry
315M    kubekey/artifact/repository
9.0M    kubekey/artifact/runc
```

- 查看制品大小（全镜像，制品包居然达到了 13G，生产环境还是有选择的裁剪吧）

```bash
[root@ksp-deploy kubekey]# ls -lh ksp-v3.4.1-artifact.tar.gz
-rw-r--r--. 1 root root 13G Dec 12 13:08 ksp-v3.4.1-artifact.tar.gz
```

### 2.7. 导出 KubeKey

把 KubeKey 工具也制作成压缩包，便于拷贝到离线节点。

```shell
# 压缩
[root@ksp-deploy kubekey]# tar zcvf kubekey-v3.0.13.tar.gz kk kubekey-v3.0.13-linux-amd64.tar.gz
```

### 2.8. Kernel 升级包

**CentOS 7.9 的默认内核比较老，建议升级操作系统内核（具体是否升级请根据实际环境自行决定）**。

- 下载 Kernel 升级包

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/elrepo/kernel/el7/x86_64/RPMS/kernel-lt-5.4.263-1.el7.elrepo.x86_64.rpm
wget https://mirrors.tuna.tsinghua.edu.cn/elrepo/kernel/el7/x86_64/RPMS/kernel-lt-tools-libs-5.4.263-1.el7.elrepo.x86_64.rpm
wget https://mirrors.tuna.tsinghua.edu.cn/elrepo/kernel/el7/x86_64/RPMS/kernel-lt-tools-5.4.263-1.el7.elrepo.x86_64.rpm
```

- 打包 Kernel 升级包

```bash
tar zcvf kernel-lt-5.4.263-1-upgrade.tar.gz kernel-lt-*
```

至此，我们已经准备了 3 个离线部署资源包：

- KubeKey：**kubekey-v3.0.13.tar.gz（69M）**
- 制品（artifact）：**ksp-v3.4.1-artifact.tar.gz（13G）**
- 内核升级包（**可选**）：**kernel-lt-5.4.263-1-upgrade.tar.gz（50M ）**

## 3. K8s 离线集群服务器-初始化配置

### 3.1. 操作系统基础配置

本演示环境使用 KubeKey 自动配置，生产环境可以参考我以前发布的部署实战系列文档手工配置。

### 3.2. 数据盘配置

每台服务器新增一块数据盘 **/dev/sdb**，用于 **Containerd** 和 **Kubernetes Pod** 的持久化存储。

为了满足部分用户希望在生产上线后，磁盘容量不够时可以实现扩容，本文采用了 LVM 的方式配置磁盘（**实际上，本人维护的生产环境，几乎不用 LVM**）。

**本小节的配置比较简单，因此，下面的内容为无废话实操版。**

请注意，以下操作无特殊说明时需在所有新增节点上执行。本文只选取 Master-1 节点作为演示，并假定其余服务器都已按照相同的方式进行配置和设置。

- 创建 PV

```bash
 pvcreate /dev/sdb
```

- 创建 VG

```bash
vgcreate data /dev/sdb
```

- 创建 LV

```bash
# 使用所有空间，VG 名字为 data，LV 名字为 lvdata
lvcreate -l 100%VG data -n lvdata
```

- 格式化磁盘

```shell
mkfs.xfs /dev/mapper/data-lvdata
```

- 手工挂载磁盘

```bash
mkdir /data
mount /dev/mapper/data-lvdata /data/
```

- 配置开机自动挂载

```bash
tail -1 /etc/mtab >> /etc/fstab
```

- 创建 openebs 本地数据根目录

```bash
mkdir -p /data/openebs/local
```

- 创建 Containerd 数据目录

```bash
mkdir -p /data/containerd
```

- 创建 Containerd 数据目录软连接

```bash
ln -s /data/containerd /var/lib/containerd
```

> 说明：KubeKey 不支持在部署的时候更改 Containerd 的数据目录，只能用这种变通的方式（**也可以提前手工安装 Containerd，建议**）。

### 3.3. 升级系统内核

**升级 CentOS 7.9 操作系统内核**（**可选项，生产环境建议执行**）。

请注意，以下操作无特殊说明时需在集群所有节点上执行。本文只选取 **Master-1** 节点作为演示，并假定其余服务器都已按照相同的方式进行配置和设置。

- 上传内核升级包

将内核升级包 `kernel-lt-5.4.263-1-upgrade.tar.gz` 上传到集群中的每个节点的 /root 目录。

```bash
cd /root
tar xvf kernel-lt-5.4.263-1-upgrade.tar.gz
```

- 安装新版本内核

```bash
yum install kernel-lt-5.4.263-1.el7.elrepo.x86_64.rpm
```

> **注意：** 这里我们只安装内核，同时安装其他包，会有**包 conflicts** 的报错。

- 修改系统默认内核为新内核

```bash
grubby --set-default "/boot/vmlinuz-5.4.263-1.el7.elrepo.x86_64"
```

- 重启系统，使用新内核引导系统

```bash
reboot
```

- 验证内核版本

```bash
[root@ksp-master-1 ~]# uname -r
5.4.263-1.el7.elrepo.x86_64
```

- 更新其他 Kernel 相关软件包（**可选**，用不到则不用更新）

在使用新内核引导系统后，安装其他 Kernel 相关软件包，解决之前出现的依赖冲突问题。

```bash
# 卸载旧版本的 kernel-tools 相关软件包，保留 kernel-3.10.0-1160.71.1，避免新内核异常无法进入系统（具体版本号以实际为准）
yum remove kernel-tools-3.10.0-1160.71.1.el7.x86_64 kernel-tools-libs-3.10.0-1160.71.1.el7.x86_64

# 安装新版本的 kernel-tools 相关软件包
yum install kernel-lt-tools-5.4.263-1.el7.elrepo.x86_64.rpm kernel-lt-tools-libs-5.4.263-1.el7.elrepo.x86_64.rpm
```

- 清理临时安装包（**建议，养成良好的运维习惯**）

```bash
rm -rf kernel-lt-5.4.263-1.el7.elrepo.x86_64.rpm kernel-lt-tools-5.4.263-1.el7.elrepo.x86_64.rpm kernel-lt-tools-libs-5.4.263-1.el7.elrepo.x86_64.rpm
```

## 4. 离线部署 KubeSphere 和 K8s 的前提准备

### 4.1. 上传离线部署资源包到部署节点

将以下离线部署资源包（KubeKey 和制品 artifact ），上传至离线环境部署节点 (通常是 **Master-1** 节点) 的 /data/ 目录（**可根据实际情况修改**）。

- Kubekey：**kubekey-v3.0.13.tar.gz**
- 制品 artifact：**ksp-v3.4.1-artifact.tar.gz**

执行以下命令，解压 KubeKey：

```shell
# 创离线资源存放的数据目录
mkdir /data/kubekey
mv /data/ksp-v3.4.1-artifact.tar.gz /data/kubekey/
tar xvf /data/kubekey-v3.0.13.tar.gz -C /data/kubekey
cd /data/kubekey
```

### 4.2. 创建离线集群配置文件

- 执行以下命令创建离线集群配置文件

```shell
./kk create config --with-kubesphere v3.4.1 --with-kubernetes v1.26.5 -f ksp-v341-v1265-offline.yaml
```

命令执行成功后，在当前目录会生成文件名为 **ksp-v341-v1265-offline.yaml** 的配置文件。

> 注意：生成的默认配置文件内容较多，这里就不做过多展示了，更多详细的配置参数请参考 [官方配置示例](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)。

### 4.3. 修改 Cluster 配置

在离线集群配置文件文件中 **kind: Cluster** 小节的作用是部署 Kubernetes 集群。本文示例采用 3 个节点同时作为 control-plane、etcd 节点和 worker 节点。

执行以下命令修改离线集群配置文件 `ksp-v341-v1265-offline.yaml`：

```bash
vim ksp-v341-v1265-offline.yaml
```

修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下。

- hosts：指定节点的 IP、ssh 用户、ssh 密码、ssh 端口。示例演示了 ssh 端口号的配置方法。同时，新增一个 Registry 节点的配置
- roleGroups：指定 3 个 etcd、control-plane 节点，复用相同的机器作为 3 个 worker 节点
- 必须指定主机组 `registry` 作为仓库部署节点（本文为了满足读者的需求使用了 KubeKey 自动部署 Harbor 镜像仓库。当然，也可以使用已有的 Harbor，使用已有 Harbor 时此配置可以不加）
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- domain：自定义了一个 **opsman.top**，没特殊需求的场景保留默认值即可
- containerManager：使用了 containerd
- storage.openebs.basePath：**新增配置**，指定 openebs 默认存储路径为 **/data/openebs/local**
- registry：必须指定 `type` 类型为 `harbor`，否则默认安装 docker registry

修改后的完整示例如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: ksp-master-1, address: 192.168.9.91, internalAddress: 192.168.9.91, port:22, user: root, password: "P@88w0rd"}
  - {name: ksp-master-2, address: 192.168.9.92, internalAddress: 192.168.9.92, user: root, password: "P@88w0rd"}
  - {name: ksp-master-3, address: 192.168.9.93, internalAddress: 192.168.9.93, user: root, password: "P@88w0rd"}
  - {name: ksp-registry, address: 192.168.9.90, internalAddress: 192.168.9.90, user: root, password: "P@88w0rd"}
  roleGroups:
    etcd:
    - ksp-master-1
    - ksp-master-2
    - ksp-master-3
    control-plane: 
    - ksp-master-1
    - ksp-master-2
    - ksp-master-3
    worker:
    - ksp-master-1
    - ksp-master-2
    - ksp-master-3
    registry:
    - ksp-registry
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    internalLoadbalancer: haproxy

    domain: lb.opsman.top
    address: ""
    port: 6443
  kubernetes:
    version: v1.26.5
    clusterName: opsman.top
    autoRenewCerts: true
    containerManager: containerd
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  storage:
    openebs:
      basePath: /data/openebs/local # 默认没有的新增配置，base path of the local PV provisioner
  registry:
    # 如需使用 kk 部署 harbor, 可将该参数设置为 harbor，不设置该参数且需使用 kk 创建容器镜像仓库，将默认使用 docker registry。
    type: harbor
    # 注意：
    # 1、如需使用 kk 部署的 harbor 或其他自定义仓库，可设置对应仓库的 auths，如使用 kk 创建 docker registry 仓库，则无需配置该参数。
    # 2、kk 部署的 harbor，默认地址为 dockerhub.kubekey.local，如要修改确保与 privateRegistry 字段的值保持一致。
    # 3、如需使用 kk 部署 harbor，请先注释该参数，待部署完 Harbor 后再来修改启用。
    auths:
      "registry.opsman.top":
        username: admin
        password: Harbor12345
        certsPath: "/etc/docker/certs.d/registry.opsman.top"
    # 设置集群部署时使用的私有仓库
    privateRegistry: "registry.opsman.top"
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

> 注意：离线 Harbor 部署，我们使用了私有自定义域名和自签名证书，实际生产中建议各位使用真正的互联网域名和正规机构签发的免费或收费证书。

### 4.4. 修改 ClusterConfiguration 配置

在离线集群配置文件中 **kind: ClusterConfiguration** 小节的作用是部署 KubeSphere 及相关组件。

本文为了验证离线部署的完整性，启用了除 Kubeedge 、gatekeeper 以外的所有插件。

继续编辑离线集群配置文件 `ksp-v341-v1265-offline.yaml`，修改 **kind: ClusterConfiguration** 部分来启用可插拔组件，具体的修改说明如下。

- 启用 Etcd 监控

```yaml
etcd:
    monitoring: true # 将 "false" 更改为 "true"
    endpointIps: localhost
    port: 2379
    tlsEnable: true
```

- 启用应用商店

```yaml
openpitrix:
  store:
    enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere DevOps 系统

```yaml
devops:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 日志系统（**v3.4.0 开始默认启用 OpenSearch**）

```shell
logging:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 事件系统

```yaml
events:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 告警系统

```yaml
alerting:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 审计日志

```yaml
auditing:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 服务网格（Istio）

```yaml
servicemesh:
enabled: true # 将 "false" 更改为 "true"
istio:
  components:
    ingressGateways:
    - name: istio-ingressgateway # 将服务暴露至服务网格之外。默认不开启。
      enabled: false
    cni:
      enabled: false # 启用后，会在 Kubernetes pod 生命周期的网络设置阶段完成 Istio 网格的 pod 流量转发设置工作。
```

- 启用 Metrics Server

```shell
metrics_server:
  enabled: true # 将 "false" 更改为 "true"
```

> 说明：KubeSphere 支持用于 [部署](https://www.kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/deployments/) 的容器组（Pod）弹性伸缩程序 (HPA)。在 KubeSphere 中，Metrics Server 控制着 HPA 是否启用。

- 启用网络策略、容器组 IP 池，服务拓扑图（名字排序，对应配置参数排序）

```yaml
network:
  networkpolicy:
    enabled: true # 将 "false" 更改为 "true"
  ippool:
    type: calico # 将 "none" 更改为 "calico"
  topology:
    type: weave-scope # 将 "none" 更改为 "weave-scope"
```

> 说明：
>
> - 从 3.0.0 版本开始，用户可以在 KubeSphere 中配置原生 Kubernetes 的网络策略。
> - 容器组 IP 池用于规划容器组网络地址空间，每个容器组 IP 池之间的地址空间不能重叠。
> - 启用服务拓扑图以集成 [Weave Scope](https://www.weave.works/oss/scope/) (Docker 和 Kubernetes 的可视化和监控工具)，服务拓扑图显示在您的项目中，将服务之间的连接关系可视化（实际上没啥用，该项目目前已停止维护了，姑且放着吧）。

- **修改上面的所有参数后，必须加入一个参数**（以前的 2.x 时代的 kk 没这个问题，不加的话，在部署 KubeSphere 的时候会有命名空间不匹配的问题）

```yaml
spec:
  namespace_override: kubesphereio
  ......
```

经过上述步骤，我们成功完成了对离线集群配置文件 `ksp-v341-v1265-offline.yaml` 的修改。由于篇幅限制，无法在此展示完整的文件内容，请各位读者根据上文提供的配置说明仔细核对。

## 5. 安装配置 Harbor

为了验证 KubeKey 部署离线 Harbor 的能力，本实战内容采用 KubeKey 部署 Harbor。**生产环境建议提前自建**。

请注意，以下操作无特殊说明时需在离线环境部署节点（**默认为 Master-1**）上执行。

### 5.1. 安装 Harbor

执行以下命令安装镜像仓库 Harbor（**受限于篇幅，输出结果未展示**）：

```bash
cd /root/kubekey
./kk init registry -f ksp-v341-v1265-offline.yaml -a ksp-v3.4.1-artifact.tar.gz
```

> **说明：** `ksp-v3.4.1-artifact.tar.gz` 我们制作的离线部署资源包中的制品包。

部署完成后，我们 **SSH 登陆到 Registry 节点**，执行以下的命令，验证 Harbor 的安装情况：

- 查看安装完成后有哪些内容

```bash
[root@ksp-registry ~]# ls -lh /opt/harbor/
total 633M
......（受限于篇幅，输出结果未展示）
```

- 查看安装版本

```bash
[root@ksp-registry ~]# docker images
REPOSITORY                      TAG       IMAGE ID       CREATED         SIZE
goharbor/harbor-exporter        v2.5.3    d9a8cfa37cf8   17 months ago   87.2MB
goharbor/chartmuseum-photon     v2.5.3    788b207156ad   17 months ago   225MB
goharbor/redis-photon           v2.5.3    5dc5331f3de8   17 months ago   154MB
goharbor/trivy-adapter-photon   v2.5.3    27798821348a   17 months ago   251MB
goharbor/notary-server-photon   v2.5.3    c686413b72ce   17 months ago   112MB
goharbor/notary-signer-photon   v2.5.3    a3bc1def3f94   17 months ago   109MB
goharbor/harbor-registryctl     v2.5.3    942de6829d43   17 months ago   136MB
goharbor/registry-photon        v2.5.3    fb1278854b91   17 months ago   77.9MB
goharbor/nginx-photon           v2.5.3    91877cbc147a   17 months ago   44.3MB
goharbor/harbor-log             v2.5.3    ca36fb3b68a6   17 months ago   161MB
goharbor/harbor-jobservice      v2.5.3    75e6a7496590   17 months ago   227MB
goharbor/harbor-core            v2.5.3    93a775677473   17 months ago   203MB
goharbor/harbor-portal          v2.5.3    d78f9bbad9ee   17 months ago   52.6MB
goharbor/harbor-db              v2.5.3    bd50ae1eccdf   17 months ago   224MB
goharbor/prepare                v2.5.3    15102b9ebde6   17 months ago   166MB
```

- 查看安装状态

```bash
[root@ksp-registry ~]# cd /opt/harbor/
[root@ksp-registry harbor]# docker-compose ps -a
```

- 查看 Harbor 配置的域名（**确保使用了自定义域名**）

```bash
[root@ksp-registry harbor]# cat /opt/harbor/harbor.yml | grep hostname:
hostname: registry.opsman.top
```

- 查看 Docker 是否配置了私有证书（**确保使用了自定义域名及证书**）

```bash
[root@ksp-registry harbor]# ll /etc/docker/certs.d/registry.opsman.top/
total 12
-rw-r--r--. 1 root root 1103 Dec 13 09:47 ca.crt
-rw-r--r--. 1 root root 1253 Dec 13 09:47 registry.opsman.top.cert
-rw-------. 1 root root 1679 Dec 13 09:47 registry.opsman.top.key
```

> 小知识：KubeKey 部署 Harbor 时会自动同步自签名证书到集群所有节点，自己部署的 Harbor **必须手动复制** Registry 节点的**自签名证书**到集群所有节点。
>
> KubeKey 完成复制的动作在下面两个模块：
>
> - `[InitRegistryModule] Synchronize certs file`
> - `[InitRegistryModule] Synchronize certs file to all nodes`

### 5.2. 在 Harbor 中创建项目

由于 Harbor 项目存在访问控制（RBAC）的限制，即只有指定角色的用户才能执行某些操作。如果您未创建项目，则镜像不能被推送到 Harbor。

Harbor 中有两种类型的项目：

- 公共项目（Public）：任何用户都可以从这个项目中拉取镜像。
- 私有项目（Private）：只有作为项目成员的用户可以拉取镜像。

使用 KubeKey 安装的 Harbor 默认信息如下：

- 登陆账户信息：管理员账号：**admin**，密码：**Harbor12345**（生产环境必须修改）。
- Harbor 安装文件在 **/opt/harbor** , 如需运维 Harbor，可至该目录下。

接下来的任务需要我们 **SSH 登陆到 Registry 节点**执行。

执行以下命令，下载官方提供的自动初始化 Harbor 仓库的脚本（**可不下载直接用本文提供的脚本**）：

```shell
curl -O https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/create_project_harbor.sh
```

- 根据实际情况，执行以下命令修改脚本配置 `vim create_project_harbor.sh`。

```shell
#!/usr/bin/env bash

# Harbor 仓库地址（写域名，默认配置为 https://dockerhub.kubekey.local）
url="https://registry.opsman.top"

# 访问 Harbor 仓库的默认用户和密码（生产环境建议修改）
user="admin"
passwd="Harbor12345"

# 需要创建的项目名列表，按我们制作的离线包的镜像命名规则，实际上只需要创建一个 kubesphereio 即可，这里保留了所有可用值，各位可根据自己的离线仓库镜像名称规则修改。
harbor_projects=(library
    kubesphere
    calico
    coredns
    openebs
    csiplugin
    minio
    mirrorgooglecontainers
    osixia
    prom
    thanosio
    jimmidyson
    grafana
    elastic
    istio
    jaegertracing
    jenkins
    weaveworks
    openpitrix
    joosthofman
    nginxdemos
    fluent
    kubeedge
    kubesphereio
)

for project in "${harbor_projects[@]}"; do
    echo "creating $project"
    curl -k -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}"
done
```

> 重点注意：
>
> - harbor_projects 中一定要新增 `kubesphereio`，默认没有。不加后面报错，详情见 **问题 2**。
> - 脚本创建的是 public 项目，如需要私有项目请修改脚本。

- 执行脚本创建项目

```shell
sh create_project_harbor.sh
```

- 正确的执行结果如下（**library 会有报错，因为默认已经存在，可忽略**）

### 5.3. 推送离线镜像到 Harbor 仓库

将提前准备好的离线镜像推送到 Harbor 仓库，这一步为**可选项**，因为创建集群的时候默认会推送镜像（本文使用参数忽略了）。为了部署成功率，建议先推送。

- 推送离线镜像

```shell
./kk artifact image push -f ksp-v341-v1265-offline.yaml -a ksp-v3.4.1-artifact.tar.gz
```

- Harbor 管理页面查看项目和镜像仓库（**提前在自己电脑上做好域名解析配置**）

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-offline-harbor-v253-projects-118.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-offline-harbor-v253-projects-repositories-kubesphereio.png)

## 6. 安装 KubeSphere 和 K8s 集群

### 6.1. 安装 KubeSphere 和 K8s 集群

执行以下命令，安装 KubeSphere 和 K8s 集群。

```bash
./kk create cluster -f ksp-v341-v1265-offline.yaml -a ksp-v3.4.1-artifact.tar.gz --with-packages --skip-push-images
```

> 参数说明
>
> - **ksp-v341-v1265-offline.yaml**：离线环境集群的配置文件
> - **ksp-v3.4.1-artifact.tar.gz**：制品包的 tar 包镜像
> - **--with-packages**：如需要安装操作系统依赖，需指定该选项
> - **--skip-push-images：** 忽略推送镜像，因为，前面已经完成了推送镜像到私有仓库的任务

上面的命令执行后，首先 KubeKey 会检查部署 K8s 的依赖及其他详细要求。检查合格后，系统将提示您确认安装。输入 **yes** 并按 ENTER 继续部署。

> 特殊说明：由于本文在安装的过程中启用了日志插件，因此在安装的过程中必须按照 「**问题 6**」的描述**手工介入处理**，**否则安装会失败**。

安装过程日志输出比较多，受限于篇幅本文只展示最终结果。

部署完成需要大约 10-30 分钟左右，具体看网速、机器配置、启用多少插件等。

部署完成后，您应该会在终端上看到类似于下面的输出。提示部署完成的同时，输出中还会显示用户登陆 KubeSphere 的默认管理员用户和密码。

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.9.91:30880
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
https://kubesphere.io             2023-12-13 10:56:38
#####################################################
10:56:40 CST skipped: [ksp-master-3]
10:56:40 CST skipped: [ksp-master-2]
10:56:40 CST success: [ksp-master-1]
10:56:40 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

> 小技巧：

- 当出现熟悉的安装滚动条  **>>--->** 后，可以另开一个终端 使用命令 `kubectl get pod -A ` 或是 `kubectl get pod -A | grep -v Running` 观察进度，如出现异常可及时介入处理。
- 也可以通过下面的命令查看详细的部署过程日志及报错信息。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

### 6.2.  部署结果验证

登录 Web 控制台通过 `http://{IP}:30880` 使用默认帐户和密码 `admin/P@88w0rd` 访问 KubeSphere 的 Web 控制台，简单的验证一下部署结果。

- 查看集群节点状态

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-v126-offline-clusters-nodes.png)

- 查看系统组件状态

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-v126-offline-clusters-components.png)

## 7. 常见问题

### 问题 1

- 问题现象

执行脚本 `create_project_harbor.sh` ，创建 Harbor 项目时，报错如下：

```bash
curl performs SSL certificate verification by default, using a "bundle"
 of Certificate Authority (CA) public keys (CA certs). If the default
 bundle file isn't adequate, you can specify an alternate file
 using the --cacert option.
If this HTTPS server uses a certificate signed by a CA represented in
 the bundle, the certificate verification probably failed due to a
 problem with the certificate (it might be expired, or the name might
 not match the domain name in the URL).
If you'd like to turn off curl's verification of the certificate, use
 the -k (or --insecure) option.
```

- 解决方案

因为我们 Harbor 使用的是 Https 协议，并且使用了私有的域名和私有自定义的证书。需修改脚本，在 curl 命令中加入 `-k` 参数。

```bash
# 修改后命令
curl -k -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}"
```

### 问题 2

- 问题现象

部署 Kubesphere 和 Kubernetes 集群之前，执行推送离线镜像的命令，报错如下：

```bash
15:01:29 CST [CopyImagesToRegistryModule] Push multi-arch manifest to private registry
15:01:29 CST message: [LocalHost]
get manifest list failed by module cache
15:01:29 CST failed: [LocalHost]
error: Pipeline[ArtifactImagesPushPipeline] execute failed: Module[CopyImagesToRegistryModule] exec failed:
failed: [LocalHost] [PushManifest] exec failed after 1 retries: get manifest list failed by module cache
```

- 解决方案

参考 [issues-2054](https://github.com/kubesphere/kubekey/issues/2054)，在 Harbor 中创建项目 `kubesphereio`。

### 问题 3

- 问题现象

部署集群时，报错如下：

```bash
17:26:33 CST message: [ksp-master-1]
pull image failed: Failed to exec command: sudo -E /bin/bash -c "env PATH=$PATH crictl pull registry.opsman.top/kubesphereio/pause:3.8 --platform amd64"
E1211 17:26:33.225514    5977 remote_image.go:238] "PullImage from image service failed" err="rpc error: code = Unknown desc = failed to pull and unpack image \"registry.opsman.top/kubesphereio/pause:3.8\": failed to resolve reference \"registry.opsman.top/kubesphereio/pause:3.8\": failed to do request: Head \"https://registry.opsman.top/v2/kubesphereio/pause/manifests/3.8\": x509: certificate signed by unknown authority" image="registry.opsman.top/kubesphereio/pause:3.8"
FATA[0000] pulling image: rpc error: code = Unknown desc = failed to pull and unpack image "registry.opsman.top/kubesphereio/pause:3.8": failed to resolve reference "registry.opsman.top/kubesphereio/pause:3.8": failed to do request: Head "https://registry.opsman.top/v2/kubesphereio/pause/manifests/3.8": x509: certificate signed by unknown authority: Process exited with status 1
17:26:33 CST retry: [ksp-master-1]
```

- 解决方案

参考 [issues-1762](https://github.com/kubesphere/kubekey/issues/1762)，在集群部署文件 `ksp-v341-v1265-offline.yaml` 的 registry 部分配置中加入以下内容（一定要确保 **/etc/docker/certs.d/registry.opsman.top** 文件夹存在）：

```yaml
# 本文用的 registry.opsman.top 默认为 dockerhub.kubekey.local
certsPath: "/etc/docker/certs.d/registry.opsman.top"
```

如果在部署过程中报错，可以在 containerd 的配置文件中，加入下面的配置，重启 containerd 服务，再重新执行部署任务。

```yaml
#  vi /etc/containerd/config.toml 找到正确位置加入（一般在文件最后有类似段落，修改替换即可）
[plugins."io.containerd.grpc.v1.cri".registry.configs."registry.opsman.top".tls]
              ca_file = "/etc/docker/certs.d/registry.opsman.top/ca.crt"
              cert_file = "/etc/docker/certs.d/registry.opsman.top/registry.opsman.top.cert"
              key_file = "/etc/docker/certs.d/registry.opsman.top/registry.opsman.top.key"
              insecure_skip_verify = false
              
# 重启服务
systemctl restart containerd
```

如果报错提示 `/etc/docker/certs.d/registry.opsman.top` 找不到，可以按下面的操作执行（**没用 KubeKey 部署 Harbor 时会出现**）。

```bash
# 1. 登陆到 registry 节点
# 2. 复制 /etc/docker/certs.d/registry.opsman.top 文件夹到其他节点
```

### 问题 4

- 问题现象

部署集群时，报错如下：

```bash
17:50:16 CST message: [ksp-master-3]
pull image failed: Failed to exec command: sudo -E /bin/bash -c "env PATH=$PATH crictl pull registry.opsman.top/kubesphereio/pause:3.8 --platform amd64"
E1211 17:50:16.841836    8464 remote_image.go:238] "PullImage from image service failed" err="rpc error: code = Unknown desc = failed to pull and unpack image \"registry.opsman.top/kubesphereio/pause:3.8\": failed to resolve reference \"registry.opsman.top/kubesphereio/pause:3.8\": get TLSConfig for registry \"https://registry.opsman.top\": failed to load cert file: open /etc/docker/certs.d/registry.opsman.top/registry.opsman.top.cert: no such file or directory" image="registry.opsman.top/kubesphereio/pause:3.8"
FATA[0000] pulling image: rpc error: code = Unknown desc = failed to pull and unpack image "registry.opsman.top/kubesphereio/pause:3.8": failed to resolve reference "registry.opsman.top/kubesphereio/pause:3.8": get TLSConfig for registry "https://registry.opsman.top": failed to load cert file: open /etc/docker/certs.d/registry.opsman.top/registry.opsman.top.cert: no such file or directory: Process exited with status 1
17:50:16 CST retry: [ksp-master-3]
```

- 解决方案

制作离线资源的官方 image-list 中不存在 pause:3.8 这个 image，需要自己预先加上再制作制品。实际上一共需要补充 **16** 个，报错都不一样，可以根据报错信息补充（**本文提供的 images-list 已经是补充完整的**）。

### 问题 5

- 问题现象

```bash
Events:
  Type     Reason     Age                   From               Message
  ----     ------     ----                  ----               -------
  Normal   Scheduled  18m                   default-scheduler  Successfully assigned kube-system/metrics-server-5d65c798b8-m9tbj to ksp-master-3
  Normal   Pulling    16m (x4 over 18m)     kubelet            Pulling image "registry.opsman.top/kubesphere/metrics-server:v0.4.2"
  Warning  Failed     16m (x4 over 18m)     kubelet            Failed to pull image "registry.opsman.top/kubesphere/metrics-server:v0.4.2": rpc error: code = NotFound desc = failed to pull and unpack image "registry.opsman.top/kubesphere/metrics-server:v0.4.2": failed to resolve reference "registry.opsman.top/kubesphere/metrics-server:v0.4.2": registry.opsman.top/kubesphere/metrics-server:v0.4.2: not found
  Warning  Failed     16m (x4 over 18m)     kubelet            Error: ErrImagePull
  Warning  Failed     16m (x6 over 17m)     kubelet            Error: ImagePullBackOff
  Normal   BackOff    2m57s (x64 over 17m)  kubelet            Back-off pulling image "registry.opsman.top/kubesphere/metrics-server:v0.4.2"
```

- 解决方案

可能是 bug（**已反馈给社区，暂未确认**）。社区给了临时方案在离线集群配置文件中 **kind: ClusterConfiguration** 小节中，加入参数 `namespace_override: kubesphereio`。

### 问题 6

- 问题现象

```bash
# kubectl describe pod opensearch-cluster-data-0 -n kubesphere-logging-system
Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
  Normal   Pulling    56s (x3 over 2m57s)  kubelet            Pulling image "busybox:latest"
  Warning  Failed     15s (x3 over 2m17s)  kubelet            Error: ErrImagePull
  Warning  Failed     15s                  kubelet            Failed to pull image "busybox:latest": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/busybox:latest": failed to resolve reference "docker.io/library/busybox:latest": failed to do request: Head "https://registry-1.docker.io/v2/library/busybox/manifests/latest": dial tcp: lookup registry-1.docker.io on 114.114.114.114:53: read udp 192.168.9.92:37639->114.114.114.114:53: i/o timeout
  Normal   BackOff    0s (x3 over 2m16s)   kubelet            Back-off pulling image "busybox:latest"
  Warning  Failed     0s (x3 over 2m16s)   kubelet            Error: ImagePullBackOff
```

- 解决方案

这个应该也是个 bug，官方配置写死了 busybox 的地址（**已反馈给社区，已确认**），暂时需要手改。

```bash
# 查看 sts
[root@ksp-master-1 kubekey]# kubectl get sts -n kubesphere-logging-system
NAME                        READY   AGE
opensearch-cluster-data     0/2     7m42s
opensearch-cluster-master   0/1     7m40s

# 修改 sts 使用的 busyboy 镜像为本地镜像（细节不展示）
kubectl edit sts opensearch-cluster-data -n kubesphere-logging-system
kubectl edit sts opensearch-cluster-master -n kubesphere-logging-system

# 本文修改后 image 内容（自己根据实际情况修改域名前缀）
registry.opsman.top/kubesphereio/busybox:1.31.1
```

### 问题 7

- 问题现象

```bash
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
        [WARNING ImagePull]: failed to pull image registry.opsman.top/kubesphereio/pause:3.9: output: E1213 10:31:38.814017    8325 remote_image.go:238] "PullImage from image service failed" err="rpc error: code = NotFound desc = failed to pull and unpack image \"registry.opsman.top/kubesphereio/pause:3.9\": failed to resolve reference \"registry.opsman.top/kubesphereio/pause:3.9\": registry.opsman.top/kubesphereio/pause:3.9: not found" image="registry.opsman.top/kubesphereio/pause:3.9"
time="2023-12-13T10:31:38+08:00" level=fatal msg="pulling image: rpc error: code = NotFound desc = failed to pull and unpack image \"registry.opsman.top/kubesphereio/pause:3.9\": failed to resolve reference \"registry.opsman.top/kubesphereio/pause:3.9\": registry.opsman.top/kubesphereio/pause:3.9: not found"
, error: exit status 1
```

- 解决方案

这个报错是在部署过程中出现的，但是报错并未导致集群部署失败。解决办法跟`问题 4` 一样，制作离线资源的官方 image-list 中不存在 pause:3.9 这个 image，需要自己预先加上再制作制品。

### 问题 8

- 问题现象

```bash
Events:
  Type     Reason       Age                   From               Message
  ----     ------       ----                  ----               -------
  Normal   Pulling      4m25s                 kubelet            Pulling image "registry.opsman.top/kubesphereio/ks-apiserver:v3.4.1"
  Warning  Failed       4m22s                 kubelet            Failed to pull image "registry.opsman.top/kubesphereio/ks-apiserver:v3.4.1": rpc error: code = Unknown desc = failed to pull and unpack image "registry.opsman.top/kubesphereio/ks-apiserver:v3.4.1": failed to extract layer sha256:9f4598b692bcf57921e45bc384b60591c5f8eac82e32e781e9fe5849ef6eb29e: write /var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/291/fs/usr/local/bin/ks-apiserver: no space left on device: unknown
  Warning  Failed       4m22s                 kubelet            Error: ErrImagePull
  Warning  Failed       4m21s                 kubelet            Error: ImagePullBackOff
  Normal   BackOff      39s (x15 over 4m21s)  kubelet            Back-off pulling image "registry.opsman.top/kubesphereio/ks-apiserver:v3.4.1"
```

- 解决方案

人为造成，KubeKey 的离线部署资源包放在了节点 `ksp-master-1`，同时，该节点也是 K8s 的 Master-1 节点。该节点的系统盘为 40G，演示环境没加额外的数据盘，所以**磁盘空间满了**。实际使用中，建议新加一块数据盘。

### 问题 9

- 问题现象

容器 `devops-argocd-dex-server` 反复重启。

```bash
# kubectl describe pod devops-argocd-dex-server-84fff59566-2brcn -n argocd
Events:
  Type     Reason     Age                    From               Message
  ----     ------     ----                   ----               -------
  Normal   Created    35m (x2 over 36m)      kubelet            Created container dex-server
  Normal   Started    35m (x2 over 36m)      kubelet            Started container dex-server
  Normal   Killing    35m                    kubelet            Container dex-server failed liveness probe, will be restarted
  Normal   Pulled     35m                    kubelet            Container image "registry.opsman.top/kubesphereio/dex:v2.30.2" already present on machine
  Warning  Unhealthy  35m (x6 over 36m)      kubelet            Liveness probe failed: Get "http://10.233.89.12:5558/healthz/live": dial tcp 10.233.89.12:5558: connect: connection refused
  Warning  Unhealthy  22m (x38 over 36m)     kubelet            Readiness probe failed: Get "http://10.233.89.12:5558/healthz/ready": dial tcp 10.233.89.12:5558: connect: connection refused
  Warning  BackOff    2m21s (x127 over 33m)  kubelet            Back-off restarting failed container dex-server in pod devops-argocd-dex-server-84fff59566-2brcn_argocd(d83b98dc-cd21-47d9-aa5e-e7a26d458e7f)
```

- 解决方案（**未解决**）

```bash
# 细节没深究，删除 pod 自动重建，但是还会自动重启
kubectl delete pod devops-argocd-dex-server-84fff59566-2brcn -n argocd
```

## 8. 总结

本次的实战课程，我们详细介绍了如何使用 KubeKey **v3.0.13** 离线部署 KubeSphere 和 K8s 集群。

概括总结全文主要涉及以下内容：

- 了解清单 (manifest) 和制品 (artifact) 的概念
- 了解 manifest 和 images-list 资源的获取地址
- 了解 images-list 的组成及裁剪方案
- 手工编写 manifest 清单
- 根据 manifest 清单制作 artifact
- KubeKey 离线部署 Harbor
- Harbor 镜像仓库自动创建项目
- KubeKey 离线部署 KubeSphere 和 K8s
- KubeKey 离线部署常见问题及解决方案

受限于篇幅限制，本文略有遗憾之处在于很多部署任务的输出结果没有展示，建议读者在实战中仔细分析。

> **免责声明：**
>
>- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
>- 本文所述内容仅限于实战环境验证测试通过，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！