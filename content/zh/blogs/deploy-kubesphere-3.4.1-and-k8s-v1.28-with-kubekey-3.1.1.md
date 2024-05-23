---
title: '一文搞定 KubeKey 3.1.1 离线部署 KubeSphere 3.4.1 和 Kubernetes v1.28'
tag: 'Kubernetes,KubeSphere,KubeKey'
keywords: 'Kubernetes, KubeSphere, KubeKey, openEuler '
description: '本文将详细介绍，如何基于操作系统 openEuler 22.03 LTS SP3，利用 KubeKey 制作 KubeSphere 和 Kubernetes 离线安装包，并实战部署 KubeSphere 3.4.1 和Kubernetes 1.28.8 集群。'
createTime: '2024-05-23'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-kubesphere-k8s-20240523-cover.png'
---

本文将详细介绍，如何基于操作系统 **openEuler 22.03 LTS SP3**，利用 KubeKey 制作 KubeSphere 和 Kubernetes 离线安装包，并实战部署 **KubeSphere 3.4.1** 和 **Kubernetes 1.28.8** 集群。

**实战服务器配置 (架构 1:1 复刻小规模生产环境，配置略有不同)**

|    主机名    |      IP      | CPU  | 内存 | 系统盘 | 数据盘 |                   用途                   |
| :----------: | :----------: | :--: | :--: | :----: | :----: | :--------------------------------------: |
| ksp-master-1 | 192.168.9.91 |  8   |  16  |   40   |  100   |      离线环境 KubeSphere/k8s-master      |
| ksp-master-2 | 192.168.9.92 |  8   |  16  |   40   |  100   |      离线环境 KubeSphere/k8s-master      |
| ksp-master-3 | 192.168.9.93 |  8   |  16  |   40   |  100   |      离线环境 KubeSphere/k8s-master      |
| ksp-registry | 192.168.9.90 |  4   |  8   |   40   |  100   | 离线环境部署节点和镜像仓库节点（Harbor） |
|  ksp-deploy  | 192.168.9.89 |  4   |  8   |   40   |  100   |          联网主机用于制作离线包          |
|     合计     |      4       |  32  |  64  |  200   |  500   |                                          |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3**

- KubeSphere：**v3.4.1**

- Kubernetes：**v1.28.8**

- KubeKey:  **v3.1.1**

- Harbor: **v2.10.1**

## 1. 离线部署资源制作

本文增加了一台能联网的 **ksp-deploy** 节点，用来制作离线部署资源包。

