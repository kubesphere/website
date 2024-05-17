---
title: 'KubeKey v3.1 发布：快速自定义离线安装包'
tag: '产品动态'
keywords: 'Kubernetes, KubeSphere, KubeKey, 离线部署, 新版本发布'
description: '该版本主要对离线场景部署、离线包制作以及向 Kubernetes v1.24+ 升级进行了优化。'
createTime: '2024-05-17'
author: '郭峰'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-v3.1-release.png'
---

日前，KubeKey v3.1 正式发布。该版本主要对离线场景部署、离线包制作以及向 Kubernetes v1.24+ 升级进行了优化。

## KubeKey 简介

![](https://pek3b.qingstor.com/kubesphere-community/images/202205121620270.png)

KubeKey 是 KubeSphere 社区开源的一款高效集群部署工具，运行时默认使用 Docker，也可对接 Containerd、CRI-O、iSula 等 CRI 运行时，且 ETCD 集群独立运行，支持与 K8s 分离部署，提高环境部署灵活性。它提供了一种灵活、快速、便捷的方式来仅安装 Kubernetes/K3s，或同时安装 Kubernetes/K3s 和 KubeSphere，以及其他云原生插件。除此之外，它也是扩展和升级集群的有效工具。

## 主要更新变化

#### 支持 Docker 作为 runtime 部署 Kubernetes v1.24+ 集群

相关 PR: **https://github.com/kubesphere/kubekey/pull/2111**

贡献者：chilianyi

#### 支持 Docker 作为 runtime 的集群升级至 v1.24+ 版本

相关 PR: **https://github.com/kubesphere/kubekey/pull/2148**

贡献者：pixiake

#### 支持部署开启 IPV6 协议的集群

相关 PR: **https://github.com/kubesphere/kubekey/pull/2142**

贡献者：wenwenxiong

#### 支持向多级路径镜像仓库中推送镜像

相关 PR: **https://github.com/kubesphere/kubekey/pull/2159**

贡献者：liangzai006

#### 支持按需制作 artifact

相关 PR: **https://github.com/kubesphere/kubekey/pull/2161**

贡献者：ImitationImmortal

#### 支持自定义 Kubernetes 版本生成 manifest

相关 PR: **https://github.com/kubesphere/kubekey/pull/2204**

贡献者：liangzai006

#### 优化 etcd 部署管理逻辑，支持 etcd 升级

相关 PR: **https://github.com/kubesphere/kubekey/pull/2200**

贡献者：pixiake

更多详情见 GitHub Release：

- https://github.com/kubesphere/kubekey/releases/tag/v3.1.0
- https://github.com/kubesphere/kubekey/releases/tag/v3.1.1

## 获取最新版本 KubeKey

```
curl -sfL https://get-kk.kubesphere.io | sh -
```

## 新增功能介绍

### 自定义制作 Kubernetes 离线包

> 老版本中使用 KubeKey 创建 manifests 文件需依赖已存在的集群，使用新版本 KubeKey 可以直接指定 kubernetes 版本及 arch 创建 manifests 文件。

```
# 示例：创建包含 kubernetes v1.24.17，v1.25.16，且 cpu 架构为 amd64、arm64 的 manifests 文件。

./kk create manifest --with-kubernetes v1.24.17,v1.25.16 --arch amd64 --arch arm64

# 以下为新创建的 manifest-sample.yaml, 可根据离线部署需求，自定义添加或删除镜像。自定义对 manifests 文件调整后执行 ./kk artifact export -m manifest-sample.yaml 制作离线包。
---
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Manifest
metadata:
  name: sample
spec:
  arches:
  - amd64
  - arm64
  operatingSystems:
  - arch: amd64
    type: linux
    id: ubuntu
    version: "20.04"
    osImage: Ubuntu 20.04.6 LTS
    repository:
      iso:
        localPath:
        url:
  kubernetesDistributions:
  - type: kubernetes
    version: v1.24.17
  - type: kubernetes
    version: v1.25.16
  components:
    helm:
      version: v3.14.3
    cni:
      version: v1.2.0
    etcd:
      version: v3.5.13
    containerRuntimes:
    - type: docker
      version: 24.0.9
    - type: containerd
      version: 1.7.13
    calicoctl:
      version: v3.27.3
    crictl:
      version: v1.29.0
  images:
  - docker.io/kubesphere/pause:3.7
  - docker.io/kubesphere/kube-apiserver:v1.24.17
  - docker.io/kubesphere/kube-controller-manager:v1.24.17
  - docker.io/kubesphere/kube-scheduler:v1.24.17
  - docker.io/kubesphere/kube-proxy:v1.24.17
  - docker.io/coredns/coredns:1.8.6
  - docker.io/kubesphere/k8s-dns-node-cache:1.22.20
  - docker.io/calico/kube-controllers:v3.27.3
  - docker.io/calico/cni:v3.27.3
  - docker.io/calico/node:v3.27.3
  - docker.io/calico/pod2daemon-flexvol:v3.27.3
  - docker.io/calico/typha:v3.27.3
  - docker.io/flannel/flannel:v0.21.3
  - docker.io/flannel/flannel-cni-plugin:v1.1.2
  - docker.io/cilium/cilium:v1.15.3
  - docker.io/cilium/operator-generic:v1.15.3
  - docker.io/hybridnetdev/hybridnet:v0.8.6
  - docker.io/kubeovn/kube-ovn:v1.10.10
  - docker.io/kubesphere/multus-cni:v3.8
  - docker.io/openebs/provisioner-localpv:3.3.0
  - docker.io/openebs/linux-utils:3.3.0
  - docker.io/library/haproxy:2.9.6-alpine
  - docker.io/plndr/kube-vip:v0.7.2
  - docker.io/kubesphere/kata-deploy:stable
  - docker.io/kubesphere/node-feature-discovery:v0.10.0
  - docker.io/kubesphere/pause:3.8
  - docker.io/kubesphere/kube-apiserver:v1.25.16
  - docker.io/kubesphere/kube-controller-manager:v1.25.16
  - docker.io/kubesphere/kube-scheduler:v1.25.16
  - docker.io/kubesphere/kube-proxy:v1.25.16
  - docker.io/coredns/coredns:1.9.3
  registry:
    auths: {}

```

## 致谢

以下是参与 KubeKey v3.1 代码与文档贡献的贡献者 GitHub ID，若此名单有遗漏请您与我们联系，排名不分先后。

- pixiake
- liangzai006
- hellocn9
- samt42
- chilianyi
- deqingLv
- liuxu623
- wenwenxiong
- zliang90
- yzxiu
- vicoooo26
- qyz87
- wenwutang1
- ImitationImmortal
- xrwang8
- baikjy0215

再次感谢您的贡献！