在该节点下载 KubeKey 最新版（**v3.1.1**）。具体 KubeKey 版本号可以在 [KubeKey 发行页面](https://github.com/kubesphere/kubekey/releases) 查看。

### 1.1 下载 KubeKey

- 下载最新版的 KubeKey

```shell
cd ~
mkdir kubekey
cd kubekey/

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn

# 执行下载命令，获取最新版的 kk（受限于网络，有时需要执行多次）
curl -sfL https://get-kk.kubesphere.io | sh -
```

### 1.2 创建 manifests 文件

KubeKey v3.1.0 之前 manifests 文件需要根据模板手动编写， 现在可以通过 KubeKey 的  `create manifest` 命令自动生成一份 manifests 模板。

1. `create manifest` 支持的参数如下

```bash
$ ./kk create manifest --help
Create an offline installation package configuration file

Usage:
  kk create manifest [flags]

Flags:
      --arch stringArray         Specify a supported arch (default [amd64])
      --debug                    Print detailed information
  -f, --filename string          Specify a manifest file path
  -h, --help                     help for manifest
      --ignore-err               Ignore the error message, remove the host which reported error and force to continue
      --kubeconfig string        Specify a kubeconfig file
      --name string              Specify a name of manifest object (default "sample")
      --namespace string         KubeKey namespace to use (default "kubekey-system")
      --with-kubernetes string   Specify a supported version of kubernetes
      --with-registry            Specify a supported registry components
  -y, --yes                      Skip confirm check
```

2. 官方示例（支持多集群、多架构）

```bash
# 示例：创建包含 kubernetes v1.24.17，v1.25.16，且 cpu 架构为 amd64、arm64 的 manifests 文件。
./kk create manifest --with-kubernetes v1.24.17,v1.25.16 --arch amd64 --arch arm64
```

3. 创建一个 amd64 架构 kubernetes v1.28.8 的 manifests 文件

```bash
./kk create manifest --with-kubernetes v1.28.8 --arch amd64
```

4. 生成的配置文件如下

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
     id: ubuntu
     version: "20.04"
     osImage: Ubuntu 20.04.6 LTS
     repository:
       iso:
         localPath:
         url:
   kubernetesDistributions:
   - type: kubernetes
     version: v1.28.8
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
   - docker.io/kubesphere/pause:3.9
   - docker.io/kubesphere/kube-apiserver:v1.28.8
   - docker.io/kubesphere/kube-controller-manager:v1.28.8
   - docker.io/kubesphere/kube-scheduler:v1.28.8
   - docker.io/kubesphere/kube-proxy:v1.28.8
   - docker.io/coredns/coredns:1.9.3
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
   registry:
     auths: {}
 ```

5. 修改配置文件

KubeKey v3.1.1 生成的 manifests 配置文件适用于 ubuntu 部署纯 Kubernetes 集群，并没有部署 KubeSphere 的镜像。因此，我们需要结合部署 KubeSphere 需要的镜像列表，生成一份完整的 manifests 文件。

6. 下载 KubeSphere 镜像列表

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/images-list.txt
```

完整的镜像一共 **120** 个，受限于篇幅，这里不做展示，请查看下文完整的 manifest 文件。

### 1.3 获取操作系统依赖包

本实验环境使用的操作系统是 x64 的 openEuler 22.03 LTS SP3，需要自己制作安装 Kubernetes 需要的操作系统依赖包镜像 **openEuler-22.03-rpms-amd64.iso**，其他操作系统请读者在 [KubeKey releases 页面](https://github.com/kubesphere/kubekey/releases)下载。

个人建议在离线环境用 openEuler 的安装 ISO，制做一个完整的离线软件源。在利用 KubeKey 安装离线集群时，就不需要考虑操作系统依赖包的问题。

### 1.4 生成 manifest 文件

根据上面的文件及相关信息，生成最终的 manifest 文件 **ksp-v3.4.1-v1.28.8-manifest.yaml**。

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
    id: openEuler
    version: "22.03"
    osImage: openEuler 22.03 (LTS-SP3)
    repository:
      iso:
        localPath: "/data/kubekey/openEuler-22.03-rpms-amd64.iso"
        url:
  kubernetesDistributions:
  - type: kubernetes
    version: v1.28.8
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
    docker-registry:
      version: "2"
    harbor:
      version: v2.5.3
    docker-compose:
      version: v2.2.2
  images:
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.28.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.28.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.28.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.28.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.9.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.22.20
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.27.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.27.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.27.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.27.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/typha:v3.27.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel:v0.21.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel-cni-plugin:v1.1.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/hybridnet:v0.8.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/multus-cni:v3.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.9.6-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node-feature-discovery:v0.10.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.22.0
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
  registry:
    auths: {}
```

> **manifest 修改说明**
>
> - 开启 **harbor** 和 **docker-compose** 配置项，为后面通过 KubeKey 自建 harbor 仓库推送镜像使用。
> - 默认创建的 manifest 模板中的镜像是从 **docker.io** 获取，替换前缀为 **registry.cn-beijing.aliyuncs.com/kubesphereio**
> - operatingSystems 配置删除默认的 ubuntu，新增 openEuler 配置

### 1.5 导出制品 artifact

根据生成的 manifest，执行下面的命令制作制品（artifact）。

```shell
export KKZONE=cn
./kk artifact export -m ksp-v3.4.1-v1.28-manifest.yaml -o ksp-v3.4.1-v1.28-artifact.tar.gz
```

正确执行后，输出结果如下 :（**受限于篇幅，仅展示最终结果**）

```bash
....
06:05:28 CST success: [LocalHost]
06:05:28 CST [ChownOutputModule] Chown output file
06:05:28 CST success: [LocalHost]
06:05:28 CST [ChownWorkerModule] Chown ./kubekey dir
06:05:28 CST success: [LocalHost]
06:05:28 CST Pipeline[ArtifactExportPipeline] execute successfully
```

制品制作完成后，查看制品大小（全镜像，制品包居然达到了 **13G**，生产环境还是有选择的裁剪吧）。

```bash
$ ls -lh ksp-v3.4.1-v1.28-artifact.tar.gz
-rw-r--r-- 1 root root 13G May 20 06:05 ksp-v3.4.1-v1.28-artifact.tar.gz
```

### 1.6 导出 KubeKey 离线安装包

把 KubeKey 工具也制作成压缩包，便于拷贝到离线节点。

```shell
$ tar zcvf kubekey-offline-v3.4.1-v1.28.tar.gz kk kubekey-v3.1.1-linux-amd64.tar.gz
```

## 2. 准备离线部署 KubeSphere 和 Kubernetes 的前置数据

请注意，以下操作无特殊说明时需在离线环境**部署（Registry）节点**上执行。

### 2.1 上传离线部署资源包到部署节点

将以下离线部署资源包，上传至离线环境部署（Registry） 节点的 `/data/` 目录（**可根据实际情况修改**）。

- Kubekey：**kubekey-offline-v3.4.1-v1.28.tar.gz**
- 制品 artifact：**ksp-v3.4.1-v1.28-artifact.tar.gz**

执行以下命令，解压 KubeKey：

```shell
# 创离线资源存放的数据目录
mkdir /data/kubekey
tar xvf /data/kubekey-offline-v3.4.1-v1.28.tar.gz -C /data/kubekey
mv ksp-v3.4.1-v1.28-artifact.tar.gz /data/kubekey
```

### 2.2 创建离线集群配置文件

- 执行以下命令创建离线集群配置文件

```shell
cd /data/kubekey
./kk create config --with-kubesphere v3.4.1 --with-kubernetes v1.28.8 -f ksp-v341-v1228-offline.yaml
```

命令执行成功后，在当前目录会生成文件名为 **ksp-v341-v1228-offline.yaml** 的配置文件。

### 2.3 修改 Cluster 配置

在离线集群配置文件文件中 **kind: Cluster** 小节的作用是部署 Kubernetes 集群。本文示例采用 3 个节点同时作为 control-plane、etcd 节点和 worker 节点。

执行以下命令修改离线集群配置文件 `ksp-v341-v1228-offline.yaml`：

```bash
vi ksp-v341-v1228-offline.yaml
```

修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下。

- hosts：指定节点的 IP、ssh 用户、ssh 密码、ssh 端口。示例演示了 ssh 端口号的配置方法。同时，新增一个 Registry 节点的配置
- roleGroups：指定 3 个 etcd、control-plane 节点，复用相同的机器作为 3 个 worker 节点
- 必须指定主机组 `registry` 作为仓库部署节点（本文为了满足读者的需求使用了 KubeKey 自动部署 Harbor 镜像仓库。当然，也可以使用已有的 Harbor，使用已有 Harbor 时此配置可以不加）
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- system.rpms：**新增配置**，部署时安装 rpm 包（openEuler 系统默认没有安装 tar 包，必须提前安装）
- domain：自定义了一个 **opsxlab.cn**，没特殊需求的场景保留默认值即可
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
  - {name: ksp-master-1, address: 192.168.9.91, internalAddress: 192.168.9.91, port:22, user: root, password: "OpsXlab@2024"}
  - {name: ksp-master-2, address: 192.168.9.92, internalAddress: 192.168.9.92, user: root, password: "OpsXlab@2024"}
  - {name: ksp-master-3, address: 192.168.9.93, internalAddress: 192.168.9.93, user: root, password: "OpsXlab@2024"}
  - {name: ksp-registry, address: 192.168.9.90, internalAddress: 192.168.9.90, user: root, password: "OpsXlab@2024"}
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

    domain: lb.opsxlab.cn
    address: ""
    port: 6443
  system:
    rpms:
      - tar
  kubernetes:
    version: v1.28.8
    clusterName: opsxlab.cn
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
    auths:
      "registry.opsxlab.cn":
        username: admin
        password: Harbor12345
        certsPath: "/etc/docker/certs.d/registry.opsxlab.cn"
    # 设置集群部署时使用的私有仓库
    privateRegistry: "registry.opsxlab.cn"
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

### 2.4 修改 ClusterConfiguration 配置

在离线集群配置文件中 **kind: ClusterConfiguration** 小节的作用是部署 KubeSphere 及相关组件。

本文为了验证离线部署的完整性，启用了除 KubeEdge 、GateKeeper 以外的所有插件。

继续编辑离线集群配置文件 `ksp-v341-v1228-offline.yaml`，修改 **kind: ClusterConfiguration** 部分来启用可插拔组件，具体的修改说明如下。

- 启用 etcd 监控

```yaml
etcd:
    monitoring: true # 将 "false" 更改为 "true"
    endpointIps: localhost
    port: 2379
    tlsEnable: true
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

- 启用 KubeSphere DevOps 系统

```yaml
devops:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 事件系统

```yaml
events:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 日志系统（**v3.4.0 开始默认启用 opensearch**）

```yaml
logging:
  enabled: true # 将 "false" 更改为 "true"
```

- 启用 Metrics Server

```yaml
metrics_server:
  enabled: true # 将 "false" 更改为 "true"
```

> **说明：**KubeSphere 支持用于[部署](https://www.kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/deployments/)的容器组（Pod）弹性伸缩程序 (HPA)。在 KubeSphere 中，Metrics Server 控制着 HPA 是否启用。

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

- 启用应用商店

```yaml
openpitrix:
  store:
    enabled: true # 将 "false" 更改为 "true"
```

- 启用 KubeSphere 服务网格（Istio）

```yaml
servicemesh:
  enabled: true # 将 "false" 更改为 "true"
```

- **修改上面的所有参数后，必须加入一个参数**（ 2.x 版本的 KubeKey 没这个问题，3.x 的到 v3.1.1 为止，都存在这个问题。 不加的话，在部署 KubeSphere 的时候会有命名空间不匹配的问题）

```yaml
spec:
  namespace_override: kubesphereio
  ......
```

经过上述步骤，我们成功完成了对离线集群配置文件 `ksp-v341-v1228-offline.yaml` 的修改。由于篇幅限制，无法在此展示完整的文件内容，请各位读者根据上文提供的配置说明仔细核对。

## 3. 安装配置 Harbor

为了验证 KubeKey 离线部署 Harbor 服务的能力，本文采用 KubeKey 部署镜像仓库 Harbor。**生产环境建议提前自建**。

请注意，以下操作如无特殊说明，均在离线环境**部署（Registry）节点**上执行。

### 3.1 安装 Harbor

执行以下命令安装镜像仓库 Harbor：

```bash
./kk init registry -f ksp-v341-v1228-offline.yaml -a ksp-v3.4.1-v1.28-artifact.tar.gz
```

- 查看安装镜像

```bash
$ docker images
REPOSITORY                      TAG       IMAGE ID       CREATED        SIZE
goharbor/harbor-exporter        v2.10.1   3b6d345aa4e6   2 months ago   106MB
goharbor/redis-photon           v2.10.1   9a994e1173fc   2 months ago   164MB
goharbor/trivy-adapter-photon   v2.10.1   108e2a78abf7   2 months ago   502MB
goharbor/harbor-registryctl     v2.10.1   da66353bc245   2 months ago   149MB
goharbor/registry-photon        v2.10.1   4cb6a644ceeb   2 months ago   83.5MB
goharbor/nginx-photon           v2.10.1   180accc8c6be   2 months ago   153MB
goharbor/harbor-log             v2.10.1   2215e7f0f2e7   2 months ago   163MB
goharbor/harbor-jobservice      v2.10.1   ab688ea50ad8   2 months ago   140MB
goharbor/harbor-core            v2.10.1   de73267578a3   2 months ago   169MB
goharbor/harbor-portal          v2.10.1   c75282ddf5df   2 months ago   162MB
goharbor/harbor-db              v2.10.1   db2ff40c7b27   2 months ago   269MB
goharbor/prepare                v2.10.1   92197f61701a   2 months ago   207MB
```

- 查看 Harbor 服务状态

```bash
$ cd /opt/harbor/
$ docker-compose ps -a
WARN[0000] /opt/harbor/docker-compose.yml: `version` is obsolete
NAME                IMAGE                                   COMMAND                  SERVICE         CREATED         STATUS                   PORTS
harbor-core         goharbor/harbor-core:v2.10.1            "/harbor/entrypoint.…"   core            4 minutes ago   Up 4 minutes (healthy)
harbor-db           goharbor/harbor-db:v2.10.1              "/docker-entrypoint.…"   postgresql      4 minutes ago   Up 4 minutes (healthy)
harbor-jobservice   goharbor/harbor-jobservice:v2.10.1      "/harbor/entrypoint.…"   jobservice      4 minutes ago   Up 4 minutes (healthy)
harbor-log          goharbor/harbor-log:v2.10.1             "/bin/sh -c /usr/loc…"   log             4 minutes ago   Up 4 minutes (healthy)   127.0.0.1:1514->10514/tcp
harbor-portal       goharbor/harbor-portal:v2.10.1          "nginx -g 'daemon of…"   portal          4 minutes ago   Up 4 minutes (healthy)
nginx               goharbor/nginx-photon:v2.10.1           "nginx -g 'daemon of…"   proxy           4 minutes ago   Up 4 minutes (healthy)   0.0.0.0:80->8080/tcp, :::80->8080/tcp, 0.0.0.0:443->8443/tcp, :::443->8443/tcp
redis               goharbor/redis-photon:v2.10.1           "redis-server /etc/r…"   redis           4 minutes ago   Up 4 minutes (healthy)
registry            goharbor/registry-photon:v2.10.1        "/home/harbor/entryp…"   registry        4 minutes ago   Up 4 minutes (healthy)
registryctl         goharbor/harbor-registryctl:v2.10.1     "/home/harbor/start.…"   registryctl     4 minutes ago   Up 4 minutes (healthy)
trivy-adapter       goharbor/trivy-adapter-photon:v2.10.1   "/home/scanner/entry…"   trivy-adapter   4 minutes ago   Up 4 minutes (healthy)
```

- 查看 hosts（**确保使用了自定义域名**）

```bash
$ cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

# kubekey hosts BEGIN
192.168.9.90  ksp-registry.opsxlab.cn ksp-registry
192.168.9.91  ksp-master-1.opsxlab.cn ksp-master-1
192.168.9.92  ksp-master-2.opsxlab.cn ksp-master-2
192.168.9.93  ksp-master-3.opsxlab.cn ksp-master-3
192.168.9.90  registry.opsxlab.cn
192.168.9.91  lb.opsxlab.cn
# kubekey hosts END
```

- 查看 Harbor 配置的域名（**确保使用了自定义域名**）

```bash
$ cat /opt/harbor/harbor.yml | grep hostname:
hostname: registry.opsxlab.cn
```

- 查看 Docker 是否配置了私有证书（**确保使用了自定义域名及证书**）

```bash
$ ll /etc/docker/certs.d/registry.opsxlab.cn/
total 12
-rw-r--r--. 1 root root 1103 May 20 6:01 ca.crt
-rw-r--r--. 1 root root 1253 May 20 6:01 registry.opsxlab.cn.cert
-rw-------. 1 root root 1679 May 20 6:01 registry.opsxlab.cn.key
```

### 3.2 在 Harbor 中创建项目

使用 KubeKey 安装的 Harbor 默认信息如下：

- 登陆账户信息：管理员账号：**admin**，密码：**Harbor12345**（生产环境必须修改）。

使用 Shell 脚本创建项目，`vim create_project_harbor.sh`。

```shell
#!/usr/bin/env bash

# Harbor 仓库地址（写域名，默认配置为 https://dockerhub.kubekey.local）
url="https://registry.opsxlab.cn"

# 访问 Harbor 仓库的默认用户和密码（生产环境建议修改）
user="admin"
passwd="Harbor12345"

# 需要创建的项目名列表，按我们制作的离线包的镜像命名规则，实际上只需要创建一个 kubesphereio 即可，这里保留了所有可用值，各位可根据自己的离线仓库镜像名称规则修改。
harbor_projects=(kubesphereio)

for project in "${harbor_projects[@]}"; do
    echo "creating $project"
    curl -k -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}"
done
```

- 执行脚本创建项目

```shell
sh create_project_harbor.sh
```

### 3.3 推送离线镜像到 Harbor 仓库

将提前准备好的离线镜像推送到 Harbor 仓库，这一步为**可选项**，因为创建集群的时候默认会推送镜像（本文使用参数忽略了）。为了部署成功率，建议先推送。

- 推送离线镜像

```shell
./kk artifact image push -f ksp-v341-v1228-offline.yaml -a ksp-v3.4.1-v1.28-artifact.tar.gz
```

- 正确的安装结果如下（**受限于篇幅，内容有删减**）：

```bash
......
7:32:04 CST success: [LocalHost]
7:32:04 CST [ChownWorkerModule] Chown ./kubekey dir
7:32:04 CST success: [LocalHost]
7:32:04 CST Pipeline[ArtifactImagesPushPipeline] execute successfully
```

- Harbor 管理页面查看项目和镜像仓库（**提前在自己电脑上做好域名解析配置**）

![ksp-offline-harbor-v210-projects](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-offline-harbor-v210-projects.png)

从项目管理页面可以看到一共创建了 **124** 个镜像仓库。

## 4. 安装 KubeSphere 和 Kubernetes 集群

请注意，以下操作如无特殊说明，均在离线环境**部署（Registry）节点**上执行。

### 4.1 安装 KubeSphere 和 Kubernetes 集群

执行以下命令，安装 KubeSphere 和 Kubernetes 集群。

```bash
./kk create cluster -f ksp-v341-v1228-offline.yaml -a ksp-v3.4.1-v1.28-artifact.tar.gz --with-packages --skip-push-images
```

> **参数说明**
>
> - **--with-packages**：安装操作系统依赖
> - **--skip-push-images：** 忽略推送镜像，前面已经完成了推送镜像到私有仓库的任务

**特殊说明：** 

- 由于本文在安装的过程中启用了日志插件，因此在安装的过程中必须按照 「**问题 2**」的描述**手工介入处理**，**否则安装会失败**。

- 当出现熟悉的安装滚动条  **>>--->** 后，可以另开一个终端 使用命令 `kubectl get pod -A ` 或是 `kubectl get pod -A | grep -v Running` 观察进度，如出现异常可及时介入处理。
- 也可以通过下面的命令查看详细的部署过程日志及报错信息。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

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
https://kubesphere.io             2024-05-19 14:49:40
#####################################################
14:49:42 CST skipped: [ksp-master-3]
14:49:42 CST skipped: [ksp-master-2]
14:49:42 CST success: [ksp-master-1]
14:49:42 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

### 4.2  部署结果验证

登录 Web 控制台通过 `http://{IP}:30880` 使用默认帐户和密码 `admin/P@88w0rd` 访问 KubeSphere 的 Web 控制台，简单的验证一下部署结果。

- 查看集群节点状态

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-v128-offline-clusters-nodes.png)

- 查看系统组件状态

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-v128-offline-clusters-components.png)

- 查看系统监控状态

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-v128-offline-monitor-cluster-overview.png)

## 5. 常见问题

### 5.1 问题 1

- 问题现象

```bash
Events:
  Type     Reason     Age                   From               Message
  ----     ------     ----                  ----               -------
  Normal   Scheduled  18m                   default-scheduler  Successfully assigned kube-system/metrics-server-5d65c798b8-m9tbj to ksp-master-3
  Normal   Pulling    16m (x4 over 18m)     kubelet            Pulling image "registry.opsxlab.cn/kubesphere/metrics-server:v0.4.2"
  Warning  Failed     16m (x4 over 18m)     kubelet            Failed to pull image "registry.opsxlab.cn/kubesphere/metrics-server:v0.4.2": rpc error: code = NotFound desc = failed to pull and unpack image "registry.opsxlab.cn/kubesphere/metrics-server:v0.4.2": failed to resolve reference "registry.opsxlab.cn/kubesphere/metrics-server:v0.4.2": registry.opsxlab.cn/kubesphere/metrics-server:v0.4.2: not found
  Warning  Failed     16m (x4 over 18m)     kubelet            Error: ErrImagePull
  Warning  Failed     16m (x6 over 17m)     kubelet            Error: ImagePullBackOff
  Normal   BackOff    2m57s (x64 over 17m)  kubelet            Back-off pulling image "registry.opsxlab.cn/kubesphere/metrics-server:v0.4.2"
```

- 解决方案

在离线集群配置文件 **kind: ClusterConfiguration** 小节的 `spec` 部分加入参数 `namespace_override: kubesphereio`

### 5.2 问题 2

- 问题现象

```bash
# kubectl describe pod opensearch-cluster-data-0 -n kubesphere-logging-system
Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
  Normal   Scheduled  3m                   default-scheduler  Successfully assigned kubesphere-logging-system/opensearch-cluster-data-0 to ksp-master-2
  Warning  Failed     2m17s                kubelet            Failed to pull image "busybox:latest": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/busybox:latest": failed to resolve reference "docker.io/library/busybox:latest": failed to do request: Head "https://registry-1.docker.io/v2/library/busybox/manifests/latest": dial tcp: lookup registry-1.docker.io on 114.114.114.114:53: read udp 192.168.9.92:49491->114.114.114.114:53: i/o timeout
  Warning  Failed     85s                  kubelet            Failed to pull image "busybox:latest": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/busybox:latest": failed to resolve reference "docker.io/library/busybox:latest": failed to do request: Head "https://registry-1.docker.io/v2/library/busybox/manifests/latest": dial tcp: lookup registry-1.docker.io on 114.114.114.114:53: read udp 192.168.9.92:57815->114.114.114.114:53: i/o timeout
  Normal   Pulling    56s (x3 over 2m57s)  kubelet            Pulling image "busybox:latest"
  Warning  Failed     15s (x3 over 2m17s)  kubelet            Error: ErrImagePull
  Warning  Failed     15s                  kubelet            Failed to pull image "busybox:latest": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/busybox:latest": failed to resolve reference "docker.io/library/busybox:latest": failed to do request: Head "https://registry-1.docker.io/v2/library/busybox/manifests/latest": dial tcp: lookup registry-1.docker.io on 114.114.114.114:53: read udp 192.168.9.92:37639->114.114.114.114:53: i/o timeout
  Normal   BackOff    0s (x3 over 2m16s)   kubelet            Back-off pulling image "busybox:latest"
  Warning  Failed     0s (x3 over 2m16s)   kubelet            Error: ImagePullBackOff
```

- 解决方案

官方配置写死了 busybox 的地址，暂时需要手动修改。

```bash
# 查看 sts
$ kubectl get sts -n kubesphere-logging-system
NAME                        READY   AGE
opensearch-cluster-data     0/2     7m42s
opensearch-cluster-master   0/1     7m40s

# 修改 sts 使用的 busyboy 镜像为本地镜像（细节不展示）
kubectl edit sts opensearch-cluster-data -n kubesphere-logging-system
kubectl edit sts opensearch-cluster-master -n kubesphere-logging-system

# 本文修改后 image 内容（自己根据实际情况修改域名前缀）
registry.opsxlab.cn/kubesphereio/busybox:1.31.1
```

本文虽然基于操作系统 **openEuler 22.03 LTS SP3**，但对于 CentOS、Ubuntu 等其他操作系统同样具有借鉴意义。

> **免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！